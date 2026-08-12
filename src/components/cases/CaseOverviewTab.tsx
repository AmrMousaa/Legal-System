import { Button, Text, makeStyles, tokens } from '@fluentui/react-components';
import { EditRegular } from '@fluentui/react-icons';
import { LockedField } from '../common/FormFields';
import { palette, radius } from '../../theme';
import { useT } from '../../i18n';
import type { CaseRecord } from '../../types/domain';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  value: {
    fontSize: '14px',
    color: palette.textPrimary,
  },
  descBlock: {
    backgroundColor: palette.brass[50],
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: radius.md,
    padding: '12px 14px',
    fontSize: '13px',
    color: palette.textPrimary,
    whiteSpace: 'pre-wrap',
  },
});

function ReadField({ label, value }: { label: string; value: string }) {
  const styles = useStyles();
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || '—'}</span>
    </div>
  );
}

export function CaseOverviewTab({ record, onEdit }: { record: CaseRecord; onEdit: () => void }) {
  const styles = useStyles();
  const t = useT();
  return (
    <div className={`${styles.wrap} diwan-page-enter`}>
      <div className={styles.header}>
        <Text weight="semibold">{t('case_details')}</Text>
        <Button size="small" appearance="secondary" icon={<EditRegular />} onClick={onEdit}>
          {t('edit_case')}
        </Button>
      </div>

      <div className={styles.grid}>
        <ReadField label={t('field_claimant')} value={record.claimant} />
        <ReadField label={t('field_defendant')} value={record.defendant} />
        <ReadField label={t('field_case_type')} value={record.caseTypeLabel ?? ''} />
        <ReadField label={t('field_responsible')} value={record.responsibleName} />
        <ReadField label={t('field_second_responsible')} value={record.secondResponsibleName ?? ''} />
        <LockedField label={t('field_current_stage')} hint={t('field_current_stage_hint')} value={record.currentStageLabel} />
      </div>

      <LockedField label={t('field_link')} hint={t('field_link_hint')} value={record.link} />

      <div className={styles.field}>
        <span className={styles.label}>{t('field_description')}</span>
        <div className={styles.descBlock}>{record.description || t('no_description')}</div>
      </div>
    </div>
  );
}
