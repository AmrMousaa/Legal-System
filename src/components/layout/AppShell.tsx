import { useState, type ReactNode } from 'react';
import { makeStyles, tokens, Text, Avatar, Tooltip } from '@fluentui/react-components';
import {
  ScalesRegular,
  DocumentBulletListRegular,
  ChevronRightRegular,
  ChevronLeftRegular,
} from '@fluentui/react-icons';
import { palette, radius, shadow, motion } from '../../theme';
import { useAppContext } from '../../hooks/useAppContext';
import { useT } from '../../i18n';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_WIDTH_COLLAPSED = 76;
const SIDEBAR_COLLAPSED_KEY = 'diwan.sidebarCollapsed';

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
  },
  sidebar: {
    width: `${SIDEBAR_WIDTH}px`,
    flexShrink: 0,
    backgroundImage: palette.gradientInk,
    color: palette.textOnDark,
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    boxShadow: shadow.lg,
    zIndex: 1,
    transitionProperty: 'width',
    transitionDuration: motion.base,
    overflow: 'hidden',
  },
  sidebarCollapsed: {
    width: `${SIDEBAR_WIDTH_COLLAPSED}px`,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px 20px',
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: 'rgba(255,255,255,0.10)',
    marginBottom: '4px',
  },
  brandCollapsed: {
    justifyContent: 'center',
    padding: '24px 0 20px',
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: radius.md,
    backgroundImage: palette.gradientBrass,
    color: palette.ink[900],
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  titles: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.3,
    minWidth: 0,
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: palette.textOnDark,
    whiteSpace: 'nowrap',
  },
  subtitle: {
    fontSize: '11px',
    color: palette.ink[200],
    whiteSpace: 'nowrap',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px 0',
    color: palette.ink[200],
    backgroundColor: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: 'rgba(255,255,255,0.10)',
    transitionProperty: 'background-color, color',
    transitionDuration: motion.fast,
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.08)',
      color: palette.textOnDark,
    },
  },
  toggleIcon: {
    transitionProperty: 'transform',
    transitionDuration: motion.base,
  },
  toggleIconCollapsed: {
    transform: 'rotate(180deg)',
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
    borderRadius: radius.md,
    fontSize: '13px',
    fontWeight: 600,
    color: palette.ink[200],
    borderInlineStartWidth: '3px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: motion.fast,
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.06)',
      color: palette.textOnDark,
    },
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingInline: '0',
  },
  navItemActive: {
    backgroundColor: 'rgba(211,188,130,0.16)',
    borderInlineStartWidth: '3px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: palette.brass[400],
    color: palette.textOnDark,
    ':hover': {
      backgroundColor: 'rgba(211,188,130,0.20)',
    },
  },
  spacer: { flex: 1 },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  footerCollapsed: {
    justifyContent: 'center',
    padding: '16px 0',
  },
  footerText: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  footerName: {
    fontSize: '12px',
    fontWeight: 600,
    color: palette.textOnDark,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footerRole: {
    fontSize: '11px',
    color: palette.ink[200],
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
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: palette.border,
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    boxShadow: shadow.xs,
  },
  crumbLink: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.neutral[500],
    cursor: 'pointer',
    transitionProperty: 'color',
    transitionDuration: motion.fast,
    ':hover': {
      color: palette.brass[600],
    },
  },
  crumbCurrent: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.textPrimary,
  },
});

interface Crumb {
  label: string;
  onClick?: () => void;
}

export function AppShell({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  const styles = useStyles();
  const context = useAppContext();
  const t = useT();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1';
  });
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

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      return next;
    });
  };

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={`${styles.brand} ${collapsed ? styles.brandCollapsed : ''}`}>
          <span className={styles.iconBadge}>
            <ScalesRegular fontSize={22} />
          </span>
          {!collapsed && (
            <div className={styles.titles}>
              <Text className={`${styles.title} diwan-heading`}>{t('appName')}</Text>
              <Text className={styles.subtitle}>{t('appTagline')}</Text>
            </div>
          )}
        </div>
        <nav className={styles.nav}>
          {collapsed ? (
            <Tooltip content={t('nav_cases')} relationship="label" positioning="after">
              <div className={`${styles.navItem} ${styles.navItemActive} ${styles.navItemCollapsed}`}>
                <DocumentBulletListRegular fontSize={18} />
              </div>
            </Tooltip>
          ) : (
            <div className={`${styles.navItem} ${styles.navItemActive}`}>
              <DocumentBulletListRegular fontSize={18} />
              {t('nav_cases')}
            </div>
          )}
        </nav>
        <div className={styles.spacer} />
        <div
          className={styles.toggleBtn}
          onClick={toggleCollapsed}
          title={collapsed ? t('expand_sidebar') : t('collapse_sidebar')}
        >
          <ChevronLeftRegular
            fontSize={16}
            className={`${styles.toggleIcon} ${collapsed ? styles.toggleIconCollapsed : ''}`}
          />
        </div>
        {fullName && (
          <div className={`${styles.footer} ${collapsed ? styles.footerCollapsed : ''}`}>
            <Avatar name={fullName} initials={initials} color="colorful" size={32} />
            {!collapsed && (
              <div className={styles.footerText}>
                <span className={styles.footerName}>{fullName}</span>
                <span className={styles.footerRole}>{t('signed_in')}</span>
              </div>
            )}
          </div>
        )}
      </aside>
      <div className={styles.content}>
        <div className={styles.topbar}>
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && (
                <ChevronRightRegular fontSize={14} style={{ color: tokens.colorNeutralForeground4 }} />
              )}
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
        <main className="diwan-page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
