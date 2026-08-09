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
import { TextField, TextAreaField, ChoiceField, NumberField } from '../common/FormFields';
import { DialogAccentBar } from '../common/DialogAccentBar';
import { STAGE_NAME_OPTIONS } from '../../types/choices';
import { Crb32_stagesesService } from '../../generated/services/Crb32_stagesesService';
import { Crb32_casesesService } from '../../generated/services/Crb32_casesesService';
import { buildStageCreatePayload, buildCaseCurrentStagePayload } from '../../types/mappers';
import { invalidateStageDirectory } from '../../hooks/stageDirectory';
import type { StageFormValues } from '../../types/domain';

interface StageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  onSaved: () => void;
}

const emptyValues: StageFormValues = {
  number: undefined,
  stageYear: new Date().getFullYear(),
  claimantName: '',
  defendantName: '',
  jungleDistrict: undefined,
  stageName: undefined,
  description: '',
};

export function StageFormDialog({ open, onOpenChange, caseId, onSaved }: StageFormDialogProps) {
  const [values, setValues] = useState<StageFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof StageFormValues, string>>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(emptyValues);
      setErrors({});
      setSubmitError(undefined);
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof StageFormValues, string>> = {};
    if (values.stageName === undefined) next.stageName = 'Stage name is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(undefined);
    try {
      const created = await Crb32_stagesesService.create(buildStageCreatePayload(caseId, values));
      if (!created.success) throw new Error(created.error?.message ?? 'Failed to create stage.');
      const newStageId = created.data.crb32_stagesid;
      invalidateStageDirectory();
      // The new stage becomes the case's locked "Current Stage".
      const caseUpdate = await Crb32_casesesService.update(caseId, buildCaseCurrentStagePayload(newStageId));
      if (!caseUpdate.success) throw new Error(caseUpdate.error?.message ?? 'Stage created, but failed to update current stage.');
      onSaved();
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
          <DialogTitle>New stage</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '4px' }}>
            <ChoiceField
              label="Stage name"
              required
              value={values.stageName}
              onChange={(v) => setValues((s) => ({ ...s, stageName: v }))}
              options={STAGE_NAME_OPTIONS}
              error={errors.stageName}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <NumberField
                label="Number"
                value={values.number}
                onChange={(v) => setValues((s) => ({ ...s, number: v }))}
              />
              <NumberField
                label="Stage year"
                value={values.stageYear}
                onChange={(v) => setValues((s) => ({ ...s, stageYear: v }))}
              />
              <NumberField
                label="Jungle district"
                value={values.jungleDistrict}
                onChange={(v) => setValues((s) => ({ ...s, jungleDistrict: v }))}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <TextField
                label="Claimant name"
                value={values.claimantName}
                onChange={(v) => setValues((s) => ({ ...s, claimantName: v }))}
              />
              <TextField
                label="Defendant name"
                value={values.defendantName}
                onChange={(v) => setValues((s) => ({ ...s, defendantName: v }))}
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
              Add stage
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
