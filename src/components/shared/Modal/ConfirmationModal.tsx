import React, { ReactNode } from "react";
import { Modal } from "antd";
import { AlertTriangle } from "lucide-react";
import Button from "../Button";

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
  title = "Confirm Action",
  content = `Are you sure that you want to delete ${item}?`,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={440}
      title={null}
      footer={null}
    >
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div className="w-14 h-14 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center mb-4 shadow-2xs">
          <AlertTriangle className="w-7 h-7 text-[#c77e3b]" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
        <p className="text-sm text-stone-600 max-w-sm leading-relaxed mb-6">
          {content}
        </p>
        <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-stone-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            title="Cancel"
            className="flex-1"
          />
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            title="Yes, Confirm"
            className="flex-1"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
