-- ─── BADGE UNLOCK TRIGGER ────────────────────────────────────────────────────
-- Fallback/redundancy alongside the award-xp edge function.
-- Fires after total_xp is updated on profiles and awards any newly-met badges.

create or replace function check_badges_on_xp_update()
returns trigger language plpgsql security definer as $$
declare
  total_completions  integer;
  outdoor_completions integer;
  food_completions   integer;
  culture_completions integer;
  badge_record       record;
begin
  select count(*) into total_completions
  from completions
  where user_id = new.id and status = 'approved';

  select count(*) into outdoor_completions
  from completions c
  join quests q on q.id = c.quest_id
  where c.user_id = new.id and c.status = 'approved' and q.category::text = 'outdoor';

  select count(*) into food_completions
  from completions c
  join quests q on q.id = c.quest_id
  where c.user_id = new.id and c.status = 'approved' and q.category::text = 'food';

  select count(*) into culture_completions
  from completions c
  join quests q on q.id = c.quest_id
  where c.user_id = new.id and c.status = 'approved' and q.category::text = 'culture';

  for badge_record in
    select b.id, b.name
    from badges b
    left join user_badges ub on ub.badge_id = b.id and ub.user_id = new.id
    where ub.badge_id is null
  loop
    if (
      (badge_record.name = 'First Quest'     and total_completions >= 1)   or
      (badge_record.name = 'Explorer'        and total_completions >= 5)   or
      (badge_record.name = 'Adventurer'      and total_completions >= 10)  or
      (badge_record.name = 'Quest Master'    and total_completions >= 25)  or
      (badge_record.name = 'Legend'          and total_completions >= 50)  or
      (badge_record.name = 'Century'         and total_completions >= 100) or
      (badge_record.name = 'XP Rookie'       and new.total_xp >= 100)     or
      (badge_record.name = 'XP Hunter'       and new.total_xp >= 500)     or
      (badge_record.name = 'XP Warrior'      and new.total_xp >= 1000)    or
      (badge_record.name = 'XP Elite'        and new.total_xp >= 5000)    or
      (badge_record.name = 'Outdoor Champ'   and outdoor_completions >= 5) or
      (badge_record.name = 'Foodie'          and food_completions >= 5)   or
      (badge_record.name = 'Culture Vulture' and culture_completions >= 5)
    ) then
      insert into user_badges (user_id, badge_id)
      values (new.id, badge_record.id)
      on conflict (user_id, badge_id) do nothing;
    end if;
  end loop;

  return new;
end;
$$;

create trigger on_xp_update
  after update of total_xp on profiles
  for each row execute procedure check_badges_on_xp_update();
