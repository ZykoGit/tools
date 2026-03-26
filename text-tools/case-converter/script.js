const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function toUpper(text) {
    return text.toUpperCase();
}

function toLower(text) {
    return text.toLowerCase();
}

function toTitle(text) {
    return text
        .toLowerCase()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function toSentence(text) {
    return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
}

// Case buttons
document.querySelectorAll(".case-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = input.value;
        if (!value.trim()) {
            output.value = "";
            showToast("No input");
            return;
        }

        const mode = btn.getAttribute("data-mode");
        let result = value;

        if (mode === "upper") result = toUpper(value);
        if (mode === "lower") result = toLower(value);
        if (mode === "title") result = toTitle(value);
        if (mode === "sentence") result = toSentence(value);

        output.value = result;
        showToast("Converted");
    });
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
