import { CommonLoader } from "@agensy/components";
import { COLORS } from "@agensy/constants";

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-lightGray">
      <CommonLoader color={COLORS.primaryColor} />
    </div>
  );
};

export default LoadingScreen;
