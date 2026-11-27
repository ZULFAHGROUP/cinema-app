import React from "react";
import { Modal, Spin } from "antd";
import Button from "../Button";

interface CustomModalProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  subtitle?: string;
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
  subtitle,
  children,
  onConfirm,
  confirmText = "Confirm",
  isLoading = false,
  isCancelButton = false,
  width = 580,
}) => {
  const hasFooter = Boolean(isCancelButton || onConfirm);

  return (
    <Modal
      open={open}
      className="modern-display-modal md:min-w-[32rem]"
      onCancel={onClose}
      width={width}
      centered
      destroyOnClose
      title={
        title ? (
          <div className="pb-3 mb-1 border-b border-stone-200/80">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#c77e3b] to-[#754f2c] inline-block shrink-0" />
              <span className="text-lg font-bold text-stone-900 tracking-tight font-sans">
                {title}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs font-normal text-stone-500 mt-1 pl-4">
                {subtitle}
              </p>
            )}
          </div>
        ) : null
      }
      footer={
        hasFooter ? (
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            {isCancelButton && (
              <Button variant="outline" onClick={onClose} title="Cancel" />
            )}
            {onConfirm && (
              <Button
                variant="primary"
                onClick={onConfirm}
                loading={isLoading}
                title={confirmText}
              />
            )}
          </div>
        ) : null
      }
    >
      <div className="pt-1">
        {isLoading ? <Spin>{children}</Spin> : children}
      </div>
    </Modal>
  );
};

export default DisplayModal;
