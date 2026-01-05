"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";
import slugify from "slugify";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ArticleSettings } from "@/lib/types";

const extensions = [
  StarterKit,
  Underline,
  Highlight,
  Link.configure({ openOnClick: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Image.configure({ allowBase64: false }),
];

const emptyContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Begin your study. The peer review committee is mostly asleep.",
        },
      ],
    },
  ],
};

type AuthorEditorProps = {
  articleId?: string | null;
};

export default function AuthorEditor({ articleId }: AuthorEditorProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [settings, setSettings] = useState<ArticleSettings>({
    accentColor: "#ff5f3c",
    layoutStyle: "classic",
    showToc: true,
    showDropCap: true,
    heroTreatment: "collage",
    readingPace: "studious",
    kicker: "Reginald Field Report",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions,
    content: emptyContent,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] rounded-3xl border border-black/10 bg-white/70 px-6 py-5 text-base leading-relaxed outline-none",
      },
    },
  });

  const htmlGenerator = useMemo(() => extensions, []);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        return;
      }
      const { data } = await supabase
        .from("articles")
        .select(
          "id, title, subtitle, slug, excerpt, cover_url, tags, status, settings, content_json, published_at"
        )
        .eq("id", articleId)
        .single();

      if (data) {
        setTitle(data.title ?? "");
        setSubtitle(data.subtitle ?? "");
        setSlug(data.slug ?? "");
        setExcerpt(data.excerpt ?? "");
        setCoverUrl(data.cover_url ?? "");
        setTags((data.tags ?? []).join(", "));
        setStatus(data.status ?? "draft");
        setPublishedAt(data.published_at ?? null);
        setSettings((prev) => ({
          ...prev,
          ...(data.settings ?? {}),
        }));
        if (editor && data.content_json) {
          editor.commands.setContent(data.content_json);
        }
      }
    };

    loadArticle();
  }, [articleId, editor, supabase]);

  const handleSlug = (value: string) => {
    const nextSlug = slugify(value, { lower: true, strict: true });
    setSlug(nextSlug);
    return nextSlug;
  };

  const handleSave = async () => {
    if (!editor) {
      return;
    }

    setSaving(true);
    setMessage(null);
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      setMessage("Please sign in as an author.");
      setSaving(false);
      return;
    }

    const contentJson = editor.getJSON();
    const contentHtml = generateHTML(contentJson, htmlGenerator);

    const normalizedSlug = slug || slugify(title, { lower: true, strict: true });
    const payload = {
      author_id: authData.user.id,
      title,
      subtitle,
      slug: normalizedSlug,
      excerpt,
      cover_url: coverUrl,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status,
      settings,
      content_json: contentJson,
      content_html: contentHtml,
      published_at:
        status === "published"
          ? publishedAt ?? new Date().toISOString()
          : null,
    };

    const result = articleId
      ? await supabase.from("articles").update(payload).eq("id", articleId)
      : await supabase.from("articles").insert(payload).select("id").single();

    if (result.error) {
      setMessage(result.error.message);
    } else {
      const newId = articleId ?? result.data?.id;
      if (status === "published" && !publishedAt) {
        setPublishedAt(new Date().toISOString());
      }
      setMessage("Draft saved.");
      if (!articleId && newId) {
        router.push(`/author/editor?id=${newId}`);
      }
    }

    setSaving(false);
  };

  const insertLink = () => {
    const url = window.prompt("Paste a link URL");
    if (url && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  const insertImage = () => {
    const url = window.prompt("Paste an image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.6fr_0.9fr]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Bold", action: () => editor?.chain().focus().toggleBold().run() },
            { label: "Italic", action: () => editor?.chain().focus().toggleItalic().run() },
            { label: "Underline", action: () => editor?.chain().focus().toggleUnderline().run() },
            { label: "Highlight", action: () => editor?.chain().focus().toggleHighlight().run() },
            { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
            { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
            { label: "Quote", action: () => editor?.chain().focus().toggleBlockquote().run() },
            { label: "List", action: () => editor?.chain().focus().toggleBulletList().run() },
            { label: "Steps", action: () => editor?.chain().focus().toggleOrderedList().run() },
            { label: "Rule", action: () => editor?.chain().focus().setHorizontalRule().run() },
            { label: "Link", action: insertLink },
            { label: "Image", action: insertImage },
            { label: "Table", action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold transition hover:border-black/40"
            >
              {item.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>

      <aside className="space-y-6">
        <div className="glass-card rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Draft Controls
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">
              Title
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  handleSlug(event.target.value);
                }}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Subtitle
              <input
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Excerpt
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Cover image URL
              <input
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Tags (comma separated)
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "draft" | "published")
                }
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
        </div>

        <div className="glass-card rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
            Article Configuration
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold">
              Accent color
              <input
                type="color"
                value={settings.accentColor ?? "#ff5f3c"}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    accentColor: event.target.value,
                  }))
                }
                className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-white/70 px-3"
              />
            </label>
            <label className="block text-sm font-semibold">
              Layout style
              <select
                value={settings.layoutStyle ?? "classic"}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    layoutStyle: event.target.value as ArticleSettings["layoutStyle"],
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              >
                <option value="classic">Classic</option>
                <option value="immersive">Immersive</option>
                <option value="annotated">Annotated</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Hero treatment
              <select
                value={settings.heroTreatment ?? "collage"}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    heroTreatment: event.target.value as ArticleSettings["heroTreatment"],
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              >
                <option value="collage">Collage</option>
                <option value="spotlight">Spotlight</option>
                <option value="paper">Paper</option>
              </select>
            </label>
            <label className="flex items-center justify-between text-sm font-semibold">
              Show table of contents
              <input
                type="checkbox"
                checked={settings.showToc ?? true}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    showToc: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-black"
              />
            </label>
            <label className="flex items-center justify-between text-sm font-semibold">
              Drop cap intro
              <input
                type="checkbox"
                checked={settings.showDropCap ?? true}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    showDropCap: event.target.checked,
                  }))
                }
                className="h-5 w-5 accent-black"
              />
            </label>
            <label className="block text-sm font-semibold">
              Pull quote
              <textarea
                value={settings.pullQuote ?? ""}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    pullQuote: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Kicker label
              <input
                value={settings.kicker ?? ""}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    kicker: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              />
            </label>
            <label className="block text-sm font-semibold">
              Reading pace
              <select
                value={settings.readingPace ?? "studious"}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    readingPace: event.target.value as ArticleSettings["readingPace"],
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-black/40"
              >
                <option value="calm">Calm</option>
                <option value="studious">Studious</option>
                <option value="chaotic">Chaotic</option>
              </select>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80"
        >
          {saving ? "Saving..." : "Save article"}
        </button>
        {message ? (
          <p className="text-xs text-black/60">{message}</p>
        ) : null}
      </aside>
    </div>
  );
}
