/**
 * Spreadsheet Automation Template
 *
 * Template for automated Google Sheets operations including data processing,
 * report generation, and email notifications.
 *
 * Features:
 * - Batch operations for performance
 * - Error handling and logging
 * - Email notifications
 * - Data validation
 * - Flexible configuration
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Spreadsheet settings
  SOURCE_SHEET_NAME: 'Data',
  OUTPUT_SHEET_NAME: 'Report',
  LOG_SHEET_NAME: 'Automation Log',

  // Processing settings
  HEADER_ROW: 1,
  DATA_START_ROW: 2,
  DATE_COLUMN: 'A',
  VALUE_COLUMN: 'B',
  STATUS_COLUMN: 'C',

  // Notification settings
  SEND_EMAIL: true,
  EMAIL_RECIPIENTS: [Session.getEffectiveUser().getEmail()],
  EMAIL_SUBJECT_PREFIX: '[Automation]',

  // Safety settings
  DRY_RUN: false,  // Set to true to preview without making changes
  MAX_ROWS_TO_PROCESS: 10000
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

function main() {
  try {
    Logger.log('Starting spreadsheet automation...');
    Logger.log('Mode: ' + (CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE'));

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Initialize sheets
    const sourceSheet = getOrCreateSheet(ss, CONFIG.SOURCE_SHEET_NAME);
    const outputSheet = getOrCreateSheet(ss, CONFIG.OUTPUT_SHEET_NAME);
    const logSheet = getOrCreateSheet(ss, CONFIG.LOG_SHEET_NAME);

    // Read data (batch operation for performance)
    const data = readData(sourceSheet);
    Logger.log(`Read ${data.length} rows of data`);

    // Process data
    const results = processData(data);
    Logger.log(`Processed ${results.length} records`);

    // Write results
    if (!CONFIG.DRY_RUN) {
      writeResults(outputSheet, results);
      logExecution(logSheet, results);
    }

    // Send notification
    if (CONFIG.SEND_EMAIL) {
      sendEmailNotification(results);
    }

    Logger.log('Automation completed successfully');

  } catch (error) {
    handleError(error);
  }
}

// ============================================================================
// DATA OPERATIONS
// ============================================================================

function readData(sheet) {
  // Get all data in one batch operation (much faster than row-by-row)
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < CONFIG.DATA_START_ROW) {
    throw new Error('No data found');
  }

  const numRows = Math.min(lastRow - CONFIG.DATA_START_ROW + 1, CONFIG.MAX_ROWS_TO_PROCESS);
  const range = sheet.getRange(CONFIG.DATA_START_ROW, 1, numRows, lastCol);
  const values = range.getValues();

  // Filter out empty rows
  return values.filter(row => row.some(cell => cell !== ''));
}

function processData(data) {
  const results = [];

  data.forEach((row, index) => {
    try {
      // Extract values (adjust column indices based on your sheet structure)
      const date = row[0];
      const value = row[1];
      const status = row[2];

      // Process logic (customize as needed)
      const processed = {
        row: index + CONFIG.DATA_START_ROW,
        date: date,
        value: typeof value === 'number' ? value : parseFloat(value) || 0,
        status: status || 'pending',
        processed_at: new Date()
      };

      // Additional processing logic here
      if (processed.value > 0) {
        results.push(processed);
      }

    } catch (error) {
      Logger.log(`Error processing row ${index + CONFIG.DATA_START_ROW}: ${error.message}`);
    }
  });

  return results;
}

function writeResults(sheet, results) {
  // Clear existing content
  sheet.clear();

  // Write headers
  const headers = ['Row', 'Date', 'Value', 'Status', 'Processed At'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // Prepare data for batch write
  const outputData = results.map(item => [
    item.row,
    item.date,
    item.value,
    item.status,
    item.processed_at
  ]);

  // Batch write (much faster than appendRow in loop)
  if (outputData.length > 0) {
    sheet.getRange(2, 1, outputData.length, headers.length).setValues(outputData);
  }

  // Format
  sheet.autoResizeColumns(1, headers.length);

  Logger.log(`Wrote ${results.length} rows to ${sheet.getName()}`);
}

// ============================================================================
// UTILITIES
// ============================================================================

function getOrCreateSheet(spreadsheet, name) {
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    Logger.log(`Created new sheet: ${name}`);
  }

  return sheet;
}

function logExecution(logSheet, results) {
  const logEntry = [
    new Date(),
    CONFIG.DRY_RUN ? 'DRY RUN' : 'LIVE',
    results.length,
    'Success'
  ];

  logSheet.appendRow(logEntry);

  // Keep only last 1000 log entries
  if (logSheet.getLastRow() > 1000) {
    logSheet.deleteRows(2, logSheet.getLastRow() - 1000);
  }
}

// ============================================================================
// NOTIFICATION
// ============================================================================

function sendEmailNotification(results) {
  const subject = `${CONFIG.EMAIL_SUBJECT_PREFIX} Spreadsheet Automation Report`;

  const body = `
Spreadsheet Automation Summary
==============================

Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE'}
Timestamp: ${new Date()}
Records Processed: ${results.length}

Status: ✅ Success

${results.length > 0 ? `Sample Results:
${results.slice(0, 5).map(r => `- Row ${r.row}: ${r.status} (Value: ${r.value})`).join('\n')}
${results.length > 5 ? `\n... and ${results.length - 5} more` : ''}` : 'No records to process.'}

---
Generated by Apps Script Automation
  `;

  CONFIG.EMAIL_RECIPIENTS.forEach(recipient => {
    MailApp.sendEmail(recipient, subject, body);
  });

  Logger.log('Email notifications sent');
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

function handleError(error) {
  Logger.log('ERROR: ' + error.message);
  Logger.log('Stack: ' + error.stack);

  // Log to spreadsheet
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = getOrCreateSheet(ss, CONFIG.LOG_SHEET_NAME);
    logSheet.appendRow([
      new Date(),
      'ERROR',
      0,
      error.message
    ]);
  } catch (logError) {
    Logger.log('Could not log error to sheet: ' + logError.message);
  }

  // Send error notification
  if (CONFIG.SEND_EMAIL) {
    const subject = `${CONFIG.EMAIL_SUBJECT_PREFIX} Automation Error`;
    const body = `
Spreadsheet Automation Error
============================

An error occurred during automation:

Error: ${error.message}

Stack Trace:
${error.stack}

Please check the script logs and error log sheet for more details.

---
Generated by Apps Script Automation
    `;

    CONFIG.EMAIL_RECIPIENTS.forEach(recipient => {
      MailApp.sendEmail(recipient, subject, body);
    });
  }

  throw error;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely get cell value with default
 */
function getCellValue(sheet, row, col, defaultValue = '') {
  try {
    return sheet.getRange(row, col).getValue() || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Format currency values
 */
function formatCurrency(sheet, range) {
  sheet.getRange(range).setNumberFormat('$#,##0.00');
}

/**
 * Format percentage values
 */
function formatPercentage(sheet, range) {
  sheet.getRange(range).setNumberFormat('0.00%');
}

/**
 * Format date values
 */
function formatDate(sheet, range) {
  sheet.getRange(range).setNumberFormat('yyyy-mm-dd');
}
