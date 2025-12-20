-- pgcrypto の gen_random_uuid() を利用
create extension if not exists "pgcrypto";

-- comments作成
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.submissions(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS 有効化
alter table public.comments enable row level security;

-- 認証済みロールへ最小権限付与
grant select, insert, update, delete on public.comments to authenticated;

-- ポリシー: 誰でも閲覧可能
create policy "select anyone comment rows" on public.comments
  for select
  using (true);

-- ポリシー: 更新はコメントした本人だけ許可
create policy "update only by writer" on public.comments
  for update
  with check (user_id = auth.uid());

-- ポリシー: 挿入は自分が user_id である場合のみ許可（偽装禁止）
create policy "insert only as yourself" on public.comments
  for insert
  with check (user_id = auth.uid());

-- ポリシー: 削除はコメントした本人だけ許可
create policy "delete only by writer" on public.comments
  for delete
  using (user_id = auth.uid());