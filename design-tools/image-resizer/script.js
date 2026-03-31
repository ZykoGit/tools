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
        // Manual width
        if (!isNaN(widthInput)) {
            newWidth = widthInput;
            if (keepAspect) {
                newHeight = (originalImage.height / originalImage.width) * newWidth;
            }
        }
        // Manual height
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

    // ⭐ CRITICAL FIX FOR PIXEL ART ⭐
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;

    // Draw scaled image
    ctx.drawImage(
        originalImage,
        0, 0, originalImage.width, originalImage.height,
        0, 0, canvas.width, canvas.height
    );

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `resized.${format.split("/")[1]}`;
        downloadLink.style.display = "block";
        downloadLink.textContent = "Download Resized Image";
        showToast("Image ready");
    }, format);
});
