# Google Ads Scripts - Common Patterns

Reusable automation patterns for Google Ads Script development.

## Pattern: Conditional Bid Adjustment

Adjusts campaign budgets based on day of week - useful for businesses with different weekend/weekday performance.

```javascript
function adjustBidsBasedOnDayOfWeek() {
  const today = new Date().getDay();  // 0 = Sunday, 6 = Saturday
  const isWeekend = today === 0 || today === 6;

  const campaigns = AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .get();

  while (campaigns.hasNext()) {
    const campaign = campaigns.next();
    const budget = campaign.getBudget().getAmount();

    if (isWeekend) {
      campaign.getBudget().setAmount(budget * 1.2);  // +20% on weekends
    }
  }
}
```

## Pattern: Quality Score Monitoring

Monitors keywords with low quality scores, prioritised by spend, and generates alerts.

```javascript
function monitorQualityScores() {
  const threshold = 5;

  const lowQualityKeywords = AdsApp.keywords()
    .withCondition(`keyword.quality_info.quality_score < ${threshold}`)
    .withCondition('keyword.status = ENABLED')
    .orderBy('keyword.metrics.cost DESC')  // Most expensive first
    .withLimit(100)
    .get();

  const alerts = [];
  while (lowQualityKeywords.hasNext()) {
    const keyword = lowQualityKeywords.next();
    alerts.push({
      keyword: keyword.getText(),
      qualityScore: keyword.getQualityScore(),
      cost: keyword.getStatsFor('LAST_7_DAYS').getCost() / 1000000
    });
  }

  if (alerts.length > 0) {
    // Send email or log to sheet
    Logger.log(`${alerts.length} keywords with QS < ${threshold}`);
  }
}
```
