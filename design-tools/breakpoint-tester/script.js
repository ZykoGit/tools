const urlInput = document.getElementById("url-input");
const widthSlider = document.getElementById("width-slider");
const widthValue = document.getElementById("width-value");
const previewFrame = document.getElementById("preview-frame");
const frameScaler = document.getElementById("frame-scaler");
const frameWrapper = document.getElementById("frame-wrapper");
const loadBtn = document.getElementById("load-btn");
const rotateBtn = document.getElementById("rotate-btn");
const deviceSelect = document.getElementById("device-select");
const toast = document.getElementById("toast");

let rotated = false;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function applyScale() {
    const width = parseInt(getComputedStyle(previewFrame).getPropertyValue("--frame-width"));
    const wrapperWidth = frameWrapper.clientWidth;

    const scale = Math.min(wrapperWidth / width, 1);
    frameScaler.style.transform = `scale(${scale})`;
}

function updateWidth(width) {
    previewFrame.style.setProperty("--frame-width", width + "px");
    widthValue.textContent = width;
    applyScale();
}

widthSlider.addEventListener("input", () => {
    deviceSelect.value = "custom";
    updateWidth(widthSlider.value);
});

deviceSelect.addEventListener("change", () => {
    if (deviceSelect.value === "custom") return;

    const width = parseInt(deviceSelect.value);
    widthSlider.value = width;
    updateWidth(width);
});

rotateBtn.addEventListener("click", () => {
    rotated = !rotated;

    const currentWidth = parseInt(getComputedStyle(previewFrame).getPropertyValue("--frame-width"));
    const rotatedWidth = rotated ? Math.floor(currentWidth * 0.6) : widthSlider.value;

    updateWidth(rotatedWidth);
    showToast(rotated ? "Rotated" : "Unrotated");
});

loadBtn.addEventListener("click", () => {
    let url = urlInput.value.trim();

    if (!url) {
        showToast("Enter a URL first");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    previewFrame.src = url;
    showToast("Loading...");
});

// Initialize
previewFrame.style.setProperty("--frame-width", widthSlider.value + "px");
applyScale();

window.addEventListener("resize", applyScale);
