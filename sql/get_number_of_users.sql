create or replace function get_number_of_users()
returns setof int8
language sql
security definer
set search_path = public
stable
as $$
    select count(*) from users
$$;