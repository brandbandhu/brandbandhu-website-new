# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase setup (replaces SQL backends)

This project now uses Supabase for blogs and case studies + admin dashboard.

1) Create a Supabase project.
2) Add these env vars in `.env.local`:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_STORAGE_BUCKET=content
```

3) Create tables + policies in Supabase SQL editor:

```sql
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  category text,
  published boolean not null default false,
  published_at timestamptz,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text,
  industry text,
  challenge text not null,
  solution text not null,
  results text not null,
  tags text[],
  published boolean not null default false,
  published_at timestamptz,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
alter table public.case_studies enable row level security;
alter table public.profiles enable row level security;

create policy "public read published blogs"
  on public.blog_posts for select
  using (published = true);

create policy "public read published case studies"
  on public.case_studies for select
  using (published = true);

create policy "admin manage blogs"
  on public.blog_posts for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "admin manage case studies"
  on public.case_studies for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "profiles read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id);
```

4) Create a public storage bucket named `content` and add storage policies:

```sql
create policy "public read content"
  on storage.objects for select
  using (bucket_id = 'content');

create policy "admin write content"
  on storage.objects for insert
  with check (
    bucket_id = 'content'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "admin update content"
  on storage.objects for update
  using (
    bucket_id = 'content'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
```

5) Create an admin user in Supabase Auth and then mark them as admin:

```sql
insert into public.profiles (id, is_admin)
values ('AUTH_USER_UUID_HERE', true)
on conflict (id) do update set is_admin = excluded.is_admin;
```

6) Start the app:

```
npm i
npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
