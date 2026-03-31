const toast = document.getElementById("toast");
const outputBox = document.getElementById("output-box");

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

document.getElementById("load-btn").addEventListener("click", async () => {
    outputBox.textContent = "Loading...";

    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const formatted = `
IP Address: ${data.ip}
City: ${data.city}
Region: ${data.region}
Country: ${data.country_name}
Postal Code: ${data.postal}
Latitude: ${data.latitude}
Longitude: ${data.longitude}
Timezone: ${data.timezone}
ISP: ${data.org}
ASN: ${data.asn}
        `.trim();

        outputBox.textContent = formatted;
        showToast("IP info loaded");
    } catch (err) {
        outputBox.textContent = "Failed to load IP info.";
        showToast("Error loading IP info");
    }
});
