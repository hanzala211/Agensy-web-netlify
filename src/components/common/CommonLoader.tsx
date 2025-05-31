import { COLORS } from "@agensy/constants";
import { BeatLoader } from "react-spinners";

export const CommonLoader: React.FC<{ color?: string; size?: number }> = ({
  color = COLORS.primaryColor,
  size = 20,
}) => {
  return <BeatLoader color={color} size={size} />;
};
