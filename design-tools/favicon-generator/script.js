const toast = document.getElementById("toast");
const preview = document.getElementById("preview");
const results = document.getElementById("results");

let originalImage = null;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Load image
document.getElementById("file-input").addEventListener("change", () => {
    const file = document.getElementById("file-input").files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        originalImage = new Image();
        originalImage.onload = () => {
            preview.src = originalImage.src;
            preview.style.display = "block";
            showToast("Image loaded");
        };
        originalImage.src = reader.result;
    };
    reader.readAsDataURL(file);
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("file-input").value = "";
    preview.style.display = "none";
    preview.src = "";
    originalImage = null;
    results.innerHTML = "";
});

// Generate favicons
document.getElementById("generate-btn").addEventListener("click", () => {
    if (!originalImage) {
        showToast("No image uploaded");
        return;
    }

    const sizes = [...document.querySelectorAll(".size-option:checked")].map(x => parseInt(x.value));

    if (sizes.length === 0) {
        showToast("Select at least one size");
        return;
    }

    results.innerHTML = "";

    sizes.forEach(size => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(originalImage, 0, 0, size, size);

        const url = canvas.toDataURL("image/png");

        const container = document.createElement("div");
        container.className = "favicon-preview";

        container.innerHTML = `
            <p>${size}×${size}</p>
            <img src="${url}" width="${size}" height="${size}">
            <a href="${url}" download="favicon-${size}.png">Download</a>
        `;

        results.appendChild(container);
    });

    showToast("Favicons generated");
});

// Download all as ZIP
document.getElementById("download-all-btn").addEventListener("click", async () => {
    const zip = new JSZip();

    const previews = document.querySelectorAll(".favicon-preview img");

    if (previews.length === 0) {
        showToast("Generate favicons first");
        return;
    }

    for (const img of previews) {
        const size = img.width;
        const data = img.src.split(",")[1];
        zip.file(`favicon-${size}.png`, data, { base64: true });
    }

    const blob = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "favicons.zip";
    a.click();

    showToast("ZIP downloaded");
});
