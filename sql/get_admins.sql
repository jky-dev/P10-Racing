create or replace function get_admins()
returns setof varchar
language sql
security definer
set search_path = public
stable
as $$
    select user_uuid
    from admin
    where user_uuid = auth.uid()::text
$$;