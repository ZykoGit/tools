const toast = document.getElementById("toast");
const textInput = document.getElementById("text-input");
const morseOutput = document.getElementById("morse-output");
const morseInput = document.getElementById("morse-input");
const textOutput = document.getElementById("text-output");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// International Morse Code mapping
const TEXT_TO_MORSE = {
    "A": ".-",    "B": "-...",  "C": "-.-.",  "D": "-..",
    "E": ".",     "F": "..-.",  "G": "--.",   "H": "....",
    "I": "..",    "J": ".---",  "K": "-.-",   "L": ".-..",
    "M": "--",    "N": "-.",    "O": "---",   "P": ".--.",
    "Q": "--.-",  "R": ".-.",   "S": "...",   "T": "-",
    "U": "..-",   "V": "...-",  "W": ".--",   "X": "-..-",
    "Y": "-.--",  "Z": "--..",

    "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",

    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
    "!": "-.-.--", "/": "-..-.",  "(": "-.--.",  ")": "-.--.-",
    "&": ".-...",  ":": "---...", ";": "-.-.-.",
    "=": "-...-",  "+": ".-.-.",  "-": "-....-",
    "_": "..--.-", "\"": ".-..-.", "$": "...-..-",
    "@": ".--.-."
};

// Reverse mapping
const MORSE_TO_TEXT = {};
Object.keys(TEXT_TO_MORSE).forEach(ch => {
    MORSE_TO_TEXT[TEXT_TO_MORSE[ch]] = ch;
});

function textToMorse(text) {
    return text
        .toUpperCase()
        .split("")
        .map(ch => {
            if (ch === " ") return "/"; // word separator
            return TEXT_TO_MORSE[ch] || ch;
        })
        .join(" ");
}

function morseToText(morse) {
    return morse
        .trim()
        .split(" / ") // split words
        .map(word =>
            word
                .split(" ")
                .map(code => MORSE_TO_TEXT[code] || "")
                .join("")
        )
        .join(" ");
}

// Live: Text → Morse
textInput.addEventListener("input", () => {
    const value = textInput.value;
    if (!value) {
        morseOutput.textContent = "Morse code will appear here.";
        return;
    }
    const morse = textToMorse(value);
    morseOutput.textContent = morse;
});

// Live: Morse → Text
morseInput.addEventListener("input", () => {
    const value = morseInput.value.trim();
    if (!value) {
        textOutput.textContent = "Translated text will appear here.";
        return;
    }
    const text = morseToText(value);
    textOutput.textContent = text;
});

// Optional: small hint toast on first load
setTimeout(() => {
    showToast("Type in either box to translate live");
}, 500);
