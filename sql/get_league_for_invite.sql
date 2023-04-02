create or replace function get_league_for_invite_code(invite varchar)
returns table (name varchar, id int8)
language sql
security definer
set search_path = public
stable
as $$
    select name, id from leagues where is_deleted = false and invite_code = invite
$$;