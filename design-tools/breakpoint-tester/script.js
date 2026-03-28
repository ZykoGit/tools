const urlInput = document.getElementById("url-input");
const widthSlider = document.getElementById("width-slider");
const widthValue = document.getElementById("width-value");
const previewFrame = document.getElementById("preview-frame");
const loadBtn = document.getElementById("load-btn");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

widthSlider.addEventListener("input", () => {
    const width = widthSlider.value;
    widthValue.textContent = width;
    previewFrame.style.width = width + "px";
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

// Set default width
previewFrame.style.width = widthSlider.value + "px";
