const input = document.getElementById("json-input");
const output = document.getElementById("json-output");
const toast = document.getElementById("toast");

// 5 MB limit
const MAX_SIZE = 5 * 1024 * 1024;

function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function checkSize() {
    const size = new Blob([input.value]).size;
    if (size > MAX_SIZE) {
        output.value = "❌ Input too large (max 5 MB)";
        showToast("Input too large");
        return false;
    }
    return true;
}

document.getElementById("format-btn").addEventListener("click", () => {
    if (!checkSize()) return;

    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, 4);
    } catch (err) {
        output.value = "❌ Invalid JSON\n\n" + err;
    }
});

document.getElementById("minify-btn").addEventListener("click", () => {
    if (!checkSize()) return;

    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
    } catch (err) {
        output.value = "❌ Invalid JSON\n\n" + err;
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    const sample = document.getElementById("sample-json").innerText;
    input.value = sample.trim();
});

// Copy output
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch (err) {
        showToast("Copy failed");
    }
});

// Download output
document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();

    URL.revokeObjectURL(url);

    showToast("Downloaded");
});
