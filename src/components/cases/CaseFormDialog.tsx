import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Spinner,
} from '@fluentui/react-components';
import { TextField, TextAreaField, ChoiceField, UserPickerField } from '../common/FormFields';
import { DialogAccentBar } from '../common/DialogAccentBar';
import { CASE_TYPE_OPTIONS } from '../../types/choices';
import { useUsers } from '../../hooks/useUsers';
import { Crb32_casesesService } from '../../generated/services/Crb32_casesesService';
import { buildCaseCreatePayload, buildCaseLinkPayload, buildCaseUpdatePayload } from '../../types/mappers';
import type { CaseFormValues, CaseRecord } from '../../types/domain';

interface CaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (caseId: string) => void;
  editing?: CaseRecord;
}

const emptyValues: CaseFormValues = {
  claimant: '',
  defendant: '',
  responsibleId: undefined,
  secondResponsibleId: undefined,
  caseType: undefined,
  description: '',
};

export function CaseFormDialog({ open, onOpenChange, onSaved, editing }: CaseFormDialogProps) {
  const { users } = useUsers();
  const [values, setValues] = useState<CaseFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CaseFormValues, string>>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  // Reset the form whenever the dialog transitions to open (React's
  // "adjust state while rendering" pattern — avoids an effect round-trip).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(
        editing
          ? {
              claimant: editing.claimant,
              defendant: editing.defendant,
              responsibleId: editing.responsibleId,
              secondResponsibleId: editing.secondResponsibleId,
              caseType: editing.caseType,
              description: editing.description ?? '',
            }
          : emptyValues
      );
      setErrors({});
      setSubmitError(undefined);
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof CaseFormValues, string>> = {};
    if (!values.claimant.trim()) next.claimant = 'Claimant is required.';
    if (!values.defendant.trim()) next.defendant = 'Defendant is required.';
    if (!values.responsibleId) next.responsibleId = 'Responsible is required.';
    if (values.caseType === undefined) next.caseType = 'Case type is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(undefined);
    try {
      if (editing) {
        const result = await Crb32_casesesService.update(editing.id, buildCaseUpdatePayload(values));
        if (!result.success) throw new Error(result.error?.message ?? 'Failed to update case.');
        onSaved(editing.id);
      } else {
        const created = await Crb32_casesesService.create(buildCaseCreatePayload(values));
        if (!created.success) throw new Error(created.error?.message ?? 'Failed to create case.');
        const newId = created.data.crb32_casesid;
        // Auto-generate the locked Link field once the record (and its id) exists.
        const linkResult = await Crb32_casesesService.update(newId, buildCaseLinkPayload(newId, window.location.origin));
        if (!linkResult.success) throw new Error(linkResult.error?.message ?? 'Case created, but failed to set link.');
        onSaved(newId);
      }
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogAccentBar />
        <DialogBody>
          <DialogTitle>{editing ? 'Edit case' : 'New case'}</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <TextField
                label="Claimant"
                required
                value={values.claimant}
                onChange={(v) => setValues((s) => ({ ...s, claimant: v }))}
                error={errors.claimant}
              />
              <TextField
                label="Defendant"
                required
                value={values.defendant}
                onChange={(v) => setValues((s) => ({ ...s, defendant: v }))}
                error={errors.defendant}
              />
            </div>
            <ChoiceField
              label="Case type"
              required
              value={values.caseType}
              onChange={(v) => setValues((s) => ({ ...s, caseType: v }))}
              options={CASE_TYPE_OPTIONS}
              error={errors.caseType}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <UserPickerField
                label="Responsible"
                required
                value={values.responsibleId}
                onChange={(v) => setValues((s) => ({ ...s, responsibleId: v }))}
                users={users}
                error={errors.responsibleId}
              />
              <UserPickerField
                label="Second responsible"
                value={values.secondResponsibleId}
                onChange={(v) => setValues((s) => ({ ...s, secondResponsibleId: v }))}
                users={users}
              />
            </div>
            <TextAreaField
              label="Description"
              value={values.description}
              onChange={(v) => setValues((s) => ({ ...s, description: v }))}
            />
            {submitError && <span style={{ color: '#FB3748', fontSize: '13px' }}>{submitError}</span>}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSubmit} disabled={saving} icon={saving ? <Spinner size="tiny" /> : undefined}>
              {editing ? 'Save changes' : 'Create case'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
