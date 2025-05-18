function getBusinessInfo() {
  const name = document.querySelector('h1')?.textContent || '';
  const address = document.querySelector('[data-item-id="address"]')?.textContent || '';
  const phone = document.querySelector('[data-tooltip="Copy phone number"]')?.textContent || '';
  const website = document.querySelector('a[data-item-id="authority"]')?.href || '';

  // Extract CID from the URL
  const match = window.location.href.match(/\/place\/.*\/@(.*?),/);
  const cidLink = match ? `https://www.google.com/maps?cid=${match[1]}` : '';

  return { name, address, phone, website, cidLink };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getBusinessInfo") {
    sendResponse(getBusinessInfo());
  }
});
