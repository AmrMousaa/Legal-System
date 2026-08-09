import type { ReactNode } from 'react';
import { makeStyles, tokens, Text, Avatar } from '@fluentui/react-components';
import { ScalesRegular, DocumentBulletListRegular } from '@fluentui/react-icons';
import { palette } from '../../theme';
import { useAppContext } from '../../hooks/useAppContext';

const SIDEBAR_WIDTH = 232;

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
  },
  sidebar: {
    width: `${SIDEBAR_WIDTH}px`,
    flexShrink: 0,
    backgroundImage: palette.gradientGreen,
    color: palette.black[100],
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    boxShadow: '2px 0 16px rgba(31, 42, 32, 0.18)',
    zIndex: 1,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    marginBottom: '4px',
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundImage: palette.gradientGold,
    color: palette.green[900],
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.25,
    minWidth: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: palette.black[100],
    whiteSpace: 'nowrap',
  },
  subtitle: {
    fontSize: '11px',
    color: palette.green[200],
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '4px 12px',
    marginTop: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 13px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '13px',
    fontWeight: 600,
    color: palette.green[100],
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: palette.black[100],
    },
  },
  navItemActive: {
    backgroundColor: 'rgba(204,164,113,0.18)',
    borderLeft: `3px solid ${palette.gold[500]}`,
    color: palette.black[100],
    ':hover': {
      backgroundColor: 'rgba(204,164,113,0.22)',
    },
  },
  spacer: { flex: 1 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  footerText: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  footerName: {
    fontSize: '12px',
    fontWeight: 600,
    color: palette.black[100],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footerRole: {
    fontSize: '11px',
    color: palette.green[200],
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    backgroundColor: palette.cardBg,
    borderBottom: `1px solid ${palette.border}`,
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    boxShadow: '0 1px 3px rgba(33, 28, 30, 0.04)',
  },
  crumbLink: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.black[500],
    cursor: 'pointer',
    transition: 'color 0.12s ease',
    ':hover': {
      color: palette.gold[600],
    },
  },
  crumbCurrent: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.textPrimary,
  },
  crumbSep: {
    fontSize: '13px',
    color: palette.black[400],
  },
});

interface Crumb {
  label: string;
  onClick?: () => void;
}

export function AppShell({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  const styles = useStyles();
  const context = useAppContext();
  const fullName = context?.user.fullName;
  const initials = fullName
    ? fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : undefined;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.iconBadge}>
            <ScalesRegular fontSize={20} />
          </span>
          <div className={styles.titles}>
            <Text className={styles.title}>Legal Case Mgmt</Text>
            <Text className={styles.subtitle}>Case &amp; litigation tracking</Text>
          </div>
        </div>
        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.navItemActive}`}>
            <DocumentBulletListRegular fontSize={18} />
            Cases
          </div>
        </nav>
        <div className={styles.spacer} />
        {fullName && (
          <div className={styles.footer}>
            <Avatar name={fullName} initials={initials} color="colorful" size={32} />
            <div className={styles.footerText}>
              <span className={styles.footerName}>{fullName}</span>
              <span className={styles.footerRole}>Signed in</span>
            </div>
          </div>
        )}
      </aside>
      <div className={styles.content}>
        <div className={styles.topbar}>
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <span className={styles.crumbSep}>/</span>}
              {c.onClick ? (
                <span className={styles.crumbLink} onClick={c.onClick}>
                  {c.label}
                </span>
              ) : (
                <span className={styles.crumbCurrent}>{c.label}</span>
              )}
            </span>
          ))}
        </div>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      </div>
    </div>
  );
}
