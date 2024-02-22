import {
  Html5QrcodeScanner,
  type QrcodeErrorCallback,
  type QrcodeSuccessCallback,
} from "html5-qrcode";
import { type Html5QrcodeScannerConfig } from "html5-qrcode/html5-qrcode-scanner";
import { useEffect } from "react";

export const scanBarcodeViewId = "scan-barcode-view";

export interface Html5QrcodePluginProps {
  onSuccess?: QrcodeSuccessCallback;
  onError?: QrcodeErrorCallback;
}

export const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  useEffect(() => {
    const config: Html5QrcodeScannerConfig = {
      fps: 15,
      qrbox: {
        width: 300,
        height: 200,
      },
      disableFlip: false,
    };
    const verbose = true;
    const html5QrcodeScanner = new Html5QrcodeScanner(
      scanBarcodeViewId,
      config,
      verbose,
    );

    const successDefaultCb: QrcodeSuccessCallback = (_, result) =>
      console.log(Html5QrcodeScanner.name, result);

    html5QrcodeScanner.render(
      props.onSuccess ?? successDefaultCb,
      props.onError,
    );
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  });

  return <div id={scanBarcodeViewId}></div>;
};
