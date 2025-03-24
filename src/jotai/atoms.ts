import { atom } from 'jotai';
import { Setter, Getter } from 'jotai/vanilla';

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
  defaultValue: 'javascript',
  defaultLabel: 'JavaScript',
  currValue: 'javascript',
  currLabel: 'JavaScript',
  effects_UNSTABLE: [localStorageEffect('language')],
});

export const themeAtom = atom({
  key: 'theme',
  defaultValue: 'monokai',
  defaultLabel: 'monokai',
  currValue: 'monokai',
  currLabel: 'monokai',
  effects_UNSTABLE: [localStorageEffect('theme')],
});
