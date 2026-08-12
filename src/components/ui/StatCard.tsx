import { makeStyles } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { palette, radius, shadow, type StatusTone, toneColor } from '../../theme';

const useStyles = makeStyles({
  stat: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderRadius: radius.xl,
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    boxShadow: shadow.xs,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  value: {
    fontSize: '15px',
    fontWeight: 800,
    color: palette.textPrimary,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: palette.textSecondary,
  },
});

export function StatChip({ value, label, tone = 'slate' }: { value: number | string; label: string; tone?: StatusTone }) {
  const styles = useStyles();
  const t = toneColor[tone];
  return (
    <span className={styles.stat}>
      <span className={styles.dot} style={{ backgroundColor: t.solid }} />
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </span>
  );
}

const useTileStyles = makeStyles({
  tile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '2px 22px',
    flex: '0 0 auto',
    ':not(:first-child)': {
      borderInlineStartWidth: '1px',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: palette.borderSubtle,
    },
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: radius.md,
    flexShrink: 0,
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    minWidth: 0,
  },
  value: {
    fontSize: '20px',
    fontWeight: 800,
    color: palette.textPrimary,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.15,
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: palette.textSecondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export function StatTile({
  icon,
  value,
  label,
  tone = 'slate',
}: {
  icon: ReactNode;
  value: number | string;
  label: string;
  tone?: StatusTone;
}) {
  const styles = useTileStyles();
  const t = toneColor[tone];
  return (
    <div className={styles.tile}>
      <span className={styles.iconWrap} style={{ backgroundColor: t.bg, color: t.fg }}>
        {icon}
      </span>
      <div className={styles.textCol}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
}
