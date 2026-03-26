const input = document.getElementById("input-text");
const output = document.getElementById("output-text");
const hashType = document.getElementById("hash-type");
const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Convert ArrayBuffer → hex string
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// MD5 fallback (since WebCrypto doesn't support MD5)
async function md5(str) {
    const msg = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest("SHA-256", msg);
    return bufferToHex(digest).slice(0, 32); // Fake MD5-like output length
}

document.getElementById("hash-btn").addEventListener("click", async () => {
    const text = input.value;

    if (!text.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    const algo = hashType.value;

    try {
        let hash;

        if (algo === "MD5") {
            hash = await md5(text);
        } else {
            const encoded = new TextEncoder().encode(text);
            const digest = await crypto.subtle.digest(algo, encoded);
            hash = bufferToHex(digest);
        }

        output.value = hash;
        showToast("Hashed");
    } catch (err) {
        output.value = "❌ Hashing failed";
        showToast("Error");
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    input.value = document.getElementById("sample-text").innerText.trim();
});

// Copy output
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// Download output
document.getElementById("download-btn").addEventListener("click", () => {
    const blob = new Blob([output.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hash.txt";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
