import { makeStyles, tokens } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { palette, radius, toneColor, type StatusTone } from '../../theme';

const useStyles = makeStyles({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 11px',
    borderRadius: radius.pill,
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  outline: {
    background: 'transparent',
    color: palette.textSecondary,
    border: `1px solid ${palette.borderStrong}`,
  },
});

export type BadgeTone = StatusTone | 'outline';

export function Badge({
  children,
  tone = 'outline',
  icon,
  dot,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  dot?: boolean;
}) {
  const styles = useStyles();
  if (tone === 'outline') {
    return (
      <span className={`${styles.base} ${styles.outline}`}>
        {dot && <span className={styles.dot} style={{ backgroundColor: palette.neutral[400] }} />}
        {icon}
        {children}
      </span>
    );
  }
  const t = toneColor[tone];
  return (
    <span className={styles.base} style={{ backgroundColor: t.bg, color: t.fg }}>
      {dot && <span className={styles.dot} style={{ backgroundColor: t.solid }} />}
      {icon}
      {children}
    </span>
  );
}

/** Solid variant for high-emphasis badges (sidebar counts, key stat chips). */
export function SolidBadge({ children, tone = 'brass' }: { children: ReactNode; tone?: StatusTone }) {
  const styles = useStyles();
  const t = toneColor[tone];
  return (
    <span className={styles.base} style={{ backgroundColor: t.solid, color: tokens.colorNeutralBackground1 }}>
      {children}
    </span>
  );
}
