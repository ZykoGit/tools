const toast = document.getElementById("toast");
const colorList = document.getElementById("color-list");
const preview = document.getElementById("gradient-preview");
const cssOutput = document.getElementById("css-output");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateGradient() {
    const direction = document.getElementById("direction").value;

    const colors = [...document.querySelectorAll(".color-input")].map(input => input.value);

    if (colors.length < 2) {
        preview.style.background = "#222";
        cssOutput.value = "";
        return;
    }

    let gradientCSS = "";

    if (direction === "radial") {
        gradientCSS = `radial-gradient(${colors.join(", ")})`;
    } else if (direction === "conic") {
        gradientCSS = `conic-gradient(${colors.join(", ")})`;
    } else {
        gradientCSS = `linear-gradient(${direction}, ${colors.join(", ")})`;
    }

    preview.style.background = gradientCSS;
    cssOutput.value = `background: ${gradientCSS};`;
}

document.getElementById("add-color-btn").addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.className = "color-row";

    wrapper.innerHTML = `
        <input type="color" class="color-input" value="#ff0000">
        <button class="remove-color-btn">Remove</button>
    `;

    colorList.appendChild(wrapper);

    wrapper.querySelector(".color-input").addEventListener("input", updateGradient);
    wrapper.querySelector(".remove-color-btn").addEventListener("click", () => {
        wrapper.remove();
        updateGradient();
    });

    updateGradient();
});

document.getElementById("direction").addEventListener("change", updateGradient);

document.getElementById("copy-css-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(cssOutput.value);
        showToast("Copied CSS");
    } catch {
        showToast("Copy failed");
    }
});

// Add two default colors
document.getElementById("add-color-btn").click();
document.getElementById("add-color-btn").click();
