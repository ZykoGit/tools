const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function parseUserAgent(ua) {
    const result = {
        browser: "Unknown",
        version: "Unknown",
        os: "Unknown",
        device: "Desktop",
        raw: ua
    };

    // Browser detection
    if (/Edg\//.test(ua)) {
        result.browser = "Microsoft Edge";
        result.version = ua.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";
    } else if (/Chrome\//.test(ua)) {
        result.browser = "Google Chrome";
        result.version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
    } else if (/Firefox\//.test(ua)) {
        result.browser = "Mozilla Firefox";
        result.version = ua.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";
    } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
        result.browser = "Safari";
        result.version = ua.match(/Version\/([\d.]+)/)?.[1] || "Unknown";
    }

    // OS detection
    if (/Windows NT/.test(ua)) result.os = "Windows";
    else if (/Mac OS X/.test(ua)) result.os = "macOS";
    else if (/Android/.test(ua)) result.os = "Android";
    else if (/iPhone|iPad/.test(ua)) result.os = "iOS";
    else if (/Linux/.test(ua)) result.os = "Linux";

    // Device type
    if (/Mobile|iPhone|Android/.test(ua)) result.device = "Mobile";
    if (/iPad|Tablet/.test(ua)) result.device = "Tablet";

    return result;
}

document.getElementById("parse-btn").addEventListener("click", () => {
    const ua = navigator.userAgent;
    const parsed = parseUserAgent(ua);

    const formatted = `
Browser: ${parsed.browser}
Version: ${parsed.version}
Operating System: ${parsed.os}
Device Type: ${parsed.device}

Raw User Agent:
${parsed.raw}
    `.trim();

    outputBox.textContent = formatted;
    showToast("User agent parsed");
});
