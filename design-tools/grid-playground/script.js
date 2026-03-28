const preview = document.getElementById("grid-preview");
const cssOutput = document.getElementById("css-output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateGrid() {
    const cols = document.getElementById("columns").value;
    const rows = document.getElementById("rows").value;

    const colSize = document.getElementById("col-size").value;
    const rowSize = document.getElementById("row-size").value;

    const gap = document.getElementById("gap").value;
    const itemCount = document.getElementById("item-count").value;

    const itemColor = document.getElementById("item-color").value;
    const itemRadius = document.getElementById("item-radius").value;
    const itemPadding = document.getElementById("item-padding").value;

    preview.innerHTML = "";

    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement("div");
        item.className = "grid-item";
        item.innerText = i;

        item.style.background = itemColor;
        item.style.borderRadius = itemRadius + "px";
        item.style.padding = itemPadding + "px";

        preview.appendChild(item);
    }

    preview.style.display = "grid";
    preview.style.gridTemplateColumns = `repeat(${cols}, ${colSize}px)`;
    preview.style.gridTemplateRows = `repeat(${rows}, ${rowSize}px)`;
    preview.style.gap = gap + "px";

    cssOutput.value =
`display: grid;
grid-template-columns: repeat(${cols}, ${colSize}px);
grid-template-rows: repeat(${rows}, ${rowSize}px);
gap: ${gap}px;`;
}

document.querySelectorAll("input").forEach(el => {
    el.addEventListener("input", updateGrid);
});

document.getElementById("copy-css-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(cssOutput.value);
        showToast("Copied CSS");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-png-btn").addEventListener("click", () => {
    html2canvas(preview).then(canvas => {
        const link = document.createElement("a");
        link.download = "grid-layout.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

updateGrid();
