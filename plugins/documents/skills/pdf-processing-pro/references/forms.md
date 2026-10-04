# PDF forms

Commands run from the skill directory. The scripts handle AcroForm PDFs through pypdf; XFA forms (common in older government PDFs) are not supported - `analyze_form.py` returns no fields for them.

## Fill a form

```bash
# 1. Read the fields - names, types, required flag, options, max_length
uv run "${CLAUDE_SKILL_DIR}/scripts/analyze_form.py" template.pdf --output schema.json

# 2. Write data.json keyed by the exact field names from schema.json

# 3. Check the data against the schema (exit 4 lists every problem)
uv run "${CLAUDE_SKILL_DIR}/scripts/validate_form.py" data.json schema.json

# 4. Fill; --validate re-checks against the live form, --flatten locks the fields
uv run "${CLAUDE_SKILL_DIR}/scripts/fill_form.py" template.pdf data.json filled.pdf --validate --flatten

# 5. Confirm the output is a valid PDF with the expected field count
uv run "${CLAUDE_SKILL_DIR}/scripts/validate_pdf.py" filled.pdf
```

Done when step 3 exits 0 and step 5 reports `"valid": true`.

`flatten_form.py` does step 4's `--flatten` on its own, for a PDF that is already filled.

## Field values in data.json

`analyze_form.py` reports one of four `type` values:

| type | What to put in data.json |
|------|--------------------------|
| `text` | A string. Respect `max_length` when present. Multi-line fields take `\n`. |
| `button` | Checkbox: `true` / `false` (the script writes `/Yes` / `/Off`). Radio group: the option's export name, e.g. `"/email"`. |
| `choice` | One of the strings in `options` exactly. |
| `signature` | Leave out - these need a signing tool, not a fill. |

Some checkboxes use an "on" value other than `/Yes` (often `/On` or `/1`). If a checkbox stays unticked after filling, read its export value with the snippet below and pass that string instead of `true`.

## Inspect fields directly

When `analyze_form.py` output is not enough, for example to find a checkbox's export value or which page a field sits on:

```python
from pypdf import PdfReader

reader = PdfReader("form.pdf")
for page_num, page in enumerate(reader.pages, 1):
    for annot in page.get("/Annots", []) or []:
        field = annot.get_object()
        if field.get("/Subtype") == "/Widget":
            states = list(field.get("/AP", {}).get("/N", {}).keys())
            print(page_num, field.get("/T"), field.get("/FT"), states)
```

Run it with `uv run --with pypdf python inspect.py`.

## Batch fill

One template, one data file per submission:

```bash
mkdir -p completed
for data in submissions/*.json; do
  uv run "${CLAUDE_SKILL_DIR}/scripts/fill_form.py" template.pdf "$data" "completed/$(basename "$data" .json).pdf" --validate \
    || echo "FAILED: $data (exit $?)"
done
```

Done when no `FAILED` lines print, or each failure is explained by a validation error the script listed.

## When fields do not fill

1. Field names are case-sensitive and must match `schema.json` exactly - `validate_form.py` reports unknown names.
2. Checkbox or radio values do not match the field's export value - inspect as above.
3. The PDF is encrypted - `validate_pdf.py` reports `"encrypted": true`; decrypt it first.
4. The values are set but invisible in some viewers - the template lacks appearance streams. Open it in a different viewer, or regenerate the template from its source.
5. No fields at all - the form is XFA or the "form" is just printed lines. Fall back to overlaying text on the page.
