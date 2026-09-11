import { APK_URL, APP_LOGO, APP_NAME, APP_TAGLINE } from '../lib/brand';

/* Styles copied verbatim from the supplied Hkwallet landing page, scoped to .lp */
const CSS = `
.lp-body { background:#0b1e4f; display:flex; justify-content:center; align-items:flex-start; min-height:100dvh; color:#fff; }
.lp { width:100%; max-width:450px; background:linear-gradient(180deg,#124ec3 0%,#0b3499 100%); min-height:100dvh; display:flex; flex-direction:column; padding-bottom:40px; position:relative; box-shadow:0 0 20px rgba(0,0,0,.3); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
.lp * { box-sizing:border-box; margin:0; padding:0; }
.lp .header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(11,52,153,.4); border-bottom:1px solid rgba(255,255,255,.1); backdrop-filter:blur(10px); position:sticky; top:0; z-index:100; }
.lp .logo-section { display:flex; align-items:center; gap:10px; }
.lp .logo-img { width:42px; height:42px; border-radius:8px; object-fit:cover; box-shadow:0 2px 6px rgba(0,0,0,.15); }
.lp .logo-text { display:flex; flex-direction:column; }
.lp .logo-title { font-size:16px; font-weight:700; color:#fff; line-height:1.2; }
.lp .logo-subtitle { font-size:11px; color:rgba(255,255,255,.75); }
.lp .btn-download { background:linear-gradient(135deg,#ff9800 0%,#f57c00 100%); color:#fff; text-decoration:none; font-weight:700; border:none; cursor:pointer; border-radius:25px; text-align:center; box-shadow:0 4px 12px rgba(245,124,0,.4); transition:transform .2s; display:block; }
.lp .btn-download:active { transform:scale(.96); }
.lp .header .btn-download { padding:8px 20px; font-size:13px; border-radius:8px; }
.lp .content { padding:20px; display:flex; flex-direction:column; align-items:center; }
.lp .main-heading { font-size:32px; font-weight:900; text-align:center; line-height:1.2; letter-spacing:.5px; margin:15px 0 25px; text-shadow:0 2px 4px rgba(0,0,0,.2); color:#fff; }
.lp .hero-illustration { width:100%; height:240px; position:relative; display:flex; justify-content:center; align-items:center; margin-bottom:25px; }
.lp .main-action-btn { width:100%; padding:14px; font-size:18px; border-radius:12px; margin-bottom:16px; }
.lp .earn-money-label { width:100%; background:#0d3da9; color:#fff; text-align:center; padding:12px; border-radius:12px; font-weight:600; font-size:15px; margin-bottom:16px; box-shadow:inset 0 1px 3px rgba(0,0,0,.2); }
.lp .features-container { width:100%; background:#eef3ff; border-radius:18px; padding:18px 12px; display:flex; justify-content:space-between; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,0,0,.1); }
.lp .feature-item { flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; }
.lp .feature-icon-box { width:52px; height:52px; background:#fff; border-radius:14px; display:flex; justify-content:center; align-items:center; margin-bottom:10px; box-shadow:0 3px 8px rgba(18,78,195,.1); }
.lp .feature-title { font-size:13px; font-weight:700; color:#0b3499; margin-bottom:2px; }
.lp .feature-sub { font-size:11px; color:#6584c7; }
.lp .info-block-header { width:100%; background:#fff; color:#0b3499; text-align:center; padding:12px; border-radius:10px; font-weight:700; font-size:15px; margin-bottom:18px; box-shadow:0 2px 6px rgba(0,0,0,.1); }
.lp .why-choose-content { width:100%; padding:0 4px; margin-bottom:25px; }
.lp .info-paragraph { margin-bottom:16px; font-size:13.5px; line-height:1.5; color:rgba(255,255,255,.9); }
.lp .info-paragraph strong { font-size:14.5px; color:#fff; display:block; margin-bottom:2px; }
.lp .join-us-banner { width:100%; background:#fff; color:#0b3499; text-align:center; padding:14px 16px; border-radius:10px; font-weight:700; font-size:14px; line-height:1.4; margin-bottom:25px; box-shadow:0 2px 6px rgba(0,0,0,.1); }
.lp .recharge-section { width:100%; display:flex; flex-direction:column; align-items:center; }
.lp .levels-grid { width:100%; display:flex; justify-content:space-between; gap:10px; margin-top:5px; }
.lp .level-card { flex:1; border-radius:14px; padding:14px 8px; display:flex; flex-direction:column; align-items:center; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,.15); }
.lp .level-card.level-a { background:#3b71ca; }
.lp .level-card.level-b { background:#ff4d4d; }
.lp .level-card.level-c { background:#2bcd70; }
.lp .level-name { font-size:13px; font-weight:600; color:#fff; margin-bottom:10px; }
.lp .level-badge { background:#fff; color:#333; font-size:14px; font-weight:700; padding:4px 0; width:80%; border-radius:15px; margin-bottom:10px; box-shadow:inset 0 1px 3px rgba(0,0,0,.1); }
.lp .level-card.level-a .level-badge { color:#3b71ca; }
.lp .level-card.level-b .level-badge { color:#ff4d4d; }
.lp .level-card.level-c .level-badge { color:#2bcd70; }
.lp .level-footer { font-size:11px; color:rgba(255,255,255,.85); }
`;

export default function Landing() {
  return (
    <div className="lp-body">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="lp">
        <div className="header">
          <div className="logo-section">
            <img src={APP_LOGO} alt={`${APP_NAME} logo`} className="logo-img" />
            <div className="logo-text">
              <span className="logo-title">{APP_NAME}</span>
              <span className="logo-subtitle">{APP_TAGLINE}</span>
            </div>
          </div>
          <a href={APK_URL} className="btn-download" download="Hkwallet.apk">
            Download
          </a>
        </div>

        <div className="content">
          <h1 className="main-heading">
            TO GET RUPEE
            <br />
            BY EASY TASK
          </h1>

          <div className="hero-illustration">
            <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="70" fill="#4fa5ff" opacity="0.3" />
              <path
                d="M150 120 C165 120, 175 110, 175 95 C175 82, 163 72, 150 75 C145 55, 120 45, 100 55 C90 45, 70 50, 65 65 C50 65, 40 75, 40 90 C40 105, 52 115, 68 115 Z"
                fill="#76b3ff"
                opacity="0.4"
              />
              <circle cx="95" cy="65" r="22" stroke="#2575fc" strokeWidth="7" fill="none" transform="rotate(-15 95 65)" opacity="0.7" />
              <path
                d="M45 95 C45 88, 50 83, 57 83 L85 83 L98 94 L155 94 C162 94, 167 99, 167 106 L167 150 C167 157, 162 162, 155 162 L45 162 Z"
                fill="url(#folderGrad)"
                style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.25))' }}
              />
              <rect x="65" y="62" width="76" height="75" rx="5" fill="#ffffff" transform="rotate(5 103 99)" />
              <rect x="75" y="75" width="45" height="6" rx="2" fill="#ffe066" transform="rotate(5 103 99)" />
              <rect x="77" y="87" width="52" height="5" rx="2" fill="#e2e8f0" transform="rotate(5 103 99)" />
              <rect x="79" y="97" width="35" height="5" rx="2" fill="#e2e8f0" transform="rotate(5 103 99)" />
              <path
                d="M50 105 C50 100, 54 96, 59 96 L151 96 C156 96, 160 100, 160 105 L160 155 C160 160, 156 164, 151 164 L50 164 Z"
                fill="rgba(255,255,255,0.25)"
              />
              <path d="M35 110 Q 70 60, 140 130 T 170 120" stroke="#a3cbff" strokeWidth="2" fill="none" opacity="0.8" />
              <path
                d="M130 140 C140 140, 148 133, 148 124 C148 116, 140 110, 131 111 C128 100, 112 96, 102 102 C97 97, 86 99, 84 107 C76 107, 70 113, 70 121 C70 129, 77 135, 86 135 Z"
                fill="#bce0ff"
                opacity="0.85"
              />
              <g transform="translate(45, 125) rotate(-25)">
                <circle cx="20" cy="20" r="16" stroke="#fff176" strokeWidth="5" fill="rgba(255,255,255,0.1)" />
                <rect x="17" y="34" width="6" height="18" rx="3" fill="#ffe082" />
                <rect x="18.5" y="34" width="3" height="18" fill="#f57c00" />
              </g>
              <defs>
                <linearGradient id="folderGrad" x1="45" y1="83" x2="167" y2="162" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#64b5f6" />
                  <stop offset="100%" stopColor="#1565c0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <a href={APK_URL} className="btn-download main-action-btn" download="Hkwallet.apk">
            Download
          </a>

          <div className="earn-money-label">Earn Money Online</div>

          <div className="features-container">
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 18C9.58 18 7.48 16.74 6.27 14.83C6.3 12.9 10.3 11.85 12 11.85C13.68 11.85 17.68 12.9 17.73 14.83C16.52 16.74 14.42 18 12 18Z"
                    fill="#124ec3"
                  />
                  <circle cx="12" cy="9.5" r="2" fill="#64b5f6" />
                </svg>
              </div>
              <div className="feature-title">Easy task</div>
              <div className="feature-sub">To get Rupee</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 11H11.32L14.71 4.79C15.01 4.24 14.61 3.57 13.98 3.57H7.72C7.29 3.57 6.91 3.86 6.8 4.28L4.04 14.71C3.9 15.26 4.31 15.8 4.88 15.8H12.5L10.05 20.31C9.74 20.88 10.16 21.57 10.81 21.57H15.11C15.54 21.57 15.93 21.28 16.03 20.85L18.89 11.86C19.04 11.37 18.68 10.86 18.16 10.86H21V11Z"
                    fill="#124ec3"
                  />
                  <path d="M3 7H9" stroke="#124ec3" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 11H7" stroke="#124ec3" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="feature-title">Super-fast</div>
              <div className="feature-sub">Withdrawal</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="#124ec3"
                  />
                  <path d="M19 7H23M21 5V9" stroke="#2bcd70" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="feature-title">Refer</div>
              <div className="feature-sub">And Earn</div>
            </div>
          </div>

          <a href={APK_URL} className="btn-download main-action-btn" download="Hkwallet.apk">
            Download
          </a>

          <div className="info-block-header">Why choose our platform?</div>

          <div className="why-choose-content">
            <div className="info-paragraph">
              <strong>Trusted Protection:</strong>
              Backed by industry-recognized partners, delivering a stable and reliable earning environment.
            </div>
            <div className="info-paragraph">
              <strong>Quick experience:</strong>
              Smooth task flow, easy money earning.
            </div>
            <div className="info-paragraph">
              <strong>Massive orders:</strong>
              Diverse tasks, suitable for both part-time and full-time work!
            </div>
          </div>

          <div className="join-us-banner">Join us and earn money efficiently. Safer, faster, more reliable!</div>

          <div className="recharge-section">
            <div className="info-block-header">Recharge rebate</div>
            <div className="levels-grid">
              <div className="level-card level-a">
                <span className="level-name">Level 1</span>
                <span className="level-badge">5%</span>
                <span className="level-footer">Profit Ratio</span>
              </div>
              <div className="level-card level-b">
                <span className="level-name">Level 2</span>
                <span className="level-badge">0.3%</span>
                <span className="level-footer">Profit Ratio</span>
              </div>
              <div className="level-card level-c">
                <span className="level-name">Level 3</span>
                <span className="level-badge">0.1%</span>
                <span className="level-footer">Profit Ratio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
