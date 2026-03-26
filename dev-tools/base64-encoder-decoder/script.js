const input = document.getElementById("input-text");
const output = document.getElementById("output-text");
const toast = document.getElementById("toast");

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function checkSize(text) {
    const size = new Blob([text]).size;
    if (size > MAX_SIZE) {
        output.value = "❌ Input too large (max 5 MB)";
        showToast("Input too large");
        return false;
    }
    return true;
}

// Encode → Base64
document.getElementById("encode-btn").addEventListener("click", () => {
    if (!checkSize(input.value)) return;

    try {
        output.value = btoa(unescape(encodeURIComponent(input.value)));
    } catch {
        output.value = "❌ Encoding failed";
    }
});

// Decode ← Base64
document.getElementById("decode-btn").addEventListener("click", () => {
    if (!checkSize(input.value)) return;

    try {
        output.value = decodeURIComponent(escape(atob(input.value)));
    } catch {
        output.value = "❌ Invalid Base64";
    }
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

// Copy output
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// Download output
document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "base64-output.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
