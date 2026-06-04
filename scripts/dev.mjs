import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(rootDir, "..");
const viteBin = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");
const backendEntry = path.join(projectRoot, "backend", "node-backend.mjs");

const childProcesses = [];

function startProcess(label, command, args) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`${label} exited with signal ${signal}`);
    } else {
      console.log(`${label} exited with code ${code ?? 0}`);
    }

    for (const proc of childProcesses) {
      if (!proc.killed) {
        proc.kill();
      }
    }
    process.exit(code ?? 0);
  });

  childProcesses.push(child);
  return child;
}

startProcess("backend", process.execPath, [backendEntry]);

setTimeout(() => {
  startProcess("vite", process.execPath, [viteBin, "dev"]);
}, 800);

process.on("SIGINT", () => {
  for (const proc of childProcesses) {
    if (!proc.killed) {
      proc.kill("SIGINT");
    }
  }
  process.exit(0);
});
