import { Modal } from "antd";
import { Copy, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button";

interface DisplayKeyModalProps {
  displayName?: string;
  displayKey: string | null;
  onClose: () => void;
}

/** The API shows a display's key once; after this dialog it can only be replaced. */
const DisplayKeyModal = ({ displayName, displayKey, onClose }: DisplayKeyModalProps) => {
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
      title={
        <span className="flex items-center gap-2">
          <KeyRound className="w-5 h-5" /> Display key{displayName ? `: ${displayName}` : ""}
        </span>
      }
      footer={<Button className="rounded-md" title="I've saved it" onClick={onClose} />}
    >
      <div className="space-y-3">
        <p className="text-sm">
          Enter this key in the screen's player app. <strong>It won't be shown again.</strong> If
          it's lost, create a new key from the display's menu.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-gray-100 rounded px-3 py-2 text-sm break-all select-all">{displayKey}</code>
          <Button variant="outline" className="rounded-md" icon={<Copy className="w-4 h-4" />} onClick={copy} />
        </div>
      </div>
    </Modal>
  );
};

export default DisplayKeyModal;
