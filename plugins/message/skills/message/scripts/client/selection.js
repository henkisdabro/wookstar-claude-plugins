// Which destination (or tier) the preview opens on. One rule, shared by the
// destination picker and the X tier toggle:
//
//   URL ?channel= > serve.ts flag > fragment `channel:` > remembered choice > default
//
// The first three are explicit; the first valid one is the "source". A chip
// clicked in this tab is remembered with the source it overrode, and wins on
// hot reload only while that source is unchanged - so editing `channel:` in
// the fragment always switches the open tab.
//
// The explicit source: the first valid of URL query, CLI flag, fragment.
export function selectionSource({ query, cli, fragment, valid }) {
  return [query, cli, fragment].find((v) => v && valid(v)) || "";
}

// args: { query, cli, fragment, pick: { source, id } | null, stored, fallback, valid(id) }
export function resolveSelection({ query, cli, fragment, pick, stored, fallback, valid }) {
  const ok = (v) => (v && valid(v) ? v : null);
  const source = selectionSource({ query, cli, fragment, valid });
  if (pick && pick.source === source && ok(pick.id)) return pick.id;
  return source || ok(stored) || fallback;
}
