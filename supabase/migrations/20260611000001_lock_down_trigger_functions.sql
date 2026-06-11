-- Trigger functions are fired by the database, never via the REST API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.enforce_bid_rules() from public, anon, authenticated;
