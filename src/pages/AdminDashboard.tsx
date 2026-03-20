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
      <div className="min-h-screen flex items-center justify-center bg-[#081227]">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081227] text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-cyan-900/20 p-6 md:p-8 shadow-[0_40px_90px_-60px_rgba(8,18,39,0.95)] overflow-hidden">
          <div className="absolute -top-20 -right-16 w-56 h-56 bg-cyan-500/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/20 blur-3xl rounded-full" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70 mb-2">Admin Workspace</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Content Control Center</h1>
              <p className="text-sm text-slate-300 mt-2">Manage blogs and case studies from here.</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={submitBlog} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-3 shadow-[0_20px_60px_-40px_rgba(8,18,39,0.95)]">
            <h2 className="font-heading text-xl font-semibold text-white">
              {editingBlogId ? "Edit Blog" : "Create Blog"}
            </h2>
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Slug (example: my-first-blog)" value={blogSlug} onChange={(e) => setBlogSlug(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Category (optional)" value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Excerpt" value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} />
            <textarea className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 min-h-28" placeholder="Content" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files?.[0] ?? null)} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={blogPublished} onChange={(e) => setBlogPublished(e.target.checked)} />
              Published
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-900">
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
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <form onSubmit={submitCaseStudy} className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-3 shadow-[0_20px_60px_-40px_rgba(8,18,39,0.95)]">
            <h2 className="font-heading text-xl font-semibold text-white">
              {editingCaseId ? "Edit Case Study" : "Create Case Study"}
            </h2>
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Title" value={csTitle} onChange={(e) => setCsTitle(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Slug (example: retail-growth-story)" value={csSlug} onChange={(e) => setCsSlug(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Client name" value={csClientName} onChange={(e) => setCsClientName(e.target.value)} />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Industry" value={csIndustry} onChange={(e) => setCsIndustry(e.target.value)} />
            <textarea className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 min-h-20" placeholder="Challenge" value={csChallenge} onChange={(e) => setCsChallenge(e.target.value)} required />
            <textarea className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 min-h-20" placeholder="Solution" value={csSolution} onChange={(e) => setCsSolution(e.target.value)} required />
            <textarea className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 min-h-20" placeholder="Results (one per line)" value={csResults} onChange={(e) => setCsResults(e.target.value)} required />
            <input className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500" placeholder="Tags (comma separated)" value={csTags} onChange={(e) => setCsTags(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setCsImage(e.target.files?.[0] ?? null)} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={csPublished} onChange={(e) => setCsPublished(e.target.checked)} />
              Published
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-900">
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
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-heading text-lg font-semibold mb-3 text-white">Existing Blogs</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              {blogs.length === 0 ? <li className="text-slate-400">No blogs yet.</li> : null}
              {blogs.map((blog) => (
                <li key={blog.id} className="p-3 rounded-xl border border-white/10 bg-slate-950/40">
                  <p className="font-medium text-white">{blog.title}</p>
                  <p className="text-slate-400">/{blog.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditBlog(blog)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBlog(blog.id)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-white/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h3 className="font-heading text-lg font-semibold mb-3 text-white">Existing Case Studies</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              {caseStudies.length === 0 ? <li className="text-slate-400">No case studies yet.</li> : null}
              {caseStudies.map((item) => (
                <li key={item.id} className="p-3 rounded-xl border border-white/10 bg-slate-950/40">
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-slate-400">/{item.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEditCaseStudy(item)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCaseStudy(item.id)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-white/10"
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
