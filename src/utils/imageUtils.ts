/**
 * Utilities for image compression and conversion to Base64
 * Ensures user uploads fit comfortably within LocalStorage
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export function processAndCompressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.80,
    format = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan merupakan format gambar valid.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Gagal membaca file gambar dari perangkat.'));

    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        reject(new Error('Hasil pembacaan gambar kosong.'));
        return;
      }

      // If svg, return raw base64 or svg directly
      if (file.type === 'image/svg+xml') {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses file gambar.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio scale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original src if canvas 2d context unavailable
          resolve(src);
          return;
        }

        // Fill background white for JPEG to avoid black transparent backgrounds
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL(format, quality);
          resolve(compressedDataUrl);
        } catch {
          // Fallback to original
          resolve(src);
        }
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Returns estimated size in KB for a Base64 data URL
 */
export function getImageSizeKb(dataUrl: string): number {
  if (!dataUrl || !dataUrl.includes(',')) return 0;
  const base64Str = dataUrl.split(',')[1] || '';
  const bytes = Math.round((base64Str.length * 3) / 4);
  return Math.round(bytes / 1024);
}

