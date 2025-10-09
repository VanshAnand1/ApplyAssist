chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.windows) return;

  const { oldValue, newValue } = changes.windows;
  chrome.runtime.sendMessage({ type: "windows-updated", oldValue, newValue });
});
