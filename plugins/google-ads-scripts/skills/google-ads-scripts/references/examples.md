# Google Ads Scripts - Code Examples

Detailed, production-ready code examples for common Google Ads Script automation tasks.

## Example 1: Pause Low-Quality Keywords

Identifies keywords with low quality scores and high spend, then pauses them to reduce wasted ad spend.

```javascript
function pauseLowQualityKeywords() {
  const keywords = AdsApp.keywords()
    .withCondition('keyword.status = ENABLED')
    .withCondition('keyword.quality_info.quality_score < 4')
    .withCondition('keyword.metrics.cost > 100000000')  // >100 spend
    .get();

  let count = 0;
  while (keywords.hasNext()) {
    const keyword = keywords.next();
    keyword.pause();
    count++;
  }

  Logger.log(`Paused ${count} low-quality keywords`);
}
```

## Example 2: Optimise Bids Based on ROAS

Adjusts keyword bids up or down based on their return on ad spend performance over the last 30 days.

```javascript
function optimizeBidsByROAS() {
  const TARGET_ROAS = 3.0;  // 300%

  const keywords = AdsApp.keywords()
    .withCondition('keyword.status = ENABLED')
    .withCondition('keyword.metrics.conversions > 5')  // Min conversions
    .get();

  while (keywords.hasNext()) {
    const keyword = keywords.next();
    const stats = keyword.getStatsFor('LAST_30_DAYS');
    const roas = stats.getReturnOnAdSpend();
    const currentBid = keyword.getMaxCpc();

    if (roas > TARGET_ROAS) {
      // Increase bid by 10%
      keyword.setMaxCpc(Math.floor(currentBid * 1.1));
    } else if (roas < TARGET_ROAS * 0.7) {
      // Decrease bid by 5%
      keyword.setMaxCpc(Math.floor(currentBid * 0.95));
    }
  }
}
```

## Example 3: Export Campaign Performance to Sheets

Exports campaign-level performance data (clicks, cost, conversions, CPC, ROAS) to a Google Sheets spreadsheet for reporting.

```javascript
function exportCampaignPerformance() {
  const campaigns = AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .orderBy('campaign.metrics.cost DESC')
    .get();

  const report = [['Campaign', 'Clicks', 'Cost', 'Conversions', 'CPC', 'ROAS']];

  while (campaigns.hasNext()) {
    const campaign = campaigns.next();
    const stats = campaign.getStatsFor('LAST_30_DAYS');

    report.push([
      campaign.getName(),
      stats.getClicks(),
      stats.getCost() / 1000000,  // Convert from micros
      stats.getConversions(),
      stats.getAverageCpc() / 1000000,
      stats.getReturnOnAdSpend()
    ]);
  }

  // Write to Google Sheets
  const ss = SpreadsheetApp.openById('YOUR_SHEET_ID');
  const sheet = ss.getSheetByName('Campaign Report') || ss.insertSheet('Campaign Report');
  sheet.clear();
  sheet.getRange(1, 1, report.length, report[0].length).setValues(report);
}
```
