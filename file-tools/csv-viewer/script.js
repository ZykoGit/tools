const toast = document.getElementById("toast");
const fileInput = document.getElementById("file-input");
const tableContainer = document.getElementById("table-container");
const downloadLink = document.getElementById("download-link");

let parsedCSV = null;

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Detect delimiter
function detectDelimiter(text) {
    if (text.includes("\t")) return "\t";
    if (text.includes(";")) return ";";
    return ",";
}

// Parse CSV into array of arrays
function parseCSV(text, delimiter) {
    return text
        .split("\n")
        .map(row => row.split(delimiter).map(cell => cell.trim()));
}

// Render table
function renderTable(data) {
    if (!data || data.length === 0) {
        tableContainer.innerHTML = "<p>No data found.</p>";
        return;
    }

    let html = "<table>";

    data.forEach((row, i) => {
        html += "<tr>";
        row.forEach(cell => {
            html += i === 0
                ? `<th>${cell}</th>`
                : `<td>${cell}</td>`;
        });
        html += "</tr>";
    });

    html += "</table>";

    tableContainer.innerHTML = html;
}

// Load CSV
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        const text = reader.result;

        const delimiter = detectDelimiter(text);
        parsedCSV = parseCSV(text, delimiter);

        renderTable(parsedCSV);

        // Enable download
        downloadLink.style.display = "block";
        downloadLink.textContent = "Download Cleaned CSV";

        const blob = new Blob([text], { type: "text/csv" });
        downloadLink.href = URL.createObjectURL(blob);

        showToast("CSV loaded");
    };

    reader.readAsText(file);
});

// Clear
document.getElementById("clear-btn").addEventListener("click", () => {
    fileInput.value = "";
    tableContainer.innerHTML = "<p>No CSV loaded.</p>";
    downloadLink.style.display = "none";
    parsedCSV = null;
});
