-- profiles（auth.users と紐付け）
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  name text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "select own profile" on profiles for
select
  using (auth.uid () = id);

create policy "insert own profile" on profiles for insert
with
  check (auth.uid () = id);

create policy "update own profile" on profiles
for update
  using (auth.uid () = id);

-- events（24時間イベント）
create table if not exists events (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  generation int not null,
  created_at timestamptz default now()
);

-- submissions（投稿）
create table if not exists submissions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  event_id uuid not null references events (id) on delete cascade,
  photo_url text not null,
  created_at timestamptz default now(),
  unique (user_id, event_id)
);

alter table submissions enable row level security;

create policy "insert own submission" on submissions for insert
with
  check (auth.uid () = user_id);

create policy "select submissions public" on submissions for
select
  using (true);

-- フィード閲覧はサーバー側で制御
-- Web Push 購読
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references profiles (id) on delete cascade,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

alter table push_subscriptions enable row level security;

create policy "insert own push sub" on push_subscriptions for insert
with
  check (auth.uid () = user_id);

-- 追加: メディア対応のためのカラム
alter table if exists submissions
  add column if not exists media_url text;

alter table if exists submissions
  add column if not exists media_type text;

-- 既存の photo_url カラムを残しつつ media_url を優先して使う設計です。