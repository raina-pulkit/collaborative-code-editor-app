import { DEFAULT_LANGUAGE, DEFAULT_THEME } from '@/constants/sidebar-options';
import { atom } from 'jotai';
import { Getter, Setter } from 'jotai/vanilla';

type SetSelf<Value> = (
  update: Value | ((prev: Value | undefined) => Value),
) => void;

type OnSet<Value> = (
  callback: (
    newValue: Value,
    oldValue: Value | undefined,
    setter: Setter,
    getter: Getter,
  ) => void,
) => void;

const localStorageEffect =
  <T>(key: string) =>
  ({ setSelf, onSet }: { setSelf: SetSelf<T>; onSet: OnSet<T> }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const languageAtom = atom({
  key: 'language',
  defaultValue: DEFAULT_LANGUAGE.value,
  defaultLabel: DEFAULT_LANGUAGE.label,
  currValue: DEFAULT_LANGUAGE.value,
  currLabel: DEFAULT_LANGUAGE.label,
  effects_UNSTABLE: [localStorageEffect('language')],
});

export const themeAtom = atom({
  key: 'theme',
  defaultValue: DEFAULT_THEME.value,
  defaultLabel: DEFAULT_THEME.label,
  currValue: DEFAULT_THEME.value,
  currLabel: DEFAULT_THEME.label,
  effects_UNSTABLE: [localStorageEffect('theme')],
});
