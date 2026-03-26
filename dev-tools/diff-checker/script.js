const leftInput = document.getElementById("left-input");
const rightInput = document.getElementById("right-input");
const leftDiff = document.getElementById("left-diff");
const rightDiff = document.getElementById("right-diff");
const toast = document.getElementById("toast");

const MAX_SIZE = 5 * 1024 * 1024;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function checkSize(text) {
    return new Blob([text]).size <= MAX_SIZE;
}

function diffLines(a, b) {
    const aLines = a.split("\n");
    const bLines = b.split("\n");
    const max = Math.max(aLines.length, bLines.length);

    const result = [];

    for (let i = 0; i < max; i++) {
        const left = aLines[i] ?? "";
        const right = bLines[i] ?? "";

        if (left === right) {
            result.push({ type: "same", left, right });
        } else if (!left && right) {
            result.push({ type: "added", left, right });
        } else if (left && !right) {
            result.push({ type: "removed", left, right });
        } else {
            result.push({ type: "changed", left, right });
        }
    }

    return result;
}

function renderDiff(diff) {
    leftDiff.innerHTML = "";
    rightDiff.innerHTML = "";

    diff.forEach((row, i) => {
        const leftLine = document.createElement("div");
        const rightLine = document.createElement("div");

        leftLine.className = "diff-line " + row.type;
        rightLine.className = "diff-line " + row.type;

        leftLine.textContent = row.left || "";
        rightLine.textContent = row.right || "";

        leftDiff.appendChild(leftLine);
        rightDiff.appendChild(rightLine);
    });
}

document.getElementById("compare-btn").addEventListener("click", () => {
    const left = leftInput.value;
    const right = rightInput.value;

    if (!checkSize(left) || !checkSize(right)) {
        showToast("Input too large");
        return;
    }

    const diff = diffLines(left, right);
    renderDiff(diff);

    showToast("Compared");
});

document.getElementById("clear-btn").addEventListener("click", () => {
    leftInput.value = "";
    rightInput.value = "";
    leftDiff.innerHTML = "";
    rightDiff.innerHTML = "";
});

document.getElementById("load-sample-btn").addEventListener("click", () => {
    leftInput.value = document.getElementById("sample-left").innerText.trim();
    rightInput.value = document.getElementById("sample-right").innerText.trim();
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    const unified = [];

    const diff = diffLines(leftInput.value, rightInput.value);

    diff.forEach(row => {
        if (row.type === "same") unified.push("  " + row.left);
        if (row.type === "added") unified.push("+ " + row.right);
        if (row.type === "removed") unified.push("- " + row.left);
        if (row.type === "changed") {
            unified.push("- " + row.left);
            unified.push("+ " + row.right);
        }
    });

    try {
        await navigator.clipboard.writeText(unified.join("\n"));
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const diff = diffLines(leftInput.value, rightInput.value);
    const unified = diff.map(row => {
        if (row.type === "same") return "  " + row.left;
        if (row.type === "added") return "+ " + row.right;
        if (row.type === "removed") return "- " + row.left;
        return "- " + row.left + "\n+ " + row.right;
    }).join("\n");

    const blob = new Blob([unified], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
// --- Scroll Sync ---
let syncing = false;

function syncScroll(e) {
    if (syncing) return;
    syncing = true;

    if (e.target === leftDiff) {
        rightDiff.scrollTop = leftDiff.scrollTop;
    } else {
        leftDiff.scrollTop = rightDiff.scrollTop;
    }

    syncing = false;
}

leftDiff.addEventListener("scroll", syncScroll);
rightDiff.addEventListener("scroll", syncScroll);
