const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function parseNumbers(text) {
    return text
        .trim()
        .split(/[\s,]+/)
        .map(Number)
        .filter(n => !isNaN(n));
}

function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function mode(arr) {
    const freq = {};
    arr.forEach(n => freq[n] = (freq[n] || 0) + 1);

    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);

    return modes.join(", ");
}

function variance(arr, sample = false) {
    const m = mean(arr);
    const sumSq = arr.reduce((acc, v) => acc + (v - m) ** 2, 0);
    return sumSq / (arr.length - (sample ? 1 : 0));
}

function stddev(arr, sample = false) {
    return Math.sqrt(variance(arr, sample));
}

function quartiles(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    const lower = sorted.slice(0, mid);
    const upper = sorted.length % 2 === 0
        ? sorted.slice(mid)
        : sorted.slice(mid + 1);

    return {
        Q1: median(lower),
        Q2: median(sorted),
        Q3: median(upper)
    };
}

document.getElementById("calc-btn").addEventListener("click", () => {
    const nums = parseNumbers(input.value);

    if (nums.length === 0) {
        output.value = "";
        showToast("No numbers found");
        return;
    }

    const sample = document.querySelector("input[name='mode']:checked").value === "sample";

    const sorted = [...nums].sort((a, b) => a - b);
    const q = quartiles(nums);

    const results = `
Count: ${nums.length}
Sum: ${nums.reduce((a, b) => a + b, 0)}
Min: ${sorted[0]}
Max: ${sorted[sorted.length - 1]}
Range: ${sorted[sorted.length - 1] - sorted[0]}

Mean: ${mean(nums)}
Median: ${median(nums)}
Mode: ${mode(nums)}

Variance (${sample ? "sample" : "population"}): ${variance(nums, sample)}
Std Dev (${sample ? "sample" : "population"}): ${stddev(nums, sample)}

Q1: ${q.Q1}
Q2 (Median): ${q.Q2}
Q3: ${q.Q3}
IQR: ${q.Q3 - q.Q1}
    `.trim();

    output.value = results;
    showToast("Calculated");
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    input.value = document.getElementById("sample-text").innerText.trim();
});

// Copy
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});
