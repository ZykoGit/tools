const toast = document.getElementById("toast");
const textInput = document.getElementById("text-input");
const asciiOutput = document.getElementById("ascii-output");
const fontSelect = document.getElementById("font-select");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Load all FIGlet fonts dynamically
figlet.preloadFonts = true;

async function loadFonts() {
    const fontListUrl = "https://cdn.jsdelivr.net/npm/figlet@1.5.2/fonts.json";

    try {
        const res = await fetch(fontListUrl);
        const fonts = await res.json();

        fonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font;
            option.textContent = font;
            fontSelect.appendChild(option);
        });

        fontSelect.value = "Standard"; // default
        showToast("Fonts loaded");
    } catch (err) {
        console.error(err);
        showToast("Failed to load fonts");
    }
}

function generateASCII() {
    const text = textInput.value.trim();
    const font = fontSelect.value;

    if (!text) {
        asciiOutput.textContent = "ASCII art will appear here.";
        showToast("Enter some text");
        return;
    }

    figlet.loadFont(font, function(err) {
        if (err) {
            console.error(err);
            showToast("Font load error");
            return;
        }

        figlet.text(text, { font }, function(err, result) {
            if (err) {
                console.error(err);
                showToast("Generation error");
                return;
            }

            asciiOutput.textContent = result;
            showToast("ASCII art generated");
        });
    });
}

document.getElementById("generate-btn").addEventListener("click", generateASCII);

document.getElementById("copy-btn").addEventListener("click", async () => {
    const art = asciiOutput.textContent;

    if (!art || art === "ASCII art will appear here.") {
        showToast("Nothing to copy");
        return;
    }

    try {
        await navigator.clipboard.writeText(art);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// Load fonts on startup
loadFonts();
