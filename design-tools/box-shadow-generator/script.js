const preview = document.getElementById("shadow-preview");
const cssOutput = document.getElementById("css-output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateShadow() {
    const x = document.getElementById("offset-x").value;
    const y = document.getElementById("offset-y").value;
    const blur = document.getElementById("blur").value;
    const spread = document.getElementById("spread").value;
    const opacity = document.getElementById("opacity").value;
    const color = document.getElementById("shadow-color").value;
    const inset = document.getElementById("inset").checked ? "inset " : "";

    const rgba = hexToRGBA(color, opacity);

    const shadow = `${inset}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

    preview.style.boxShadow = shadow;
    cssOutput.value = `box-shadow: ${shadow};`;
}

function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateShadow);
});

document.getElementById("copy-css-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(cssOutput.value);
        showToast("Copied CSS");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-png-btn").addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 600;

    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw preview box
    const boxX = 200;
    const boxY = 150;
    const boxW = 800;
    const boxH = 300;
    const radius = 20;

    const x = document.getElementById("offset-x").value;
    const y = document.getElementById("offset-y").value;
    const blur = document.getElementById("blur").value;
    const spread = document.getElementById("spread").value;
    const opacity = document.getElementById("opacity").value;
    const color = document.getElementById("shadow-color").value;
    const inset = document.getElementById("inset").checked;

    const rgba = hexToRGBA(color, opacity);

    ctx.shadowColor = rgba;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;

    ctx.fillStyle = "#222";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    const link = document.createElement("a");
    link.download = "box-shadow.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

updateShadow();
