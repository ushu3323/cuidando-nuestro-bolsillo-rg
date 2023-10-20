import { Dialog } from "primereact/dialog";
import {
  Html5QrcodePlugin,
  type Html5QrcodePluginProps,
} from "./Html5QrcodePlugin";

interface ScanBarcodeDialogProps {
  visible: boolean;
  onHide: () => void;
}

export default function ScanBarcodeDialog({
  visible,
  onHide,
  onSuccess,
  onError,
}: ScanBarcodeDialogProps & Html5QrcodePluginProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      draggable={false}
      maximized={true}
      maximizable={true}
    >
      <Html5QrcodePlugin
        onSuccess={onSuccess}
        onError={onError}
      ></Html5QrcodePlugin>
    </Dialog>
  );
}
