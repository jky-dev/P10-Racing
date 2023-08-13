
with rows as (INSERT INTO leagues (name, invite_code, created_by_uuid, is_deleted) values
(l_name, i_code, auth.uid()::text, false)
RETURNING id),

ins1 as (INSERT into league_members (league_id, user_uuid, index)
SELECT id, auth.uid()::text, CONCAT(id,'_',auth.uid()::text) from rows),

row1 as (insert into league_results (race_id, league_id, user_uuid, index)
select 1, id, auth.uid()::text, CONCAT(1,'_',id,'_',auth.uid()::text) from rows),

row2 as (insert into league_results (race_id, league_id, user_uuid, index)
select 2, id, auth.uid()::text, CONCAT(2,'_',id,'_',auth.uid()::text) from rows),

row3 as (insert into league_results (race_id, league_id, user_uuid, index)
select 3, id, auth.uid()::text, CONCAT(3,'_',id,'_',auth.uid()::text) from rows),

row4 as (insert into league_results (race_id, league_id, user_uuid, index)
select 4, id, auth.uid()::text, CONCAT(4,'_',id,'_',auth.uid()::text) from rows),

row5 as (insert into league_results (race_id, league_id, user_uuid, index)
select 5, id, auth.uid()::text, CONCAT(5,'_',id,'_',auth.uid()::text) from rows),

row6 as (insert into league_results (race_id, league_id, user_uuid, index)
select 6, id, auth.uid()::text, CONCAT(6,'_',id,'_',auth.uid()::text) from rows),

row7 as (insert into league_results (race_id, league_id, user_uuid, index)
select 7, id, auth.uid()::text, CONCAT(7,'_',id,'_',auth.uid()::text) from rows),

row8 as (insert into league_results (race_id, league_id, user_uuid, index)
select 8, id, auth.uid()::text, CONCAT(8,'_',id,'_',auth.uid()::text) from rows),

row9 as (insert into league_results (race_id, league_id, user_uuid, index)
select 9, id, auth.uid()::text, CONCAT(9,'_',id,'_',auth.uid()::text) from rows),

row10 as (insert into league_results (race_id, league_id, user_uuid, index)
select 10, id, auth.uid()::text, CONCAT(10,'_',id,'_',auth.uid()::text) from rows),

row11 as (insert into league_results (race_id, league_id, user_uuid, index)
select 11, id, auth.uid()::text, CONCAT(11,'_',id,'_',auth.uid()::text) from rows),

row12 as (insert into league_results (race_id, league_id, user_uuid, index)
select 12, id, auth.uid()::text, CONCAT(12,'_',id,'_',auth.uid()::text) from rows),

row13 as (insert into league_results (race_id, league_id, user_uuid, index)
select 13, id, auth.uid()::text, CONCAT(13,'_',id,'_',auth.uid()::text) from rows),

row14 as (insert into league_results (race_id, league_id, user_uuid, index)
select 14, id, auth.uid()::text, CONCAT(14,'_',id,'_',auth.uid()::text) from rows),

row15 as (insert into league_results (race_id, league_id, user_uuid, index)
select 15, id, auth.uid()::text, CONCAT(15,'_',id,'_',auth.uid()::text) from rows),

row17 as (insert into league_results (race_id, league_id, user_uuid, index)
select 17, id, auth.uid()::text, CONCAT(17,'_',id,'_',auth.uid()::text) from rows),

row18 as (insert into league_results (race_id, league_id, user_uuid, index)
select 18, id, auth.uid()::text, CONCAT(18,'_',id,'_',auth.uid()::text) from rows),

row19 as (insert into league_results (race_id, league_id, user_uuid, index)
select 19, id, auth.uid()::text, CONCAT(19,'_',id,'_',auth.uid()::text) from rows),

row20 as (insert into league_results (race_id, league_id, user_uuid, index)
select 20, id, auth.uid()::text, CONCAT(20,'_',id,'_',auth.uid()::text) from rows),

row21 as (insert into league_results (race_id, league_id, user_uuid, index)
select 21, id, auth.uid()::text, CONCAT(21,'_',id,'_',auth.uid()::text) from rows),

row22 as (insert into league_results (race_id, league_id, user_uuid, index)
select 22, id, auth.uid()::text, CONCAT(22,'_',id,'_',auth.uid()::text) from rows)

insert into league_results (race_id, league_id, user_uuid, index)
select 23, id, auth.uid()::text, CONCAT(23,'_',id,'_',auth.uid()::text) from rows


