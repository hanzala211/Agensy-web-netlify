import { Badge } from "antd";
import type React from "react";

interface AntdBadgeProps {
  status: "success" | "processing" | "default" | "error";
  size: "default" | "small" | "large";
  text?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const AntdBadge: React.FC<AntdBadgeProps> = ({
  status,
  size,
  text,
  onClick,
  className,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`} onClick={onClick}>
      <Badge
        // @ts-expect-error - Ant Design v5 Badge component type definition issue with status prop
        status={status}
        size={size}
        style={{ transform: "scale(1.3)" }}
      />
      <p className="text-[12px] xl:text-[14px] line-clamp-2">{text}</p>
    </div>
  );
};

export default AntdBadge;
