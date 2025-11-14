import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface HeaderConfig {
  buttonText?: string;
  buttonAriaLabel?: string;
  onButtonClick?: () => void; // Function to execute when primary button is clicked
  showButton?: boolean;
  showBackButton?: boolean;
  disabled?: boolean;
  title?: string; // Optional override for title
  chatPageBackLink?: string; // Back link for chat page (uses anchor tag to reload app)
}

interface HeaderContextType {
  headerConfig: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
  resetHeaderConfig: () => void;
}

const defaultConfig: HeaderConfig = {
  showButton: false,
  showBackButton: false,
  disabled: false,
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [headerConfig, setHeaderConfigState] =
    useState<HeaderConfig>(defaultConfig);

  const setHeaderConfig = (config: HeaderConfig) => {
    setHeaderConfigState((prev) => ({ ...prev, ...config }));
  };

  const resetHeaderConfig = () => {
    setHeaderConfigState(defaultConfig);
  };

  return (
    <HeaderContext.Provider
      value={{ headerConfig, setHeaderConfig, resetHeaderConfig }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within HeaderProvider");
  }
  return context;
};
