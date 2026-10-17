const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const TMP_DIR = '/tmp/intro_build';
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

async function buildVideo() {
  console.log('--- Starting Intro Video Generation ---');
  
  // 1. Prepare portrait background for final reveal (7.5s - 14.0s)
  const eduImgPath = '/tmp/extracted_images/edu-4.jpg';
  const portraitOut = path.join(TMP_DIR, 'portrait_hud.png');
  
  // Create high-res 720x1280 canvas with cyber HUD overlay
  const overlaySvg = Buffer.from(`
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#000000" stop-opacity="0" />
          <stop offset="95%" stop-color="#000000" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.98" />
        </radialGradient>
        <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#eab308" />
        </linearGradient>
      </defs>

      <!-- Vignette -->
      <rect width="720" height="1280" fill="url(#vignette)" />

      <!-- Top HUD Header -->
      <rect x="40" y="60" width="640" height="50" rx="12" fill="#030712" fill-opacity="0.85" stroke="#06b6d4" stroke-width="1.5" />
      <circle cx="70" cy="85" r="7" fill="#06b6d4" />
      <text x="90" y="90" fill="#22d3ee" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="2">SYSTEM IDENTIFIED: ILHAM FAZRIL</text>
      <text x="640" y="90" text-anchor="end" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold">13.56 MHz NFC</text>

      <!-- Tech Crosshairs & Framing Corners around portrait -->
      <path d="M 60 160 L 120 160 M 60 160 L 60 220" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 660 160 L 600 160 M 660 160 L 660 220" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 60 1000 L 120 1000 M 60 1000 L 60 940" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 660 1000 L 600 1000 M 660 1000 L 660 940" stroke="#06b6d4" stroke-width="3" fill="none" />

      <!-- Reticle Circle Accent -->
      <circle cx="360" cy="500" r="260" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="10 15" fill="none" opacity="0.6" />
      <circle cx="360" cy="500" r="280" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4 8" fill="none" opacity="0.4" />

      <!-- Bottom Identity Card Card -->
      <rect x="50" y="1030" width="620" height="190" rx="24" fill="#09090b" fill-opacity="0.9" stroke="url(#cyberGrad)" stroke-width="2" />
      <text x="360" y="1085" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="900" letter-spacing="3">ILHAM FAZRIL</text>
      <text x="360" y="1125" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="3">WEB NFC &amp; FULL-STACK SPECIALIST</text>
      <line x1="120" y1="1145" x2="600" y2="1145" stroke="#06b6d4" stroke-width="1" opacity="0.5" />
      <text x="360" y="1180" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="13" letter-spacing="1">ACCESS GRANTED • OFFICIAL PORTFOLIO ENTERPRISE</text>
    </svg>
  `);

  if (fs.existsSync(eduImgPath)) {
    // Resize photo to fit portrait nicely, composite with HUD overlay
    const portraitResized = await sharp(eduImgPath)
      .resize(720, 1280, { fit: 'cover', position: 'center' })
      .toBuffer();

    await sharp(portraitResized)
      .composite([{ input: overlaySvg, top: 0, left: 0 }])
      .png()
      .toFile(portraitOut);
    console.log('✓ Portrait HUD prepared successfully');
  }

  // 2. Prepare Opening Scanner HUD Image (0 - 3.5s)
  const scannerImgPath = path.join(TMP_DIR, 'scanner_hud.png');
  const scannerSvg = Buffer.from(`
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <rect width="720" height="1280" fill="#030712" />
      
      <!-- Grid Lines -->
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#082f49" stroke-width="1" />
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#030712" stop-opacity="0" />
        </radialGradient>
      </defs>
      
      <rect width="720" height="1280" fill="url(#grid)" />
      <circle cx="360" cy="600" r="320" fill="url(#glow)" />

      <!-- Concentric Holographic HUD Rings -->
      <circle cx="360" cy="600" r="220" stroke="#06b6d4" stroke-width="3" fill="none" opacity="0.8" />
      <circle cx="360" cy="600" r="180" stroke="#38bdf8" stroke-width="2" stroke-dasharray="25 15" fill="none" opacity="0.9" />
      <circle cx="360" cy="600" r="140" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="8 6" fill="none" opacity="0.7" />
      <circle cx="360" cy="600" r="90" stroke="#fbbf24" stroke-width="2" stroke-dasharray="30 20" fill="none" opacity="0.9" />

      <!-- Center Touch Reticle Monogram -->
      <rect x="300" y="540" width="120" height="120" rx="28" fill="#000000" stroke="#06b6d4" stroke-width="3" />
      <text x="360" y="615" text-anchor="middle" fill="#22d3ee" font-family="sans-serif" font-size="52" font-weight="900" letter-spacing="2">IF</text>

      <!-- Scanning HUD text -->
      <rect x="80" y="860" width="560" height="60" rx="16" fill="#09090b" fill-opacity="0.9" stroke="#06b6d4" stroke-width="1.5" />
      <text x="360" y="897" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold" letter-spacing="2">AUTHENTICATING 13.56 MHz NFC...</text>

      <text x="360" y="970" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="14" letter-spacing="3">INITIALIZING CYBERSPACE MATRIX</text>
    </svg>
  `);
  await sharp(scannerSvg).png().toFile(scannerImgPath);
  console.log('✓ Scanner HUD prepared successfully');

  // 3. Synthesize 14-second Cyber Audio track using FFmpeg sine waves & noise filters
  const audioOut = path.join(TMP_DIR, 'cyber_audio.aac');
  console.log('Synthesizing 14-second audio...');
  
  // Audio design:
  // 0-3.5s: 110Hz sub drone + periodic 880Hz scanner beeps
  // 3.5-7.5s: sweeping cyber riser whoosh
  // 7.5-14s: glorious warm chord (440Hz + 554Hz + 659Hz) + gentle low hum
  const audioCmd = `ffmpeg -y \
    -f lavfi -i "sine=frequency=110:duration=14[sub]; \
      sine=frequency=880:duration=3.5,afade=t=out:st=3:d=0.5,volume=0.3[beep]; \
      anoisesrc=d=4:c=pink:r=44100,lowpass=f=1200,highpass=f=200,afade=t=in:st=0:d=1,afade=t=out:st=3:d=1,adelay=3500|3500,volume=0.4[whoosh]; \
      sine=frequency=440:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.25[chord1]; \
      sine=frequency=554.37:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.2[chord2]; \
      sine=frequency=659.25:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.2[chord3]; \
      [sub]volume=0.15[sublow]; \
      [sublow][beep][whoosh][chord1][chord2][chord3]amix=inputs=6:duration=longest,afade=t=out:st=13.2:d=0.8" \
    -c:a aac -b:a 128k "${audioOut}"`;

  execSync(audioCmd, { stdio: 'inherit' });
  console.log('✓ Audio track synthesized');

  // 4. Generate 14-second Video using FFmpeg
  // Part 1: Scanner (0-3.5s) with subtle zoom
  // Part 2: Cyber Tunnel (3.5-7.5s) using mandelbrot/test pattern with cyan color grading
  // Part 3: Ilham Fazril Portrait HUD (7.5-14.0s) with cinematic slow zoom and light fade
  const videoOut = path.join(TMP_DIR, 'intro_video_clean.mp4');
  console.log('Rendering 14-second video sequence...');

  const videoCmd = `ffmpeg -y \
    -loop 1 -t 3.5 -i "${scannerImgPath}" \
    -f lavfi -t 4 -i "mandelbrot=size=720x1280:rate=30:maxiter=120" \
    -loop 1 -t 6.5 -i "${portraitOut}" \
    -filter_complex "\
      [0:v]scale=720:1280,format=yuv420p,fade=t=out:st=3.0:d=0.5[v0]; \
      [1:v]colorchannelmixer=rr=0.1:rg=0.8:rb=1.0:br=0.1:bg=0.7:bb=1.0,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v1]; \
      [2:v]scale=720:1280,format=yuv420p,fade=t=in:st=0:d=0.5,fade=t=out:st=6.0:d=0.5[v2]; \
      [v0][v1][v2]concat=n=3:v=1:a=0[vconcat]" \
    -map "[vconcat]" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p "${videoOut}"`;

  execSync(videoCmd, { stdio: 'inherit' });
  console.log('✓ Video track rendered');

  // 5. Mux Video + Audio into final public/intro.mp4
  const finalDest = '/app/applet/public/intro.mp4';
  const muxCmd = `ffmpeg -y -i "${videoOut}" -i "${audioOut}" -c:v copy -c:a aac -shortest -movflags +faststart "${finalDest}"`;
  execSync(muxCmd, { stdio: 'inherit' });

  const stats = fs.statSync(finalDest);
  console.log(`\n🎉 SUCCESS! /public/intro.mp4 created! Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

buildVideo().catch((err) => {
  console.error('Build video failed:', err);
  process.exit(1);
});
