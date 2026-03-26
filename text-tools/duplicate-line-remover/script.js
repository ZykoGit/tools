const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function removeDuplicates(text, mode, sort) {
    const lines = text.split("\n");

    const map = new Map();

    lines.forEach((line, index) => {
        if (mode === "first") {
            if (!map.has(line)) map.set(line, index);
        } else {
            map.set(line, index);
        }
    });

    let result = Array.from(map.keys());

    if (sort) {
        result = result.sort((a, b) => a.localeCompare(b));
    }

    return result.join("\n");
}

// Remove duplicates
document.getElementById("remove-btn").addEventListener("click", () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    const mode = document.querySelector("input[name='mode']:checked").value;
    const sort = document.getElementById("sort-lines").checked;

    output.value = removeDuplicates(text, mode, sort);
    showToast("Duplicates removed");
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
