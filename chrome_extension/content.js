function isGitHubRepoPage(url) {
  const parts = url.split('/');
  return parts.length >= 5 && parts[2] === 'github.com';
}

function injectSummaryBox(summary, structure) {
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.top = '10px';
  box.style.right = '10px';
  box.style.width = '350px';
  box.style.maxHeight = '400px';
  box.style.overflowY = 'auto';
  box.style.padding = '12px';
  box.style.background = '#fff';
  box.style.border = '1px solid #ccc';
  box.style.borderRadius = '8px';
  box.style.zIndex = '9999';
  box.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  box.style.fontSize = '12px';
  box.style.fontFamily = 'monospace';

  box.innerHTML = `<strong>📄 AI Repo Summary:</strong><br><br>${summary}<br><hr><strong>📁 Structure:</strong><br><pre>${JSON.stringify(structure, null, 2)}</pre>`;

  document.body.appendChild(box);
}

(async function () {
  if (!isGitHubRepoPage(window.location.href)) return;

  try {
    const response = await fetch("https://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: window.location.href })
    });

    const data = await response.json();
    if (data.summary && data.structure) {
      injectSummaryBox(data.summary, data.structure);
    }
  } catch (err) {
    console.error("AI Repo Summarizer failed:", err);
  }
})();
