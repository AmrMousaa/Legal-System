import { makeStyles, tokens, Text, Avatar } from '@fluentui/react-components';
import { GavelRegular, DocumentBulletListRegular, ChevronRightRegular } from '@fluentui/react-icons';
import type { CaseRecord } from '../../types/domain';
import { Pill } from '../common/Pill';
import { palette } from '../../theme';

const useStyles = makeStyles({
  card: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease',
    boxShadow: '0 1px 2px rgba(33, 28, 30, 0.05)',
    outlineStyle: 'none',
    position: 'relative',
    ':hover': {
      boxShadow: '0 14px 28px rgba(31, 42, 32, 0.14)',
      border: `1px solid ${palette.gold[500]}`,
      transform: 'translateY(-2px)',
    },
    ':focus-visible': {
      border: `1px solid ${palette.gold[500]}`,
      boxShadow: `0 0 0 3px ${palette.gold[200]}`,
    },
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
    color: palette.gold[600],
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  defendant: {
    fontSize: '16px',
    fontWeight: 700,
    color: palette.black[500],
  },
  chevron: {
    color: palette.black[400],
    flexShrink: 0,
    marginTop: '2px',
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
    color: palette.black[500],
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
  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={styles.topRow}>
        <div className={styles.parties}>
          <span className={styles.claimant}>{record.claimant || 'Unnamed claimant'}</span>
          <span className={styles.vs}>vs</span>
          <span className={styles.defendant}>{record.defendant || 'Unnamed defendant'}</span>
        </div>
        <ChevronRightRegular className={styles.chevron} fontSize={18} />
      </div>

      {record.description && (
        <Text size={200} style={{ color: palette.black[500] }} truncate wrap={false}>
          {record.description}
        </Text>
      )}

      <div className={styles.personRow}>
        <Avatar
          name={record.responsibleName || '?'}
          color="colorful"
          size={28}
          aria-hidden
        />
        <div>
          <div className={styles.personName}>{record.responsibleName || 'Unassigned'}</div>
          <div className={styles.personRole}>Responsible attorney</div>
        </div>
      </div>

      <div className={styles.footer}>
        {record.caseTypeLabel ? (
          <Pill tone="gold" icon={<GavelRegular fontSize={14} />}>
            {record.caseTypeLabel}
          </Pill>
        ) : (
          <span />
        )}
        <Pill tone="outline" icon={<DocumentBulletListRegular fontSize={14} />}>
          {record.currentStageLabel || 'No stage yet'}
        </Pill>
      </div>
    </div>
  );
}
