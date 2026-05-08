
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const HISTORY_FILE = path.join(__dirname, 'history.json');

const ALGORITHMS = [
    { id: 'BUBBLE', name: 'Bubble Sort', desc: 'A simple comparison-based algorithm that repeatedly swaps adjacent elements.' },
    { id: 'INSERTION', name: 'Insertion Sort', desc: 'Builds the final sorted array one item at a time, moving elements to their correct spot.' },
    { id: 'SELECTION', name: 'Selection Sort', desc: 'In-place comparison sorting that repeatedly finds the minimum element.' },
    { id: 'QUICK', name: 'Quick Sort', desc: 'Powerful divide-and-conquer algorithm using pivot partitioning.' },
    { id: 'MERGE', name: 'Merge Sort', desc: 'Efficient, general-purpose sorting that recursively splits and merges arrays.' },
    { id: 'HEAP', name: 'Heap Sort', desc: 'Comparison-based technique using a binary heap data structure.' },
    { id: 'COCKTAIL', name: 'Cocktail Sort', desc: 'A bidirectional variation of bubble sort for smoother flows.' }
];

const THEMES = ['GREEN', 'RAINBOW', 'FIRE', 'OCEAN'];

function loadHistory() {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveHistory(item) {
    const history = loadHistory();
    history.push({ ...item, date: new Date().toISOString() });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`[EXEC] ${command} ${args.join(' ')}`);
        const proc = spawn(command, args, {
            env: { ...process.env, ...options.env },
            ...options,
            shell: true
        });

        proc.stdout.on('data', d => console.log(d.toString().trim()));
        proc.stderr.on('data', d => console.error(d.toString().trim()));

        proc.on('close', code => {
            if (code === 0) resolve();
            else reject(new Error(`${command} failed with code ${code}`));
        });
    });
}

async function automateDay1() {
    const history = loadHistory();
    const usedCombos = new Set(history.map(h => `${h.algo}:${h.theme}`));

    let selectedAlgo = null;
    let selectedTheme = null;

    // Shuffle and pick a new combo
    const algos = [...ALGORITHMS].sort(() => Math.random() - 0.5);
    const themes = [...THEMES].sort(() => Math.random() - 0.5);

    for (const algo of algos) {
        for (const theme of themes) {
            if (!usedCombos.has(`${algo.id}:${theme}`)) {
                selectedAlgo = algo;
                selectedTheme = theme;
                break;
            }
        }
        if (selectedAlgo) break;
    }

    if (!selectedAlgo) {
        console.log("⚠️ All combinations used! Resetting history.");
        fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
        return automateDay1();
    }

    console.log(`\n🌟 DAY 1 VARIATION GENERATOR: [${selectedAlgo.name}] with [${selectedTheme}] theme 🌟\n`);

    const videoName = `output_${selectedAlgo.id}_${selectedTheme}.mp4`;
    const videoPath = path.join(__dirname, videoName);
    const selectedSize = Math.floor(Math.random() * (35 - 15 + 1)) + 15;

    try {
        // 1. Generate Video with arguments
        console.log(`🎥 [1/3] Generating Video (Size: ${selectedSize})...`);
        await runCommand('node', ['capture_demo.js', selectedAlgo.id, selectedTheme, selectedSize], { cwd: __dirname });

        if (fs.existsSync(path.join(__dirname, 'output_kreggscode.mp4'))) {
            fs.renameSync(path.join(__dirname, 'output_kreggscode.mp4'), videoPath);
        }

        // 2. Generate AI Metadata
        console.log("🤖 [2/3] Generating AI Metadata...");
        const metaScript = path.join(__dirname, 'scripts/generate_ai_metadata.js');
        await runCommand('node', [`"${metaScript}"`, `"${selectedAlgo.name}"`], { cwd: __dirname });

        // 3. Upload Video
        console.log("🚀 [3/3] Uploading Video to Social Media...");
        const uploadScript = path.join(__dirname, 'scripts/unified_uploader.py');
        const pythonCmd = process.platform === 'win32' ? 'py' : 'python';
        await runCommand(pythonCmd, [`"${uploadScript}"`, `"${videoPath}"`], { cwd: __dirname });

        // 4. Update History
        saveHistory({
            algo: selectedAlgo.id,
            theme: selectedTheme,
            size: selectedSize,
            file: videoName
        });
        
        console.log("\n✅ Generation & Upload Success!");
        console.log(`📂 Video: ${videoPath}`);

    } catch (error) {
        console.error("💥 Automation failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    automateDay1();
}
