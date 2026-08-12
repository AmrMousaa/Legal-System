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
import { DocumentBulletListRegular, CalendarRegular, NotepadRegular, AttachRegular } from '@fluentui/react-icons';
import { TextAreaField, ChoiceField, DateField, StagePickerField, LockedField } from '../common/FormFields';
import { DialogHeader, FormSection, useFormDialogStyles } from '../common/FormDialog';
import { UPDATE_TYPE_OPTIONS, STAGE_NAME_OPTIONS, labelForOption } from '../../types/choices';
import { Crb32_updatesesService } from '../../generated/services/Crb32_updatesesService';
import { buildUpdateCreatePayload } from '../../types/mappers';
import { shadow } from '../../theme';
import { useT } from '../../i18n';
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
  const t = useT();
  const dialogStyles = useFormDialogStyles();
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
    if (!values.stageId) next.stageId = t('required_stage');
    if (values.updateType === undefined) next.updateType = t('required_update_type');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    setSubmitError(undefined);
    try {
      const created = await Crb32_updatesesService.create(buildUpdateCreatePayload(caseId, values));
      if (!created.success) throw new Error(created.error?.message ?? t('error_generic'));
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
            icon={<DocumentBulletListRegular fontSize={22} />}
            title={t('new_update_title')}
            subtitle={t('new_update_subtitle')}
          />
          <DialogContent className={dialogStyles.content}>
            {stages.length === 0 ? (
              <span className={dialogStyles.errorBanner}>{t('add_stage_first')}</span>
            ) : (
              <>
                <FormSection icon={<DocumentBulletListRegular fontSize={15} />} title={t('section_classification')}>
                  <StagePickerField
                    label={t('field_stage')}
                    required
                    value={values.stageId}
                    onChange={(v) => setValues((s) => ({ ...s, stageId: v }))}
                    stages={stageOptions}
                    error={errors.stageId}
                  />
                  <ChoiceField
                    label={t('field_update_type')}
                    required
                    value={values.updateType}
                    onChange={(v) => setValues((s) => ({ ...s, updateType: v }))}
                    options={UPDATE_TYPE_OPTIONS}
                    error={errors.updateType}
                  />
                </FormSection>

                <FormSection icon={<CalendarRegular fontSize={15} />} title={t('section_timing')}>
                  <div className={dialogStyles.grid2}>
                    <DateField label={t('field_date')} value={values.date} onChange={(v) => setValues((s) => ({ ...s, date: v }))} />
                    <LockedField
                      label={t('field_current_date')}
                      hint={t('field_current_date_hint')}
                      value={new Date().toLocaleString('en-GB')}
                    />
                  </div>
                </FormSection>

                <FormSection icon={<AttachRegular fontSize={15} />} title={t('field_documents_provided')}>
                  <TextAreaField
                    label={t('field_documents_provided')}
                    value={values.documentsProvided}
                    onChange={(v) => setValues((s) => ({ ...s, documentsProvided: v }))}
                    rows={2}
                  />
                </FormSection>

                <FormSection icon={<NotepadRegular fontSize={15} />} title={t('section_details')}>
                  <TextAreaField
                    label={t('field_description')}
                    value={values.description}
                    onChange={(v) => setValues((s) => ({ ...s, description: v }))}
                  />
                </FormSection>
              </>
            )}
            {submitError && <span className={dialogStyles.errorBanner}>{submitError}</span>}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              disabled={saving || stages.length === 0}
              icon={saving ? <Spinner size="tiny" /> : undefined}
              style={{ boxShadow: shadow.brassGlow }}
            >
              {t('add_update')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
