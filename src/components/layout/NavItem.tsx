interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
  aria_label?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  onClick,
  isActive,
  aria_label,
}) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-primaryColor/10 text-primaryColor font-medium shadow-[0_0_8px_rgba(0,0,0,0.06)]"
          : "text-darkGray hover:bg-gray-100 hover:text-primaryColor"
      } touch-manipulation focus:outline-none`}
      onClick={onClick}
      aria-label={
        aria_label || `${isActive ? "Current page:" : "Go to"} ${label}`
      }
      aria-current={isActive ? "page" : undefined}
    >
      <div
        className={`${
          isActive ? "text-primaryColor" : "text-slateGrey"
        } transition-colors duration-300 flex-shrink-0`}
      >
        {icon}
      </div>
      <span className="text-sm">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-5 rounded-full bg-primaryColor flex-shrink-0"></div>
      )}
    </button>
  );
};

export default NavItem;
