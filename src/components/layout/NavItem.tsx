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
      className={`w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-lg transition-all duration-200 ${isActive
          ? 'bg-primaryColor/15 text-primaryColor font-medium shadow-sm'
          : 'text-darkGray hover:bg-lightGray hover:text-primaryColor/80 active:bg-lightGray/80'
        } touch-manipulation focus:outline-none focus:ring-2 focus:ring-primaryColor/20 focus-visible:ring-2`}
      onClick={onClick}
      aria-label={
        aria_label || `${isActive ? 'Current page:' : 'Go to'} ${label}`
      }
      aria-current={isActive ? 'page' : undefined}
    >
      <div
        className={`${isActive ? 'text-primaryColor' : 'text-slateGrey'
          } transition-colors duration-200 flex-shrink-0`}
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
