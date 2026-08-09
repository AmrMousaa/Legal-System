import { Button, Text, makeStyles, tokens } from '@fluentui/react-components';
import { EditRegular } from '@fluentui/react-icons';
import { LockedField } from '../common/FormFields';
import { palette } from '../../theme';
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
    backgroundColor: palette.gold[50],
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: tokens.borderRadiusMedium,
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
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Text weight="semibold">Case details</Text>
        <Button size="small" appearance="secondary" icon={<EditRegular />} onClick={onEdit}>
          Edit case
        </Button>
      </div>

      <div className={styles.grid}>
        <ReadField label="Claimant" value={record.claimant} />
        <ReadField label="Defendant" value={record.defendant} />
        <ReadField label="Case type" value={record.caseTypeLabel ?? ''} />
        <ReadField label="Responsible" value={record.responsibleName} />
        <ReadField label="Second responsible" value={record.secondResponsibleName ?? ''} />
        <LockedField label="Current stage" hint="Auto-set from the most recently added stage." value={record.currentStageLabel} />
      </div>

      <LockedField label="Link" hint="Generated automatically when the case was created." value={record.link} />

      <div className={styles.field}>
        <span className={styles.label}>Description</span>
        <div className={styles.descBlock}>{record.description || 'No description provided.'}</div>
      </div>
    </div>
  );
}
