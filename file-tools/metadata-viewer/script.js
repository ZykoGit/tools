const toast = document.getElementById("toast");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("file-input");
const metadataBox = document.getElementById("metadata-box");

let originalFile = null;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Parse EXIF (simple parser for common tags)
function getEXIF(arrayBuffer) {
    const view = new DataView(arrayBuffer);

    // Check for JPEG EXIF header
    if (view.getUint16(0, false) !== 0xFFD8) return null;

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
        if (view.getUint16(offset + 2, false) === 0x4578) { // "Exif"
            return parseTIFF(view, offset + 4 + 2);
        }
        offset += 2 + view.getUint16(offset, false);
    }

    return null;
}

function parseTIFF(view, start) {
    const little = view.getUint16(start) === 0x4949;
    const offset = view.getUint32(start + 4, little) + start;

    const tags = {};
    const entries = view.getUint16(offset, little);

    for (let i = 0; i < entries; i++) {
        const entryOffset = offset + 2 + i * 12;
        const tag = view.getUint16(entryOffset, little);
        const value = view.getUint32(entryOffset + 8, little);

        tags[tag] = value;
    }

    return tags;
}

// Load image
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    originalFile = file;

    const reader = new FileReader();

    reader.onload = e => {
        const arrayBuffer = e.target.result;

        // Show preview
        const imgReader = new FileReader();
        imgReader.onload = () => {
            preview.src = imgReader.result;
            preview.style.display = "block";
        };
        imgReader.readAsDataURL(file);

        // Extract EXIF
        const exif = getEXIF(arrayBuffer);

        // Build metadata output
        let output = `File Name: ${file.name}
File Type: ${file.type}
File Size: ${(file.size / 1024).toFixed(1)} KB`;

        const img = new Image();
        img.onload = () => {
            output += `\nDimensions: ${img.width} × ${img.height}`;
            metadataBox.textContent = output + formatEXIF(exif);
        };
        img.src = imgReader.result;

        showToast("Metadata loaded");
    };

    reader.readAsArrayBuffer(file);
});

// Format EXIF tags
function formatEXIF(exif) {
    if (!exif) return "\n\nNo EXIF metadata found.";

    let out = "\n\nEXIF Metadata:\n";

    for (const tag in exif) {
        out += `${tag}: ${exif[tag]}\n`;
    }

    return out;
}

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    fileInput.value = "";
    preview.style.display = "none";
    preview.src = "";
    metadataBox.textContent = "No metadata loaded.";
    originalFile = null;
});
