create extension if not exists pgcrypto;
create schema if not exists private;

create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.profiles (
  id uuid primary key,
  name text not null default '',
  phone text not null unique check (phone ~ '^[0-9]{10}$'),
  wallet numeric(14,2) not null default 150 check (wallet >= 0),
  has_deposited_300 boolean not null default false,
  locked_deposit_id uuid,
  referral_code text not null unique,
  referred_by text,
  avatar_url text not null default '/brand/logo.png',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null default 'user',
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

create policy profiles_read_own_or_admin on public.profiles for select to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy profiles_update_own_or_admin on public.profiles for update to authenticated
using (id = auth.uid() or public.has_role(auth.uid(), 'admin'))
with check (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy roles_read_own_or_admin on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create table private.otp_challenges (
  phone text primary key,
  otp_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  last_sent_at timestamptz not null default now(),
  consumed_at timestamptz
);

create table public.payment_configurations (
  id uuid primary key default gen_random_uuid(), name text not null, upi_id text not null,
  qr text not null default '', active boolean not null default true, created_at timestamptz not null default now()
);
grant select on public.payment_configurations to anon, authenticated;
grant insert, update, delete on public.payment_configurations to authenticated;
grant all on public.payment_configurations to service_role;
alter table public.payment_configurations enable row level security;
create policy gateways_public_read on public.payment_configurations for select using (active or public.has_role(auth.uid(), 'admin'));
create policy gateways_admin_write on public.payment_configurations for all to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.app_settings (
  id uuid primary key default gen_random_uuid(), reward_percentage numeric(6,2) not null default 4,
  min_order_size numeric(14,2) not null default 300, max_order_size numeric(14,2) not null default 50000,
  newbie_required_order_amount numeric(14,2) not null default 300,
  newbie_reward_amount numeric(14,2) not null default 60
);
grant select on public.app_settings to anon, authenticated;
grant update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
create policy settings_public_read on public.app_settings for select using (true);
create policy settings_admin_update on public.app_settings for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
insert into public.app_settings default values;

create table public.transaction_records (
  id uuid primary key default gen_random_uuid(), user_id uuid not null, user_phone text not null,
  user_name text not null, amount numeric(14,2) not null check (amount > 0), reward numeric(14,2) not null default 0,
  itoken numeric(14,2) not null default 0, utr text not null default '', receipt_base64 text,
  payment_method jsonb, status text not null default 'Pending' check (status in ('Pending','Success','Rejected')),
  type text not null default 'deposit', created_at timestamptz not null default now(), expires_at timestamptz not null,
  agent_code text
);
grant select, insert, update, delete on public.transaction_records to authenticated;
grant all on public.transaction_records to service_role;
alter table public.transaction_records enable row level security;
create policy transactions_read_own_or_admin on public.transaction_records for select to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy transactions_admin_update on public.transaction_records for update to authenticated
using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.agent_commissions (
  id uuid primary key default gen_random_uuid(), agent_code text not null, user_id uuid not null,
  transaction_id uuid not null, level smallint not null check (level between 1 and 3),
  base_amount numeric(14,2) not null, rate numeric(6,2) not null, amount numeric(14,2) not null,
  status text not null default 'Success', created_at timestamptz not null default now(),
  unique(transaction_id, agent_code, level)
);
grant select on public.agent_commissions to authenticated;
grant all on public.agent_commissions to service_role;
alter table public.agent_commissions enable row level security;
create policy commissions_read_own_or_admin on public.agent_commissions for select to authenticated
using (agent_code = (select referral_code from public.profiles where id = auth.uid()) or public.has_role(auth.uid(), 'admin'));

create table public.upi_accounts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null, partner_id text not null default '',
  partner_name text not null default '', masked_phone text not null default '', upi_id text not null default '',
  tab_type text not null default 'Buy', is_selling boolean not null default false, created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.upi_accounts to authenticated;
grant all on public.upi_accounts to service_role;
alter table public.upi_accounts enable row level security;
create policy upi_own_or_admin on public.upi_accounts for all to authenticated
using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'))
with check (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create table public.banners (id uuid primary key default gen_random_uuid(), url text not null, created_at timestamptz not null default now());
grant select on public.banners to anon, authenticated; grant insert, update, delete on public.banners to authenticated; grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy banners_public_read on public.banners for select using (true);
create policy banners_admin_write on public.banners for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.customer_services (
 id uuid primary key default gen_random_uuid(), icon_url text not null default '', name text not null,
 description text not null default '', link_url text not null, created_at timestamptz not null default now()
);
grant select on public.customer_services to anon, authenticated; grant insert, update, delete on public.customer_services to authenticated; grant all on public.customer_services to service_role;
alter table public.customer_services enable row level security;
create policy services_public_read on public.customer_services for select using (true);
create policy services_admin_write on public.customer_services for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.generate_referral_code()
returns text language plpgsql volatile security definer set search_path = public
as $$ declare candidate text; begin loop candidate := 'HK' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 8)); exit when not exists(select 1 from profiles where referral_code=candidate); end loop; return candidate; end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
 insert into public.profiles(id,name,phone,referral_code,referred_by,avatar_url)
 values(new.id, coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone',''), new.raw_user_meta_data->>'phone', public.generate_referral_code(), nullif(upper(new.raw_user_meta_data->>'referred_by'),''), '/brand/logo.png');
 insert into public.user_roles(user_id,role) values(new.id,'user'); return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.check_user_exists(p_phone text)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where phone = regexp_replace(p_phone,'\D','','g')) $$;
grant execute on function public.check_user_exists(text) to anon, authenticated;

create or replace function public.team_summary()
returns table(referral_code text,total_commission numeric,today_commission numeric,total_members bigint,today_members bigint)
language sql stable security definer set search_path = public
as $$
 with me as (select p.referral_code from profiles p where p.id=auth.uid()),
 members as (select p.created_at from profiles p,me where p.referred_by=me.referral_code),
 comm as (select c.amount,c.created_at from agent_commissions c,me where c.agent_code=me.referral_code)
 select me.referral_code,coalesce((select sum(amount) from comm),0),coalesce((select sum(amount) from comm where created_at>=date_trunc('day',now())),0),
 (select count(*) from members),(select count(*) from members where created_at>=date_trunc('day',now())) from me
$$;
grant execute on function public.team_summary() to authenticated;

create or replace function public.create_deposit(p_amount numeric)
returns public.transaction_records language plpgsql security definer set search_path = public
as $$ declare p profiles; s app_settings; g payment_configurations; t transaction_records; begin
 select * into p from profiles where id=auth.uid() for update; if p.id is null then raise exception 'Unauthorized'; end if;
 select * into s from app_settings limit 1; if p_amount<s.min_order_size or p_amount>s.max_order_size then raise exception 'Invalid amount'; end if;
 if p.locked_deposit_id is not null and exists(select 1 from transaction_records where id=p.locked_deposit_id and status='Pending' and expires_at>now()) then raise exception 'Active deposit exists'; end if;
 select * into g from payment_configurations where active order by random() limit 1; if g.id is null then raise exception 'No payment methods available'; end if;
 insert into transaction_records(user_id,user_phone,user_name,amount,reward,itoken,payment_method,expires_at,agent_code)
 values(p.id,p.phone,p.name,p_amount,round(p_amount*s.reward_percentage/100,2),round(p_amount*(1+s.reward_percentage/100),2),jsonb_build_object('name',g.name,'upi_id',g.upi_id,'qr',g.qr),now()+interval '30 minutes',p.referred_by) returning * into t;
 update profiles set locked_deposit_id=t.id,updated_at=now() where id=p.id; return t;
end $$;
grant execute on function public.create_deposit(numeric) to authenticated;

create or replace function public.cancel_deposit(p_deposit_id uuid)
returns void language plpgsql security definer set search_path=public as $$ begin
 delete from transaction_records where id=p_deposit_id and user_id=auth.uid() and status='Pending' and utr='';
 update profiles set locked_deposit_id=null,updated_at=now() where id=auth.uid() and locked_deposit_id=p_deposit_id;
end $$;
grant execute on function public.cancel_deposit(uuid) to authenticated;

create or replace function public.submit_deposit_proof(p_deposit_id uuid,p_utr text,p_receipt text)
returns void language plpgsql security definer set search_path=public as $$ begin
 if p_utr !~ '^[0-9]{12}$' then raise exception 'UTR must be exactly 12 numeric digits'; end if;
 update transaction_records set utr=p_utr,receipt_base64=p_receipt where id=p_deposit_id and user_id=auth.uid() and status='Pending';
 if not found then raise exception 'Deposit not found'; end if;
 update profiles set locked_deposit_id=null,updated_at=now() where id=auth.uid() and locked_deposit_id=p_deposit_id;
end $$;
grant execute on function public.submit_deposit_proof(uuid,text,text) to authenticated;

create or replace function public.review_deposit(p_deposit_id uuid,p_approve boolean)
returns void language plpgsql security definer set search_path=public as $$ declare t transaction_records; p profiles; s app_settings; begin
 if not public.has_role(auth.uid(),'admin') then raise exception 'Forbidden'; end if;
 select * into t from transaction_records where id=p_deposit_id for update; if t.status<>'Pending' then return; end if;
 if not p_approve then update transaction_records set status='Rejected' where id=t.id; update profiles set locked_deposit_id=null where id=t.user_id and locked_deposit_id=t.id; return; end if;
 select * into p from profiles where id=t.user_id for update; select * into s from app_settings limit 1;
 update transaction_records set status='Success' where id=t.id;
 update profiles set wallet=wallet+t.itoken+(case when not p.has_deposited_300 and t.amount>=s.newbie_required_order_amount then s.newbie_reward_amount else 0 end), has_deposited_300=p.has_deposited_300 or t.amount>=s.newbie_required_order_amount,locked_deposit_id=null,updated_at=now() where id=p.id;
 if t.agent_code is not null then insert into agent_commissions(agent_code,user_id,transaction_id,level,base_amount,rate,amount) values(t.agent_code,t.user_id,t.id,1,t.amount,5,round(t.amount*.05,2)) on conflict do nothing; end if;
end $$;
grant execute on function public.review_deposit(uuid,boolean) to authenticated;

create index profiles_referred_by_idx on public.profiles(referred_by);
create index transactions_user_idx on public.transaction_records(user_id,created_at desc);
create index commissions_agent_idx on public.agent_commissions(agent_code,created_at desc);