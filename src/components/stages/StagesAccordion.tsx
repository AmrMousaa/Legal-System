import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Button, Text, makeStyles, tokens } from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import type { StageRecord, UpdateRecord } from '../../types/domain';
import { UpdatesTable } from '../updates/UpdatesTable';
import { EmptyState } from '../common/StatusViews';
import { Pill } from '../common/Pill';
import { palette } from '../../theme';

const useStyles = makeStyles({
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: '8px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: palette.green[100],
    color: palette.green[700],
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
  },
  stageName: {
    fontSize: '14px',
    fontWeight: 700,
    color: palette.textPrimary,
  },
  parties: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    paddingBottom: '10px',
  },
  desc: {
    fontSize: '13px',
    color: palette.black[500],
    backgroundColor: palette.black[200],
    borderRadius: tokens.borderRadiusMedium,
    padding: '10px 12px',
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

  if (stages.length === 0) {
    return <EmptyState title="No stages yet" subtitle="Add the first stage to start tracking this case's progress." />;
  }

  return (
    <Accordion collapsible multiple defaultOpenItems={[stages[0].id]}>
      {stages.map((stage, index) => {
        const stageUpdates = updatesByStage.get(stage.id) ?? [];
        return (
          <AccordionItem key={stage.id} value={stage.id}>
            <AccordionHeader>
              <div className={styles.headerRow}>
                <div className={styles.headerLeft}>
                  <span className={styles.badge}>{stages.length - index}</span>
                  <Text className={styles.stageName}>{stage.stageNameLabel || 'Stage'}</Text>
                  {stage.number !== undefined && <Pill tone="outline">#{stage.number}</Pill>}
                  {stage.stageYear !== undefined && <Pill tone="outline">{stage.stageYear}</Pill>}
                  <span className={styles.parties}>
                    {[stage.claimantName, stage.defendantName].filter(Boolean).join(' vs ')}
                  </span>
                </div>
                <Pill tone="green">
                  {stageUpdates.length} update{stageUpdates.length === 1 ? '' : 's'}
                </Pill>
              </div>
            </AccordionHeader>
            <AccordionPanel>
              <div className={styles.panel}>
                {stage.description && <Text className={styles.desc}>{stage.description}</Text>}
                <div className={styles.panelHeader}>
                  <Text weight="semibold" size={200}>
                    Updates
                  </Text>
                  <Button size="small" appearance="subtle" icon={<AddRegular />} onClick={() => onAddUpdate(stage.id)}>
                    Add update
                  </Button>
                </div>
                <UpdatesTable updates={stageUpdates} />
              </div>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
