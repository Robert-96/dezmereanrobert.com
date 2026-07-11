#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function escapePipes(value) {
  return String(value).replace(/\|/g, '\\|');
}

function scoreFromCategories(categories, id) {
  const category = categories && categories[id];
  if (!category || typeof category.score !== 'number') {
    return 'n/a';
  }
  return String(Math.round(category.score * 100));
}

function printSummary(markdown) {
  process.stdout.write(markdown);
}

function listJsonFilesRecursively(dirPath) {
  const results = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listJsonFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results;
}

function isLighthouseReport(report) {
  return !!(
    report &&
    typeof report === 'object' &&
    report.categories &&
    report.categories.performance &&
    report.categories.accessibility &&
    report.categories['best-practices'] &&
    report.categories.seo
  );
}

function run() {
  const lhciDir = path.join(process.cwd(), '.lighthouseci');

  if (!fileExists(lhciDir)) {
    printSummary('## Lighthouse\n\nNo Lighthouse results were found in `.lighthouseci`.\n');
    return;
  }

  const manifestPath = path.join(lhciDir, 'manifest.json');
  let manifest = null;
  let usedManifest = false;

  if (fileExists(manifestPath)) {
    try {
      manifest = readJson(manifestPath);
      usedManifest = true;
    } catch (error) {
      printSummary(`## Lighthouse\n\nFailed to parse \.lighthouseci/manifest.json: ${error.message}\n`);
      return;
    }
  }

  const linksPath = path.join(lhciDir, 'links.json');
  let linksByReport = {};

  if (fileExists(linksPath)) {
    try {
      const links = readJson(linksPath);
      linksByReport = Object.fromEntries(
        links
          .filter((entry) => entry && entry.report)
          .map((entry) => [path.basename(entry.report), entry])
      );
    } catch {
      linksByReport = {};
    }
  }

  const rows = [];

  if (manifest && Array.isArray(manifest)) {
    for (const item of manifest) {
      if (!item || !item.jsonPath) {
        continue;
      }

      const reportPath = path.join(lhciDir, item.jsonPath);
      if (!fileExists(reportPath)) {
        continue;
      }

      let report;
      try {
        report = readJson(reportPath);
      } catch {
        continue;
      }

      if (!isLighthouseReport(report)) {
        continue;
      }

      const categories = report.categories || {};
      const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || item.url || 'unknown';

      const reportKey = path.basename(item.jsonPath);
      const reportLinkData = linksByReport[reportKey] || {};
      const reportCell = reportLinkData.url ? `[report](${reportLinkData.url})` : 'local only';

      rows.push(
        `| ${escapePipes(url)} | ${scoreFromCategories(categories, 'performance')} | ${scoreFromCategories(categories, 'accessibility')} | ${scoreFromCategories(categories, 'best-practices')} | ${scoreFromCategories(categories, 'seo')} | ${reportCell} |`
      );
    }
  } else {
    const jsonFiles = listJsonFilesRecursively(lhciDir);
    for (const reportPath of jsonFiles) {
      const baseName = path.basename(reportPath);
      if (baseName === 'links.json' || baseName === 'manifest.json') {
        continue;
      }

      let report;
      try {
        report = readJson(reportPath);
      } catch {
        continue;
      }

      if (!isLighthouseReport(report)) {
        continue;
      }

      const categories = report.categories || {};
      const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || 'unknown';
      const reportLinkData = linksByReport[baseName] || {};
      const reportCell = reportLinkData.url ? `[report](${reportLinkData.url})` : 'local only';

      rows.push(
        `| ${escapePipes(url)} | ${scoreFromCategories(categories, 'performance')} | ${scoreFromCategories(categories, 'accessibility')} | ${scoreFromCategories(categories, 'best-practices')} | ${scoreFromCategories(categories, 'seo')} | ${reportCell} |`
      );
    }
  }

  let markdown = '## Lighthouse\n\n';

  if (!usedManifest) {
    markdown += '_`manifest.json` not found; discovered Lighthouse reports by scanning `.lighthouseci`._\n\n';
  }

  if (!rows.length) {
    markdown += 'No Lighthouse reports were parsed from `.lighthouseci`.\n';
    printSummary(markdown);
    return;
  }

  markdown += '| URL | Performance | Accessibility | Best Practices | SEO | Report |\n';
  markdown += '| --- | ---: | ---: | ---: | ---: | --- |\n';
  markdown += `${rows.join('\n')}\n`;

  printSummary(markdown);
}

run();
