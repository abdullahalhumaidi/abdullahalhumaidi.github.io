// Used in the normal (publish) build: no private/unapproved material at all.
export const privMeta: Record<string, unknown> = {}
export const privAssets: Record<string, string> = {}
export const privHtml: Record<string, () => Promise<string>> = {}
export const privFontInline: Record<string, () => Promise<string>> = {}
