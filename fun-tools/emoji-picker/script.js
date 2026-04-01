const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");
const searchInput = document.getElementById("search-input");
const emojiGrid = document.getElementById("emoji-grid");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// A solid emoji set (expand anytime)
const emojis = [
    "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
    "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
    "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸",
    "🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️",
    "😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡",
    "🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓",
    "🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄",
    "😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵",
    "🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠",
    "😈","👿","👹","👺","💀","☠️","👻","👽","👾","🤖",
    "💩","🔥","✨","🌟","💫","⭐","🌈","❄️","☀️","🌙",
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💖",
    "👍","👎","👏","🙌","🤝","🙏","💪","👀","👋","✌️"
];

function renderEmojis(filter = "") {
    emojiGrid.innerHTML = "";

    emojis
        .filter(e => e.toLowerCase().includes(filter.toLowerCase()))
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

// Initial load
renderEmojis();
