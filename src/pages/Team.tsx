import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useToast } from '../lib/toast';
import { supabase } from '../lib/supabase';

interface TeamSummary { total_commission: number; today_commission: number; total_members: number; today_members: number }

export default function Team() {
  const { currentUser } = useStore();
  const toast = useToast();
  const [summary, setSummary] = useState<TeamSummary>({ total_commission: 0, today_commission: 0, total_members: 0, today_members: 0 });
  const copyLink = `${window.location.origin}/?ref=${encodeURIComponent(currentUser?.referralCode ?? '')}`;
  const displayLink = copyLink;

  useEffect(() => {
    if (!currentUser) return;
    void supabase.rpc('team_summary').single().then(({ data }) => {
      if (data) setSummary({ total_commission: Number(data.total_commission), today_commission: Number(data.today_commission), total_members: Number(data.total_members), today_members: Number(data.today_members) });
    });
  }, [currentUser?.id]);

  const copy = () => {
    navigator.clipboard.writeText(copyLink).then(() => toast('Link copied!', 'success'));
  };

  return (
    <div>
      <div className="vp-header" style={{ justifyContent: 'center' }}>
        <span className="vp-header-title">Teams</span>
      </div>

      <div className="vp-comm-header">
        <div>
          <div style={{ color: 'var(--vp-muted)', fontSize: 12, marginBottom: 5 }}>
            My Total Commissions
          </div>
          <div className="vp-comm-total">
             <i className="fa-solid fa-coins" /> {summary.total_commission.toFixed(2)}
          </div>
          <button className="vp-link-text">Show commission structure &gt;</button>
        </div>
        <div className="vp-rebate">
          <div style={{ color: '#aaa', marginBottom: 4 }}>Rebate Rate</div>
           <div>Level 1 &nbsp;&nbsp; <strong>5%</strong></div>
           <div>Level 2 &nbsp;&nbsp; <strong>0.3%</strong></div>
           <div>Level 3 &nbsp;&nbsp; <strong>0.1%</strong></div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title">Today's Teams Data</div>
        <div className="vp-team-grid">
          <div className="vp-team-box">
            <span className="label">Team Commissions</span>
            <span className="val">₹{summary.today_commission.toFixed(2)}</span>
          </div>
          <div className="vp-team-box">
            <span className="label">Total New Team</span>
            <span className="val">{summary.today_members} &gt;</span>
          </div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title">Total Teams Data</div>
        <div className="vp-team-grid">
          <div className="vp-team-box">
            <span className="label">Team Commissions</span>
            <span className="val">₹{summary.total_commission.toFixed(2)}</span>
          </div>
          <div className="vp-team-box">
            <span className="label">Team Members</span>
            <span className="val">{summary.total_members} &gt;</span>
          </div>
        </div>
      </div>

      <div className="vp-team-card">
        <div className="vp-team-title" style={{ marginBottom: 5 }}>
          Invitation Link{' '}
          <span style={{ fontSize: 12, color: 'var(--vp-muted)', fontWeight: 400 }}>
             (ID: {currentUser?.referralCode ?? '—'})
          </span>
        </div>
        <div className="vp-invite-box">
          <input type="text" value={displayLink} readOnly />
          <i className="fa-regular fa-copy" onClick={copy} role="button" aria-label="Copy invitation link" />
        </div>
        <div className="vp-team-title" style={{ marginTop: 25, marginBottom: 5 }}>
          More Ways To Invite
        </div>
        <div className="vp-social-row">
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-facebook vp-fb" /> Facebook
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-telegram vp-tg" /> Telegram
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-brands fa-whatsapp vp-wa" /> WhatsApp
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-solid fa-share-nodes vp-more" /> More
          </button>
          <button className="vp-social-btn" onClick={copy}>
            <i className="fa-solid fa-qrcode vp-qr" /> QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
