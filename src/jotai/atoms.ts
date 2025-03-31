import { LANGUAGE_OPTIONS, THEME_OPTIONS } from '@/constants/sidebar-options';
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
  defaultValue: LANGUAGE_OPTIONS[21].value,
  defaultLabel: LANGUAGE_OPTIONS[21].label,
  currValue: LANGUAGE_OPTIONS[21].value,
  currLabel: LANGUAGE_OPTIONS[21].label,
  effects_UNSTABLE: [localStorageEffect('language')],
});

export const themeAtom = atom({
  key: 'theme',
  defaultValue: THEME_OPTIONS[0].value,
  defaultLabel: THEME_OPTIONS[0].label,
  currValue: THEME_OPTIONS[0].value,
  currLabel: THEME_OPTIONS[0].label,
  effects_UNSTABLE: [localStorageEffect('theme')],
});
