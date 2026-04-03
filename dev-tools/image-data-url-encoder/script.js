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
   CLEAN + DECODE DATA URL
----------------------------*/
function fullyDecode(raw) {
    let out = raw.trim();
    try {
        let prev;
        do {
            prev = out;
            out = decodeURIComponent(out);
        } while (out !== prev);
    } catch {
        // ignore decode errors
    }
    return out;
}

/* ---------------------------
   DECODE DATA URL → PREVIEW
----------------------------*/
document.getElementById("decode-btn").addEventListener("click", () => {
    let raw = decodeInput.value.trim();
    if (!raw) {
        showToast("Paste a data URL first");
        return;
    }

    const dataURL = fullyDecode(raw);

    if (!dataURL.startsWith("data:")) {
        showToast("Invalid data URL");
        return;
    }

    // Preview if image
    if (dataURL.startsWith("data:image")) {
        decodePreview.innerHTML = `<img src="${dataURL}" style="max-width:100%; border-radius:8px;">`;
    } else {
        decodePreview.innerHTML = `<p>Decoded file ready for download.</p>`;
    }

    downloadBtn.disabled = false;
    downloadBtn.dataset.url = dataURL;

    showToast("Decoded successfully");
});

/* ---------------------------
   DOWNLOAD
----------------------------*/
downloadBtn.addEventListener("click", () => {
    const dataURL = downloadBtn.dataset.url;
    if (!dataURL) return;

  
    const mimeMatch = dataURL.match(/^data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";


    const ext = mime.split("/")[1] || "bin";


    const link = document.createElement("a");
    link.download = `decoded.${ext}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("Downloaded");
});
