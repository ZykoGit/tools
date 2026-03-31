const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");
const categorySelect = document.getElementById("category-select");
const countSelect = document.getElementById("count-select");

const cache = {}; // cache loaded JSON lists
let lastGenerated = []; // for copy button

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

async function loadNames(category) {
    if (cache[category]) return cache[category];

    const url = `names/${category}.json`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to load ${category} names`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error(`Invalid JSON format in ${category}.json`);
    }

    cache[category] = data;
    return data;
}

function getRandomNames(list, count) {
    const result = [];
    if (list.length === 0) return result;

    for (let i = 0; i < count; i++) {
        const name = list[Math.floor(Math.random() * list.length)];
        result.push(name);
    }
    return result;
}

document.getElementById("generate-btn").addEventListener("click", async () => {
    const category = categorySelect.value;
    const count = parseInt(countSelect.value, 10);

    outputBox.textContent = "Loading names...";

    try {
        const list = await loadNames(category);
        const names = getRandomNames(list, count);

        if (names.length === 0) {
            outputBox.textContent = "No names available in this category.";
            showToast("No names found");
            return;
        }

        lastGenerated = names;

        const formatted = `Generated Names:\n\n` + names.map(n => `• ${n}`).join("\n");
        outputBox.textContent = formatted;
        showToast("Names generated");
    } catch (err) {
        console.error(err);
        outputBox.textContent = "Error loading names.";
        showToast("Failed to load names");
    }
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!lastGenerated.length) {
        showToast("Nothing to copy");
        return;
    }

    const text = lastGenerated.join("\n");

    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied!");
    } catch {
        showToast("Copy failed");
    }
});
