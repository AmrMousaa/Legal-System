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
import { palette } from '../../theme';
import type { ChoiceOption } from '../../types/choices';
import type { UserOption } from '../../types/domain';

const useStyles = makeStyles({
  locked: {
    backgroundColor: palette.black[200],
    color: palette.black[500],
    borderRadius: tokens.borderRadiusMedium,
    padding: '7px 10px',
    fontSize: tokens.fontSizeBase300,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    border: `1px solid ${palette.border}`,
    minHeight: '20px',
  },
  lockIcon: {
    color: palette.gold[500],
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

/** Read-only field with a distinct grayed-out appearance, used for locked/auto-set columns. */
export function LockedField({ label, hint, value }: BaseFieldProps & { value?: string }) {
  const styles = useStyles();
  return (
    <Field label={label} hint={hint}>
      <div className={styles.locked}>
        <LockClosedRegular fontSize={14} className={styles.lockIcon} />
        <span className={value ? undefined : styles.empty}>{value || 'Not set yet'}</span>
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
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Input value={value} onChange={(_, data) => onChange(data.value)} placeholder={placeholder} />
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
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Textarea value={value} onChange={(_, data) => onChange(data.value)} rows={rows} resize="vertical" />
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
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Input
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
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Input type="date" value={value ?? ''} onChange={(_, data) => onChange(data.value)} />
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
  placeholder = 'Select…',
}: BaseFieldProps & {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  options: ChoiceOption[];
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Dropdown
        placeholder={placeholder}
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
  placeholder = 'Select a person…',
}: BaseFieldProps & {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  users: UserOption[];
}) {
  const selected = users.find((u) => u.id === value);
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Combobox
        placeholder={placeholder}
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
  placeholder = 'Select a stage…',
}: BaseFieldProps & {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  stages: { id: string; label: string }[];
}) {
  const selected = stages.find((s) => s.id === value);
  return (
    <Field label={label} required={required} hint={error ? undefined : hint} validationMessage={error} validationState={error ? 'error' : 'none'}>
      <Dropdown
        placeholder={placeholder}
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
