const preview = document.getElementById("radius-preview");
const cssOutput = document.getElementById("css-output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateRadius() {
    const all = document.getElementById("all-corners").value;

    const tl = document.getElementById("tl").value;
    const tr = document.getElementById("tr").value;
    const br = document.getElementById("br").value;
    const bl = document.getElementById("bl").value;

    // Sync individual sliders when "All Corners" is moved
    if (document.activeElement.id === "all-corners") {
        document.getElementById("tl").value = all;
        document.getElementById("tr").value = all;
        document.getElementById("br").value = all;
        document.getElementById("bl").value = all;
    }

    const radius = `${tl}px ${tr}px ${br}px ${bl}px`;

    preview.style.borderRadius = radius;
    cssOutput.value = `border-radius: ${radius};`;
}

document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", updateRadius);
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

    // Background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rounded box
    const tl = parseInt(document.getElementById("tl").value);
    const tr = parseInt(document.getElementById("tr").value);
    const br = parseInt(document.getElementById("br").value);
    const bl = parseInt(document.getElementById("bl").value);

    const x = 200, y = 150, w = 800, h = 300;

    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + w - tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
    ctx.lineTo(x + w, y + h - br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    ctx.lineTo(x + bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
    ctx.lineTo(x, y + tl);
    ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.fill();

    const link = document.createElement("a");
    link.download = "border-radius.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

updateRadius();
