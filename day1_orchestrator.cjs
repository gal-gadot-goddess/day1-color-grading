
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ALGORITHMS = [
    { id: 'BUBBLE', name: 'Bubble Sort', desc: 'A simple comparison-based algorithm that repeatedly swaps adjacent elements.' },
    { id: 'INSERTION', name: 'Insertion Sort', desc: 'Builds the final sorted array one item at a time, moving elements to their correct spot.' },
    { id: 'SELECTION', name: 'Selection Sort', desc: 'In-place comparison sorting that repeatedly finds the minimum element.' },
    { id: 'QUICK', name: 'Quick Sort', desc: 'Powerful divide-and-conquer algorithm using pivot partitioning.' },
    { id: 'MERGE', name: 'Merge Sort', desc: 'Efficient, general-purpose sorting that recursively splits and merges arrays.' },
    { id: 'HEAP', name: 'Heap Sort', desc: 'Comparison-based technique using a binary heap data structure.' },
    { id: 'COCKTAIL', name: 'Cocktail Sort', desc: 'A bidirectional variation of bubble sort for smoother flows.' },
    { id: 'GNOME', name: 'Gnome Sort', desc: 'A simple algorithm that swaps adjacent elements like a garden gnome tending a line of flower pots.' },
    { id: 'SHELL', name: 'Shell Sort', desc: 'A generalization of insertion sort using decreasing gaps to sort far-apart elements first.' },
    { id: 'COMB', name: 'Comb Sort', desc: 'An improved bubble sort that eliminates turtles by comparing elements with a decreasing gap.' },
    { id: 'CYCLE', name: 'Cycle Sort', desc: 'An in-place sort that minimizes memory writes by rotating cycles of misplaced elements.' },
    { id: 'ODDEVEN', name: 'Odd-Even Sort', desc: 'A parallel-friendly brick sort alternating odd and even adjacent pair comparisons.' },
    { id: 'PANCAKE', name: 'Pancake Sort', desc: 'A sorting algorithm using only prefix reversals, like flipping a stack of pancakes.' },
    { id: 'STOOGE', name: 'Stooge Sort', desc: 'A notoriously inefficient recursive sort named after the Three Stooges.' },
    { id: 'RADIX', name: 'Radix Sort', desc: 'A non-comparative integer sort that processes digits individually.' },
    { id: 'TIM', name: 'Tim Sort', desc: 'A hybrid stable sort from merge and insertion sort, used in Python and Java.' },
    { id: 'BOGO', name: 'Bogo Sort', desc: 'A highly inefficient sort that repeatedly shuffles until sorted by chance.' }
];

const THEMES = ['GREEN', 'RAINBOW', 'FIRE', 'OCEAN', 'RANDOM'];
const SHAPES = ['BAR', 'BUBBLE'];

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
    const selectedAlgo = ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];
    const selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const selectedShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const selectedSize = Math.floor(Math.random() * (35 - 12 + 1)) + 12;
    const selectedSpeed = Math.floor(Math.random() * (95 - 30 + 1)) + 30;

    console.log(`\n🌟 DAY 1 VARIATION GENERATOR: [${selectedAlgo.name}] [${selectedTheme}] shape=${selectedShape} size=${selectedSize} speed=${selectedSpeed} 🌟\n`);

    const videoName = `output_${selectedAlgo.id}_${selectedTheme}_${selectedShape}_${Date.now()}.mp4`;
    const videoPath = path.join(__dirname, videoName);

    try {
        console.log(`🎥 [1/3] Generating Video...`);
        await runCommand('node', ['capture_demo.js', selectedAlgo.id, selectedTheme, String(selectedSize), String(selectedSpeed), selectedShape], { cwd: __dirname });

        if (fs.existsSync(path.join(__dirname, 'output_kreggscode.mp4'))) {
            fs.renameSync(path.join(__dirname, 'output_kreggscode.mp4'), videoPath);
        }

        console.log("🤖 [2/3] Generating AI Metadata...");
        const metaScript = path.join(__dirname, 'scripts/generate_ai_metadata.js');
        await runCommand('node', [`"${metaScript}"`, `"${selectedAlgo.name}"`], { cwd: __dirname });

        console.log("🚀 [3/3] Uploading Video to Social Media...");
        const uploadScript = path.join(__dirname, 'scripts/unified_uploader.py');
        const pythonCmd = process.platform === 'win32' ? 'py' : 'python';
        await runCommand(pythonCmd, [`"${uploadScript}"`, `"${videoPath}"`], { cwd: __dirname });
        
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
