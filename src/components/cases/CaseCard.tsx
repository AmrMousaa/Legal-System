import { makeStyles, Text, Avatar } from '@fluentui/react-components';
import { GavelRegular, DocumentBulletListRegular, ChevronRightRegular } from '@fluentui/react-icons';
import type { CaseRecord } from '../../types/domain';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { palette, radius } from '../../theme';
import { useT } from '../../i18n';

const useStyles = makeStyles({
  card: {
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px',
  },
  parties: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '7px',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  claimant: {
    fontSize: '16px',
    fontWeight: 700,
    color: palette.textPrimary,
  },
  vs: {
    fontSize: '11px',
    color: palette.brass[600],
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  defendant: {
    fontSize: '16px',
    fontWeight: 700,
    color: palette.neutral[500],
  },
  chevron: {
    color: palette.neutral[400],
    flexShrink: 0,
    marginTop: '2px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  idTag: {
    fontSize: '11px',
    fontWeight: 700,
    color: palette.neutral[500],
    backgroundColor: palette.neutral[100],
    borderRadius: radius.sm,
    padding: '2px 8px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
  },
  personRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  personName: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.textPrimary,
  },
  personRole: {
    fontSize: '11px',
    color: palette.neutral[500],
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '2px',
    paddingTop: '12px',
    borderTop: `1px solid ${palette.borderSubtle}`,
  },
});

export function CaseCard({ record, onClick }: { record: CaseRecord; onClick: () => void }) {
  const styles = useStyles();
  const t = useT();
  return (
    <Card
      interactive
      className={`${styles.card} diwan-card-enter`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.topRow}>
        <div className={styles.parties}>
          <span className={styles.claimant}>{record.claimant || t('unnamed_claimant')}</span>
          <span className={styles.vs}>{t('vs')}</span>
          <span className={styles.defendant}>{record.defendant || t('unnamed_defendant')}</span>
        </div>
        <span className={styles.meta}>
          {record.caseNumber && <span className={styles.idTag}>{record.caseNumber}</span>}
          <ChevronRightRegular className={styles.chevron} fontSize={18} />
        </span>
      </div>

      {record.description && (
        <Text size={200} style={{ color: palette.neutral[500] }} truncate wrap={false}>
          {record.description}
        </Text>
      )}

      <div className={styles.personRow}>
        <Avatar name={record.responsibleName || '?'} color="colorful" size={28} aria-hidden />
        <div>
          <div className={styles.personName}>{record.responsibleName || t('unassigned')}</div>
          <div className={styles.personRole}>{t('responsible_attorney')}</div>
        </div>
      </div>

      <div className={styles.footer}>
        {record.caseTypeLabel ? (
          <Badge tone="brass" icon={<GavelRegular fontSize={14} />}>
            {record.caseTypeLabel}
          </Badge>
        ) : (
          <span />
        )}
        <Badge tone="outline" icon={<DocumentBulletListRegular fontSize={14} />}>
          {record.currentStageLabel || t('no_stage_yet')}
        </Badge>
      </div>
    </Card>
  );
}
