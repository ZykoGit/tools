// script.js
const toast = document.getElementById("toast");
const zipInput = document.getElementById("zip-input");
const zipBtn = document.getElementById("zip-btn");
const zipClearBtn = document.getElementById("zip-clear-btn");
const zipDownload = document.getElementById("zip-download");

const unzipInput = document.getElementById("unzip-input");
const unzipBtn = document.getElementById("unzip-btn");
const unzipClearBtn = document.getElementById("unzip-clear-btn");
const unzipResults = document.getElementById("unzip-results");

function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ---------------- CREATE ZIP (JSZip) ---------------- */
zipBtn.addEventListener("click", async () => {
  const files = zipInput.files;
  if (!files || files.length === 0) {
    showToast("No files selected");
    return;
  }

  try {
    const zip = new JSZip();

    // Add each file to the zip root
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      zip.file(file.name, arrayBuffer);
    }

    // Generate zip as blob
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });

    // Create download link
    const url = URL.createObjectURL(blob);
    zipDownload.href = url;
    zipDownload.download = "archive.zip";
    zipDownload.style.display = "inline-block";
    zipDownload.textContent = "Download ZIP";

    showToast("ZIP created");
  } catch (err) {
    console.error(err);
    showToast("Failed to create ZIP");
  }
});

zipClearBtn.addEventListener("click", () => {
  zipInput.value = "";
  zipDownload.style.display = "none";
});

/* ---------------- EXTRACT ZIP (JSZip) ---------------- */
unzipBtn.addEventListener("click", async () => {
  const file = unzipInput.files[0];
  if (!file) {
    showToast("No ZIP selected");
    return;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    unzipResults.innerHTML = ""; // clear

    // If zip is empty
    if (Object.keys(zip.files).length === 0) {
      unzipResults.innerHTML = "<p>ZIP is empty.</p>";
      showToast("ZIP extracted (no files)");
      return;
    }

    // For each file in the archive, create a download link
    for (const relativePath in zip.files) {
      const entry = zip.files[relativePath];

      // Skip directories
      if (entry.dir) {
        const p = document.createElement("p");
        p.textContent = `Folder: ${relativePath}`;
        unzipResults.appendChild(p);
        continue;
      }

      // Get blob for file
      const blob = await entry.async("blob");
      const url = URL.createObjectURL(blob);

      const row = document.createElement("div");
      row.className = "unzip-row";

      const name = document.createElement("span");
      name.textContent = relativePath;
      name.style.marginRight = "12px";

      const a = document.createElement("a");
      a.href = url;
      a.download = relativePath.split("/").pop();
      a.textContent = "Download";

      row.appendChild(name);
      row.appendChild(a);
      unzipResults.appendChild(row);
    }

    showToast("ZIP extracted");
  } catch (err) {
    console.error(err);
    unzipResults.innerHTML = "<p>Failed to extract ZIP.</p>";
    showToast("Failed to extract ZIP");
  }
});

unzipClearBtn.addEventListener("click", () => {
  unzipInput.value = "";
  unzipResults.innerHTML = "<p>No ZIP extracted.</p>";
});
