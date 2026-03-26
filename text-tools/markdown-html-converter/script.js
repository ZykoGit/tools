const input = document.getElementById("input");
const output = document.getElementById("output");
const toast = document.getElementById("toast");

const modeMdHtmlBtn = document.getElementById("mode-md-html");
const modeHtmlMdBtn = document.getElementById("mode-html-md");

let currentMode = "md-html"; // or "html-md"

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// --- Mode switching ---
modeMdHtmlBtn.addEventListener("click", () => {
    currentMode = "md-html";
    modeMdHtmlBtn.classList.add("active");
    modeHtmlMdBtn.classList.remove("active");
});

modeHtmlMdBtn.addEventListener("click", () => {
    currentMode = "html-md";
    modeHtmlMdBtn.classList.add("active");
    modeMdHtmlBtn.classList.remove("active");
});

// --- Simple Markdown → HTML ---
function markdownToHtml(md) {
    let html = md;

    // Escape basic HTML
    html = html.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^###### (.*)$/gm, "<h6>$1</h6>");
    html = html.replace(/^##### (.*)$/gm, "<h5>$1</h5>");
    html = html.replace(/^#### (.*)$/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    // Bold & italic & code
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/`(.+?)`/g, "<code>$1</code>");

    // Lists
    html = html.replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // Paragraphs (simple)
    html = html.replace(/^(?!<h\d>|<ul>|<li>|<\/ul>|<p>|<code>|<pre>)(.+)$/gm, "<p>$1</p>");

    return html;
}

// --- Simple HTML → Markdown ---
function htmlToMarkdown(html) {
    let md = html;

    // Headings
    md = md.replace(/<h1>(.*?)<\/h1>/gi, "# $1\n");
    md = md.replace(/<h2>(.*?)<\/h2>/gi, "## $1\n");
    md = md.replace(/<h3>(.*?)<\/h3>/gi, "### $1\n");
    md = md.replace(/<h4>(.*?)<\/h4>/gi, "#### $1\n");
    md = md.replace(/<h5>(.*?)<\/h5>/gi, "##### $1\n");
    md = md.replace(/<h6>(.*?)<\/h6>/gi, "###### $1\n");

    // Bold, italic, code
    md = md.replace(/<strong>(.*?)<\/strong>/gi, "**$1**");
    md = md.replace(/<b>(.*?)<\/b>/gi, "**$1**");
    md = md.replace(/<em>(.*?)<\/em>/gi, "*$1*");
    md = md.replace(/<i>(.*?)<\/i>/gi, "*$1*");
    md = md.replace(/<code>(.*?)<\/code>/gi, "`$1`");

    // Lists
    md = md.replace(/<li>(.*?)<\/li>/gi, "- $1\n");
    md = md.replace(/<\/ul>/gi, "\n");
    md = md.replace(/<ul>/gi, "\n");

    // Paragraphs
    md = md.replace(/<p>(.*?)<\/p>/gi, "$1\n\n");

    // Line breaks
    md = md.replace(/<br\s*\/?>/gi, "\n");

    // Strip remaining tags
    md = md.replace(/<\/?[^>]+(>|$)/g, "");

    // Trim extra whitespace
    return md.trim();
}

// --- Convert ---
document.getElementById("convert-btn").addEventListener("click", () => {
    const value = input.value;

    if (!value.trim()) {
        output.value = "";
        showToast("No input");
        return;
    }

    if (currentMode === "md-html") {
        output.value = markdownToHtml(value);
    } else {
        output.value = htmlToMarkdown(value);
    }

    showToast("Converted");
});

// --- Clear ---
document.getElementById("clear-btn").addEventListener("click", () => {
    input.value = "";
    output.value = "";
});

// --- Load sample ---
document.getElementById("load-sample-btn").addEventListener("click", () => {
    if (currentMode === "md-html") {
        input.value = document.getElementById("sample-md").innerText.trim();
    } else {
        input.value = document.getElementById("sample-html").innerText.trim();
    }
});

// --- Copy ---
document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showToast("Copied");
    } catch {
        showToast("Copy failed");
    }
});
