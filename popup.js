document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab.id, { action: "getBusinessInfo" }, (response) => {
      if (chrome.runtime.lastError || !response) return;

      document.getElementById("name").textContent = response.name;
      document.getElementById("address").textContent = response.address;
      document.getElementById("phone").textContent = response.phone;
      document.getElementById("website").textContent = response.website;
      document.getElementById("website").href = response.website;
      document.getElementById("cid").textContent = response.cidLink;
      document.getElementById("cid").href = response.cidLink;

      document.getElementById("copyCid").addEventListener("click", () => {
        navigator.clipboard.writeText(response.cidLink);
      });
    });
  });
});
