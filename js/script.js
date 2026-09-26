const ICONS = { clock:"assets/icon-clock.svg", bell:"assets/bell.webp", broom:"assets/icon-pix.svg", envelope:"assets/icon-card.svg", doll:"assets/doll.webp" };
const PHOTOS = { doce:"assets/pizza-chocolate-morango-clean.png", pepperoni:"assets/pizza-pepperoni.jpg", cheese:"assets/pizza-cheese.jpg", portuguesa:"assets/pizza-portuguesa.png", vegana:"assets/pizza-vegetariana.png" };
const DRINK_PHOTOS = {
  soda:"assets/drink-soda.jpg", coco:"assets/drink-coco.jpg",
  water:"assets/drink-water-clean.png", juice:"assets/drink-juice-orange.png",
  tea:"assets/drink-iced-tea.png", lemonade:"assets/drink-lemonade.png",
  energy:"assets/drink-energy-monster.png", coke2l:"assets/drink-coca-cola-2l-clean.png",
  sodaLemon:"assets/drink-soda-limonada-15l.png", fanta2l:"assets/drink-fanta-2l.png",
  guarana2l:"assets/drink-guarana-2l-new.png", pepsi2l:"assets/drink-pepsi-2l-clean.png",
  grape:"assets/drink-grape-juice.png"
};
const CASH_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="12" width="40" height="24" rx="3" stroke="#241419" stroke-width="2.5" fill="#c9a15e" fill-opacity=".25"/><circle cx="24" cy="24" r="7" stroke="#241419" stroke-width="2.2"/><circle cx="10" cy="18" r="1.6" fill="#241419"/><circle cx="38" cy="30" r="1.6" fill="#241419"/></svg>`;

const EXTRA_PRICE = 3.00;
const EXTRAS = ["Cebola","Azeitona","Tomate","Pimentão","Catupiry","Champignon","Rúcula","Milho","Palmito","Tomate seco","Cebola caramelizada","Mussarela vegana"];

const PIZZAS = [
  {id:1,name:"Quatro Queijos",desc:"Mussarela, provolone, gorgonzola e parmesão sob molho branco de ervas.",price:54.90,prep:"25–35 min",photo:"cheese"},
  {id:2,name:"Margherita",desc:"Molho de tomate rústico, mussarela de búfala e manjericão fresco.",price:42.90,prep:"20–30 min",photo:"cheese"},
  {id:3,name:"Pepperoni",desc:"Generosas fatias de pepperoni picante sobre mussarela derretida.",price:49.90,prep:"22–30 min",photo:"pepperoni"},
  {id:4,name:"Calabresa",desc:"Calabresa fatiada, cebola roxa e azeitonas pretas.",price:46.90,prep:"22–32 min",photo:"pepperoni"},
  {id:5,name:"Portuguesa",desc:"Presunto, ovos, cebola, azeitona e ervilha, ao molho de tomate.",price:52.90,prep:"25–35 min",photo:"portuguesa"},
  {id:6,name:"Vegana",desc:"Rúcula, tomate seco, champignon e mussarela vegetal.",price:58.90,prep:"25–35 min",photo:"vegana"},
  {id:7,name:"Frango com Catupiry",desc:"Frango desfiado, catupiry cremoso e milho.",price:55.90,prep:"25–33 min",photo:"cheese"},
  {id:8,name:"Chocolate com Morango",desc:"Chocolate meio amargo, morangos frescos e granulado.",price:47.90,prep:"18–25 min",photo:"doce"},
  {id:9,name:"Meio a Meio",desc:"Metade salgada (pepperoni e queijos), metade doce (chocolate e morango) — o melhor dos dois mundos.",price:57.90,prep:"25–35 min",split:["pepperoni","doce"],badge:"Doce & salgada"},
];

const DRINKS = [
  {id:"d1",name:"Refrigerante Lata 350ml",photo:"soda",price:6.00,flavors:["Coca-Cola","Coca-Cola Zero Açúcar","Fanta Laranja","Fanta Uva","Guaraná"]},
  {id:"d3",name:"Água Mineral 500ml",photo:"water",price:4.00,flavors:["Sem gás","Com gás"]},
  {id:"d8",name:"Refrigerante 2L",photo:"coke2l",price:13.00,flavors:["Coca-Cola","Coca-Cola Zero Açúcar","Fanta Laranja","Guaraná","Pepsi","Soda Limonada"],imageByFlavor:{"Coca-Cola":"coke2l","Coca-Cola Zero Açúcar":"coke2l","Fanta Laranja":"fanta2l","Guaraná":"guarana2l","Pepsi":"pepsi2l","Soda Limonada":"sodaLemon"}},
];

let cart = [];
try{ cart = JSON.parse(localStorage.getItem('dl_cart')||'[]'); }catch(e){ cart=[]; }

function money(v){ return "R$ " + v.toFixed(2).replace('.',','); }
function saveCart(){ try{ localStorage.setItem('dl_cart', JSON.stringify(cart)); }catch(e){} updateBadge(); }
function updateBadge(){
  const n = cart.reduce((a,c)=>a+c.qty,0);
  const b = document.getElementById('cartBadge');
  if(n>0){ b.style.display='flex'; b.textContent=n; } else { b.style.display='none'; }
}
function discHTML(p, size){
  if(p.split){ return `<div class="disc split" style="width:${size}px;height:${size}px"><img src="${PHOTOS[p.split[0]]}"><img src="${PHOTOS[p.split[1]]}"></div>`; }
  return `<div class="disc" style="width:${size}px;height:${size}px"><img src="${PHOTOS[p.photo]}"></div>`;
}

// ---------- render menu ----------
const grid = document.getElementById('menuGrid');
PIZZAS.forEach(p=>{
  const card = document.createElement('div');
  card.className='pcard';
  card.innerHTML = `
    <div class="art">${p.badge?`<span class="badge-flavor">${p.badge}</span>`:''}${discHTML(p,130)}</div>
    <div class="body">
      <h3>${p.name}</h3>
      <div class="desc">${p.desc}</div>
      <div class="meta"><img src="${ICONS.clock}" alt="">Preparo: ${p.prep}</div>
      <div class="foot"><span class="price">${money(p.price)}</span><button class="btn">Ver detalhes</button></div>
    </div>`;
  card.addEventListener('click', ()=>openProduct(p.id));
  grid.appendChild(card);
});

// ---------- product modal ----------
function openProduct(id){
  const p = PIZZAS.find(x=>x.id===id);
  const overlay = document.getElementById('prodOverlay');
  const modal = document.getElementById('prodModal');
  modal.innerHTML = `
    <button class="close" data-close>✕</button>
    <div style="display:flex;justify-content:center;margin-bottom:10px">${discHTML(p,160)}</div>
    <h3>${p.name}</h3>
    <div class="desc">${p.desc}</div>
    <div class="meta" style="margin-top:6px"><img src="${ICONS.clock}" style="width:16px;height:16px;vertical-align:-3px"> Tempo de preparo: ${p.prep}</div>
    <div class="opt-group"><div class="label">Fatias</div>
      <div class="pills" id="sliceGroup">${[4,6,8,10].map((s,i)=>`<div class="pill ${i===1?'active':''}" data-slice="${s}">${s} fatias</div>`).join('')}</div>
    </div>
    <div class="opt-group"><div class="label">Adicionais (+${money(EXTRA_PRICE)} cada)</div>
      <div class="extras-grid" id="extrasGroup">${EXTRAS.map(e=>`<label class="chk"><input type="checkbox" data-extra="${e}"> ${e}</label>`).join('')}</div>
    </div>
    <div class="qty-row"><button data-qty="-1">−</button><span id="qtyVal">1</span><button data-qty="1">+</button><span style="margin-left:auto" class="small-note">Quantidade</span></div>
    <div class="modal-total"><span>Total</span><span id="prodTotal">${money(p.price)}</span></div>
    <button class="btn gold" style="width:100%;margin-top:14px;padding:12px" id="addToCartBtn">Adicionar ao carrinho</button>`;

  let qty=1, slice=6;
  const recalc = ()=>{
    const n = modal.querySelectorAll('[data-extra]:checked').length;
    const total = (p.price + n*EXTRA_PRICE) * qty;
    modal.querySelector('#prodTotal').textContent = money(total);
  };
  modal.querySelector('#sliceGroup').addEventListener('click', e=>{
    const pill = e.target.closest('[data-slice]'); if(!pill) return;
    modal.querySelectorAll('#sliceGroup .pill').forEach(x=>x.classList.remove('active'));
    pill.classList.add('active'); slice = parseInt(pill.dataset.slice);
  });
  modal.querySelector('#extrasGroup').addEventListener('change', recalc);
  modal.querySelectorAll('[data-qty]').forEach(btn=>btn.addEventListener('click', ()=>{
    qty = Math.max(1, qty + parseInt(btn.dataset.qty));
    modal.querySelector('#qtyVal').textContent = qty; recalc();
  }));
  modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', closeProduct));
  modal.querySelector('#addToCartBtn').addEventListener('click', ()=>{
    const extras = Array.from(modal.querySelectorAll('[data-extra]:checked')).map(el=>el.dataset.extra);
    const unit = p.price + extras.length*EXTRA_PRICE;
    cart.push({key:Date.now()+Math.random(), kind:'pizza', name:p.name, photo:p.photo, split:p.split||null, slice, extras, qty, unit, total:unit*qty});
    saveCart(); closeProduct(); showToast(`${p.name} adicionada ao carrinho!`);
  });
  overlay.classList.add('open');
}
function closeProduct(){ document.getElementById('prodOverlay').classList.remove('open'); }
document.getElementById('prodOverlay').addEventListener('click', e=>{ if(e.target.id==='prodOverlay') closeProduct(); });

// ---------- drinks ----------
const dgrid = document.getElementById('drinkGrid');
DRINKS.forEach(d=>{
  const card = document.createElement('div');
  card.className='dcard';
  card.innerHTML = `
    <div class="dart"><img src="${DRINK_PHOTOS[d.photo]}" alt="${d.name}" data-drink-image="${d.id}"></div>
    <h3 style="margin:2px 0;font-size:1.1rem;font-family:'Cormorant Garamond',serif">${d.name}</h3>
    ${d.flavors? `<select id="fl-${d.id}">${d.flavors.map(f=>`<option>${f}</option>`).join('')}</select>` : ''}
    <div class="dfoot"><span class="price">${money(d.price)}</span><button class="btn" data-add="${d.id}">Adicionar</button></div>`;
  dgrid.appendChild(card);
});
dgrid.addEventListener('change', e=>{
  const select = e.target.closest('select[id^="fl-"]'); if(!select) return;
  const d = DRINKS.find(x=>x.id===select.id.slice(3));
  const photo = d?.imageByFlavor?.[select.value];
  if(photo){
    const img = dgrid.querySelector(`[data-drink-image="${d.id}"]`);
    img.src = DRINK_PHOTOS[photo];
    img.alt = `${d.name} — ${select.value}`;
  }
});
dgrid.addEventListener('click', e=>{
  const btn = e.target.closest('[data-add]'); if(!btn) return;
  const d = DRINKS.find(x=>x.id===btn.dataset.add);
  const flavorSel = document.getElementById(`fl-${d.id}`);
  const flavor = flavorSel ? flavorSel.value : null;
  const photo = d.imageByFlavor?.[flavor] || d.photo;
  cart.push({key:Date.now()+Math.random(), kind:'drink', name:d.name + (flavor?` (${flavor})`:''), photo, qty:1, unit:d.price, total:d.price});
  saveCart(); showToast(`${d.name} adicionada ao carrinho!`);
});

// ---------- toast ----------
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 3200);
}

// ---------- cart drawer ----------
const cartDrawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
function openDrawer(){ renderDrawer(); cartDrawer.classList.add('open'); drawerOverlay.style.display='block'; }
function closeDrawerFn(){ cartDrawer.classList.remove('open'); drawerOverlay.style.display='none'; }
document.getElementById('cartBtn').addEventListener('click', openDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawerFn);
drawerOverlay.addEventListener('click', closeDrawerFn);
function cartSubtotal(){ return cart.reduce((a,c)=>a+c.total,0); }
function ciDiscHTML(c){
  if(c.kind==='drink'){ return `<div class="ci-disc"><img src="${DRINK_PHOTOS[c.photo]}"></div>`; }
  if(c.split){ return `<div class="ci-disc split"><img src="${PHOTOS[c.split[0]]}"><img src="${PHOTOS[c.split[1]]}"></div>`; }
  return `<div class="ci-disc"><img src="${PHOTOS[c.photo]}"></div>`;
}
function renderDrawer(){
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if(cart.length===0){ body.innerHTML = `<div class="empty-cart">Seu carrinho está vazio.<br>Escolha uma pizza ou bebida.</div>`; foot.innerHTML=''; return; }
  body.innerHTML = cart.map(c=>`
    <div class="cart-item">
      ${ciDiscHTML(c)}
      <div class="ci-info">
        <div><strong>${c.name}</strong></div>
        <small>${c.kind==='pizza'? (c.slice+' fatias'+(c.extras.length? ' · '+c.extras.join(', ') : '')) : 'Bebida'}</small><br>
        <small>Qtd: ${c.qty} · ${money(c.total)}</small><br>
        <button class="ci-rm" data-key="${c.key}">remover</button>
      </div>
    </div>`).join('');
  body.querySelectorAll('.ci-rm').forEach(b=> b.addEventListener('click', ()=>{
    cart = cart.filter(c=> String(c.key) !== b.dataset.key); saveCart(); renderDrawer();
  }));
  const sub = cartSubtotal();
  foot.innerHTML = `
    <div class="row-between"><span>Subtotal</span><strong>${money(sub)}</strong></div>
    ${sub>70? `<div class="small-note">Parcelamento em até 2x sem juros no cartão.</div>`:''}
    <button class="btn gold" style="width:100%;padding:12px;margin-top:12px" id="goCheckout">Fechar pedido</button>`;
  document.getElementById('goCheckout').addEventListener('click', ()=>{ closeDrawerFn(); openCheckout(); });
}

// ---------- checkout ----------
const checkoutOverlay = document.getElementById('checkoutOverlay');
function openCheckout(){
  if(cart.length===0){ showToast('Seu carrinho está vazio.'); return; }
  const modal = document.getElementById('checkoutModal');
  const sub = cartSubtotal();
  const canInstall = sub > 70;
  modal.innerHTML = `
    <button class="close" data-close>✕</button>
    <h3>Fechar Pedido</h3>
    <div class="row-between"><span>Itens (${cart.reduce((a,c)=>a+c.qty,0)})</span><strong>${money(sub)}</strong></div>
    <div class="opt-group"><div class="label">Forma de pagamento</div>
      <div class="pay-methods">
        <div class="pay-opt active" data-pay="pix"><img src="${ICONS.broom}"><span>Pix</span></div>
        <div class="pay-opt" data-pay="card"><img src="${ICONS.envelope}"><span>Cartão</span></div>
        <div class="pay-opt" data-pay="cash">${CASH_SVG}<span>Dinheiro</span></div>
      </div>
    </div>
    <div id="payPanel"></div>
    <button class="btn gold" style="width:100%;margin-top:16px;padding:12px" id="confirmOrder">Confirmar pedido — ${money(sub)}</button>`;
  let method = 'pix';
  const renderPanel = ()=>{
    const panel = document.getElementById('payPanel');
    if(method==='pix'){
      panel.innerHTML = `
        <div class="pay-panel">
          <div id="qrHolder" style="display:flex;justify-content:center;margin-bottom:10px"></div>
          <label>Pix copia e cola</label>
          <div class="pixcode" id="pixCode"></div>
          <button class="btn ghost" style="margin-top:8px;width:100%" id="copyPix">Copiar código</button>
          <div class="small-note">Escaneie o QR Code no app do seu banco ou copie o código acima.</div>
        </div>`;
      const code = buildPixPayload("PIZZARIAARTESANAL", "PEDRAS DE FOGO", sub.toFixed(2));
      document.getElementById('pixCode').textContent = code;
      new QRCode(document.getElementById('qrHolder'), {text: code, width:150, height:150, colorDark:"#241419", colorLight:"#fbf1ec"});
      document.getElementById('copyPix').addEventListener('click', ()=>{
        navigator.clipboard && navigator.clipboard.writeText(code).catch(()=>{});
        showToast('Código Pix copiado!');
      });
    } else if(method==='card'){
      panel.innerHTML = `
        <div class="pay-panel">
          <label>Número do cartão</label><input maxlength="19" placeholder="0000 0000 0000 0000">
          <div class="field-row"><div><label>Validade</label><input maxlength="5" placeholder="MM/AA"></div><div><label>CVV</label><input maxlength="4" placeholder="123"></div></div>
          <label>Nome impresso</label><input placeholder="Como no cartão">
          ${canInstall? `<label>Parcelas</label><select><option>1x de ${money(sub)} sem juros</option><option>2x de ${money(sub/2)} sem juros</option></select>` : `<div class="small-note">Parcelamento disponível a partir de R$ 70,00.</div>`}
        </div>`;
    } else {
      panel.innerHTML = `
        <div class="pay-panel">
          <div style="display:flex;justify-content:center;margin-bottom:8px">${CASH_SVG.replace('width="48" height="48"','')}</div>
          <label>Precisa de troco para quanto?</label>
          <input placeholder="Ex: R$ 100,00 (opcional)">
          <div class="small-note">Pagamento em dinheiro na entrega ou na retirada do pedido.</div>
        </div>`;
    }
  };
  modal.querySelectorAll('.pay-opt').forEach(opt=>{
    opt.addEventListener('click', ()=>{
      modal.querySelectorAll('.pay-opt').forEach(o=>o.classList.remove('active'));
      opt.classList.add('active'); method = opt.dataset.pay; renderPanel();
    });
  });
  renderPanel();
  modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=> checkoutOverlay.classList.remove('open')));
  document.getElementById('confirmOrder').addEventListener('click', ()=>{
    modal.innerHTML = `
      <button class="close" data-close>✕</button>
      <div style="text-align:center;padding:20px 6px">
        <div style="font-size:2.4rem">🌙</div>
        <h3>Pedido confirmado!</h3>
        <p class="small-note">Seu pedido foi enviado à cozinha da Pizzaria Artesanal. Em breve entraremos em contato pelo WhatsApp para confirmar a entrega.</p>
      </div>`;
    modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', ()=> checkoutOverlay.classList.remove('open')));
    cart = []; saveCart();
  });
  checkoutOverlay.classList.add('open');
}
checkoutOverlay.addEventListener('click', e=>{ if(e.target.id==='checkoutOverlay') checkoutOverlay.classList.remove('open'); });

function buildPixPayload(pixKey, city, amount){
  function tlv(id, value){ const len = String(value.length).padStart(2,'0'); return id+len+value; }
  const gui = tlv('00','br.gov.bcb.pix');
  const key = tlv('01', pixKey);
  const merchantAccount = tlv('26', gui+key);
  const mcc = tlv('52','0000'); const cur = tlv('53','986'); const amt = tlv('54', amount);
  const country = tlv('58','BR'); const name = tlv('59','PIZZARIA ARTESANAL'.slice(0,25)); const cityT = tlv('60', city.slice(0,15));
  const addData = tlv('62', tlv('05','***'));
  let payload = tlv('00','01') + tlv('01','11') + merchantAccount + mcc + cur + amt + country + name + cityT + addData + '6304';
  payload += crc16(payload);
  return payload;
}
function crc16(str){
  let crc = 0xFFFF;
  for(let i=0;i<str.length;i++){
    crc ^= str.charCodeAt(i) << 8;
    for(let j=0;j<8;j++){ crc = (crc & 0x8000) ? ((crc<<1) ^ 0x1021) : (crc<<1); crc &= 0xFFFF; }
  }
  return crc.toString(16).toUpperCase().padStart(4,'0');
}

updateBadge();
