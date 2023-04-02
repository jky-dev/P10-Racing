CREATE FUNCTION is_member_of(user_id varchar, league_id int8) RETURNS bool AS $$
SELECT EXISTS (
  SELECT 1
  FROM league_members lm
  WHERE lm.league_id = league_id
  AND lm.user_uuid = user_id
);
$$ LANGUAGE sql SECURITY DEFINER;