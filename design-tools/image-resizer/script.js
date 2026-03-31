const toast = document.getElementById("toast");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("file-input");
const downloadLink = document.getElementById("download-link");
const pixelArtToggle = document.getElementById("pixel-art");

let originalImage = null;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Load image
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
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
    fileInput.value = "";
    preview.style.display = "none";
    preview.src = "";
    originalImage = null;
    downloadLink.style.display = "none";
});

// Resize & Export
document.getElementById("resize-btn").addEventListener("click", () => {
    if (!originalImage) {
        showToast("No image uploaded");
        return;
    }

    const widthInput = parseInt(document.getElementById("width").value);
    const heightInput = parseInt(document.getElementById("height").value);
    const percentInput = parseInt(document.getElementById("percent").value);
    const keepAspect = document.getElementById("keep-aspect").checked;
    const format = document.getElementById("format").value;

    let newWidth = originalImage.width;
    let newHeight = originalImage.height;

    // Percent scaling
    if (!isNaN(percentInput)) {
        newWidth = originalImage.width * (percentInput / 100);
        newHeight = originalImage.height * (percentInput / 100);
    } else {
        if (!isNaN(widthInput)) {
            newWidth = widthInput;
            if (keepAspect) {
                newHeight = (originalImage.height / originalImage.width) * newWidth;
            }
        }
        if (!isNaN(heightInput)) {
            newHeight = heightInput;
            if (keepAspect) {
                newWidth = (originalImage.width / originalImage.height) * newHeight;
            }
        }
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(newWidth);
    canvas.height = Math.round(newHeight);

    const ctx = canvas.getContext("2d");

    // Pixel Art Mode
    const pixelMode = pixelArtToggle.checked;

    ctx.imageSmoothingEnabled = !pixelMode;
    ctx.imageSmoothingQuality = pixelMode ? "low" : "high";
    ctx.webkitImageSmoothingEnabled = !pixelMode;
    ctx.mozImageSmoothingEnabled = !pixelMode;

    // Draw scaled image
    ctx.drawImage(
        originalImage,
        0, 0, originalImage.width, originalImage.height,
        0, 0, canvas.width, canvas.height
    );

    // Safari-safe blob creation
    canvas.toBlob(
        blob => {
            if (!blob) {
                showToast("Safari blocked the image. Try PNG format.");
                return;
            }

            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = `resized.${format.split("/")[1]}`;
            downloadLink.style.display = "block";
            downloadLink.textContent = "Download Resized Image";

            showToast("Image ready");
        },
        format,
        1.0
    );
});
