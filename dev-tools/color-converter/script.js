const input = document.getElementById("color-input");
const output = document.getElementById("output");
const preview = document.getElementById("preview-box");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// --- Parsing Helpers ---
function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");

    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function rgbToHex(r, g, b) {
    return (
        "#" +
        [r, g, b]
            .map(x => x.toString(16).padStart(2, "0"))
            .join("")
    );
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// --- Main Convert ---
document.getElementById("convert-btn").addEventListener("click", () => {
    const value = input.value.trim();
    let hex, rgb, hsl;

    try {
        if (value.startsWith("#")) {
            hex = value;
            rgb = hexToRgb(hex);
            hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        } else if (value.startsWith("rgb")) {
            const nums = value.match(/\d+/g).map(Number);
            rgb = { r: nums[0], g: nums[1], b: nums[2] };
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        } else if (value.startsWith("hsl")) {
            const nums = value.match(/\d+/g).map(Number);
            hsl = { h: nums[0], s: nums[1], l: nums[2] };
            rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        } else {
            output.value = "❌ Invalid color format";
            showToast("Invalid");
            return;
        }

        output.value =
            `HEX: ${hex}\n` +
            `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
            `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        preview.style.background = hex;

        showToast("Converted");
    } catch {
        output.value = "❌ Conversion failed";
        showToast("Error");
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
    preview.style.background = "transparent";
});

document.getElementById("load-sample-btn").addEventListener("click", () => {
    input.value = document.getElementById("sample-color").innerText.trim();
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "color.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
