const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { runUpstreamProcessors, runDownstreamProcessors } = require("./processors");

const dataDir = path.join(os.homedir(), "myFiles2_data");
const dataFile = path.join(dataDir, "items.jsonl");

async function saveItem(payload) {
  validatePayload(payload);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    sourceType: payload.sourceType,
    content: payload.content,
    metadata: payload.metadata || {},
    status: "saved"
  };

  await runUpstreamProcessors(record);

  fs.appendFileSync(dataFile, JSON.stringify(record) + "\n", "utf-8");

  await runDownstreamProcessors(record);

  return record;
}

function validatePayload(payload) {
  if (!payload || !payload.sourceType) {
    throw new Error("Invalid input.");
  }

  if (!payload.content || payload.content.trim() === "") {
    throw new Error("Please provide URL, text, or attachment.");
  }
}

module.exports = {
  saveItem
};