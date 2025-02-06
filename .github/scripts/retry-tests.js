const { execSync } = require("child_process");

const MAX_RETRIES = 2;
let attempt = 0;
let success = false;

while (attempt < MAX_RETRIES && !success) {
  console.log(`🔄 Retrying tests (Attempt ${attempt + 1}/${MAX_RETRIES})...`);
  try {
    const output = execSync("npm test", { stdio: "pipe" }).toString();
    console.log(output);
    success = true;
  } catch (error) {
    attempt++;
  }
}

if (!success) {
  console.error("❌ Tests failed after retries.");
  process.exit(1);
} else {
  console.log("✅ Tests passed on retry.");
}
