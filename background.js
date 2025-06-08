chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setPopup({ popup: "popup.html" });
});

// Listen for messages from popup.js requesting business info
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getBusinessInfo") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs.length || tabs[0].url.startsWith("chrome://")) {
                console.error("Invalid tab or cannot access chrome:// URLs.");
                sendResponse({});
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                // Inject the script to extract business information
                function: () => {
                    const name = document.querySelector('h1[class*="DUwDvf"]')?.textContent || '';
                    const address = document.querySelector('[data-item-id="address"]')?.textContent || '';
                    const phone = document.querySelector('[data-tooltip="Copy phone number"]')?.textContent || '';
                    const website = document.querySelector('a[data-item-id="authority"]')?.href || '';

                    let cid = '';

                    // CID Extraction logic
                    // 🔎 0️⃣ Check if CID is in the URL path (e.g., /:0x123456789012345!/)
                    const path = window.location.pathname;
                    const match = path.match(/:0x[a-fA-F0-9]{15,18}!/);
                    const hexCID = match ? match[0].slice(3, -1) : null;
                    const decimalCID = hexCID ? BigInt("0x" + hexCID).toString() : "N/A";
                    cid = decimalCID;

                    // Fallback to "N/A" if CID is not found
                    if (cid === "N/A") {
                        // 🔎 1️⃣ Look for "ludocid" or "cid" in <a> links
                        document.querySelectorAll("a").forEach(a => {
                            const href = a.getAttribute("href");
                            if (href && href.startsWith("http")) {
                                try {
                                    const url = new URL(href);
                                    const ludocid = url.searchParams.get("ludocid");
                                    const cidParam = url.searchParams.get("cid");
                                    if (ludocid) cid = ludocid;
                                    if (cidParam) cid = cidParam;
                                } catch (error) {
                                    console.warn("Skipping invalid URL:", href);
                                }
                            }
                        });
                    }

                    if (cid === "N/A") {
                        // 🔎 2️⃣ If CID isn't found in links, search inside script data
                        document.querySelectorAll("script").forEach(script => {
                            const match = script.innerText.match(/ludocid\\u003d(\d{17})/);
                            if (match) {
                                cid = match[1]; // Extracts the 17-digit CID from encoded format
                            }
                        });
                    }

                    return {
                        name,
                        address,
                        phone,
                        website,
                        cid: cid !== "N/A" ? `https://www.google.com/maps?cid=${cid}` : "N/A"
                    };
                }
            }, (result) => {
                if (!result || !result.length || !result[0]?.result) {
                    console.error("Failed to extract CID, result is undefined:", result);
                    sendResponse({ cid: "CID extraction failed" });
                    return;
                }
                sendResponse(result[0].result);
            });
        });
        return true; // Keep the message channel open for async response
    }
});