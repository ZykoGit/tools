const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");
const urlInput = document.getElementById("url-input");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

async function ping(url) {
    const start = performance.now();
    try {
        await fetch(url, { method: "HEAD", mode: "no-cors" });
    } catch {
        // no-cors always errors, but timing still works
    }
    const end = performance.now();
    return end - start;
}

document.getElementById("start-btn").addEventListener("click", async () => {
    const url = urlInput.value.trim();

    if (!url) {
        showToast("Enter a URL first");
        return;
    }

    outputBox.textContent = "Testing...\n";
    showToast("Running latency test");

    const results = [];

    for (let i = 1; i <= 5; i++) {
        const ms = await ping(url);
        results.push(ms);
        outputBox.textContent += `Ping ${i}: ${ms.toFixed(2)} ms\n`;
    }

    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const min = Math.min(...results);
    const max = Math.max(...results);

    outputBox.textContent += `
Average: ${avg.toFixed(2)} ms
Fastest: ${min.toFixed(2)} ms
Slowest: ${max.toFixed(2)} ms
    `.trim();
});

document.getElementById("clear-btn").addEventListener("click", () => {
    urlInput.value = "";
    outputBox.textContent = "Enter a URL and click \"Start Test\".";
});
