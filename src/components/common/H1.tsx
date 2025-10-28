interface H1Props {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<H1Props> = ({ children, className }) => {
  return (
    <h1
      className={`${className} md:text-[36px] font-semibold text-darkGray text-[24px]`}
    >
      {children}
    </h1>
  );
};

export default H1;
