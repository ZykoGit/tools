const yamlInput = document.getElementById("yaml-input");
const jsonInput = document.getElementById("json-input");
const output = document.getElementById("output");
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

// YAML → JSON
document.getElementById("yaml-to-json-btn").addEventListener("click", () => {
    if (!checkSize(yamlInput.value)) return;

    try {
        const parsed = jsyaml.load(yamlInput.value);
        output.value = JSON.stringify(parsed, null, 4);
    } catch (err) {
        output.value = "❌ Invalid YAML\n\n" + err;
    }
});

// JSON → YAML
document.getElementById("json-to-yaml-btn").addEventListener("click", () => {
    if (!checkSize(jsonInput.value)) return;

    try {
        const parsed = JSON.parse(jsonInput.value);
        output.value = jsyaml.dump(parsed);
    } catch (err) {
        output.value = "❌ Invalid JSON\n\n" + err;
    }
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    yamlInput.value = document.getElementById("sample-yaml").innerText.trim();
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
    a.download = "converted.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
