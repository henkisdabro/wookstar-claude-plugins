// HTML -> plain text, for X and other posts that take no markup. A spec in
// dialects.js; kept as its own entry point because the preview and the tests
// call it by name.
import { renderDialect, DIALECTS } from "./dialects.js";

export function htmlToPlainText(rawHtml) {
  return renderDialect(rawHtml, DIALECTS.plain);
}
