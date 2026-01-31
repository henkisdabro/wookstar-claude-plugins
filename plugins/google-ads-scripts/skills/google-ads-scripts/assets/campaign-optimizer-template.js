/**
 * Campaign Optimizer Template
 *
 * Template for optimizing Google Ads campaigns based on performance metrics.
 * Customize thresholds and logic to fit your business needs.
 *
 * Features:
 * - Pause underperforming campaigns
 * - Adjust budgets based on ROAS
 * - Email notifications for actions taken
 * - Detailed logging to Google Sheets
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Performance thresholds
  MIN_CONVERSIONS: 5,              // Minimum conversions to evaluate
  TARGET_ROAS: 3.0,                // Target Return on Ad Spend (300%)
  LOW_ROAS_THRESHOLD: 2.0,         // ROAS below this triggers budget reduction
  MIN_QUALITY_SCORE: 5,            // Minimum acceptable quality score

  // Budget adjustments
  BUDGET_INCREASE_FACTOR: 1.10,    // +10% for high performers
  BUDGET_DECREASE_FACTOR: 0.90,    // -10% for low performers

  // Date range for analysis
  DATE_RANGE: 'LAST_30_DAYS',

  // Reporting
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID',  // Replace with your Sheet ID
  LOG_SHEET_NAME: 'Campaign Optimizer Log',
  NOTIFICATION_EMAIL: Session.getEffectiveUser().getEmail(),

  // Safety limits
  DRY_RUN: false,                  // Set to true to preview changes without applying
  MAX_CAMPAIGNS_TO_PROCESS: 1000   // Prevent accidental large-scale changes
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

function main() {
  try {
    Logger.log('Starting Campaign Optimizer...');
    Logger.log('Date: ' + new Date());
    Logger.log('Mode: ' + (CONFIG.DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE'));

    // Initialize reporting
    const sheet = initializeReportingSheet();

    // Get campaigns to optimize
    const campaigns = getCampaignsToOptimize();
    Logger.log(`Found ${campaigns.totalNumEntities()} campaigns to evaluate`);

    if (campaigns.totalNumEntities() > CONFIG.MAX_CAMPAIGNS_TO_PROCESS) {
      throw new Error(`Too many campaigns (${campaigns.totalNumEntities()}). Increase MAX_CAMPAIGNS_TO_PROCESS if intended.`);
    }

    // Process campaigns
    const results = processCampaigns(campaigns);

    // Generate summary
    logResults(sheet, results);
    sendEmailNotification(results);

    Logger.log('Campaign Optimizer completed successfully');

  } catch (error) {
    handleError(error);
  }
}

// ============================================================================
// CAMPAIGN PROCESSING
// ============================================================================

function getCampaignsToOptimize() {
  return AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .orderBy('campaign.metrics.cost DESC')
    .get();
}

function processCampaigns(campaigns) {
  const results = {
    evaluated: 0,
    paused: [],
    budgetIncreased: [],
    budgetDecreased: [],
    noAction: [],
    errors: []
  };

  while (campaigns.hasNext()) {
    const campaign = campaigns.next();
    results.evaluated++;

    try {
      const decision = evaluateCampaign(campaign);

      if (decision.action === 'PAUSE') {
        if (!CONFIG.DRY_RUN) {
          campaign.pause();
        }
        results.paused.push({
          name: campaign.getName(),
          reason: decision.reason
        });
      } else if (decision.action === 'INCREASE_BUDGET') {
        if (!CONFIG.DRY_RUN) {
          increaseBudget(campaign, CONFIG.BUDGET_INCREASE_FACTOR);
        }
        results.budgetIncreased.push({
          name: campaign.getName(),
          reason: decision.reason
        });
      } else if (decision.action === 'DECREASE_BUDGET') {
        if (!CONFIG.DRY_RUN) {
          decreaseBudget(campaign, CONFIG.BUDGET_DECREASE_FACTOR);
        }
        results.budgetDecreased.push({
          name: campaign.getName(),
          reason: decision.reason
        });
      } else {
        results.noAction.push(campaign.getName());
      }

    } catch (error) {
      results.errors.push({
        campaign: campaign.getName(),
        error: error.message
      });
      Logger.log(`Error processing campaign ${campaign.getName()}: ${error.message}`);
    }
  }

  return results;
}

function evaluateCampaign(campaign) {
  const stats = campaign.getStatsFor(CONFIG.DATE_RANGE);
  const conversions = stats.getConversions();
  const roas = stats.getReturnOnAdSpend();
  const cost = stats.getCost() / 1000000;

  // Insufficient data
  if (conversions < CONFIG.MIN_CONVERSIONS) {
    return { action: 'NONE', reason: `Insufficient conversions (${conversions})` };
  }

  // High performer - increase budget
  if (roas >= CONFIG.TARGET_ROAS) {
    return {
      action: 'INCREASE_BUDGET',
      reason: `High ROAS (${roas.toFixed(2)}), Cost: $${cost.toFixed(2)}`
    };
  }

  // Low performer - pause
  if (roas < CONFIG.LOW_ROAS_THRESHOLD) {
    return {
      action: 'PAUSE',
      reason: `Low ROAS (${roas.toFixed(2)}) below threshold (${CONFIG.LOW_ROAS_THRESHOLD})`
    };
  }

  // Medium performer - decrease budget
  if (roas < CONFIG.TARGET_ROAS) {
    return {
      action: 'DECREASE_BUDGET',
      reason: `ROAS (${roas.toFixed(2)}) below target (${CONFIG.TARGET_ROAS})`
    };
  }

  return { action: 'NONE', reason: 'Performance within acceptable range' };
}

// ============================================================================
// BUDGET MANAGEMENT
// ============================================================================

function increaseBudget(campaign, factor) {
  const currentBudget = campaign.getBudget().getAmount();
  const newBudget = Math.floor(currentBudget * factor);
  campaign.getBudget().setAmount(newBudget);
  Logger.log(`Increased budget for ${campaign.getName()}: ${currentBudget / 1000000} -> ${newBudget / 1000000}`);
}

function decreaseBudget(campaign, factor) {
  const currentBudget = campaign.getBudget().getAmount();
  const newBudget = Math.floor(currentBudget * factor);
  campaign.getBudget().setAmount(newBudget);
  Logger.log(`Decreased budget for ${campaign.getName()}: ${currentBudget / 1000000} -> ${newBudget / 1000000}`);
}

// ============================================================================
// REPORTING
// ============================================================================

function initializeReportingSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.LOG_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.LOG_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Mode', 'Action', 'Campaign', 'Reason']);
    sheet.getRange('A1:E1').setFontWeight('bold');
  }

  return sheet;
}

function logResults(sheet, results) {
  const timestamp = new Date();
  const mode = CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE';

  // Log paused campaigns
  results.paused.forEach(item => {
    sheet.appendRow([timestamp, mode, 'PAUSED', item.name, item.reason]);
  });

  // Log budget increases
  results.budgetIncreased.forEach(item => {
    sheet.appendRow([timestamp, mode, 'BUDGET_INCREASED', item.name, item.reason]);
  });

  // Log budget decreases
  results.budgetDecreased.forEach(item => {
    sheet.appendRow([timestamp, mode, 'BUDGET_DECREASED', item.name, item.reason]);
  });

  // Log errors
  results.errors.forEach(item => {
    sheet.appendRow([timestamp, mode, 'ERROR', item.campaign, item.error]);
  });

  Logger.log(`Logged ${results.paused.length + results.budgetIncreased.length + results.budgetDecreased.length + results.errors.length} actions to sheet`);
}

function sendEmailNotification(results) {
  if (results.paused.length === 0 && results.budgetIncreased.length === 0 && results.budgetDecreased.length === 0) {
    Logger.log('No actions taken, skipping email notification');
    return;
  }

  const subject = `Campaign Optimizer Report - ${CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE'} - ${new Date().toDateString()}`;

  const body = `
Campaign Optimizer Results
==========================

Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE'}
Date: ${new Date()}
Campaigns Evaluated: ${results.evaluated}

Actions Taken:
--------------
Paused: ${results.paused.length}
Budget Increased: ${results.budgetIncreased.length}
Budget Decreased: ${results.budgetDecreased.length}
No Action: ${results.noAction.length}
Errors: ${results.errors.length}

Paused Campaigns:
${results.paused.map(item => `- ${item.name}: ${item.reason}`).join('\n')}

Budget Increased:
${results.budgetIncreased.map(item => `- ${item.name}: ${item.reason}`).join('\n')}

Budget Decreased:
${results.budgetDecreased.map(item => `- ${item.name}: ${item.reason}`).join('\n')}

${results.errors.length > 0 ? `\nErrors:\n${results.errors.map(item => `- ${item.campaign}: ${item.error}`).join('\n')}` : ''}

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
    'Campaign Optimizer Error',
    `An error occurred in the Campaign Optimizer script:\n\n${error.message}\n\nStack trace:\n${error.stack}`
  );

  throw error;
}
