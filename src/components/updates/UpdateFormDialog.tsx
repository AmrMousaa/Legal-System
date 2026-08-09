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
import { TextAreaField, ChoiceField, DateField, StagePickerField, LockedField } from '../common/FormFields';
import { DialogAccentBar } from '../common/DialogAccentBar';
import { UPDATE_TYPE_OPTIONS, STAGE_NAME_OPTIONS, labelForOption } from '../../types/choices';
import { Crb32_updatesesService } from '../../generated/services/Crb32_updatesesService';
import { buildUpdateCreatePayload } from '../../types/mappers';
import type { StageRecord, UpdateFormValues } from '../../types/domain';

interface UpdateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  stages: StageRecord[];
  defaultStageId?: string;
  onSaved: () => void;
}

const emptyValues: UpdateFormValues = {
  stageId: undefined,
  updateType: undefined,
  date: new Date().toISOString().slice(0, 10),
  documentsProvided: '',
  description: '',
};

export function UpdateFormDialog({ open, onOpenChange, caseId, stages, defaultStageId, onSaved }: UpdateFormDialogProps) {
  const [values, setValues] = useState<UpdateFormValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateFormValues, string>>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues({ ...emptyValues, stageId: defaultStageId });
      setErrors({});
      setSubmitError(undefined);
    }
  }

  const stageOptions = stages.map((s) => ({
    id: s.id,
    label: `${s.stageNameLabel || labelForOption(STAGE_NAME_OPTIONS, s.stageName) || 'Stage'}${s.number ? ` #${s.number}` : ''}${s.stageYear ? ` (${s.stageYear})` : ''}`,
  }));

  function validate(): boolean {
    const next: Partial<Record<keyof UpdateFormValues, string>> = {};
    if (!values.stageId) next.stageId = 'Stage is required.';
    if (values.updateType === undefined) next.updateType = 'Update type is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(undefined);
    try {
      const created = await Crb32_updatesesService.create(buildUpdateCreatePayload(caseId, values));
      if (!created.success) throw new Error(created.error?.message ?? 'Failed to create update.');
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
          <DialogTitle>New update</DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '4px' }}>
            {stages.length === 0 ? (
              <span style={{ color: '#FB3748', fontSize: '13px' }}>
                Add a stage to this case before recording updates.
              </span>
            ) : (
              <>
                <StagePickerField
                  label="Stage"
                  required
                  value={values.stageId}
                  onChange={(v) => setValues((s) => ({ ...s, stageId: v }))}
                  stages={stageOptions}
                  error={errors.stageId}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <ChoiceField
                    label="Update type"
                    required
                    value={values.updateType}
                    onChange={(v) => setValues((s) => ({ ...s, updateType: v }))}
                    options={UPDATE_TYPE_OPTIONS}
                    error={errors.updateType}
                  />
                  <DateField
                    label="Date"
                    value={values.date}
                    onChange={(v) => setValues((s) => ({ ...s, date: v }))}
                  />
                </div>
                <LockedField label="Current date" hint="Set automatically when the update is created." value={new Date().toLocaleString()} />
                <TextAreaField
                  label="Documents provided"
                  value={values.documentsProvided}
                  onChange={(v) => setValues((s) => ({ ...s, documentsProvided: v }))}
                  rows={2}
                />
                <TextAreaField
                  label="Description"
                  value={values.description}
                  onChange={(v) => setValues((s) => ({ ...s, description: v }))}
                />
              </>
            )}
            {submitError && <span style={{ color: '#FB3748', fontSize: '13px' }}>{submitError}</span>}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              disabled={saving || stages.length === 0}
              icon={saving ? <Spinner size="tiny" /> : undefined}
            >
              Add update
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
