const toast = document.getElementById("toast");
const output = document.getElementById("output");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

const lengthSlider = document.getElementById("length");
const lengthLabel = document.getElementById("length-label");

lengthSlider.addEventListener("input", () => {
    lengthLabel.textContent = lengthSlider.value;
});

function generatePassword() {
    const length = parseInt(lengthSlider.value);

    const useLower = document.getElementById("lowercase").checked;
    const useUpper = document.getElementById("uppercase").checked;
    const useNums = document.getElementById("numbers").checked;
    const useSyms = document.getElementById("symbols").checked;

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+-=[]{};:,.<>/?";

    let pool = "";
    if (useLower) pool += lower;
    if (useUpper) pool += upper;
    if (useNums) pool += nums;
    if (useSyms) pool += syms;

    if (!pool) {
        showToast("Select at least one character type");
        return "";
    }

    let password = "";

    // Ensure at least one of each selected type
    if (useLower) password += lower[Math.floor(Math.random() * lower.length)];
    if (useUpper) password += upper[Math.floor(Math.random() * upper.length)];
    if (useNums) password += nums[Math.floor(Math.random() * nums.length)];
    if (useSyms) password += syms[Math.floor(Math.random() * syms.length)];

    // Fill the rest
    while (password.length < length) {
        password += pool[Math.floor(Math.random() * pool.length)];
    }

    // Shuffle password
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}

document.getElementById("generate-btn").addEventListener("click", () => {
    const pwd = generatePassword();
    if (pwd) {
        output.value = pwd;
        showToast("Password generated");
    }
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!output.value) {
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
