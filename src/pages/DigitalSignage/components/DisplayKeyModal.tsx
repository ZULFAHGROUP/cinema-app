import { Modal } from "antd";
import { Copy, KeyRound, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button";

interface DisplayKeyModalProps {
  displayName?: string;
  displayKey: string | null;
  onClose: () => void;
}

const DisplayKeyModal = ({
  displayName,
  displayKey,
  onClose,
}: DisplayKeyModalProps) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(displayKey || "");
      toast.success("Display key copied");
    } catch {
      toast.error("Couldn't copy. Select the key and copy it manually.");
    }
  };

  return (
    <Modal
      open={Boolean(displayKey)}
      onCancel={onClose}
      maskClosable={false}
      centered
      title={
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200/80">
          <div className="w-8 h-8 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-stone-900">
            Display Key{displayName ? ` — ${displayName}` : ""}
          </span>
        </div>
      }
      footer={
        <div className="flex justify-end pt-3 border-t border-stone-100">
          <Button title="I've Saved This Key" onClick={onClose} />
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Enter this key in the screen's player app.{" "}
            <strong>It will only be shown once.</strong> If lost, you can rotate
            a new key from the display's action menu.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 bg-stone-900 text-[#fff8ea] rounded-xl px-4 py-3 text-sm font-mono break-all select-all">
            {displayKey}
          </code>
          <Button
            variant="outline"
            icon={<Copy className="w-4 h-4" />}
            title="Copy"
            onClick={copy}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DisplayKeyModal;
