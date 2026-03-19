import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const API = "/api/claude";

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES — Mobile-first, production-grade
// ═══════════════════════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ink:#07090f; --deep:#0d1120; --panel:#131826; --card:#18202e; --card2:#1c2538;
  --border:#222f46; --border2:#2a3a58; --muted:#4a5c7a; --text:#b4c6e0;
  --light:#dde8f8; --white:#edf3fc;
  --gold:#c9a84c; --gold2:#e8c86a; --gold3:rgba(201,168,76,.13); --gold4:rgba(201,168,76,.06);
  --blue:#3672d4; --blue2:#5a8fe8; --blue3:rgba(54,114,212,.13);
  --green:#35c47a; --green3:rgba(53,196,122,.13);
  --red:#df4f5f; --red3:rgba(223,79,95,.13);
  --amber:#db8c25; --amber3:rgba(219,140,37,.13);
  --purple:#7c5cd4; --purple3:rgba(124,92,212,.13);
  --teal:#1ab0a0; --teal3:rgba(26,176,160,.13);
  --r4:4px; --r6:6px; --r8:8px; --r10:10px; --r12:12px; --r16:16px;
  --sb-width:230px;
  --topbar-h:52px;
  --shadow:0 4px 20px rgba(0,0,0,.4);
  --shadow-sm:0 2px 8px rgba(0,0,0,.3);
}

/* ── Reset & Base ── */
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html { font-size:14px; -webkit-text-size-adjust:100%; }
html,body,#root { height:100%; }
body { background:var(--ink); color:var(--text); font-family:'Outfit',sans-serif; overflow:hidden; -webkit-font-smoothing:antialiased; }
::-webkit-scrollbar { width:3px; height:3px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--muted); border-radius:4px; }

/* ── LAYOUT ── */
.app { display:flex; height:100vh; overflow:hidden; position:relative; }

/* ── SIDEBAR ── */
.sidebar {
  width:var(--sb-width); min-width:var(--sb-width);
  background:var(--deep); border-right:1px solid var(--border);
  display:flex; flex-direction:column; overflow:hidden;
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  z-index:300;
}
.sidebar-overlay {
  display:none; position:fixed; inset:0; background:rgba(0,0,0,.65);
  z-index:299; backdrop-filter:blur(3px);
  animation:fadeIn .2s ease;
}
.sidebar-overlay.show { display:block; }

.logo-area { padding:16px 16px 13px; border-bottom:1px solid var(--border); flex-shrink:0; }
.logo-row { display:flex; align-items:center; gap:10px; }
.logo-icon { width:34px; height:34px; background:linear-gradient(135deg,var(--gold),var(--gold2)); border-radius:var(--r8); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.logo-area h1 { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:var(--gold); letter-spacing:.3px; line-height:1; }
.logo-area small { font-size:8.5px; letter-spacing:2.5px; text-transform:uppercase; color:var(--muted); display:block; margin-top:1px; }
.logo-close { margin-left:auto; background:none; border:none; color:var(--muted); cursor:pointer; font-size:18px; padding:4px; display:none; }

.nav { flex:1; overflow-y:auto; padding:6px 0 10px; }
.nav-section { padding:14px 16px 4px; font-size:8.5px; letter-spacing:2.5px; text-transform:uppercase; color:var(--muted); font-weight:600; }
.nav-item {
  display:flex; align-items:center; gap:9px; padding:8.5px 16px;
  cursor:pointer; border-left:2px solid transparent;
  transition:all .13s; color:var(--text); font-size:12.5px;
  user-select:none; min-height:38px;
}
.nav-item:hover { background:rgba(255,255,255,.03); color:var(--light); }
.nav-item.active { background:var(--gold3); border-left-color:var(--gold); color:var(--gold); font-weight:500; }
.nav-icon { width:17px; text-align:center; font-size:13px; flex-shrink:0; }
.nav-label { flex:1; }
.nav-badge { background:var(--red); color:#fff; font-size:9px; border-radius:10px; padding:1px 6px; font-weight:700; flex-shrink:0; }

.sidebar-bottom { padding:11px 13px; border-top:1px solid var(--border); flex-shrink:0; }
.user-row { display:flex; align-items:center; gap:9px; cursor:pointer; padding:8px 10px; border-radius:var(--r8); transition:background .13s; }
.user-row:hover { background:rgba(255,255,255,.04); }
.user-info { flex:1; min-width:0; }
.user-name { font-size:12.5px; color:var(--light); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.user-role { font-size:10px; color:var(--muted); }
.lsk-badge { font-size:8.5px; color:var(--gold); background:var(--gold4); border:1px solid rgba(201,168,76,.2); border-radius:3px; padding:1px 5px; letter-spacing:.5px; margin-top:2px; display:inline-block; }

/* ── AVATAR ── */
.av { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:var(--ink); flex-shrink:0; }
.av-gold { background:linear-gradient(135deg,var(--gold),var(--gold2)); }
.av-blue { background:linear-gradient(135deg,var(--blue),var(--blue2)); }
.av-green { background:linear-gradient(135deg,var(--green),#50d890); }
.av-purple { background:linear-gradient(135deg,var(--purple),#9c7cf4); }
.av-teal { background:linear-gradient(135deg,var(--teal),#30d0c0); }
.av-red { background:linear-gradient(135deg,var(--red),#f07080); }

/* ── MAIN ── */
.main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

.topbar {
  height:var(--topbar-h); min-height:var(--topbar-h);
  background:var(--deep); border-bottom:1px solid var(--border);
  display:flex; align-items:center; padding:0 18px; gap:10px; flex-shrink:0;
}
.topbar-hamburger { display:none; background:none; border:none; color:var(--text); cursor:pointer; padding:6px; font-size:18px; margin-right:2px; }
.topbar-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--light); flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.topbar-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.topbar-right .btn-gold { display:flex; }
.notif-btn { position:relative; }
.notif-dot { position:absolute; top:2px; right:2px; width:7px; height:7px; border-radius:50%; background:var(--red); border:2px solid var(--deep); }

.content { flex:1; overflow-y:auto; padding:18px 20px; }

/* ── MOBILE BOTTOM NAV ── */
.bottom-nav {
  display:none; height:56px; background:var(--deep); border-top:1px solid var(--border);
  flex-shrink:0; align-items:stretch; justify-content:space-around;
}
.bnav-item { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:6px 10px; cursor:pointer; color:var(--muted); flex:1; min-width:0; transition:color .13s; position:relative; }
.bnav-item.active { color:var(--gold); }
.bnav-icon { font-size:18px; line-height:1; }
.bnav-label { font-size:9px; letter-spacing:.3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:60px; text-align:center; }
.bnav-badge { position:absolute; top:4px; right:calc(50% - 16px); background:var(--red); color:#fff; font-size:8px; border-radius:8px; padding:1px 4px; font-weight:700; }

/* ── BUTTONS ── */
.btn { padding:7px 13px; border-radius:var(--r6); border:none; cursor:pointer; font-family:'Outfit',sans-serif; font-size:12px; font-weight:500; transition:all .13s; display:inline-flex; align-items:center; gap:6px; white-space:nowrap; touch-action:manipulation; min-height:34px; }
.btn:disabled { opacity:.45; cursor:not-allowed; }
.btn-gold { background:var(--gold); color:var(--ink); }
.btn-gold:hover:not(:disabled) { background:var(--gold2); }
.btn-ghost { background:transparent; color:var(--text); border:1px solid var(--border); }
.btn-ghost:hover:not(:disabled) { border-color:var(--muted); color:var(--light); }
.btn-blue { background:var(--blue); color:#fff; }
.btn-blue:hover:not(:disabled) { background:var(--blue2); }
.btn-green { background:var(--green3); color:var(--green); border:1px solid rgba(53,196,122,.25); }
.btn-red { background:var(--red3); color:var(--red); border:1px solid rgba(223,79,95,.25); }
.btn-sm { padding:5px 10px; font-size:11px; min-height:28px; }
.btn-xs { padding:3px 8px; font-size:10px; min-height:24px; }
.btn-full { width:100%; justify-content:center; }
.icon-btn { padding:7px; border-radius:var(--r6); background:transparent; border:1px solid var(--border); color:var(--muted); cursor:pointer; transition:all .13s; font-size:15px; min-height:34px; min-width:34px; display:inline-flex; align-items:center; justify-content:center; }
.icon-btn:hover { color:var(--light); border-color:var(--muted); }

/* ── CARDS ── */
.card { background:var(--card); border:1px solid var(--border); border-radius:var(--r10); overflow:hidden; }
.card-hd { padding:12px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:10px; }
.card-title { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; color:var(--light); }
.card-body { padding:16px; }
.card-footer { padding:12px 16px; border-top:1px solid var(--border); background:var(--panel); }

/* ── STAT CARDS ── */
.stats-row { display:grid; gap:12px; margin-bottom:18px; }
.stats-row.cols-4 { grid-template-columns:repeat(4,1fr); }
.stats-row.cols-3 { grid-template-columns:repeat(3,1fr); }
.stats-row.cols-2 { grid-template-columns:repeat(2,1fr); }
.stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r10); padding:14px 16px; position:relative; overflow:hidden; }
.stat-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.c-gold::after { background:var(--gold); } .c-blue::after { background:var(--blue); }
.c-green::after { background:var(--green); } .c-red::after { background:var(--red); }
.c-purple::after { background:var(--purple); } .c-teal::after { background:var(--teal); }
.c-amber::after { background:var(--amber); }
.s-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; font-weight:500; }
.s-val { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:600; color:var(--light); line-height:1.1; }
.s-sub { font-size:10.5px; color:var(--muted); margin-top:4px; }
.s-icon { position:absolute; right:12px; top:12px; font-size:20px; opacity:.18; }

/* ── TABLE ── */
.tbl-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
table { width:100%; border-collapse:collapse; min-width:580px; }
th { padding:9px 12px; text-align:left; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); border-bottom:1px solid var(--border); font-weight:600; white-space:nowrap; }
td { padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.03); font-size:12.5px; vertical-align:middle; }
tr:hover td { background:rgba(255,255,255,.018); }
tr:last-child td { border-bottom:none; }
.mobile-card-list { display:none; }

/* ── BADGES ── */
.badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:500; letter-spacing:.3px; white-space:nowrap; }
.b-green { background:var(--green3); color:var(--green); }
.b-amber { background:var(--amber3); color:var(--amber); }
.b-red { background:var(--red3); color:var(--red); }
.b-blue { background:var(--blue3); color:var(--blue2); }
.b-gray { background:rgba(74,92,120,.3); color:var(--muted); }
.b-purple { background:var(--purple3); color:var(--purple); }
.b-gold { background:var(--gold3); color:var(--gold); }
.b-teal { background:var(--teal3); color:var(--teal); }

/* ── FORMS ── */
.form-group { margin-bottom:14px; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.form-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
label { display:block; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; font-weight:600; }
input,select,textarea { width:100%; background:var(--panel); border:1px solid var(--border); border-radius:var(--r6); padding:9px 12px; color:var(--light); font-family:'Outfit',sans-serif; font-size:13px; outline:none; transition:border-color .13s; -webkit-appearance:none; }
input:focus,select:focus,textarea:focus { border-color:var(--gold); box-shadow:0 0 0 3px var(--gold4); }
input::placeholder,textarea::placeholder { color:var(--muted); }
textarea { resize:vertical; min-height:80px; line-height:1.6; }
select { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234a5c7a'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:30px; }
select option { background:var(--card); color:var(--light); }

/* ── MODAL ── */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.75); display:flex; align-items:center; justify-content:center; z-index:400; backdrop-filter:blur(6px); padding:12px; animation:fadeIn .18s ease; }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
@keyframes slideInRight { from { transform:translateX(100%); } to { transform:translateX(0); } }
.modal { background:var(--panel); border:1px solid var(--border); border-radius:var(--r12); width:680px; max-width:100%; max-height:92vh; overflow-y:auto; animation:slideUp .2s ease; box-shadow:var(--shadow); }
.modal-lg { width:870px; }
.modal-xl { width:1080px; }
.modal-hd { padding:17px 20px 13px; border-bottom:1px solid var(--border); display:flex; align-items:flex-start; justify-content:space-between; gap:12px; position:sticky; top:0; background:var(--panel); z-index:1; }
.modal-title { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:var(--light); }
.modal-sub { font-size:11px; color:var(--muted); margin-top:2px; }
.modal-body { padding:20px; }
.close-x { background:none; border:none; color:var(--muted); cursor:pointer; font-size:20px; line-height:1; padding:2px; flex-shrink:0; }
.close-x:hover { color:var(--light); }

/* ── TABS ── */
.tabs { display:flex; gap:0; border-bottom:1px solid var(--border); margin-bottom:16px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
.tabs::-webkit-scrollbar { display:none; }
.tab { padding:9px 15px; cursor:pointer; font-size:12px; border-bottom:2px solid transparent; color:var(--muted); transition:all .13s; margin-bottom:-1px; white-space:nowrap; user-select:none; min-height:38px; display:flex; align-items:center; }
.tab:hover { color:var(--text); }
.tab.on { color:var(--gold); border-bottom-color:var(--gold); font-weight:500; }

/* ── PROGRESS ── */
.pbar { background:var(--border); border-radius:3px; height:4px; overflow:hidden; }
.pfill { height:100%; border-radius:3px; background:var(--gold); transition:width .4s ease; }

/* ── TIMELINE ── */
.tl { padding-left:20px; position:relative; }
.tl::before { content:''; position:absolute; left:6px; top:6px; bottom:6px; width:1px; background:var(--border); }
.tl-item { position:relative; margin-bottom:14px; }
.tl-dot { position:absolute; left:-17px; top:4px; width:7px; height:7px; border-radius:50%; border:2px solid var(--ink); }
.tl-time { font-size:10px; color:var(--muted); margin-bottom:1px; font-family:'JetBrains Mono',monospace; }
.tl-text { font-size:12.5px; color:var(--text); line-height:1.5; }
.tl-by { font-size:10px; color:var(--blue2); margin-top:2px; }

/* ── AI PANEL ── */
.ai-glow { background:linear-gradient(135deg,rgba(54,114,212,.1),rgba(124,92,212,.1)); border:1px solid rgba(54,114,212,.22); border-radius:var(--r10); padding:14px; }
.ai-hd { display:flex; align-items:center; gap:8px; color:var(--blue2); font-size:11px; font-weight:600; letter-spacing:1px; margin-bottom:10px; text-transform:uppercase; }
.ai-out { font-size:12.5px; line-height:1.8; color:var(--text); white-space:pre-wrap; }
.thinking { display:flex; align-items:center; gap:5px; color:var(--muted); font-size:11px; }
.dot { width:5px; height:5px; border-radius:50%; background:var(--blue); animation:blink 1.2s infinite; }
.dot:nth-child(2) { animation-delay:.2s; } .dot:nth-child(3) { animation-delay:.4s; }
@keyframes blink { 0%,100% { opacity:.2; } 50% { opacity:1; } }

/* ── DROP ZONE ── */
.drop-zone { border:2px dashed var(--border); border-radius:var(--r8); padding:20px; text-align:center; cursor:pointer; transition:all .2s; color:var(--muted); }
.drop-zone:hover,.drop-zone.drag { border-color:var(--gold); color:var(--text); background:var(--gold4); }
.dz-icon { font-size:26px; margin-bottom:6px; }

/* ── EVIDENCE GRID ── */
.ev-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(115px,1fr)); gap:10px; }
.ev-card { background:var(--deep); border:1px solid var(--border); border-radius:var(--r8); overflow:hidden; cursor:pointer; transition:all .15s; }
.ev-card:hover { border-color:var(--gold); transform:translateY(-2px); box-shadow:var(--shadow-sm); }
.ev-thumb { height:76px; display:flex; align-items:center; justify-content:center; font-size:24px; background:var(--panel); }
.ev-label { padding:7px 8px; }
.ev-name { font-size:10.5px; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ev-meta { font-size:9.5px; color:var(--muted); margin-top:1px; }

/* ── CHAT ── */
.chat-wrap { display:flex; flex-direction:column; height:360px; }
.chat-msgs { flex:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:8px; }
.msg { max-width:84%; }
.msg-u { align-self:flex-end; }
.msg-a { align-self:flex-start; }
.bubble { padding:9px 13px; border-radius:10px; font-size:12.5px; line-height:1.65; }
.msg-u .bubble { background:var(--blue); color:#fff; border-radius:10px 10px 2px 10px; }
.msg-a .bubble { background:var(--card); border:1px solid var(--border); color:var(--text); border-radius:10px 10px 10px 2px; }
.chat-bottom { display:flex; gap:8px; padding:10px; border-top:1px solid var(--border); }
.chat-bottom input { flex:1; }

/* ── CALENDAR ── */
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
.cal-dh { text-align:center; padding:5px 2px; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); font-weight:600; }
.cal-cell { background:var(--card); border:1px solid var(--border); border-radius:var(--r6); min-height:76px; padding:5px; cursor:pointer; transition:border-color .13s; }
.cal-cell:hover { border-color:var(--muted); }
.cal-cell.today { border-color:var(--gold); background:var(--gold4); }
.cal-cell.other { opacity:.32; }
.cal-num { font-size:11px; color:var(--muted); font-family:'JetBrains Mono',monospace; margin-bottom:3px; }
.cal-cell.today .cal-num { color:var(--gold); font-weight:700; }
.cal-ev { font-size:9px; padding:2px 4px; border-radius:3px; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ev-hearing { background:var(--red3); color:var(--red); }
.ev-deadline { background:var(--amber3); color:var(--amber); }
.ev-meeting { background:var(--blue3); color:var(--blue2); }
.ev-task { background:var(--purple3); color:var(--purple); }

/* ── PIPELINE ── */
.kanban { display:flex; gap:10px; overflow-x:auto; padding-bottom:8px; -webkit-overflow-scrolling:touch; }
.kan-col { min-width:188px; max-width:188px; background:var(--deep); border:1px solid var(--border); border-radius:var(--r10); display:flex; flex-direction:column; max-height:calc(100vh - var(--topbar-h) - 60px); }
.kan-hd { padding:10px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
.kan-hd-label { font-size:10px; letter-spacing:1.5px; text-transform:uppercase; font-weight:600; }
.kan-count { font-size:10px; padding:1px 7px; border-radius:10px; font-weight:700; }
.kan-body { flex:1; overflow-y:auto; padding:8px; display:flex; flex-direction:column; gap:7px; }
.kan-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r8); padding:9px 10px; cursor:pointer; transition:all .15s; }
.kan-card:hover { border-color:var(--gold); box-shadow:var(--shadow-sm); }

/* ── TASK ── */
.task-item { background:var(--card); border:1px solid var(--border); border-radius:var(--r8); padding:10px 12px; display:flex; align-items:flex-start; gap:10px; cursor:pointer; transition:all .13s; margin-bottom:7px; }
.task-item:hover { border-color:var(--border2); }
.task-item.done { opacity:.45; }
.task-cb { width:17px; height:17px; border-radius:4px; border:1.5px solid var(--muted); cursor:pointer; flex-shrink:0; margin-top:1px; display:flex; align-items:center; justify-content:center; transition:all .13s; font-size:11px; }
.task-cb.checked { background:var(--green); border-color:var(--green); color:#fff; }

/* ── COMMS THREAD ── */
.thread-item { background:var(--card); border:1px solid var(--border); border-radius:var(--r8); padding:12px; cursor:pointer; transition:border-color .13s; }
.thread-item:hover { border-color:var(--border2); }

/* ── GRID LAYOUTS ── */
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
.grid-team { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }

/* ── UTILITY ── */
.flex { display:flex; } .fac { align-items:center; } .fjb { justify-content:space-between; } .fcol { flex-direction:column; } .fwrap { flex-wrap:wrap; }
.gap4{gap:4px;} .gap6{gap:6px;} .gap8{gap:8px;} .gap10{gap:10px;} .gap12{gap:12px;} .gap16{gap:16px;}
.mt8{margin-top:8px;} .mt12{margin-top:12px;} .mt16{margin-top:16px;} .mt20{margin-top:20px;}
.mb6{margin-bottom:6px;} .mb8{margin-bottom:8px;} .mb12{margin-bottom:12px;} .mb16{margin-bottom:16px;}
.muted{color:var(--muted);} .light{color:var(--light);} .gold{color:var(--gold);}
.mono{font-family:'JetBrains Mono',monospace;font-size:.92em;} .serif{font-family:'Cormorant Garamond',serif;}
.tag{display:inline-flex;padding:2px 8px;border-radius:4px;font-size:10px;background:var(--card2);color:var(--text);border:1px solid var(--border);}
.section-hd{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--light);margin-bottom:12px;}
.divider{height:1px;background:var(--border);margin:14px 0;}
.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);}
.conflict-ok{background:var(--green3);border:1px solid rgba(53,196,122,.25);color:var(--green);padding:12px 14px;border-radius:var(--r8);font-size:12.5px;line-height:1.7;}
.conflict-warn{background:var(--red3);border:1px solid rgba(223,79,95,.25);color:var(--red);padding:12px 14px;border-radius:var(--r8);font-size:12.5px;line-height:1.7;}
.link-box{font-family:'JetBrains Mono',monospace;font-size:11px;background:var(--card2);border:1px solid var(--border);border-radius:var(--r6);padding:8px 12px;color:var(--gold);word-break:break-all;}

/* ── COURT COLOURS ── */
.court-supreme{color:#c8a84c;} .court-appeal{color:#7c5cd4;} .court-high{color:#3672d4;} .court-mag{color:#35c47a;}

/* ══════════════════════════════════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ══════════════════════════════════════════════════════════════════════════ */

/* Tablet ≤ 900px */
@media(max-width:900px){
  .sidebar { position:fixed; top:0; left:0; height:100vh; z-index:300; transform:translateX(-100%); }
  .sidebar.open { transform:translateX(0); box-shadow:4px 0 30px rgba(0,0,0,.6); }
  .logo-close { display:flex; }
  .topbar-hamburger { display:flex; }
  .stats-row.cols-4 { grid-template-columns:repeat(2,1fr); }
  .stats-row.cols-3 { grid-template-columns:repeat(2,1fr); }
  .grid2,.grid3 { grid-template-columns:1fr; }
  .form-row,.form-row3 { grid-template-columns:1fr; }
  .grid-team { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); }
  .topbar-right .btn-gold { display:none; }
  .modal-xl,.modal-lg { width:100%; }
  .content { padding:14px 15px; }
}

/* Mobile ≤ 600px */
@media(max-width:600px){
  .stats-row.cols-4,.stats-row.cols-3,.stats-row.cols-2 { grid-template-columns:1fr 1fr; }
  .s-val { font-size:22px; }
  .s-sub { display:none; }
  .bottom-nav { display:flex; }
  .content { padding:12px 12px 70px; }
  .topbar { padding:0 12px; }
  .topbar-title { font-size:16px; }
  .tbl-wrap table { min-width:480px; }
  .modal-hd { padding:14px 15px 10px; }
  .modal-body { padding:15px; }
  .modal-title { font-size:17px; }
  .kan-col { min-width:170px; max-width:170px; }
  .ev-grid { grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); }
  .cal-cell { min-height:54px; padding:3px; }
  .cal-ev { display:none; }
  .cal-num { font-size:12px; }
  .chat-wrap { height:300px; }
  .btn-sm { padding:6px 10px; }
  .section-hd { font-size:14px; }
  .grid-team { grid-template-columns:1fr 1fr; }
}

/* Very small ≤ 380px */
@media(max-width:380px){
  .stats-row { grid-template-columns:1fr 1fr; }
  .ev-grid { grid-template-columns:repeat(3,1fr); }
}

/* ── AUTH / LOGIN ── */
.auth-bg {
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:var(--ink);
  background-image:radial-gradient(ellipse at 20% 50%, rgba(201,168,76,.06) 0%, transparent 60%),
                   radial-gradient(ellipse at 80% 20%, rgba(54,114,212,.05) 0%, transparent 50%);
  padding:20px;
}
.auth-card {
  width:420px; max-width:100%;
  background:var(--panel); border:1px solid var(--border); border-radius:var(--r16);
  box-shadow:0 20px 60px rgba(0,0,0,.6); overflow:hidden; animation:slideUp .3s ease;
}
.auth-header {
  padding:30px 32px 24px; border-bottom:1px solid var(--border);
  background:linear-gradient(135deg,rgba(201,168,76,.07),rgba(54,114,212,.05));
  text-align:center;
}
.auth-logo { width:52px; height:52px; background:linear-gradient(135deg,var(--gold),var(--gold2)); border-radius:var(--r12); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 14px; }
.auth-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:700; color:var(--gold); }
.auth-sub { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:4px; }
.auth-body { padding:28px 32px 32px; }
.auth-error { background:var(--red3); border:1px solid rgba(223,79,95,.3); color:var(--red); padding:10px 14px; border-radius:var(--r6); font-size:12.5px; margin-bottom:16px; }
.auth-body .form-group { margin-bottom:16px; }
.auth-body input { font-size:14px; padding:11px 14px; }
.auth-footer { padding:16px 32px 24px; text-align:center; border-top:1px solid var(--border); background:var(--deep); }
.role-pills { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:10px; }
.role-pill { font-size:10px; padding:3px 10px; border-radius:10px; border:1px solid var(--border); color:var(--muted); }
.role-pill.rp-admin { border-color:rgba(201,168,76,.4); color:var(--gold); background:var(--gold4); }
.role-pill.rp-lawyer { border-color:rgba(54,114,212,.4); color:var(--blue2); background:var(--blue3); }
.role-pill.rp-paralegal { border-color:rgba(26,176,160,.4); color:var(--teal); background:var(--teal3); }

/* ── USER MANAGEMENT PAGE ── */
.um-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; margin-top:16px; }
.um-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r10); padding:16px; display:flex; align-items:center; gap:12px; }
.um-card:hover { border-color:var(--border2); }
.um-info { flex:1; min-width:0; }
.um-name { font-size:13.5px; font-weight:500; color:var(--light); }
.um-meta { font-size:11px; color:var(--muted); margin-top:2px; }
.um-actions { display:flex; gap:6px; }
.logout-btn { display:flex; align-items:center; gap:6px; padding:6px 10px; border-radius:var(--r6); background:transparent; border:1px solid var(--border); color:var(--muted); cursor:pointer; font-size:11px; font-family:'Outfit',sans-serif; transition:all .13s; width:100%; margin-top:8px; }
.logout-btn:hover { border-color:var(--red); color:var(--red); background:var(--red3); }

/* ── TOAST NOTIFICATIONS ── */
.toast-container { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
.toast { display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:var(--r8); font-size:12.5px; font-family:'Outfit',sans-serif; box-shadow:0 8px 30px rgba(0,0,0,.5); pointer-events:auto; animation:toastIn .25s cubic-bezier(.34,1.56,.64,1); min-width:260px; max-width:360px; }
.toast-exit { animation:toastOut .2s ease forwards; }
@keyframes toastIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes toastOut { from { transform:translateX(0); opacity:1; } to { transform:translateX(120%); opacity:0; } }
.toast-success { background:#1a2e22; border:1px solid rgba(53,196,122,.35); color:var(--green); }
.toast-error   { background:#2e1a1d; border:1px solid rgba(223,79,95,.35); color:var(--red); }
.toast-info    { background:#1a2036; border:1px solid rgba(54,114,212,.35); color:var(--blue2); }
.toast-warn    { background:#2e2318; border:1px solid rgba(219,140,37,.35); color:var(--amber); }
.toast-icon { font-size:15px; flex-shrink:0; }
.toast-close { margin-left:auto; background:none; border:none; color:currentColor; cursor:pointer; opacity:.6; font-size:14px; padding:0; line-height:1; flex-shrink:0; }
.toast-close:hover { opacity:1; }

/* ── CONFIRM DIALOG ── */
.confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; z-index:500; backdrop-filter:blur(4px); animation:fadeIn .15s ease; }
.confirm-box { background:var(--panel); border:1px solid var(--border); border-radius:var(--r12); padding:24px; width:380px; max-width:calc(100vw - 32px); box-shadow:var(--shadow); animation:slideUp .18s ease; }
.confirm-title { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:600; color:var(--light); margin-bottom:8px; }
.confirm-msg { font-size:12.5px; color:var(--text); line-height:1.6; margin-bottom:20px; }
.confirm-btns { display:flex; gap:8px; justify-content:flex-end; }

/* ── PROFILE / SETTINGS ── */
.pw-strength { height:3px; border-radius:2px; margin-top:5px; transition:all .2s; }
.pw-w { background:var(--red); width:25%; }
.pw-ok { background:var(--amber); width:60%; }
.pw-strong { background:var(--green); width:100%; }
.pw-input-wrap { position:relative; }
.pw-input-wrap input { padding-right:38px; }
.pw-toggle { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--muted); cursor:pointer; font-size:14px; padding:0; }
.pw-toggle:hover { color:var(--text); }

/* ── INVOICE FORM ── */
.inv-line { display:grid; grid-template-columns:1fr 60px 90px 80px 28px; gap:8px; align-items:start; margin-bottom:8px; }

/* ── MISC UTILITY ── */
.mb12 { margin-bottom:12px; }
.mb20 { margin-bottom:20px; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// KENYAN LAW SEED DATA
// ═══════════════════════════════════════════════════════════════════════════

const TEAM_SEED = []; // derived from users below

const CLIENTS = [];

const CASES = [];

const TIME_ENTRIES = [];

const INVOICES = [];

const TASKS = [];

const COMMS = [];

const EVENTS = [];

const TEMPLATES = [
  {id:1,name:"Client Engagement Letter",cat:"Onboarding",desc:"LSK-compliant retainer & engagement agreement"},
  {id:2,name:"Notice of Motion",cat:"Litigation",desc:"Standard Notice of Motion with supporting affidavit"},
  {id:3,name:"Pre-Litigation Demand Letter",cat:"Civil",desc:"Formal demand letter before suit"},
  {id:4,name:"Sworn Witness Statement",cat:"Evidence",desc:"Sworn statement under the Evidence Act Cap. 80"},
  {id:5,name:"Non-Disclosure Agreement",cat:"Corporate",desc:"Confidentiality agreement — Companies Act 2015"},
  {id:6,name:"Affidavit of Service",cat:"Procedure",desc:"Proof of service under Order 5 CPR"},
  {id:7,name:"Consent / Settlement Agreement",cat:"Civil",desc:"Full and final settlement deed"},
  {id:8,name:"Power of Attorney",cat:"Onboarding",desc:"General and limited power of attorney"},
  {id:9,name:"Plaint (Civil Suit)",cat:"Litigation",desc:"Standard Plaint under Order 4 Civil Procedure Rules"},
  {id:10,name:"Statutory Declaration",cat:"General",desc:"Statutory declaration under Oaths & Statutory Declarations Act"},
];

const LEGAL_SPECIALIZATIONS = [
  "Criminal Law","Civil Litigation","Land & Property Law","Family Law",
  "Corporate & Commercial Law","Employment Law","Constitutional Law",
  "Intellectual Property","Immigration Law","Probate & Succession",
  "Banking & Finance","Tax Law","Environmental Law","Human Rights",
  "Arbitration & Mediation","Evidence & Forensics","Document Management",
  "Digital Evidence","General Practice"
];

const KE_COURTS = ["High Court – Nairobi","High Court – Mombasa","High Court – Kisumu","High Court – Nakuru","Court of Appeal – Nairobi","Environment & Land Court – Nairobi","Environment & Land Court – Thika","Employment & Labour Relations Court","Chief Magistrate's Court – Nairobi","Senior Resident Magistrate's Court","Kadhi's Court – Nairobi","Supreme Court of Kenya"];
const KE_COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Nyeri","Machakos","Meru","Garissa","Kisii","Kakamega"];
const CASE_TYPES = ["Criminal","Civil","Land / Property","Employment","Family","Commercial","Judicial Review","Constitutional","Probate","Immigration"];

// ═══════════════════════════════════════════════════════════════════════════
// AUTH — USERS, ROLES & ACCESS CONTROL
// ═══════════════════════════════════════════════════════════════════════════

const ROLE_ACCESS = {
  admin:    ["dashboard","pipeline","cases","tasks","calendar","evidence","clients","team","comms","billing","invoices","ai","reports","templates","conflict","users"],
  lawyer:   ["dashboard","pipeline","cases","tasks","calendar","evidence","clients","comms","billing","invoices","ai","templates","conflict"],
  paralegal:["tasks","calendar","evidence","comms","templates"],
};

const ROLE_LABELS = { admin:"Administrator", lawyer:"Advocate / Lawyer", paralegal:"Paralegal", client:"Client" };
const ROLE_COLORS = { admin:"b-gold", lawyer:"b-blue", paralegal:"b-teal", client:"b-purple" };
const AV_COLORS   = ["av-gold","av-blue","av-green","av-purple","av-teal","av-red"];
const LS_USERS    = "hakipro_users";
const LS_SESSION  = "hakipro_session";
const LS_DATA     = "hakipro_appdata";

// ── Persistence helpers ───────────────────────────────────────────────────────
function loadUsers() {
  try { const r = localStorage.getItem(LS_USERS); if (r) return JSON.parse(r); } catch {}
  return null;
}
function saveUsers(users) {
  try { localStorage.setItem(LS_USERS, JSON.stringify(users)); } catch {}
}
function loadSession() {
  try { const r = localStorage.getItem(LS_SESSION); if (r) return JSON.parse(r); } catch {}
  return null;
}
function saveSession(user) {
  try {
    if (user) localStorage.setItem(LS_SESSION, JSON.stringify(user));
    else       localStorage.removeItem(LS_SESSION);
  } catch {}
}
function loadAppData() {
  try { const r = localStorage.getItem(LS_DATA); if (r) return JSON.parse(r); } catch {}
  return null;
}
function saveAppData(data) {
  try { localStorage.setItem(LS_DATA, JSON.stringify(data)); } catch {}
}
function todayStr() {
  return new Date().toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" });
}
function todayMonthYear() {
  const n = new Date();
  return { month: n.getMonth(), year: n.getFullYear() };
}

// Simple hash — not cryptographic, but keeps plain-text passwords out of storage
function hashPw(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return "hkp_" + Math.abs(h).toString(36) + "_" + pw.length;
}

// ── First-Run Setup Screen ────────────────────────────────────────────────────
function SetupScreen({ onSetupComplete }) {
  const [f, setF] = useState({ name:"", username:"", password:"", confirm:"" });
  const [err, setErr] = useState("");
  const set = (k,v) => { setF(p=>({...p,[k]:v})); setErr(""); };

  const submit = () => {
    if (!f.name.trim())          return setErr("Full name is required.");
    if (!f.username.trim())      return setErr("Username is required.");
    if (f.password.length < 6)   return setErr("Password must be at least 6 characters.");
    if (f.password !== f.confirm)return setErr("Passwords do not match.");
    const init = f.name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const admin = { id:1, name:f.name.trim(), username:f.username.trim().toLowerCase(),
                    passwordHash:hashPw(f.password), role:"admin", av:"av-gold", init, active:true };
    const users = [admin];
    saveUsers(users);
    saveSession(admin);
    onSetupComplete(users, admin);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚖</div>
          <div className="auth-title">HakiPro</div>
          <div className="auth-sub">First-Time Setup</div>
        </div>
        <div className="auth-body">
          <div style={{background:"var(--blue3)",border:"1px solid rgba(54,114,212,.25)",borderRadius:"var(--r8)",padding:"10px 14px",marginBottom:16,fontSize:12,color:"var(--blue2)"}}>
            👋 Welcome! Create your administrator account to get started. You can add lawyers and paralegals from the dashboard later.
          </div>
          {err && <div className="auth-error">⚠ {err}</div>}
          <div className="form-group">
            <label>Full Name *</label>
            <input placeholder="e.g. Jane Kariuki" value={f.name} onChange={e=>set("name",e.target.value)} autoFocus />
          </div>
          <div className="form-group">
            <label>Username *</label>
            <input placeholder="e.g. admin or jane.kariuki" value={f.username} onChange={e=>set("username",e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Min. 6 characters" value={f.password} onChange={e=>set("password",e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" placeholder="Repeat password" value={f.confirm} onChange={e=>set("confirm",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
            </div>
          </div>
          <button className="btn btn-gold btn-full" style={{marginTop:8,padding:"12px"}} onClick={submit}>
            Create Admin Account →
          </button>
        </div>
        <div className="auth-footer">
          <div className="muted" style={{fontSize:11}}>Your credentials are saved securely in your browser. You can create additional users after signing in.</div>
        </div>
      </div>
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ users, onLogin, onResetApp }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");

  const attempt = () => {
    const uname = username.trim().toLowerCase();
    const u = users.find(u => u.username === uname && u.passwordHash === hashPw(password) && u.active);
    if (u) { onLogin(u); }
    else   { setError("Incorrect username or password."); }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">⚖</div>
          <div className="auth-title">HakiPro</div>
          <div className="auth-sub">Kenya Legal Management System</div>
        </div>
        <div className="auth-body">
          {error && <div className="auth-error">⚠ {error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input
              placeholder="Enter your username"
              value={username}
              onChange={e=>{ setUsername(e.target.value); setError(""); }}
              onKeyDown={e=>e.key==="Enter"&&document.getElementById("hkp-pw").focus()}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{position:"relative"}}>
              <input
                id="hkp-pw"
                type={showPw?"text":"password"}
                placeholder="Enter your password"
                value={password}
                style={{paddingRight:40}}
                onChange={e=>{ setPassword(e.target.value); setError(""); }}
                onKeyDown={e=>e.key==="Enter"&&attempt()}
              />
              <button
                onClick={()=>setShowPw(s=>!s)}
                style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14,padding:0}}
              >{showPw?"🙈":"👁"}</button>
            </div>
          </div>
          <button className="btn btn-gold btn-full" style={{marginTop:8,padding:"12px"}} onClick={attempt}>
            Sign In →
          </button>
        </div>
        <div className="auth-footer">
          <div className="muted" style={{fontSize:11}}>
            Contact your administrator if you have forgotten your password.
          </div>
          <button
            onClick={onResetApp}
            style={{marginTop:10,background:"none",border:"none",color:"var(--muted)",fontSize:10,cursor:"pointer",textDecoration:"underline",opacity:.6}}
          >
            Reset app &amp; start over
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User Management View (Admin only) ────────────────────────────────────────
function UserManagementView({ users, setUsers, currentUser }) {
  const [showAdd, setShowAdd]   = useState(false);
  const [resetId, setResetId]   = useState(null);
  const [newPw,   setNewPw]     = useState("");
  const [formErr, setFormErr]   = useState("");
  const [f, setF] = useState({ name:"", username:"", password:"", role:"lawyer", lsk:"", spec:"General Practice", rate:"" });
  const set = (k,v) => setF(p=>({...p,[k]:v}));

  const persist = (updated) => { saveUsers(updated); setUsers(updated); };

  const addUser = () => {
    if (!f.name || !f.username || !f.password) return setFormErr("Name, username and password are required.");
    if (f.password.length < 6) return setFormErr("Password must be at least 6 characters.");
    if (users.find(u=>u.username===f.username.toLowerCase())) return setFormErr("Username already exists.");
    const init = f.name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const av   = AV_COLORS[users.length % AV_COLORS.length];
    const newUser = { id: Date.now(), name:f.name.trim(), username:f.username.trim().toLowerCase(),
                      passwordHash:hashPw(f.password), role:f.role, lsk:f.lsk||undefined,
                      spec:f.spec||"General Practice", rate:parseInt(f.rate)||0, init, av, active:true };
    persist([...users, newUser]);
    setF({ name:"", username:"", password:"", role:"lawyer", lsk:"", spec:"General Practice", rate:"" });
    setFormErr("");
    setShowAdd(false);
    toast(`User "${f.name.trim()}" created successfully.`, "success");
  };

  const toggleActive = (id) => {
    if (id === currentUser.id) return;
    const u = users.find(x=>x.id===id);
    persist(users.map(x => x.id===id ? {...x, active:!x.active} : x));
    toast(`${u?.name} ${u?.active ? "deactivated" : "activated"}.`, "info");
  };

  const deleteUser = (id) => {
    if (id === currentUser.id) return;
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    persist(users.filter(u => u.id !== id));
    toast("User deleted.", "info");
  };

  const doResetPw = (id) => {
    if (newPw.length < 6) return;
    persist(users.map(u => u.id===id ? {...u, passwordHash:hashPw(newPw)} : u));
    setResetId(null); setNewPw("");
    toast("Password reset successfully.", "success");
  };

  return (
    <div>
      <div className="flex fac fjb mb16">
        <div>
          <div className="section-hd">User Management</div>
          <div className="muted" style={{fontSize:11}}>Create and manage firm users — lawyers, paralegals, and administrators</div>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => { setShowAdd(s=>!s); setFormErr(""); }}>
          {showAdd ? "✕ Cancel" : "+ Add User"}
        </button>
      </div>

      {showAdd && (
        <div className="card mb16">
          <div className="card-hd"><span className="card-title">New User Account</span></div>
          <div className="card-body">
            {formErr && <div className="auth-error mb12">⚠ {formErr}</div>}
            <div className="form-row">
              <div className="form-group"><label>Full Name *</label><input placeholder="e.g. Jane Otieno" value={f.name} onChange={e=>set("name",e.target.value)} /></div>
              <div className="form-group"><label>Username *</label><input placeholder="e.g. jane.otieno" value={f.username} onChange={e=>set("username",e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Password * (min 6 chars)</label><input type="password" placeholder="Temporary password" value={f.password} onChange={e=>set("password",e.target.value)} /></div>
              <div className="form-group">
                <label>Role *</label>
                <select value={f.role} onChange={e=>set("role",e.target.value)}>
                  <option value="lawyer">Advocate / Lawyer</option>
                  <option value="paralegal">Paralegal</option>
                  <option value="admin">Administrator</option>
                  <option value="client">Client (Read-only)</option>
                </select>
              </div>
            </div>
            {f.role === "lawyer" && (
              <div className="form-group" style={{maxWidth:280}}><label>LSK Number</label><input placeholder="LSK/YYYY/XXXX" value={f.lsk} onChange={e=>set("lsk",e.target.value)} /></div>
            )}
            {["lawyer","paralegal"].includes(f.role) && (
              <div className="form-row">
                <div className="form-group">
                  <label>Specialization</label>
                  <select value={f.spec} onChange={e=>set("spec",e.target.value)}>
                    {LEGAL_SPECIALIZATIONS.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Rate (KES / hr)</label><input type="number" placeholder="e.g. 15000" value={f.rate} onChange={e=>set("rate",e.target.value)} /></div>
              </div>
            )}
            <div className="flex gap8" style={{justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>{ setShowAdd(false); setFormErr(""); }}>Cancel</button>
              <button className="btn btn-gold" onClick={addUser}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {["admin","lawyer","paralegal","client"].map(role => {
        const group = users.filter(u => u.role === role);
        if (!group.length) return null;
        return (
          <div key={role} className="mb16">
            <div className="flex fac gap8 mb8">
              <span className={`badge ${ROLE_COLORS[role]||"b-purple"}`}>{(ROLE_LABELS[role]||role)+"s"}</span>
              <span className="muted" style={{fontSize:11}}>{group.length} user{group.length!==1?"s":""}</span>
            </div>
            <div className="um-grid">
              {group.map(u => (
                <div key={u.id} className="um-card" style={{opacity:u.active?1:0.55,flexDirection:"column",alignItems:"stretch",gap:10}}>
                  <div className="flex fac gap10">
                    <div className={`av ${u.av}`}>{u.init}</div>
                    <div className="um-info">
                      <div className="um-name">{u.name} {u.id===currentUser.id&&<span className="muted" style={{fontSize:10}}>(you)</span>}</div>
                      <div className="um-meta">@{u.username}{u.lsk?` · ${u.lsk}`:""}</div>
                      {u.spec&&u.spec!=="General Practice"&&<div style={{fontSize:10,color:"var(--teal)",marginTop:1}}>{u.spec}</div>}
                      {u.rate>0&&<div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>KES {u.rate.toLocaleString()}/hr</div>}
                      <span className={`badge ${u.active?"b-green":"b-gray"}`} style={{fontSize:9,marginTop:3,display:"inline-flex"}}>{u.active?"Active":"Inactive"}</span>
                    </div>
                  </div>
                  {resetId===u.id ? (
                    <div className="flex gap6" style={{marginTop:2}}>
                      <input type="password" placeholder="New password (min 6)" value={newPw} onChange={e=>setNewPw(e.target.value)} style={{fontSize:11,padding:"5px 8px"}} />
                      <button className="btn btn-gold btn-xs" onClick={()=>doResetPw(u.id)}>Set</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{setResetId(null);setNewPw("");}}>✕</button>
                    </div>
                  ) : u.id!==currentUser.id && (
                    <div className="flex gap6" style={{flexWrap:"wrap"}}>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{setResetId(u.id);setNewPw("");}}>🔑 Reset PW</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>toggleActive(u.id)}>{u.active?"⊘ Deactivate":"✓ Activate"}</button>
                      <button className="btn btn-red btn-xs" onClick={()=>deleteUser(u.id)}>✕ Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="card mt16">
        <div className="card-hd"><span className="card-title">Access Control Matrix</span></div>
        <div className="card-body">
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Page / Module</th><th>Administrator</th><th>Lawyer</th><th>Paralegal</th></tr></thead>
              <tbody>
                {[
                  ["Dashboard",        true,true,false],
                  ["Case Pipeline",    true,true,false],
                  ["Cases",            true,true,false],
                  ["Tasks",            true,true,true],
                  ["Court Calendar",   true,true,true],
                  ["Evidence Vault",   true,true,true],
                  ["Clients",          true,true,false],
                  ["Advocates & Staff",true,false,false],
                  ["Communications",   true,true,true],
                  ["Time & Billing",   true,true,false],
                  ["Invoices",         true,true,false],
                  ["HakiAI Tools",     true,true,false],
                  ["Reports",          true,false,false],
                  ["Doc Templates",    true,true,true],
                  ["Conflict Checker", true,true,false],
                  ["User Management",  true,false,false],
                ].map(([page,...perms]) => (
                  <tr key={page}>
                    <td style={{fontSize:12.5}}>{page}</td>
                    {perms.map((ok,i)=>(
                      <td key={i} style={{textAlign:"center"}}>
                        <span style={{color:ok?"var(--green)":"var(--red)",fontSize:14}}>{ok?"✓":"✕"}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

// ── Toast System ─────────────────────────────────────────────────────────────
let _toastListeners = [];
function toast(msg, type = "success") {
  const id = Date.now() + Math.random();
  _toastListeners.forEach(fn => fn({ id, msg, type }));
}
function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, { ...t, exiting: false }]);
      setTimeout(() => {
        setToasts(prev => prev.map(x => x.id === t.id ? { ...x, exiting: true } : x));
        setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 220);
      }, 3500);
    };
    _toastListeners.push(handler);
    return () => { _toastListeners = _toastListeners.filter(fn => fn !== handler); };
  }, []);
  const icons = { success:"✓", error:"⚠", info:"ℹ", warn:"⚡" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}${t.exiting ? " toast-exit" : ""}`}>
          <span className="toast-icon">{icons[t.type] || "✓"}</span>
          <span style={{flex:1}}>{t.msg}</span>
          <button className="toast-close" onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, confirmLabel = "Confirm", danger = false, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-title">{title}</div>
        <div className="confirm-msg">{message}</div>
        <div className="confirm-btns">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? "btn-red" : "btn-gold"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Profile / Change Password Modal ───────────────────────────────────────────
function ProfileModal({ currentUser, users, setUsers, setCurrentUser, onClose }) {
  const [tab, setTab]           = useState("info");
  const [cur, setCur]           = useState("");
  const [nw,  setNw]            = useState("");
  const [conf, setConf]         = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNw,   setShowNw]   = useState(false);
  const [err, setErr]           = useState("");

  const pwStrength = (p) => {
    if (!p) return null;
    if (p.length < 6) return "pw-w";
    if (p.length < 10 || !/[0-9]/.test(p)) return "pw-ok";
    return "pw-strong";
  };

  const changePw = () => {
    setErr("");
    if (hashPw(cur) !== currentUser.passwordHash) return setErr("Current password is incorrect.");
    if (nw.length < 6) return setErr("New password must be at least 6 characters.");
    if (nw !== conf) return setErr("Passwords do not match.");
    const updated = users.map(u => u.id === currentUser.id ? { ...u, passwordHash: hashPw(nw) } : u);
    saveUsers(updated);
    setUsers(updated);
    const updatedUser = { ...currentUser, passwordHash: hashPw(nw) };
    saveSession(updatedUser);
    setCurrentUser(updatedUser);
    toast("Password changed successfully.", "success");
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{width:480}} onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div>
            <div className="modal-title">My Profile</div>
            <div className="modal-sub">Account settings and security</div>
          </div>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tabs" style={{marginBottom:20}}>
            {["info","security"].map(t => (
              <div key={t} className={`tab${tab===t?" on":""}`} onClick={() => setTab(t)}>
                {t === "info" ? "Account Info" : "Change Password"}
              </div>
            ))}
          </div>

          {tab === "info" && (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:16,background:"var(--card)",borderRadius:"var(--r10)",border:"1px solid var(--border)"}}>
                <div className={`av ${currentUser.av}`} style={{width:48,height:48,fontSize:18}}>{currentUser.init}</div>
                <div>
                  <div style={{fontSize:16,fontWeight:600,color:"var(--light)"}}>{currentUser.name}</div>
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>@{currentUser.username}</div>
                  <span className={`badge ${ROLE_COLORS[currentUser.role]}`} style={{marginTop:6,display:"inline-flex"}}>{ROLE_LABELS[currentUser.role]}</span>
                </div>
              </div>
              {currentUser.lsk && (
                <div className="form-group">
                  <label>LSK Registration Number</label>
                  <div style={{padding:"9px 12px",background:"var(--panel)",border:"1px solid var(--border)",borderRadius:"var(--r6)",fontSize:13,color:"var(--gold)",fontFamily:"'JetBrains Mono',monospace"}}>{currentUser.lsk}</div>
                </div>
              )}
              <div className="form-group">
                <label>Account Status</label>
                <div style={{padding:"9px 12px",background:"var(--panel)",border:"1px solid var(--border)",borderRadius:"var(--r6)",fontSize:13}}>
                  <span className="badge b-green">Active</span>
                </div>
              </div>
              <div className="form-group">
                <label>Access Level</label>
                <div style={{padding:"9px 12px",background:"var(--panel)",border:"1px solid var(--border)",borderRadius:"var(--r6)",fontSize:12.5,color:"var(--text)"}}>
                  {ROLE_ACCESS[currentUser.role]?.length || 0} pages accessible
                </div>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div>
              {err && <div className="auth-error mb12">⚠ {err}</div>}
              <div className="form-group">
                <label>Current Password</label>
                <div className="pw-input-wrap">
                  <input type={showCur?"text":"password"} placeholder="Enter current password" value={cur} onChange={e=>{setCur(e.target.value);setErr("");}} />
                  <button className="pw-toggle" onClick={()=>setShowCur(s=>!s)}>{showCur?"🙈":"👁"}</button>
                </div>
              </div>
              <div className="form-group">
                <label>New Password (min 6 characters)</label>
                <div className="pw-input-wrap">
                  <input type={showNw?"text":"password"} placeholder="Choose a strong password" value={nw} onChange={e=>{setNw(e.target.value);setErr("");}} />
                  <button className="pw-toggle" onClick={()=>setShowNw(s=>!s)}>{showNw?"🙈":"👁"}</button>
                </div>
                {nw && <div className={`pw-strength ${pwStrength(nw)}`} />}
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Repeat new password" value={conf} onChange={e=>{setConf(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&changePw()} />
              </div>
              <div className="flex gap8" style={{justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                <button className="btn btn-gold" onClick={changePw}>Update Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── New Invoice Modal ─────────────────────────────────────────────────────────
function NewInvoiceModal({ setInvoices, clients, cases, onClose }) {
  const [clientName, setClientName] = useState(clients[0]?.name || "");
  const [caseId, setCaseId]         = useState(cases[0]?.id || "");
  const [lines, setLines] = useState([{ desc:"", hrs:1, rate:15000, amt:15000 }]);
  const [vat, setVat] = useState(true);

  const today = new Date();
  const due   = new Date(today); due.setDate(due.getDate() + 30);
  const fmtDate = d => d.toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"});

  const updateLine = (i, k, v) => {
    setLines(ls => ls.map((l, idx) => {
      if (idx !== i) return l;
      const upd = { ...l, [k]: v };
      if (k === "hrs" || k === "rate") upd.amt = parseFloat(upd.hrs||0) * parseFloat(upd.rate||0);
      return upd;
    }));
  };
  const addLine    = () => setLines(ls => [...ls, { desc:"", hrs:1, rate:15000, amt:15000 }]);
  const removeLine = i  => setLines(ls => ls.filter((_,idx) => idx !== i));

  const subtotal = lines.reduce((a, l) => a + (l.amt||0), 0);
  const vatAmt   = vat ? Math.round(subtotal * 0.16) : 0;
  const total    = subtotal + vatAmt;

  const submit = () => {
    if (!clientName || !lines[0]?.desc) return;
    const yr  = today.getFullYear();
    const num = String(Math.floor(Math.random()*9000)+1000);
    setInvoices(invs => [...invs, {
      id:`HKP/INV/${yr}/${num}`, client:clientName, caseId,
      amount:total, issued:fmtDate(today), due:fmtDate(due),
      status:"Pending", vat, items:lines
    }]);
    toast("Invoice created successfully.", "success");
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-hd">
          <div><div className="modal-title">Create Invoice</div><div className="modal-sub">LSK-compliant fee note — VAT 16%</div></div>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Client *</label>
              <select value={clientName} onChange={e=>setClientName(e.target.value)}>
                {clients.map(c=><option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Matter</label>
              <select value={caseId} onChange={e=>setCaseId(e.target.value)}>
                {cases.map(c=><option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Issue Date</label><input value={fmtDate(today)} readOnly style={{opacity:.7}} /></div>
            <div className="form-group"><label>Due Date (30 days)</label><input value={fmtDate(due)} readOnly style={{opacity:.7}} /></div>
          </div>

          <div className="section-hd" style={{marginTop:8}}>Line Items</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 80px 28px",gap:8,marginBottom:6}}>
            {["Description","Hrs","Rate (KES)","Amount",""].map(h=><div key={h} style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"var(--muted)",fontWeight:600}}>{h}</div>)}
          </div>
          {lines.map((l,i)=>(
            <div key={i} className="inv-line">
              <input placeholder="Service description" value={l.desc} onChange={e=>updateLine(i,"desc",e.target.value)} />
              <input type="number" step="0.5" min="0" value={l.hrs} onChange={e=>updateLine(i,"hrs",e.target.value)} />
              <input type="number" step="1000" min="0" value={l.rate} onChange={e=>updateLine(i,"rate",e.target.value)} />
              <div style={{padding:"9px 12px",background:"var(--panel)",border:"1px solid var(--border)",borderRadius:"var(--r6)",fontSize:12.5,color:"var(--light)",textAlign:"right"}}>
                {(l.amt||0).toLocaleString()}
              </div>
              <button className="btn btn-red btn-xs" style={{alignSelf:"flex-start",marginTop:2}} onClick={()=>removeLine(i)} disabled={lines.length===1}>✕</button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm mb16" onClick={addLine}>+ Add Line</button>

          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--r8)",padding:14}}>
            <div className="flex fjb" style={{marginBottom:6,fontSize:12.5}}>
              <span className="muted">Subtotal</span>
              <span className="mono light">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex fjb fac" style={{marginBottom:6,fontSize:12.5}}>
              <label style={{letterSpacing:"normal",textTransform:"none",fontSize:12.5,color:"var(--text)",margin:0,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                <input type="checkbox" checked={vat} onChange={e=>setVat(e.target.checked)} style={{width:"auto"}} /> VAT (16%)
              </label>
              <span className="mono muted">KES {vatAmt.toLocaleString()}</span>
            </div>
            <div className="flex fjb" style={{borderTop:"1px solid var(--border)",paddingTop:8,fontSize:14}}>
              <span className="light" style={{fontWeight:600}}>Total</span>
              <span className="mono" style={{color:"var(--gold)",fontSize:16,fontFamily:"'Cormorant Garamond',serif"}}>KES {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap8 mt16" style={{justifyContent:"flex-end"}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-gold" onClick={submit}>Create Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function HakiPro() {
  // ── Auth state — loaded from localStorage ─────────────────────
  const [users, setUsers]           = useState(() => loadUsers() || []);
  const [currentUser, setCurrentUser] = useState(() => {
    // Restore session only if the user still exists and is active
    const session = loadSession();
    const stored  = loadUsers();
    if (session && stored) {
      const live = stored.find(u => u.id === session.id && u.active);
      return live || null;
    }
    return null;
  });
  const isFirstRun = users.length === 0;

  // ── App state — persisted in localStorage ─────────────────────
  const [cases,       setCasesRaw]    = useState(() => loadAppData()?.cases       || CASES);
  const [clients,     setClientsRaw]  = useState(() => loadAppData()?.clients     || CLIENTS);
  const [tasks,       setTasksRaw]    = useState(() => loadAppData()?.tasks       || TASKS);
  const [timeEntries, setTimeRaw]     = useState(() => loadAppData()?.timeEntries || TIME_ENTRIES);
  const [invoices,    setInvoicesRaw] = useState(() => loadAppData()?.invoices    || INVOICES);
  const [comms,       setCommsRaw]    = useState(() => loadAppData()?.comms       || COMMS);
  const [events,      setEventsRaw]   = useState(() => loadAppData()?.events      || EVENTS);
  const [evidence,    setEvidenceRaw]  = useState(() => loadAppData()?.evidence     || {});

  // Wrap setters so they auto-persist
  const persist = useCallback((key, setter) => (updater) => {
    setter(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Schedule async persist to avoid blocking render
      setTimeout(() => {
        const cur = loadAppData() || {};
        saveAppData({ ...cur, [key]: next });
      }, 0);
      return next;
    });
  }, []);

  const setCases       = persist("cases",       setCasesRaw);
  const setClients     = persist("clients",     setClientsRaw);
  const setTasks       = persist("tasks",       setTasksRaw);
  const setTimeEntries = persist("timeEntries", setTimeRaw);
  const setInvoices    = persist("invoices",    setInvoicesRaw);
  const setComms       = persist("comms",       setCommsRaw);
  const setEvents      = persist("events",      setEventsRaw);
  const setEvidence    = persist("evidence",    setEvidenceRaw);

  // Derive TEAM dynamically from registered users
  const TEAM = useMemo(() => users.filter(u => u.active).map(u => ({
    id:u.id, name:u.name, role:ROLE_LABELS[u.role]||u.role,
    init:u.init, av:u.av, spec:u.spec||"General Practice",
    lsk:u.lsk||"—", rate:u.rate||0, active:u.active,
  })), [users]);

  const [view, setView]           = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal]         = useState(null);
  const [sel,   setSel]           = useState(null);
  const [aiChat, setAiChat]       = useState([]);
  const [aiMsg,  setAiMsg]        = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef(null);
  const unread       = comms.filter(c => !c.read).length;
  const pendingTasks = tasks.filter(t => !t.done).length;

  // ── 30-min session timeout ────────────────────────────────────────
  const lastActivity = useRef(Date.now());
  useEffect(() => {
    const bump = () => { lastActivity.current = Date.now(); };
    window.addEventListener("mousemove", bump);
    window.addEventListener("keydown", bump);
    const timer = setInterval(() => {
      if (currentUser && Date.now() - lastActivity.current > 30 * 60 * 1000) {
        saveSession(null); setCurrentUser(null);
        toast("Session expired — please sign in again.", "warn");
      }
    }, 60000);
    return () => { window.removeEventListener("mousemove", bump); window.removeEventListener("keydown", bump); clearInterval(timer); };
  }, [currentUser]);

  // ── All hooks must come before any conditional return ────────────
  useEffect(() => {
    let s = document.getElementById("hkp-s");
    if (!s) { s = document.createElement("style"); s.id = "hkp-s"; document.head.appendChild(s); }
    s.textContent = STYLES;
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [aiChat]);

  const markAllRead = () => setComms(cs => cs.map(c => ({ ...c, read: true })));

  // Close sidebar on nav (mobile) — only navigate to allowed views
  const navigate = useCallback((id) => {
    if (!currentUser) return;
    const allowed = ROLE_ACCESS[currentUser.role] || [];
    if (allowed.includes(id)) { setView(id); setSidebarOpen(false); }
  }, [currentUser]);

  const callAI = useCallback(async (prompt, sys = "") => {
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: sys || "You are HakiAI, an expert legal AI built into HakiPro — a law firm management system for Kenyan advocates. You are deeply familiar with Kenyan law: the Constitution of Kenya 2010, Penal Code Cap. 63, Civil Procedure Act Cap. 21, Evidence Act Cap. 80, Land Registration Act 2012, Companies Act 2015, Employment Act 2007, and LSK professional conduct rules. Reference Kenyan statutes, case law (e.g. Republic v. Mwangi, Nairobi HCCR 12 of 2020), and court procedures accurately. Be concise, professional, and structured.",
          messages: [{ role: "user", content: prompt }]
        })
      });
      const d = await r.json();
      return d.content?.find(b => b.type === "text")?.text || "Unable to get response.";
    } catch { return "Network error. Please check your connection."; }
  }, []);

  const sendChat = async () => {
    if (!aiMsg.trim() || aiLoading) return;
    const m = aiMsg.trim(); setAiMsg("");
    setAiChat(c => [...c, { r: "u", t: m }]); setAiLoading(true);
    const rep = await callAI(m);
    setAiChat(c => [...c, { r: "a", t: rep }]); setAiLoading(false);
  };

  // ── Auth handlers ───────────────────────────────────────────────
  const handleSetupComplete = (newUsers, adminUser) => {
    setUsers(newUsers);
    setCurrentUser(adminUser);
    setView("dashboard");
  };

  const handleLogin = (user) => {
    // Re-fetch from store to ensure latest data (e.g. after password reset)
    const fresh = loadUsers()?.find(u => u.id === user.id) || user;
    saveSession(fresh);
    setCurrentUser(fresh);
    const allowed = ROLE_ACCESS[fresh.role] || [];
    setView(allowed[0] || "dashboard");
  };

  const handleLogout = () => {
    saveSession(null);
    setCurrentUser(null);
    setView("dashboard");
  };

  const handleResetApp = () => {
    if (!window.confirm("This will delete ALL users and data and reset the app. Are you sure?")) return;
    try {
      localStorage.removeItem(LS_USERS);
      localStorage.removeItem(LS_SESSION);
      localStorage.removeItem(LS_DATA);
    } catch {}
    setUsers([]);
    setCurrentUser(null);
  };

  // ── Data scoping — safe with null check so it can live before conditional returns ──
  const scope = useMemo(() => {
    if (!currentUser) return { cases, tasks, timeEntries, invoices, comms, clients, isScoped: false, caseIds: new Set() };
    const role = currentUser.role;
    const name = currentUser.name;
    if (role === "admin") {
      return { cases, tasks, timeEntries, invoices, comms, clients, isScoped: false, caseIds: new Set() };
    }
    if (role === "lawyer") {
      const myCases   = cases.filter(c => c.advocate === name);
      const myIds     = new Set(myCases.map(c => c.id));
      const myTasks   = tasks.filter(t => myIds.has(t.caseId) || t.assignee === name);
      const myTime    = timeEntries.filter(e => myIds.has(e.caseId) || e.advocate === name);
      const myInvs    = invoices.filter(i => myIds.has(i.caseId));
      const myComms   = comms.filter(c => myIds.has(c.caseId) || c.to === name || c.from === name);
      const myClients = clients.filter(cl => cl.attorney === name || myIds.has(cl.caseRef));
      return { cases: myCases, tasks: myTasks, timeEntries: myTime, invoices: myInvs,
               comms: myComms, clients: myClients, isScoped: true, caseIds: myIds };
    }
    if (role === "paralegal") {
      const myTasks = tasks.filter(t => t.assignee === name);
      const myIds   = new Set(myTasks.map(t => t.caseId).filter(Boolean));
      const myCases = cases.filter(c => myIds.has(c.id));
      const myComms = comms.filter(c => myIds.has(c.caseId) || c.to === name || c.from === name);
      return { cases: myCases, tasks: myTasks, timeEntries: [], invoices: [],
               comms: myComms, clients: [], isScoped: true, caseIds: myIds };
    }
    return { cases, tasks, timeEntries, invoices, comms, clients, isScoped: false, caseIds: new Set() };
  }, [currentUser, cases, tasks, timeEntries, invoices, comms, clients]);

  const scopedUnread       = scope.comms.filter(c => !c.read).length;
  const scopedPendingTasks = scope.tasks.filter(t => !t.done).length;

  const myEvents = useMemo(() => {
    if (!scope.isScoped) return events;
    const ids = scope.caseIds || new Set(scope.cases.map(c => c.id));
    return events.filter(e => !e.caseId || ids.has(e.caseId));
  }, [events, scope]);

  // ── Screen routing — MUST come after all hooks ──────────────────
  if (isFirstRun)   return <SetupScreen onSetupComplete={handleSetupComplete} />;
  if (!currentUser) return <LoginScreen users={users} onLogin={handleLogin} onResetApp={handleResetApp} />;

  const allowed = ROLE_ACCESS[currentUser.role] || [];
  const canSee  = (id) => allowed.includes(id);

  // Redirect to first allowed page if current view is not accessible
  const activeView = canSee(view) ? view : (allowed[0] || "dashboard");

  const NAV_ALL = [
    { section: "Overview" },
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "pipeline",  icon: "⬡", label: "Case Pipeline" },
    { section: "Case Management" },
    { id: "cases",    icon: "⚖", label: "Cases",          badge: cases.filter(c => c.status === "Active").length },
    { id: "tasks",    icon: "✓", label: "Tasks",           badge: tasks.filter(t=>!t.done).length },
    { id: "calendar", icon: "▦", label: "Court Calendar" },
    { id: "evidence", icon: "🔍", label: "Evidence Vault" },
    { section: "People" },
    { id: "clients",  icon: "◉", label: "Clients" },
    { id: "team",     icon: "◎", label: "Advocates & Staff" },
    { id: "comms",    icon: "✉", label: "Communications",  badge: comms.filter(c=>!c.read).length },
    { section: "Finance" },
    { id: "billing",  icon: "$", label: "Time & Billing" },
    { id: "invoices", icon: "◧", label: "Invoices" },
    { section: "Intelligence" },
    { id: "ai",        icon: "✦", label: "HakiAI Tools" },
    { id: "reports",   icon: "▤", label: "Reports" },
    { id: "templates", icon: "◫", label: "Doc Templates" },
    { id: "conflict",  icon: "⚠", label: "Conflict Checker" },
    { section: "Administration" },
    { id: "users",     icon: "👥", label: "User Management" },
  ];

  // Filter NAV items by current user's role
  const NAV = NAV_ALL.reduce((acc, n) => {
    if (n.section) {
      acc.push({ ...n, _pending: true }); // defer section headers
    } else if (canSee(n.id)) {
      // commit any pending section header
      const last = acc[acc.length - 1];
      if (last?._pending) last._pending = false;
      acc.push(n);
    } else {
      // drop item — if last was a pending section with no items after it, also drop it
    }
    return acc;
  }, []).filter((n, i, arr) => {
    if (!n.section) return true;
    // keep section only if there's a non-section item that follows before next section
    for (let j = i+1; j < arr.length; j++) {
      if (!arr[j].section) return true;
      if (arr[j].section)  return false;
    }
    return false;
  });

  // Bottom nav items (mobile) — role-filtered
  const BNAV_ALL = [
    { id: "dashboard", icon: "◈", label: "Home" },
    { id: "cases",     icon: "⚖", label: "Cases",   badge: cases.filter(c=>c.status==="Active").length },
    { id: "tasks",     icon: "✓", label: "Tasks",   badge: tasks.filter(t=>!t.done).length },
    { id: "billing",   icon: "$", label: "Billing" },
    { id: "ai",        icon: "✦", label: "HakiAI" },
  ];
  const BNAV = BNAV_ALL.filter(n => canSee(n.id));

  const persistUsers = (updater) => {
    setUsers(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveUsers(next);
      return next;
    });
  };



  const VIEWS = {
    dashboard: <Dashboard
      cases={scope.cases} tasks={scope.tasks} invoices={scope.invoices} comms={scope.comms}
      clients={scope.clients.length ? scope.clients : (scope.isScoped ? [] : clients)}
      currentUser={currentUser} isScoped={scope.isScoped}
      setView={(id) => canSee(id) && setView(id)} setModal={setModal} setSel={setSel} />,
    pipeline:  <Pipeline
      cases={scope.cases} setSel={setSel} setModal={setModal}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    cases:     <CasesView
      cases={scope.cases} setCases={setCases} setModal={setModal} setSel={setSel}
      clients={clients} currentUser={currentUser} isScoped={scope.isScoped} />,
    tasks:     <TasksView
      tasks={scope.tasks} setTasks={setTasks} cases={scope.cases}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    calendar:  <CalendarView
      events={myEvents} setEvents={setEvents} cases={scope.cases}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    evidence:  <EvidenceVault
      cases={scope.cases} callAI={callAI} evidence={evidence} setEvidence={setEvidence}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    clients:   <ClientsView
      clients={scope.clients.length ? scope.clients : (scope.isScoped ? [] : clients)}
      setClients={setClients} setModal={setModal} cases={scope.cases}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    team:      <TeamView team={TEAM} cases={cases} timeEntries={timeEntries} users={users} setUsers={persistUsers} currentUser={currentUser} />,
    comms:     <CommsView
      comms={scope.comms} setComms={setComms} cases={scope.cases}
      callAI={callAI} currentUser={currentUser} isScoped={scope.isScoped} />,
    billing:   <BillingView
      timeEntries={scope.timeEntries} setTimeEntries={setTimeEntries} cases={scope.cases}
      currentUser={currentUser} isScoped={scope.isScoped} />,
    invoices:  <InvoicesView
      invoices={scope.invoices} setInvoices={setInvoices} clients={clients}
      callAI={callAI} currentUser={currentUser} isScoped={scope.isScoped} />,
    ai:        <AIHub callAI={callAI} currentUser={currentUser} />,
    reports:   <Reports cases={cases} invoices={invoices} team={TEAM} timeEntries={timeEntries} tasks={tasks} clients={clients} />,
    templates: <TemplatesView templates={TEMPLATES} callAI={callAI} />,
    conflict:  <ConflictChecker clients={clients} cases={cases} callAI={callAI} />,
    users:     <UserManagementView users={users} setUsers={persistUsers} currentUser={currentUser} />,
  };

  const activeLabel = NAV.find(n => n.id === activeView)?.label || "HakiPro";

  return (
    <div className="app">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="logo-area">
          <div className="logo-row">
            <div className="logo-icon">⚖</div>
            <div>
              <h1>HakiPro</h1>
              <small>Kenya Legal Management</small>
            </div>
            <button className="logo-close" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>
        </div>
        <nav className="nav">
          {NAV.map((n, i) => n.section
            ? <div key={i} className="nav-section">{n.section}</div>
            : (
              <div key={n.id} className={`nav-item${activeView === n.id ? " active" : ""}`} onClick={() => navigate(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
                {n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
              </div>
            )
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-row" onClick={() => setModal("profile")} title="My Profile">
            <div className={`av ${currentUser.av}`}>{currentUser.init}</div>
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{ROLE_LABELS[currentUser.role]}</div>
              {currentUser.lsk && <span className="lsk-badge">{currentUser.lsk}</span>}
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <button className="topbar-hamburger" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-title">{activeLabel}</div>
          <div className="topbar-right">
            <span className={`badge ${ROLE_COLORS[currentUser.role]}`} style={{fontSize:9,letterSpacing:"1.5px"}}>{ROLE_LABELS[currentUser.role].toUpperCase()}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setModal("quickai")}>✦ HakiAI</button>
            {activeView === "cases"   && canSee("cases")    && <button className="btn btn-gold btn-sm" onClick={() => setModal("newCase")}>+ New Case</button>}
            {activeView === "clients" && canSee("clients")  && <button className="btn btn-gold btn-sm" onClick={() => setModal("newClient")}>+ Client</button>}
            {activeView === "billing" && canSee("billing")  && <button className="btn btn-gold btn-sm" onClick={() => setModal("newTime")}>+ Time</button>}
            {activeView === "invoices"&& canSee("invoices") && <button className="btn btn-gold btn-sm" onClick={() => setModal("newInvoice")}>+ Invoice</button>}
            {activeView === "tasks"   && <button className="btn btn-gold btn-sm" onClick={() => setModal("newTask")}>+ Task</button>}
            <div className="notif-btn">
              <button className="icon-btn" aria-label="Notifications" onClick={() => { navigate("comms"); markAllRead(); }}>🔔</button>
              {scopedUnread > 0 && <span className="notif-dot" />}
            </div>
          </div>
        </div>

        <div className="content">{VIEWS[activeView] || <div className="muted" style={{ padding: 40, textAlign: "center" }}>Coming soon.</div>}</div>

        {/* Mobile bottom nav */}
        <nav className="bottom-nav">
          {BNAV.map(n => (
            <div key={n.id} className={`bnav-item${activeView === n.id ? " active" : ""}`} onClick={() => navigate(n.id)}>
              {n.badge > 0 && <span className="bnav-badge">{n.badge}</span>}
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </div>
          ))}
        </nav>
      </main>

      {/* MODALS */}
      {modal === "quickai"    && <QuickAIModal aiChat={aiChat} aiMsg={aiMsg} setAiMsg={setAiMsg} sendChat={sendChat} aiLoading={aiLoading} onClose={() => setModal(null)} chatRef={chatRef} />}
      {modal === "newCase"    && <NewCaseModal setCases={setCases} clients={clients} users={users} currentUser={currentUser} onClose={() => { setModal(null); toast("New matter opened.", "success"); }} />}
      {modal === "newClient"  && <NewClientModal setClients={setClients} users={users} onClose={() => { setModal(null); toast("Client registered.", "success"); }} />}
      {modal === "newTime"    && <NewTimeModal setTimeEntries={setTimeEntries} cases={scope.cases} team={TEAM} onClose={() => { setModal(null); toast("Time entry logged.", "success"); }} />}
      {modal === "newTask"    && <NewTaskModal setTasks={setTasks} cases={scope.cases} team={TEAM} currentUser={currentUser} onClose={() => { setModal(null); toast("Task added.", "success"); }} />}
      {modal === "newInvoice" && <NewInvoiceModal setInvoices={setInvoices} clients={clients} cases={cases} onClose={() => setModal(null)} />}
      {modal === "caseDetail" && sel && <CaseDetailModal case_={sel} onClose={() => { setModal(null); setSel(null); }} callAI={callAI} tasks={tasks} setTasks={setTasks} evidence={evidence} setEvidence={setEvidence} currentUser={currentUser} />}
      {modal === "profile"    && <ProfileModal currentUser={currentUser} users={users} setUsers={persistUsers} setCurrentUser={setCurrentUser} onClose={() => setModal(null)} />}

      {/* Global toast container */}
      <ToastContainer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCOPE BANNER — shown to lawyers & paralegals so they know data is filtered
// ─────────────────────────────────────────────────────────────────────────────
function ScopeBanner({ currentUser, count, noun = "matter", extra = "" }) {
  if (!currentUser || currentUser.role === "admin") return null;
  const icon   = currentUser.role === "lawyer" ? "⚖" : "✓";
  const plural = count === 1 ? noun : noun + "s";
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10, padding:"9px 14px",
      background:"var(--blue3)", border:"1px solid rgba(54,114,212,.25)",
      borderRadius:"var(--r8)", marginBottom:16, fontSize:12
    }}>
      <span style={{fontSize:15}}>{icon}</span>
      <span style={{color:"var(--blue2)"}}>
        Showing <strong style={{color:"var(--light)"}}>{count} {plural}</strong> assigned to you
        {extra && <span className="muted"> · {extra}</span>}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({ cases, tasks, invoices, comms, clients, currentUser, isScoped, setView, setModal, setSel }) {
  const [clientSel, setClientSel] = useState(null);
  const totalBilled   = invoices.reduce((a, i) => a + i.amount, 0);
  const paid          = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const outstanding   = invoices.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);
  const activeCases   = cases.filter(c => c.status === "Active");
  const openTasks     = tasks.filter(t => !t.done);
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={cases.length} noun="matter"
        extra={activeCases.length + " active"} />
      <div className="stats-row cols-4">
        <StatCard icon="⚖" color="c-gold" label={isScoped ? "My Active Cases" : "Active Cases"} val={activeCases.length} sub={isScoped ? "Assigned to you" : "In progress"} />
        <StatCard icon="✓" color="c-blue" label={isScoped ? "My Open Tasks" : "Open Tasks"} val={openTasks.length} sub={`${tasks.filter(t => t.done).length} completed`} />
        <StatCard icon="KES" color="c-green" label="Billed (KES)" val={"K " + Math.round(totalBilled / 1000) + "k"} sub={`K ${Math.round(paid / 1000)}k collected`} />
        <StatCard icon="!" color="c-red" label="Outstanding" val={"K " + Math.round(outstanding / 1000) + "k"} sub={`${invoices.filter(i => i.status === "Overdue").length} overdue`} />
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Active Matters</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("cases")}>All →</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Ref No.</th><th>Matter</th><th>Status</th><th>Progress</th></tr></thead>
              <tbody>
                {cases.filter(c => c.status !== "Closed").map(c => (
                  <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => { setSel(c); setModal("caseDetail"); }}>
                    <td><span className="mono gold" style={{ fontSize: 11 }}>{c.id}</span></td>
                    <td><span className="light truncate" style={{ display: "block", maxWidth: 180 }}>{c.title}</span></td>
                    <td><SBadge s={c.status} /></td>
                    <td><div style={{ width: 70 }}><div className="pbar"><div className="pfill" style={{ width: c.progress + "%" }} /></div><span className="muted" style={{ fontSize: 10 }}>{c.progress}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <span className="card-title">Urgent Tasks</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("tasks")}>All →</button>
          </div>
          <div className="card-body">
            {tasks.filter(t => !t.done && t.priority === "High").slice(0, 4).map(t => (
              <div key={t.id} className="task-item">
                <div className="task-cb">□</div>
                <div style={{ flex: 1 }}>
                  <div className="light" style={{ fontSize: 12.5, fontWeight: 500 }}>{t.title}</div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 2 }}><span className="mono">{t.caseId}</span> · Due {t.due}</div>
                </div>
                <PBadge p={t.priority} />
              </div>
            ))}
            {tasks.filter(t => !t.done && t.priority === "High").length === 0 && <div className="muted" style={{ textAlign: "center", padding: 20 }}>No urgent tasks. 🎉</div>}
          </div>
        </div>
      </div>

      <div className="grid2 mt16">
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Invoice Status</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("invoices")}>All →</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td><span className="mono gold" style={{ fontSize: 10 }}>{inv.id}</span></td>
                    <td style={{ fontSize: 12 }}>{inv.client}</td>
                    <td className="mono light" style={{ fontSize: 12 }}>KES {inv.amount.toLocaleString()}</td>
                    <td><InvBadge s={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Recent Messages</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("comms")}>All →</button>
          </div>
          <div className="card-body">
            {comms.slice(0, 3).map(c => (
              <div key={c.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                <div className="flex fac fjb gap6" style={{ marginBottom: 3 }}>
                  <span className="light" style={{ fontSize: 12, fontWeight: 500 }}>{c.from}</span>
                  {!c.read && <span className="badge b-gold">New</span>}
                  <span className="muted" style={{ fontSize: 10 }}>{c.date.split(",")[1]}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text)" }}>{c.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {clients && clients.length > 0 && (
        <div className="card mt16">
          <div className="card-hd"><span className="card-title">Client Progress</span><span className="muted" style={{fontSize:11}}>Click a client to view details</span></div>
          <div className="card-body" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {clients.map(cl=>{
              const co=cases.find(c=>c.id===cl.caseRef);
              return(
                <div key={cl.id} onClick={()=>setClientSel(cl)}
                  style={{background:"var(--deep)",border:"1px solid var(--border)",borderRadius:"var(--r8)",padding:12,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                  <div className="flex fac gap8 mb8">
                    <div className="av av-gold" style={{width:26,height:26,fontSize:11}}>{cl.name[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="light truncate" style={{fontSize:12.5,fontWeight:500}}>{cl.name}</div>
                      <div className="muted" style={{fontSize:10}}>{cl.attorney||"Unassigned"}</div>
                    </div>
                    <SBadge s={cl.status}/>
                  </div>
                  {co&&<><div className="pbar mt4"><div className="pfill" style={{width:co.progress+"%"}}/></div><div className="flex fjb mt4"><span className="muted" style={{fontSize:9}}>{co.stage}</span><span className="mono gold" style={{fontSize:9}}>{co.progress}%</span></div></>}
                  <div className="flex fjb mt8"><span className="muted" style={{fontSize:10}}>Retainer</span><span className="mono light" style={{fontSize:10}}>KES {(cl.retainer||0).toLocaleString()}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {clientSel&&(
        <div className="overlay" onClick={()=>setClientSel(null)}>
          <div className="modal" style={{width:480}} onClick={e=>e.stopPropagation()}>
            <div className="modal-hd"><div><div className="modal-title">{clientSel.name}</div><div className="modal-sub">Client Progress Report</div></div><button className="close-x" onClick={()=>setClientSel(null)}>✕</button></div>
            <div className="modal-body">
              {[["Phone",clientSel.phone],["Email",clientSel.email],["Advocate",clientSel.attorney],["Case Ref",clientSel.caseRef],["Joined",clientSel.joined],["Status",clientSel.status]].map(([l,v])=>(
                <div key={l} className="flex fjb" style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid var(--border)"}}>
                  <span className="muted" style={{fontSize:12}}>{l}</span><span className="light" style={{fontSize:12.5}}>{v||"—"}</span>
                </div>
              ))}
              {(()=>{const c2=cases.find(c=>c.id===clientSel.caseRef); return c2?(
                <div style={{background:"var(--card)",borderRadius:"var(--r8)",padding:14,marginTop:4}}>
                  <div className="muted" style={{fontSize:10,marginBottom:6}}>Case: {c2.title.slice(0,50)}</div>
                  <div className="pbar" style={{height:8}}><div className="pfill" style={{width:c2.progress+"%"}}/></div>
                  <div className="flex fjb mt6"><span className="muted" style={{fontSize:10}}>{c2.stage}</span><span className="mono gold" style={{fontSize:11}}>{c2.progress}%</span></div>
                  <div className="flex fjb mt10"><span className="muted" style={{fontSize:12}}>Billed</span><span className="mono light">KES {(clientSel.billed||0).toLocaleString()}</span></div>
                  <div className="flex fjb mt8"><span className="muted" style={{fontSize:12}}>Retainer</span><span className="mono light">KES {(clientSel.retainer||0).toLocaleString()}</span></div>
                </div>
              ):<div className="muted" style={{fontSize:12,marginTop:8}}>No active case linked.</div>;})()}
              {clientSel.notes&&<div style={{marginTop:14,padding:"10px 12px",background:"var(--deep)",borderRadius:"var(--r8)",fontSize:12,lineHeight:1.7}}>{clientSel.notes}</div>}
            </div>
          </div>
        </div>
      )}
            {/* Quick court info */}
      <div className="card mt16">
        <div className="card-hd"><span className="card-title">Kenyan Courts Reference</span></div>
        <div className="card-body">
          <div className="grid2">
            {[["Supreme Court", "Final appellate court. Art. 163 CoK 2010.", "court-supreme"],
              ["Court of Appeal", "Handles appeals from the High Court. Art. 164 CoK 2010.", "court-appeal"],
              ["High Court", "Original & appellate jurisdiction. Art. 165 CoK 2010.", "court-high"],
              ["Magistrates Courts", "Civil & criminal original jurisdiction. MCA 2015.", "court-mag"]
            ].map(([name, desc, cls]) => (
              <div key={name} style={{ background: "var(--deep)", borderRadius: "var(--r8)", padding: "10px 12px" }}>
                <div className={`${cls}`} style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{name}</div>
                <div className="muted" style={{ fontSize: 11, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE
// ═══════════════════════════════════════════════════════════════════════════
function Pipeline({ cases, setSel, setModal, currentUser, isScoped }) {
  const stages = [
    { id: "Intake", label: "Client Intake", color: "var(--blue)" },
    { id: "Investigation", label: "Investigation", color: "var(--amber)" },
    { id: "Preparation", label: "Case Prep", color: "var(--purple)" },
    { id: "Hearing", label: "Hearings", color: "var(--gold)" },
    { id: "Judgment", label: "Judgment / Ruling", color: "var(--teal)" },
    { id: "Closed", label: "Closed", color: "var(--muted)" },
  ];
  const stageMap = {};  // stage from case.stage
  return (
    <div>
      <div className="muted mb16" style={{ fontSize: 12 }}>Full matter lifecycle — from first instruction to final judgment or settlement.</div>
      <ScopeBanner currentUser={currentUser} count={cases.length} noun="matter" />
      <div className="kanban">
        {stages.map(s => {
          const sc = cases.filter(c => (stageMap[c.id] || c.stage) === s.id);
          return (
            <div key={s.id} className="kan-col">
              <div className="kan-hd">
                <span className="kan-hd-label" style={{ color: s.color }}>{s.label}</span>
                <span className="kan-count" style={{ background: s.color + "22", color: s.color }}>{sc.length}</span>
              </div>
              <div className="kan-body">
                {sc.map(c => (
                  <div key={c.id} className="kan-card" onClick={() => { setSel(c); setModal("caseDetail"); }}>
                    <div className="mono" style={{ fontSize: 10, color: s.color, marginBottom: 3 }}>{c.id}</div>
                    <div className="light" style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 5 }}>{c.title}</div>
                    <div className="muted" style={{ fontSize: 10, marginBottom: 5 }}>{c.court}</div>
                    <div className="pbar"><div className="pfill" style={{ width: c.progress + "%", background: s.color }} /></div>
                  </div>
                ))}
                {!sc.length && <div className="muted" style={{ fontSize: 11, textAlign: "center", padding: "16px 0" }}>Empty</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CASES VIEW
// ═══════════════════════════════════════════════════════════════════════════
function CasesView({ cases, setCases, setModal, setSel, clients, currentUser, isScoped }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = cases.filter(c =>
    (filter === "All" || c.status === filter) &&
    (!search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.client.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={cases.length} noun="matter"
        extra={`${cases.filter(c=>c.status==="Active").length} active`} />
      <div className="flex fac gap8 mb16 fwrap">
        <input style={{ flex: 1, minWidth: 200 }} placeholder="🔍  Search matters…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap6 fwrap">
          {["All", "Active", "Pending", "Closed"].map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? "btn-gold" : "btn-ghost"}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Reference No.</th><th>Matter Title</th><th>Client</th><th>Court</th><th>Charge / Statute</th><th>Status</th><th>Priority</th><th>Hearing</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => { setSel(c); setModal("caseDetail"); }}>
                  <td><span className="mono gold" style={{ fontSize: 11 }}>{c.id}</span></td>
                  <td><span className="light truncate" style={{ display: "block", maxWidth: 200 }}>{c.title}</span></td>
                  <td style={{ fontSize: 12 }}>{c.client}</td>
                  <td style={{ fontSize: 11, color: "var(--muted)" }}>{c.court}</td>
                  <td><span className="tag" style={{ fontSize: 10 }}>{c.charge}</span></td>
                  <td><SBadge s={c.status} /></td>
                  <td><PBadge p={c.priority} /></td>
                  <td className="mono muted" style={{ fontSize: 11 }}>{c.hearing}</td>
                  <td onClick={e => e.stopPropagation()}><button className="btn btn-ghost btn-xs" onClick={() => { setSel(c); setModal("caseDetail"); }}>Open</button></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={9} style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>No matters found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════════════════
function TasksView({ tasks, setTasks, cases, currentUser, isScoped }) {
  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const [filter, setFilter] = useState("All");
  const types = ["All", "Filing", "Research", "Investigation", "Document", "Billing", "Review"];
  const filtered = tasks.filter(t => filter === "All" || t.type === filter);
  const pending = filtered.filter(t => !t.done);
  const done = filtered.filter(t => t.done);
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={tasks.filter(t=>!t.done).length} noun="open task"
        extra={`${tasks.filter(t=>t.done).length} completed`} />
      <div className="stats-row cols-3">
        <StatCard icon="!" color="c-red" label="High Priority" val={tasks.filter(t => !t.done && t.priority === "High").length} sub="Urgent tasks" />
        <StatCard icon="✓" color="c-green" label="Completed" val={tasks.filter(t => t.done).length} sub="This month" />
        <StatCard icon="◎" color="c-blue" label="Pending" val={tasks.filter(t => !t.done).length} sub="Open items" />
      </div>
      <div className="flex gap6 mb16 fwrap">
        {types.map(t => <button key={t} className={`btn btn-sm ${filter === t ? "btn-gold" : "btn-ghost"}`} onClick={() => setFilter(t)}>{t}</button>)}
      </div>
      <div className="grid2">
        <div>
          <div className="section-hd">Pending ({pending.length})</div>
          {["High", "Medium", "Low"].map(p => {
            const items = pending.filter(t => t.priority === p);
            if (!items.length) return null;
            return (
              <div key={p}>
                <div className="muted mb6 mt12" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>{p} Priority</div>
                {items.map(t => (
                  <div key={t.id} className="task-item">
                    <div className="task-cb" onClick={() => toggle(t.id)}>□</div>
                    <div style={{ flex: 1 }}>
                      <div className="light" style={{ fontSize: 12.5, fontWeight: 500 }}>{t.title}</div>
                      <div className="muted" style={{ fontSize: 10, marginTop: 2 }}><span className="mono">{t.caseId}</span> · {t.due} · {t.assignee.split(" ")[0]}</div>
                    </div>
                    <PBadge p={t.priority} />
                  </div>
                ))}
              </div>
            );
          })}
          {!pending.length && <div className="muted" style={{ textAlign: "center", padding: 30 }}>No pending tasks. ✓</div>}
        </div>
        <div>
          <div className="section-hd">Completed ({done.length})</div>
          {done.map(t => (
            <div key={t.id} className="task-item done">
              <div className="task-cb checked" onClick={() => toggle(t.id)}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, textDecoration: "line-through", color: "var(--muted)" }}>{t.title}</div>
                <div className="muted" style={{ fontSize: 10, marginTop: 2 }}><span className="mono">{t.caseId}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════════════════
function CalendarView({ events, setEvents, cases, currentUser, isScoped }) {
  const now = new Date();
  const [month, setMonth]   = useState(now.getMonth());
  const [year,  setYear]    = useState(now.getFullYear());
  const [addDay, setAddDay] = useState(null);
  const [newEv,  setNewEv]  = useState({ title:"", type:"hearing", caseId:"", court:"" });
  const mkDs = (d) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const saveEvent = () => {
    if (!newEv.title.trim()) return;
    if (setEvents) setEvents(evs => [...evs, { id:Date.now(), date:addDay, ...newEv, addedBy:currentUser.name }]);
    toast("Event added to calendar.","success");
    setAddDay(null); setNewEv({ title:"", type:"hearing", caseId:"", court:"" });
  };
  const deleteEvent = (id) => {
    if (setEvents) setEvents(evs => evs.filter(e => e.id!==id));
    toast("Event removed.","info");
  };
  // For scoped roles, only show events for their cases
  const myCaseIds  = useMemo(() => new Set(cases.map(c => c.id)), [cases]);
  const myEvents   = isScoped ? events.filter(e => !e.caseId || myCaseIds.has(e.caseId)) : events;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: daysInPrev - i, cur: false });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ d: i, cur: true });
  while (cells.length % 7) cells.push({ d: cells.length - daysInMonth - firstDay + 1, cur: false });
  const today = new Date();
  const evForDay = (d, cur) => {
    if (!cur) return [];
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return myEvents.filter(e => e.date === ds);
  };
  const ecls = { hearing: "ev-hearing", deadline: "ev-deadline", meeting: "ev-meeting", task: "ev-task" };
  const upcoming = myEvents.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6);
  return (
    <>
    <div className="grid2">
      <div>
        <ScopeBanner currentUser={currentUser} count={myEvents.length} noun="calendar event" />
        <div className="flex fac fjb mb12">
          <button className="btn btn-ghost btn-sm" onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}>‹</button>
          <span className="serif light" style={{ fontSize: 16 }}>{monthNames[month]} {year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}>›</button>
        </div>
        <div className="cal-grid">
          {days.map(d => <div key={d} className="cal-dh">{d}</div>)}
          {cells.map((c, i) => {
            const evs = evForDay(c.d, c.cur);
            const isToday = c.cur && c.d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <div key={i} onClick={()=>c.cur&&setAddDay(mkDs(c.d))} className={`cal-cell${!c.cur?" other":""}${isToday?" today":""}`} style={{cursor:c.cur?"pointer":"default"}}>
                <div className="cal-num">{c.d}</div>
                {evs.slice(0, 2).map((e, j) => <div key={j} className={`cal-ev ${ecls[e.type] || ""}`}>{e.title}</div>)}
                {evs.length > 2 && <div className="muted" style={{ fontSize: 8 }}>+{evs.length - 2}</div>}
              </div>
            );
          })}
        </div>
        <div className="card mt12">
          <div className="card-hd"><span className="card-title">Legend</span></div>
          <div className="card-body" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["ev-hearing", "Court Hearing"], ["ev-deadline", "Filing Deadline"], ["ev-meeting", "Client Meeting"], ["ev-task", "Task Due"]].map(([cls, lbl]) => (
              <div key={cls} className="flex fac gap6">
                <span className={`cal-ev ${cls}`} style={{ minWidth: 10 }}>■</span>
                <span style={{ fontSize: 11 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="section-hd">Upcoming Court Dates & Deadlines</div>
        {!upcoming.length&&<div className="muted" style={{fontSize:12,padding:"20px 0"}}>No upcoming events. Click any date to add one.</div>}
        {upcoming.map((e, i) => (
          <div key={e.id||i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--r8)", padding: "11px 14px", marginBottom: 8, borderLeft: `3px solid ${e.type === "hearing" ? "var(--red)" : e.type === "deadline" ? "var(--amber)" : e.type === "meeting" ? "var(--blue)" : "var(--purple)"}` }}>
            <div className="flex fac fjb gap8">
              <span className="light" style={{ fontSize: 12.5, fontWeight: 500, flex: 1 }}>{e.title}</span>
              <span className={`badge ${e.type === "hearing" ? "b-red" : e.type === "deadline" ? "b-amber" : e.type === "meeting" ? "b-blue" : "b-purple"}`}>{e.type}</span>
              {(currentUser.role==="admin"||e.addedBy===currentUser.name)&&e.id&&<button className="btn btn-red btn-xs" onClick={()=>deleteEvent(e.id)}>✕</button>}
            </div>
            <div className="muted" style={{ fontSize: 10, marginTop: 3 }}>
              {new Date(e.date).toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {e.court && ` · ${e.court}`}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--gold)", marginTop: 2 }}>{e.caseId}</div>
          </div>
        ))}
      </div>
    </div>
      {addDay && (
        <div className="overlay" onClick={()=>setAddDay(null)}>
          <div className="modal" style={{width:460}} onClick={e=>e.stopPropagation()}>
            <div className="modal-hd">
              <div><div className="modal-title">Add Event</div><div className="modal-sub">{new Date(addDay+"T12:00:00").toLocaleDateString("en-KE",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
              <button className="close-x" onClick={()=>setAddDay(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Title *</label><input placeholder="e.g. Hearing at Milimani Law Courts" value={newEv.title} onChange={e=>setNewEv(v=>({...v,title:e.target.value}))} autoFocus /></div>
              <div className="form-row">
                <div className="form-group"><label>Type</label>
                  <select value={newEv.type} onChange={e=>setNewEv(v=>({...v,type:e.target.value}))}>
                    {["hearing","deadline","meeting","task"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Case Ref</label>
                  <select value={newEv.caseId} onChange={e=>setNewEv(v=>({...v,caseId:e.target.value}))}>
                    <option value="">— General —</option>
                    {cases.map(c=><option key={c.id} value={c.id}>{c.id}</option>)}
                  </select>
                </div>
              </div>
              {newEv.type==="hearing"&&<div className="form-group"><label>Court</label><select value={newEv.court} onChange={e=>setNewEv(v=>({...v,court:e.target.value}))}><option value="">Select court…</option>{KE_COURTS.map(c=><option key={c}>{c}</option>)}</select></div>}
              <div className="flex gap8" style={{justifyContent:"flex-end"}}>
                <button className="btn btn-ghost" onClick={()=>setAddDay(null)}>Cancel</button>
                <button className="btn btn-gold" onClick={saveEvent}>Save Event</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EVIDENCE VAULT
// ═══════════════════════════════════════════════════════════════════════════
function EvidenceVault({ cases, callAI, currentUser, isScoped, evidence, setEvidence }) {
  const [selCase,   setSelCase]   = useState(cases[0]?.id || "");
  const [aiResult,  setAiResult]  = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const fileRef = useRef(null);
  // evidence is persisted: { [caseId]: [{id,name,type,icon,date,uploaded,size,tags}] }
  const caseEv = (evidence||{})[selCase] || [];

  const handleUpload = (files) => {
    if (!files||!files.length) return;
    if (!selCase) { toast("Select a case first.","warn"); return; }
    const items = Array.from(files).map(file => {
      const ext  = file.name.split(".").pop().toLowerCase();
      const icon = ["jpg","jpeg","png","gif","webp"].includes(ext)?"🖼️":ext==="pdf"?"📄":["mp3","wav","m4a","mp4"].includes(ext)?"🎵":"📋";
      const type = ["jpg","jpeg","png","gif","webp"].includes(ext)?"Image":ext==="pdf"?"PDF":["mp3","wav","m4a","mp4"].includes(ext)?"Audio/Video":"Document";
      return { id:Date.now()+Math.random(), name:file.name, type, icon,
               date:new Date().toLocaleDateString("en-KE",{day:"numeric",month:"short"}),
               uploaded:currentUser.name, size:file.size, tags:[], caseId:selCase };
    });
    if (setEvidence) setEvidence(prev => ({ ...prev, [selCase]: [...((prev||{})[selCase]||[]), ...items] }));
    toast(items.length+" file"+(items.length>1?"s":"")+" uploaded to case "+selCase+".","success");
  };

  const deleteEv = (evId) => {
    if (!window.confirm("Remove this evidence item?")) return;
    if (setEvidence) setEvidence(prev => ({ ...prev, [selCase]: ((prev||{})[selCase]||[]).filter(e=>e.id!==evId) }));
    toast("Evidence removed.","info");
  };

  const allEv = [
    { id: 1, caseId: "HCCR/E002/2025", name: "CCTV Frame 01", type: "Image", icon: "🖼️", uploaded: "Priscilla Njoroge", date: "8 Mar", tags: ["CCTV", "Location"] },
    { id: 2, caseId: "HCCR/E002/2025", name: "Bank Statements Q4", type: "PDF", icon: "📄", uploaded: "Kevin Mwangi", date: "6 Mar", tags: ["Financial"] },
    { id: 3, caseId: "HCCR/E002/2025", name: "Accused Photo", type: "Image", icon: "🖼️", uploaded: "Priscilla Njoroge", date: "5 Mar", tags: ["Person", "ID"] },
    { id: 4, caseId: "ELC/126/2025", name: "Title Deed – LR 8892", type: "PDF", icon: "📄", uploaded: "Kevin Mwangi", date: "4 Mar", tags: ["Title", "Land"] },
    { id: 5, caseId: "ELC/126/2025", name: "Site Survey Photo", type: "Image", icon: "🖼️", uploaded: "Priscilla Njoroge", date: "2 Mar", tags: ["Property"] },
    { id: 6, caseId: "HCCC/45/2025", name: "KNH Medical Records", type: "PDF", icon: "📄", uploaded: "Odhiambo Otieno", date: "7 Mar", tags: ["Medical", "KNH"] },
    { id: 7, caseId: "HCCC/45/2025", name: "X-Ray Results", type: "Image", icon: "🩻", uploaded: "Priscilla Njoroge", date: "6 Mar", tags: ["Medical", "Scan"] },
    { id: 8, caseId: "HCCC/45/2025", name: "Incident Report", type: "Document", icon: "📋", uploaded: "Odhiambo Otieno", date: "5 Mar", tags: ["Report"] },
  ];
  const caseIdSet = useMemo(() => new Set(cases.map(c => c.id)), [cases]);
  const scopedEv  = isScoped ? allEv.filter(e => caseIdSet.has(e.caseId)) : allEv;
  const seedEv    = scopedEv.filter(e => !selCase || e.caseId === selCase);
  // Use persisted uploaded files; fall back to seed data if no uploads
  const ev = caseEv.length > 0 ? caseEv : seedEv;
  const analyse = async () => {
    setAiLoading(true); setAiResult("");
    const caseObj = cases.find(c => c.id===selCase);
    const ctx = caseObj ? `Case: ${caseObj.title}. Type: ${caseObj.type}. Charge: ${caseObj.charge}.` : "";
    const items = (caseEv.length>0?caseEv:ev).length ? (caseEv.length>0?caseEv:ev).map(e => `${e.name} (${e.type})`).join(", ") : "No evidence uploaded yet for this case";
    const r = await callAI(`${ctx} Analyse these evidence items in a Kenyan court context: ${items}. For each item assess: (1) admissibility under Evidence Act Cap. 80 (2) evidentiary weight (3) chain of custody requirements (4) any legal challenges. Then identify overall gaps in the evidence.`);
    setAiResult(r); setAiLoading(false);
  };
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={scopedEv.length} noun="evidence item"
        extra={`${cases.length} matter${cases.length!==1?"s":""}`} />
      <div className="flex fac gap10 mb16 fwrap">
        <select style={{ flex: 1, minWidth: 240 }} value={selCase} onChange={e => setSelCase(e.target.value)}>
          <option value="">All Cases</option>
          {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title.slice(0, 40)}</option>)}
        </select>
        <button className="btn btn-blue btn-sm" onClick={analyse} disabled={aiLoading}>✦ {aiLoading ? "Analysing…" : "AI Evidence Analysis"}</button>
      </div>
      <div className="grid2">
        <div>
          <div className="drop-zone mb12"
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();handleUpload(e.dataTransfer.files);}}
            onClick={()=>selCase?fileRef.current?.click():toast("Select a case first.","warn")}>
            <div className="dz-icon">📸</div>
            <div style={{fontSize:13}}>Drop evidence files here or click to upload</div>
            <div className="muted" style={{marginTop:4,fontSize:11}}>Photos, PDFs, documents — AI analyses admissibility under Evidence Act</div>
            {caseEv.length>0&&<div className="badge b-green" style={{marginTop:8}}>{caseEv.length} file{caseEv.length>1?"s":""} uploaded</div>}
            <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={e=>handleUpload(e.target.files)} />
          </div>
          <div className="ev-grid">
            {ev.map(e => (
              <div key={e.id} className="ev-card">
                <div className="ev-thumb">{e.icon}</div>
                <div className="ev-label">
                  <div className="ev-name">{e.name}</div>
                  <div className="ev-meta">{e.type} · {e.date}</div>
                  <div className="ev-meta" style={{ color: "var(--blue2)" }}>{e.uploaded}</div>
                  <div className="flex gap4 fwrap mt8">{e.tags.map(t => <span key={t} className="tag" style={{ fontSize: 8, padding: "1px 5px" }}>{t}</span>)}</div>
                </div>
              </div>
            ))}
            <div className="ev-card" style={{ border: "2px dashed var(--border)" }}>
              <div className="ev-thumb muted">+</div>
              <div className="ev-label"><div className="ev-name muted">Add Item</div></div>
            </div>
          </div>
        </div>
        <div>
          <div className="ai-glow">
            <div className="ai-hd">✦ HakiAI Evidence Intelligence</div>
            {aiLoading && <div className="thinking"><div className="dot" /><div className="dot" /><div className="dot" /><span style={{ marginLeft: 8 }}>Analysing under Evidence Act Cap. 80…</span></div>}
            {aiResult && <div className="ai-out">{aiResult}</div>}
            {!aiLoading && !aiResult && <div className="muted" style={{ fontSize: 12 }}>Click AI Analysis to evaluate admissibility under the Kenyan Evidence Act Cap. 80 and identify gaps.</div>}
          </div>
          <div className="card mt12">
            <div className="card-hd"><span className="card-title">Evidence Summary</span></div>
            <div className="card-body">
              {["Image", "PDF", "Document"].map(t => (
                <div key={t} className="flex fac fjb" style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 12 }}>{t === "Image" ? "🖼️" : t === "PDF" ? "📄" : "📋"} {t}s</span>
                  <span className="light serif" style={{fontSize:18}}>{ev.filter(e=>e.type===t).length}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="flex fac fjb"><span className="muted" style={{ fontSize: 12 }}>Total items</span><span className="gold serif" style={{ fontSize: 22 }}>{ev.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════════════════════════════════════
function ClientsView({ clients, setClients, setModal, cases, currentUser, isScoped }) {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.county?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={clients.length} noun="client"
        extra="linked to your matters" />
      <div className="stats-row cols-4">
        <StatCard icon="◉" color="c-gold" label={isScoped ? "My Clients" : "Total Clients"} val={clients.length} sub={isScoped ? "Assigned to you" : "All time"} />
        <StatCard icon="◈" color="c-green" label="Active" val={clients.filter(c => c.status === "Active").length} sub="Current matters" />
        <StatCard icon="◎" color="c-amber" label="Pending Intake" val={clients.filter(c => c.status === "Pending").length} sub="Awaiting retainer" />
        <StatCard icon="KES" color="c-blue" label="Total Retainers" val={"K " + Math.round(clients.reduce((a, c) => a + c.retainer, 0) / 1000) + "k"} sub="On account" />
      </div>
      <div className="flex fac gap10 mb16">
        <input style={{ flex: 1, maxWidth: 300 }} placeholder="🔍  Search clients…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Client</th><th>Type</th><th>ID / Reg. No.</th><th>County</th><th>Advocate</th><th>Case Ref</th><th>Retainer (KES)</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><div className="flex fac gap8"><div className="av av-gold" style={{ width: 26, height: 26, fontSize: 11 }}>{c.name[0]}</div><span className="light" style={{ fontSize: 12.5 }}>{c.name}</span></div></td>
                  <td><span className="tag">{c.type}</span></td>
                  <td className="mono muted" style={{ fontSize: 11 }}>{c.id_no}</td>
                  <td style={{ fontSize: 12 }}>{c.county}</td>
                  <td style={{ fontSize: 12 }}>{c.attorney}</td>
                  <td><span className="mono gold" style={{ fontSize: 11 }}>{c.caseRef}</span></td>
                  <td className="mono light" style={{ fontSize: 12 }}>{c.retainer.toLocaleString()}</td>
                  <td><SBadge s={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card mt16">
        <div className="card-hd"><span className="card-title">Client Onboarding Journey</span></div>
        <div className="card-body" style={{ overflowX: "auto" }}>
          <div className="flex fac" style={{ gap: 0, minWidth: 600 }}>
            {["Initial Enquiry", "Conflict Check", "KYC / ID Verification", "Engagement Letter", "Retainer Paid", "Case Opened", "Active", "Closed"].map((s, i, arr) => (
              <div key={s} className="flex fac">
                <div style={{ textAlign: "center", minWidth: 90 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: i < 5 ? "var(--gold)" : "var(--border)", color: i < 5 ? "var(--ink)" : "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ fontSize: 10, color: i < 5 ? "var(--text)" : "var(--muted)", lineHeight: 1.3 }}>{s}</div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 2, width: 20, background: i < 4 ? "var(--gold)" : "var(--border)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEAM VIEW — with Add Staff form
// ═══════════════════════════════════════════════════════════════════════════
function TeamView({ team, cases, timeEntries, users, setUsers, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [f, setF] = useState({ name:"", username:"", password:"", role:"lawyer", lsk:"", spec:"General Practice", rate:"" });
  const set = (k,v) => { setF(p=>({...p,[k]:v})); setFormErr(""); };
  const isAdmin = currentUser?.role === "admin";

  const addMember = () => {
    if (!f.name.trim() || !f.username.trim() || !f.password) return setFormErr("Name, username and password are required.");
    if (f.password.length < 6) return setFormErr("Password must be at least 6 characters.");
    if ((users||[]).find(u => u.username === f.username.toLowerCase())) return setFormErr("Username already exists.");
    const init = f.name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const av   = AV_COLORS[(users||[]).length % AV_COLORS.length];
    const newUser = { id:Date.now(), name:f.name.trim(), username:f.username.trim().toLowerCase(),
      passwordHash:hashPw(f.password), role:f.role, lsk:f.lsk||undefined,
      spec:f.spec||"General Practice", rate:parseInt(f.rate)||0, init, av, active:true };
    const updated = [...(users||[]), newUser];
    saveUsers(updated); setUsers(updated);
    setF({ name:"", username:"", password:"", role:"lawyer", lsk:"", spec:"General Practice", rate:"" });
    setShowAdd(false); setFormErr("");
    toast(`${newUser.name} added to the team.`, "success");
  };

  const removeMember = (id) => {
    if (!window.confirm("Remove this team member?")) return;
    const updated = (users||[]).filter(u => u.id !== id);
    saveUsers(updated); setUsers(updated);
    toast("Team member removed.", "info");
  };

  const avgRate = team.filter(t=>t.rate>0).length
    ? Math.round(team.filter(t=>t.rate>0).reduce((a,t)=>a+t.rate,0)/team.filter(t=>t.rate>0).length) : 0;

  return (
    <div>
      <div className="flex fac fjb mb16">
        <div>
          <div className="section-hd" style={{marginBottom:2}}>Advocates & Staff</div>
          <div className="muted" style={{fontSize:11}}>{team.length} registered · {team.filter(m=>m.role==="lawyer"||m.role==="paralegal").length} legal staff</div>
        </div>
        {isAdmin && (
          <button className="btn btn-gold btn-sm" onClick={()=>{setShowAdd(s=>!s);setFormErr("");}}>
            {showAdd ? "✕ Cancel" : "+ Add Member"}
          </button>
        )}
      </div>

      {showAdd && isAdmin && (
        <div className="card mb16">
          <div className="card-hd"><span className="card-title">Add Team Member</span></div>
          <div className="card-body">
            {formErr && <div className="auth-error mb12">⚠ {formErr}</div>}
            <div className="form-row">
              <div className="form-group"><label>Full Name *</label><input placeholder="e.g. Jane Otieno" value={f.name} onChange={e=>set("name",e.target.value)} autoFocus /></div>
              <div className="form-group"><label>Username *</label><input placeholder="e.g. jane.otieno" value={f.username} onChange={e=>set("username",e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Password * (min 6)</label><input type="password" placeholder="Temporary password" value={f.password} onChange={e=>set("password",e.target.value)} /></div>
              <div className="form-group">
                <label>Role *</label>
                <select value={f.role} onChange={e=>set("role",e.target.value)}>
                  <option value="lawyer">Advocate / Lawyer</option>
                  <option value="paralegal">Paralegal</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Specialization</label>
                <select value={f.spec} onChange={e=>set("spec",e.target.value)}>
                  {LEGAL_SPECIALIZATIONS.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Hourly Rate (KES)</label><input type="number" placeholder="e.g. 15000" value={f.rate} onChange={e=>set("rate",e.target.value)} /></div>
            </div>
            {f.role==="lawyer" && (
              <div className="form-group" style={{maxWidth:280}}><label>LSK Number</label><input placeholder="LSK/YYYY/XXXX" value={f.lsk} onChange={e=>set("lsk",e.target.value)} /></div>
            )}
            <div className="flex gap8" style={{justifyContent:"flex-end"}}>
              <button className="btn btn-ghost" onClick={()=>{setShowAdd(false);setFormErr("");}}>Cancel</button>
              <button className="btn btn-gold" onClick={addMember}>Add to Team</button>
            </div>
          </div>
        </div>
      )}

      {!team.length && !showAdd && (
        <div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",background:"var(--card)",borderRadius:"var(--r10)",border:"1px solid var(--border)"}}>
          <div style={{fontSize:40,marginBottom:12}}>◎</div>
          <div style={{fontSize:14,marginBottom:6}}>No team members yet</div>
          <div style={{fontSize:12}}>{isAdmin ? "Click + Add Member above to get started." : "No team members have been added yet."}</div>
        </div>
      )}

      {team.length > 0 && (
        <>
          <div className="stats-row cols-3">
            <StatCard icon="◎" color="c-gold" label="Total Staff" val={team.length} sub={`${team.filter(m=>m.role==="lawyer").length} advocates · ${team.filter(m=>m.role==="paralegal").length} paralegals`} />
            <StatCard icon="KES" color="c-green" label="Avg Hourly Rate" val={avgRate>0?"KES "+avgRate.toLocaleString():"—"} sub="Per hour" />
            <StatCard icon="⏱" color="c-blue" label="Billable Hours" val={timeEntries.reduce((a,t)=>a+t.hrs,0).toFixed(1)+"h"} sub="All time" />
          </div>

          {["lawyer","paralegal","admin"].map(role => {
            const group = team.filter(m => m.role===role);
            if (!group.length) return null;
            const label = role==="lawyer"?"Advocates":role==="paralegal"?"Paralegals":"Administrators";
            return (
              <div key={role} className="mb16">
                <div className="flex fac gap8 mb10">
                  <span className={`badge ${ROLE_COLORS[role]||"b-gray"}`}>{label}</span>
                  <span className="muted" style={{fontSize:11}}>{group.length} member{group.length!==1?"s":""}</span>
                </div>
                <div className="grid-team">
                  {group.map(m => {
                    const active = cases.filter(c => c.advocate===m.name && c.status==="Active").length;
                    const hrs    = timeEntries.filter(t => t.advocate===m.name).reduce((a,t)=>a+t.hrs,0);
                    return (
                      <div key={m.id} className="card">
                        <div style={{padding:"16px 14px 12px",textAlign:"center",borderBottom:"1px solid var(--border)",position:"relative"}}>
                          {isAdmin && m.id !== currentUser?.id && (
                            <button onClick={()=>removeMember(m.id)}
                              style={{position:"absolute",top:8,right:8,background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:14,padding:2}}
                              title="Remove">✕</button>
                          )}
                          <div className={`av ${m.av}`} style={{width:46,height:46,fontSize:16,margin:"0 auto 10px"}}>{m.init}</div>
                          <div className="light" style={{fontSize:13.5,fontWeight:600}}>{m.name}</div>
                          <div className="muted" style={{fontSize:11,marginTop:2}}>{ROLE_LABELS[m.role]||m.role}</div>
                          <div style={{fontSize:11,color:"var(--teal)",marginTop:3}}>{m.spec||"General Practice"}</div>
                          {m.lsk&&m.lsk!=="—"&&<span className="lsk-badge mt8">{m.lsk}</span>}
                        </div>
                        <div style={{padding:"10px 14px"}}>
                          {[["Rate",m.rate>0?`KES ${m.rate.toLocaleString()}/hr`:"—"],["Active Cases",active],["Hours Logged",hrs.toFixed(1)+"h"]].map(([l,v])=>(
                            <div key={l} className="flex fac fjb" style={{marginBottom:7}}>
                              <span className="muted" style={{fontSize:11}}>{l}</span>
                              <span className="light" style={{fontSize:12.5,fontFamily:"'Cormorant Garamond',serif"}}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMUNICATIONS
// ═══════════════════════════════════════════════════════════════════════════
function CommsView({ comms, setComms, cases, callAI, currentUser, isScoped }) {
  const [compose, setCompose] = useState(false);
  const [aiDraft, setAiDraft] = useState(""); const [draftLoading, setDraftLoading] = useState(false); const [draftPrompt, setDraftPrompt] = useState("");
  const markRead = id => setComms(cs => cs.map(c => c.id === id ? { ...c, read: true } : c));
  const unreadCount = comms.filter(c => !c.read).length;
  const draft = async () => {
    if (!draftPrompt.trim()) return;
    setDraftLoading(true); setAiDraft("");
    const r = await callAI(`Draft a professional legal correspondence for a Kenyan law firm: ${draftPrompt}. Format as a formal letter/email following Kenyan professional standards.`);
    setAiDraft(r); setDraftLoading(false);
  };
  return (
    <div className="grid2">
      <div>
        <ScopeBanner currentUser={currentUser} count={comms.length} noun="thread"
          extra={unreadCount > 0 ? `${unreadCount} unread` : "all read"} />
        <div className="flex fac fjb mb12">
          <div className="section-hd" style={{ marginBottom: 0 }}>Message Threads</div>
          <button className="btn btn-gold btn-sm" onClick={() => setCompose(!compose)}>✉ Compose</button>
        </div>
        {compose && (
          <div className="ai-glow mb12">
            <div className="ai-hd">✦ AI-Drafted Correspondence</div>
            <div className="form-group">
              <label>Describe what to draft</label>
              <input placeholder="e.g. Update client Njiru on the April 10 mention, professional tone" value={draftPrompt} onChange={e => setDraftPrompt(e.target.value)} />
            </div>
            <button className="btn btn-blue btn-sm mb8" onClick={draft} disabled={draftLoading}>{draftLoading ? "Drafting…" : "Generate Draft"}</button>
            {aiDraft && <textarea style={{ minHeight: 120 }} value={aiDraft} onChange={e => setAiDraft(e.target.value)} />}
            {aiDraft && <div className="flex gap8 mt8"><button className="btn btn-gold btn-sm">Send</button><button className="btn btn-ghost btn-sm">Save</button></div>}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {comms.map(c => (
            <div key={c.id} className="thread-item" style={{ borderLeft: `3px solid ${c.channel === "Notification" ? "var(--purple)" : !c.read ? "var(--gold)" : "var(--border)"}` }} onClick={() => markRead(c.id)}>
              <div className="flex fac fjb gap8 mb6">
                <div className="flex fac gap6">
                  <span className="light" style={{ fontSize: 12, fontWeight: 500 }}>{c.from}</span>
                  <span className={`badge ${c.channel === "Email" ? "b-blue" : "b-purple"}`}>{c.channel}</span>
                  {!c.read && <span className="badge b-gold">Unread</span>}
                </div>
                <span className="muted" style={{ fontSize: 10 }}>{c.date.split(",")[1]}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--light)", marginBottom: 3 }}>{c.subject}</div>
              <div style={{ fontSize: 11.5, maxHeight: 40, overflow: "hidden", color: "var(--text)" }}>{c.body}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{c.caseId}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="card">
          <div className="card-hd"><span className="card-title">Automated Notifications</span></div>
          <div className="card-body">
            {[["📅", "Hearing reminders", "48hr & 24hr before court dates", true], ["💰", "Invoice due reminders", "7 days before due date", true], ["✓", "Task deadline alerts", "Morning of deadline", true], ["📄", "Evidence upload alerts", "Immediate on new upload", true], ["⚠", "Overdue invoice alerts", "After due date passes", false], ["📋", "Weekly matter status", "Every Monday 8 AM", false]].map(([icon, label, desc, on], i) => (
              <div key={i} className="flex fac fjb" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                <div className="flex fac gap8">
                  <span>{icon}</span>
                  <div><div style={{ fontSize: 12.5, color: "var(--light)" }}>{label}</div><div className="muted" style={{ fontSize: 10 }}>{desc}</div></div>
                </div>
                <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? "var(--green)" : "var(--border)", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 19 : 3, transition: "left .2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BILLING & TIME
// ═══════════════════════════════════════════════════════════════════════════
function BillingView({ timeEntries, setTimeEntries, cases, currentUser, isScoped }) {
  const [editId, setEditId] = useState(null);
  const [editF,  setEditF]  = useState({});
  const total      = timeEntries.reduce((a, t) => a + t.hrs * t.rate, 0);
  const uninvoiced = timeEntries.filter(t => !t.invoiced).reduce((a, t) => a + t.hrs * t.rate, 0);
  const canEdit = (entry) => currentUser.role==="admin" || entry.advocate===currentUser.name;
  const startEdit = (t) => { setEditId(t.id); setEditF({ desc:t.desc, hrs:t.hrs, rate:t.rate }); };
  const saveEdit  = (id) => {
    setTimeEntries(ts => ts.map(t => t.id===id ? {...t,...editF,hrs:parseFloat(editF.hrs),rate:parseInt(editF.rate)} : t));
    setEditId(null); toast("Entry updated.","success");
  };
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={timeEntries.length} noun="time entry"
        extra={`${timeEntries.filter(t=>!t.invoiced).length} unbilled`} />
      <div className="stats-row cols-4">
        <StatCard icon="KES" color="c-gold" label={isScoped ? "My Billable" : "Total Billable"} val={"KES " + total.toLocaleString()} sub="All entries" />
        <StatCard icon="◧" color="c-amber" label="Unbilled" val={"KES " + uninvoiced.toLocaleString()} sub="Ready to invoice" />
        <StatCard icon="⏱" color="c-blue" label="Total Hours" val={timeEntries.reduce((a, t) => a + t.hrs, 0).toFixed(1) + "h"} sub="This month" />
        <StatCard icon="◎" color="c-green" label="Entries" val={timeEntries.length} sub={`${timeEntries.filter(t => t.invoiced).length} invoiced`} />
      </div>
      <div className="card">
        <div className="card-hd"><span className="card-title">Time Entries</span></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Date</th><th>Case Ref</th><th>Advocate</th><th>Description</th><th>Hrs</th><th>Rate (KES)</th><th>Amount (KES)</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {!timeEntries.length&&<tr><td colSpan={9} style={{textAlign:"center",padding:30,color:"var(--muted)"}}>No entries yet. Click + Time to log hours.</td></tr>}
              {timeEntries.map(t => editId===t.id ? (
                <tr key={t.id} style={{background:"var(--gold4)"}}>
                  <td className="mono muted" style={{fontSize:11}}>{t.date}</td>
                  <td><span className="mono gold" style={{fontSize:11}}>{t.caseId}</span></td>
                  <td style={{fontSize:12}}>{t.advocate}</td>
                  <td><input value={editF.desc} onChange={e=>setEditF(f=>({...f,desc:e.target.value}))} style={{padding:"3px 6px",fontSize:11}} /></td>
                  <td><input type="number" step="0.5" value={editF.hrs} onChange={e=>setEditF(f=>({...f,hrs:e.target.value}))} style={{padding:"3px 6px",fontSize:11,width:55}} /></td>
                  <td><input type="number" value={editF.rate} onChange={e=>setEditF(f=>({...f,rate:e.target.value}))} style={{padding:"3px 6px",fontSize:11,width:75}} /></td>
                  <td className="mono light">KES {(parseFloat(editF.hrs||0)*parseInt(editF.rate||0)).toLocaleString()}</td>
                  <td><span className={`badge ${t.invoiced?"b-green":"b-amber"}`}>{t.invoiced?"Invoiced":"Pending"}</span></td>
                  <td><div className="flex gap4"><button className="btn btn-gold btn-xs" onClick={()=>saveEdit(t.id)}>✓</button><button className="btn btn-ghost btn-xs" onClick={()=>setEditId(null)}>✕</button></div></td>
                </tr>
              ):(
                <tr key={t.id} style={{cursor:canEdit(t)?"pointer":"default"}} onClick={()=>canEdit(t)&&startEdit(t)} title={canEdit(t)?"Click to edit":""}>
                  <td className="mono muted" style={{fontSize:11}}>{t.date}</td>
                  <td><span className="mono gold" style={{fontSize:11}}>{t.caseId}</span></td>
                  <td style={{fontSize:12}}>{t.advocate}</td>
                  <td style={{fontSize:12}}>{t.desc}</td>
                  <td className="mono light">{t.hrs}h</td>
                  <td className="mono muted">KES {t.rate.toLocaleString()}</td>
                  <td className="mono light" style={{fontWeight:600}}>KES {(t.hrs*t.rate).toLocaleString()}</td>
                  <td><span className={`badge ${t.invoiced?"b-green":"b-amber"}`}>{t.invoiced?"Invoiced":"Pending"}</span></td>
                  <td>{canEdit(t)&&<span style={{color:"var(--muted)",fontSize:11}}>✏</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════════════════
function InvoicesView({ invoices, setInvoices, clients, callAI, currentUser, isScoped }) {
  const [sel, setSel] = useState(null); const [aiSummary, setAiSummary] = useState(""); const [aiLoading, setAiLoading] = useState(false);
  const total = invoices.reduce((a, i) => a + i.amount, 0);
  const paid  = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const updateStatus = (id, status) => setInvoices(ivs => ivs.map(i => i.id === id ? { ...i, status } : i));
  const genSummary = async () => {
    setAiLoading(true); setAiSummary("");
    const s = invoices.map(i => `${i.id}: ${i.client}, KES ${i.amount}, ${i.status}`).join("; ");
    const r = await callAI(`Analyse this billing position and recommend debt collection actions for a Kenyan law firm: ${s}. Reference applicable Kenyan law where relevant (e.g. Civil Procedure Act for debt recovery).`);
    setAiSummary(r); setAiLoading(false);
  };
  return (
    <div>
      <ScopeBanner currentUser={currentUser} count={invoices.length} noun="invoice"
        extra={invoices.filter(i=>i.status==="Overdue").length > 0
          ? `${invoices.filter(i=>i.status==="Overdue").length} overdue` : undefined} />
      <div className="stats-row cols-4">
        <StatCard icon="KES" color="c-gold" label={isScoped ? "My Invoiced" : "Total Issued"} val={"KES " + total.toLocaleString()} sub={`${invoices.length} invoices`} />
        <StatCard icon="✓" color="c-green" label="Paid" val={"KES " + paid.toLocaleString()} sub={`${invoices.filter(i => i.status === "Paid").length} invoices`} />
        <StatCard icon="◎" color="c-amber" label="Outstanding" val={"KES " + (total - paid).toLocaleString()} sub="Pending collection" />
        <StatCard icon="!" color="c-red" label="Overdue" val={invoices.filter(i => i.status === "Overdue").length} sub="Require action" />
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-hd">
            <span className="card-title">All Invoices</span>
            <button className="btn btn-blue btn-sm" onClick={genSummary} disabled={aiLoading}>✦ AI Advice</button>
          </div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Invoice No.</th><th>Client</th><th>Case</th><th>Amount (KES)</th><th>Due Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ cursor: "pointer" }} onClick={() => setSel(inv)}>
                    <td><span className="mono gold" style={{ fontSize: 10 }}>{inv.id}</span></td>
                    <td style={{ fontSize: 12 }}>{inv.client}</td>
                    <td><span className="mono muted" style={{ fontSize: 10 }}>{inv.caseId}</span></td>
                    <td className="mono light">{inv.amount.toLocaleString()}</td>
                    <td className="muted" style={{ fontSize: 11 }}>{inv.due}</td>
                    <td><InvBadge s={inv.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      {inv.status !== "Paid" && <button className="btn btn-green btn-xs" onClick={() => updateStatus(inv.id, "Paid")}>Mark Paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(aiSummary || aiLoading) && (
            <div className="ai-glow" style={{ margin: 14 }}>
              <div className="ai-hd">✦ HakiAI Collection Advice</div>
              {aiLoading && <div className="thinking"><div className="dot" /><div className="dot" /><div className="dot" /></div>}
              {aiSummary && <div className="ai-out">{aiSummary}</div>}
            </div>
          )}
        </div>
        {sel ? (
          <div className="card">
            <div className="card-hd"><span className="card-title">{sel.id}</span><button className="close-x" onClick={() => setSel(null)}>✕</button></div>
            <div className="card-body">
              {[["Client", sel.client], ["Case Reference", sel.caseId], ["Issued", sel.issued], ["Due Date", sel.due]].map(([l, v]) => (
                <div key={l} className="flex fac fjb" style={{ marginBottom: 10 }}>
                  <span className="muted" style={{ fontSize: 12 }}>{l}</span><span className="light" style={{ fontSize: 12.5 }}>{v}</span>
                </div>
              ))}
              <div className="flex fac fjb mb16"><span className="muted">Status</span><InvBadge s={sel.status} /></div>
              <div className="section-hd" style={{ fontSize: 13 }}>Line Items</div>
              <table style={{ marginBottom: 14 }}>
                <thead><tr><th>Description</th><th>Hrs</th><th>Rate</th><th>Amount (KES)</th></tr></thead>
                <tbody>{sel.items.map((item, i) => (<tr key={i}><td style={{ fontSize: 12 }}>{item.desc}</td><td className="mono">{item.hrs}</td><td className="mono">{item.rate?.toLocaleString()}</td><td className="mono light">{item.amt.toLocaleString()}</td></tr>))}</tbody>
              </table>
              <div className="divider" />
              <div className="flex fac fjb">
                <span className="light" style={{ fontWeight: 600 }}>Total (incl. VAT 16%)</span>
                <span className="serif light" style={{ fontSize: 22 }}>KES {sel.amount.toLocaleString()}</span>
              </div>
              <div className="flex gap8 mt12 fwrap">
                <button className="btn btn-ghost btn-sm">🖨 Print</button>
                <button className="btn btn-blue btn-sm">✉ Email Client</button>
                {sel.status !== "Paid" && <button className="btn btn-green btn-sm" onClick={() => updateStatus(sel.id, "Paid")}>✓ Mark Paid</button>}
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
            <div style={{ textAlign: "center", color: "var(--muted)" }}><div style={{ fontSize: 32, marginBottom: 8 }}>◧</div><div>Click an invoice to view details</div></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AI HUB
// ═══════════════════════════════════════════════════════════════════════════
function AIHub({ callAI, currentUser }) {
  const [tool,    setTool]    = useState("research");
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isText = file.type==="text/plain"||file.name.endsWith(".txt")||file.name.endsWith(".md")||file.name.endsWith(".csv");
    if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInput(prev => prev + (prev ? "\n\n" : "") + "[File: " + file.name + "]\n" + ev.target.result.slice(0,3000));
        toast("File loaded — ready for analysis.", "success");
      };
      reader.readAsText(file);
    } else {
      setInput(prev => prev + (prev ? "\n" : "") + "[Attached: " + file.name + " — paste or describe content for AI analysis]");
      toast("File attached. Paste text content for full AI analysis.", "info");
    }
    e.target.value = "";
  };
  const allTools = [
    { id:"research",     icon:"📚", label:"Legal Research",  roles:["admin","lawyer"] },
    { id:"analyse",      icon:"📄", label:"Doc Analysis",    roles:["admin","lawyer"] },
    { id:"strategy",     icon:"⚖",  label:"Case Strategy",   roles:["admin","lawyer"] },
    { id:"draft",        icon:"✍",  label:"Draft Pleading",  roles:["admin","lawyer"] },
    { id:"evidence",     icon:"🔍", label:"Evidence Eval",   roles:["admin","lawyer","paralegal"] },
    { id:"risk",         icon:"⚠",  label:"Risk Assessment", roles:["admin","lawyer"] },
    { id:"constitution", icon:"📜", label:"Constitutional",  roles:["admin","lawyer"] },
    { id:"demand",       icon:"📮", label:"Demand Letter",   roles:["admin","lawyer"] },
    { id:"summarise",    icon:"📋", label:"Summarise Doc",   roles:["admin","lawyer","paralegal"] },
  ];
  const tools = allTools.filter(t => !currentUser || t.roles.includes(currentUser.role));
  const prompts = {
    research: t => `Research applicable Kenyan laws, statutes (cite Cap. numbers), and relevant case law for this legal issue: ${t}`,
    analyse: t => `Extract all key legal facts, parties, obligations, dates, and clauses from this document. Reference applicable Kenyan law where relevant: ${t}`,
    strategy: t => `Suggest a comprehensive litigation strategy for this Kenyan court matter, including applicable statutes, precedents, evidence requirements, and procedural steps: ${t}`,
    draft: t => `Draft a professional legal pleading (plaint, affidavit, or motion) following Kenyan Civil Procedure Rules for: ${t}`,
    evidence: t => `Evaluate the admissibility and weight of this evidence under the Evidence Act Cap. 80 of Kenya: ${t}`,
    risk: t => `Conduct a legal risk assessment for this Kenyan law matter, identifying statutory risks, procedural pitfalls, and strategic vulnerabilities: ${t}`,
    constitution: t => `Analyse this issue under the Constitution of Kenya 2010, identifying relevant Articles, rights, and constitutional remedies: ${t}`,
    demand: t => `Draft a formal pre-litigation demand letter compliant with Kenyan professional standards and the Law Society of Kenya guidelines for: ${t}`,
    summarise: t => `Provide a concise professional summary of this legal document, highlighting key facts, obligations, risks, and action points under Kenyan law: ${t}`,
  };
  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult("");
    const r = await callAI(prompts[tool](input));
    setResult(r); setLoading(false);
  };
  return (
    <div>
      <div className="ai-glow mb16">
        <div className="ai-hd">✦ HakiAI — Kenyan Legal Intelligence Platform</div>
        <div style={{ fontSize: 12.5 }}>Powered by AI trained on Kenyan law — Constitution 2010, Penal Code Cap. 63, Civil Procedure Act, Evidence Act, Land Registration Act, Companies Act, and LSK professional conduct rules.</div>
      </div>
      <div className="flex gap8 mb16 fwrap">
        {tools.map(t => (
          <button key={t.id} className={`btn btn-sm ${tool === t.id ? "btn-gold" : "btn-ghost"}`} onClick={() => { setTool(t.id); setResult(""); }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-hd"><span className="card-title">Input</span></div>
          <div className="card-body">
            <div className="form-group">
              <label>Legal text, case facts, or issue description</label>
              <textarea style={{ minHeight: 200 }} placeholder={tool === "research" ? "Describe the legal issue, e.g. 'adverse possession under the Land Registration Act 2012'…" : tool === "constitution" ? "Describe the constitutional issue, e.g. 'right to fair hearing under Article 50'…" : "Paste document text or describe the situation…"} value={input} onChange={e => setInput(e.target.value)} />
            </div>
            <button className="btn btn-gold btn-full" onClick={run} disabled={loading || !input.trim()}>
              {loading ? "⏳ Processing…" : "✦ Run HakiAI Analysis"}
            </button>
            <div className="drop-zone mt12"
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const ev={target:{files:[f],value:""}};handleFile(ev);}}}>
              <div className="dz-icon">📎</div>
              <div style={{fontSize:12.5}}>Drop or click to upload file for analysis</div>
              <div className="muted" style={{fontSize:11,marginTop:3}}>TXT / MD / CSV auto-read · PDF: paste text</div>
              <input ref={fileRef} type="file" style={{display:"none"}} onChange={handleFile} accept=".txt,.md,.csv" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <span className="card-title">HakiAI Output</span>
            {result && <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(result)}>📋 Copy</button>}
          </div>
          <div className="card-body">
            {loading && <div className="thinking"><div className="dot" /><div className="dot" /><div className="dot" /><span style={{ marginLeft: 8 }}>HakiAI analysing under Kenyan law…</span></div>}
            {result && <div className="ai-out">{result}</div>}
            {!loading && !result && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>⚖</div>
                <div>Select a tool and describe your legal issue.</div>
                <div style={{ fontSize: 11, marginTop: 8 }}>HakiAI references Kenyan statutes, case law, and court procedures.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════════════════════════
function Reports({ cases, invoices, team, timeEntries, tasks, clients }) {
  const typeCount = CASE_TYPES.slice(0, 5).map(t => ({ t, c: cases.filter(c => c.type === t).length }));
  const maxT = Math.max(...typeCount.map(t => t.c), 1);
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const rev = [420, 680, 550, 900, 780, 1150, 880, 1020, 1300, 950, 1420, 1180].map(v => Math.round(v * 0.8));
  const maxR = Math.max(...rev);
  return (
    <div>
      <div className="stats-row cols-4">
        <StatCard icon="⚖" color="c-gold" label="Total Matters" val={cases.length} sub={cases.filter(c=>c.status==="Active").length+" active"} />
        <StatCard icon="KES" color="c-green" label="Revenue" val={"KES "+invoices.reduce((a,i)=>a+i.amount,0).toLocaleString()} sub={"KES "+invoices.filter(i=>i.status==="Paid").reduce((a,i)=>a+i.amount,0).toLocaleString()+" paid"} />
        <StatCard icon="✓" color="c-blue" label="Task Completion" val={tasks.length?Math.round(tasks.filter(t=>t.done).length/tasks.length*100)+"%":"—"} sub={tasks.filter(t=>t.done).length+"/"+tasks.length+" done"} />
        <StatCard icon="◉" color="c-purple" label="Clients" val={clients.length} sub={clients.filter(c=>c.status==="Active").length+" active"} />
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-hd"><span className="card-title">Matters by Type</span></div>
          <div className="card-body">
            {typeCount.map(({ t, c }) => (
              <div key={t} style={{ marginBottom: 12 }}>
                <div className="flex fac fjb" style={{ marginBottom: 4 }}><span style={{ fontSize: 12 }}>{t}</span><span className="mono light">{c}</span></div>
                <div className="pbar" style={{ height: 6 }}><div className="pfill" style={{ width: (c / maxT * 100) + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="card-title">Monthly Fees (KES k)</span></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, paddingBottom: 22, position: "relative" }}>
              <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, height: 1, background: "var(--border)" }} />
              {rev.map((v, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: i === 2 ? "var(--gold)" : "var(--blue3)", border: i === 2 ? "none" : "1px solid var(--blue)", height: (v / maxR * 96) + "px", minWidth: 14 }} />
                  <div style={{ position: "absolute", bottom: 2, fontSize: 8, color: "var(--muted)" }}>{months[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid2 mt16">
        <div className="card">
          <div className="card-hd"><span className="card-title">Advocate Utilisation</span></div>
          <div className="card-body">
            {team.filter(m => m.rate > 0).map(m => {
              const hrs = timeEntries.filter(t => t.advocate === m.name).reduce((a, t) => a + t.hrs, 0);
              const cap = 40; const pct = Math.min(Math.round(hrs / cap * 100), 100);
              return (
                <div key={m.id} style={{ marginBottom: 10 }}>
                  <div className="flex fac fjb" style={{ marginBottom: 3 }}><span style={{ fontSize: 12 }}>{m.name}</span><span className="mono" style={{ fontSize: 11, color: pct > 80 ? "var(--red)" : pct > 50 ? "var(--amber)" : "var(--green)" }}>{hrs}h / {cap}h</span></div>
                  <div className="pbar" style={{ height: 5 }}><div className="pfill" style={{ width: pct + "%", background: pct > 80 ? "var(--red)" : pct > 50 ? "var(--amber)" : "var(--green)" }} /></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><span className="card-title">Fee Collection Summary</span></div>
          <div className="card-body">
            {[["Paid", "b-green"], ["Pending", "b-amber"], ["Overdue", "b-red"]].map(([s, b]) => {
              const count = invoices.filter(i => i.status === s).length;
              const amt = invoices.filter(i => i.status === s).reduce((a, i) => a + i.amount, 0);
              return (
                <div key={s} style={{ background: "var(--deep)", borderRadius: "var(--r8)", padding: "12px 14px", marginBottom: 10 }}>
                  <div className="flex fac fjb"><span className={`badge ${b}`}>{s}</span><span className="serif light" style={{ fontSize: 20 }}>KES {amt.toLocaleString()}</span></div>
                  <div className="muted" style={{ fontSize: 10, marginTop: 4 }}>{count} invoice{count !== 1 ? "s" : ""}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════
function TemplatesView({ templates, callAI }) {
  const [sel, setSel] = useState(null); const [details, setDetails] = useState(""); const [generated, setGenerated] = useState(""); const [loading, setLoading] = useState(false);
  const cats = [...new Set(templates.map(t => t.cat))];
  const generate = async () => {
    if (!sel) return;
    setLoading(true); setGenerated("");
    const r = await callAI(`Generate a complete, professional "${sel.name}" for a Kenyan law firm. Follow Kenyan legal standards, the Civil Procedure Rules 2010, and LSK professional conduct guidelines. Include all standard clauses with [PLACEHOLDER] brackets. Details: ${details || "Standard template"}. Format with proper legal structure and headings. Include relevant statute references.`);
    setGenerated(r); setLoading(false);
  };
  return (
    <div className="grid2">
      <div>
        <div className="section-hd">Kenyan Legal Document Templates</div>
        {cats.map(cat => (
          <div key={cat} style={{ marginBottom: 16 }}>
            <div className="muted mb8" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>{cat}</div>
            {templates.filter(t => t.cat === cat).map(t => (
              <div key={t.id} className="task-item" style={{ borderLeft: sel?.id === t.id ? "3px solid var(--gold)" : "3px solid transparent" }} onClick={() => { setSel(t); setGenerated(""); }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div className="light" style={{ fontSize: 12.5, fontWeight: 500 }}>{t.name}</div>
                  <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>{t.desc}</div>
                </div>
                {sel?.id === t.id && <span className="badge b-gold">Selected</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {sel ? (
          <div>
            <div className="card mb12">
              <div className="card-hd"><span className="card-title">{sel.name}</span></div>
              <div className="card-body">
                <div className="form-group">
                  <label>Specific details (optional)</label>
                  <textarea style={{ minHeight: 60 }} placeholder="e.g. Client name, case number, specific terms, county…" value={details} onChange={e => setDetails(e.target.value)} />
                </div>
                <button className="btn btn-gold btn-full" onClick={generate} disabled={loading}>
                  {loading ? "⏳ Generating…" : "✦ Generate with HakiAI"}
                </button>
              </div>
            </div>
            {loading && <div className="thinking" style={{ padding: 14 }}><div className="dot" /><div className="dot" /><div className="dot" /><span style={{ marginLeft: 8 }}>Drafting Kenyan legal document…</span></div>}
            {generated && (
              <div className="card">
                <div className="card-hd">
                  <span className="card-title">Generated Document</span>
                  <div className="flex gap8">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(generated)}>📋 Copy</button>
                    <button className="btn btn-gold btn-sm">💾 Save</button>
                  </div>
                </div>
                <div className="card-body">
                  <pre style={{ fontSize: 11.5, lineHeight: 1.75, whiteSpace: "pre-wrap", color: "var(--text)", maxHeight: 420, overflowY: "auto" }}>{generated}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "70px 20px", color: "var(--muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>◫</div>
            <div>Select a template to generate with HakiAI</div>
            <div style={{ fontSize: 11, marginTop: 8 }}>All templates comply with Kenyan law and LSK standards</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFLICT CHECKER
// ═══════════════════════════════════════════════════════════════════════════
function ConflictChecker({ clients, cases, callAI }) {
  const [newClient, setNewClient] = useState(""); const [opposing, setOpposing] = useState(""); const [result, setResult] = useState(null); const [loading, setLoading] = useState(false);
  const check = async () => {
    if (!newClient.trim()) return;
    setLoading(true); setResult(null);
    const existing = clients.map(c => c.name).join(", ");
    const caseTitles = cases.map(c => c.title).join("; ");
    const r = await callAI(`Conflict of interest check under LSK Advocates Act Cap. 16 and the LSK Code of Standards and Ethics. New prospective client: "${newClient}". ${opposing ? `Opposing party: "${opposing}".` : ""} Existing firm clients: ${existing}. Current matters: ${caseTitles}. Check for: (1) direct adverse interest, (2) former client conflicts, (3) corporate affiliate conflicts, (4) imputed conflicts across advocates. Cite specific LSK conduct rules where applicable.`);
    const hasConflict = r.toLowerCase().includes("conflict") || r.toLowerCase().includes("adverse") || r.toLowerCase().includes("cannot act");
    setResult({ conflict: hasConflict, text: r }); setLoading(false);
  };
  return (
    <div>
      <div className="ai-glow mb16">
        <div className="ai-hd">⚠ Conflict of Interest Checker</div>
        <div style={{ fontSize: 12.5 }}>Compliant with the Advocates Act Cap. 16 and the Law Society of Kenya Code of Standards & Ethics. Run a conflict check before accepting any new instruction.</div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-hd"><span className="card-title">New Matter Check</span></div>
          <div className="card-body">
            <div className="form-group"><label>Prospective Client Name *</label><input placeholder="Full name or company name" value={newClient} onChange={e => setNewClient(e.target.value)} /></div>
            <div className="form-group"><label>Opposing Party (if known)</label><input placeholder="Other party in the matter" value={opposing} onChange={e => setOpposing(e.target.value)} /></div>
            <button className="btn btn-gold btn-full" onClick={check} disabled={loading || !newClient.trim()}>
              {loading ? "⏳ Checking…" : "⚠ Run Conflict Check"}
            </button>
            {loading && <div className="thinking mt12"><div className="dot" /><div className="dot" /><div className="dot" /><span style={{ marginLeft: 8 }}>Scanning LSK register & client database…</span></div>}
            {result && (
              <div className={result.conflict ? "conflict-warn" : "conflict-ok"} style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>{result.conflict ? "⚠ Potential Conflict Detected — Do Not Accept" : "✓ No Conflict Found — Instruction May Proceed"}</div>
                <div style={{ fontSize: 12.5, lineHeight: 1.75 }}>{result.text}</div>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-hd"><span className="card-title">Current Client Register</span></div>
            <div className="card-body">
              {clients.filter(c => c.status === "Active").map(c => (
                <div key={c.id} className="flex fac fjb" style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 12.5, color: "var(--light)" }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 10 }}>{c.type} · {c.caseRef} · {c.county}</div>
                  </div>
                  <span className="mono gold" style={{ fontSize: 10 }}>{c.attorney.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card mt12">
            <div className="card-hd"><span className="card-title">LSK Conflict Rules</span></div>
            <div className="card-body">
              {["Advocates Act Cap. 16 — duty of loyalty to client", "LSK Rule 9 — no adverse interest without consent", "Former client rule — confidential information protected", "Imputed disqualification — applies to whole firm", "Corporate affiliates — parent/subsidiary conflicts covered"].map((r, i) => (
                <div key={i} className="flex gap8 fac" style={{ marginBottom: 8 }}>
                  <span style={{ color: "var(--amber)", fontSize: 13 }}>▸</span>
                  <span style={{ fontSize: 11.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CASE DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════
function CaseDetailModal({ case_: c, onClose, callAI, tasks, setTasks, evidence, setEvidence, currentUser }) {
  const caseEv = (evidence||{})[c.id] || [];
  const detailFileRef = useRef(null);
  const handleDetailUpload = (files) => {
    if (!files||!files.length) return;
    const items = Array.from(files).map(file => {
      const ext  = file.name.split(".").pop().toLowerCase();
      const icon = ["jpg","jpeg","png","gif","webp"].includes(ext)?"🖼️":ext==="pdf"?"📄":"📋";
      const type = ["jpg","jpeg","png","gif","webp"].includes(ext)?"Image":ext==="pdf"?"PDF":"Document";
      return { id:Date.now()+Math.random(), name:file.name, type, icon,
               date:new Date().toLocaleDateString("en-KE",{day:"numeric",month:"short"}),
               uploaded:currentUser?.name||"Unknown", size:file.size, tags:[], caseId:c.id };
    });
    if (setEvidence) setEvidence(prev => ({ ...prev, [c.id]: [...((prev||{})[c.id]||[]), ...items] }));
    toast(items.length+" file"+(items.length>1?"s":"")+" added to case.","success");
  };
  const [tab, setTab] = useState("overview");
  const [aiResult, setAiResult] = useState(""); const [aiLoading, setAiLoading] = useState(false);
  const caseTasks = tasks.filter(t => t.caseId === c.id);
  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const runAI = async (p) => { setAiLoading(true); setAiResult(""); const r = await callAI(`Matter: ${c.title} (${c.id}). Court: ${c.court}. Client: ${c.client}. Charge/Statute: ${c.charge}. Notes: ${c.notes}. ${p}`); setAiResult(r); setAiLoading(false); };
  const TABS = ["overview", "documents", "evidence", "tasks", "ai", "timeline", "billing"];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: 1 }}>{c.id} · {c.type}</div>
            <div className="modal-title truncate">{c.title}</div>
          </div>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        {/* Meta bar */}
        <div style={{ padding: "10px 20px", background: "var(--deep)", borderBottom: "1px solid var(--border)", display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          {[["Client", c.client], ["Advocate", c.advocate], ["Court", c.court], ["Filed", c.filed], ["Hearing", c.hearing]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12.5, color: "var(--light)" }}>{v}</div></div>
          ))}
          <SBadge s={c.status} /><PBadge p={c.priority} />
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 3 }}>Progress</div>
            <div className="pbar"><div className="pfill" style={{ width: c.progress + "%" }} /></div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{c.progress}%</div>
          </div>
        </div>
        {/* Charge */}
        <div style={{ padding: "8px 20px", background: "var(--gold4)", borderBottom: "1px solid rgba(201,168,76,.15)", fontSize: 11.5 }}>
          <span className="muted">Charge / Statute: </span><span className="gold">{c.charge}</span>
        </div>
        {/* Tabs */}
        <div style={{ padding: "0 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {TABS.map(t => <div key={t} className={`tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>)}
          </div>
        </div>
        <div style={{ padding: "18px 20px 22px", maxHeight: "50vh", overflowY: "auto" }}>
          {tab === "overview" && (
            <div className="grid2">
              <div className="card">
                <div className="card-hd"><span className="card-title">Case Notes</span></div>
                <div className="card-body">
                  <p style={{ lineHeight: 1.8, fontSize: 12.5 }}>{c.notes}</p>
                  <textarea style={{ marginTop: 12, minHeight: 60 }} placeholder="Add a note…" />
                  <button className="btn btn-ghost btn-sm mt8">+ Save Note</button>
                </div>
              </div>
              <div>
                <div className="card">
                  <div className="card-hd"><span className="card-title">Matter Stats</span></div>
                  <div className="card-body">
                    {[["Documents", c.docs], ["Evidence Items", c.evidence], ["Billed (KES)", c.billable?.toLocaleString()], ["Open Tasks", caseTasks.filter(t => !t.done).length]].map(([l, v]) => (
                      <div key={l} className="flex fac fjb" style={{ marginBottom: 9 }}>
                        <span className="muted" style={{ fontSize: 12 }}>{l}</span>
                        <span className="serif light" style={{ fontSize: 18 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === "documents" && (
            <div>
              <div className="drop-zone mb12"><div className="dz-icon">📁</div><div>Drop pleadings, affidavits, court orders here</div><div className="muted" style={{ fontSize: 11, marginTop: 3 }}>PDF, DOCX — AI extracts text automatically</div></div>
              <div className="card">
                <table>
                  <thead><tr><th>Document</th><th>Type</th><th>Filed By</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {[{ n: "Charge Sheet", t: "Court Document", a: "DPP Office", d: "20 Jan" }, { n: "Client Witness Statement", t: "Affidavit", a: "Wanjiku Kariuki", d: "22 Jan" }, { n: "Notice of Motion", t: "Pleading", a: "Wanjiku Kariuki", d: "14 Feb" }, { n: "Prosecution Witness List", t: "Court Document", a: "DPP Office", d: "1 Mar" }].map((d, i) => (
                      <tr key={i}>
                        <td><span style={{ marginRight: 8 }}>📄</span><span className="light">{d.n}</span></td>
                        <td><span className="tag">{d.t}</span></td>
                        <td className="muted" style={{ fontSize: 12 }}>{d.a}</td>
                        <td className="muted" style={{ fontSize: 11 }}>{d.d}</td>
                        <td><div className="flex gap6"><button className="btn btn-ghost btn-xs">View</button><button className="btn btn-blue btn-xs" onClick={() => setTab("ai")}>AI</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {tab === "evidence" && (
            <div>
              <div className="flex fac fjb mb12">
                <div><span className="light" style={{fontSize:13,fontWeight:500}}>Evidence for {c.id}</span><span className="muted" style={{fontSize:11,marginLeft:8}}>{caseEv.length} item{caseEv.length!==1?"s":""} uploaded</span></div>
                <button className="btn btn-gold btn-sm" onClick={()=>detailFileRef.current?.click()}>+ Upload Evidence</button>
              </div>
              <input ref={detailFileRef} type="file" multiple style={{display:"none"}} onChange={e=>handleDetailUpload(e.target.files)} accept="image/*,.pdf,.doc,.docx,.mp3,.wav,.mp4,.txt" />
              <div className="drop-zone mb12"
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();handleDetailUpload(e.dataTransfer.files);}}
                onClick={()=>detailFileRef.current?.click()}
                style={{cursor:"pointer"}}>
                <div className="dz-icon">📸</div>
                <div style={{fontSize:13}}>Drop evidence files here or click to upload</div>
                <div className="muted" style={{fontSize:11,marginTop:3}}>Photos, PDFs, recordings, documents — linked to this case</div>
              </div>
              {!caseEv.length && (
                <div className="muted" style={{textAlign:"center",padding:"30px 0",fontSize:12}}>No evidence uploaded for this case yet.</div>
              )}
              <div className="ev-grid">
                {caseEv.map(e => (
                  <div key={e.id} className="ev-card" style={{position:"relative"}}>
                    <button onClick={()=>{if(setEvidence&&window.confirm("Remove?"))setEvidence(prev=>({...prev,[c.id]:((prev||{})[c.id]||[]).filter(x=>x.id!==e.id)}));toast("Removed.","info");}}
                      style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.5)",border:"none",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,cursor:"pointer",zIndex:1}}>✕</button>
                    <div className="ev-thumb">{e.icon}</div>
                    <div className="ev-label">
                      <div className="ev-name">{e.name}</div>
                      <div className="ev-meta">{e.type} · {e.date}</div>
                      <div className="ev-meta" style={{color:"var(--blue2)"}}>{e.uploaded}</div>
                      {e.size&&<div className="ev-meta">{(e.size/1024).toFixed(1)}KB</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "tasks" && (
            <div>
              {caseTasks.map(t => (
                <div key={t.id} className="task-item">
                  <div className={`task-cb${t.done ? " checked" : ""}`} onClick={() => toggle(t.id)}>{t.done ? "✓" : "□"}</div>
                  <div style={{ flex: 1 }}>
                    <div className="light" style={{ fontSize: 12.5, fontWeight: 500, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? .5 : 1 }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 10, marginTop: 2 }}>Due {t.due} · {t.assignee.split(" ")[0]} · {t.type}</div>
                  </div>
                  <PBadge p={t.priority} />
                </div>
              ))}
              {!caseTasks.length && <div className="muted" style={{ textAlign: "center", padding: 30 }}>No tasks for this matter yet.</div>}
            </div>
          )}
          {tab === "ai" && (
            <div className="grid2">
              <div>
                {[
                  ["⚖ Litigation Strategy", "Suggest a comprehensive litigation strategy for this Kenyan court matter, referencing applicable statutes and procedents."],
                  ["📋 Summary of Pleadings", "Summarise all pleadings and their legal significance under Kenyan procedural law."],
                  ["🔍 Evidence Admissibility", "Assess the admissibility and weight of current evidence under the Evidence Act Cap. 80."],
                  ["⚠ Legal Risks", "Identify legal risks, procedural pitfalls, and strategic weaknesses in this matter."],
                  ["📅 Procedural Next Steps", "Outline the next procedural steps in this Kenyan court matter."],
                  ["✉ Client Status Update", "Draft a professional status update letter for the client following LSK communication standards."],
                ].map(([l, p]) => (
                  <button key={l} className="btn btn-ghost mb8" style={{ width: "100%", justifyContent: "flex-start", textAlign: "left" }} onClick={() => runAI(p)}>{l}</button>
                ))}
              </div>
              <div className="ai-glow">
                <div className="ai-hd">✦ HakiAI</div>
                {aiLoading && <div className="thinking"><div className="dot" /><div className="dot" /><div className="dot" /><span style={{ marginLeft: 8 }}>Analysing under Kenyan law…</span></div>}
                {aiResult && <div className="ai-out">{aiResult}</div>}
                {!aiLoading && !aiResult && <div className="muted" style={{ fontSize: 12 }}>Select an analysis above to get AI-powered insights on this matter.</div>}
              </div>
            </div>
          )}
          {tab === "timeline" && (
            <div className="tl">
              {[["10 Mar 2025", "Notice of Motion filed at Milimani Law Courts", "Wanjiku Kariuki"], ["5 Mar 2025", "CCTV evidence obtained and logged", "Priscilla Njoroge"], ["28 Feb 2025", "DPP filed prosecution witness list", "DPP Office"], ["14 Feb 2025", "Notice of Motion drafted", "Wanjiku Kariuki"], ["22 Jan 2025", "Client witness statement recorded", "Kevin Mwangi"], ["15 Jan 2025", "Matter opened — instruction accepted", "Wanjiku Kariuki"]].map(([d, e, a], i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: "var(--gold)" }} />
                  <div className="tl-time">{d}</div>
                  <div className="tl-text">{e}</div>
                  <div className="tl-by">{a}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "billing" && (
            <div>
              <div className="flex fac fjb mb16">
                <div><span className="muted">Total Billed: </span><span className="serif light" style={{ fontSize: 22 }}>KES {c.billable?.toLocaleString()}</span></div>
                <button className="btn btn-gold btn-sm">+ Log Time</button>
              </div>
              <div className="card">
                <table>
                  <thead><tr><th>Date</th><th>Advocate</th><th>Description</th><th>Hrs</th><th>Rate (KES)</th><th>Amount (KES)</th></tr></thead>
                  <tbody>
                    {[{ d: "11 Mar", a: "Wanjiku Kariuki", desc: "Client conference", h: 2.5, r: 35000 }, { d: "10 Mar", a: "Kevin Mwangi", desc: "Filing at Milimani", h: 4, r: 12000 }, { d: "7 Mar", a: "Wanjiku Kariuki", desc: "Court mention", h: 3.5, r: 35000 }].map((e, i) => (
                      <tr key={i}>
                        <td className="mono muted" style={{ fontSize: 11 }}>{e.d}</td><td style={{ fontSize: 12 }}>{e.a}</td><td style={{ fontSize: 12 }}>{e.desc}</td>
                        <td className="mono">{e.h}h</td><td className="mono muted">{e.r.toLocaleString()}</td><td className="mono light">{(e.h * e.r).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUICK AI MODAL
// ═══════════════════════════════════════════════════════════════════════════
function QuickAIModal({ aiChat, aiMsg, setAiMsg, sendChat, aiLoading, onClose, chatRef }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <div><div className="modal-title">✦ HakiAI Assistant</div><div className="modal-sub">Kenyan legal AI — statutes, case law, court procedure, drafting</div></div>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        <div className="ai-glow" style={{ margin: "14px 20px 0", borderRadius: "var(--r8)" }}>
          <div style={{ fontSize: 11.5, color: "var(--text)" }}>Ask about Kenyan law, draft pleadings, interpret statutes, analyse evidence, get case strategy advice…</div>
        </div>
        <div className="chat-wrap">
          <div className="chat-msgs" ref={chatRef}>
            {!aiChat.length && <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--muted)" }}><div style={{ fontSize: 28, marginBottom: 8 }}>⚖</div><div style={{ fontSize: 13 }}>How can HakiAI assist today?</div><div style={{ fontSize: 11, marginTop: 6 }}>Trained on the Constitution of Kenya 2010, Penal Code, Civil Procedure Rules, Evidence Act, and LSK guidelines</div></div>}
            {aiChat.map((m, i) => (
              <div key={i} className={`msg msg-${m.r}`}>
                <div className="bubble">{m.t}</div>
              </div>
            ))}
            {aiLoading && <div className="msg msg-a"><div className="bubble"><div className="thinking"><div className="dot" /><div className="dot" /><div className="dot" /></div></div></div>}
          </div>
          <div className="chat-bottom">
            <input placeholder="Ask HakiAI about Kenyan law…" value={aiMsg} onChange={e => setAiMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
            <button className="btn btn-gold" onClick={sendChat} disabled={aiLoading}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FORM MODALS
// ═══════════════════════════════════════════════════════════════════════════
function NewCaseModal({ setCases, clients, onClose, currentUser, users }) {
  const lawyers = (users||[]).filter(u => u.role==="lawyer" && u.active);
  const defaultAdvocate = currentUser?.role === "lawyer" ? currentUser.name : "";
  const [f, setF] = useState({ title: "", type: "Criminal", client: "", advocate: defaultAdvocate, court: KE_COURTS[0], priority: "Medium", charge: "", notes: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.title || !f.client) return;
    const yr = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 900) + 100);
    const prefix = f.type === "Criminal" ? "HCCR/E" : f.type === "Land / Property" ? "ELC" : "HCCC";
    setCases(c => [...c, { id: `${prefix}/${num}/${yr}`, ...f, status: "Pending", filed: todayStr(), hearing: "TBD", progress: 0, docs: 0, evidence: 0, stage: "Intake", billable: 0 }]);
    onClose();
  };
  const isLawyer = currentUser?.role === "lawyer";
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd"><div><div className="modal-title">Open New Matter</div><div className="modal-sub">Create a new case file for a client instruction</div></div><button className="close-x" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label>Matter Title *</label><input placeholder="e.g. Republic v. John Doe — Theft by Agent" value={f.title} onChange={e => set("title", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Case Type</label><select value={f.type} onChange={e => set("type", e.target.value)}>{CASE_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>Priority</label><select value={f.priority} onChange={e => set("priority", e.target.value)}>{["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Client *</label><select value={f.client} onChange={e => set("client", e.target.value)}><option value="">Select client…</option>{clients.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
            <div className="form-group">
              <label>Lead Advocate</label>
              {isLawyer
                ? <input value={f.advocate} readOnly style={{opacity:.7}} title="You are the lead advocate" />
                : <select value={f.advocate} onChange={e => set("advocate", e.target.value)}><option value="">Assign later</option>{lawyers.map(l=><option key={l.id} value={l.name}>{l.name}{l.spec&&l.spec!=="General Practice"?" — "+l.spec:""}</option>)}</select>
              }
            </div>
          </div>
          <div className="form-group"><label>Court</label><select value={f.court} onChange={e => set("court", e.target.value)}>{KE_COURTS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className="form-group"><label>Charge / Applicable Statute</label><input placeholder="e.g. Section 317 Penal Code Cap. 63" value={f.charge} onChange={e => set("charge", e.target.value)} /></div>
          <div className="form-group"><label>Initial Notes</label><textarea placeholder="Facts of the matter, client's account, initial assessment…" value={f.notes} onChange={e => set("notes", e.target.value)} /></div>
          <div className="flex gap8" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-gold" onClick={submit}>Open Matter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewClientModal({ setClients, onClose, users }) {
  const lawyers = (users||[]).filter(u => u.role==="lawyer" && u.active);
  const [f, setF] = useState({ name:"", phone:"", email:"", type:"Individual", county:"Nairobi", id_no:"", notes:"", attorney:"", retainer:"" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.name) return;
    setClients(c => [...c, { id:Date.now(), ...f, retainer:parseInt(f.retainer)||0, billed:0, status:"Pending", caseRef:"—", joined:todayStr() }]);
    onClose();
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd"><div><div className="modal-title">Register New Client</div><div className="modal-sub">Add to firm client registry (KYC required)</div></div><button className="close-x" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label>Full Name / Company Name *</label><input placeholder="As per national ID or certificate of incorporation" value={f.name} onChange={e => set("name", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Phone Number</label><input placeholder="+254 7XX XXX XXX" value={f.phone} onChange={e => set("phone", e.target.value)} /></div>
            <div className="form-group"><label>Email Address</label><input placeholder="client@email.com" value={f.email} onChange={e => set("email", e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Client Type</label><select value={f.type} onChange={e => set("type", e.target.value)}>{["Individual", "Corporate", "NGO / CBO", "Government / County", "Trust", "Partnership"].map(t => <option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label>County</label><select value={f.county} onChange={e => set("county", e.target.value)}>{KE_COUNTIES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Assign Advocate</label>
              <select value={f.attorney} onChange={e => set("attorney", e.target.value)}>
                <option value="">Unassigned</option>
                {lawyers.map(l => <option key={l.id} value={l.name}>{l.name}{l.spec&&l.spec!=="General Practice"?" — "+l.spec:""}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Retainer (KES)</label><input type="number" placeholder="e.g. 500000" value={f.retainer} onChange={e => set("retainer", e.target.value)} /></div>
          </div>
          <div className="form-group"><label>ID / Reg. No. (KYC)</label><input placeholder="National ID, passport, or company reg. number" value={f.id_no} onChange={e => set("id_no", e.target.value)} /></div>
          <div className="form-group"><label>Initial Notes</label><textarea placeholder="Enquiry details, referral source, urgency…" value={f.notes} onChange={e => set("notes", e.target.value)} /></div>
          <div className="flex gap8" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-gold" onClick={submit}>Register Client</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewTimeModal({ setTimeEntries, cases, team, onClose }) {
  const [f, setF] = useState({ caseId: cases[0]?.id || "", advocate: team[0]?.name || "", desc: "", hrs: "", rate: team[0]?.rate || 0 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.desc || !f.hrs) return;
    setTimeEntries(t => [...t, { id: t.length + 1, ...f, hrs: parseFloat(f.hrs), rate: parseInt(f.rate), date: new Date().toLocaleDateString("en-KE",{day:"numeric",month:"short"}), invoiced: false }]);
    onClose();
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd"><div className="modal-title">Log Time Entry</div><button className="close-x" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group"><label>Matter *</label><select value={f.caseId} onChange={e => set("caseId", e.target.value)}>{cases.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select></div>
            <div className="form-group"><label>Advocate</label><select value={f.advocate} onChange={e => { const m = team.find(t => t.name === e.target.value); set("advocate", e.target.value); if (m) set("rate", m.rate); }}>{team.map(t => <option key={t.id}>{t.name}</option>)}</select></div>
          </div>
          <div className="form-group"><label>Work Description *</label><input placeholder="e.g. Court mention — Milimani Law Courts" value={f.desc} onChange={e => set("desc", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Hours *</label><input type="number" step="0.5" placeholder="2.5" value={f.hrs} onChange={e => set("hrs", e.target.value)} /></div>
            <div className="form-group"><label>Rate (KES/hr)</label><input type="number" value={f.rate} onChange={e => set("rate", e.target.value)} /></div>
          </div>
          {f.hrs && f.rate && <div className="ai-glow mb12"><span className="muted">Amount: </span><span className="serif light" style={{ fontSize: 20 }}>KES {(parseFloat(f.hrs || 0) * parseInt(f.rate || 0)).toLocaleString()}</span></div>}
          <div className="flex gap8" style={{ justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-gold" onClick={submit}>Log Entry</button></div>
        </div>
      </div>
    </div>
  );
}

function NewTaskModal({ setTasks, cases, team, onClose, currentUser }) {
  const defaultAssignee = (currentUser?.role === "lawyer" || currentUser?.role === "paralegal")
    ? currentUser.name : (team[0]?.name || "");
  const [f, setF] = useState({ title: "", caseId: cases[0]?.id || "", assignee: defaultAssignee, due: "", priority: "Medium", type: "Review" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = () => {
    if (!f.title) return;
    setTasks(t => [...t, { id: Date.now(), ...f, done: false }]);
    onClose();
  };
  const isScoped = currentUser?.role === "lawyer" || currentUser?.role === "paralegal";
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd"><div className="modal-title">Add Task</div><button className="close-x" onClick={onClose}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label>Task Description *</label><input placeholder="e.g. File Notice of Motion at Milimani by 5 PM" value={f.title} onChange={e => set("title", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group">
              <label>Matter</label>
              <select value={f.caseId} onChange={e => set("caseId", e.target.value)}>
                {cases.length ? cases.map(c => <option key={c.id} value={c.id}>{c.id}</option>)
                  : <option value="">No matters assigned</option>}
              </select>
            </div>
            <div className="form-group">
              <label>Assignee</label>
              {isScoped
                ? <input value={f.assignee} readOnly style={{opacity:.7}} title="Task assigned to you" />
                : <select value={f.assignee} onChange={e => set("assignee", e.target.value)}>{team.map(t => <option key={t.id}>{t.name}</option>)}</select>
              }
            </div>
          </div>
          <div className="form-row3">
            <div className="form-group"><label>Due Date</label><input type="date" value={f.due} onChange={e => set("due", e.target.value)} /></div>
            <div className="form-group"><label>Priority</label><select value={f.priority} onChange={e => set("priority", e.target.value)}>{["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}</select></div>
            <div className="form-group"><label>Type</label><select value={f.type} onChange={e => set("type", e.target.value)}>{["Filing", "Research", "Investigation", "Document", "Billing", "Review", "Hearing", "Other"].map(t => <option key={t}>{t}</option>)}</select></div>
          </div>
          <div className="flex gap8" style={{ justifyContent: "flex-end" }}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-gold" onClick={submit}>Add Task</button></div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
function StatCard({ icon, color, label, val, sub }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="s-label">{label}</div>
      <div className="s-val">{val}</div>
      {sub && <div className="s-sub">{sub}</div>}
      <div className="s-icon">{icon}</div>
    </div>
  );
}
function SBadge({ s }) {
  const m = { Active: "b-green", Pending: "b-amber", Closed: "b-gray", Overdue: "b-red" };
  return <span className={`badge ${m[s] || "b-gray"}`}>{s}</span>;
}
function PBadge({ p }) {
  const m = { High: "b-red", Medium: "b-amber", Low: "b-green" };
  return <span className={`badge ${m[p] || "b-gray"}`}>{p}</span>;
}
function InvBadge({ s }) {
  const m = { Paid: "b-green", Pending: "b-amber", Overdue: "b-red" };
  return <span className={`badge ${m[s] || "b-gray"}`}>{s}</span>;
}
