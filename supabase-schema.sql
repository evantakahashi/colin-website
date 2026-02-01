-- Run this in Supabase SQL Editor

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  player_email text not null,
  player_phone text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes int not null,
  status text not null default 'pending',
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Availability table (weekly template, one row per weekday)
create table availability (
  weekday int primary key,
  enabled boolean default false,
  blocks jsonb default '[]'
);

-- Seed default Mon-Fri 9-5
insert into availability (weekday, enabled, blocks) values
  (0, false, '[]'),
  (1, true, '[{"start":"09:00","end":"17:00"}]'),
  (2, true, '[{"start":"09:00","end":"17:00"}]'),
  (3, true, '[{"start":"09:00","end":"17:00"}]'),
  (4, true, '[{"start":"09:00","end":"17:00"}]'),
  (5, true, '[{"start":"09:00","end":"17:00"}]'),
  (6, false, '[]');
