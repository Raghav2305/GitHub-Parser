function isGitHubRepoPage(url) {
  const parts = url.split('/');
  return parts.length >= 5 && parts[2] === 'github.com';
}

function injectSummaryBox(summary, structure) {
  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.top = '10px';
  box.style.right = '10px';
  box.style.width = '440px';
  box.style.maxHeight = '540px';
  box.style.overflow = 'hidden';
  box.style.background = '#1e1e2f';
  box.style.border = '1px solid #444';
  box.style.borderRadius = '10px';
  box.style.zIndex = '9999';
  box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  box.style.fontFamily = 'monospace';
  box.style.color = '#f5f5f5';

  const formattedSummary = summary
    .replace(/#+\s?(.*)/g, '<strong style="color:#58a6ff;">$1</strong>')
    .replace(/\*\s/g, '• ')
    .replace(/\n/g, '<br>');

  function renderStructureAsDetails(obj, indent = 0) {
    let html = "";
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object') {
        html += `<details style="margin-left:${indent}px;"><summary>📁 ${key}</summary>${renderStructureAsDetails(value, indent + 12)}</details>`;
      } else {
        html += `<div style="margin-left:${indent + 12}px;">📄 ${key}</div>`;
      }
    }
    return html;
  }

  const structureTreeHTML = renderStructureAsDetails(structure);
  const structureJSONHTML = `<pre style="
    background:#282c34;
    padding: 10px;
    border-radius: 6px;
    color: #e2e2e2;
    overflow-x: auto;
    font-size: 12px;
    max-height: 300px;
  ">${JSON.stringify(structure, null, 2)}</pre>`;

  box.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px;">
      <strong style="color: #58a6ff;">📦 Repo Summary</strong>
      <button id="close-summary-box" style="
        background: transparent;
        border: none;
        color: #ccc;
        font-size: 16px;
        cursor: pointer;
      " title="Close">❌</button>
    </div>

    <div style="display: flex; border-bottom: 1px solid #333; margin: 0 16px;">
      <button id="tab-summary" style="
        flex: 1;
        padding: 10px;
        background: #2b2b3d;
        border: none;
        color: #58a6ff;
        font-weight: bold;
        cursor: pointer;
      ">📄 Summary</button>
      <button id="tab-structure" style="
        flex: 1;
        padding: 10px;
        background: transparent;
        border: none;
        color: #aaa;
        cursor: pointer;
      ">📁 Structure</button>
    </div>

    <div id="tab-content" style="padding: 16px; font-size: 13px; line-height: 1.5; overflow-y: auto; max-height: 360px;">
      <div id="summary-content">${formattedSummary}</div>
      <div id="structure-content" style="display:none;">
        <div style="margin-bottom: 8px;">
          <button id="toggle-structure-view" style="
            padding: 4px 10px;
            font-size: 12px;
            background: #333;
            color: #fff;
            border: 1px solid #666;
            border-radius: 4px;
            cursor: pointer;
          ">🔄 Show Raw JSON</button>
        </div>
        <div id="structure-tree">${structureTreeHTML}</div>
        <div id="structure-json" style="display:none;">${structureJSONHTML}</div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #333;">
      <button id="copy-summary" style="
        background: #58a6ff;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
      ">📋 Copy Summary</button>

      <button id="download-summary" style="
        background: #2f81f7;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
      ">📎 Download .md</button>
    </div>
  `;

  document.body.appendChild(box);

  // Close
  document.getElementById('close-summary-box').addEventListener('click', () => box.remove());

  // Tabs
  document.getElementById('tab-summary').addEventListener('click', () => {
    document.getElementById('summary-content').style.display = 'block';
    document.getElementById('structure-content').style.display = 'none';
    setActiveTab(true);
  });

  document.getElementById('tab-structure').addEventListener('click', () => {
    document.getElementById('summary-content').style.display = 'none';
    document.getElementById('structure-content').style.display = 'block';
    setActiveTab(false);
  });

  function setActiveTab(isSummary) {
    document.getElementById('tab-summary').style.background = isSummary ? '#2b2b3d' : 'transparent';
    document.getElementById('tab-summary').style.color = isSummary ? '#58a6ff' : '#aaa';
    document.getElementById('tab-structure').style.background = !isSummary ? '#2b2b3d' : 'transparent';
    document.getElementById('tab-structure').style.color = !isSummary ? '#58a6ff' : '#aaa';
  }

  // Copy Summary
  document.getElementById('copy-summary').addEventListener('click', () => {
    navigator.clipboard.writeText(summary).then(() => {
      const btn = document.getElementById('copy-summary');
      btn.textContent = '✅ Copied!';
      setTimeout(() => (btn.textContent = '📋 Copy Summary'), 2000);
    });
  });

  // Download Summary as .md
  document.getElementById('download-summary').addEventListener('click', () => {
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repo-summary.md';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Toggle Structure View
  let isTree = true;
  document.getElementById('toggle-structure-view').addEventListener('click', () => {
    isTree = !isTree;
    document.getElementById('structure-tree').style.display = isTree ? 'block' : 'none';
    document.getElementById('structure-json').style.display = isTree ? 'none' : 'block';
    document.getElementById('toggle-structure-view').textContent = isTree ? '🔄 Show Raw JSON' : '🔄 Show Tree View';
  });
}





console.log("🧠 GitHub Repo Summarizer content script running");

(async function () {
  if (!isGitHubRepoPage(window.location.href)) {
    console.log("⛔ Not a GitHub repo page. Skipping.");
    return;
  }

  console.log("✅ GitHub repo page detected. Sending fetch...");

  try {
    const response = await fetch("https://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo_url: window.location.href })
    });

    const data = await response.json();
    console.log("📦 Response from server:", data);

    if (data.summary && data.structure) {
      injectSummaryBox(data.summary, data.structure);
    } else {
      console.warn("⚠️ No summary or structure returned.");
    }
  } catch (err) {
    console.error("❌ AI Repo Summarizer failed:", err);
  }
})();
