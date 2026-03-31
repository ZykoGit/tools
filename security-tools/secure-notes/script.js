const toast = document.getElementById("toast");
const notesBox = document.getElementById("notes-box");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Load saved notes
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("secureNotes");
    if (saved) {
        notesBox.value = saved;
        showToast("Notes loaded");
    }
});

// Save notes
document.getElementById("save-btn").addEventListener("click", () => {
    localStorage.setItem("secureNotes", notesBox.value);
    showToast("Notes saved");
});

// Clear notes
document.getElementById("clear-btn").addEventListener("click", () => {
    notesBox.value = "";
    localStorage.removeItem("secureNotes");
    showToast("Notes cleared");
});
