create or replace function public.issue_otp_challenge(p_phone text)
returns text language plpgsql volatile security definer set search_path = public, private
as $$ declare v_phone text := regexp_replace(p_phone,'\D','','g'); v_otp text; begin
 if current_user not in ('postgres','service_role','supabase_admin') then raise exception 'Forbidden'; end if;
 if v_phone !~ '^[0-9]{10}$' then raise exception 'Invalid phone'; end if;
 if public.check_user_exists(v_phone) then raise exception 'Phone number already registered'; end if;
 if exists(select 1 from private.otp_challenges where phone=v_phone and last_sent_at > now()-interval '60 seconds') then raise exception 'Please wait before requesting another OTP'; end if;
 v_otp := lpad((floor(random()*900000)+100000)::int::text,6,'0');
 insert into private.otp_challenges(phone,otp_hash,attempts,expires_at,last_sent_at,consumed_at)
 values(v_phone,crypt(v_otp,gen_salt('bf')),0,now()+interval '5 minutes',now(),null)
 on conflict(phone) do update set otp_hash=excluded.otp_hash,attempts=0,expires_at=excluded.expires_at,last_sent_at=excluded.last_sent_at,consumed_at=null;
 return v_otp;
end $$;
revoke all on function public.issue_otp_challenge(text) from public,anon,authenticated;
grant execute on function public.issue_otp_challenge(text) to service_role;

create or replace function public.verify_otp_challenge(p_phone text,p_otp text)
returns boolean language plpgsql volatile security definer set search_path = public, private
as $$ declare v private.otp_challenges; begin
 if current_user not in ('postgres','service_role','supabase_admin') then raise exception 'Forbidden'; end if;
 select * into v from private.otp_challenges where phone=regexp_replace(p_phone,'\D','','g') for update;
 if v.phone is null or v.consumed_at is not null or v.expires_at<now() or v.attempts>=5 then return false; end if;
 update private.otp_challenges set attempts=attempts+1 where phone=v.phone;
 if crypt(p_otp,v.otp_hash)=v.otp_hash then update private.otp_challenges set consumed_at=now() where phone=v.phone; return true; end if;
 return false;
end $$;
revoke all on function public.verify_otp_challenge(text,text) from public,anon,authenticated;
grant execute on function public.verify_otp_challenge(text,text) to service_role;
