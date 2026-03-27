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

function escapeForTemplateLiteral(str) {
    return str
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${");
}

function generateDataUrl(html) {
    const escaped = escapeForTemplateLiteral(html);

    const launcher = `
<!DOCTYPE html>
<html>
<body>
<script>
const html = \`${escaped}\`;
const blob = new Blob([html], { type: "text/html" });
const url = URL.createObjectURL(blob);
window.open(url);
<\/script>
</body>
</html>
`.trim();

    return "data:text/html," + encodeURIComponent(launcher);
}

// Generate data URL
document.getElementById("generate-btn").addEventListener("click", () => {
    const html = input.value;

    if (!html.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    output.value = generateDataUrl(html);
    showToast("Generated");
});

// Open data URL
document.getElementById("open-btn").addEventListener("click", () => {
    const url = output.value;

    if (!url.trim()) {
        showToast("No URL generated");
        return;
    }

    window.open(url, "_blank");
    showToast("Opened");
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

// File upload
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
