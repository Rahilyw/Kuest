-- ─── 005_align_badge_unlock_logic.sql ────────────────────────────────────────
-- Replaces check_badges_on_xp_update() so DB trigger logic matches seed.sql
-- badge names and unlock rules exactly.
--
-- Badge rules (seed.sql is source of truth for names):
--   First Quest        — 1+ approved completions
--   Getting Warmed Up  — 5+ approved completions
--   Local Hero         — 10+ approved completions
--   Explorer           — 1+ approved completion in EACH of: fitness, social,
--                        food, community, nature
--   Fitness Fanatic    — 3+ approved fitness completions
--   Social Butterfly   — 3+ approved social completions
--   Foodie             — 3+ approved food completions
--   Community Champion — 3+ approved community completions
--   Nature Lover       — 3+ approved nature completions
--   Early Bird         — 1+ approved completion where local hour (America/Vancouver) < 8
--   Weekend Warrior    — 3+ approved completions on Sat/Sun within the same Sat–Sun pair
--   Top 10             — user in top 10 of leaderboard view by weekly_xp at time of update
--   Season Veteran     — requires seasons table; not yet implemented
-- ─────────────────────────────────────────────────────────────────────────────

drop trigger if exists on_xp_update on profiles;

create or replace function check_badges_on_xp_update()
returns trigger language plpgsql security definer as $$
declare
  v_total           integer;
  v_fitness         integer;
  v_social          integer;
  v_food            integer;
  v_community       integer;
  v_nature          integer;
  v_explorer        boolean;
  v_early_bird      boolean;
  v_weekend_warrior boolean;
  v_top10           boolean;
  badge_rec         record;
  condition_met     boolean;
begin
  -- ── Total approved completions ──────────────────────────────────────────
  select count(*) into v_total
  from completions
  where user_id = new.id and status = 'approved';

  -- ── Per-category counts (single scan) ──────────────────────────────────
  select
    count(*) filter (where q.category::text = 'fitness'),
    count(*) filter (where q.category::text = 'social'),
    count(*) filter (where q.category::text = 'food'),
    count(*) filter (where q.category::text = 'community'),
    count(*) filter (where q.category::text = 'nature')
  into v_fitness, v_social, v_food, v_community, v_nature
  from completions c
  join quests q on q.id = c.quest_id
  where c.user_id = new.id and c.status = 'approved';

  -- ── Explorer: at least 1 in each of the 5 core categories ─────────────
  v_explorer := (
    v_fitness >= 1 and v_social >= 1 and v_food >= 1
    and v_community >= 1 and v_nature >= 1
  );

  -- ── Early Bird: 1+ completion before 8am Victoria time ─────────────────
  select exists (
    select 1 from completions
    where user_id = new.id
      and status = 'approved'
      and extract(hour from completed_at at time zone 'America/Vancouver') < 8
  ) into v_early_bird;

  -- ── Weekend Warrior: 3+ completions on Sat/Sun of the same weekend ─────
  -- Normalise Sunday to the previous Saturday so both days share one group key.
  select exists (
    select 1
    from (
      select
        date(completed_at at time zone 'America/Vancouver')
          - (case
               when extract(dow from completed_at at time zone 'America/Vancouver') = 0
               then 1 else 0
             end)::int as weekend_sat
      from completions
      where user_id = new.id
        and status = 'approved'
        and extract(dow from completed_at at time zone 'America/Vancouver') in (0, 6)
    ) sub
    group by weekend_sat
    having count(*) >= 3
  ) into v_weekend_warrior;

  -- ── Top 10: user currently in top 10 of the weekly leaderboard ─────────
  select exists (
    select 1
    from (select user_id from leaderboard order by weekly_xp desc limit 10) top10
    where top10.user_id = new.id
  ) into v_top10;

  -- ── Award any unearned badges whose condition is now met ────────────────
  for badge_rec in
    select b.id, b.name
    from badges b
    left join user_badges ub on ub.badge_id = b.id and ub.user_id = new.id
    where ub.badge_id is null
  loop
    condition_met := case badge_rec.name
      when 'First Quest'        then v_total >= 1
      when 'Getting Warmed Up'  then v_total >= 5
      when 'Local Hero'         then v_total >= 10
      when 'Explorer'           then v_explorer
      when 'Fitness Fanatic'    then v_fitness >= 3
      when 'Social Butterfly'   then v_social >= 3
      when 'Foodie'             then v_food >= 3
      when 'Community Champion' then v_community >= 3
      when 'Nature Lover'       then v_nature >= 3
      when 'Early Bird'         then v_early_bird
      when 'Weekend Warrior'    then v_weekend_warrior
      when 'Top 10'             then v_top10
      -- Season Veteran: requires seasons table; not yet implemented
      else false
    end;

    if condition_met then
      insert into user_badges (user_id, badge_id)
      values (new.id, badge_rec.id)
      on conflict (user_id, badge_id) do nothing;
    end if;
  end loop;

  return new;
end;
$$;

create trigger on_xp_update
  after update of total_xp on profiles
  for each row execute procedure check_badges_on_xp_update();
