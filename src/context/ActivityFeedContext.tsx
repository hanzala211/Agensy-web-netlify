import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ActivityFeedContextType {
  isActivityFeedOpen: boolean;
  toggleActivityFeed: () => void;
  closeActivityFeed: () => void;
}

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(
  undefined
);

export const ActivityFeedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState<boolean>(false);

  const toggleActivityFeed = () => {
    setIsActivityFeedOpen((prev) => !prev);
  };

  const closeActivityFeed = () => {
    setIsActivityFeedOpen(false);
  };

  return (
    <ActivityFeedContext.Provider
      value={{
        isActivityFeedOpen,
        toggleActivityFeed,
        closeActivityFeed,
      }}
    >
      {children}
    </ActivityFeedContext.Provider>
  );
};

export const useActivityFeedContext = (): ActivityFeedContextType => {
  const context = useContext(ActivityFeedContext);
  if (context === undefined) {
    throw new Error(
      "useActivityFeedContext must be used within an ActivityFeedProvider"
    );
  }
  return context;
};
