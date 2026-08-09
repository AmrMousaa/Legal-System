import { makeStyles } from '@fluentui/react-components';
import { palette } from '../../theme';

const useStyles = makeStyles({
  bar: {
    height: '4px',
    backgroundImage: palette.gradientGold,
    borderRadius: '6px 6px 0 0',
    margin: '-1px -1px 0',
  },
});

/** Thin gold accent strip shown at the top of dialogs for brand consistency. */
export function DialogAccentBar() {
  const styles = useStyles();
  return <div className={styles.bar} />;
}
