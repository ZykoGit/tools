const preview = document.getElementById("flex-preview");
const cssOutput = document.getElementById("css-output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateFlex() {
    const direction = document.getElementById("flex-direction").value;
    const justify = document.getElementById("justify-content").value;
    const align = document.getElementById("align-items").value;
    const alignContent = document.getElementById("align-content").value;
    const wrap = document.getElementById("flex-wrap").value;

    const gap = document.getElementById("gap").value;
    const rowGap = document.getElementById("row-gap").value;
    const columnGap = document.getElementById("column-gap").value;

    const itemCount = document.getElementById("item-count").value;
    const itemWidth = document.getElementById("item-width").value;
    const itemHeight = document.getElementById("item-height").value;
    const grow = document.getElementById("flex-grow").value;
    const shrink = document.getElementById("flex-shrink").value;
    const basis = document.getElementById("flex-basis").value;

    preview.innerHTML = "";

    for (let i = 1; i <= itemCount; i++) {
        const item = document.createElement("div");
        item.className = "flex-item";
        item.innerText = i;

        item.style.width = itemWidth + "px";
        item.style.height = itemHeight + "px";
        item.style.flexGrow = grow;
        item.style.flexShrink = shrink;
        item.style.flexBasis = basis + "px";

        preview.appendChild(item);
    }

    preview.style.display = "flex";
    preview.style.flexDirection = direction;
    preview.style.justifyContent = justify;
    preview.style.alignItems = align;
    preview.style.alignContent = alignContent;
    preview.style.flexWrap = wrap;

    preview.style.gap = gap + "px";
    preview.style.rowGap = rowGap + "px";
    preview.style.columnGap = columnGap + "px";

    cssOutput.value =
`display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
align-content: ${alignContent};
flex-wrap: ${wrap};
gap: ${gap}px;
row-gap: ${rowGap}px;
column-gap: ${columnGap}px;`;
}

document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", updateFlex);
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
        link.download = "flexbox-layout.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

updateFlex();
