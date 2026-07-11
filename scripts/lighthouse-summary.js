#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CATEGORY_IDS = [
  { id: 'performance', label: 'Performance' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'seo', label: 'SEO' }
];

const AUDIT_IDS = {
  lcp: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  inp: 'interaction-to-next-paint',
  fid: 'max-potential-fid',
  ttfb: 'server-response-time'
};

const VITAL_THRESHOLDS = {
  lcp: { good: 2500, ni: 4000 },
  cls: { good: 0.1, ni: 0.25 },
  inp: { good: 200, ni: 500 },
  fid: { good: 100, ni: 300 },
  ttfb: { good: 800, ni: 1800 }
};

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

function escapeTableCell(value) {
  return String(value)
    .replace(/\n/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|');
}

function parsePositiveIntEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function parseThresholdEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return fallback;
  }
  return parsed;
}

function formatCategoryScore(score) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return String(Math.round(score * 100));
}

function formatRawScore(score) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return score.toFixed(2);
}

function categoryStatus(score, threshold) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return score >= threshold ? 'pass' : 'fail';
}

function printSummary(markdown) {
  process.stdout.write(markdown);
}

function listJsonFilesRecursively(dirPath) {
  const results = [];

  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
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

function getReportCell(linkData) {
  if (!linkData || typeof linkData.url !== 'string' || !linkData.url.trim()) {
    return 'local only';
  }

  const safeUrl = linkData.url
    .trim()
    .replace(/\|/g, '%7C')
    .replace(/>/g, '%3E')
    .replace(/\s/g, '%20');

  return `<${safeUrl}>`;
}

function canonicalizeUrl(input) {
  const raw = String(input || '').trim();
  if (!raw) {
    return 'unknown';
  }

  try {
    const parsed = new URL(raw);
    parsed.hash = '';
    parsed.hostname = parsed.hostname.toLowerCase();

    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }

    return parsed.toString();
  } catch {
    return raw.replace(/#.*$/, '').replace(/\/+$/, '') || raw;
  }
}

function averageNumbers(values) {
  const valid = values.filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (!valid.length) {
    return null;
  }

  const total = valid.reduce((sum, value) => sum + value, 0);
  return total / valid.length;
}

function toReportRecord(report, fallbackUrl, reportKey, linksByReport) {
  const categories = report.categories || {};
  const audits = report.audits || {};
  const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl || fallbackUrl || 'unknown';

  return {
    key: reportKey,
    url,
    categories,
    audits,
    reportCell: getReportCell(linksByReport[reportKey])
  };
}

function consolidateReportsByUrl(reports) {
  const groups = new Map();

  for (const report of reports) {
    const groupKey = canonicalizeUrl(report.url);
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        key: groupKey,
        url: report.url,
        reports: [],
        reportCell: 'local only'
      });
    }

    const group = groups.get(groupKey);
    group.reports.push(report);

    if (group.reportCell === 'local only' && report.reportCell !== 'local only') {
      group.reportCell = report.reportCell;
    }
  }

  const consolidated = [];

  for (const group of groups.values()) {
    const categoryScores = {};
    for (const category of CATEGORY_IDS) {
      categoryScores[category.id] = averageNumbers(
        group.reports.map((report) => report.categories[category.id] && report.categories[category.id].score)
      );
    }

    const auditBuckets = new Map();
    for (const report of group.reports) {
      for (const [auditId, audit] of Object.entries(report.audits || {})) {
        if (!auditBuckets.has(auditId)) {
          auditBuckets.set(auditId, []);
        }
        auditBuckets.get(auditId).push(audit);
      }
    }

    const mergedAudits = {};
    for (const [auditId, bucket] of auditBuckets.entries()) {
      const title = bucket.find((audit) => typeof audit.title === 'string' && audit.title.trim())?.title || auditId;
      const displayValue = bucket.find((audit) => typeof audit.displayValue === 'string' && audit.displayValue.trim())?.displayValue || 'n/a';
      const scoreDisplayMode = bucket.find((audit) => typeof audit.scoreDisplayMode === 'string')?.scoreDisplayMode;
      const avgScore = averageNumbers(bucket.map((audit) => audit.score));
      const avgNumericValue = averageNumbers(bucket.map((audit) => audit.numericValue));
      const avgSavings = averageNumbers(
        bucket.map((audit) => audit.details && audit.details.type === 'opportunity' ? audit.details.overallSavingsMs : null)
      );

      const mergedAudit = {
        title,
        displayValue,
        score: avgScore,
        numericValue: avgNumericValue,
        scoreDisplayMode
      };

      if (avgSavings !== null) {
        mergedAudit.details = {
          type: 'opportunity',
          overallSavingsMs: avgSavings
        };
      }

      mergedAudits[auditId] = mergedAudit;
    }

    const categories = {};
    for (const category of CATEGORY_IDS) {
      categories[category.id] = {
        score: categoryScores[category.id]
      };
    }

    consolidated.push({
      key: group.key,
      url: group.url,
      categories,
      audits: mergedAudits,
      reportCell: group.reportCell,
      retryCount: group.reports.length
    });
  }

  consolidated.sort((a, b) => a.url.localeCompare(b.url));
  return consolidated;
}

function extractNumericAudit(audits, id) {
  const audit = audits[id];
  if (!audit || typeof audit.numericValue !== 'number') {
    return { value: null, display: 'n/a' };
  }
  return {
    value: audit.numericValue,
    display: typeof audit.displayValue === 'string' ? audit.displayValue : null
  };
}

function metricStatus(value, thresholds) {
  if (typeof value !== 'number') {
    return 'n/a';
  }
  if (value <= thresholds.good) {
    return 'good';
  }
  if (value <= thresholds.ni) {
    return 'needs-improvement';
  }
  return 'poor';
}

function formatMs(value) {
  if (typeof value !== 'number') {
    return 'n/a';
  }
  return `${Math.round(value)} ms`;
}

function formatCls(value) {
  if (typeof value !== 'number') {
    return 'n/a';
  }
  return value.toFixed(3);
}

function summarizeVitals(audits) {
  const lcp = extractNumericAudit(audits, AUDIT_IDS.lcp);
  const cls = extractNumericAudit(audits, AUDIT_IDS.cls);
  const inp = extractNumericAudit(audits, AUDIT_IDS.inp);
  const fid = extractNumericAudit(audits, AUDIT_IDS.fid);
  const ttfb = extractNumericAudit(audits, AUDIT_IDS.ttfb);

  const inpOrFid = typeof inp.value === 'number'
    ? { name: 'INP', ...inp, status: metricStatus(inp.value, VITAL_THRESHOLDS.inp) }
    : { name: 'FID', ...fid, status: metricStatus(fid.value, VITAL_THRESHOLDS.fid) };

  return {
    lcp: {
      text: lcp.display || formatMs(lcp.value),
      status: metricStatus(lcp.value, VITAL_THRESHOLDS.lcp)
    },
    cls: {
      text: cls.display || formatCls(cls.value),
      status: metricStatus(cls.value, VITAL_THRESHOLDS.cls)
    },
    inpOrFid: {
      name: inpOrFid.name,
      text: inpOrFid.display || formatMs(inpOrFid.value),
      status: inpOrFid.status
    },
    ttfb: {
      text: ttfb.display || formatMs(ttfb.value),
      status: metricStatus(ttfb.value, VITAL_THRESHOLDS.ttfb)
    }
  };
}

function collectOpportunities(audits, maxItems) {
  const opportunities = [];
  for (const [auditId, audit] of Object.entries(audits)) {
    if (!audit || !audit.details || audit.details.type !== 'opportunity') {
      continue;
    }

    const savingsMs = typeof audit.details.overallSavingsMs === 'number'
      ? audit.details.overallSavingsMs
      : (typeof audit.numericValue === 'number' ? audit.numericValue : null);

    opportunities.push({
      id: auditId,
      title: audit.title || auditId,
      score: typeof audit.score === 'number' ? audit.score : null,
      savingsMs,
      displayValue: audit.displayValue || 'n/a'
    });
  }

  opportunities.sort((a, b) => (b.savingsMs || -1) - (a.savingsMs || -1));
  return opportunities.slice(0, maxItems);
}

function collectFailedAudits(audits, maxItems) {
  const failed = [];
  for (const [auditId, audit] of Object.entries(audits)) {
    if (!audit) {
      continue;
    }

    if (
      audit.scoreDisplayMode === 'notApplicable' ||
      audit.scoreDisplayMode === 'informative' ||
      audit.scoreDisplayMode === 'manual'
    ) {
      continue;
    }

    if (typeof audit.score !== 'number' || audit.score >= 1) {
      continue;
    }

    failed.push({
      id: auditId,
      title: audit.title || auditId,
      score: audit.score,
      displayValue: audit.displayValue || 'n/a'
    });
  }

  failed.sort((a, b) => a.score - b.score);
  return failed.slice(0, maxItems);
}

function collectReportsFromManifest(manifest, lhciDir, linksByReport) {
  const reports = [];

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

    const reportKey = path.basename(item.jsonPath);
    reports.push(toReportRecord(report, item.url, reportKey, linksByReport));
  }

  return reports;
}

function collectReportsFromScan(lhciDir, linksByReport) {
  const reports = [];
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

    reports.push(toReportRecord(report, null, baseName, linksByReport));
  }

  return reports;
}

function renderOverviewSection(reports) {
  let markdown = '### Overview\n\n';
  markdown += '| URL | Retries | Performance | Accessibility | Best Practices | SEO | Report |\n';
  markdown += '| --- | ---: | ---: | ---: | ---: | ---: | --- |\n';

  for (const report of reports) {
    markdown += `| ${escapeTableCell(report.url)} | ${report.retryCount || 1} | ${formatCategoryScore(report.categories.performance && report.categories.performance.score)} | ${formatCategoryScore(report.categories.accessibility && report.categories.accessibility.score)} | ${formatCategoryScore(report.categories['best-practices'] && report.categories['best-practices'].score)} | ${formatCategoryScore(report.categories.seo && report.categories.seo.score)} | ${report.reportCell} |\n`;
  }

  markdown += '\n';
  return markdown;
}

function renderCategoryBreakdownSection(reports, categoryPassThreshold) {
  let markdown = `### Category Breakdown (pass threshold: ${Math.round(categoryPassThreshold * 100)})\n\n`;

  for (const report of reports) {
    markdown += `#### ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1})\n\n`;
    markdown += '| Category | Score | Raw | Status |\n';
    markdown += '| --- | ---: | ---: | --- |\n';

    for (const category of CATEGORY_IDS) {
      const score = report.categories[category.id] && report.categories[category.id].score;
      markdown += `| ${category.label} | ${formatCategoryScore(score)} | ${formatRawScore(score)} | ${categoryStatus(score, categoryPassThreshold)} |\n`;
    }
    markdown += '\n';
  }

  return markdown;
}

function renderVitalsSection(reports) {
  let markdown = '### Core Web Vitals\n\n';
  markdown += '| URL | Retries | LCP | CLS | INP/FID | TTFB |\n';
  markdown += '| --- | ---: | --- | --- | --- | --- |\n';

  for (const report of reports) {
    const vitals = summarizeVitals(report.audits);
    markdown += `| ${escapeTableCell(report.url)} | ${report.retryCount || 1} | ${escapeTableCell(`${vitals.lcp.text} (${vitals.lcp.status})`)} | ${escapeTableCell(`${vitals.cls.text} (${vitals.cls.status})`)} | ${escapeTableCell(`${vitals.inpOrFid.name}: ${vitals.inpOrFid.text} (${vitals.inpOrFid.status})`)} | ${escapeTableCell(`${vitals.ttfb.text} (${vitals.ttfb.status})`)} |\n`;
  }

  markdown += '\n';
  return markdown;
}

function renderOpportunitiesSection(reports, maxItems) {
  let markdown = `### Top Opportunities (top ${maxItems} per URL)\n\n`;

  for (const report of reports) {
    const opportunities = collectOpportunities(report.audits, maxItems);

    markdown += `#### ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1})\n\n`;
    if (!opportunities.length) {
      markdown += 'No opportunity audits were found.\n\n';
      continue;
    }

    markdown += '| Audit | Score | Savings | Display |\n';
    markdown += '| --- | ---: | ---: | --- |\n';
    for (const opp of opportunities) {
      const savings = typeof opp.savingsMs === 'number' ? `${Math.round(opp.savingsMs)} ms` : 'n/a';
      const score = typeof opp.score === 'number' ? opp.score.toFixed(2) : 'n/a';
      markdown += `| ${escapeTableCell(opp.title)} | ${score} | ${savings} | ${escapeTableCell(opp.displayValue)} |\n`;
    }
    markdown += '\n';
  }

  return markdown;
}

function renderFailedAuditsSection(reports, maxItems) {
  let markdown = `### Top Failed Audits (top ${maxItems} per URL)\n\n`;

  for (const report of reports) {
    const failed = collectFailedAudits(report.audits, maxItems);

    markdown += `#### ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1})\n\n`;
    if (!failed.length) {
      markdown += 'No failed audits were found.\n\n';
      continue;
    }

    markdown += '| Audit | Score | Display |\n';
    markdown += '| --- | ---: | --- |\n';
    for (const audit of failed) {
      markdown += `| ${escapeTableCell(audit.title)} | ${audit.score.toFixed(2)} | ${escapeTableCell(audit.displayValue)} |\n`;
    }
    markdown += '\n';
  }

  return markdown;
}

function run() {
  const lhciDir = path.join(process.cwd(), '.lighthouseci');
  const maxOpportunities = parsePositiveIntEnv('LIGHTHOUSE_SUMMARY_MAX_OPPORTUNITIES', 3);
  const maxFailedAudits = parsePositiveIntEnv('LIGHTHOUSE_SUMMARY_MAX_FAILED_AUDITS', 5);
  const categoryPassThreshold = parseThresholdEnv('LIGHTHOUSE_SUMMARY_CATEGORY_PASS_THRESHOLD', 0.9);

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

  let reports = [];
  let usedScanFallback = false;

  if (manifest && Array.isArray(manifest)) {
    reports = collectReportsFromManifest(manifest, lhciDir, linksByReport);
  }

  if (!reports.length) {
    reports = collectReportsFromScan(lhciDir, linksByReport);
    usedScanFallback = true;
  }

  let markdown = '## Lighthouse\n\n';

  if (!usedManifest) {
    markdown += '_`manifest.json` not found; discovered Lighthouse reports by scanning `.lighthouseci`._\n\n';
  } else if (usedScanFallback) {
    markdown += '_`manifest.json` was present but did not yield usable reports; scanned `.lighthouseci` for Lighthouse JSON files._\n\n';
  }

  if (!reports.length) {
    markdown += 'No Lighthouse reports were parsed from `.lighthouseci`.\n';
    printSummary(markdown);
    return;
  }

  const consolidatedReports = consolidateReportsByUrl(reports);

  markdown += `Parsed reports: ${reports.length}. Consolidated URLs: ${consolidatedReports.length}.\n\n`;
  markdown += renderOverviewSection(consolidatedReports);
  markdown += renderCategoryBreakdownSection(consolidatedReports, categoryPassThreshold);
  markdown += renderVitalsSection(consolidatedReports);
  markdown += renderOpportunitiesSection(consolidatedReports, maxOpportunities);
  markdown += renderFailedAuditsSection(consolidatedReports, maxFailedAudits);

  printSummary(markdown);
}

try {
  run();
} catch (error) {
  printSummary(`## Lighthouse\n\nUnable to generate Lighthouse summary: ${error.message}\n`);
}
