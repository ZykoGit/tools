const A = document.getElementById("matrixA");
const B = document.getElementById("matrixB");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function parseMatrix(text) {
    return text.trim().split("\n").map(row =>
        row.trim().split(/\s+/).map(Number)
    );
}

function matrixToString(m) {
    return m.map(r => r.join(" ")).join("\n");
}

function add(A, B) {
    return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}

function sub(A, B) {
    return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}

function mul(A, B) {
    const rows = A.length;
    const cols = B[0].length;
    const inner = B.length;

    const result = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < inner; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function transpose(M) {
    return M[0].map((_, i) => M.map(row => row[i]));
}

function det2(m) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function det3(m) {
    return (
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
}

function inverse2(m) {
    const d = det2(m);
    if (d === 0) return null;

    return [
        [ m[1][1] / d, -m[0][1] / d ],
        [ -m[1][0] / d, m[0][0] / d ]
    ];
}

function identity(n) {
    return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
}

document.querySelectorAll("[data-op]").forEach(btn => {
    btn.addEventListener("click", () => {
        const op = btn.dataset.op;

        try {
            const matA = A.value.trim() ? parseMatrix(A.value) : null;
            const matB = B.value.trim() ? parseMatrix(B.value) : null;

            let result;

            switch (op) {
                case "add":
                    result = add(matA, matB);
                    break;
                case "sub":
                    result = sub(matA, matB);
                    break;
                case "mul":
                    result = mul(matA, matB);
                    break;
                case "scalar":
                    const s = parseFloat(document.getElementById("scalar").value);
                    result = matA.map(row => row.map(v => v * s));
                    break;
                case "detA":
                    result = matA.length === 2 ? det2(matA) : det3(matA);
                    break;
                case "detB":
                    result = matB.length === 2 ? det2(matB) : det3(matB);
                    break;
                case "invA":
                    result = inverse2(matA);
                    if (!result) throw "Matrix A not invertible";
                    break;
                case "invB":
                    result = inverse2(matB);
                    if (!result) throw "Matrix B not invertible";
                    break;
                case "transA":
                    result = transpose(matA);
                    break;
                case "transB":
                    result = transpose(matB);
                    break;
                case "identity":
                    const n = parseInt(document.getElementById("identitySize").value);
                    result = identity(n);
                    break;
            }

            output.value = typeof result === "number" ? result : matrixToString(result);
            showToast("Done");

        } catch (err) {
            output.value = "Error: " + err;
            showToast("Error");
        }
    });
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

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    A.value = "";
    B.value = "";
    output.value = "";
});

// Sample loaders
document.getElementById("load-sampleA-btn").addEventListener("click", () => {
    A.value = document.getElementById("sample-text").innerText.trim();
});
document.getElementById("load-sampleB-btn").addEventListener("click", () => {
    B.value = document.getElementById("sample-text").innerText.trim();
});
