document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getBusinessInfo" }, (response) => {
        if (chrome.runtime.lastError || !response) {
            console.error("Error retrieving business info:", chrome.runtime.lastError);
            return;
        }

        // Function to sanitize text and remove hidden Unicode characters
        function cleanText(text) {
            return text?.replace(/[\u0000-\u001F\u007F-\u009F\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g, '').trim() || "N/A";
        }

        document.getElementById("name").textContent = cleanText(response.name);
        document.getElementById("address").textContent = cleanText(response.address);
        document.getElementById("phone").textContent = cleanText(response.phone);
        document.getElementById("website").textContent = cleanText(response.website);
        document.getElementById("website").href = response.website || "#";

        // Handle CID display and link
        const cidLink = document.getElementById('cid');
        if (response.cid) {
            cidLink.href = response.cid;
            cidLink.textContent = response.cid;
            cidLink.style.pointerEvents = 'auto';
            cidLink.style.color = '';
        } else {
            cidLink.textContent = "CID not available";
            cidLink.removeAttribute("href");
            cidLink.style.pointerEvents = 'none';
            cidLink.style.color = 'gray';
        }

        // Copy CID Functionality
        document.getElementById("copyCid").addEventListener("click", () => {
            navigator.clipboard.writeText(response.cid || "No CID available")
                .then(() => console.log("CID copied!"))
                .catch(err => console.error("Clipboard copy failed:", err));
        });

        // CSV Export Functionality
        function formatCSV(value) {
            return `"${value?.replace(/"/g, '""') || ''}"`; // Properly escape CSV fields
        }

        const csvData = [
            ["Company Name", cleanText(response.name)],
            ["Address", cleanText(response.address)],
            ["Phone", cleanText(response.phone)],
            ["Website", response.website || "N/A"],
            ["CID", response.cid || "N/A"]
        ].map(row => row.map(formatCSV).join(",")).join("\n");

        document.getElementById("copyCsv").addEventListener("click", () => {
            navigator.clipboard.writeText(csvData)
                .then(() => console.log("CSV copied!"))
                .catch(err => console.error("Clipboard copy failed:", err));
        });
    });
});