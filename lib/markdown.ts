import { Marked, type Renderer } from "marked";

// Markdown → HTML for text written by people (articles, lessons). Raw HTML is shown as text instead of being
// executed, and only http(s), mailto and relative links are kept, so `<script>`, `onerror=` and `javascript:` are inert.
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Control characters and spaces are stripped before checking, so "java\tscript:" cannot sneak through.
const isSafeUrl = (href: string) => /^(https?:|mailto:|\/(?!\/)|#|\.{1,2}\/)/i.test(href.replace(/[\u0000- \u007f]+/g, ""));
const isExternal = (href: string) => /^https?:/i.test(href.trim());

const md = new Marked({
  async: false,
  renderer: {
    html: ({ text }) => escapeHtml(text),
    link(this: Renderer, { href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (!isSafeUrl(href)) return inner;
      const extra = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${title ? ` title="${escapeHtml(title)}"` : ""}${extra}>${inner}</a>`;
    },
    image({ href, title, text }) {
      if (!isSafeUrl(href)) return escapeHtml(text);
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${title ? ` title="${escapeHtml(title)}"` : ""} loading="lazy">`;
    },
  },
});

export function renderMarkdown(source: string): string {
  return md.parse(source) as string;
}
