const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------------- ZIP CREATION ---------------- */

document.getElementById("zip-btn").addEventListener("click", async () => {
    const files = document.getElementById("zip-input").files;

    if (!files.length) {
        showToast("No files selected");
        return;
    }

    const zipWriter = new WritableStream({
        start() {
            this.files = [];
        },
        write(chunk) {
            this.files.push(chunk);
        },
        close() {}
    });

    const zipStream = new CompressionStream("gzip");
    const writer = zipStream.writable.getWriter();

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        await writer.write(new Uint8Array(arrayBuffer));
    }

    await writer.close();

    const compressed = await new Response(zipStream.readable).arrayBuffer();
    const blob = new Blob([compressed], { type: "application/zip" });

    const url = URL.createObjectURL(blob);
    const link = document.getElementById("zip-download");
    link.href = url;
    link.style.display = "block";

    showToast("ZIP created");
});

document.getElementById("zip-clear-btn").addEventListener("click", () => {
    document.getElementById("zip-input").value = "";
    document.getElementById("zip-download").style.display = "none";
});

/* ---------------- ZIP EXTRACTION ---------------- */

document.getElementById("unzip-btn").addEventListener("click", async () => {
    const file = document.getElementById("unzip-input").files[0];

    if (!file) {
        showToast("No ZIP selected");
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const stream = new Blob([arrayBuffer]).stream().pipeThrough(new DecompressionStream("gzip"));
    const decompressed = await new Response(stream).arrayBuffer();

    const results = document.getElementById("unzip-results");
    results.innerHTML = "";

    const blob = new Blob([decompressed]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "unzipped-file";
    a.textContent = "Download Extracted File";

    results.appendChild(a);

    showToast("ZIP extracted");
});

document.getElementById("unzip-clear-btn").addEventListener("click", () => {
    document.getElementById("unzip-input").value = "";
    document.getElementById("unzip-results").innerHTML = "<p>No ZIP extracted.</p>";
});
