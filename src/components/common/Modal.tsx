import React, { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
  height?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-3xl",
  footer,
  height = "h-[90vh]",
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-all duration-300 fixed inset-0 z-[100] flex items-center justify-center p-4`}
    >
      <div
        className={`${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300`}
        onClick={onClose}
      />

      <div
        className={`relative z-[500] bg-white rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.15)] w-full ${maxWidth} flex flex-col ${height} m-4`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10 rounded-t-lg">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 focus:outline-none"
            aria-label="Close modal"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white z-10 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
