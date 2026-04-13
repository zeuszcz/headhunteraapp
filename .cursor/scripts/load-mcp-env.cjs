const fs = require("fs");
const path = require("path");

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function loadMcpEnv() {
  const projectRoot = path.resolve(__dirname, "..", "..");
  const secretsPath = path.join(projectRoot, ".cursor", "mcp.secrets.env");

  if (!fs.existsSync(secretsPath)) {
    return;
  }

  const content = fs.readFileSync(secretsPath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    const value = stripQuotes(line.slice(eqIndex + 1).trim());
    process.env[key] = value;
  }
}

module.exports = {
  loadMcpEnv,
};
