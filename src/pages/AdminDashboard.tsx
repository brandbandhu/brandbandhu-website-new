import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contentApi, type BlogRecord, type CaseStudyRecord } from "@/lib/contentApi";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudyRecord[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogPublished, setBlogPublished] = useState(true);
  const [blogImage, setBlogImage] = useState<File | null>(null);

  const [csTitle, setCsTitle] = useState("");
  const [csSlug, setCsSlug] = useState("");
  const [csClientName, setCsClientName] = useState("");
  const [csIndustry, setCsIndustry] = useState("");
  const [csChallenge, setCsChallenge] = useState("");
  const [csSolution, setCsSolution] = useState("");
  const [csResults, setCsResults] = useState("");
  const [csTags, setCsTags] = useState("");
  const [csPublished, setCsPublished] = useState(true);
  const [csImage, setCsImage] = useState<File | null>(null);

  const loadData = async () => {
    const [blogRes, csRes] = await Promise.all([
      contentApi.listAdminBlogs(),
      contentApi.listAdminCaseStudies(),
    ]);
    setBlogs(blogRes);
    setCaseStudies(csRes);
  };

  const requireAdmin = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session?.user) throw new Error("Not signed in");
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();
    if (error) throw error;
    if (!profile?.is_admin) throw new Error("Access denied");
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await requireAdmin();
        await loadData();
      } catch {
        await supabase.auth.signOut();
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [navigate]);

  const submitBlog = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      const payload = {
        title: blogTitle,
        slug: blogSlug,
        excerpt: blogExcerpt,
        content: blogContent,
        category: blogCategory,
        published: blogPublished,
      };

      if (editingBlogId) {
        await contentApi.updateBlog(editingBlogId, payload, blogImage);
        setMessage("Blog updated successfully.");
      } else {
        await contentApi.createBlog(payload, blogImage);
        setMessage("Blog created successfully.");
      }

      setBlogTitle("");
      setBlogSlug("");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogCategory("");
      setBlogImage(null);
      setEditingBlogId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blog");
    }
  };

  const submitCaseStudy = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      const payload = {
        title: csTitle,
        slug: csSlug,
        client_name: csClientName,
        industry: csIndustry,
        challenge: csChallenge,
        solution: csSolution,
        results: csResults,
        tags: csTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        published: csPublished,
      };

      if (editingCaseId) {
        await contentApi.updateCaseStudy(editingCaseId, payload, csImage);
        setMessage("Case study updated successfully.");
      } else {
        await contentApi.createCaseStudy(payload, csImage);
        setMessage("Case study created successfully.");
      }

      setCsTitle("");
      setCsSlug("");
      setCsClientName("");
      setCsIndustry("");
      setCsChallenge("");
      setCsSolution("");
      setCsResults("");
      setCsTags("");
      setCsImage(null);
      setEditingCaseId(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create case study");
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const onEditBlog = (blog: BlogRecord) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title ?? "");
    setBlogSlug(blog.slug ?? "");
    setBlogExcerpt(blog.excerpt ?? "");
    setBlogContent(blog.content ?? "");
    setBlogCategory(blog.category ?? "");
    setBlogPublished(Boolean(blog.published));
    setBlogImage(null);
  };

  const onEditCaseStudy = (item: CaseStudyRecord) => {
    setEditingCaseId(item.id);
    setCsTitle(item.title ?? "");
    setCsSlug(item.slug ?? "");
    setCsClientName(item.client_name ?? "");
    setCsIndustry(item.industry ?? "");
    setCsChallenge(item.challenge ?? "");
    setCsSolution(item.solution ?? "");
    setCsResults(item.results ?? "");
    setCsTags((item.tags ?? []).join(", "));
    setCsPublished(Boolean(item.published));
    setCsImage(null);
  };

  const onDeleteBlog = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await contentApi.deleteBlog(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  const onDeleteCaseStudy = async (id: string) => {
    if (!window.confirm("Delete this case study?")) return;
    try {
      await contentApi.deleteCaseStudy(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete case study");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage blogs and case studies from here.</p>
          </div>
          <button onClick={onLogout} className="rounded-md border border-border px-4 py-2 font-medium hover:bg-muted">
            Logout
          </button>
        </div>

        {message ? <p className="text-green-600">{message}</p> : null}
        {error ? <p className="text-destructive">{error}</p> : null}

        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={submitBlog} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-heading text-xl font-semibold">
              {editingBlogId ? "Edit Blog" : "Create Blog"}
            </h2>
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Slug (example: my-first-blog)" value={blogSlug} onChange={(e) => setBlogSlug(e.target.value)} required />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Category (optional)" value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Excerpt" value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} />
            <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background min-h-28" placeholder="Content" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files?.[0] ?? null)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={blogPublished} onChange={(e) => setBlogPublished(e.target.checked)} />
              Published
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 font-semibold">
                {editingBlogId ? "Update Blog" : "Save Blog"}
              </button>
              {editingBlogId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlogId(null);
                    setBlogTitle("");
                    setBlogSlug("");
                    setBlogExcerpt("");
                    setBlogContent("");
                    setBlogCategory("");
                    setBlogPublished(true);
                    setBlogImage(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <form onSubmit={submitCaseStudy} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-heading text-xl font-semibold">
              {editingCaseId ? "Edit Case Study" : "Create Case Study"}
            </h2>
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Title" value={csTitle} onChange={(e) => setCsTitle(e.target.value)} required />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Slug (example: retail-growth-story)" value={csSlug} onChange={(e) => setCsSlug(e.target.value)} required />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Client name" value={csClientName} onChange={(e) => setCsClientName(e.target.value)} />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Industry" value={csIndustry} onChange={(e) => setCsIndustry(e.target.value)} />
            <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background min-h-20" placeholder="Challenge" value={csChallenge} onChange={(e) => setCsChallenge(e.target.value)} required />
            <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background min-h-20" placeholder="Solution" value={csSolution} onChange={(e) => setCsSolution(e.target.value)} required />
            <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background min-h-20" placeholder="Results (one per line)" value={csResults} onChange={(e) => setCsResults(e.target.value)} required />
            <input className="w-full rounded-md border border-border px-3 py-2 bg-background" placeholder="Tags (comma separated)" value={csTags} onChange={(e) => setCsTags(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setCsImage(e.target.files?.[0] ?? null)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={csPublished} onChange={(e) => setCsPublished(e.target.checked)} />
              Published
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-secondary text-secondary-foreground px-4 py-2 font-semibold">
                {editingCaseId ? "Update Case Study" : "Save Case Study"}
              </button>
              {editingCaseId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCaseId(null);
                    setCsTitle("");
                    setCsSlug("");
                    setCsClientName("");
                    setCsIndustry("");
                    setCsChallenge("");
                    setCsSolution("");
                    setCsResults("");
                    setCsTags("");
                    setCsPublished(true);
                    setCsImage(null);
                  }}
                  className="rounded-md border border-border px-4 py-2 font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold mb-3">Existing Blogs</h3>
            <ul className="space-y-2 text-sm">
              {blogs.length === 0 ? <li className="text-muted-foreground">No blogs yet.</li> : null}
              {blogs.map((blog) => (
                <li key={blog.id} className="p-2 rounded border border-border/70">
                  <p className="font-medium">{blog.title}</p>
                  <p className="text-muted-foreground">/{blog.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditBlog(blog)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBlog(blog.id)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-destructive hover:bg-muted"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-heading text-lg font-semibold mb-3">Existing Case Studies</h3>
            <ul className="space-y-2 text-sm">
              {caseStudies.length === 0 ? <li className="text-muted-foreground">No case studies yet.</li> : null}
              {caseStudies.map((item) => (
                <li key={item.id} className="p-2 rounded border border-border/70">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">/{item.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCaseStudy(item)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCaseStudy(item.id)}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-destructive hover:bg-muted"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
