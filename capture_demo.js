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
    const SELECTED_SPEED = args[3] || '84';
    const SELECTED_SHAPE = args[4] || 'BAR';

    console.log(`🚀 Launching Capture Engine: [${SELECTED_ALGO}] [${SELECTED_THEME}] size=${SELECTED_SIZE} speed=${SELECTED_SPEED} shape=${SELECTED_SHAPE}...`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    // Capture console logs from the browser
    page.on('console', msg => console.log(`[BROWSER] ${msg.text()}`));
    page.on('pageerror', err => console.error(`[BROWSER ERROR] ${err.message}`));
    page.on('requestfailed', request => {
        console.log(`[BROWSER FAILED REQUEST] ${request.url()} - ${request.failure()?.errorText || 'Unknown Error'}`);
    });
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log(`[BROWSER ERROR RESPONSE] ${response.url()} - Status ${response.status()}`);
        }
    });

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
    const url = `http://127.0.0.1:3001/?size=${SELECTED_SIZE}&speed=${SELECTED_SPEED}&algorithm=${SELECTED_ALGO}&theme=${SELECTED_THEME}&shape=${SELECTED_SHAPE}&auto=false`;

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
    
    console.log('🖱️ Waiting for Begin button...');
    await page.waitForSelector('button', { timeout: 60000 });

    // Wait for the app to initialize and expose functions
    console.log('⏳ Waiting for application hydration...');
    await page.waitForFunction(() => typeof window.initAudioCapture === 'function' && typeof window.startSorting === 'function', { timeout: 60000 });

    const recorder = new PuppeteerScreenRecorder(page, {
        followNewTab: true,
        fps: 60,
        videoFrame: { width: 1080, height: 1920 },
        aspectRatio: '9:16',
    });

    console.log('🖱️ Starting Experience...');
    await page.evaluate(() => window.initAudioCapture());
    await recorder.start(VIDEO_ONLY);
    await page.evaluate(() => window.startSorting());

    console.log('⏳ Recording in progress...');
    await Promise.race([
        page.waitForFunction(() => window.isSortingCompleted === true, { timeout: 60000 }),
        new Promise(r => setTimeout(r, 60000))
    ]);

    await new Promise(r => setTimeout(r, 2000));

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
        console.log('🎬 Merging and Extracting Thumbnail with FFmpeg...');
        try {
            // 1. Merge Video and Audio
            execSync(`ffmpeg -y -i ${VIDEO_ONLY} -i ${AUDIO_ONLY} -c:v copy -c:a aac -b:a 192k -shortest ${FINAL_OUTPUT}`);
            
            // 2. Extract Thumbnail at 10 seconds (with fallback to 0s)
            const thumbName = FINAL_OUTPUT.replace('.mp4', '.jpg');
            try {
                console.log('🖼️ Attempting thumbnail extraction at 10s...');
                execSync(`ffmpeg -y -i ${FINAL_OUTPUT} -ss 00:00:10 -update 1 -vframes 1 ${thumbName}`);
            } catch (e) {
                console.log('🖼️ Video might be shorter than 10s, fallback to 0s...');
                execSync(`ffmpeg -y -i ${FINAL_OUTPUT} -ss 00:00:00 -update 1 -vframes 1 ${thumbName}`);
            }
            
            console.log(`✅ COMPLETE! Saved to: ${FINAL_OUTPUT}`);
            console.log(`🖼️ Thumbnail: ${thumbName}`);
        } catch (e) {
            console.error('FFmpeg failed:', e.message);
        }
    } else {
        console.error('⚠️ No audio captured!');
        fs.renameSync(VIDEO_ONLY, FINAL_OUTPUT);
    }

    await browser.close();
    if (fs.existsSync(VIDEO_ONLY)) fs.unlinkSync(VIDEO_ONLY);
    if (fs.existsSync(AUDIO_ONLY)) fs.unlinkSync(AUDIO_ONLY);

})().catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
});
