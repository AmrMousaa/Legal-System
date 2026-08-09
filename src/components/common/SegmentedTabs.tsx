import { makeStyles, tokens } from '@fluentui/react-components';
import { palette } from '../../theme';

export interface SegmentedTabOption {
  value: string;
  label: string;
}

const useStyles = makeStyles({
  wrap: {
    display: 'inline-flex',
    padding: '4px',
    backgroundColor: palette.black[200],
    borderRadius: tokens.borderRadiusXLarge,
    gap: '2px',
  },
  tab: {
    padding: '9px 20px',
    borderRadius: tokens.borderRadiusLarge,
    fontSize: '13px',
    fontWeight: 600,
    color: palette.black[500],
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.12s ease',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    backgroundColor: palette.cardBg,
    color: palette.green[700],
    boxShadow: '0 1px 4px rgba(33, 28, 30, 0.14)',
  },
});

export function SegmentedTabs({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SegmentedTabOption[];
}) {
  const styles = useStyles();
  return (
    <div className={styles.wrap} role="tablist">
      {options.map((opt) => (
        <div
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          tabIndex={0}
          className={`${styles.tab} ${opt.value === value ? styles.tabActive : ''}`}
          onClick={() => onChange(opt.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onChange(opt.value);
            }
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}
