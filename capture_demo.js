import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import fs from 'fs';
import { execSync } from 'child_process';

const VIDEO_ONLY = './video_raw.mp4';
const AUDIO_ONLY = './audio_raw.webm';
const FINAL_OUTPUT = './output_kreggscode.mp4';

(async () => {
    // Extract algorithm, theme, and size from command line arguments or use defaults
    const args = process.argv.slice(2);
    const SELECTED_ALGO = args[0] || 'HEAP';
    const SELECTED_THEME = args[1] || 'GREEN';
    const SELECTED_SIZE = args[2] || '24';

    console.log(`🚀 Launching Capture Engine: [${SELECTED_ALGO}] [${SELECTED_THEME}]...`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    const audioChunks = [];
    await page.exposeFunction('sendAudioChunk', (base64) => {
        audioChunks.push(Buffer.from(base64, 'base64'));
    });

    console.log('🎙️ Injecting Audio & Video Sync Logic...');
    await page.evaluateOnNewDocument(() => {
        const originalCreateElement = document.createElement;
        window.isSortingCompleted = false;

        window.initAudioCapture = () => {
            if (!window.audioService) return console.error('audioService not found');
            window.audioService.init();

            const ctx = window.audioService.ctx;
            const dest = ctx.createMediaStreamDestination();

            // Connect global audio to our destination
            if (window.audioService.masterGain) {
                window.audioService.masterGain.connect(dest);
            }

            const recorder = new MediaRecorder(dest.stream, { mimeType: 'audio/webm' });
            recorder.ondataavailable = async (e) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1];
                    window.sendAudioChunk(base64);
                };
                reader.readAsDataURL(e.data);
            };
            recorder.start(100);
            window.audioRecorder = recorder;
        };
    });

    console.log('📡 Navigating to Application...');
    const url = `http://localhost:3001/?size=${SELECTED_SIZE}&speed=84&algorithm=${SELECTED_ALGO}&theme=${SELECTED_THEME}&shape=BAR&auto=false`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: true,
        fps: 60,
        videoFrame: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
    });

    const beginBtn = await page.waitForSelector('button');
    console.log('🖱️ Clicking Begin Experience...');

    await page.evaluate(() => window.initAudioCapture());
    await recorder.start(VIDEO_ONLY);
    await beginBtn.click();

    console.log('⏳ Recording in progress...');
    await page.waitForFunction(() => window.isSortingCompleted === true, { timeout: 180000 });

    // Extra buffer for finish sound
    await new Promise(r => setTimeout(r, 3000));

    console.log('✨ Sort finished. Capturing finale...');

    await page.evaluate(() => {
        if (window.audioRecorder && window.audioRecorder.state !== 'inactive') {
            window.audioRecorder.stop();
        }
    });

    // Wait for last audio chunks
    await new Promise(r => setTimeout(r, 2000));

    console.log('🛑 Stopping...');
    await recorder.stop();

    if (audioChunks.length > 0) {
        fs.writeFileSync(AUDIO_ONLY, Buffer.concat(audioChunks));
        console.log('🎬 Merging with FFmpeg...');
        try {
            execSync(`ffmpeg -y -i ${VIDEO_ONLY} -i ${AUDIO_ONLY} -c:v copy -c:a aac -b:a 192k -shortest ${FINAL_OUTPUT}`);
            console.log(`✅ COMPLETE! Saved to: ${FINAL_OUTPUT}`);
        } catch (e) {
            console.error('Merge failed:', e.message);
        }
    } else {
        console.error('⚠️ No audio captured!');
        fs.renameSync(VIDEO_ONLY, FINAL_OUTPUT);
    }

    await browser.close();
    if (fs.existsSync(VIDEO_ONLY)) fs.unlinkSync(VIDEO_ONLY);
    if (fs.existsSync(AUDIO_ONLY)) fs.unlinkSync(AUDIO_ONLY);

})().catch(err => console.error('💥 Error:', err));
