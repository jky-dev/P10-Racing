create or replace function join_league(i_code varchar)
returns void
language sql
security definer
set search_path = public
volatile
as $$
with rows as (SELECT id FROM leagues where invite_code = i_code),

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
select 5, id, auth.
with rows as (SELECT id FROM leagues where invite_code = i_code),

ins1 as (INSERT into league_members (league_id, user_uuid, index)
SELECT id, auth.uid()::text, CONCAT(id,'_',auth.uid()::text) from rows),

row1 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 1, id, auth.uid()::text, CONCAT(1,'_',id,'_',auth.uid()::text), 2023 from rows),

row2 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 2, id, auth.uid()::text, CONCAT(2,'_',id,'_',auth.uid()::text), 2023 from rows),

row3 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 3, id, auth.uid()::text, CONCAT(3,'_',id,'_',auth.uid()::text), 2023 from rows),

row4 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 4, id, auth.uid()::text, CONCAT(4,'_',id,'_',auth.uid()::text), 2023 from rows),

row5 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 5, id, auth.uid()::text, CONCAT(5,'_',id,'_',auth.uid()::text), 2023 from rows),

row6 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 6, id, auth.uid()::text, CONCAT(6,'_',id,'_',auth.uid()::text), 2023 from rows),

row7 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 7, id, auth.uid()::text, CONCAT(7,'_',id,'_',auth.uid()::text), 2023 from rows),

row8 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 8, id, auth.uid()::text, CONCAT(8,'_',id,'_',auth.uid()::text), 2023 from rows),

row9 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 9, id, auth.uid()::text, CONCAT(9,'_',id,'_',auth.uid()::text), 2023 from rows),

row10 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 10, id, auth.uid()::text, CONCAT(10,'_',id,'_',auth.uid()::text), 2023 from rows),

row11 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 11, id, auth.uid()::text, CONCAT(11,'_',id,'_',auth.uid()::text), 2023 from rows),

row12 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 12, id, auth.uid()::text, CONCAT(12,'_',id,'_',auth.uid()::text), 2023 from rows),

row13 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 13, id, auth.uid()::text, CONCAT(13,'_',id,'_',auth.uid()::text), 2023 from rows),

row14 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 14, id, auth.uid()::text, CONCAT(14,'_',id,'_',auth.uid()::text), 2023 from rows),

row15 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 15, id, auth.uid()::text, CONCAT(15,'_',id,'_',auth.uid()::text), 2023 from rows),

row17 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 17, id, auth.uid()::text, CONCAT(17,'_',id,'_',auth.uid()::text), 2023 from rows),

row18 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 18, id, auth.uid()::text, CONCAT(18,'_',id,'_',auth.uid()::text), 2023 from rows),

row19 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 19, id, auth.uid()::text, CONCAT(19,'_',id,'_',auth.uid()::text), 2023 from rows),

row20 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 20, id, auth.uid()::text, CONCAT(20,'_',id,'_',auth.uid()::text), 2023 from rows),

row21 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 21, id, auth.uid()::text, CONCAT(21,'_',id,'_',auth.uid()::text), 2023 from rows),

row22 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 22, id, auth.uid()::text, CONCAT(22,'_',id,'_',auth.uid()::text), 2023 from rows),

row23 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 23, id, auth.uid()::text, CONCAT(23,'_',id,'_',auth.uid()::text), 2023 from rows),

row299 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 299, id, auth.uid()::text, CONCAT(299,'_',id,'_',auth.uid()::text), 2024 from rows),

row300 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 300, id, auth.uid()::text, CONCAT(300,'_',id,'_',auth.uid()::text), 2024 from rows),

row301 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 301, id, auth.uid()::text, CONCAT(301,'_',id,'_',auth.uid()::text), 2024 from rows),

row302 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 302, id, auth.uid()::text, CONCAT(302,'_',id,'_',auth.uid()::text), 2024 from rows),

row303 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 303, id, auth.uid()::text, CONCAT(303,'_',id,'_',auth.uid()::text), 2024 from rows),

row304 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 304, id, auth.uid()::text, CONCAT(304,'_',id,'_',auth.uid()::text), 2024 from rows),

row305 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 305, id, auth.uid()::text, CONCAT(305,'_',id,'_',auth.uid()::text), 2024 from rows),

row306 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 306, id, auth.uid()::text, CONCAT(306,'_',id,'_',auth.uid()::text), 2024 from rows),

row307 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 307, id, auth.uid()::text, CONCAT(307,'_',id,'_',auth.uid()::text), 2024 from rows),

row308 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 308, id, auth.uid()::text, CONCAT(308,'_',id,'_',auth.uid()::text), 2024 from rows),

row309 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 309, id, auth.uid()::text, CONCAT(309,'_',id,'_',auth.uid()::text), 2024 from rows),

row310 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 310, id, auth.uid()::text, CONCAT(310,'_',id,'_',auth.uid()::text), 2024 from rows),

row311 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 311, id, auth.uid()::text, CONCAT(311,'_',id,'_',auth.uid()::text), 2024 from rows),

row312 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 312, id, auth.uid()::text, CONCAT(312,'_',id,'_',auth.uid()::text), 2024 from rows),

row313 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 313, id, auth.uid()::text, CONCAT(313,'_',id,'_',auth.uid()::text), 2024 from rows),

row314 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 314, id, auth.uid()::text, CONCAT(314,'_',id,'_',auth.uid()::text), 2024 from rows),

row315 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 315, id, auth.uid()::text, CONCAT(315,'_',id,'_',auth.uid()::text), 2024 from rows),

row316 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 316, id, auth.uid()::text, CONCAT(316,'_',id,'_',auth.uid()::text), 2024 from rows),

row317 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 317, id, auth.uid()::text, CONCAT(317,'_',id,'_',auth.uid()::text), 2024 from rows),

row318 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 318, id, auth.uid()::text, CONCAT(318,'_',id,'_',auth.uid()::text), 2024 from rows),

row319 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 319, id, auth.uid()::text, CONCAT(319,'_',id,'_',auth.uid()::text), 2024 from rows),

row320 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 320, id, auth.uid()::text, CONCAT(320,'_',id,'_',auth.uid()::text), 2024 from rows),

row321 as (insert into league_results (race_id, league_id, user_uuid, index, year)
select 321, id, auth.uid()::text, CONCAT(321,'_',id,'_',auth.uid()::text), 2024 from rows)

insert into league_results (race_id, league_id, user_uuid, index, year)
select 322, id, auth.uid()::text, CONCAT(322,'_',id,'_',auth.uid()::text), 2024 from rows

$$;