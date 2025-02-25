import { createContext, useContext, useMemo, ReactNode, useEffect } from 'react';
import seedrandom from 'seedrandom';

interface SeedContextType {
  rng: () => number;
  seed: string;
}

const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max + 1 - min));

const SeedContext = createContext<SeedContextType | undefined>(undefined);

export const useSeed = () => {
  const context = useContext(SeedContext);
  if (!context) {
    throw new Error('useSeed must be used within a SeedProvider');
  }
  return context;
};

function SeedProvider({ children }: {children: ReactNode}) {
  const urlParams = new URLSearchParams(window.location.search);
  let seed = urlParams.get('seed') || `${rand(1000000, 9999999)}`;
  const rng = useMemo(() => seedrandom(seed), [seed]);

  useEffect(() => {
    if (!urlParams.has('seed') || urlParams.get('seed') == '') {
      const newUrl = `${window.location.pathname}?seed=${seed}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [seed]);

  return (
    <SeedContext.Provider value={{ rng, seed }}>
      {children}
    </SeedContext.Provider>
  );
}

export default SeedProvider;
