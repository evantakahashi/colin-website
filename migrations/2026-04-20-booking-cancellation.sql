-- Run this in Supabase SQL Editor
-- Adds cancellation audit columns to bookings table.

alter table bookings
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_message text,
  add column if not exists refund_id text;
