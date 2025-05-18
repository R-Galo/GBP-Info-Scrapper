// background.js

// Currently not doing anything, but required by manifest, potentially useful for future features such as
// notifications, context menus, etc.
chrome.runtime.onInstalled.addListener(() => {
  console.log("Google Business Profile Scraper Extension Installed");
});
