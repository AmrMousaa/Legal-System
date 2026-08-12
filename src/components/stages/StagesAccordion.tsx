import { Button, Text, makeStyles } from '@fluentui/react-components';
import { AddRegular, NotepadRegular } from '@fluentui/react-icons';
import type { StageRecord, UpdateRecord } from '../../types/domain';
import { UpdatesTable } from '../updates/UpdatesTable';
import { EmptyState } from '../ui/StatusViews';
import { Badge } from '../ui/Badge';
import { Timeline, TimelineItem } from '../ui/Timeline';
import { palette, radius } from '../../theme';
import { useT } from '../../i18n';

const useStyles = makeStyles({
  stageName: {
    fontSize: '15px',
    fontWeight: 700,
    color: palette.textPrimary,
  },
  parties: {
    fontSize: '13px',
    color: palette.textSecondary,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  desc: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    color: palette.neutral[700],
    backgroundColor: palette.brass[50],
    borderInlineStartWidth: '3px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: palette.brass[300],
    borderRadius: radius.md,
    padding: '10px 14px',
    lineHeight: 1.5,
  },
  descIcon: {
    color: palette.brass[500],
    flexShrink: 0,
    marginTop: '2px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

interface StagesAccordionProps {
  stages: StageRecord[];
  updatesByStage: Map<string, UpdateRecord[]>;
  onAddUpdate: (stageId: string) => void;
}

export function StagesAccordion({ stages, updatesByStage, onAddUpdate }: StagesAccordionProps) {
  const styles = useStyles();
  const t = useT();

  if (stages.length === 0) {
    return <EmptyState title={t('no_stages_title')} subtitle={t('no_stages_subtitle')} />;
  }

  return (
    <Timeline>
      {stages.map((stage, index) => {
        const stageUpdates = updatesByStage.get(stage.id) ?? [];
        const isLast = index === stages.length - 1;
        const isCurrent = index === 0;
        return (
          <TimelineItem
            key={stage.id}
            marker={stages.length - index}
            defaultOpen={index === 0}
            last={isLast}
            current={isCurrent}
            summaryLeft={
              <>
                <Text className={styles.stageName}>{stage.stageNameLabel || 'Stage'}</Text>
                {isCurrent && <Badge tone="brass">{t('current_stage_tag')}</Badge>}
                {stage.number !== undefined && <Badge tone="outline">#{stage.number}</Badge>}
                {stage.stageYear !== undefined && <Badge tone="outline">{stage.stageYear}</Badge>}
                <span className={styles.parties}>
                  {[stage.claimantName, stage.defendantName].filter(Boolean).join(` ${t('vs')} `)}
                </span>
              </>
            }
            summaryRight={
              <Badge tone="sage">
                {stageUpdates.length} {stageUpdates.length === 1 ? t('stage_updates_count_one') : t('stage_updates_count_other')}
              </Badge>
            }
          >
            <div className={styles.panel}>
              {stage.description && (
                <div className={styles.desc}>
                  <NotepadRegular fontSize={15} className={styles.descIcon} />
                  <Text>{stage.description}</Text>
                </div>
              )}
              <div className={styles.panelHeader}>
                <Text weight="semibold" size={200}>
                  {t('tab_updates')}
                </Text>
                <Button size="small" appearance="subtle" icon={<AddRegular />} onClick={() => onAddUpdate(stage.id)}>
                  {t('add_update')}
                </Button>
              </div>
              <UpdatesTable updates={stageUpdates} />
            </div>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
