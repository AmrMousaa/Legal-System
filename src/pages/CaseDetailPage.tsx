import { useMemo, useState } from 'react';
import { Button, Text, makeStyles, tokens } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { useCase } from '../hooks/useCases';
import { useStagesForCase } from '../hooks/useStages';
import { useUpdatesForCase } from '../hooks/useUpdates';
import { CaseOverviewTab } from '../components/cases/CaseOverviewTab';
import { CaseFormDialog } from '../components/cases/CaseFormDialog';
import { StagesAccordion } from '../components/stages/StagesAccordion';
import { StageFormDialog } from '../components/stages/StageFormDialog';
import { UpdatesTab } from '../components/updates/UpdatesTab';
import { UpdateFormDialog } from '../components/updates/UpdateFormDialog';
import { LoadingState, ErrorState } from '../components/common/StatusViews';
import { SegmentedTabs } from '../components/common/SegmentedTabs';
import { useAppToast } from '../hooks/useAppToast';
import { AppShell } from '../components/layout/AppShell';
import { palette } from '../theme';
import type { UpdateRecord } from '../types/domain';

const useStyles = makeStyles({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1180px',
    padding: '24px 32px 48px',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: palette.textPrimary,
    letterSpacing: '-0.01em',
  },
  vs: {
    fontSize: '12px',
    color: palette.gold[600],
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  tabRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  tabPanel: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: '24px 26px',
  },
});

type TabKey = 'overview' | 'stages' | 'updates';

export function CaseDetailPage({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const styles = useStyles();
  const { record, status, error, refresh } = useCase(caseId);
  const { stages, status: stagesStatus, refresh: refreshStages } = useStagesForCase(caseId);
  const { updates, status: updatesStatus, refresh: refreshUpdates } = useUpdatesForCase(caseId);
  const toast = useAppToast();

  const [tab, setTab] = useState<TabKey>('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDefaultStage, setUpdateDefaultStage] = useState<string | undefined>();

  const updatesByStage = useMemo(() => {
    const map = new Map<string, UpdateRecord[]>();
    for (const u of updates) {
      if (!u.stageId) continue;
      const list = map.get(u.stageId) ?? [];
      list.push(u);
      map.set(u.stageId, list);
    }
    return map;
  }, [updates]);

  function refreshAll() {
    void refresh();
    void refreshStages();
    void refreshUpdates();
  }

  const crumbLabel = record ? `${record.claimant || 'Unnamed'} vs ${record.defendant || 'Unnamed'}` : 'Case';

  return (
    <AppShell crumbs={[{ label: 'Cases', onClick: onClose }, { label: crumbLabel }]}>
      <div className={styles.page}>
        {(status === 'loading' || status === 'idle') && <LoadingState label="Loading case…" />}
        {(status === 'error' || (status === 'success' && !record)) && (
          <ErrorState message={error ?? 'Case not found.'} onRetry={refresh} />
        )}

        {status === 'success' && record && (
          <>
            <div className={styles.header}>
              <div className={styles.titleRow}>
                <Text className={styles.title}>{record.claimant || 'Unnamed claimant'}</Text>
                <span className={styles.vs}>vs</span>
                <Text className={styles.title}>{record.defendant || 'Unnamed defendant'}</Text>
              </div>
            </div>

            <div className={styles.tabRow}>
              <SegmentedTabs
                value={tab}
                onChange={(v) => setTab(v as TabKey)}
                options={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'stages', label: `Stages (${stages.length})` },
                  { value: 'updates', label: `Updates (${updates.length})` },
                ]}
              />
              {tab === 'stages' && (
                <Button appearance="primary" icon={<AddRegular />} onClick={() => setStageDialogOpen(true)}>
                  Add stage
                </Button>
              )}
              {tab === 'updates' && (
                <Button
                  appearance="primary"
                  icon={<AddRegular />}
                  onClick={() => {
                    setUpdateDefaultStage(undefined);
                    setUpdateDialogOpen(true);
                  }}
                >
                  Add update
                </Button>
              )}
            </div>

            <div className={styles.tabPanel}>
              {tab === 'overview' && <CaseOverviewTab record={record} onEdit={() => setEditOpen(true)} />}

              {tab === 'stages' &&
                (stagesStatus === 'loading' ? (
                  <LoadingState label="Loading stages…" />
                ) : (
                  <StagesAccordion
                    stages={stages}
                    updatesByStage={updatesByStage}
                    onAddUpdate={(stageId) => {
                      setUpdateDefaultStage(stageId);
                      setUpdateDialogOpen(true);
                    }}
                  />
                ))}

              {tab === 'updates' &&
                (updatesStatus === 'loading' ? <LoadingState label="Loading updates…" /> : <UpdatesTab updates={updates} />)}
            </div>
          </>
        )}

        <CaseFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          editing={record}
          onSaved={() => {
            void refresh();
            toast.success('Case updated');
          }}
        />
        <StageFormDialog
          open={stageDialogOpen}
          onOpenChange={setStageDialogOpen}
          caseId={caseId}
          onSaved={() => {
            refreshAll();
            toast.success('Stage added', 'This is now the case’s current stage.');
          }}
        />
        <UpdateFormDialog
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          caseId={caseId}
          stages={stages}
          defaultStageId={updateDefaultStage}
          onSaved={() => {
            refreshAll();
            toast.success('Update recorded');
          }}
        />
      </div>
    </AppShell>
  );
}
