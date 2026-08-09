import { useMemo, useState } from 'react';
import { Button, Input, Spinner, Text, makeStyles, tokens } from '@fluentui/react-components';
import { AddRegular, SearchRegular, GavelRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import { useCases } from '../hooks/useCases';
import { CaseCard } from '../components/cases/CaseCard';
import { CaseFormDialog } from '../components/cases/CaseFormDialog';
import { LoadingState, ErrorState, EmptyState } from '../components/common/StatusViews';
import { useAppToast } from '../hooks/useAppToast';
import { AppShell } from '../components/layout/AppShell';
import { palette } from '../theme';

const useStyles = makeStyles({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1280px',
    padding: '28px 32px 48px',
    gap: '20px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    backgroundImage: `linear-gradient(90deg, ${palette.textPrimary}, ${palette.green[600]})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  },
  subtitle: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  statPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 16px',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    boxShadow: '0 1px 2px rgba(33, 28, 30, 0.04)',
  },
  statDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: palette.textPrimary,
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: palette.black[500],
  },
  toolbar2: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: '0 1px 2px rgba(33, 28, 30, 0.04)',
  },
  searchInput: {
    flex: 1,
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${palette.border}`,
    backgroundColor: palette.cardBg,
    color: palette.black[500],
    transition: 'all 0.12s ease',
    userSelect: 'none',
    ':hover': {
      border: `1px solid ${palette.gold[500]}`,
      color: palette.textPrimary,
    },
  },
  chipActive: {
    backgroundColor: palette.green[500],
    border: `1px solid ${palette.green[500]}`,
    color: palette.black[100],
    ':hover': {
      border: `1px solid ${palette.green[500]}`,
      color: palette.black[100],
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
    borderRadius: tokens.borderRadiusLarge,
  },
});

const STAT_DOT_COLORS = [palette.gold[500], palette.green[500], palette.black[500], palette.error[500], palette.success[500]];

export function CaseListPage({ onOpenCase }: { onOpenCase: (caseId: string) => void }) {
  const styles = useStyles();
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
      return [c.claimant, c.defendant, c.responsibleName, c.caseTypeLabel, c.description]
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
    () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
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
    <AppShell crumbs={[{ label: 'Cases' }]}>
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.titleBlock}>
            <Text className={styles.title}>Cases</Text>
            <Text className={styles.subtitle}>All Cases · {today}</Text>
          </div>
          <div className={styles.actions}>
            <Button
              appearance="primary"
              icon={<AddRegular />}
              onClick={() => setDialogOpen(true)}
              style={{ boxShadow: '0 6px 14px rgba(204, 164, 113, 0.35)' }}
            >
              New case
            </Button>
          </div>
        </div>

        <div className={styles.statRow}>
          <span className={styles.statPill}>
            <span className={styles.statDot} style={{ backgroundColor: palette.black[500] }} />
            <span className={styles.statValue}>{cases.length}</span>
            <span className={styles.statLabel}>Total</span>
          </span>
          {typeStats.map((t, i) => (
            <span className={styles.statPill} key={t.label}>
              <span className={styles.statDot} style={{ backgroundColor: STAT_DOT_COLORS[i % STAT_DOT_COLORS.length] }} />
              <span className={styles.statValue}>{t.count}</span>
              <span className={styles.statLabel}>{t.label}</span>
            </span>
          ))}
        </div>

        <div className={styles.toolbar2}>
          <Input
            className={styles.searchInput}
            contentBefore={<SearchRegular />}
            placeholder="Search by claimant, defendant, responsible…"
            value={search}
            onChange={(_, data) => setSearch(data.value)}
          />
          <Button
            icon={refreshing ? <Spinner size="tiny" /> : <ArrowClockwiseRegular />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
        </div>

        {typeOptions.length > 1 && (
          <div className={styles.chipRow}>
            <span
              className={`${styles.chip} ${typeFilter === undefined ? styles.chipActive : ''}`}
              onClick={() => setTypeFilter(undefined)}
            >
              <GavelRegular fontSize={14} />
              All types
            </span>
            {typeOptions.map((t) => (
              <span
                key={t.value}
                className={`${styles.chip} ${typeFilter === t.value ? styles.chipActive : ''}`}
                onClick={() => setTypeFilter(typeFilter === t.value ? undefined : t.value)}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        {status === 'loading' && <LoadingState label="Loading cases…" />}
        {status === 'error' && <ErrorState message={error ?? 'Failed to load cases.'} onRetry={refresh} />}
        {status === 'success' && filtered.length === 0 && (
          <div className={styles.surface}>
            <EmptyState
              title={cases.length === 0 ? 'No cases yet' : 'No matching cases'}
              subtitle={cases.length === 0 ? 'Create your first case to get started.' : 'Try a different search term or filter.'}
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
            toast.success('Case created', 'The new case has been added to your file.');
            onOpenCase(caseId);
          }}
        />
      </div>
    </AppShell>
  );
}
