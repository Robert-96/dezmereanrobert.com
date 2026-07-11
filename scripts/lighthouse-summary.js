#!/usr/bin/env node

/**
 * @file Lighthouse CI summary generator.
 *
 * Reads Lighthouse reports from `.lighthouseci`, consolidates retries by URL,
 * and prints a markdown summary intended for GitHub Actions step summaries.
 */

const fs = require('fs');
const path = require('path');

/**
 * @typedef {Object} CategoryDefinition
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} ReportRecord
 * @property {string} key
 * @property {string} url
 * @property {Object<string, {score: (number|null|undefined)}>} categories
 * @property {Object<string, Object>} audits
 * @property {string} reportCell
 * @property {number} [retryCount]
 */

/**
 * @typedef {Object} RuntimeConfig
 * @property {string} lhciDir
 * @property {number} maxOpportunities
 * @property {number} maxFailedAudits
 * @property {number} categoryPassThreshold
 * @property {CategoryDefinition[]} categoryDefinitions
 */

/**
 * @typedef {Object} Deps
 * @property {{ existsSync: Function, readFileSync: Function, readdirSync: Function }} fsApi
 * @property {{ join: Function, basename: Function }} pathApi
 * @property {Object<string, string|undefined>} env
 * @property {{ write: Function }} stdout
 * @property {() => string} cwd
 * @property {typeof URL} URLCtor
 */

const DEFAULT_CATEGORY_DEFINITIONS = [
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

const DEFAULT_DEPS = {
  fsApi: fs,
  pathApi: path,
  env: process.env,
  stdout: process.stdout,
  cwd: () => process.cwd(),
  URLCtor: URL
};

/**
 * Safely checks whether a file path exists.
 *
 * @param {string} filePath
 * @param {{ existsSync: Function }} fsApi
 * @returns {boolean}
 */
function fileExists(filePath, fsApi) {
  try {
    return fsApi.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Reads and parses a JSON file.
 *
 * @param {string} filePath
 * @param {{ readFileSync: Function }} fsApi
 * @returns {any}
 */
function readJson(filePath, fsApi) {
  const content = fsApi.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Escapes markdown table control characters in a cell value.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeTableCell(value) {
  return String(value)
    .replace(/\n/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|');
}

/**
 * Reads a positive integer from environment-like object with fallback.
 *
 * @param {Object<string, string|undefined>} env
 * @param {string} name
 * @param {number} fallback
 * @returns {number}
 */
function parsePositiveIntEnv(env, name, fallback) {
  const raw = env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

/**
 * Reads a decimal threshold in [0, 1] from environment-like object with fallback.
 *
 * @param {Object<string, string|undefined>} env
 * @param {string} name
 * @param {number} fallback
 * @returns {number}
 */
function parseThresholdEnv(env, name, fallback) {
  const raw = env[name];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return fallback;
  }
  return parsed;
}

/**
 * Formats Lighthouse category score to a percentage integer string.
 *
 * @param {number|null|undefined} score
 * @returns {string}
 */
function formatCategoryScore(score) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return String(Math.round(score * 100));
}

/**
 * Formats a raw decimal score to two fraction digits.
 *
 * @param {number|null|undefined} score
 * @returns {string}
 */
function formatRawScore(score) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return score.toFixed(2);
}

/**
 * Evaluates category pass/fail against configured threshold.
 *
 * @param {number|null|undefined} score
 * @param {number} threshold
 * @returns {'pass'|'fail'|'n/a'}
 */
function categoryStatus(score, threshold) {
  if (typeof score !== 'number') {
    return 'n/a';
  }
  return score >= threshold ? 'pass' : 'fail';
}

/**
 * Writes summary markdown to the supplied writer.
 *
 * @param {string} markdown
 * @param {{ write: Function }} [writer=process.stdout]
 * @returns {void}
 */
function printSummary(markdown, writer = process.stdout) {
  writer.write(markdown);
}

/**
 * Recursively collects JSON file paths from a directory.
 *
 * @param {string} dirPath
 * @param {{ readdirSync: Function }} fsApi
 * @param {{ join: Function }} pathApi
 * @returns {string[]}
 */
function listJsonFilesRecursively(dirPath, fsApi, pathApi) {
  const results = [];

  let entries;
  try {
    entries = fsApi.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = pathApi.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listJsonFilesRecursively(fullPath, fsApi, pathApi));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Checks whether a parsed JSON object looks like a Lighthouse report.
 *
 * @param {any} report
 * @returns {boolean}
 */
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

/**
 * Formats report-link data into a markdown-safe cell value.
 *
 * @param {{url?: string}|undefined} linkData
 * @returns {string}
 */
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

/**
 * Canonicalizes a URL string for grouping retry reports.
 *
 * @param {unknown} input
 * @param {typeof URL} URLCtor
 * @returns {string}
 */
function canonicalizeUrl(input, URLCtor) {
  const raw = String(input || '').trim();
  if (!raw) {
    return 'unknown';
  }

  try {
    const parsed = new URLCtor(raw);
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

/**
 * Computes average for finite numeric values.
 *
 * @param {Array<number|null|undefined>} values
 * @returns {number|null}
 */
function averageNumbers(values) {
  const valid = values.filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (!valid.length) {
    return null;
  }

  const total = valid.reduce((sum, value) => sum + value, 0);
  return total / valid.length;
}

/**
 * Converts an identifier to title case label.
 *
 * @param {string} id
 * @returns {string}
 */
function toTitleCaseLabel(id) {
  return id
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Resolves summary category definitions from environment.
 *
 * Supports `LIGHTHOUSE_SUMMARY_CATEGORIES` as:
 * - `id1,id2`
 * - `id1:Label 1,id2:Label 2`
 *
 * @param {Object<string, string|undefined>} env
 * @returns {CategoryDefinition[]}
 */
function getCategoryDefinitions(env) {
  const raw = env.LIGHTHOUSE_SUMMARY_CATEGORIES;
  if (!raw || !raw.trim()) {
    return DEFAULT_CATEGORY_DEFINITIONS;
  }

  const parsed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const split = item.split(':');
      const id = split[0].trim();
      const label = split[1] ? split.slice(1).join(':').trim() : toTitleCaseLabel(id);
      return { id, label };
    })
    .filter((category) => category.id);

  return parsed.length ? parsed : DEFAULT_CATEGORY_DEFINITIONS;
}

/**
 * Loads runtime configuration from dependencies and environment.
 *
 * @param {Deps} deps
 * @returns {RuntimeConfig}
 */
function loadRuntimeConfig(deps) {
  const { env, pathApi, cwd } = deps;

  return {
    lhciDir: pathApi.join(cwd(), '.lighthouseci'),
    maxOpportunities: parsePositiveIntEnv(env, 'LIGHTHOUSE_SUMMARY_MAX_OPPORTUNITIES', 3),
    maxFailedAudits: parsePositiveIntEnv(env, 'LIGHTHOUSE_SUMMARY_MAX_FAILED_AUDITS', 5),
    categoryPassThreshold: parseThresholdEnv(env, 'LIGHTHOUSE_SUMMARY_CATEGORY_PASS_THRESHOLD', 0.9),
    categoryDefinitions: getCategoryDefinitions(env)
  };
}

/**
 * Builds an internal report record from raw Lighthouse report payload.
 *
 * @param {any} report
 * @param {string|null|undefined} fallbackUrl
 * @param {string} reportKey
 * @param {Object<string, {url?: string}>} linksByReport
 * @returns {ReportRecord}
 */
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

/**
 * Consolidates retry reports by canonical URL and averages metrics.
 *
 * @param {ReportRecord[]} reports
 * @param {CategoryDefinition[]} categoryDefinitions
 * @param {typeof URL} URLCtor
 * @returns {ReportRecord[]}
 */
function consolidateReportsByUrl(reports, categoryDefinitions, URLCtor) {
  const groups = new Map();

  for (const report of reports) {
    const groupKey = canonicalizeUrl(report.url, URLCtor);
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
    for (const category of categoryDefinitions) {
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
    for (const category of categoryDefinitions) {
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

/**
 * Extracts numeric audit value and display string from audits collection.
 *
 * @param {Object<string, any>} audits
 * @param {string} id
 * @returns {{value: number|null, display: string|null}}
 */
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

/**
 * Classifies a metric value by threshold set.
 *
 * @param {number|null|undefined} value
 * @param {{good: number, ni: number}} thresholds
 * @returns {'good'|'needs-improvement'|'poor'|'n/a'}
 */
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

/**
 * Formats millisecond-based metric values.
 *
 * @param {number|null|undefined} value
 * @returns {string}
 */
function formatMs(value) {
  if (typeof value !== 'number') {
    return 'n/a';
  }
  return `${Math.round(value)} ms`;
}

/**
 * Formats CLS metric values.
 *
 * @param {number|null|undefined} value
 * @returns {string}
 */
function formatCls(value) {
  if (typeof value !== 'number') {
    return 'n/a';
  }
  return value.toFixed(3);
}

/**
 * Produces formatted Core Web Vitals summary object for one report.
 *
 * @param {Object<string, any>} audits
 * @returns {{
 *   lcp: {text: string, status: string},
 *   cls: {text: string, status: string},
 *   inpOrFid: {name: string, text: string, status: string},
 *   ttfb: {text: string, status: string}
 * }}
 */
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

/**
 * Collects and ranks Lighthouse opportunity audits.
 *
 * @param {Object<string, any>} audits
 * @param {number} maxItems
 * @returns {Array<{id: string, title: string, score: number|null, savingsMs: number|null, displayValue: string}>}
 */
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

/**
 * Collects and ranks non-passing audits.
 *
 * @param {Object<string, any>} audits
 * @param {number} maxItems
 * @returns {Array<{id: string, title: string, score: number, displayValue: string}>}
 */
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

/**
 * Loads `.lighthouseci/manifest.json` if available.
 *
 * @param {string} lhciDir
 * @param {Deps} deps
 * @returns {{manifest: any, usedManifest: boolean, error: Error|null}}
 */
function loadManifest(lhciDir, deps) {
  const { fsApi, pathApi } = deps;
  const manifestPath = pathApi.join(lhciDir, 'manifest.json');
  let usedManifest = false;

  if (!fileExists(manifestPath, fsApi)) {
    return { manifest: null, usedManifest, error: null };
  }

  try {
    const manifest = readJson(manifestPath, fsApi);
    usedManifest = true;
    return { manifest, usedManifest, error: null };
  } catch (error) {
    return { manifest: null, usedManifest, error };
  }
}

/**
 * Loads Lighthouse links mapping keyed by report basename.
 *
 * @param {string} lhciDir
 * @param {Deps} deps
 * @returns {Object<string, {url?: string}>}
 */
function loadLinksByReport(lhciDir, deps) {
  const { fsApi, pathApi } = deps;
  const linksPath = pathApi.join(lhciDir, 'links.json');
  let linksByReport = {};

  if (!fileExists(linksPath, fsApi)) {
    return linksByReport;
  }

  try {
    const links = readJson(linksPath, fsApi);
    linksByReport = Object.fromEntries(
      links
        .filter((entry) => entry && entry.report)
        .map((entry) => [pathApi.basename(entry.report), entry])
    );
  } catch {
    linksByReport = {};
  }

  return linksByReport;
}

/**
 * Collects Lighthouse reports from manifest entries.
 *
 * @param {any[]} manifest
 * @param {string} lhciDir
 * @param {Object<string, {url?: string}>} linksByReport
 * @param {Deps} deps
 * @returns {ReportRecord[]}
 */
function collectReportsFromManifest(manifest, lhciDir, linksByReport, deps) {
  const { fsApi, pathApi } = deps;
  const reports = [];

  for (const item of manifest) {
    if (!item || !item.jsonPath) {
      continue;
    }

    const reportPath = pathApi.join(lhciDir, item.jsonPath);
    if (!fileExists(reportPath, fsApi)) {
      continue;
    }

    let report;
    try {
      report = readJson(reportPath, fsApi);
    } catch {
      continue;
    }

    if (!isLighthouseReport(report)) {
      continue;
    }

    const reportKey = pathApi.basename(item.jsonPath);
    reports.push(toReportRecord(report, item.url, reportKey, linksByReport));
  }

  return reports;
}

/**
 * Collects Lighthouse reports by scanning `.lighthouseci` JSON files.
 *
 * @param {string} lhciDir
 * @param {Object<string, {url?: string}>} linksByReport
 * @param {Deps} deps
 * @returns {ReportRecord[]}
 */
function collectReportsFromScan(lhciDir, linksByReport, deps) {
  const { fsApi, pathApi } = deps;
  const reports = [];
  const jsonFiles = listJsonFilesRecursively(lhciDir, fsApi, pathApi);

  for (const reportPath of jsonFiles) {
    const baseName = pathApi.basename(reportPath);
    if (baseName === 'links.json' || baseName === 'manifest.json') {
      continue;
    }

    let report;
    try {
      report = readJson(reportPath, fsApi);
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

/**
 * Loads reports using manifest-first strategy with scan fallback.
 *
 * @param {any[]|null} manifest
 * @param {string} lhciDir
 * @param {Object<string, {url?: string}>} linksByReport
 * @param {Deps} deps
 * @returns {{reports: ReportRecord[], usedScanFallback: boolean}}
 */
function loadReports(manifest, lhciDir, linksByReport, deps) {
  let reports = [];
  let usedScanFallback = false;

  if (manifest && Array.isArray(manifest)) {
    reports = collectReportsFromManifest(manifest, lhciDir, linksByReport, deps);
  }

  if (!reports.length) {
    reports = collectReportsFromScan(lhciDir, linksByReport, deps);
    usedScanFallback = true;
  }

  return { reports, usedScanFallback };
}

/**
 * Renders overview markdown section.
 *
 * @param {ReportRecord[]} reports
 * @param {CategoryDefinition[]} categoryDefinitions
 * @returns {string}
 */
function renderOverviewSection(reports, categoryDefinitions) {
  let markdown = '### Overview\n\n';
  const headers = ['URL', 'Retries', ...categoryDefinitions.map((category) => category.label), 'Report'];
  markdown += `| ${headers.join(' | ')} |\n`;

  const separators = ['---', '---:', ...categoryDefinitions.map(() => '---:'), '---'];
  markdown += `| ${separators.join(' | ')} |\n`;

  for (const report of reports) {
    const values = [
      escapeTableCell(report.url),
      String(report.retryCount || 1),
      ...categoryDefinitions.map((category) => formatCategoryScore(report.categories[category.id] && report.categories[category.id].score)),
      report.reportCell
    ];
    markdown += `| ${values.join(' | ')} |\n`;
  }

  markdown += '\n';
  return markdown;
}

/**
 * Wraps markdown content in collapsible details block.
 *
 * @param {string} summary
 * @param {string} content
 * @returns {string}
 */
function wrapInDetails(summary, content) {
  let markdown = '<details>\n\n';
  markdown += `<summary>${summary}</summary>\n\n`;
  markdown += `${content.trim()}\n\n`;
  markdown += '</details>\n\n';
  return markdown;
}

/**
 * Renders per-category score breakdown section.
 *
 * @param {ReportRecord[]} reports
 * @param {number} categoryPassThreshold
 * @param {CategoryDefinition[]} categoryDefinitions
 * @returns {string}
 */
function renderCategoryBreakdownSection(reports, categoryPassThreshold, categoryDefinitions) {
  let section = '| URL | Category | Score | Raw | Status |\n';
  section += '| --- | --- | ---: | ---: | --- |\n';

  for (const report of reports) {
    for (const category of categoryDefinitions) {
      const score = report.categories[category.id] && report.categories[category.id].score;
      section += `| ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1}) | ${category.label} | ${formatCategoryScore(score)} | ${formatRawScore(score)} | ${categoryStatus(score, categoryPassThreshold)} |\n`;
    }
  }

  return wrapInDetails(
    `Category Breakdown (pass threshold: ${Math.round(categoryPassThreshold * 100)})`,
    section
  );
}

/**
 * Renders Core Web Vitals section.
 *
 * @param {ReportRecord[]} reports
 * @returns {string}
 */
function renderVitalsSection(reports) {
  let section = '| URL | Retries | LCP | CLS | INP/FID | TTFB |\n';
  section += '| --- | ---: | --- | --- | --- | --- |\n';

  for (const report of reports) {
    const vitals = summarizeVitals(report.audits);
    section += `| ${escapeTableCell(report.url)} | ${report.retryCount || 1} | ${escapeTableCell(`${vitals.lcp.text} (${vitals.lcp.status})`)} | ${escapeTableCell(`${vitals.cls.text} (${vitals.cls.status})`)} | ${escapeTableCell(`${vitals.inpOrFid.name}: ${vitals.inpOrFid.text} (${vitals.inpOrFid.status})`)} | ${escapeTableCell(`${vitals.ttfb.text} (${vitals.ttfb.status})`)} |\n`;
  }

  return wrapInDetails('Core Web Vitals', section);
}

/**
 * Renders ranked opportunities section.
 *
 * @param {ReportRecord[]} reports
 * @param {number} maxItems
 * @returns {string}
 */
function renderOpportunitiesSection(reports, maxItems) {
  let section = '';

  for (const report of reports) {
    const opportunities = collectOpportunities(report.audits, maxItems);

    section += `#### ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1})\n\n`;
    if (!opportunities.length) {
      section += 'No opportunity audits were found.\n\n';
      continue;
    }

    section += '| Audit | Score | Savings | Display |\n';
    section += '| --- | ---: | ---: | --- |\n';
    for (const opp of opportunities) {
      const savings = typeof opp.savingsMs === 'number' ? `${Math.round(opp.savingsMs)} ms` : 'n/a';
      const score = typeof opp.score === 'number' ? opp.score.toFixed(2) : 'n/a';
      section += `| ${escapeTableCell(opp.title)} | ${score} | ${savings} | ${escapeTableCell(opp.displayValue)} |\n`;
    }
    section += '\n';
  }

  return wrapInDetails(`Top Opportunities (top ${maxItems} per URL)`, section || 'No opportunity audits were found.');
}

/**
 * Renders ranked failed-audits section.
 *
 * @param {ReportRecord[]} reports
 * @param {number} maxItems
 * @returns {string}
 */
function renderFailedAuditsSection(reports, maxItems) {
  let section = '';

  for (const report of reports) {
    const failed = collectFailedAudits(report.audits, maxItems);

    section += `#### ${escapeTableCell(report.url)} (retries: ${report.retryCount || 1})\n\n`;
    if (!failed.length) {
      section += 'No failed audits were found.\n\n';
      continue;
    }

    section += '| Audit | Score | Display |\n';
    section += '| --- | ---: | --- |\n';
    for (const audit of failed) {
      section += `| ${escapeTableCell(audit.title)} | ${audit.score.toFixed(2)} | ${escapeTableCell(audit.displayValue)} |\n`;
    }
    section += '\n';
  }

  return wrapInDetails(`Top Failed Audits (top ${maxItems} per URL)`, section || 'No failed audits were found.');
}

const SECTION_RENDERERS = [
  (context) => renderOverviewSection(context.reports, context.categoryDefinitions),
  (context) => renderCategoryBreakdownSection(context.reports, context.categoryPassThreshold, context.categoryDefinitions),
  (context) => renderVitalsSection(context.reports),
  (context) => renderOpportunitiesSection(context.reports, context.maxOpportunities),
  (context) => renderFailedAuditsSection(context.reports, context.maxFailedAudits)
];

/**
 * Builds top-of-summary metadata section.
 *
 * @param {boolean} usedManifest
 * @param {boolean} usedScanFallback
 * @param {number} reportCount
 * @param {number} consolidatedCount
 * @returns {string}
 */
function buildIntroMarkdown(usedManifest, usedScanFallback, reportCount, consolidatedCount) {
  let markdown = '## Lighthouse\n\n';

  if (!usedManifest) {
    markdown += '_`manifest.json` not found; discovered Lighthouse reports by scanning `.lighthouseci`._\n\n';
  } else if (usedScanFallback) {
    markdown += '_`manifest.json` was present but did not yield usable reports; scanned `.lighthouseci` for Lighthouse JSON files._\n\n';
  }

  markdown += `Parsed reports: ${reportCount}. Consolidated URLs: ${consolidatedCount}.\n\n`;
  return markdown;
}

/**
 * Builds full summary markdown from rendering context.
 *
 * @param {{
 *   reports: ReportRecord[],
 *   usedManifest: boolean,
 *   usedScanFallback: boolean,
 *   reportCount: number,
 *   maxOpportunities: number,
 *   maxFailedAudits: number,
 *   categoryPassThreshold: number,
 *   categoryDefinitions: CategoryDefinition[]
 * }} context
 * @returns {string}
 */
function buildSummaryMarkdown(context) {
  let markdown = buildIntroMarkdown(
    context.usedManifest,
    context.usedScanFallback,
    context.reportCount,
    context.reports.length
  );

  for (const renderSection of SECTION_RENDERERS) {
    markdown += renderSection(context);
  }

  return markdown;
}

/**
 * Runtime entry point with injectable dependencies for testability.
 *
 * @param {Deps} [deps=DEFAULT_DEPS]
 * @returns {void}
 */
function runWithDeps(deps = DEFAULT_DEPS) {
  const runtimeConfig = loadRuntimeConfig(deps);
  const {
    lhciDir,
    maxOpportunities,
    maxFailedAudits,
    categoryPassThreshold,
    categoryDefinitions
  } = runtimeConfig;

  if (!fileExists(lhciDir, deps.fsApi)) {
    printSummary('## Lighthouse\n\nNo Lighthouse results were found in `.lighthouseci`.\n', deps.stdout);
    return;
  }

  const { manifest, usedManifest, error: manifestError } = loadManifest(lhciDir, deps);

  if (manifestError) {
    printSummary(`## Lighthouse\n\nFailed to parse \.lighthouseci/manifest.json: ${manifestError.message}\n`, deps.stdout);
    return;
  }

  const linksByReport = loadLinksByReport(lhciDir, deps);
  const { reports, usedScanFallback } = loadReports(manifest, lhciDir, linksByReport, deps);

  if (!reports.length) {
    const emptyMarkdown = '## Lighthouse\n\nNo Lighthouse reports were parsed from `.lighthouseci`.\n';
    printSummary(emptyMarkdown, deps.stdout);
    return;
  }

  const consolidatedReports = consolidateReportsByUrl(reports, categoryDefinitions, deps.URLCtor);

  const markdown = buildSummaryMarkdown({
    reports: consolidatedReports,
    reportCount: reports.length,
    usedManifest,
    usedScanFallback,
    maxOpportunities,
    maxFailedAudits,
    categoryPassThreshold,
    categoryDefinitions
  });

  printSummary(markdown, deps.stdout);
}

/**
 * Default runtime entry point.
 *
 * @returns {void}
 */
function run() {
  runWithDeps(DEFAULT_DEPS);
}

try {
  run();
} catch (error) {
  printSummary(`## Lighthouse\n\nUnable to generate Lighthouse summary: ${error.message}\n`, DEFAULT_DEPS.stdout);
}
