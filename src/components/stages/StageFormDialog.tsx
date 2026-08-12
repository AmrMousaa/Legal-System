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
import { DocumentBulletListRegular, PeopleTeamRegular, NotepadRegular, FlagRegular } from '@fluentui/react-icons';
import { TextField, TextAreaField, ChoiceField, NumberField } from '../common/FormFields';
import { DialogHeader, FormSection, useFormDialogStyles } from '../common/FormDialog';
import { STAGE_NAME_OPTIONS } from '../../types/choices';
import { Crb32_stagesesService } from '../../generated/services/Crb32_stagesesService';
import { Crb32_casesesService } from '../../generated/services/Crb32_casesesService';
import { buildStageCreatePayload, buildCaseCurrentStagePayload } from '../../types/mappers';
import { invalidateStageDirectory } from '../../hooks/stageDirectory';
import { shadow } from '../../theme';
import { useT } from '../../i18n';
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
  const t = useT();
  const dialogStyles = useFormDialogStyles();
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
    if (values.stageName === undefined) next.stageName = t('required_stage_name');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(undefined);
    try {
      const created = await Crb32_stagesesService.create(buildStageCreatePayload(caseId, values));
      if (!created.success) throw new Error(created.error?.message ?? t('error_generic'));
      const newStageId = created.data.crb32_stagesid;
      invalidateStageDirectory();
      // The new stage becomes the case's locked "Current Stage".
      const caseUpdate = await Crb32_casesesService.update(caseId, buildCaseCurrentStagePayload(newStageId));
      if (!caseUpdate.success) throw new Error(caseUpdate.error?.message ?? t('error_generic'));
      onSaved();
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
            icon={<FlagRegular fontSize={22} />}
            title={t('new_stage_title')}
            subtitle={t('new_stage_subtitle')}
          />
          <DialogContent className={dialogStyles.content}>
            <FormSection icon={<DocumentBulletListRegular fontSize={15} />} title={t('section_classification')}>
              <ChoiceField
                label={t('field_stage_name')}
                required
                value={values.stageName}
                onChange={(v) => setValues((s) => ({ ...s, stageName: v }))}
                options={STAGE_NAME_OPTIONS}
                error={errors.stageName}
              />
              <div className={dialogStyles.grid3}>
                <NumberField
                  label={t('field_number')}
                  value={values.number}
                  onChange={(v) => setValues((s) => ({ ...s, number: v }))}
                />
                <NumberField
                  label={t('field_stage_year')}
                  value={values.stageYear}
                  onChange={(v) => setValues((s) => ({ ...s, stageYear: v }))}
                />
                <NumberField
                  label={t('field_jungle_district')}
                  value={values.jungleDistrict}
                  onChange={(v) => setValues((s) => ({ ...s, jungleDistrict: v }))}
                />
              </div>
            </FormSection>

            <FormSection icon={<PeopleTeamRegular fontSize={15} />} title={t('section_parties')}>
              <div className={dialogStyles.grid2}>
                <TextField
                  label={t('field_claimant_name')}
                  value={values.claimantName}
                  onChange={(v) => setValues((s) => ({ ...s, claimantName: v }))}
                />
                <TextField
                  label={t('field_defendant_name')}
                  value={values.defendantName}
                  onChange={(v) => setValues((s) => ({ ...s, defendantName: v }))}
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
              {t('add_stage')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
