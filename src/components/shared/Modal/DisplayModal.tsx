import React from "react";
import { Modal, Button, Spin } from "antd";

interface CustomModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  isLoading?: boolean;
  isCancelButton?: boolean;
  width?: number;
}

const DisplayModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = "Confirm",
  isLoading = false,
  isCancelButton = false,
  width,
}) => {
  return (
    <Modal
      open={open}
      className="md:min-w-[30rem]" //
      onCancel={onClose}
      width={width}
      title={title}
      footer={[
        isCancelButton && (
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>
        ),
        onConfirm && (
          <Button
            key="confirm"
            type="primary"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        ),
      ]}
    >
      {isLoading ? <Spin>{children}</Spin> : children}
    </Modal>
  );
};

export default DisplayModal;
