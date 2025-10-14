import React, { ReactNode } from "react";
import { Modal, Button } from "antd";
import {
  ExclamationCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  title?: string;
  content?: string;
  item?: ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  item,
  title = "Confirm this ?",
  content = `Are you sure that you want to delete ${item}?`,
}) => {
  return (
    <Modal
      open={open}
      className="p-6 space-y-8"
      onCancel={onCancel}
      centered
      title={
        <div className="flex flex-col gap-4 items-center">
          <ExclamationCircleOutlined
            className="animate-pulse"
            style={{ fontSize: 40, color: "#faad14" }}
          />
          {title}
        </div>
      }
      footer={[
        <div className="flex justify-center gap-4 mt-6">
          <Button
            key="cancel"
            onClick={onCancel}
            className="bg-gray-400"
            icon={<DislikeOutlined />}
          >
            No
          </Button>
          <Button
            key="confirm"
            type="primary"
            onClick={onConfirm}
            icon={<LikeOutlined />}
            className="bg-secondary"
          >
            Yes!
          </Button>
          ,
        </div>,
      ]}
    >
      <p className="text-center">{content}</p>
    </Modal>
  );
};

export default ConfirmationModal;
