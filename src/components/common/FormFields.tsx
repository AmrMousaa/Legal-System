import {
  Field,
  Input,
  Textarea,
  Dropdown,
  Option,
  Combobox,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { LockClosedRegular } from '@fluentui/react-icons';
import { palette, radius, motion } from '../../theme';
import { useT } from '../../i18n';
import type { ChoiceOption } from '../../types/choices';
import type { UserOption } from '../../types/domain';

const useStyles = makeStyles({
  field: {
    rowGap: '7px',
    minWidth: 0,
  },
  label: {
    fontSize: '12px',
    fontWeight: 700,
    color: palette.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  hint: {
    fontSize: '12px',
    color: palette.textSecondary,
  },
  control: {
    width: '100%',
    minWidth: 0,
    borderRadius: radius.md,
    backgroundColor: palette.neutral[50],
    transitionProperty: 'border-color, box-shadow, background-color',
    transitionDuration: motion.fast,
    transitionTimingFunction: motion.easing,
    ':hover': {
      backgroundColor: palette.cardBg,
    },
    ':focus-within': {
      backgroundColor: palette.cardBg,
      boxShadow: `0 0 0 3px ${palette.brass[100]}`,
    },
  },
  locked: {
    backgroundColor: palette.lockedBg,
    color: palette.neutral[500],
    borderRadius: radius.md,
    padding: '8px 12px',
    fontSize: tokens.fontSizeBase300,
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    border: `1px dashed ${palette.borderStrong}`,
    minHeight: '20px',
  },
  lockIcon: {
    color: palette.brass[500],
    flexShrink: 0,
  },
  empty: {
    color: tokens.colorNeutralForeground4,
    fontStyle: 'italic',
  },
});

interface BaseFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
}

function useFieldSlotProps() {
  const styles = useStyles();
  return {
    className: styles.field,
    label: (label: string) => ({ children: label, className: styles.label }),
    hint: (hint?: string) => (hint ? { children: hint, className: styles.hint } : undefined),
  };
}

/** Read-only field with a distinct dashed appearance, used for locked/auto-set columns. */
export function LockedField({ label, hint, value }: BaseFieldProps & { value?: string }) {
  const styles = useStyles();
  const t = useT();
  const slots = useFieldSlotProps();
  return (
    <Field className={slots.className} label={slots.label(label)} hint={slots.hint(hint)}>
      <div className={styles.locked}>
        <LockClosedRegular fontSize={14} className={styles.lockIcon} />
        <span className={value ? undefined : styles.empty}>{value || t('not_set_yet')}</span>
      </div>
    </Field>
  );
}

export function TextField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  placeholder,
}: BaseFieldProps & { value: string; onChange: (value: string) => void; placeholder?: string }) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Input className={styles.control} size="large" value={value} onChange={(_, data) => onChange(data.value)} placeholder={placeholder} />
    </Field>
  );
}

export function TextAreaField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  rows = 4,
}: BaseFieldProps & { value: string; onChange: (value: string) => void; rows?: number }) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Textarea className={styles.control} size="large" value={value} onChange={(_, data) => onChange(data.value)} rows={rows} resize="vertical" />
    </Field>
  );
}

export function NumberField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
}: BaseFieldProps & { value: number | undefined; onChange: (value: number | undefined) => void }) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Input
        className={styles.control}
        size="large"
        type="number"
        value={value === undefined ? '' : String(value)}
        onChange={(_, data) => onChange(data.value === '' ? undefined : Number(data.value))}
      />
    </Field>
  );
}

export function DateField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
}: BaseFieldProps & { value: string | undefined; onChange: (value: string) => void }) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Input className={styles.control} size="large" type="date" value={value ?? ''} onChange={(_, data) => onChange(data.value)} />
    </Field>
  );
}

export function ChoiceField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  options,
  placeholder,
}: BaseFieldProps & {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options: ChoiceOption[];
}) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  const t = useT();
  const selected = options.find((o) => o.value === value);
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Dropdown
        className={styles.control}
        size="large"
        placeholder={placeholder ?? t('select_placeholder')}
        value={selected?.label ?? ''}
        selectedOptions={selected ? [String(selected.value)] : []}
        onOptionSelect={(_, data) => {
          const num = data.optionValue !== undefined ? Number(data.optionValue) : undefined;
          onChange(num);
        }}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={String(opt.value)} text={opt.label}>
            {opt.label}
          </Option>
        ))}
      </Dropdown>
    </Field>
  );
}

export function UserPickerField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  users,
  placeholder,
}: BaseFieldProps & {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  users: UserOption[];
}) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  const t = useT();
  const selected = users.find((u) => u.id === value);
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Combobox
        className={styles.control}
        size="large"
        placeholder={placeholder ?? t('select_person')}
        value={selected?.fullName ?? ''}
        selectedOptions={selected ? [selected.id] : []}
        onOptionSelect={(_, data) => onChange(data.optionValue)}
        clearable
        onInput={(e) => {
          if ((e.target as HTMLInputElement).value === '') onChange(undefined);
        }}
      >
        {users.map((u) => (
          <Option key={u.id} value={u.id} text={u.fullName}>
            {u.fullName}
          </Option>
        ))}
      </Combobox>
    </Field>
  );
}

export function StagePickerField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  stages,
  placeholder,
}: BaseFieldProps & {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  stages: { id: string; label: string }[];
}) {
  const styles = useStyles();
  const slots = useFieldSlotProps();
  const t = useT();
  const selected = stages.find((s) => s.id === value);
  return (
    <Field
      className={slots.className}
      label={slots.label(label)}
      required={required}
      hint={error ? undefined : slots.hint(hint)}
      validationMessage={error}
      validationState={error ? 'error' : 'none'}
    >
      <Dropdown
        className={styles.control}
        size="large"
        placeholder={placeholder ?? t('select_stage')}
        value={selected?.label ?? ''}
        selectedOptions={selected ? [selected.id] : []}
        onOptionSelect={(_, data) => onChange(data.optionValue)}
      >
        {stages.map((s) => (
          <Option key={s.id} value={s.id} text={s.label}>
            {s.label}
          </Option>
        ))}
      </Dropdown>
    </Field>
  );
}
