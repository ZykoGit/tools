const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");
const fileInput = document.getElementById("file-input");

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// --- Encode HTML to data:text/html ---
function encodeHTML(html) {
    const encoded = encodeURIComponent(html);
    if (html.trim().startsWith("data:text/html")) {
        return html; // already encoded
    }
    return `data:text/html,${encoded}`;
}

// --- Decode data:text/html URL ---
function decodeURL(url) {
    if (!url.startsWith("data:text/html")) {
        return "❌ Not a valid data:text/html URL";
    }

    const commaIndex = url.indexOf(",");
    if (commaIndex === -1) return "❌ Invalid format";

    const encoded = url.slice(commaIndex + 1);
    try {
        return decodeURIComponent(encoded);
    } catch {
        return "❌ Failed to decode";
    }
}

// --- Encode button ---
document.getElementById("encode-btn").addEventListener("click", () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    output.value = encodeHTML(text);
    showToast("Encoded");
});

// --- Decode button ---
document.getElementById("decode-btn").addEventListener("click", () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    output.value = decodeURL(text);
    showToast("Decoded");
});

// --- Clear ---
document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// --- Load sample ---
document.getElementById("load-sample-btn").addEventListener("click", () => {
    input.value = document.getElementById("sample-text").innerText.trim();
});

// --- Copy ---
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// --- File upload ---
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
        showToast("File too large (max 10 MB)");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        input.value = reader.result;
        showToast("File loaded");
    };
    reader.readAsText(file);
});
