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

function run() {
  const lhciDir = path.join(process.cwd(), '.lighthouseci');

  if (!fileExists(lhciDir)) {
    printSummary('## Lighthouse\n\nNo Lighthouse results were found in `.lighthouseci`.\n');
    return;
  }

  const manifestPath = path.join(lhciDir, 'manifest.json');
  if (!fileExists(manifestPath)) {
    printSummary('## Lighthouse\n\nLighthouse ran, but `.lighthouseci/manifest.json` was not found.\n');
    return;
  }

  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch (error) {
    printSummary(`## Lighthouse\n\nFailed to parse \.lighthouseci/manifest.json: ${error.message}\n`);
    return;
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

    const categories = report.categories || {};
    const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || item.url || 'unknown';

    const reportKey = path.basename(item.jsonPath);
    const reportLinkData = linksByReport[reportKey] || {};
    const reportCell = reportLinkData.url ? `[report](${reportLinkData.url})` : 'local only';

    rows.push(
      `| ${escapePipes(url)} | ${scoreFromCategories(categories, 'performance')} | ${scoreFromCategories(categories, 'accessibility')} | ${scoreFromCategories(categories, 'best-practices')} | ${scoreFromCategories(categories, 'seo')} | ${reportCell} |`
    );
  }

  let markdown = '## Lighthouse\n\n';

  if (!rows.length) {
    markdown += 'No Lighthouse reports were parsed from `.lighthouseci/manifest.json`.\n';
    printSummary(markdown);
    return;
  }

  markdown += '| URL | Performance | Accessibility | Best Practices | SEO | Report |\n';
  markdown += '| --- | ---: | ---: | ---: | ---: | --- |\n';
  markdown += `${rows.join('\n')}\n`;

  printSummary(markdown);
}

run();
