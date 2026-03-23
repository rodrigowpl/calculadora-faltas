-- Create the absences table
create table absences (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  reason text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (optional - disable if you want public access)
alter table absences enable row level security;

-- Policy: allow all operations for anonymous users (using anon key)
create policy "Allow all for anon" on absences
  for all
  using (true)
  with check (true);
