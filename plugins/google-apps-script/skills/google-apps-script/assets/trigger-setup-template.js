/**
 * Trigger Setup Template
 *
 * Template for managing time-based and event-based triggers in Google Apps Script.
 * Includes functions for creating, listing, and deleting triggers safely.
 *
 * Features:
 * - Time-based triggers (hourly, daily, weekly, monthly)
 * - Event-based triggers (onEdit, onOpen, onFormSubmit)
 * - Trigger management (list, delete, update)
 * - Prevents duplicate triggers
 */

// ============================================================================
// TIME-BASED TRIGGERS
// ============================================================================

/**
 * Set up daily trigger at specific hour
 */
function setupDailyTrigger(functionName, hour) {
  // Remove existing triggers for this function
  deleteTriggersForFunction(functionName);

  // Create new trigger
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .atHour(hour)
    .everyDays(1)
    .create();

  Logger.log(`Daily trigger created for ${functionName} at ${hour}:00`);
}

/**
 * Set up hourly trigger
 */
function setupHourlyTrigger(functionName, everyNHours = 1) {
  deleteTriggersForFunction(functionName);

  ScriptApp.newTrigger(functionName)
    .timeBased()
    .everyHours(everyNHours)
    .create();

  Logger.log(`Hourly trigger created for ${functionName} (every ${everyNHours} hours)`);
}

/**
 * Set up weekly trigger
 */
function setupWeeklyTrigger(functionName, day, hour) {
  deleteTriggersForFunction(functionName);

  // Day: ScriptApp.WeekDay.MONDAY, TUESDAY, etc.
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .onWeekDay(day)
    .atHour(hour)
    .create();

  Logger.log(`Weekly trigger created for ${functionName} on ${day} at ${hour}:00`);
}

/**
 * Set up monthly trigger
 */
function setupMonthlyTrigger(functionName, dayOfMonth, hour) {
  deleteTriggersForFunction(functionName);

  ScriptApp.newTrigger(functionName)
    .timeBased()
    .onMonthDay(dayOfMonth)
    .atHour(hour)
    .create();

  Logger.log(`Monthly trigger created for ${functionName} on day ${dayOfMonth} at ${hour}:00`);
}

// ============================================================================
// EVENT-BASED TRIGGERS
// ============================================================================

/**
 * Set up spreadsheet edit trigger
 */
function setupOnEditTrigger(functionName) {
  deleteTriggersForFunction(functionName);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger(functionName)
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  Logger.log(`onEdit trigger created for ${functionName}`);
}

/**
 * Set up spreadsheet open trigger
 */
function setupOnOpenTrigger(functionName) {
  deleteTriggersForFunction(functionName);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger(functionName)
    .forSpreadsheet(ss)
    .onOpen()
    .create();

  Logger.log(`onOpen trigger created for ${functionName}`);
}

/**
 * Set up form submit trigger
 */
function setupOnFormSubmitTrigger(functionName, formId = null) {
  deleteTriggersForFunction(functionName);

  if (formId) {
    const form = FormApp.openById(formId);
    ScriptApp.newTrigger(functionName)
      .forForm(form)
      .onFormSubmit()
      .create();
  } else {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ScriptApp.newTrigger(functionName)
      .forSpreadsheet(ss)
      .onFormSubmit()
      .create();
  }

  Logger.log(`onFormSubmit trigger created for ${functionName}`);
}

// ============================================================================
// TRIGGER MANAGEMENT
// ============================================================================

/**
 * List all project triggers
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  Logger.log(`Total triggers: ${triggers.length}`);

  triggers.forEach((trigger, index) => {
    const info = getTriggerInfo(trigger);
    Logger.log(`[${index + 1}] ${info}`);
  });

  return triggers;
}

/**
 * Get trigger information as string
 */
function getTriggerInfo(trigger) {
  const functionName = trigger.getHandlerFunction();
  const triggerSource = trigger.getTriggerSource();

  let details = '';

  if (triggerSource === ScriptApp.TriggerSource.CLOCK) {
    const eventType = trigger.getEventType();
    details = `Time-based (${eventType})`;
  } else if (triggerSource === ScriptApp.TriggerSource.SPREADSHEETS) {
    const eventType = trigger.getEventType();
    details = `Spreadsheet (${eventType})`;
  } else if (triggerSource === ScriptApp.TriggerSource.FORMS) {
    details = 'Form submit';
  }

  return `${functionName} - ${details}`;
}

/**
 * Delete all triggers for a specific function
 */
function deleteTriggersForFunction(functionName) {
  const triggers = ScriptApp.getProjectTriggers();
  let deletedCount = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === functionName) {
      ScriptApp.deleteTrigger(trigger);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    Logger.log(`Deleted ${deletedCount} trigger(s) for ${functionName}`);
  }

  return deletedCount;
}

/**
 * Delete ALL project triggers (use with caution!)
 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  Logger.log(`Deleted ${triggers.length} trigger(s)`);
}

// ============================================================================
// EXAMPLE SETUP FUNCTIONS
// ============================================================================

/**
 * Example: Set up daily report at 9 AM
 */
function setupDailyReport() {
  setupDailyTrigger('generateDailyReport', 9);
}

/**
 * Example: Set up weekly summary on Monday at 10 AM
 */
function setupWeeklySummary() {
  setupWeeklyTrigger('generateWeeklySummary', ScriptApp.WeekDay.MONDAY, 10);
}

/**
 * Example: Set up hourly data sync
 */
function setupHourlySync() {
  setupHourlyTrigger('syncData', 1);
}

/**
 * Example: Set up form response processor
 */
function setupFormProcessor() {
  setupOnFormSubmitTrigger('processFormResponse');
}

// ============================================================================
// EXAMPLE TRIGGERED FUNCTIONS
// ============================================================================

/**
 * Example: Daily report function (triggered daily)
 */
function generateDailyReport() {
  try {
    Logger.log('Generating daily report...');

    // Your daily report logic here

    Logger.log('Daily report completed');
  } catch (error) {
    Logger.log('Error in daily report: ' + error.message);
    sendErrorEmail('Daily Report Error', error);
  }
}

/**
 * Example: Weekly summary function (triggered weekly)
 */
function generateWeeklySummary() {
  try {
    Logger.log('Generating weekly summary...');

    // Your weekly summary logic here

    Logger.log('Weekly summary completed');
  } catch (error) {
    Logger.log('Error in weekly summary: ' + error.message);
    sendErrorEmail('Weekly Summary Error', error);
  }
}

/**
 * Example: Hourly sync function (triggered hourly)
 */
function syncData() {
  try {
    Logger.log('Syncing data...');

    // Your data sync logic here

    Logger.log('Data sync completed');
  } catch (error) {
    Logger.log('Error in data sync: ' + error.message);
    sendErrorEmail('Data Sync Error', error);
  }
}

/**
 * Example: Form response processor (triggered on form submit)
 */
function processFormResponse(e) {
  try {
    Logger.log('Processing form response...');

    const response = e.values;
    // Process response here

    Logger.log('Form response processed');
  } catch (error) {
    Logger.log('Error processing form: ' + error.message);
    sendErrorEmail('Form Processing Error', error);
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Send error notification email
 */
function sendErrorEmail(subject, error) {
  try {
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: `[Error] ${subject}`,
      body: `Error: ${error.message}\n\nStack: ${error.stack}`
    });
  } catch (emailError) {
    Logger.log('Could not send error email: ' + emailError.message);
  }
}

/**
 * Test if trigger exists for function
 */
function triggerExistsForFunction(functionName) {
  const triggers = ScriptApp.getProjectTriggers();
  return triggers.some(trigger => trigger.getHandlerFunction() === functionName);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Set up all triggers for the project
 * Run this once to initialize all triggers
 */
function initializeAllTriggers() {
  Logger.log('Initializing all triggers...');

  // Set up your triggers here
  setupDailyReport();        // Daily at 9 AM
  setupWeeklySummary();     // Monday at 10 AM
  setupHourlySync();        // Every hour

  Logger.log('All triggers initialized');

  // List triggers for verification
  listAllTriggers();
}

/**
 * Remove all triggers for the project
 * Use when resetting or cleaning up
 */
function removeAllTriggers() {
  const confirmation = Browser.msgBox(
    'Confirm Deletion',
    'Are you sure you want to delete ALL triggers?',
    Browser.Buttons.YES_NO
  );

  if (confirmation === 'yes') {
    deleteAllTriggers();
    Browser.msgBox('All triggers deleted');
  } else {
    Browser.msgBox('Deletion cancelled');
  }
}
