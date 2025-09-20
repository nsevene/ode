-- Enable Realtime for the orders table
alter table "public"."orders" replica identity full;
alter publication supabase_realtime add table "public"."orders";
