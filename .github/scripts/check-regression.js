const TIME_THRESHOLD_PERCENT = 20;
const MEMORY_THRESHOLD_MB = 10;

const currentResults = process.env.TEST_OUTPUT.trim();
const currentDuration = parseInt(process.env.TEST_DURATION, 10);
const currentMemory = parseInt(process.env.TEST_MEMORY, 10) / (1024 * 1024);

// Simulated "baseline" data stored in environment variables (from GitHub Secrets or default values)
const baselineResults = process.env.BASELINE_RESULTS || "";
const baselineDuration = parseInt(process.env.BASELINE_DURATION || "500", 10);
const baselineMemory = parseInt(process.env.BASELINE_MEMORY || "50", 10);

let regressionDetected = false;
let issues = [];

if (baselineResults && baselineResults !== currentResults) {
  issues.push("❌ **Test output has changed! Possible regression.**");
  regressionDetected = true;
}

const timeDiff = ((currentDuration - baselineDuration) / baselineDuration) * 100;
if (timeDiff > TIME_THRESHOLD_PERCENT) {
  issues.push(`⚠️ **Execution time increased by ${timeDiff.toFixed(2)}%!**`);
  regressionDetected = true;
}

if (currentMemory - baselineMemory > MEMORY_THRESHOLD_MB) {
  issues.push(`⚠️ **Memory usage increased by ${(currentMemory - baselineMemory).toFixed(2)}MB!**`);
  regressionDetected = true;
}

const reportContent = regressionDetected
  ? `## ❌ Regression Detected!\n\n${issues.join("\n")}\n\n📊 **Baseline Data:**\n- ⏳ Previous Duration: ${baselineDuration} ms\n- 🧠 Previous Memory: ${baselineMemory.toFixed(2)} MB\n\n📊 **Current Data:**\n- ⏳ New Duration: ${currentDuration} ms\n- 🧠 New Memory: ${currentMemory.toFixed(2)} MB`
  : "✅ **No regressions detected.**";

console.log(reportContent);

// Export result to GitHub environment variables
console.log(`::set-env name=REGRESSION_REPORT::${reportContent}`);

if (regressionDetected) process.exit(1);
