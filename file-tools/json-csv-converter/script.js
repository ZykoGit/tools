const toast = document.getElementById("toast");
const inputBox = document.getElementById("input-box");
const outputBox = document.getElementById("output-box");
const downloadLink = document.getElementById("download-link");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------------- CSV HELPERS ---------------- */

function detectDelimiter(text) {
    if (text.includes("\t")) return "\t";
    if (text.includes(";")) return ";";
    return ",";
}

function parseCSV(text, delimiter) {
    return text
        .trim()
        .split("\n")
        .map(row => row.split(delimiter).map(cell => cell.trim()));
}

function csvToJSON(csvText) {
    const delimiter = detectDelimiter(csvText);
    const rows = parseCSV(csvText, delimiter);

    const headers = rows.shift();
    const json = rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = row[i] ?? "";
        });
        return obj;
    });

    return JSON.stringify(json, null, 2);
}

function jsonToCSV(jsonText) {
    let data;
    try {
        data = JSON.parse(jsonText);
    } catch {
        showToast("Invalid JSON");
        return null;
    }

    if (!Array.isArray(data)) {
        showToast("JSON must be an array of objects");
        return null;
    }

    const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];

    const rows = [
        headers.join(","),
        ...data.map(obj => headers.map(h => obj[h] ?? "").join(","))
    ];

    return rows.join("\n");
}

/* ---------------- BUTTON HANDLERS ---------------- */

document.getElementById("json-to-csv-btn").addEventListener("click", () => {
    const input = inputBox.value.trim();
    if (!input) {
        showToast("Input is empty");
        return;
    }

    const csv = jsonToCSV(input);
    if (!csv) return;

    outputBox.value = csv;

    const blob = new Blob([csv], { type: "text/csv" });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "converted.csv";
    downloadLink.style.display = "block";

    showToast("Converted JSON → CSV");
});

document.getElementById("csv-to-json-btn").addEventListener("click", () => {
    const input = inputBox.value.trim();
    if (!input) {
        showToast("Input is empty");
        return;
    }

    const json = csvToJSON(input);
    outputBox.value = json;

    const blob = new Blob([json], { type: "application/json" });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "converted.json";
    downloadLink.style.display = "block";

    showToast("Converted CSV → JSON");
});

/* ---------------- CLEAR ---------------- */

document.getElementById("clear-btn").addEventListener("click", () => {
    inputBox.value = "";
    outputBox.value = "";
    downloadLink.style.display = "none";
});
