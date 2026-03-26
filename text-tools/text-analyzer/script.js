const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function analyzeText(text) {
    const trimmed = text.trim();

    const words = trimmed.length ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;

    const charCount = trimmed.length;
    const charCountNoSpaces = trimmed.replace(/\s+/g, "").length;

    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    const readingTime = Math.max(1, Math.round(wordCount / 200));

    // Most common words
    const freq = {};
    words.forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9]/gi, "");
        if (!clean) return;
        freq[clean] = (freq[clean] || 0) + 1;
    });

    const topWords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word, count]) => `${word} (${count})`)
        .join(", ") || "None";

    // Longest word
    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "") || "None";

    const avgWordLength = wordCount
        ? (charCountNoSpaces / wordCount).toFixed(2)
        : "0";

    return `
Words: ${wordCount}
Characters (with spaces): ${charCount}
Characters (no spaces): ${charCountNoSpaces}
Sentences: ${sentenceCount}
Paragraphs: ${paragraphCount}
Estimated Reading Time: ${readingTime} min

Most Common Words: ${topWords}
Longest Word: ${longest}
Average Word Length: ${avgWordLength}
`.trim();
}

// Analyze
document.getElementById("analyze-btn").addEventListener("click", () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    output.value = analyzeText(text);
    showToast("Analyzed");
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
