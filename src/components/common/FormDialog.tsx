import { makeStyles, Text } from '@fluentui/react-components';
import type { ReactNode } from 'react';
import { palette, radius, shadow } from '../../theme';

const useStyles = makeStyles({
  surface: {
    borderRadius: radius.xl,
    boxShadow: shadow.lg,
    maxWidth: 'min(600px, calc(100vw - 48px))',
    width: '100%',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    paddingBlockEnd: '4px',
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px',
    height: '42px',
    borderRadius: radius.md,
    backgroundImage: palette.gradientBrass,
    color: palette.ink[900],
    flexShrink: 0,
    boxShadow: shadow.brassGlow,
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  title: {
    fontSize: '19px',
    fontWeight: 700,
    color: palette.textPrimary,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '13px',
    color: palette.textSecondary,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    paddingBlockStart: '18px',
    overflowX: 'hidden',
    minWidth: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 700,
    color: palette.brass[600],
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    backgroundColor: palette.borderSubtle,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
    minWidth: 0,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '16px',
    minWidth: 0,
  },
  errorBanner: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.error[500],
    backgroundColor: palette.error[100],
    borderRadius: radius.md,
    padding: '10px 14px',
  },
});

export function useFormDialogStyles() {
  return useStyles();
}

export function DialogHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  const styles = useStyles();
  return (
    <div className={styles.header}>
      <span className={styles.iconBadge}>{icon}</span>
      <div className={styles.titleBlock}>
        <Text className={`${styles.title} diwan-heading`}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </div>
    </div>
  );
}

export function FormSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  const styles = useStyles();
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>
        {icon}
        {title}
        <span className={styles.sectionLine} />
      </div>
      {children}
    </div>
  );
}
