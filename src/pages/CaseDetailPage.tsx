import { useMemo, useState } from 'react';
import { Button, Text, makeStyles } from '@fluentui/react-components';
import { AddRegular, ScalesRegular, GavelRegular, DocumentBulletListRegular } from '@fluentui/react-icons';
import { useCase } from '../hooks/useCases';
import { useStagesForCase } from '../hooks/useStages';
import { useUpdatesForCase } from '../hooks/useUpdates';
import { CaseOverviewTab } from '../components/cases/CaseOverviewTab';
import { CaseFormDialog } from '../components/cases/CaseFormDialog';
import { StagesAccordion } from '../components/stages/StagesAccordion';
import { StageFormDialog } from '../components/stages/StageFormDialog';
import { UpdatesTab } from '../components/updates/UpdatesTab';
import { UpdateFormDialog } from '../components/updates/UpdateFormDialog';
import { LoadingState, ErrorState } from '../components/ui/StatusViews';
import { SkeletonBlock } from '../components/ui/Skeleton';
import { SegmentedTabs } from '../components/common/SegmentedTabs';
import { Badge } from '../components/ui/Badge';
import { useAppToast } from '../hooks/useAppToast';
import { AppShell } from '../components/layout/AppShell';
import { palette, radius, shadow } from '../theme';
import { useT } from '../i18n';
import type { UpdateRecord } from '../types/domain';

const useStyles = makeStyles({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '24px 32px 48px',
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
    gap: '16px',
    padding: '22px 26px',
    borderBlockEndWidth: '1px',
    borderBlockEndStyle: 'solid',
    borderBlockEndColor: palette.borderSubtle,
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
    gap: '8px',
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: palette.textPrimary,
    letterSpacing: '-0.01em',
  },
  vs: {
    fontSize: '12px',
    color: palette.brass[600],
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  idTag: {
    fontSize: '11px',
    fontWeight: 700,
    color: palette.neutral[500],
    backgroundColor: palette.neutral[100],
    borderRadius: radius.sm,
    padding: '3px 9px',
    fontFamily: 'monospace',
  },
  tabRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '18px 26px',
  },
  tabPanel: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: radius.xl,
    padding: '24px 26px',
    boxShadow: shadow.xs,
  },
});

type TabKey = 'overview' | 'stages' | 'updates';

export function CaseDetailPage({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const styles = useStyles();
  const t = useT();
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

  const crumbLabel = record ? `${record.claimant || t('unnamed_claimant')} ${t('vs')} ${record.defendant || t('unnamed_defendant')}` : t('nav_cases');

  return (
    <AppShell crumbs={[{ label: t('nav_cases'), onClick: onClose }, { label: crumbLabel }]}>
      <div className={styles.page}>
        {(status === 'loading' || status === 'idle') && <LoadingState label={t('loading_case')} />}
        {(status === 'error' || (status === 'success' && !record)) && (
          <ErrorState message={error ?? t('case_not_found')} onRetry={refresh} />
        )}

        {status === 'success' && record && (
          <>
            <div className={`${styles.headerCard} diwan-card-enter`}>
              <div className={styles.headerTop}>
                <span className={styles.titleIcon}>
                  <ScalesRegular fontSize={22} />
                </span>
                <div className={styles.titleBlock}>
                  <div className={styles.titleRow}>
                    <Text className={`${styles.title} diwan-heading`}>{record.claimant || t('unnamed_claimant')}</Text>
                    <span className={styles.vs}>{t('vs')}</span>
                    <Text className={`${styles.title} diwan-heading`}>{record.defendant || t('unnamed_defendant')}</Text>
                  </div>
                  <div className={styles.metaRow}>
                    {record.caseNumber && <span className={styles.idTag}>{record.caseNumber}</span>}
                    {record.caseTypeLabel && (
                      <Badge tone="brass" icon={<GavelRegular fontSize={14} />}>
                        {record.caseTypeLabel}
                      </Badge>
                    )}
                    <Badge tone="outline" icon={<DocumentBulletListRegular fontSize={14} />}>
                      {record.currentStageLabel || t('no_stage_yet')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className={styles.tabRow}>
                <SegmentedTabs
                  value={tab}
                  onChange={(v) => setTab(v as TabKey)}
                  options={[
                    { value: 'overview', label: t('tab_overview') },
                    { value: 'stages', label: `${t('tab_stages')} (${stages.length})` },
                    { value: 'updates', label: `${t('tab_updates')} (${updates.length})` },
                  ]}
                />
                {tab === 'stages' && (
                  <Button
                    appearance="primary"
                    icon={<AddRegular />}
                    onClick={() => setStageDialogOpen(true)}
                    style={{ boxShadow: shadow.brassGlow }}
                  >
                    {t('add_stage')}
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
                    style={{ boxShadow: shadow.brassGlow }}
                  >
                    {t('add_update')}
                  </Button>
                )}
              </div>
            </div>

            <div className={`${styles.tabPanel} diwan-card-enter`} key={tab}>
              {tab === 'overview' && <CaseOverviewTab record={record} onEdit={() => setEditOpen(true)} />}

              {tab === 'stages' &&
                (stagesStatus === 'loading' ? (
                  <SkeletonBlock height="220px" />
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
                (updatesStatus === 'loading' ? <SkeletonBlock height="220px" /> : <UpdatesTab updates={updates} />)}
            </div>
          </>
        )}

        <CaseFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          editing={record}
          onSaved={() => {
            void refresh();
            toast.success(t('toast_case_updated'));
          }}
        />
        <StageFormDialog
          open={stageDialogOpen}
          onOpenChange={setStageDialogOpen}
          caseId={caseId}
          onSaved={() => {
            refreshAll();
            toast.success(t('toast_stage_added'), t('toast_stage_added_body'));
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
            toast.success(t('toast_update_recorded'));
          }}
        />
      </div>
    </AppShell>
  );
}
