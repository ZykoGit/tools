const fileInput = document.getElementById("file-input");
const output = document.getElementById("output");
const previewBox = document.getElementById("preview-box");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        const dataURL = reader.result;

        // Show preview
        previewBox.innerHTML = `<img src="${dataURL}" style="max-width:100%; border-radius:8px;">`;

        // Output full data URL
        output.value = dataURL;
    };

    reader.readAsDataURL(file);
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!output.value.trim()) {
        showToast("Nothing to copy");
        return;
    }

    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied!");
    } catch {
        showToast("Copy failed");
    }
});
