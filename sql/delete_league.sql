create or replace function delete_league(league_id int8)
returns void
language sql
security definer
set search_path = public
volatile
as $$
    UPDATE leagues
    SET is_deleted = true 
    WHERE created_by_uuid = auth.uid()::text AND league_id = id
$$;