/* ---------------------------
   DECODE DATA URL → FILE
----------------------------*/
function fullyDecode(raw) {
    let out = raw.trim();
    try {
        // Keep decoding until nothing changes
        let prev;
        do {
            prev = out;
            out = decodeURIComponent(out);
        } while (out !== prev);
    } catch {
        // If decodeURIComponent fails, just return what we have
    }
    return out;
}

document.getElementById("decode-btn").addEventListener("click", () => {
    let raw = decodeInput.value.trim();
    if (!raw) {
        showToast("Paste a data URL first");
        return;
    }

    // Fix double/triple encoded URLs
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
   DOWNLOAD DECODED FILE
----------------------------*/
downloadBtn.addEventListener("click", () => {
    const dataURL = downloadBtn.dataset.url;
    if (!dataURL) return;

    // Split metadata + base64
    const parts = dataURL.split(",");
    if (parts.length < 2) {
        showToast("Invalid data URL");
        return;
    }

    const meta = parts[0];
    const base64 = parts[1];

    // Extract MIME type
    const mimeMatch = meta.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    // Convert base64 → binary
    let byteString;
    try {
        byteString = atob(base64);
    } catch {
        showToast("Base64 decode failed");
        return;
    }

    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([array], { type: mime });

    // Pick extension
    const ext = mime.split("/")[1] || "bin";

    // Force download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decoded.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast("Downloaded");
});
