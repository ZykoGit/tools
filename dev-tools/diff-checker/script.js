const leftInput = document.getElementById("left-input");
const rightInput = document.getElementById("right-input");
const diffOutput = document.getElementById("diff-output");
const toast = document.getElementById("toast");

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function checkSize(text) {
    const size = new Blob([text]).size;
    return size <= MAX_SIZE;
}

function simpleDiff(left, right) {
    const leftLines = left.split("\n");
    const rightLines = right.split("\n");
    const maxLen = Math.max(leftLines.length, rightLines.length);
    const result = [];

    for (let i = 0; i < maxLen; i++) {
        const l = leftLines[i] ?? "";
        const r = rightLines[i] ?? "";

        if (l === r) {
            result.push("  " + l);
        } else {
            if (l) result.push("- " + l);
            if (r) result.push("+ " + r);
        }
    }

    return result.join("\n");
}

document.getElementById("compare-btn").addEventListener("click", () => {
    const left = leftInput.value;
    const right = rightInput.value;

    if (!checkSize(left) || !checkSize(right)) {
        diffOutput.value = "❌ Input too large (max 5 MB per side)";
        showToast("Input too large");
        return;
    }

    diffOutput.value = simpleDiff(left, right);
    showToast("Compared");
});

document.getElementById("clear-btn").addEventListener("click", () => {
    leftInput.value = "";
    rightInput.value = "";
    diffOutput.value = "";
});

document.getElementById("load-sample-btn").addEventListener("click", () => {
    leftInput.value = document.getElementById("sample-left").innerText.trim();
    rightInput.value = document.getElementById("sample-right").innerText.trim();
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(diffOutput.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([diffOutput.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
