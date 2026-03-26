const input = document.getElementById("json-input");
const output = document.getElementById("json-output");

// 5 MB limit in bytes
const MAX_SIZE = 5 * 1024 * 1024;

function checkSize() {
    const size = new Blob([input.value]).size;
    if (size > MAX_SIZE) {
        output.value = "❌ Input too large (max 5 MB)";
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

document.getElementById("load-sample-btn").addEventListener("click", () => {
    const sample = document.getElementById("sample-json").innerText;
    input.value = sample.trim();
});

// Copy output
document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(output.value)
        .then(() => alert("Copied to clipboard"))
        .catch(() => alert("Failed to copy"));
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
});
