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
          <div className="pb-3.5 mb-1 border-b border-[#e6dfd3]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c77e3b] inline-block shrink-0" />
              <span className="font-display text-lg font-bold text-[#12161c] tracking-tight">
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
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e6dfd3]">
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
