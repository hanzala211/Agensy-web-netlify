export const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ""
}) => {
  return <h3 className={`font-semibold text-[16px] ${className}`}>{children}</h3>;
};

export default H3;
