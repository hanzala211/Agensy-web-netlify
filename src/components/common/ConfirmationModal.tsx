import React, { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { PrimaryButton } from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

interface ConfirmationModalProps {
  title: string;
  children: React.ReactNode;
  isModalOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  children,
  isModalOpen,
  onOk,
  onCancel,
  okText = "Yes",
  cancelText = "No",
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, onCancel]);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onCancel}
      />

      <div className="relative z-[500] bg-white rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.15)] w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 focus:outline-none"
            aria-label="Close modal"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="p-6 text-gray-700">{children}</div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <SecondaryButton
            onClick={onCancel}
            className="!min-h-[24px] !text-[13px] !px-6 !py-2 hover:!bg-gray-100 !w-auto !rounded-lg"
            aria_label={cancelText}
          >
            {cancelText}
          </SecondaryButton>
          <PrimaryButton
            onClick={onOk}
            isLoading={isLoading}
            className="!min-h-[24px] !text-[13px] !px-6 !py-2 !w-auto"
            aria_label={okText}
          >
            {okText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
