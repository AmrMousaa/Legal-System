import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Spinner,
} from '@fluentui/react-components';
import { PersonRegular, GavelRegular, PeopleTeamRegular, NotepadRegular, ScalesRegular } from '@fluentui/react-icons';
import { TextField, TextAreaField, ChoiceField, UserPickerField } from '../common/FormFields';
import { DialogHeader, FormSection, useFormDialogStyles } from '../common/FormDialog';
import { CASE_TYPE_OPTIONS } from '../../types/choices';
import { useUsers } from '../../hooks/useUsers';
import { Crb32_casesesService } from '../../generated/services/Crb32_casesesService';
import { buildCaseCreatePayload, buildCaseLinkPayload, buildCaseUpdatePayload } from '../../types/mappers';
import { shadow } from '../../theme';
import { useT } from '../../i18n';
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
  const t = useT();
  const dialogStyles = useFormDialogStyles();
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
    if (!values.claimant.trim()) next.claimant = t('required_claimant');
    if (!values.defendant.trim()) next.defendant = t('required_defendant');
    if (!values.responsibleId) next.responsibleId = t('required_responsible');
    if (values.caseType === undefined) next.caseType = t('required_case_type');
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
        if (!result.success) throw new Error(result.error?.message ?? t('error_generic'));
        onSaved(editing.id);
      } else {
        const created = await Crb32_casesesService.create(buildCaseCreatePayload(values));
        if (!created.success) throw new Error(created.error?.message ?? t('error_generic'));
        const newId = created.data.crb32_casesid;
        // Auto-generate the locked Link field once the record (and its id) exists.
        const linkResult = await Crb32_casesesService.update(newId, buildCaseLinkPayload(newId, window.location.origin));
        if (!linkResult.success) throw new Error(linkResult.error?.message ?? t('error_generic'));
        onSaved(newId);
      }
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('error_generic'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface className={dialogStyles.surface}>
        <DialogBody>
          <DialogHeader
            icon={<ScalesRegular fontSize={22} />}
            title={editing ? t('edit_case_title') : t('new_case_title')}
            subtitle={editing ? t('edit_case_subtitle') : t('new_case_subtitle')}
          />
          <DialogContent className={dialogStyles.content}>
            <FormSection icon={<PeopleTeamRegular fontSize={15} />} title={t('section_parties')}>
              <div className={dialogStyles.grid2}>
                <TextField
                  label={t('field_claimant')}
                  required
                  value={values.claimant}
                  onChange={(v) => setValues((s) => ({ ...s, claimant: v }))}
                  error={errors.claimant}
                />
                <TextField
                  label={t('field_defendant')}
                  required
                  value={values.defendant}
                  onChange={(v) => setValues((s) => ({ ...s, defendant: v }))}
                  error={errors.defendant}
                />
              </div>
            </FormSection>

            <FormSection icon={<GavelRegular fontSize={15} />} title={t('section_classification')}>
              <ChoiceField
                label={t('field_case_type')}
                required
                value={values.caseType}
                onChange={(v) => setValues((s) => ({ ...s, caseType: v }))}
                options={CASE_TYPE_OPTIONS}
                error={errors.caseType}
              />
            </FormSection>

            <FormSection icon={<PersonRegular fontSize={15} />} title={t('section_assignment')}>
              <div className={dialogStyles.grid2}>
                <UserPickerField
                  label={t('field_responsible')}
                  required
                  value={values.responsibleId}
                  onChange={(v) => setValues((s) => ({ ...s, responsibleId: v }))}
                  users={users}
                  error={errors.responsibleId}
                />
                <UserPickerField
                  label={t('field_second_responsible')}
                  value={values.secondResponsibleId}
                  onChange={(v) => setValues((s) => ({ ...s, secondResponsibleId: v }))}
                  users={users}
                />
              </div>
            </FormSection>

            <FormSection icon={<NotepadRegular fontSize={15} />} title={t('section_details')}>
              <TextAreaField
                label={t('field_description')}
                value={values.description}
                onChange={(v) => setValues((s) => ({ ...s, description: v }))}
              />
            </FormSection>

            {submitError && <span className={dialogStyles.errorBanner}>{submitError}</span>}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              disabled={saving}
              icon={saving ? <Spinner size="tiny" /> : undefined}
              style={{ boxShadow: shadow.brassGlow }}
            >
              {editing ? t('save_changes') : t('create_case')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
