const { spawn } = require("child_process");
const { loadMcpEnv } = require("./load-mcp-env.cjs");

loadMcpEnv();

if (!process.env.API_KEY && process.env.MAGIC_API_KEY) {
  process.env.API_KEY = process.env.MAGIC_API_KEY;
}

if (!process.env.API_KEY) {
  console.error("Missing API key for @21st-dev/magic.");
  console.error("Set API_KEY or MAGIC_API_KEY in .cursor/mcp.secrets.env.");
  process.exit(1);
}

const child =
  process.platform === "win32"
    ? spawn(
        process.env.ComSpec || "cmd.exe",
        ["/d", "/s", "/c", "npx -y @21st-dev/magic@latest"],
        { stdio: "inherit", env: process.env }
      )
    : spawn("npx", ["-y", "@21st-dev/magic@latest"], {
        stdio: "inherit",
        env: process.env,
      });

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on("error", (err) => {
  console.error("Failed to start @21st-dev/magic MCP:", err.message);
  process.exit(1);
});
