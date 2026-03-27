const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Solve linear ax + b = c
function solveLinear(eq) {
    // Convert to ax + b = c form
    const sides = eq.split("=");
    if (sides.length !== 2) return "Invalid equation";

    const left = sides[0].replace(/\s+/g, "");
    const right = parseFloat(sides[1]);

    // Extract ax
    const match = left.match(/([+-]?\d*\.?\d*)x([+-]\d+\.?\d*)?/i);
    if (!match) return "Could not parse linear equation";

    let a = parseFloat(match[1]);
    if (isNaN(a)) a = match[1] === "-" ? -1 : 1;

    let b = parseFloat(match[2] || 0);

    const x = (right - b) / a;
    return `x = ${x}`;
}

// Solve quadratic ax^2 + bx + c = 0
function solveQuadratic(eq) {
    const cleaned = eq.replace(/\s+/g, "");

    const match = cleaned.match(/([+-]?\d*\.?\d*)x\^2([+-]\d*\.?\d*)x([+-]\d*\.?\d*)=0/i);
    if (!match) return "Could not parse quadratic equation";

    let a = parseFloat(match[1]);
    if (isNaN(a)) a = match[1] === "-" ? -1 : 1;

    let b = parseFloat(match[2]);
    let c = parseFloat(match[3]);

    const disc = b*b - 4*a*c;

    if (disc < 0) {
        const real = (-b / (2*a)).toFixed(4);
        const imag = (Math.sqrt(-disc) / (2*a)).toFixed(4);
        return `x₁ = ${real} + ${imag}i\nx₂ = ${real} - ${imag}i`;
    }

    const x1 = (-b + Math.sqrt(disc)) / (2*a);
    const x2 = (-b - Math.sqrt(disc)) / (2*a);

    return `x₁ = ${x1}\nx₂ = ${x2}`;
}

// Detect equation type
function solveEquation(eq) {
    if (eq.includes("x^2")) return solveQuadratic(eq);
    if (eq.includes("x")) return solveLinear(eq);
    return "Unsupported equation type";
}

// Solve button
document.getElementById("solve-btn").addEventListener("click", () => {
    const eq = input.value;

    if (!eq.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    output.value = solveEquation(eq);
    showToast("Solved");
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
