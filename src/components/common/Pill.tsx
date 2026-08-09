import { makeStyles, tokens } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { palette } from '../../theme';

const useStyles = makeStyles({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
});

export type PillTone = 'gold' | 'green' | 'outline' | 'error' | 'success' | 'warning' | 'black';

const toneStyles: Record<PillTone, { background: string; color: string; border: string }> = {
  gold: { background: palette.gold[100], color: palette.gold[600], border: 'none' },
  green: { background: palette.green[200], color: palette.green[600], border: 'none' },
  outline: { background: 'transparent', color: palette.black[500], border: `1px solid ${palette.black[400]}` },
  error: { background: palette.error[100], color: palette.error[500], border: 'none' },
  success: { background: palette.success[100], color: palette.success[500], border: 'none' },
  warning: { background: palette.warning[100], color: palette.warning[500], border: 'none' },
  black: { background: palette.black[600], color: palette.black[100], border: 'none' },
};

export function Pill({ children, tone = 'outline', icon }: { children: ReactNode; tone?: PillTone; icon?: ReactNode }) {
  const styles = useStyles();
  const t = toneStyles[tone];
  return (
    <span className={styles.base} style={{ backgroundColor: t.background, color: t.color, border: t.border }}>
      {icon}
      {children}
    </span>
  );
}
