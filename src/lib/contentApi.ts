import { supabase } from "@/lib/supabaseClient";

const STORAGE_BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? "content").trim();

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string | null;
  image_url: string | null;
};

export type CaseStudyRecord = {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  industry: string | null;
  challenge: string;
  solution: string;
  results: string;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
  created_at: string | null;
  image_url: string | null;
};

type BlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
};

type CaseStudyInput = {
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  tags: string[];
  published: boolean;
};

const toStringOrEmpty = (value: string | null | undefined) => value ?? "";

const uploadImage = async (folder: "blogs" | "case-studies", id: string, file: File) => {
  const safeName = file.name.replace(/\s+/g, "-");
  const path = `${folder}/${id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

export const contentApi = {
  async listPublicBlogs() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as BlogRecord[];
  },

  async listPublicCaseStudies() {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CaseStudyRecord[];
  },

  async listAdminBlogs() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as BlogRecord[];
  },

  async listAdminCaseStudies() {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as CaseStudyRecord[];
  },

  async createBlog(input: BlogInput, image?: File | null) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: toStringOrEmpty(input.excerpt),
        content: input.content,
        category: toStringOrEmpty(input.category),
        published: input.published,
        published_at: input.published ? now : null,
      })
      .select("*")
      .single();
    if (error) throw error;
    let record = data as BlogRecord;

    if (image) {
      const imageUrl = await uploadImage("blogs", record.id, image);
      const { data: updated, error: updateError } = await supabase
        .from("blog_posts")
        .update({ image_url: imageUrl })
        .eq("id", record.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      record = updated as BlogRecord;
    }

    return record;
  },

  async updateBlog(id: string, input: BlogInput, image?: File | null) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: input.title,
        slug: input.slug,
        excerpt: toStringOrEmpty(input.excerpt),
        content: input.content,
        category: toStringOrEmpty(input.category),
        published: input.published,
        published_at: input.published ? now : null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    let record = data as BlogRecord;

    if (image) {
      const imageUrl = await uploadImage("blogs", record.id, image);
      const { data: updated, error: updateError } = await supabase
        .from("blog_posts")
        .update({ image_url: imageUrl })
        .eq("id", record.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      record = updated as BlogRecord;
    }

    return record;
  },

  async deleteBlog(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
  },

  async createCaseStudy(input: CaseStudyInput, image?: File | null) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("case_studies")
      .insert({
        title: input.title,
        slug: input.slug,
        client_name: toStringOrEmpty(input.client_name),
        industry: toStringOrEmpty(input.industry),
        challenge: input.challenge,
        solution: input.solution,
        results: input.results,
        tags: input.tags.length ? input.tags : null,
        published: input.published,
        published_at: input.published ? now : null,
      })
      .select("*")
      .single();
    if (error) throw error;
    let record = data as CaseStudyRecord;

    if (image) {
      const imageUrl = await uploadImage("case-studies", record.id, image);
      const { data: updated, error: updateError } = await supabase
        .from("case_studies")
        .update({ image_url: imageUrl })
        .eq("id", record.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      record = updated as CaseStudyRecord;
    }

    return record;
  },

  async updateCaseStudy(id: string, input: CaseStudyInput, image?: File | null) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("case_studies")
      .update({
        title: input.title,
        slug: input.slug,
        client_name: toStringOrEmpty(input.client_name),
        industry: toStringOrEmpty(input.industry),
        challenge: input.challenge,
        solution: input.solution,
        results: input.results,
        tags: input.tags.length ? input.tags : null,
        published: input.published,
        published_at: input.published ? now : null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    let record = data as CaseStudyRecord;

    if (image) {
      const imageUrl = await uploadImage("case-studies", record.id, image);
      const { data: updated, error: updateError } = await supabase
        .from("case_studies")
        .update({ image_url: imageUrl })
        .eq("id", record.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      record = updated as CaseStudyRecord;
    }

    return record;
  },

  async deleteCaseStudy(id: string) {
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) throw error;
  },
};

