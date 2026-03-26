const output = document.getElementById("output");
const toast = document.getElementById("toast");
const countInput = document.getElementById("para-count");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

const loremParagraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

// Generate
document.getElementById("generate-btn").addEventListener("click", () => {
    let count = parseInt(countInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 20) count = 20;

    const paragraphs = Array(count).fill(loremParagraph).join("\n\n");
    output.value = paragraphs;
    showToast("Generated");
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    output.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    output.value = document.getElementById("sample-text").innerText.trim();
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
