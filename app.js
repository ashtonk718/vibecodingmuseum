
// Active nav
const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('header nav a').forEach(a=>{
  const href = a.getAttribute('href');
  if(href && href.toLowerCase() === path){ a.classList.add('active'); }
});

// History page: funding table sort/filter
(function(){
  const table = document.querySelector('#fundingTable');
  if(!table) return;

  const rows = [
    { date:"2025-07-30", company:"Replit", amount:250_000_000, valuation:"$3B", notes:"Round reported; momentum in agentic coding", url:"https://www.forbes.com/sites/iainmartin/2025/07/30/vibe-coding-tool-replit-doubles-in-valuation-to-3-billion/" },
    { date:"2025-09-10", company:"Replit (update)", amount:250_000_000, valuation:"$3B", notes:"Company press & Reuters confirm details", url:"https://replit.com/news/funding-announcement" },
    { date:"2025-05-05", company:"Anysphere (Cursor)", amount:900_000_000, valuation:"$9B", notes:"Reported in FT; surge in ARR", url:"https://www.ft.com/content/a7b34d53-a844-4e69-a55c-b9dee9a97dd2" },
    { date:"2025-06-20", company:"Lovable", amount:15_000_000, valuation:"$1.5B (reported)", notes:"Accel-led round reported by BI", url:"https://www.businessinsider.com/accel-to-lead-funding-round-for-lovable-2025-6" },
    { date:"2025-08-18", company:"Vibecode (iOS)", amount:9_400_000, valuation:"—", notes:"Seed led by Seven Seven Six (BI)", url:"https://www.businessinsider.com/vibe-coding-startup-vibecode-helps-build-apps-on-iphone-fundraise-2025-8" },
    { date:"2025-09-12", company:"CodeRabbit (QA)", amount:60_000_000, valuation:"—", notes:"Coverage of QA/code review demand", url:"https://venturebeat.com/ai/with-vibe-coding-ai-tools-generating-more-code-than-ever-before-enterprises" }
  ];
  const tbody = table.querySelector('tbody');
  function fmtAmount(n){
    if(!n) return '—';
    const B = 1_000_000_000, M = 1_000_000;
    if(n >= B) return `$${(n/B).toFixed(1)}B`;
    return `$${(n/M).toFixed(1)}M`;
  }
  function render(list){
    tbody.innerHTML = list.map(r => `
      <tr>
        <td>${new Date(r.date).toLocaleDateString(undefined,{year:'numeric', month:'short', day:'2-digit'})}</td>
        <td>${r.company}</td>
        <td>${fmtAmount(r.amount)}</td>
        <td>${r.valuation || '—'}</td>
        <td>${r.notes}</td>
        <td><a href="${r.url}" target="_blank" rel="noopener">Source ↗</a></td>
      </tr>`).join('');
  }
  render(rows);

  const filter = document.querySelector('#filter');
  let sortKey = 'date', asc = false;
  function sortBy(key){
    if(sortKey === key){ asc = !asc } else { sortKey = key; asc = key !== 'date' };
    const sorted = [...rows].sort((a,b)=>{
      if(key === 'amount') return asc ? (a.amount||0) - (b.amount||0) : (b.amount||0) - (a.amount||0);
      if(key === 'date') return asc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      return asc ? String(a[key]).localeCompare(String(b[key])) : String(b[key]).localeCompare(String(a[key]));
    });
    render(applyFilter(sorted));
  }
  function applyFilter(list){
    const q = (filter?.value || '').trim().toLowerCase();
    if(!q) return list;
    return list.filter(r => `${r.company} ${r.notes}`.toLowerCase().includes(q));
  }
  document.querySelectorAll('th.sortable').forEach(th => th.addEventListener('click', ()=>sortBy(th.dataset.key)));
  filter?.addEventListener('input', ()=> render(applyFilter([...rows].sort((a,b)=> new Date(b.date)-new Date(a.date)))));
})();
