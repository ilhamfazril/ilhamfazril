import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file video yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, 'intro.mp4');
    const tempRawPath = path.join(publicDir, 'intro_temp_raw.mp4');
    fs.writeFileSync(tempRawPath, buffer);

    // Save as raw master backup as well
    const backupPath = path.join(publicDir, 'intro_real_backup.mp4');
    try {
      fs.copyFileSync(tempRawPath, backupPath);
    } catch {}

    // Compress with FFmpeg if available
    try {
      const { execSync } = await import('child_process');
      const tempCompressedPath = path.join(publicDir, 'intro_temp_comp.mp4');
      execSync(`ffmpeg -i "${tempRawPath}" -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "${tempCompressedPath}"`);
      fs.renameSync(tempCompressedPath, targetPath);
      if (fs.existsSync(tempRawPath)) fs.unlinkSync(tempRawPath);
    } catch (ffmpegErr) {
      console.warn('FFmpeg compression fallback, saving raw video:', ffmpegErr);
      if (fs.existsSync(tempRawPath)) {
        fs.renameSync(tempRawPath, targetPath);
      }
    }

    const finalStats = fs.statSync(targetPath);

    return NextResponse.json({
      success: true,
      message: 'Video intro berhasil diunggah dan dikompresi optimal!',
      size: finalStats.size,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah video: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
