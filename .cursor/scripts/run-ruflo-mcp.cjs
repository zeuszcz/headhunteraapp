const { spawn } = require("child_process");
const { loadMcpEnv } = require("./load-mcp-env.cjs");

loadMcpEnv();

const child =
  process.platform === "win32"
    ? spawn(
        process.env.ComSpec || "cmd.exe",
        ["/d", "/s", "/c", "npx -y ruflo@latest mcp start"],
        { stdio: "inherit", env: process.env }
      )
    : spawn("npx", ["-y", "ruflo@latest", "mcp", "start"], {
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
  console.error("Failed to start ruflo MCP:", err.message);
  process.exit(1);
});
