document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Only allow GitHub repo URLs
  if (!url.includes("github.com")) {
    document.getElementById("result").textContent = "❌ Not a valid GitHub repo URL.";
    return;
  }

  document.getElementById("result").textContent = "⏳ Analyzing repo...";

  try {
    const response = await fetch("https://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: url })
    });

    const data = await response.json();

    if (data.error) {
      document.getElementById("result").textContent = "❌ " + data.error;
    } else {
      document.getElementById("result").textContent =
        "📄 Summary:\n" + data.summary + "\n\n📁 Structure:\n" + JSON.stringify(data.structure, null, 2);
    }
  } catch (err) {
    document.getElementById("result").textContent = "⚠️ Failed to fetch summary.";
    console.error(err);
  }
});