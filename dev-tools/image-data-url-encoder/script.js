const fileInput = document.getElementById("file-input");
const output = document.getElementById("output");
const previewBox = document.getElementById("preview-box");

const decodeInput = document.getElementById("decode-input");
const decodePreview = document.getElementById("decode-preview");
const downloadBtn = document.getElementById("download-btn");

const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------------------------
   ENCODE IMAGE → DATA URL
----------------------------*/
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        const dataURL = reader.result;

        previewBox.innerHTML = `<img src="${dataURL}" style="max-width:100%; border-radius:8px;">`;
        output.value = dataURL;
    };

    reader.readAsDataURL(file);
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!output.value.trim()) {
        showToast("Nothing to copy");
        return;
    }

    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied!");
    } catch {
        showToast("Copy failed");
    }
});

/* ---------------------------
   DECODE DATA URL → FILE
----------------------------*/
function decodeDataURL(raw) {
    try {
        // Fix double-encoded URLs
        let decoded = raw.trim();
        while (decoded.includes("%")) {
            decoded = decodeURIComponent(decoded);
        }
        return decoded;
    } catch {
        return raw.trim();
    }
}

document.getElementById("decode-btn").addEventListener("click", () => {
    const raw = decodeInput.value.trim();
    if (!raw) {
        showToast("Paste a data URL first");
        return;
    }

    const dataURL = decodeDataURL(raw);

    if (!dataURL.startsWith("data:")) {
        showToast("Invalid data URL");
        return;
    }

    // Preview if it's an image
    if (dataURL.startsWith("data:image")) {
        decodePreview.innerHTML = `<img src="${dataURL}" style="max-width:100%; border-radius:8px;">`;
    } else {
        decodePreview.innerHTML = `<p>Decoded file ready for download.</p>`;
    }

    // Enable download button
    downloadBtn.disabled = false;
    downloadBtn.dataset.url = dataURL;

    showToast("Decoded successfully");
});

/* ---------------------------
   DOWNLOAD DECODED FILE
----------------------------*/
downloadBtn.addEventListener("click", () => {
    const dataURL = downloadBtn.dataset.url;
    if (!dataURL) return;

    const [meta, base64] = dataURL.split(",");
    const mime = meta.match(/data:(.*?);/)[1] || "application/octet-stream";

    const byteString = atob(base64);
    const array = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([array], { type: mime });

    const ext = mime.split("/")[1] || "bin";
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `decoded.${ext}`;
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
