
import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import path from 'path';

const OUTPUT_FILE = './output.mp4';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new", // Headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport for vertical video (9:16)
    // 1080x1920 is standard but might be heavy. Let's try it.
    await page.setViewport({ width: 1080, height: 1920 });

    console.log('Navigating to app...');
    // Add some query params for customization
    // arraySize=35, speed=92, algorithm=BUBBLE
    await page.goto('http://localhost:3000/?size=35&speed=92&algorithm=BUBBLE', {
        waitUntil: 'networkidle2'
    });

    // Wait for the app to be fully interactive
    console.log('Waiting for app to load...');
    await page.waitForSelector('button');

    // Setup recorder
    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 30,
        ffmpeg_Path: null, // Use internal
        videoFrame: {
            width: 1080,
            height: 1920
        },
        videoCrf: 18,
        videoPreset: 'ultrafast',
        videoBitrate: 1000,
        autopad: {
            color: 'black',
        },
        aspectRatio: '9:16',
    });

    console.log('Starting recording...');
    await recorder.start(OUTPUT_FILE);

    // Start the sorting
    console.log('Starting sort...');
    await page.evaluate(() => {
        if (window.startSorting) {
            window.startSorting();
        } else {
            console.error('startSorting not found on window');
        }
    });

    // Wait for completion
    console.log('Waiting for sort to complete...');
    try {
        await page.waitForFunction(() => window.isSortingCompleted === true, {
            timeout: 120000, // 2 minutes max
            polling: 500
        });
        console.log('Sort completed!');
    } catch (e) {
        console.log('Timeout or error waiting for sort completion:', e);
    }

    // Add a small buffer at the end
    await new Promise(r => setTimeout(r, 2000));

    console.log('Stopping recording...');
    await recorder.stop();

    await browser.close();
    console.log(`Video saved to ${path.resolve(OUTPUT_FILE)}`);
})().catch(err => console.error('Error running capture:', err));
