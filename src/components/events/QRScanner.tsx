"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
}

const qrcodeRegionId = "html5qr-code-full-region";

export function QRScanner({
  onScanSuccess,
  onScanFailure,
  fps = 10,
  qrbox = 250,
  aspectRatio = 1.0,
  disableFlip = false,
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const onScanSuccessRef = useRef(onScanSuccess);
  const onScanFailureRef = useRef(onScanFailure);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onScanFailureRef.current = onScanFailure;
  }, [onScanSuccess, onScanFailure]);

  useEffect(() => {
    // Initialize the scanner
    const config = {
      fps,
      qrbox,
      aspectRatio,
      disableFlip,
    };

    scannerRef.current = new Html5QrcodeScanner(qrcodeRegionId, config, false);

    scannerRef.current.render(
      (decodedText) => {
        onScanSuccessRef.current(decodedText);
      },
      (errorMessage) => {
        if (onScanFailureRef.current) onScanFailureRef.current(errorMessage);
      }
    );

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner", error);
        });
      }
    };
  }, [fps, qrbox, aspectRatio, disableFlip]);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
      <div id={qrcodeRegionId} className="w-full" />
      <style jsx global>{`
        #html5qr-code-full-region {
          border: none !important;
          padding: 0 !important;
        }
        #html5qr-code-full-region img {
          display: none;
        }
        #html5qr-code-full-region__dashboard_section_csr button {
          background-color: #0f172a !important;
          color: white !important;
          padding: 10px 20px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          border: none !important;
          margin: 10px 0 !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
        }
        #html5qr-code-full-region__dashboard_section_csr button:hover {
          background-color: #1e293b !important;
        }
        #html5qr-code-full-region__scan_region {
          background: #f1f5f9 !important;
        }
        #html5qr-code-full-region__status_span {
          font-size: 14px !important;
          color: #64748b !important;
        }
      `}</style>
    </div>
  );
}
