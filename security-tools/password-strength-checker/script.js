const toast = document.getElementById("toast");
const passwordInput = document.getElementById("password-input");
const strengthBar = document.getElementById("strength-bar");
const strengthLabel = document.getElementById("strength-label");

const lenCheck = document.getElementById("len-check");
const lowerCheck = document.getElementById("lower-check");
const upperCheck = document.getElementById("upper-check");
const numCheck = document.getElementById("num-check");
const symCheck = document.getElementById("sym-check");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateCheckmark(element, condition) {
    element.textContent = condition ? "✔️" : "❌";
}

function evaluatePassword(pwd) {
    let score = 0;

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[^A-Za-z0-9]/.test(pwd);
    const longEnough = pwd.length >= 12;

    updateCheckmark(lenCheck, longEnough);
    updateCheckmark(lowerCheck, hasLower);
    updateCheckmark(upperCheck, hasUpper);
    updateCheckmark(numCheck, hasNum);
    updateCheckmark(symCheck, hasSym);

    if (longEnough) score += 25;
    if (hasLower) score += 15;
    if (hasUpper) score += 15;
    if (hasNum) score += 20;
    if (hasSym) score += 25;

    return score;
}

function updateStrengthUI(score) {
    strengthBar.style.height = "12px";
    strengthBar.style.borderRadius = "6px";

    if (score === 0) {
        strengthBar.style.width = "0%";
        strengthLabel.textContent = "Start typing...";
        return;
    }

    strengthBar.style.width = score + "%";

    if (score < 30) {
        strengthBar.style.background = "#ff3b30";
        strengthLabel.textContent = "Very Weak";
    } else if (score < 50) {
        strengthBar.style.background = "#ff9500";
        strengthLabel.textContent = "Weak";
    } else if (score < 70) {
        strengthBar.style.background = "#ffcc00";
        strengthLabel.textContent = "Medium";
    } else if (score < 90) {
        strengthBar.style.background = "#34c759";
        strengthLabel.textContent = "Strong";
    } else {
        strengthBar.style.background = "#30d158";
        strengthLabel.textContent = "Very Strong";
    }
}

passwordInput.addEventListener("input", () => {
    const pwd = passwordInput.value;
    const score = evaluatePassword(pwd);
    updateStrengthUI(score);
});

document.getElementById("copy-btn").addEventListener("click", async () => {
    if (!passwordInput.value) {
        showToast("Nothing to copy");
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordInput.value);
        showToast("Copied!");
    } catch {
        showToast("Copy failed");
    }
});
