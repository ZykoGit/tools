const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function generateSlug(text, lowercase, separator) {
    let slug = text.trim();

    // Remove HTML tags just in case
    slug = slug.replace(/<[^>]*>/g, "");

    // Replace non-alphanumeric with spaces
    slug = slug.replace(/[^a-zA-Z0-9]+/g, " ");

    // Trim again
    slug = slug.trim();

    // Replace spaces with chosen separator
    slug = slug.replace(/\s+/g, separator);

    // Lowercase if enabled
    if (lowercase) slug = slug.toLowerCase();

    return slug;
}

// Generate
document.getElementById("generate-btn").addEventListener("click", () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    const lowercase = document.getElementById("lowercase").checked;
    const separator = document.querySelector("input[name='sep']:checked").value;

    output.value = generateSlug(text, lowercase, separator);
    showToast("Generated");
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    input.value = document.getElementById("sample-text").innerText.trim();
});

// Copy
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});
