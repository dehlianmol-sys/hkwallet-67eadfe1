alter function public.has_role(uuid, public.app_role) set schema private;
alter function public.generate_referral_code() set schema private;
alter function public.handle_new_user() set schema private;
alter function public.check_user_exists(text) set schema private;
alter function public.team_summary() set schema private;
alter function public.create_deposit(numeric) set schema private;
alter function public.cancel_deposit(uuid) set schema private;
alter function public.submit_deposit_proof(uuid,text,text) set schema private;
alter function public.review_deposit(uuid,boolean) set schema private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;
revoke all on all functions in schema private from public;
grant execute on function private.check_user_exists(text) to anon, authenticated;
grant execute on function private.has_role(uuid, public.app_role), private.team_summary(), private.create_deposit(numeric), private.cancel_deposit(uuid), private.submit_deposit_proof(uuid,text,text), private.review_deposit(uuid,boolean) to authenticated;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security invoker set search_path = public, private
as $$ select private.has_role(_user_id,_role) $$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create or replace function public.check_user_exists(p_phone text)
returns boolean language sql stable security invoker set search_path = public, private
as $$ select private.check_user_exists(p_phone) $$;
grant execute on function public.check_user_exists(text) to anon, authenticated;

create or replace function public.team_summary()
returns table(referral_code text,total_commission numeric,today_commission numeric,total_members bigint,today_members bigint)
language sql stable security invoker set search_path = public, private
as $$ select * from private.team_summary() $$;
grant execute on function public.team_summary() to authenticated;

create or replace function public.create_deposit(p_amount numeric)
returns public.transaction_records language sql volatile security invoker set search_path = public, private
as $$ select private.create_deposit(p_amount) $$;
grant execute on function public.create_deposit(numeric) to authenticated;

create or replace function public.cancel_deposit(p_deposit_id uuid)
returns void language sql volatile security invoker set search_path = public, private
as $$ select private.cancel_deposit(p_deposit_id) $$;
grant execute on function public.cancel_deposit(uuid) to authenticated;

create or replace function public.submit_deposit_proof(p_deposit_id uuid,p_utr text,p_receipt text)
returns void language sql volatile security invoker set search_path = public, private
as $$ select private.submit_deposit_proof(p_deposit_id,p_utr,p_receipt) $$;
grant execute on function public.submit_deposit_proof(uuid,text,text) to authenticated;

create or replace function public.review_deposit(p_deposit_id uuid,p_approve boolean)
returns void language sql volatile security invoker set search_path = public, private
as $$ select private.review_deposit(p_deposit_id,p_approve) $$;
grant execute on function public.review_deposit(uuid,boolean) to authenticated;