create or replace function get_number_of_leagues()
returns setof int8
language sql
security definer
set search_path = public
stable
as $$
    SELECT COUNT(*) FROM leagues where leagues.is_deleted is not true
$$;