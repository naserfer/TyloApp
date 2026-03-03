"use client";

import { createContext, useContext, type ReactNode } from "react";

type IntroContextType = {
  introClosed: boolean;
};

export const IntroContext = createContext<IntroContextType>({ introClosed: true });

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: IntroContextType;
}) {
  return (
    <IntroContext.Provider value={value}>
      {children}
    </IntroContext.Provider>
  );
}
