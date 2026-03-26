const countInput = document.getElementById("uuid-count");
const output = document.getElementById("uuid-output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function generateUuidV4() {
    // RFC 4122 version 4
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");

    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20)
    ].join("-");
}

document.getElementById("generate-btn").addEventListener("click", () => {
    let count = parseInt(countInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 1000) count = 1000;

    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUuidV4());
    }

    output.value = uuids.join("\n");
    showToast("Generated");
});

document.getElementById("clear-btn").addEventListener("click", () => {
    output.value = "";
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
