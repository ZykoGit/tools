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

// --- EXIF PARSER (WORKING VERSION) ---
function readEXIF(arrayBuffer) {
    const view = new DataView(arrayBuffer);

    if (view.getUint16(0, false) !== 0xFFD8) return null; // Not JPEG

    let offset = 2;
    while (offset < view.byteLength) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xFFE1) { // EXIF marker
            return parseEXIF(view, offset + 2);
        }

        const size = view.getUint16(offset, false);
        offset += size;
    }

    return null;
}

function parseEXIF(view, start) {
    const tiff = start + 6;
    const little = view.getUint16(tiff) === 0x4949;
    const firstIFD = view.getUint32(tiff + 4, little) + tiff;

    return readIFD(view, firstIFD, little);
}

function readIFD(view, offset, little) {
    const entries = view.getUint16(offset, little);
    const tags = {};

    for (let i = 0; i < entries; i++) {
        const entry = offset + 2 + i * 12;
        const tag = view.getUint16(entry, little);
        const type = view.getUint16(entry + 2, little);
        const count = view.getUint32(entry + 4, little);
        let valueOffset = view.getUint32(entry + 8, little);

        if (type === 2) { // ASCII
            if (count <= 4) {
                tags[tag] = String.fromCharCode(
                    view.getUint8(entry + 8),
                    view.getUint8(entry + 9),
                    view.getUint8(entry + 10),
                    view.getUint8(entry + 11)
                ).replace(/\0/g, "");
            } else {
                const str = [];
                for (let j = 0; j < count - 1; j++) {
                    str.push(String.fromCharCode(view.getUint8(valueOffset + j)));
                }
                tags[tag] = str.join("");
            }
        } else if (type === 3) { // SHORT
            tags[tag] = view.getUint16(entry + 8, little);
        } else if (type === 4) { // LONG
            tags[tag] = valueOffset;
        }
    }

    return tags;
}

// --- MAIN LOGIC ---

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
        const exif = readEXIF(arrayBuffer);

        let output = `File Name: ${file.name}
File Type: ${file.type}
File Size: ${(file.size / 1024).toFixed(1)} KB`;

        const img = new Image();
        img.onload = () => {
            output += `\nDimensions: ${img.width} × ${img.height}`;

            if (!exif) {
                metadataBox.textContent = output + "\n\nNo EXIF metadata found.";
                return;
            }

            output += "\n\nEXIF Metadata:\n";

            const tagNames = {
                0x010F: "Camera Make",
                0x0110: "Camera Model",
                0x0132: "Date Taken",
                0x829A: "Exposure Time",
                0x829D: "Aperture",
                0x8827: "ISO",
                0x920A: "Focal Length",
                0x0112: "Orientation"
            };

            for (const tag in exif) {
                const name = tagNames[tag] || `Tag ${tag}`;
                output += `${name}: ${exif[tag]}\n`;
            }

            metadataBox.textContent = output;
        };

        img.src = imgReader.result;

        showToast("Metadata loaded");
    };

    reader.readAsArrayBuffer(file);
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    fileInput.value = "";
    preview.style.display = "none";
    preview.src = "";
    metadataBox.textContent = "No metadata loaded.";
    originalFile = null;
});
