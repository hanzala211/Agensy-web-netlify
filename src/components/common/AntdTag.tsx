import { Tag, type TagProps } from "antd";

interface AntdTagProps extends TagProps {
  color: string;
  children: React.ReactNode;
}

export const AntdTag: React.FC<AntdTagProps> = ({ children, ...props }) => {
  return <Tag {...props}>{children}</Tag>;
};

export default AntdTag;
