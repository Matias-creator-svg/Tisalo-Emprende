(() => {
  const root = document.getElementById('quickSalePage'); if (!root) return;
  const store = window.TisaleoDemoStore;
  const seedProducts = JSON.parse(document.getElementById('quickSaleProducts')?.textContent || '[]');
  const seedServices = JSON.parse(document.getElementById('quickSaleServices')?.textContent || '[]');
  let products = store.getProducts(seedProducts).filter(p => p.active !== false).map(p => ({...p, kind:'Producto', id:String(p.id), price:Number(p.price), stock:Number(p.stock)}));
  const today = store.nowParts().date;
  const serviceAvailable = s => (s.status || (s.active === false ? 'Inactivo' : 'Activo')) === 'Activo' && (!s.startDate || s.startDate <= today) && (!s.endDate || s.endDate >= today);
  let services = store.getServices(seedServices).filter(serviceAvailable).map(s => ({...s, kind:'Servicio', id:String(s.id), price:Number(s.price), stock:null, sku:s.code, sector:s.sector||store.getProfile().sector||'Agropecuario', unit:s.unit||'Servicio'}));
  const cart = new Map(); let activeKind='products'; let category='Todos'; let payment='Efectivo';

  const el = id => document.getElementById(id); const grid=el('productGrid'), search=el('catalogSearch'), count=el('catalogCount'), empty=el('catalogEmpty'), categoryTabs=el('categoryTabs'), typeTabs=el('saleTypeTabs'), items=el('ticketItems'), ticketCount=el('ticketProductCount'), subtotalEl=el('subtotalValue'), totalEl=el('totalValue'), paymentOptions=el('paymentOptions'), mixed=el('mixedPayment'), mixedCash=el('mixedCash'), mixedTransfer=el('mixedTransfer');
  const money=v=>`$${Number(v||0).toFixed(2)}`; const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const toast=m=>window.showToast?.(m); const icon=()=>window.lucide?.createIcons({attrs:{'stroke-width':1.8}});
  const currentList=()=>activeKind==='products'?products:services;
  const categories=()=>['Todos', ...new Set(currentList().map(x=>x.category||x.sector).filter(Boolean))];
  const findItem=(kind,id)=>(kind==='Producto'?products:services).find(x=>String(x.id)===String(id));

  const renderTabs=()=>{ categoryTabs.innerHTML=categories().map(c=>`<button class="${c===category?'selected':''}" type="button" data-category="${esc(c)}">${esc(c)}</button>`).join(''); };
  const renderCatalog=()=>{
    const q=(search.value||'').trim().toLowerCase(); const list=currentList().filter(x=>{
      const cat=x.category||x.sector; return (category==='Todos'||cat===category) && `${x.name} ${x.sku||x.code||''} ${x.sector||''} ${x.description||''}`.toLowerCase().includes(q);
    });
    count.textContent=`${list.length} ${activeKind==='products'?'productos':'servicios'}`; empty.hidden=list.length!==0;
    grid.innerHTML=list.map(x=>{
      const low=x.kind==='Producto'&&Number(x.stock)<=Number(x.minimum||5); const image=x.image||'';
      return `<article class="sale-product-card service-ready" data-item-id="${esc(x.id)}" data-kind="${esc(x.kind)}">
        <button class="product-image js-add-item" type="button" data-item-id="${esc(x.id)}" data-kind="${esc(x.kind)}">
          ${image?`<img src="${esc(image)}" alt="${esc(x.name)}">`:`<div class="service-visual"><i data-lucide="briefcase-business"></i></div>`}
          ${low?`<span>${Number(x.stock)<=0?'Sin stock':'Stock bajo'}</span>`:''}<i><span data-lucide="plus"></span></i>
        </button>
        <div class="sale-product-copy"><span>${esc((x.sector||x.category||x.kind).toUpperCase())}</span><h2>${esc(x.name)}</h2><p>${esc(x.description||`${x.unit||''} · ${x.sector||''}`)}</p><div><strong>${money(x.price)}</strong><small>${x.kind==='Producto'?`${x.stock} ${x.unit||'un.'} disponibles`:x.unit||'Servicio'}</small></div></div>
      </article>`;
    }).join(''); icon();
  };
  const subtotal=()=>[...cart.values()].reduce((sum,row)=>sum+row.item.price*row.qty,0);
  const renderCart=()=>{
    const rows=[...cart.values()]; ticketCount.textContent=`${rows.length} ${rows.length===1?'registro':'registros'}`;
    items.innerHTML=rows.length?rows.map(row=>`<div class="ticket-item"><div class="ticket-mini-icon">${row.item.kind==='Servicio'?'S':'P'}</div><div class="ticket-item-info"><strong>${esc(row.item.name)}</strong><small>${money(row.item.price)} / ${esc(row.item.unit||'unidad')}</small><div class="quantity-control"><button data-action="minus" data-key="${esc(row.key)}">−</button><span>${row.qty}</span><button data-action="plus" data-key="${esc(row.key)}">+</button></div></div><div class="ticket-item-total"><button data-action="remove" data-key="${esc(row.key)}"><i data-lucide="x"></i></button><strong>${money(row.item.price*row.qty)}</strong></div></div>`).join(''):`<div class="empty-ticket"><i data-lucide="shopping-cart"></i><strong>Tu ticket está vacío</strong><span>Selecciona productos o servicios para comenzar.</span></div>`;
    const total=subtotal(); subtotalEl.textContent=money(total); totalEl.textContent=money(total); if(payment==='Mixto'){mixedCash.value=(total*.6).toFixed(2); mixedTransfer.value=(total*.4).toFixed(2);} icon();
  };
  const add=(kind,id)=>{ const item=findItem(kind,id); if(!item)return; const key=`${kind}:${id}`; const row=cart.get(key)||{key,item,qty:0}; if(kind==='Producto'&&row.qty>=item.stock){toast(`Stock insuficiente de ${item.name}`);return;} row.qty+=1; cart.set(key,row); renderCart(); toast(`${item.name} añadido al ticket`); };

  grid.addEventListener('click',e=>{const b=e.target.closest('.js-add-item'); if(b)add(b.dataset.kind,b.dataset.itemId);});
  items.addEventListener('click',e=>{const b=e.target.closest('button[data-action]'); if(!b)return; const row=cart.get(b.dataset.key); if(!row)return; if(b.dataset.action==='remove'){cart.delete(row.key);} else if(b.dataset.action==='minus'){row.qty--; if(row.qty<=0)cart.delete(row.key);} else if(b.dataset.action==='plus'){if(row.item.kind==='Producto'&&row.qty>=row.item.stock){toast('No hay más stock disponible');return;} row.qty++;} renderCart();});
  typeTabs.addEventListener('click',e=>{const b=e.target.closest('button[data-kind]'); if(!b)return; activeKind=b.dataset.kind; category='Todos'; typeTabs.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b)); renderTabs(); renderCatalog();});
  categoryTabs.addEventListener('click',e=>{const b=e.target.closest('button[data-category]'); if(!b)return; category=b.dataset.category; renderTabs(); renderCatalog();}); search.addEventListener('input',renderCatalog);
  el('clearCart').addEventListener('click',()=>{cart.clear();renderCart();toast('Ticket limpiado');});
  paymentOptions.addEventListener('click',e=>{const b=e.target.closest('button[data-payment]'); if(!b)return; payment=b.dataset.payment; paymentOptions.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b)); mixed.hidden=payment!=='Mixto';renderCart();});
  el('completeSale').addEventListener('click',()=>{
    if(!cart.size){toast('Añade al menos un producto o servicio');return;} const total=subtotal(); if(payment==='Mixto'&&Math.abs(Number(mixedCash.value||0)+Number(mixedTransfer.value||0)-total)>.01){toast(`El pago mixto debe sumar ${money(total)}`);return;}
    const saleItems=[]; const saleId=`V-${String(Date.now()).slice(-6)}`;
    [...cart.values()].forEach(row=>{ const x=row.item; saleItems.push({sku:x.sku||x.code,name:x.name,sector:x.sector,kind:x.kind,quantity:row.qty,unit:x.unit,price:x.price,total:x.price*row.qty}); if(x.kind==='Producto'){const previous=Number(x.stock); const final=previous-row.qty; const allocations=store.consumeLots(x.id,row.qty); const lotDetail=allocations.length?` · Lotes: ${allocations.map(a=>`${a.code} (${a.quantity})`).join(', ')}`:''; x.stock=final; store.setStock(x.id,final,seedProducts); store.addMovement({productId:x.id,product:x.name,sku:x.sku,sector:x.sector,type:'Venta',detail:`Venta #${saleId}${lotDetail}`,quantity:-row.qty,unit:x.unit,previous,final});} });
    store.addSale({id:saleId,payment,total,items:saleItems}); products=store.getProducts(seedProducts).filter(p=>p.active!==false).map(p=>({...p,kind:'Producto',id:String(p.id),price:Number(p.price),stock:Number(p.stock)})); cart.clear(); renderCatalog(); renderCart(); toast(`Venta ${saleId} registrada por ${money(total)}`);
  });
  renderTabs(); renderCatalog(); renderCart();
})();
