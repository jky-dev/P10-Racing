create or replace function get_leagues_for_authenticated_user()
returns setof int8
language sql
security definer
set search_path = public
stable
as $$
    select league_id
    from league_members
    where user_uuid = auth.uid()::text
$$;