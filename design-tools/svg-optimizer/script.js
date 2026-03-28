const toast = document.getElementById("toast");
const output = document.getElementById("output");
let originalSVG = "";

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Load SVG
document.getElementById("file-input").addEventListener("change", () => {
    const file = document.getElementById("file-input").files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        originalSVG = reader.result;
        showToast("SVG loaded");
    };
    reader.readAsText(file);
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("file-input").value = "";
    originalSVG = "";
    output.value = "";
});

// Optimize
document.getElementById("optimize-btn").addEventListener("click", () => {
    if (!originalSVG) {
        showToast("No SVG uploaded");
        return;
    }

    let svg = originalSVG;

    if (document.getElementById("remove-comments").checked) {
        svg = svg.replace(/<!--[\s\S]*?-->/g, "");
    }

    if (document.getElementById("remove-metadata").checked) {
        svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/g, "");
    }

    // Remove whitespace between tags
    svg = svg.replace(/>\s+</g, "><");

    if (document.getElementById("pretty-print").checked) {
        svg = vk_pretty(svg);
    }

    output.value = svg;
    showToast("Optimized");
});

// Simple pretty printer
function vk_pretty(xml) {
    let formatted = "";
    let indent = "";
    xml.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent = indent.substring(2);
        formatted += indent + "<" + node + ">\n";
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += "  ";
    });
    return formatted.trim();
}

// Copy
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// Download
document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();

    URL.revokeObjectURL(url);
});

