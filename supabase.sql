5622-- profiles（auth.users と紐付け）
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

-- storage
create policy "allow anyone insert storage" on storage.objects for insert
with
  check (true);

create policy "allow anyone select storage" on storage.objects for
select
  using (true);

-- follows table
-- pgcrypto の gen_random_uuid() を利用
create extension if not exists "pgcrypto";

-- follows テーブル作成
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follow_id uuid not null references auth.users(id) on delete cascade,
  follower_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint follows_unique_pair unique (follow_id, follower_id)
);

-- RLS 有効化
alter table public.follows enable row level security;

-- 認証済みロールへ最小権限付与
grant select, insert, delete on public.follows to authenticated;

-- ポリシー: 自分が関係する行のみ参照可能（フォロー元またはフォロー先が自分）
create policy "Select own follow rows" on public.follows
  for select
  using (follower_id = auth.uid() OR follow_id = auth.uid());

-- ポリシー: 挿入は自分が follower_id である場合のみ許可（偽装禁止）
create policy "Insert only as yourself" on public.follows
  for insert
  with check (follower_id = auth.uid());

-- ポリシー: 削除はフォローした本人（follower）だけ許可
create policy "Delete only by follower" on public.follows
  for delete
  using (follower_id = auth.uid());
