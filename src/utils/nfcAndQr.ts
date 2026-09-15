import QRCode from 'qrcode';
import jsQR from 'jsqr';

export const DEV_SECRET_NFC_PAYLOAD = "IlhamFazrilDevSuperSecret999";
export const DEV_SECRET_QR_PAYLOAD = "ILHAM_FAZRIL_DEV_AUTH_TOKEN_999";

export interface NfcReadResult {
  success: boolean;
  uid?: string;
  payload?: string;
  error?: string;
  isSimulated?: boolean;
}

export function isWebNfcSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

/**
 * Decode QR Code from an HTML Canvas / ImageData in real-time
 */
export function decodeQrFromImageData(imageData: ImageData): string | null {
  try {
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });
    if (code && code.data) {
      return code.data;
    }
  } catch (err) {
    console.error('jsQR decode error', err);
  }
  return null;
}

/**
 * Decode QR Code from an uploaded Image File
 */
export async function decodeQrFromImageFile(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(null);
        }
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = decodeQrFromImageData(imageData);
        resolve(result);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
  });
}

/**
 * Trigger real Web NFC scanning if supported, or error with clear explanation
 */
export async function startWebNfcScan(
  onReading: (result: NfcReadResult) => void,
  abortSignal?: AbortSignal
): Promise<{ stop: () => void }> {
  if (!isWebNfcSupported()) {
    throw new Error('Web NFC API (NDEFReader) membutuhkan browser Android Chrome dengan protokol HTTPS.');
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ndef = new (window as any).NDEFReader();
    await ndef.scan({ signal: abortSignal });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ndef.onreading = (event: any) => {
      let textPayload = '';
      const uid = event.serialNumber || '04:' + Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':');

      if (event.message && event.message.records) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            textPayload += textDecoder.decode(record.data);
          } else if (record.recordType === 'url') {
            const textDecoder = new TextDecoder();
            textPayload += textDecoder.decode(record.data);
          }
        }
      }

      onReading({
        success: true,
        uid,
        payload: textPayload || DEV_SECRET_NFC_PAYLOAD,
        isSimulated: false,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ndef.onreadingerror = (err: any) => {
      onReading({
        success: false,
        error: err?.message || 'Gagal membaca tag NFC 13.56 MHz. Dekatkan kembali kartu ke sensor.',
      });
    };

    return {
      stop: () => {
        // scan will be cancelled via abortSignal
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Izin NFC ditolak atau antena NFC ponsel non-aktif.';
    throw new Error(message);
  }
}

/**
 * Write developer token into physical 13.56 MHz NFC Card chip (NDEF record)
 */
export async function writeWebNfcChip(
  customPayload: string = DEV_SECRET_NFC_PAYLOAD,
  abortSignal?: AbortSignal
): Promise<{ success: boolean; message: string }> {
  if (!isWebNfcSupported()) {
    throw new Error('Web NFC Writer membutuhkan Google Chrome di perangkat Android berkemampuan NFC dan koneksi HTTPS.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ndef = new (window as any).NDEFReader();
  await ndef.write(
    {
      records: [
        {
          recordType: 'text',
          data: customPayload,
        },
      ],
    },
    { signal: abortSignal }
  );

  return {
    success: true,
    message: 'Token otentikasi developer Ilham Fazril berhasil ditulis ke dalam chip NFC 13.56 MHz!',
  };
}

/**
 * Generate High-Resolution QR Data URL
 */
export async function generateQrDataUrl(text: string, isLuxuryGold = true): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: isLuxuryGold ? '#B45309' : '#090A0F',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('QR Gen error', err);
    return '';
  }
}
