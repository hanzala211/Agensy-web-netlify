import { Badge } from "antd";
import type React from "react";

interface AntdBadgeProps {
  status: "success" | "processing" | "default" | "error";
  size: "default" | "small" | "large";
  text?: string;
}

export const AntdBadge: React.FC<AntdBadgeProps> = ({ status, size, text }) => {
  return (
    <Badge
      // @ts-expect-error - Ant Design v5 Badge component type definition issue with status prop
      status={status}
      size={size}
      text={text}
    />
  );
};

export default AntdBadge;
