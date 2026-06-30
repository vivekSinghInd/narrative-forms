import { createContext, useContext, useState, type ReactNode } from "react";

export type Framework = "react" | "vue" | "angular" | "native";

interface FrameworkContextType {
  framework: Framework;
  setFramework: (framework: Framework) => void;
}

const FrameworkContext = createContext<FrameworkContextType>({
  framework: "react",
  setFramework: () => {},
});

export function FrameworkProvider({ children }: { children: ReactNode }) {
  const [framework, setFramework] = useState<Framework>("react");

  return (
    <FrameworkContext.Provider value={{ framework, setFramework }}>
      {children}
    </FrameworkContext.Provider>
  );
}

export function useFramework() {
  return useContext(FrameworkContext);
}
