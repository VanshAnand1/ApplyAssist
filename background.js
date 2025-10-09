chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.windows) return;

  const { oldValue, newValue } = changes.windows;
  // do your sync/broadcast/work here
  // e.g., notify UIs:
  chrome.runtime.sendMessage({ type: "windows-updated", oldValue, newValue });
});
