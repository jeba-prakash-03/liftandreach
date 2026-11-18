import { createContext, useContext, useLayoutEffect } from 'react';

export type Tone = 'dark' | 'light';

export const HeaderToneCtx = createContext<{
  tone: Tone;
  setTone: (t: Tone) => void;
}>({
  tone: 'light',
  setTone: () => {}
});

export function useHeaderTone(tone: Tone) {
  const { setTone } = useContext(HeaderToneCtx);
  useLayoutEffect(() => {
    setTone(tone);
    return () => setTone('light');
  }, [tone, setTone]);
}
