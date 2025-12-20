create policy "insert user own avatar" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'avatars'
    and split_part(name, '.', 1) = (
      select
        auth.uid ()
    )::text
  );

create policy "update user own avatar" on storage.objects
for update
  to authenticated using (
    bucket_id = 'avatars'
    and split_part(name, '.', 1) = (
      select
        auth.uid ()
    )::text
  )
with
  check (
    bucket_id = 'avatars'
    and split_part(name, '.', 1) = (
      select
        auth.uid ()
    )::text
  );