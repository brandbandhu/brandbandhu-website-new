import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import { contentApi, type BlogRecord } from "@/lib/contentApi";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

type BlogPost = {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category?: string;
  dateLabel?: string;
  readTimeLabel?: string;
  publishedAt?: string | null;
  createdAt?: string | null;
  imageUrl?: string | null;
};

const legacyPosts: BlogPost[] = [
  // Legacy blog placeholders removed.
];

const getReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const getDateLabel = (publishedAt?: string | null, createdAt?: string | null) => {
  const value = publishedAt ?? createdAt;
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>(legacyPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setError("");
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }
        const data = await contentApi.listPublicBlogs();
        const apiPosts = data.map((post: BlogRecord) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          category: post.category ?? undefined,
          publishedAt: post.published_at,
          createdAt: post.created_at,
          imageUrl: post.image_url,
        }));
        const merged = [...apiPosts];
        const seen = new Set(apiPosts.map((post) => post.slug || post.title));

        for (const legacy of legacyPosts) {
          const key = legacy.slug || legacy.title;
          if (!seen.has(key)) merged.push(legacy);
        }

        setPosts(merged);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blogs");
        setPosts(legacyPosts);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" />
        </div>
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs font-heading font-semibold uppercase tracking-wider mb-6 border border-secondary/20">
            Blog
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
            Marketing <span className="text-gradient">Insights & Tips</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/70">
            Stay ahead with the latest digital marketing strategies, tips, and industry insights.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          {loading ? <p className="text-center text-muted-foreground mb-8">Loading blogs...</p> : null}
          {error ? <p className="text-center text-destructive mb-8">{error}</p> : null}
          {!loading && !error && posts.length === 0 ? (
            <p className="text-center text-muted-foreground mb-8">No published blogs yet.</p>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.05}>
                <motion.article
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl bg-card shadow-card border border-border/50 overflow-hidden h-full flex flex-col cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="h-48 w-full object-cover" />
                  ) : null}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-heading font-semibold w-fit mb-3">
                      {post.category || "Blog"}
                    </span>
                    <h2 className="font-heading font-bold text-lg text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTimeLabel || getReadTime(post.content)}
                      </span>
                      <span>{post.dateLabel || getDateLabel(post.publishedAt, post.createdAt)}</span>
                    </div>
                  </div>
                </motion.article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {selectedPost ? (
        <div
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 md:p-8 mt-16"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-heading font-semibold mb-3">
                  {selectedPost.category || "Blog"}
                </span>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
                  {selectedPost.title}
                </h2>
              </div>
              <button
                type="button"
                className="rounded-md border border-border p-2 hover:bg-muted"
                onClick={() => setSelectedPost(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {selectedPost.imageUrl ? (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-xl mb-5"
              />
            ) : null}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
              <span className="flex items-center gap-1">
                <Clock size={14} /> {selectedPost.readTimeLabel || getReadTime(selectedPost.content)}
              </span>
              <span>{selectedPost.dateLabel || getDateLabel(selectedPost.publishedAt, selectedPost.createdAt)}</span>
            </div>

            <p className="text-base md:text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {selectedPost.content || selectedPost.excerpt}
            </p>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default Blog;
