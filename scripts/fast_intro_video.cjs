const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const TMP_DIR = '/tmp/intro_fast';
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

async function run() {
  console.log('Generating fast intro video...');

  // 1. Scanner Image (0 - 3.5s)
  const scannerPath = path.join(TMP_DIR, '01_scanner.png');
  const scannerSvg = Buffer.from(`
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#083344" />
          <stop offset="50%" stop-color="#030712" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.8" />
          <stop offset="60%" stop-color="#0284c7" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="720" height="1280" fill="url(#bg)" />

      <!-- Concentric Hologram Circles -->
      <circle cx="360" cy="560" r="300" stroke="#0891b2" stroke-width="1.5" stroke-dasharray="8 12" fill="none" opacity="0.4" />
      <circle cx="360" cy="560" r="240" stroke="#06b6d4" stroke-width="2" stroke-dasharray="20 10" fill="none" opacity="0.7" />
      <circle cx="360" cy="560" r="180" stroke="#38bdf8" stroke-width="3" stroke-dasharray="14 8" fill="none" opacity="0.9" />
      <circle cx="360" cy="560" r="110" stroke="#fbbf24" stroke-width="2" fill="none" opacity="0.95" />

      <!-- Center Glow Core -->
      <circle cx="360" cy="560" r="90" fill="url(#coreGlow)" />

      <!-- Monogram -->
      <rect x="305" y="505" width="110" height="110" rx="24" fill="#030712" stroke="#22d3ee" stroke-width="3" />
      <text x="360" y="575" text-anchor="middle" fill="#22d3ee" font-family="sans-serif" font-size="46" font-weight="900" letter-spacing="2">IF</text>

      <!-- Tech HUD Info Panel -->
      <rect x="70" y="850" width="580" height="90" rx="18" fill="#09090b" fill-opacity="0.92" stroke="#06b6d4" stroke-width="1.5" />
      <circle cx="105" cy="895" r="8" fill="#22d3ee" />
      <text x="130" y="888" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="2">INITIALIZING 13.56 MHz NFC</text>
      <text x="130" y="915" fill="#a1a1aa" font-family="monospace" font-size="13" letter-spacing="1">ENCRYPTED QUANTUM HANDSHAKE OK</text>
      <text x="620" y="902" text-anchor="end" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold">ACTIVE</text>

      <!-- Corner brackets -->
      <path d="M 40 80 L 100 80 M 40 80 L 40 140" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 680 80 L 620 80 M 680 80 L 680 140" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 40 1200 L 100 1200 M 40 1200 L 40 1140" stroke="#06b6d4" stroke-width="3" fill="none" />
      <path d="M 680 1200 L 620 1200 M 680 1200 L 680 1140" stroke="#06b6d4" stroke-width="3" fill="none" />
    </svg>
  `);
  await sharp(scannerSvg).png().toFile(scannerPath);

  // 2. Cyber Tunnel Image (3.5 - 7.5s)
  const tunnelPath = path.join(TMP_DIR, '02_tunnel.png');
  const tunnelSvg = Buffer.from(`
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="tunnelGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="15%" stop-color="#38bdf8" />
          <stop offset="45%" stop-color="#0284c7" />
          <stop offset="75%" stop-color="#082f49" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
      </defs>
      <rect width="720" height="1280" fill="url(#tunnelGlow)" />

      <!-- Hyper-speed rays radiating from center -->
      <g stroke="#ffffff" stroke-width="2" opacity="0.8">
        <line x1="360" y1="640" x2="0" y2="0" stroke-width="4" stroke="#22d3ee" />
        <line x1="360" y1="640" x2="720" y2="0" stroke-width="4" stroke="#22d3ee" />
        <line x1="360" y1="640" x2="0" y2="1280" stroke-width="4" stroke="#22d3ee" />
        <line x1="360" y1="640" x2="720" y2="1280" stroke-width="4" stroke="#22d3ee" />
        
        <line x1="360" y1="640" x2="0" y2="320" stroke="#38bdf8" stroke-width="2" />
        <line x1="360" y1="640" x2="0" y2="640" stroke="#38bdf8" stroke-width="3" />
        <line x1="360" y1="640" x2="0" y2="960" stroke="#38bdf8" stroke-width="2" />
        <line x1="360" y1="640" x2="720" y2="320" stroke="#38bdf8" stroke-width="2" />
        <line x1="360" y1="640" x2="720" y2="640" stroke="#38bdf8" stroke-width="3" />
        <line x1="360" y1="640" x2="720" y2="960" stroke="#38bdf8" stroke-width="2" />

        <line x1="360" y1="640" x2="180" y2="0" stroke="#67e8f9" stroke-width="3" />
        <line x1="360" y1="640" x2="540" y2="0" stroke="#67e8f9" stroke-width="3" />
        <line x1="360" y1="640" x2="180" y2="1280" stroke="#67e8f9" stroke-width="3" />
        <line x1="360" y1="640" x2="540" y2="1280" stroke="#67e8f9" stroke-width="3" />
      </g>

      <!-- Center Warp Flare -->
      <circle cx="360" cy="640" r="140" fill="#ffffff" opacity="0.3" filter="blur(10px)" />
      <circle cx="360" cy="640" r="60" fill="#ffffff" />

      <!-- Speed readout HUD -->
      <rect x="180" y="980" width="360" height="60" rx="14" fill="#000000" fill-opacity="0.85" stroke="#38bdf8" stroke-width="2" />
      <text x="360" y="1018" text-anchor="middle" fill="#67e8f9" font-family="monospace" font-size="20" font-weight="900" letter-spacing="4">WARP VELOCITY: 99.8%</text>
    </svg>
  `);
  await sharp(tunnelSvg).png().toFile(tunnelPath);

  // 3. Portrait Reveal HUD Image (7.5 - 14.0s)
  const portraitPath = path.join(TMP_DIR, '03_portrait.png');
  const eduImgPath = '/tmp/extracted_images/edu-4.jpg';
  
  const portraitOverlaySvg = Buffer.from(`
    <svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stop-color="#000000" stop-opacity="0" />
          <stop offset="92%" stop-color="#000000" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.95" />
        </radialGradient>
        <linearGradient id="goldCyan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#06b6d4" />
          <stop offset="60%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#fbbf24" />
        </linearGradient>
      </defs>

      <rect width="720" height="1280" fill="url(#vignette)" />

      <!-- Top Header Badge -->
      <rect x="50" y="60" width="620" height="52" rx="14" fill="#030712" fill-opacity="0.9" stroke="#06b6d4" stroke-width="1.5" />
      <circle cx="80" cy="86" r="6" fill="#06b6d4" />
      <text x="100" y="92" fill="#22d3ee" font-family="monospace" font-size="15" font-weight="bold" letter-spacing="2">AUTHENTICATED: ILHAM FAZRIL</text>
      <text x="640" y="92" text-anchor="end" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold">13.56 MHz NFC</text>

      <!-- Reticle Ring -->
      <circle cx="360" cy="500" r="280" stroke="#06b6d4" stroke-width="2" stroke-dasharray="16 12" fill="none" opacity="0.6" />
      <circle cx="360" cy="500" r="300" stroke="#38bdf8" stroke-width="1" stroke-dasharray="6 8" fill="none" opacity="0.4" />

      <!-- Identity Card at Bottom -->
      <rect x="50" y="1030" width="620" height="190" rx="24" fill="#09090b" fill-opacity="0.92" stroke="url(#goldCyan)" stroke-width="2.5" />
      <text x="360" y="1085" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="900" letter-spacing="3">ILHAM FAZRIL</text>
      <text x="360" y="1125" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="3">WEB NFC &amp; FULL-STACK SPECIALIST</text>
      <line x1="120" y1="1145" x2="600" y2="1145" stroke="#06b6d4" stroke-width="1" opacity="0.5" />
      <text x="360" y="1182" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="13" letter-spacing="1">ACCESS GRANTED • OFFICIAL PORTFOLIO ENTERPRISE</text>
    </svg>
  `);

  if (fs.existsSync(eduImgPath)) {
    const resized = await sharp(eduImgPath)
      .resize(720, 1280, { fit: 'cover', position: 'center' })
      .toBuffer();
    await sharp(resized)
      .composite([{ input: portraitOverlaySvg, top: 0, left: 0 }])
      .png()
      .toFile(portraitPath);
  } else {
    await sharp(portraitOverlaySvg).png().toFile(portraitPath);
  }

  // 4. Synthesize Audio (0 - 14s)
  const audioOut = path.join(TMP_DIR, 'audio.aac');
  const audioCmd = `ffmpeg -y \
    -f lavfi -i "sine=frequency=110:duration=14[sub]; \
      sine=frequency=880:duration=3.5,afade=t=out:st=3:d=0.5,volume=0.25[beep]; \
      anoisesrc=d=4:c=pink:r=44100,lowpass=f=1400,highpass=f=300,afade=t=in:st=0:d=1,afade=t=out:st=3:d=1,adelay=3500|3500,volume=0.35[whoosh]; \
      sine=frequency=440:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.2[chord1]; \
      sine=frequency=554.37:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.2[chord2]; \
      sine=frequency=659.25:duration=6.5,afade=t=in:st=0:d=0.5,afade=t=out:st=5.5:d=1,adelay=7500|7500,volume=0.2[chord3]; \
      [sub]volume=0.15[sublow]; \
      [sublow][beep][whoosh][chord1][chord2][chord3]amix=inputs=6:duration=longest,afade=t=out:st=13.2:d=0.8" \
    -c:a aac -b:a 128k "${audioOut}"`;
  execSync(audioCmd);
  console.log('✓ Audio ready');

  // 5. Fast Render Video (3 concatenated image clips with transitions)
  // Clip 1: 3.5s
  // Clip 2: 4.0s
  // Clip 3: 6.5s
  // Total: 14.0s
  const finalDest = '/app/applet/public/intro.mp4';
  const renderCmd = `ffmpeg -y \
    -loop 1 -t 3.5 -i "${scannerPath}" \
    -loop 1 -t 4.0 -i "${tunnelPath}" \
    -loop 1 -t 6.5 -i "${portraitPath}" \
    -i "${audioOut}" \
    -filter_complex "\
      [0:v]fade=t=out:st=3.0:d=0.5[v0]; \
      [1:v]fade=t=in:st=0:d=0.5,fade=t=out:st=3.5:d=0.5[v1]; \
      [2:v]fade=t=in:st=0:d=0.5,fade=t=out:st=6.0:d=0.5[v2]; \
      [v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[v]" \
    -map "[v]" -map 3:a -c:v libx264 -preset ultrafast -crf 22 -c:a copy -shortest -movflags +faststart "${finalDest}"`;

  execSync(renderCmd);
  const stat = fs.statSync(finalDest);
  console.log(`\n🎉 SUCCESS! /public/intro.mp4 created! Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
