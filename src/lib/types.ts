export type ArticleStatus = "draft" | "published";

export type ArticleSettings = {
  accentColor?: string;
  layoutStyle?: "classic" | "immersive" | "annotated";
  showToc?: boolean;
  showDropCap?: boolean;
  heroTreatment?: "collage" | "spotlight" | "paper";
  pullQuote?: string;
  kicker?: string;
  readingPace?: "calm" | "studious" | "chaotic";
};

export type ArticleRecord = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  cover_url: string | null;
  content_html: string | null;
  status: ArticleStatus;
  published_at: string | null;
  tags: string[] | null;
  settings: ArticleSettings | null;
  profiles?: {
    display_name: string | null;
  } | null;
};
