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
      } transition-all duration-300 fixed inset-0 z-[100] flex items-center justify-center`}
    >
      <div
        className={`${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } fixed inset-0 bg-black bg-opacity-70 transition-all duration-300`}
        onClick={onClose}
      />

      <div
        className={`relative z-[500] bg-white rounded-xl shadow-2xl w-full ${maxWidth} flex flex-col ${height}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-basicWhite z-10 rounded-t-xl">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-basicWhite z-10 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
