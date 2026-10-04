# Google Ads Scripts - Common Patterns

Reusable automation patterns.

## Pattern: Day-of-Week Budget Adjustment

Raises budgets on weekends and restores them on weekdays. Base amounts live in a constant map (or a Sheet), because multiplying the current budget on every run would compound.

```javascript
const BASE_BUDGETS = { 'Brand - AU': 50, 'Generic - AU': 120 };   // Account currency
const WEEKEND_FACTOR = 1.2;

function main() {
  const tz = AdsApp.currentAccount().getTimeZone();
  const day = Number(Utilities.formatDate(new Date(), tz, 'u'));   // 1 = Monday ... 7 = Sunday
  const factor = day >= 6 ? WEEKEND_FACTOR : 1;

  const campaigns = AdsApp.campaigns()
    .withCondition('campaign.status = ENABLED')
    .get();

  while (campaigns.hasNext()) {
    const campaign = campaigns.next();
    const base = BASE_BUDGETS[campaign.getName()];
    const budget = campaign.getBudget();
    if (base === undefined || budget.isExplicitlyShared()) continue;

    budget.setAmount(Math.round(base * factor * 100) / 100);
  }
}
```

## Pattern: Quality Score Monitoring

Lists the costliest low-QS keywords with their component ratings, which only GAQL exposes.

```javascript
function main() {
  const threshold = 5;
  const rows = AdsApp.search(`
    SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
           ad_group_criterion.quality_info.quality_score,
           ad_group_criterion.quality_info.creative_quality_score,
           ad_group_criterion.quality_info.post_click_quality_score,
           ad_group_criterion.quality_info.search_predicted_ctr,
           metrics.cost_micros
    FROM keyword_view
    WHERE ad_group_criterion.status = ENABLED
      AND ad_group_criterion.quality_info.quality_score < ${threshold}
      AND segments.date DURING LAST_7_DAYS
    ORDER BY metrics.cost_micros DESC
    LIMIT 100`);

  const alerts = [];
  while (rows.hasNext()) {
    const r = rows.next();
    const q = r.adGroupCriterion.qualityInfo;
    alerts.push(`${r.adGroupCriterion.keyword.text} (${r.campaign.name}): QS ${q.qualityScore}, ` +
      `ad ${q.creativeQualityScore}, landing page ${q.postClickQualityScore}, ` +
      `expected CTR ${q.searchPredictedCtr}, cost ${(Number(r.metrics.costMicros) / 1e6).toFixed(2)}`);
  }

  if (alerts.length > 0) {
    MailApp.sendEmail('you@example.com', `${alerts.length} keywords with QS < ${threshold}`, alerts.join('\n'));
  }
}
```
