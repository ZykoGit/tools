const toast = document.getElementById("toast");
const canvas = document.getElementById("art-canvas");
const ctx = canvas.getContext("2d");
const uuidText = document.getElementById("uuid-text");

let lastUUID = "";

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function generateUUID() {
    return crypto.randomUUID();
}

function hexToColor(hex) {
    // Convert a single hex digit (0–f) to a color
    const value = parseInt(hex, 16);
    const hue = (value / 16) * 360;
    return `hsl(${hue}, 70%, 50%)`;
}

function drawArt(uuid) {
    const clean = uuid.replace(/-/g, "");
    const size = 16; // 16x16 grid
    const cell = canvas.width / size;

    for (let i = 0; i < size * size; i++) {
        const hex = clean[i % clean.length];
        ctx.fillStyle = hexToColor(hex);
        const x = (i % size) * cell;
        const y = Math.floor(i / size) * cell;
        ctx.fillRect(x, y, cell, cell);
    }
}

document.getElementById("generate-btn").addEventListener("click", () => {
    const uuid = generateUUID();
    lastUUID = uuid;

    uuidText.textContent = uuid;
    drawArt(uuid);

    showToast("Art generated");
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!lastUUID) {
        showToast("Generate art first");
        return;
    }

    try {
        await navigator.clipboard.writeText(lastUUID);
        showToast("UUID copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `uuid-art-${lastUUID}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showToast("Downloaded");
});
