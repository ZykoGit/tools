const min = document.getElementById("min");
const hour = document.getElementById("hour");
const dom = document.getElementById("dom");
const month = document.getElementById("month");
const dow = document.getElementById("dow");

const output = document.getElementById("output");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

document.getElementById("generate-btn").addEventListener("click", () => {
    const cron = [
        min.value || "*",
        hour.value || "*",
        dom.value || "*",
        month.value || "*",
        dow.value || "*"
    ].join(" ");

    output.value = cron;
    showToast("Generated");
});

document.getElementById("clear-btn").addEventListener("click", () => {
    min.value = "";
    hour.value = "";
    dom.value = "";
    month.value = "";
    dow.value = "";
    output.value = "";
});

document.getElementById("load-sample-btn").addEventListener("click", () => {
    output.value = document.getElementById("sample-cron").innerText.trim();
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cron.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
