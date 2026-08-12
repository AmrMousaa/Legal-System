import { makeStyles } from '@fluentui/react-components';
import { ChevronDownRegular } from '@fluentui/react-icons';
import type { ReactNode } from 'react';
import { palette, radius, motion, shadow } from '../../theme';

const RAIL = 40;

const useStyles = makeStyles({
  root: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  item: {
    position: 'relative',
    paddingInlineStart: `${RAIL + 14}px`,
    paddingBottom: '18px',
  },
  itemLast: {
    paddingBottom: 0,
  },
  rail: {
    position: 'absolute',
    insetInlineStart: `${RAIL / 2 - 1}px`,
    top: `${RAIL}px`,
    bottom: 0,
    width: '2px',
    backgroundColor: palette.borderStrong,
  },
  dot: {
    position: 'absolute',
    insetInlineStart: 0,
    top: 0,
    width: `${RAIL}px`,
    height: `${RAIL}px`,
    borderRadius: radius.pill,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 700,
    flexShrink: 0,
    border: `2px solid ${palette.cardBg}`,
    boxShadow: `0 0 0 1px ${palette.border}`,
    zIndex: 1,
  },
  dotCurrent: {
    boxShadow: `0 0 0 1px ${palette.brass[500]}, 0 4px 10px rgba(169, 129, 46, 0.3)`,
  },
  details: {
    border: `1px solid ${palette.border}`,
    borderRadius: radius.lg,
    backgroundColor: palette.cardBg,
    overflow: 'hidden',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: motion.base,
    transitionTimingFunction: motion.easing,
    boxShadow: shadow.xs,
  },
  detailsCurrent: {
    border: `1px solid ${palette.brass[300]}`,
    boxShadow: shadow.sm,
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px 18px',
    cursor: 'pointer',
    listStyle: 'none',
    userSelect: 'none',
    minHeight: '24px',
    '::-webkit-details-marker': { display: 'none' },
    ':hover': {
      backgroundColor: palette.neutral[50],
    },
  },
  summaryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  chevron: {
    color: palette.textSecondary,
    flexShrink: 0,
    transitionProperty: 'transform',
    transitionDuration: motion.base,
    transitionTimingFunction: motion.easing,
  },
  body: {
    padding: '6px 18px 18px',
    borderTop: `1px solid ${palette.borderSubtle}`,
  },
});

export function Timeline({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <ol className={styles.root}>{children}</ol>;
}

export function TimelineItem({
  marker,
  markerTone = 'brass',
  summaryLeft,
  summaryRight,
  children,
  defaultOpen,
  last,
  current,
}: {
  marker: ReactNode;
  markerTone?: 'brass' | 'ink';
  summaryLeft: ReactNode;
  summaryRight?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  last?: boolean;
  current?: boolean;
}) {
  const styles = useStyles();
  const markerBg = markerTone === 'ink' ? palette.ink[100] : palette.brass[100];
  const markerFg = markerTone === 'ink' ? palette.ink[600] : palette.brass[600];

  return (
    <li className={`${styles.item} ${last ? styles.itemLast : ''}`}>
      {!last && <span className={styles.rail} />}
      <span
        className={`${styles.dot} ${current ? styles.dotCurrent : ''}`}
        style={{ backgroundColor: markerBg, color: markerFg }}
      >
        {marker}
      </span>
      <details className={`${styles.details} ${current ? styles.detailsCurrent : ''}`} open={defaultOpen}>
        <summary className={styles.summary}>
          <span className={styles.summaryLeft}>{summaryLeft}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {summaryRight}
            <ChevronDownRegular className={`${styles.chevron} diwan-chevron`} fontSize={16} />
          </span>
        </summary>
        <div className={styles.body}>{children}</div>
      </details>
    </li>
  );
}
