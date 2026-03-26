const jwtInput = document.getElementById("jwt-input");
const headerOut = document.getElementById("header-output");
const payloadOut = document.getElementById("payload-output");
const signatureOut = document.getElementById("signature-output");
const toast = document.getElementById("toast");

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function checkSize(text) {
    const size = new Blob([text]).size;
    if (size > MAX_SIZE) {
        showToast("Input too large");
        return false;
    }
    return true;
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = str + "=".repeat((4 - (str.length % 4)) % 4);
    return decodeURIComponent(escape(atob(padded)));
}

document.getElementById("decode-btn").addEventListener("click", () => {
    if (!checkSize(jwtInput.value)) return;

    const parts = jwtInput.value.split(".");
    if (parts.length !== 3) {
        headerOut.value = payloadOut.value = signatureOut.value = "";
        showToast("Invalid JWT");
        return;
    }

    try {
        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        headerOut.value = JSON.stringify(header, null, 4);
        payloadOut.value = JSON.stringify(payload, null, 4);
        signatureOut.value = parts[2];

        showToast("Decoded");
    } catch (err) {
        headerOut.value = payloadOut.value = signatureOut.value = "";
        showToast("Decode failed");
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
    jwtInput.value = "";
    headerOut.value = "";
    payloadOut.value = "";
    signatureOut.value = "";
});

// Load sample
document.getElementById("load-sample-btn").addEventListener("click", () => {
    jwtInput.value = document.getElementById("sample-jwt").innerText.trim();
});

// Copy all
document.getElementById("copy-btn").addEventListener("click", async () => {
    const combined = 
`Header:
${headerOut.value}

Payload:
${payloadOut.value}

Signature:
${signatureOut.value}`;

    try {
        await navigator.clipboard.writeText(combined);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});

// Download JSON
document.getElementById("download-btn").addEventListener("click", () => {
    const data = {
        header: headerOut.value ? JSON.parse(headerOut.value) : null,
        payload: payloadOut.value ? JSON.parse(payloadOut.value) : null,
        signature: signatureOut.value
    };

    const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "jwt-decoded.json";
    a.click();

    URL.revokeObjectURL(url);
    showToast("Downloaded");
});
