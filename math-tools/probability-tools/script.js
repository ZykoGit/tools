const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------------- Basic Probability ----------------

document.getElementById("basic-btn").addEventListener("click", () => {
    const pa = parseFloat(document.getElementById("pa").value);
    const pb = parseFloat(document.getElementById("pb").value);
    const pab = parseFloat(document.getElementById("pab").value);

    if ([pa, pb, pab].some(v => isNaN(v))) {
        showToast("Invalid input");
        return;
    }

    const union = pa + pb - pab;
    const condAB = pab / pb;
    const condBA = pab / pa;

    document.getElementById("basic-output").value = `
P(A ∪ B) = ${union}
P(A | B) = ${condAB}
P(B | A) = ${condBA}
    `.trim();

    showToast("Calculated");
});

// ---------------- Combinatorics ----------------

function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

document.getElementById("ncr-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("n").value);
    const r = parseInt(document.getElementById("r").value);

    if (isNaN(n) || isNaN(r) || r > n) {
        showToast("Invalid input");
        return;
    }

    const result = factorial(n) / (factorial(r) * factorial(n - r));
    document.getElementById("comb-output").value = `nCr = ${result}`;
});

document.getElementById("npr-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("n").value);
    const r = parseInt(document.getElementById("r").value);

    if (isNaN(n) || isNaN(r) || r > n) {
        showToast("Invalid input");
        return;
    }

    const result = factorial(n) / factorial(n - r);
    document.getElementById("comb-output").value = `nPr = ${result}`;
});

// ---------------- Binomial Probability ----------------

function nCr(n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function binomial(n, k, p) {
    return nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

document.getElementById("bin-eq-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("bn").value);
    const k = parseInt(document.getElementById("bk").value);
    const p = parseFloat(document.getElementById("bp").value);

    if ([n, k, p].some(v => isNaN(v))) {
        showToast("Invalid input");
        return;
    }

    document.getElementById("bin-output").value = `P(X = ${k}) = ${binomial(n, k, p)}`;
});

document.getElementById("bin-le-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("bn").value);
    const k = parseInt(document.getElementById("bk").value);
    const p = parseFloat(document.getElementById("bp").value);

    if ([n, k, p].some(v => isNaN(v))) {
        showToast("Invalid input");
        return;
    }

    let sum = 0;
    for (let i = 0; i <= k; i++) sum += binomial(n, i, p);

    document.getElementById("bin-output").value = `P(X ≤ ${k}) = ${sum}`;
});

document.getElementById("bin-ge-btn").addEventListener("click", () => {
    const n = parseInt(document.getElementById("bn").value);
    const k = parseInt(document.getElementById("bk").value);
    const p = parseFloat(document.getElementById("bp").value);

    if ([n, k, p].some(v => isNaN(v))) {
        showToast("Invalid input");
        return;
    }

    let sum = 0;
    for (let i = k; i <= n; i++) sum += binomial(n, i, p);

    document.getElementById("bin-output").value = `P(X ≥ ${k}) = ${sum}`;
});

// ---------------- Expected Value ----------------

document.getElementById("ev-btn").addEventListener("click", () => {
    const lines = document.getElementById("ev-input").value.trim().split("\n");

    let ev = 0;

    for (const line of lines) {
        const [value, prob] = line.trim().split(/\s+/).map(Number);
        if (isNaN(value) || isNaN(prob)) {
            showToast("Invalid EV input");
            return;
        }
        ev += value * prob;
    }

    document.getElementById("ev-output").value = `Expected Value = ${ev}`;
});

// ---------------- Random Event Simulator ----------------

document.getElementById("coin-btn").addEventListener("click", () => {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    document.getElementById("sim-output").value = result;
});

document.getElementById("dice-btn").addEventListener("click", () => {
    const result = Math.floor(Math.random() * 6) + 1;
    document.getElementById("sim-output").value = `Rolled: ${result}`;
});
