const fs = require("fs");
const path = require("path");

// Read coverage data
const coveragePath = path.join(__dirname, "../coverage/coverage-final.json");
const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));

// Prepare CSV data
const csvRows = [
  [
    "File",
    "Statements %",
    "Branches %",
    "Functions %",
    "Lines %",
    "Uncovered Lines",
  ],
];

// Process each file
Object.entries(coverage).forEach(([filePath, data]) => {
  const relativePath = filePath.replace(process.cwd() + "/", "");

  const stmts = data.s || {};
  const branches = data.b || {};
  const functions = data.f || {};

  // Calculate coverage percentages
  const stmtCovered = Object.values(stmts).filter((v) => v > 0).length;
  const stmtTotal = Object.values(stmts).length;
  const stmtPercent = stmtTotal
    ? ((stmtCovered / stmtTotal) * 100).toFixed(2)
    : 0;

  const branchCovered = Object.values(branches)
    .flat()
    .filter((v) => v > 0).length;
  const branchTotal = Object.values(branches).flat().length;
  const branchPercent = branchTotal
    ? ((branchCovered / branchTotal) * 100).toFixed(2)
    : 0;

  const funcCovered = Object.values(functions).filter((v) => v > 0).length;
  const funcTotal = Object.values(functions).length;
  const funcPercent = funcTotal
    ? ((funcCovered / funcTotal) * 100).toFixed(2)
    : 0;

  const lineCovered = Object.values(stmts).filter((v) => v > 0).length;
  const lineTotal = Object.values(stmts).length;
  const linePercent = lineTotal
    ? ((lineCovered / lineTotal) * 100).toFixed(2)
    : 0;

  // Find uncovered lines
  const uncoveredLines = Object.entries(stmts)
    .filter(([_, count]) => count === 0)
    .map(([lineNum]) => lineNum)
    .join(";");

  csvRows.push([
    relativePath,
    stmtPercent + "%",
    branchPercent + "%",
    funcPercent + "%",
    linePercent + "%",
    uncoveredLines || "All covered",
  ]);
});

// Convert to CSV
const csv = csvRows
  .map((row) => row.map((cell) => `"${cell}"`).join(","))
  .join("\n");

// Write CSV file
const outputPath = path.join(__dirname, "../coverage/coverage-report.csv");
fs.writeFileSync(outputPath, csv, "utf8");

console.log("✅ Coverage report exported to:", outputPath);
console.log("📊 Total files:", csvRows.length - 1);
