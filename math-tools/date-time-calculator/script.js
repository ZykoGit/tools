const toast = document.getElementById("toast");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// ---------------- Date Difference ----------------

document.getElementById("diff-btn").addEventListener("click", () => {
    const d1 = document.getElementById("date1").value;
    const d2 = document.getElementById("date2").value;

    if (!d1 || !d2) {
        showToast("Select both dates");
        return;
    }

    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffMs = Math.abs(date2 - date1);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    document.getElementById("diff-output").value =
        `Difference: ${diffDays} days\nMilliseconds: ${diffMs}`;
    showToast("Calculated");
});

// ---------------- Add/Subtract Time ----------------

document.getElementById("add-btn").addEventListener("click", () => {
    const base = document.getElementById("base-datetime").value;
    if (!base) {
        showToast("Select a base date/time");
        return;
    }

    const dt = new Date(base);

    const days = parseInt(document.getElementById("add-days").value) || 0;
    const hours = parseInt(document.getElementById("add-hours").value) || 0;
    const mins = parseInt(document.getElementById("add-mins").value) || 0;

    dt.setDate(dt.getDate() + days);
    dt.setHours(dt.getHours() + hours);
    dt.setMinutes(dt.getMinutes() + mins);

    document.getElementById("add-output").value = dt.toString();
    showToast("Updated");
});

// ---------------- Timestamp Converter ----------------

document.getElementById("ts-to-date-btn").addEventListener("click", () => {
    const ts = parseInt(document.getElementById("timestamp").value);
    if (isNaN(ts)) {
        showToast("Invalid timestamp");
        return;
    }

    const date = new Date(ts * 1000);
    document.getElementById("ts-output").value = date.toString();
    showToast("Converted");
});

document.getElementById("date-to-ts-btn").addEventListener("click", () => {
    const ts = Math.floor(Date.now() / 1000);
    document.getElementById("ts-output").value = ts;
    showToast("Generated");
});

// ---------------- Current Time ----------------

document.getElementById("now-btn").addEventListener("click", () => {
    const now = new Date();
    document.getElementById("now-output").value = now.toString();
    showToast("Inserted");
});
