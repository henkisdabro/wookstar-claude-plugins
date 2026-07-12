// Shared policy for both email transforms: newlines inside a code block
// become <br>. A literal \n inside a <div> renders as a space, which would
// flatten a multi-line block onto one line. Trailing newlines (marked always
// emits one before </code>) are stripped so blocks don't end with a blank
// line. One definition keeps the Gmail and Rich Text lanes rendering code
// identically.
export function codeNewlinesToBr(inner: string): string {
  return inner.replace(/\n+$/, "").replace(/\n/g, "<br>");
}

// Both email transforms strip <hr> BEFORE inserting blank-line spacers, so a
// paragraph boundary that had a rule between the paragraphs still reads as a
// plain paragraph boundary and keeps its spacer.
export function stripHorizontalRules(html: string): string {
  return html.replace(/<hr\s*\/?>/g, "");
}
