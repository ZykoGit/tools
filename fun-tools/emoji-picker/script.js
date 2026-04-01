const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");
const searchInput = document.getElementById("search-input");
const emojiGrid = document.getElementById("emoji-grid");

let allEmojis = [];

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

async function loadEmojis() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json");
        const data = await res.json();

        // Extract actual emoji characters
        allEmojis = data
            .map(e => e.emoji)
            .filter(Boolean); // remove nulls

        renderEmojis();
        showToast("Emojis loaded");
    } catch (err) {
        console.error(err);
        showToast("Failed to load emojis");
    }
}

function renderEmojis(filter = "") {
    emojiGrid.innerHTML = "";

    allEmojis
        .filter(e => e.includes(filter))
        .forEach(emoji => {
            const div = document.createElement("div");
            div.className = "emoji-item";
            div.textContent = emoji;

            div.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(emoji);
                    outputBox.textContent = `Copied: ${emoji}`;
                    showToast("Emoji copied");
                } catch {
                    showToast("Copy failed");
                }
            });

            emojiGrid.appendChild(div);
        });
}

searchInput.addEventListener("input", () => {
    renderEmojis(searchInput.value);
});

// Load full emoji set on page load
loadEmojis();
