// function createPopup(enhancedPrompt) {
//   const overlay = document.createElement("div");
//   overlay.id = "promptly-popup";
//   overlay.style.cssText = `
//     position: fixed;
//     top: 20%;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 400px;
//     background: #fff;
//     border-radius: 10px;
//     box-shadow: 0 0 20px rgba(0,0,0,0.3);
//     padding: 20px;
//     z-index: 9999;
//     font-family: sans-serif;
//   `;

//   overlay.innerHTML = `
//     <h3 style="margin-top: 0;">🛠️ Enhanced Prompt</h3>
//     <textarea id="enhanced-box" style="width: 100%; height: 120px; padding: 8px;">${enhancedPrompt}</textarea>
//     <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 10px;">
//       <button id="apply-btn" style="background: #28a745; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer;">✅ Apply</button>
//       <button id="cancel-btn" style="background: #dc3545; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer;">❌ Cancel</button>
//     </div>
//   `;

//   document.body.appendChild(overlay);

//   // ✅ Attach listeners after element is inserted
//   const applyBtn = overlay.querySelector("#apply-btn");
//   const cancelBtn = overlay.querySelector("#cancel-btn");

//   applyBtn.addEventListener("click", () => {
//     const newPrompt = document.getElementById("enhanced-box").value;
//     if (currentInputElement) {
//       currentInputElement.innerText = newPrompt;

//       // Move cursor to end (for ChatGPT-style editors)
//       const range = document.createRange();
//       const sel = window.getSelection();
//       range.selectNodeContents(currentInputElement);
//       range.collapse(false);
//       sel.removeAllRanges();
//       sel.addRange(range);
//     }
//     overlay.remove();
//   });

//   cancelBtn.addEventListener("click", () => {
//     overlay.remove();
//   });
// }

let currentInputElement = null;

function createEnhanceButton() {
  const btn = document.createElement("button");
  btn.innerText = "✨ Enhance Prompt";
  btn.id = "promptly-enhance-btn";
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    zIndex: "9999",
    padding: "10px 16px",
    background: "#6f42c1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  });
  btn.onclick = enhancePromptFlow;
  document.body.appendChild(btn);
  console.log("[Promptly] Button injected");
}

function createPopup(enhancedPrompt) {
  const overlay = document.createElement("div");
  overlay.id = "promptly-popup";
  overlay.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    padding: 20px;
    z-index: 9999;
    font-family: sans-serif;
  `;

  overlay.innerHTML = `
    <h3 style="margin-top: 0;">🛠️ Enhanced Prompt</h3>
    <textarea id="enhanced-box" style="width: 100%; height: 120px; padding: 8px;">${enhancedPrompt}</textarea>
    <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 10px;">
      <button id="apply-btn" style="background: #28a745; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer;">✅ Apply</button>
      <button id="cancel-btn" style="background: #dc3545; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer;">❌ Cancel</button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#apply-btn").addEventListener("click", () => {
    const newPrompt = document.getElementById("enhanced-box").value;
    if (currentInputElement) {
      currentInputElement.innerText = newPrompt;
    }
    overlay.remove();
  });

  overlay.querySelector("#cancel-btn").addEventListener("click", () => {
    overlay.remove();
  });
}

async function enhancePromptFlow() {
  const editors = Array.from(document.querySelectorAll("div[contenteditable='true']"));
  const inputBox = editors.find(div => {
    const style = window.getComputedStyle(div);
    return style.display !== "none" && style.visibility !== "hidden" && div.innerText.trim().length > 0;
  });

  if (!inputBox) {
    alert("No valid prompt input found.");
    return;
  }

  const rawPrompt = inputBox.innerText.trim();
  currentInputElement = inputBox;

  const res = await fetch("http://localhost:8000/enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_prompt: rawPrompt })
  });

  const data = await res.json();
  createPopup(data.enhanced_prompt);
}

// ✅ Run only when page is fully loaded
window.addEventListener("load", () => {
  console.log("[Promptly] Page loaded");
  createEnhanceButton();
});
