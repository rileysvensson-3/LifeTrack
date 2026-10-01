/* LifeTrack: "Try it for yourself", right below Your Library.
   The card is the editor: tap the title to pick a song, tap the photo for the camera roll,
   tap any other part to fill it in. Then pick a color and save it as an image.
   Load it with a script tag pointing at create_lifetrack.js, right before the closing body tag. */
(() => {
  const lib = document.getElementById('library');
  const hero = document.querySelector('#card .card');
  if (!lib || !hero || document.getElementById('create')) return;

  const COLORS = ['#0097B2','#B95375','#B2AC88','#D89071','#F1C833','#419D6E','#FC6C85','#805D86','#536F94'];
  const QUICK = [['Riptide','Vance Joy'],['Dirt Road Anthem','Jason Aldean'],['Down by the River','Milky Chance'],['Passion Fruit','Drake'],
    ['Strawberry Skies','Kid Travis'],['Hard Times','Paramore'],['ten','Fred again..'],['Crazy Train','Ozzy Osbourne']];

  /* ---------- styles ---------- */
  const css = document.createElement('style');
  css.textContent = `
#create{padding:clamp(100px,14vh,160px) 6vw clamp(90px,12vh,140px);display:flex;flex-direction:column;align-items:center;text-align:center}
#create h2{font-family:var(--stella);font-weight:400;font-size:clamp(48px,7vw,88px);line-height:1}
#create .mk-sub{max-width:34ch;margin:16px auto 0}
.mk-stage{--card-w:min(350px,80vw);margin-top:clamp(28px,5vh,52px);display:flex;flex-direction:column;align-items:center;gap:26px;width:100%}
.mk-shot{position:relative;padding:4px 16px 18px 4px}
.mk-hint{font-family:var(--guer);color:var(--yellow);font-size:clamp(15px,1.1vw,22px);min-height:1.2em;margin-bottom:-14px}
/* live card */
.mk-card{text-align:left}
.mk-card .val{clip-path:none;transition:none;overflow-wrap:anywhere}
.mk-card .val:empty::before{content:attr(data-ph);opacity:.5}
.mk-card .t-song{opacity:1;transform:none}
.mk-card .t-song.empty{opacity:.4}
.mk-card .photo .plus{opacity:1}.mk-card.has-photo .photo .plus{opacity:0}
.mk-card .photo-p .edit{opacity:0}.mk-card.has-photo .photo-p .edit{opacity:1}
.mk-card .desc .plus{opacity:1}.mk-card.has-desc .desc .plus{opacity:0}
.mk-card .desc .edit{opacity:0}.mk-card.has-desc .desc .edit{opacity:1}
.mk-card .desc p{overflow-wrap:anywhere}
.mk-card .card{transition:background .4s}
.mk-hit{cursor:pointer;outline:2px dashed transparent;outline-offset:1px;transition:outline-color .2s}
@media (hover:hover){.mk-hit:hover{outline-color:var(--yellow)}}
.mk-hit.active,.mk-hit:focus-visible{outline:2px dashed var(--yellow)}
.mk-hit.nudge{animation:mkNudge 1.6s ease-in-out 3}
@keyframes mkNudge{50%{outline-color:var(--yellow)}}
.mk-photo-in{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
/* under the card */
.mk-sw{display:flex;gap:9px;flex-wrap:wrap;justify-content:center}
.mk-sw button{width:30px;height:30px;padding:0;border:3px solid var(--black);border-radius:0;transition:transform .2s}
.mk-sw button[aria-pressed=true]{transform:translateY(-5px);box-shadow:0 4px 0 var(--white)}
.mk-acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
#create .mk-acts button[hidden]{display:none}
.mk-join{width:100%;max-width:560px;margin-top:14px;padding-top:30px;border-top:3px solid var(--black);display:none}
.mk-join.on{display:block;animation:mkIn .6s cubic-bezier(.2,.9,.3,1)}
@keyframes mkIn{from{opacity:0;transform:translateY(14px)}}
.mk-join h3{font-family:var(--stella);font-weight:400;font-size:clamp(34px,4vw,64px);line-height:1}
.mk-down{display:inline-block;margin-top:14px;width:clamp(44px,3.6vw,64px);height:clamp(44px,3.6vw,64px);border-radius:50%}
.mk-down svg{width:100%;height:100%;fill:none;stroke:var(--yellow);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;animation:bob 1.2s ease-in-out infinite}
.mk-down:hover svg{stroke:var(--white)}
/* editor sheet */
.mk-sheet{position:fixed;left:50%;bottom:0;z-index:40;width:min(560px,100%);transform:translate(-50%,105%);transition:transform .35s cubic-bezier(.2,.9,.3,1);
  background:var(--black);border-top:5px solid var(--tan);padding:18px 20px calc(18px + env(safe-area-inset-bottom,0px));text-align:left;color:var(--white)}
.mk-sheet.on{transform:translate(-50%,0)}
.mk-sheet label{display:block;font-family:var(--guer);font-size:18px;margin-bottom:10px}
.mk-sheet .mk-line{display:flex;gap:10px;align-items:flex-start}
.mk-sheet input,.mk-sheet textarea{flex:1;min-width:0;font:inherit;font-size:16px;padding:11px 14px;border:2px solid #333;border-radius:10px;background:#111;color:var(--white);width:100%}
.mk-sheet textarea{resize:none;height:96px;line-height:1.4}
.mk-sheet input:focus,.mk-sheet textarea:focus{outline:none;border-color:var(--yellow)}
#create .mk-sheet .mk-done{font-size:17px;padding:11px 18px;background:var(--white);color:var(--black)}
.mk-sheet .mk-meta{font-size:14px;color:rgba(255,255,255,.6);margin-top:8px;min-height:1.2em}
.mk-res{list-style:none;margin-top:10px;max-height:min(40vh,300px);overflow:auto}
.mk-res button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:8px 6px;border-radius:8px;background:transparent;font-family:var(--sugar);font-size:16px;color:var(--white)}
.mk-res button:hover,.mk-res button:focus-visible{background:#1d1d1d}
.mk-res img,.mk-res i{width:40px;height:40px;flex:none;border-radius:4px;background:#222;object-fit:cover}
.mk-res span{display:grid;min-width:0;line-height:1.2}
.mk-res b{font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mk-res small{color:var(--yellow);font-size:14px}
@media (min-width:821px){
  .mk-stage{--card-w:clamp(340px,min(28vw,calc((100vh - 320px) * .72)),600px)}
  #create h2{font-size:clamp(56px,6vw,150px)}
  #create .mk-sub{font-size:clamp(19px,1.5vw,32px)}
  .mk-sw button{width:clamp(30px,2vw,44px);height:clamp(30px,2vw,44px)}
}
@media (prefers-reduced-motion:reduce){.mk-hit.nudge{animation:none}.mk-sheet{transition:none}}
`;
  document.head.appendChild(css);

  /* ---------- markup ---------- */
  const sec = document.createElement('section');
  sec.id = 'create';
  sec.setAttribute('aria-label', 'Try it for yourself');
  sec.innerHTML = `
  <h2>Try it for yourself</h2>
  <p class="mk-sub">Tap any part of the card to fill it in.</p>
  <div class="mk-stage">
    <div class="mk-hint" id="mkHint" aria-hidden="true">Start with the song</div>
    <div class="mk-shot" id="mkShot"></div>
    <div class="mk-sw" id="mkSw" role="group" aria-label="Card color"></div>
    <div class="mk-acts">
      <button type="button" id="mkPlay" hidden>Play song</button>
    </div>
    <div class="mk-join" id="mkJoin">
      <h3>Want to keep it?</h3>
      <a class="mk-down" href="#join" aria-label="Join the waitlist"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg></a>
    </div>
    <input class="mk-photo-in" id="mkPhoto" type="file" accept="image/*" tabindex="-1" aria-hidden="true">
  </div>
  <div class="mk-sheet" id="mkSheet" role="dialog" aria-modal="false" aria-labelledby="mkSheetLbl">
    <label id="mkSheetLbl" for="mkIn"></label>
    <div class="mk-line" id="mkLine"></div>
    <div class="mk-meta" id="mkMeta" role="status" aria-live="polite"></div>
    <ul class="mk-res" id="mkRes"></ul>
  </div>`;
  lib.after(sec);
  const $ = id => document.getElementById(id);

  const nav = document.querySelector('.nav'), join = nav && nav.querySelector('a[href="#join"]');
  if (join){
    const a = document.createElement('a'); a.href = '#create'; a.textContent = 'Try it';
    nav.insertBefore(a, join);
    a.addEventListener('click', e => {
      e.preventDefault(); const bar = document.querySelector('.bar');
      scrollTo({top: sec.getBoundingClientRect().top + scrollY - (bar ? bar.offsetHeight : 0), behavior: 'smooth'});
    });
  }

  /* ---------- the card, cloned from the hero ---------- */
  const wrap = document.createElement('div');
  wrap.className = 'mk-card s1 s2 s3 s4 s5';
  const card = hero.cloneNode(true);
  card.setAttribute('aria-label', 'Your card');
  card.querySelectorAll('.t-empty, .photo .scene, .photo .roof, .photo img, .badge img').forEach(n => n.remove());
  card.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  wrap.appendChild(card);
  $('mkShot').insertBefore(wrap, $('mkShot').firstChild);

  const q = s => card.querySelector(s);
  const el = { title: q('.t-song'), song: q('.v-song'), artist: q('.v-artist'), date: q('.v-date'), people: q('.v-people'),
    loc: q('.v-loc'), desc: q('.desc p'), photo: q('.photo') };
  const PH = {song:'Tap to pick', artist:'', date:'Tap to add', people:'Tap to add', loc:'Tap to add'};
  Object.keys(PH).forEach(k => { el[k].textContent = ''; el[k].dataset.ph = PH[k]; });
  el.desc.textContent = ''; el.title.textContent = 'Song Name'; el.title.classList.add('empty');

  const state = {song:null, date:'', people:'', desc:'', loc:''};

  // tap targets on the card
  const fieldBlocks = [...q('.fields').children];
  const targets = {
    song: [q('.c-title'), fieldBlocks[0], fieldBlocks[1]],
    date: [fieldBlocks[2]], people: [fieldBlocks[3]],
    photo: [q('.photo-p')], desc: [q('.desc')], loc: [q('.loc-mid')]
  };
  const LABELS = {song:'Pick the song', date:'Edit memory date', people:'Edit who was there', photo:'Choose a photo', desc:'Edit the description', loc:'Edit the location'};
  Object.entries(targets).forEach(([k, nodes]) => nodes.forEach(n => {
    n.classList.add('mk-hit'); n.tabIndex = 0; n.setAttribute('role', 'button'); n.setAttribute('aria-label', LABELS[k]);
    n.dataset.f = k;
    n.addEventListener('click', e => { e.stopPropagation(); open(k); });
    n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(k); } });
  }));
  targets.song.forEach(n => n.classList.add('nudge'));

  /* ---------- editor sheet ---------- */
  const sheet = $('mkSheet'), line = $('mkLine'), res = $('mkRes'), meta = $('mkMeta');
  let current = null;
  const CFG = {
    song:   {label:'Search for the song', ph:'Song or artist', max:60},
    date:   {label:'When was it?', ph:'Jan 2022', max:16},
    people: {label:'Who was there?', ph:'Names', max:40},
    desc:   {label:'What it meant', ph:'A few lines so you can feel it again', max:180, area:true},
    loc:    {label:'Where was it?', ph:'City, State', max:34}
  };
  function setActive(k){
    card.querySelectorAll('.mk-hit').forEach(n => n.classList.toggle('active', n.dataset.f === k));
  }
  function open(k){
    card.querySelectorAll('.nudge').forEach(n => n.classList.remove('nudge'));
    if (k === 'photo'){ close(); $('mkPhoto').click(); return; }
    current = k; const c = CFG[k];
    $('mkSheetLbl').textContent = c.label;
    line.innerHTML = '';
    const inp = document.createElement(c.area ? 'textarea' : 'input');
    inp.id = 'mkIn'; inp.maxLength = c.max; inp.placeholder = c.ph; inp.autocomplete = 'off';
    if (!c.area){ inp.type = k === 'song' ? 'search' : 'text'; inp.enterKeyHint = k === 'song' ? 'search' : 'done'; }
    inp.value = k === 'song' ? '' : state[k];
    const done = document.createElement('button'); done.type = 'button'; done.className = 'mk-done'; done.textContent = 'Done';
    done.addEventListener('click', close);
    line.append(inp, done);
    res.innerHTML = ''; meta.textContent = '';
    if (k === 'song') showQuick(); else if (c.area) meta.textContent = (c.max - inp.value.length) + ' characters left';
    inp.addEventListener('input', () => onType(k, inp));
    inp.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && !c.area){ e.preventDefault(); if (k === 'song'){ clearTimeout(timer); runSearch(inp.value.trim()); } else close(); }
    });
    setActive(k); sheet.classList.add('on');
    setTimeout(() => inp.focus({preventScroll: true}), 60);
    // keep the card in view above the sheet
    const r = card.getBoundingClientRect();
    const barH = (document.querySelector('.bar') || {offsetHeight: 60}).offsetHeight, want = barH + 56;
    if (Math.abs(r.top - want) > 40) scrollTo({top: scrollY + r.top - want, behavior: 'smooth'});
  }
  function close(){ if (current && card.contains(document.activeElement)) document.activeElement.blur(); if (sheet.contains(document.activeElement)) document.activeElement.blur(); sheet.classList.remove('on'); current = null; setActive(null); seq++; }
  document.addEventListener('click', e => { if (current && !sheet.contains(e.target)) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && current) close(); });

  function onType(k, inp){
    const v = inp.value;
    if (k === 'song'){ clearTimeout(timer); const t = v.trim(); if (t.length < 2){ seq++; showQuick(); return; } timer = setTimeout(() => runSearch(t), 350); return; }
    state[k] = v;
    if (k === 'desc'){ el.desc.textContent = v; wrap.classList.toggle('has-desc', !!v.trim()); meta.textContent = (CFG.desc.max - v.length) + ' characters left'; }
    else el[k].textContent = v.trim();
    hint();
  }

  /* ---------- songs: iTunes search, with a few quick picks as a fallback ---------- */
  let seq = 0, timer;
  function list(items, note){
    res.innerHTML = ''; meta.textContent = note || '';
    items.forEach(r => {
      const li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = (r.artworkUrl60 ? '<img alt="">' : '<i></i>') + '<span><b></b><small></small></span>';
      if (r.artworkUrl60) b.querySelector('img').src = r.artworkUrl60;
      b.querySelector('b').textContent = r.trackName;
      b.querySelector('small').textContent = r.artistName + (r.releaseDate ? ' - ' + r.releaseDate.slice(0, 4) : '');
      b.addEventListener('click', e => { e.stopPropagation(); pick(r); });
      li.appendChild(b); res.appendChild(li);
    });
  }
  const quick = () => QUICK.map(([trackName, artistName]) => ({trackName, artistName}));
  function showQuick(){ list(quick(), 'Or pick one of these'); }
  function runSearch(t){
    const id = ++seq, cb = '__ltMk' + id, s = document.createElement('script');
    meta.textContent = 'Searching...';
    const fallback = () => {
      if (id !== seq) return;
      const hits = quick().filter(r => (r.trackName + ' ' + r.artistName).toLowerCase().includes(t.toLowerCase()));
      list(hits.length ? hits : quick(), "Search isn't available right now. Pick one of these.");
    };
    const to = setTimeout(fallback, 6000);
    window[cb] = data => {
      clearTimeout(to); delete window[cb]; s.remove(); if (id !== seq) return;
      const items = (data.results || []).filter(r => r.trackName && r.artistName).slice(0, 6);
      items.length ? list(items) : list([], 'No songs found. Try adding the artist name.');
    };
    s.onerror = () => { clearTimeout(to); fallback(); };
    s.src = 'https://itunes.apple.com/search?entity=song&limit=8&term=' + encodeURIComponent(t) + '&callback=' + cb;
    document.head.appendChild(s);
  }
  const audio = new Audio(); audio.preload = 'none'; audio.volume = .7;
  function pick(r){
    state.song = r;
    const year = r.releaseDate ? r.releaseDate.slice(0, 4) : '';
    el.title.textContent = r.trackName; el.title.classList.remove('empty');
    el.song.textContent = r.trackName;
    el.artist.textContent = r.artistName + (year ? ' - ' + year : '');
    stopSong(); audio.src = r.previewUrl || ''; $('mkPlay').hidden = !r.previewUrl;
    close(); if (r.previewUrl) playSong();
    hint(); revealJoin();
  }
  function stopSong(){ audio.pause(); $('mkPlay').textContent = 'Play song'; }
  function playSong(){
    if (document.body.classList.contains('playing')){ const pp = document.querySelector('.pp'); if (pp) pp.click(); }
    audio.play().then(() => $('mkPlay').textContent = 'Pause song').catch(() => {});
  }
  $('mkPlay').addEventListener('click', () => audio.paused ? playSong() : stopSong());
  audio.addEventListener('ended', stopSong);
  document.addEventListener('click', e => { if (e.target.closest('.pp, .lpp')) stopSong(); }, true);

  /* ---------- photo: stays on the device ---------- */
  $('mkPhoto').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f), img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      let pic = el.photo.querySelector('img'); if (!pic){ pic = document.createElement('img'); pic.alt = ''; el.photo.appendChild(pic); }
      pic.src = c.toDataURL('image/jpeg', .88); wrap.classList.add('has-photo'); hint();
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url; e.target.value = '';
  });

  /* ---------- color ---------- */
  COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.style.background = c; b.setAttribute('aria-label', 'Card color ' + (i + 1)); b.setAttribute('aria-pressed', i === 0);
    b.addEventListener('click', () => { card.style.setProperty('--cc', c); [...$('mkSw').children].forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('mkSw').appendChild(b);
  });
  card.style.setProperty('--cc', COLORS[0]);

  // the line above the card points at whatever's still missing
  function hint(){
    const h = $('mkHint');
    h.textContent = !state.song ? 'Start with the song' : !wrap.classList.contains('has-photo') ? 'Now tap the photo'
      : !state.date && !state.people ? 'Add when and who' : !state.desc.trim() ? 'Add what it meant' : !state.loc ? 'And where it was' : 'Now pick a color';
  }


  /* ---------- waitlist: the arrow sends them to the one signup form at the bottom ---------- */
  const mainForm = document.getElementById('waitlist');
  function hidden(name){
    let f = mainForm && mainForm.querySelector('input[name="' + name + '"]');
    if (mainForm && !f){ f = document.createElement('input'); f.type = 'hidden'; f.name = name; mainForm.appendChild(f); }
    return f;
  }
  function revealJoin(){
    // signups that come from the card carry the song they picked
    const song = hidden('song'), src = hidden('source');
    if (song) song.value = state.song ? state.song.trackName + ' - ' + state.song.artistName : '';
    if (src) src.value = 'try-it-card';
    $('mkJoin').classList.add('on');
  }
  sec.querySelector('.mk-down').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const join = document.getElementById('join'), email = document.getElementById('email');
    if (!join) return;
    join.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
    if (email) setTimeout(() => email.focus({preventScroll: true}), 700);
  });
})();
