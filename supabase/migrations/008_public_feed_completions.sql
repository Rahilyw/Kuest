-- Allow all authenticated users to read approved completions for the public activity feed.
drop policy if exists "Anyone can read approved completions" on completions;

create policy "Anyone can read approved completions"
  on completions for select
  using (status = 'approved');
