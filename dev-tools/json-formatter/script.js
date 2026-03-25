const input = document.getElementById("json-input");
const output = document.getElementById("json-output");

document.getElementById("format-btn").addEventListener("click", () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, 4);
    } catch (err) {
        output.value = "❌ Invalid JSON\n\n" + err;
    }
});

document.getElementById("minify-btn").addEventListener("click", () => {
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
    } catch (err) {
        output.value = "❌ Invalid JSON\n\n" + err;
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

document.getElementById("load-sample-btn").addEventListener("click", () => {
    const sample = document.getElementById("sample-json").innerText;
    input.value = sample.trim();
});
