/**
 * Bid Manager Template
 *
 * Template for automated keyword bid management based on performance metrics.
 * Adjusts manual CPC keyword bids against a ROAS or CPA target, with safety limits.
 * Bids are in account currency; keyword CPC bids only take effect under manual CPC.
 *
 * Features:
 * - Bid optimisation based on ROAS/CPA targets
 * - Quality score-based bid adjustments
 * - Conversion-driven bid modifications
 * - Detailed audit logging
 * - Safety limits and dry-run mode
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Bidding strategy
  STRATEGY: 'ROAS',  // 'ROAS' or 'CPA'
  TARGET_ROAS: 3.0,               // Target Return on Ad Spend (300%)
  TARGET_CPA: 50.00,              // Target Cost Per Acquisition (in currency)

  // Bid adjustment factors
  HIGH_PERFORMER_INCREASE: 1.10,  // +10% for high performers
  LOW_PERFORMER_DECREASE: 0.95,   // -5% for low performers
  QUALITY_SCORE_FACTOR: 0.05,     // ±5% per quality score point deviation

  // Performance thresholds
  MIN_CONVERSIONS: 3,             // Minimum conversions to evaluate
  MIN_CLICKS: 50,                 // Minimum clicks to evaluate
  HIGH_ROAS_THRESHOLD: 3.5,       // ROAS above this = high performer
  LOW_ROAS_THRESHOLD: 2.0,        // ROAS below this = low performer
  TARGET_QUALITY_SCORE: 7,        // Target quality score

  // Bid limits (account currency)
  MIN_BID: 0.05,                  // Minimum bid
  MAX_BID: 10.00,                 // Maximum bid
  MAX_BID_CHANGE_PERCENT: 25,     // Maximum 25% bid change per run

  // Date range (a GAQL DURING constant, e.g. LAST_7_DAYS, LAST_30_DAYS)
  DATE_RANGE: 'LAST_30_DAYS',

  // Reporting
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',  // Replace with your Sheet ID
  LOG_SHEET_NAME: 'Bid Manager Log',
  NOTIFICATION_EMAIL: 'you@example.com',  // Replace with your address

  // Safety
  DRY_RUN: true,                  // Set to false once the dry-run log looks right
  MAX_KEYWORDS_TO_PROCESS: 5000   // Prevent accidental mass changes
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

function main() {
  try {
    Logger.log('Starting Bid Manager...');
    Logger.log('Date: ' + new Date());
    Logger.log('Strategy: ' + CONFIG.STRATEGY);
    Logger.log('Mode: ' + (CONFIG.DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE'));

    // Initialize reporting
    const sheet = initializeReportingSheet();

    // Keyword metrics from GAQL (Stats has no conversion value), then the entities to act on
    const metrics = loadKeywordMetrics();
    const keywords = getKeywordsToOptimize();
    Logger.log(`Found ${keywords.totalNumEntities()} keywords to evaluate`);

    if (keywords.totalNumEntities() > CONFIG.MAX_KEYWORDS_TO_PROCESS) {
      throw new Error(`Too many keywords (${keywords.totalNumEntities()}). Increase MAX_KEYWORDS_TO_PROCESS if intended.`);
    }

    // Process keywords
    const results = processKeywords(keywords, metrics);

    // Generate summary
    logResults(sheet, results);
    sendEmailNotification(results);

    Logger.log('Bid Manager completed successfully');

  } catch (error) {
    handleError(error);
  }
}

// ============================================================================
// KEYWORD PROCESSING
// ============================================================================

function keywordKey(adGroupId, keywordId) {
  return `${adGroupId}~${keywordId}`;
}

function loadKeywordMetrics() {
  const rows = AdsApp.search(`
    SELECT ad_group.id, ad_group_criterion.criterion_id,
           metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value
    FROM keyword_view
    WHERE ad_group_criterion.status = ENABLED
      AND metrics.clicks >= ${CONFIG.MIN_CLICKS}
      AND segments.date DURING ${CONFIG.DATE_RANGE}`);

  const byKey = {};
  while (rows.hasNext()) {
    const row = rows.next();
    byKey[keywordKey(row.adGroup.id, row.adGroupCriterion.criterionId)] = {
      clicks: Number(row.metrics.clicks || 0),
      cost: Number(row.metrics.costMicros || 0) / 1e6,   // Micros -> currency
      conversions: row.metrics.conversions || 0,
      conversionValue: row.metrics.conversionsValue || 0
    };
  }
  return byKey;
}

function getKeywordsToOptimize() {
  return AdsApp.keywords()
    .withCondition('ad_group_criterion.status = ENABLED')
    .withCondition('campaign.bidding_strategy_type = MANUAL_CPC')
    .withCondition(`metrics.clicks >= ${CONFIG.MIN_CLICKS}`)
    .forDateRange(CONFIG.DATE_RANGE)
    .orderBy('metrics.cost_micros DESC')
    .get();
}

function processKeywords(keywords, metrics) {
  const results = {
    evaluated: 0,
    increased: [],
    decreased: [],
    paused: [],
    noChange: [],
    errors: []
  };

  while (keywords.hasNext()) {
    const keyword = keywords.next();
    results.evaluated++;

    try {
      const decision = evaluateKeyword(keyword, metrics[keywordKey(keyword.getAdGroup().getId(), keyword.getId())]);

      if (decision.action === 'PAUSE') {
        if (!CONFIG.DRY_RUN) {
          keyword.pause();
        }
        results.paused.push({
          text: keyword.getText(),
          campaign: keyword.getCampaign().getName(),
          currentBid: keyword.bidding().getCpc(),
          reason: decision.reason
        });
      } else if (decision.newBid && decision.newBid !== keyword.bidding().getCpc()) {
        const oldBid = keyword.bidding().getCpc();

        if (!CONFIG.DRY_RUN) {
          keyword.bidding().setCpc(decision.newBid);
        }

        const changeRecord = {
          text: keyword.getText(),
          campaign: keyword.getCampaign().getName(),
          oldBid: oldBid,
          newBid: decision.newBid,
          change: ((decision.newBid - oldBid) / oldBid * 100).toFixed(1) + '%',
          reason: decision.reason
        };

        if (decision.newBid > oldBid) {
          results.increased.push(changeRecord);
        } else {
          results.decreased.push(changeRecord);
        }
      } else {
        results.noChange.push(keyword.getText());
      }

    } catch (error) {
      results.errors.push({
        keyword: keyword.getText(),
        error: error.message
      });
      Logger.log(`Error processing keyword ${keyword.getText()}: ${error.message}`);
    }
  }

  return results;
}

function evaluateKeyword(keyword, m) {
  if (!m) {
    return { action: 'NONE', reason: 'No metrics in date range' };
  }
  const { conversions, cost, conversionValue } = m;
  const currentBid = keyword.bidding().getCpc();   // Currency; guard against a missing keyword-level bid
  const qualityScore = keyword.getQualityScore();

  if (currentBid === null) {
    return { action: 'NONE', reason: "No keyword-level bid" };
  }

  // Insufficient data
  if (conversions < CONFIG.MIN_CONVERSIONS) {
    return { action: 'NONE', reason: `Insufficient conversions (${conversions})` };
  }

  // Calculate performance metrics
  let performanceMultiplier = 1.0;
  let reason = [];

  if (CONFIG.STRATEGY === 'ROAS') {
    const roas = cost > 0 ? conversionValue / cost : 0;

    if (roas >= CONFIG.HIGH_ROAS_THRESHOLD) {
      performanceMultiplier *= CONFIG.HIGH_PERFORMER_INCREASE;
      reason.push(`High ROAS (${roas.toFixed(2)})`);
    } else if (roas < CONFIG.LOW_ROAS_THRESHOLD) {
      performanceMultiplier *= CONFIG.LOW_PERFORMER_DECREASE;
      reason.push(`Low ROAS (${roas.toFixed(2)})`);
    }
  } else if (CONFIG.STRATEGY === 'CPA') {
    const cpa = conversions > 0 ? cost / conversions : Infinity;

    if (cpa <= CONFIG.TARGET_CPA * 0.8) {
      performanceMultiplier *= CONFIG.HIGH_PERFORMER_INCREASE;
      reason.push(`Low CPA (${cpa.toFixed(2)})`);
    } else if (cpa > CONFIG.TARGET_CPA * 1.2) {
      performanceMultiplier *= CONFIG.LOW_PERFORMER_DECREASE;
      reason.push(`High CPA (${cpa.toFixed(2)})`);
    }
  }

  // Quality score adjustment
  if (qualityScore !== null) {
    const qsDeviation = qualityScore - CONFIG.TARGET_QUALITY_SCORE;
    const qsMultiplier = 1 + (qsDeviation * CONFIG.QUALITY_SCORE_FACTOR);
    performanceMultiplier *= qsMultiplier;
    reason.push(`QS ${qualityScore}`);

    // Pause very low quality keywords
    if (qualityScore < 3) {
      return {
        action: 'PAUSE',
        reason: `Very low quality score (${qualityScore})`
      };
    }
  }

  // Calculate new bid
  const proposedBid = roundBid(currentBid * performanceMultiplier);

  // Apply safety limits
  const safeBid = applySafetyLimits(currentBid, proposedBid);

  // No change needed
  if (safeBid === currentBid) {
    return { action: 'NONE', reason: 'No change needed' };
  }

  return {
    action: 'UPDATE_BID',
    newBid: safeBid,
    reason: reason.join(', ')
  };
}

// ============================================================================
// BID CALCULATION & SAFETY
// ============================================================================

function roundBid(bid) {
  return Math.round(bid * 100) / 100;   // Two decimals in account currency
}

function applySafetyLimits(currentBid, proposedBid) {
  // Enforce minimum bid
  if (proposedBid < CONFIG.MIN_BID) {
    Logger.log(`Proposed bid ${proposedBid} below minimum, using ${CONFIG.MIN_BID}`);
    return CONFIG.MIN_BID;
  }

  // Enforce maximum bid
  if (proposedBid > CONFIG.MAX_BID) {
    Logger.log(`Proposed bid ${proposedBid} above maximum, using ${CONFIG.MAX_BID}`);
    return CONFIG.MAX_BID;
  }

  // Enforce maximum change percentage
  const changePercent = Math.abs((proposedBid - currentBid) / currentBid * 100);
  if (changePercent > CONFIG.MAX_BID_CHANGE_PERCENT) {
    const maxChange = currentBid * (CONFIG.MAX_BID_CHANGE_PERCENT / 100);
    const cappedBid = proposedBid > currentBid
      ? roundBid(currentBid + maxChange)
      : roundBid(currentBid - maxChange);
    Logger.log(`Change ${changePercent.toFixed(1)}% exceeds max ${CONFIG.MAX_BID_CHANGE_PERCENT}%, capping to ${cappedBid}`);
    return cappedBid;
  }

  return proposedBid;
}

// ============================================================================
// REPORTING
// ============================================================================

function initializeReportingSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.LOG_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.LOG_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Mode', 'Action', 'Keyword', 'Campaign', 'Old Bid', 'New Bid', 'Change', 'Reason']);
    sheet.getRange('A1:I1').setFontWeight('bold');
  }

  return sheet;
}

function logResults(sheet, results) {
  const timestamp = new Date();
  const mode = CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE';

  // Log bid increases
  results.increased.forEach(item => {
    sheet.appendRow([
      timestamp, mode, 'BID_INCREASED', item.text, item.campaign,
      item.oldBid, item.newBid, item.change, item.reason
    ]);
  });

  // Log bid decreases
  results.decreased.forEach(item => {
    sheet.appendRow([
      timestamp, mode, 'BID_DECREASED', item.text, item.campaign,
      item.oldBid, item.newBid, item.change, item.reason
    ]);
  });

  // Log paused keywords
  results.paused.forEach(item => {
    sheet.appendRow([
      timestamp, mode, 'PAUSED', item.text, item.campaign,
      item.currentBid, 0, '-100%', item.reason
    ]);
  });

  // Log errors
  results.errors.forEach(item => {
    sheet.appendRow([
      timestamp, mode, 'ERROR', item.keyword, '', '', '', '', item.error
    ]);
  });

  Logger.log(`Logged ${results.increased.length + results.decreased.length + results.paused.length + results.errors.length} actions to sheet`);
}

function sendEmailNotification(results) {
  if (results.increased.length === 0 && results.decreased.length === 0 && results.paused.length === 0) {
    Logger.log('No bid changes, skipping email notification');
    return;
  }

  const subject = `Bid Manager Report - ${CONFIG.STRATEGY} - ${CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE'} - ${new Date().toDateString()}`;

  const body = `
Bid Manager Results
===================

Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE'}
Strategy: ${CONFIG.STRATEGY}
${CONFIG.STRATEGY === 'ROAS' ? `Target ROAS: ${CONFIG.TARGET_ROAS}` : `Target CPA: ${CONFIG.TARGET_CPA}`}
Date: ${new Date()}
Keywords Evaluated: ${results.evaluated}

Actions Taken:
--------------
Bids Increased: ${results.increased.length}
Bids Decreased: ${results.decreased.length}
Keywords Paused: ${results.paused.length}
No Change: ${results.noChange.length}
Errors: ${results.errors.length}

Top Bid Increases:
${results.increased.slice(0, 10).map(item =>
  `- ${item.text} (${item.campaign}): ${item.oldBid.toFixed(2)} -> ${item.newBid.toFixed(2)} (${item.change}) - ${item.reason}`
).join('\n')}

Top Bid Decreases:
${results.decreased.slice(0, 10).map(item =>
  `- ${item.text} (${item.campaign}): ${item.oldBid.toFixed(2)} -> ${item.newBid.toFixed(2)} (${item.change}) - ${item.reason}`
).join('\n')}

Paused Keywords:
${results.paused.map(item => `- ${item.text} (${item.campaign}): ${item.reason}`).join('\n')}

${results.errors.length > 0 ? `\nErrors:\n${results.errors.map(item => `- ${item.keyword}: ${item.error}`).join('\n')}` : ''}

---
Generated by Google Ads Script
  `;

  MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
  Logger.log('Email notification sent to ' + CONFIG.NOTIFICATION_EMAIL);
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(error) {
  Logger.log('FATAL ERROR: ' + error.message);
  Logger.log('Stack trace: ' + error.stack);

  MailApp.sendEmail(
    CONFIG.NOTIFICATION_EMAIL,
    'Bid Manager Error',
    `An error occurred in the Bid Manager script:\n\n${error.message}\n\nStack trace:\n${error.stack}`
  );

  throw error;
}
