import { useMemo, useState } from 'react';
import { Button, Input, Spinner, Text, makeStyles } from '@fluentui/react-components';
import {
  AddRegular,
  SearchRegular,
  GavelRegular,
  ArrowClockwiseRegular,
  ScalesRegular,
  DocumentBulletListRegular,
} from '@fluentui/react-icons';
import { useCases } from '../hooks/useCases';
import { CaseCard } from '../components/cases/CaseCard';
import { CaseFormDialog } from '../components/cases/CaseFormDialog';
import { ErrorState, EmptyState } from '../components/ui/StatusViews';
import { SkeletonCaseGrid } from '../components/ui/Skeleton';
import { StatTile } from '../components/ui/StatCard';
import { useAppToast } from '../hooks/useAppToast';
import { AppShell } from '../components/layout/AppShell';
import { palette, radius, shadow, motion, type StatusTone } from '../theme';
import { useT } from '../i18n';

const useStyles = makeStyles({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '28px 32px 48px',
    gap: '20px',
  },
  headerCard: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: radius.xl,
    boxShadow: shadow.sm,
    overflow: 'hidden',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '22px 26px',
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: palette.borderSubtle,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
  },
  titleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: radius.md,
    backgroundImage: palette.gradientInk,
    color: palette.brass[300],
    flexShrink: 0,
    boxShadow: shadow.sm,
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: 0,
  },
  title: {
    fontSize: '25px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: palette.textPrimary,
    lineHeight: 1.15,
  },
  subtitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  subtitle: {
    fontSize: '13px',
    color: palette.textSecondary,
  },
  dateChip: {
    fontSize: '11px',
    fontWeight: 700,
    color: palette.brass[600],
    backgroundColor: palette.brass[100],
    borderRadius: radius.pill,
    padding: '2px 10px',
  },
  statsRow: {
    display: 'flex',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    padding: '16px 26px',
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: palette.borderSubtle,
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 26px',
  },
  searchInput: {
    flex: 1,
    borderRadius: radius.pill,
    backgroundColor: palette.neutral[50],
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: motion.fast,
    ':hover': {
      backgroundColor: palette.neutral[100],
    },
    ':focus-within': {
      backgroundColor: palette.cardBg,
      boxShadow: `0 0 0 3px ${palette.brass[100]}`,
    },
  },
  refreshButton: {
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '0 26px 18px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: radius.pill,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${palette.border}`,
    backgroundColor: palette.cardBg,
    color: palette.neutral[500],
    transitionProperty: 'border-color, color, background-color',
    transitionDuration: '120ms',
    userSelect: 'none',
    ':hover': {
      border: `1px solid ${palette.brass[400]}`,
      color: palette.textPrimary,
    },
  },
  chipActive: {
    backgroundColor: palette.ink[700],
    border: `1px solid ${palette.ink[700]}`,
    color: palette.textOnDark,
    ':hover': {
      border: `1px solid ${palette.ink[700]}`,
      color: palette.textOnDark,
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  surface: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: radius.lg,
  },
});

const STAT_TONES: StatusTone[] = ['brass', 'ink', 'sage', 'burgundy', 'amber'];

export function CaseListPage({ onOpenCase }: { onOpenCase: (caseId: string) => void }) {
  const styles = useStyles();
  const t = useT();
  const { cases, status, error, refresh } = useCases();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useAppToast();

  const typeOptions = useMemo(() => {
    const seen = new Map<number, string>();
    for (const c of cases) {
      if (c.caseType !== undefined && c.caseTypeLabel && !seen.has(c.caseType)) {
        seen.set(c.caseType, c.caseTypeLabel);
      }
    }
    return [...seen.entries()].map(([value, label]) => ({ value, label }));
  }, [cases]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cases.filter((c) => {
      if (typeFilter !== undefined && c.caseType !== typeFilter) return false;
      if (!q) return true;
      return [c.caseNumber, c.claimant, c.defendant, c.responsibleName, c.caseTypeLabel, c.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [cases, search, typeFilter]);

  const typeStats = useMemo(() => {
    const counts = new Map<number, { label: string; count: number }>();
    for (const c of cases) {
      if (c.caseType === undefined || !c.caseTypeLabel) continue;
      const existing = counts.get(c.caseType);
      if (existing) existing.count += 1;
      else counts.set(c.caseType, { label: c.caseTypeLabel, count: 1 });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 4);
  }, [cases]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    []
  );

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <AppShell crumbs={[{ label: t('nav_cases') }]}>
      <div className={styles.page}>
        <div className={`${styles.headerCard} diwan-card-enter`}>
          <div className={styles.headerTop}>
            <div className={styles.titleGroup}>
              <span className={styles.titleIcon}>
                <ScalesRegular fontSize={22} />
              </span>
              <div className={styles.titleBlock}>
                <Text className={`${styles.title} diwan-heading`}>{t('cases_title')}</Text>
                <div className={styles.subtitleRow}>
                  <Text className={styles.subtitle}>{t('cases_subtitle')}</Text>
                  <span className={styles.dateChip}>{today}</span>
                </div>
              </div>
            </div>
            <Button
              appearance="primary"
              icon={<AddRegular />}
              onClick={() => setDialogOpen(true)}
              style={{ boxShadow: shadow.brassGlow }}
            >
              {t('new_case')}
            </Button>
          </div>

          <div className={styles.statsRow}>
            <StatTile icon={<DocumentBulletListRegular fontSize={18} />} value={cases.length} label={t('total')} tone="ink" />
            {typeStats.map((s, i) => (
              <StatTile
                key={s.label}
                icon={<GavelRegular fontSize={18} />}
                value={s.count}
                label={s.label}
                tone={STAT_TONES[i % STAT_TONES.length]}
              />
            ))}
          </div>

          <div className={styles.searchRow}>
            <Input
              className={styles.searchInput}
              contentBefore={<SearchRegular />}
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(_, data) => setSearch(data.value)}
            />
            <Button
              className={styles.refreshButton}
              icon={refreshing ? <Spinner size="tiny" /> : <ArrowClockwiseRegular />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {t('refresh')}
            </Button>
          </div>

          {typeOptions.length > 1 && (
            <div className={styles.chipRow}>
              <span
                className={`${styles.chip} ${typeFilter === undefined ? styles.chipActive : ''}`}
                onClick={() => setTypeFilter(undefined)}
              >
                <GavelRegular fontSize={14} />
                {t('all_types')}
              </span>
              {typeOptions.map((opt) => (
                <span
                  key={opt.value}
                  className={`${styles.chip} ${typeFilter === opt.value ? styles.chipActive : ''}`}
                  onClick={() => setTypeFilter(typeFilter === opt.value ? undefined : opt.value)}
                >
                  {opt.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {status === 'loading' && <SkeletonCaseGrid />}
        {status === 'error' && <ErrorState message={error ?? t('error_generic')} onRetry={refresh} />}
        {status === 'success' && filtered.length === 0 && (
          <div className={styles.surface}>
            <EmptyState
              title={cases.length === 0 ? t('no_cases_title') : t('no_matching_title')}
              subtitle={cases.length === 0 ? t('no_cases_subtitle') : t('no_matching_subtitle')}
            />
          </div>
        )}
        {status === 'success' && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((c) => (
              <CaseCard key={c.id} record={c} onClick={() => onOpenCase(c.id)} />
            ))}
          </div>
        )}

        <CaseFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSaved={(caseId) => {
            void refresh();
            toast.success(t('toast_case_created'), t('toast_case_created_body'));
            onOpenCase(caseId);
          }}
        />
      </div>
    </AppShell>
  );
}
