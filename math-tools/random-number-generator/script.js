const toast = document.getElementById("toast");
const output = document.getElementById("output");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals) {
    const num = Math.random() * (max - min) + min;
    return num.toFixed(decimals);
}

document.getElementById("generate-btn").addEventListener("click", () => {
    const min = parseFloat(document.getElementById("min").value);
    const max = parseFloat(document.getElementById("max").value);
    const count = parseInt(document.getElementById("count").value);
    const type = document.querySelector("input[name='type']:checked").value;
    const decimals = parseInt(document.getElementById("decimals").value) || 2;
    const unique = document.getElementById("unique").checked;

    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        showToast("Invalid input");
        return;
    }

    if (unique && type === "float") {
        showToast("Unique only works with integers");
        return;
    }

    if (unique && count > (max - min + 1)) {
        showToast("Not enough unique values");
        return;
    }

    const results = [];
    const used = new Set();

    for (let i = 0; i < count; i++) {
        let value;

        if (type === "int") {
            do {
                value = randomInt(min, max);
            } while (unique && used.has(value));

            used.add(value);
        } else {
            value = randomFloat(min, max, decimals);
        }

        results.push(value);
    }

    output.value = results.join("\n");
    showToast("Generated");
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("min").value = "";
    document.getElementById("max").value = "";
    document.getElementById("count").value = "";
    document.getElementById("decimals").value = "";
    document.getElementById("unique").checked = false;
    output.value = "";
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

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    document.getElementById("min").value = 1;
    document.getElementById("max").value = 100;
    document.getElementById("count").value = 10;
    document.querySelector("input[value='int']").checked = true;
    document.getElementById("unique").checked = false;
});
