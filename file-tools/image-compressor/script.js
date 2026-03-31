const toast = document.getElementById("toast");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("file-input");
const downloadLink = document.getElementById("download-link");

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

// Compress
document.getElementById("compress-btn").addEventListener("click", () => {
    if (!originalImage) {
        showToast("No image uploaded");
        return;
    }

    const quality = parseInt(document.getElementById("quality").value) / 100;
    const format = document.getElementById("format").value;

    const canvas = document.createElement("canvas");
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(originalImage, 0, 0);

    // Safari requires quality param even for PNG
    canvas.toBlob(
        blob => {
            if (!blob) {
                showToast("Compression failed. Try JPEG or WEBP.");
                return;
            }

            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = `compressed.${format.split("/")[1]}`;
            downloadLink.style.display = "block";
            downloadLink.textContent = "Download Compressed Image";

            showToast("Image compressed");
        },
        format,
        quality
    );
});
