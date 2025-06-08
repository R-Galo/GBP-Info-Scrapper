// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getBusinessInfo") {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { action: "getBusinessInfo" }, sendResponse);
        });
        return true; // Keep sendResponse alive for async communication
    }
});