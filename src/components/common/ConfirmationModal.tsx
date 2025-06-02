import { Modal } from "antd";
import React from "react";

interface ConfirmationModalProps {
  title: string;
  children: React.ReactNode;
  isModalOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  children,
  isModalOpen,
  onOk,
  onCancel,
}) => {
  return (
    <React.Fragment>
      {/* @ts-expect-error // Antd Modal props are not typed */}
      <Modal
        title={title}
        centered
        open={isModalOpen}
        onOk={onOk}
        onCancel={onCancel}
        okText="Yes"
        cancelText="No"
      >
        {children}
      </Modal>
    </React.Fragment>
  );
};

export default ConfirmationModal;
