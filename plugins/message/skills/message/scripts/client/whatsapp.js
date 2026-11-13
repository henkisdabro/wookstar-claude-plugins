// HTML -> WhatsApp light markup (*bold* _italic_ ~strike~, ``` blocks, tables
// as a padded grid or stacked rows). A spec in dialects.js; kept as its own
// entry point because the preview and the tests call it by name.
import { renderDialect, DIALECTS } from "./dialects.js";

export function htmlToWhatsApp(rawHtml) {
  return renderDialect(rawHtml, DIALECTS.whatsapp);
}
