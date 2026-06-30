let activeTab = "url";
let selectedFilePath = null;

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const statusMessage = document.getElementById("statusMessage");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeTab = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(`${activeTab}Panel`).classList.add("active");

    setStatus("");
  });
});

document.getElementById("chooseFileBtn").addEventListener("click", async () => {
  selectedFilePath = await window.myFiles2.chooseFile();

  document.getElementById("filePath").innerText =
    selectedFilePath || "No file selected";
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const payload = buildPayload();

  const result = await window.myFiles2.saveItem(payload);

  if (result.success) {
    setStatus(result.message, true);
    clearInputs();
  } else {
    setStatus(result.message, false);
  }
});

function buildPayload() {
  if (activeTab === "url") {
    return {
      sourceType: "url",
      content: document.getElementById("urlInput").value,
      metadata: {}
    };
  }

  if (activeTab === "text") {
    return {
      sourceType: "text",
      content: document.getElementById("textInput").value,
      metadata: {}
    };
  }

  if (activeTab === "file") {
    return {
      sourceType: "attachment",
      content: selectedFilePath || "",
      metadata: {
        originalPath: selectedFilePath
      }
    };
  }
}

function setStatus(message, success = true) {
  statusMessage.innerText = message;
  statusMessage.className = success ? "success" : "failure";
}

function clearInputs() {
  document.getElementById("urlInput").value = "";
  document.getElementById("textInput").value = "";
  selectedFilePath = null;
  document.getElementById("filePath").innerText = "No file selected";
}