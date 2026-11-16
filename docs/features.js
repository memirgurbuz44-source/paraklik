(function(){
"use strict";
var gear=[
["iron_sword","⚔️","Demir Kılıç","weapon",2,4,{"wood":4,"iron":6}],
["ruby_blade","🗡️","Yakut Kılıcı","weapon",5,8,{"iron":8,"ruby_shard":3}],
["diamond_edge","💎","Elmas Kesici","weapon",8,12,{"iron":5,"diamond_shard":4}],
["guardian_helm","🪖","Muhafız Miğferi","helmet",0,5,{"iron":8,"wood":2}],
["ruby_helm","🔴","Yakut Miğferi","helmet",0,9,{"iron":5,"ruby_shard":3}],
["iron_armor","🛡️","Demir Zırh","armor",0,8,{"iron":12,"leather":6}],
["crystal_armor","🔷","Kristal Zırh","armor",0,14,{"diamond_shard":4,"leather":8}],
["swift_boots","🥾","Çevik Bot","boots",2,3,{"leather":8,"wood":3}],
["titan_boots","👢","Titan Botu","boots",0,7,{"iron":8,"leather":5}],
["power_gloves","🧤","Güç Eldiveni","gloves",3,2,{"iron":5,"leather":4}],
["ruby_gloves","🧤","Yakut Eldiven","gloves",5,4,{"ruby_shard":3,"leather":5}],
["war_ring","💍","Savaş Yüzüğü","ring",2,2,{"iron":3,"crystal":2}],
["diamond_ring","💎","Elmas Yüzük","ring",4,4,{"diamond_shard":2,"crystal":3}],
["life_amulet","📿","Yaşam Muskası","amulet",0,8,{"crystal":4,"leather":3}],
["storm_charm","🌩️","Fırtına Tılsımı","amulet",4,5,{"crystal":5,"ruby_shard":2}],
["wood_shield","🪵","Ahşap Kalkan","shield",0,4,{"wood":10,"leather":2}],
["iron_shield","🛡️","Demir Kalkan","shield",0,9,{"iron":10,"wood":4}],
["phoenix_cape","🪽","Anka Pelerini","cape",3,6,{"cloth":6,"crystal":3}],
["shadow_cloak","🌑","Gölge Pelerini","cape",5,5,{"cloth":8,"ruby_shard":2}],
["focus_rune","🔮","Odak Rünü","rune",4,3,{"crystal":5,"wood":3}],
["fortress_rune","🏰","Kale Rünü","rune",0,7,{"crystal":6,"iron":4}],
["hunter_badge","🎖️","Avcı Rozeti","badge",3,3,{"iron":4,"cloth":4}],
["champion_badge","🏅","Şampiyon Rozeti","badge",6,5,{"ruby_shard":3,"crystal":4}],
["frost_orb","❄️","Ayaz Küresi","orb",5,4,{"crystal":6,"diamond_shard":1}],
["flame_orb","🔥","Alev Küresi","orb",7,3,{"crystal":5,"ruby_shard":2}],
["storm_spear","🔱","Fırtına Mızrağı","weapon",7,7,{"iron":8,"crystal":4}],
["dragon_scale","🐉","Ejderha Pulu","armor",0,16,{"ruby_shard":4,"diamond_shard":3}],
["void_mask","🎭","Hiçlik Maskesi","helmet",5,10,{"cloth":6,"crystal":6}],
["royal_crown","👑","Hükümdar Tacı","helmet",8,8,{"ruby_shard":5,"diamond_shard":4}],
["guardian_totem","🗿","Koruyucu Totem","amulet",0,12,{"wood":8,"crystal":5}]
].map(function(a){return{id:a[0],ico:a[1],name:a[2],slot:a[3],atk:a[4],def:a[5],recipe:a[6]}});

var mats={wood:["🪵","Odun"],iron:["⛓️","Demir"],leather:["🟫","Deri"],cloth:["🧵","Kumaş"],crystal:["🔮","Kristal"],ruby_shard:["🔴","Yakut Parçası"],diamond_shard:["💎","Elmas Parçası"]};
var modes=[1,2,3,4,5],oldShow=window.show,oldReward=window.duelReward,tabButtons=["forge","gear","market","arena"];
function state(){
 S.inventory=S.inventory||{};S.materials=S.materials||{};S.equipped=S.equipped||{};
 S.listings=Array.isArray(S.listings)?S.listings:[];S.upgrades=S.upgrades||{};
 S.botStats=S.botStats||{w:0,l:0};S.marketStats=S.marketStats||{sold:0,earned:0};
}
function addMat(id,n){S.materials[id]=(S.materials[id]||0)+n;}
function hasRecipe(r){return Object.keys(r).every(function(k){return(S.materials[k]||0)>=r[k]})}
function spendRecipe(r){Object.keys(r).forEach(function(k){S.materials[k]-=r[k]})}
function bonus(){
 var a=0,d=0;Object.keys(S.equipped).forEach(function(slot){
  var it=gear.find(function(x){return x.id===S.equipped[slot]});
  if(it){var lv=S.upgrades[it.id]||0;a+=it.atk+lv*2;d+=it.def+lv*2}
 });return{atk:a,def:d};
}
function panelX(title){var p=document.createElement("div");p.className="panel";p.innerHTML="<h3>"+title+"</h3>";document.getElementById("content").appendChild(p);return p}
function line(p,html,button,fn){
 var r=document.createElement("div");r.className="row";r.innerHTML=html;
 if(button){var b=document.createElement("button");b.className="btn2";b.textContent=button;b.onclick=fn;r.appendChild(b)}
 p.appendChild(r);return r;
}
function btnTab(name,label){
 var b=document.createElement("button");b.textContent=label;b.className=tab===name?"on":"";
 b.onclick=function(){tab=name;show()};document.getElementById("tabs").appendChild(b);
}
function materialText(){return Object.keys(mats).map(function(k){return mats[k][0]+" "+mats[k][1]+": "+(S.materials[k]||0)}).join(" · ")}
function drawForge(){
 var p=panelX("🧰 Malzemelerin");line(p,'<div class="small">'+materialText()+'</div>');
 var l=document.createElement("div");l.className="list";document.getElementById("content").appendChild(l);
 gear.forEach(function(it){
  var can=hasRecipe(it.recipe),req=Object.keys(it.recipe).map(function(k){return mats[k][0]+" "+it.recipe[k]}).join(" · ");
  var b=document.createElement("button");b.className="item";b.disabled=!can;
  b.innerHTML='<div class="ico">'+it.ico+'</div><div class="info"><div class="name">'+it.name+'</div><div class="desc">'+req+'</div><div class="own">Saldırı +'+it.atk+' · Savunma +'+it.def+'</div></div><div class="cost">'+(can?"Üret":"Eksik")+'</div>';
  b.onclick=function(){if(!hasRecipe(it.recipe))return;spendRecipe(it.recipe);S.inventory[it.id]=(S.inventory[it.id]||0)+1;save();show();toast(it.name+" üretildi!")};
  l.appendChild(b);
 });
}
function drawGear(){
 var p=panelX("🎒 Ekipman envanteri"),owned=gear.filter(function(it){return(S.inventory[it.id]||0)>0});
 if(!owned.length)line(p,'<div class="small">Henüz eşyan yok. Savaşlardan malzeme topla ve üret.</div>');
 owned.forEach(function(it){
  var lv=S.upgrades[it.id]||0,eq=S.equipped[it.slot]===it.id;
  line(p,'<div class="grow">'+it.ico+" <b>"+it.name+'</b><div class="small">'+it.slot+" · Saldırı "+(it.atk+lv*2)+" · Savunma "+(it.def+lv*2)+" · Seviye "+(lv+1)+'</div></div>',eq?"Çıkar":"Tak",function(){
   if(eq)delete S.equipped[it.slot];else S.equipped[it.slot]=it.id;save();show();
  });
  line(p,'<div class="grow small">Geliştirme ücreti: '+fmt((lv+1)*2500)+' 🪙</div>',"Geliştir",function(){
   var cost=(lv+1)*2500;if(S.coins<cost)return toast("Yeterli paran yok");
   S.coins-=cost;S.upgrades[it.id]=lv+1;save();show();toast("Eşya geliştirildi");
  });
 });
 var z=bonus();line(p,"<b>Toplam bonus</b><b>⚔️ +"+z.atk+" · 🛡️ +"+z.def+"</b>");
}
function marketValue(it){return 500+(it.atk*450)+(it.def*350)+(S.upgrades[it.id]||0)*1200}
function sellItem(it,currency){
 var count=S.inventory[it.id]||0;if(count<1)return toast("Satılacak eşya yok");
 if(S.equipped[it.slot]===it.id)return toast("Önce ekipmandan çıkar");
 var value=marketValue(it);
 if(currency==="ruby"){var amount=Math.max(1,Math.floor(value/8000));S.ruby+=amount;value=amount}
 else if(currency==="dia"){var amount=Math.max(1,Math.floor(value/15000));S.dia+=amount;value=amount}
 else{S.coins+=value}
 S.inventory[it.id]--;S.marketStats.sold++;S.marketStats.earned+=currency==="coin"?value:marketValue(it);
 save();show();toast(it.name+" satıldı!");
}
var pmUn=[],pmReady=false,pmListings=[],pmTrades=[];
function pmWatch(){
 if(pmReady||!db||!UID)return;pmReady=true;
 pmUn.push(db.collection("playerMarket").limit(80).onSnapshot(function(q){pmListings=q.docs.map(function(x){var v=x.data();v.id=x.id;return v});if(tab==="market")pmDraw();},function(){pmReady=false;toast("Pazar bağlantı hatası. Firebase kurallarını kontrol et.")}));
 pmUn.push(db.collection("marketTrades").where("sellerId","==",UID).limit(60).onSnapshot(function(q){pmTrades=q.docs.map(function(x){var v=x.data();v.id=x.id;return v});if(tab==="market")pmDraw();},function(){pmReady=false;toast("Ticaret istekleri alınamadı.")}));
 pmUn.push(db.collection("marketTrades").where("buyerId","==",UID).limit(60).onSnapshot(function(q){
  q.docs.forEach(function(x){var t=x.data(),id=x.id;S.marketClaims=S.marketClaims||{};S.marketRefunds=S.marketRefunds||{};
   if(t.status==="accepted"&&!S.marketClaims[id]){S.inventory[t.itemId]=(S.inventory[t.itemId]||0)+1;S.marketClaims[id]=1;save();db.doc("marketTrades/"+id).update({buyerClaimed:true}).catch(function(){});toast(t.itemName+" envanterine eklendi.");}
   if(t.status==="rejected"&&!S.marketRefunds[id]){S[t.currency]=(S[t.currency]||0)+Number(t.price||0);S.marketRefunds[id]=1;save();toast("İstek reddedildi, ödemen iade edildi.");}
  });if(tab==="market")pmDraw();
 },function(){pmReady=false;toast("Satın alma kayıtları alınamadı.")}));
}
function pmDraw(){
 if(tab!=="market")return;var host=document.getElementById("content");if(!host)return;
 var old=document.getElementById("pm-live");if(old)old.remove();
 var root=document.createElement("div");root.id="pm-live";host.appendChild(root);
 function panel(t){var p=document.createElement("div");p.className="panel";p.innerHTML="<h3>"+t+"</h3>";root.appendChild(p);return p}
 function row(p,h){var r=document.createElement("div");r.className="row";r.innerHTML=h;p.appendChild(r);return r}
 var sell=panel("🤝 Eşyalarını oyunculara sat");
 row(sell,'<div class="small">İlan verdiğinde eşya envanterinden ayrılır. Alıcı ödeme isteği yollar; sen onaylayınca satış tamamlanır.</div>');
 gear.filter(function(it){return(S.inventory[it.id]||0)>0&&S.equipped[it.slot]!==it.id}).forEach(function(it){
  var r=row(sell,'<div class="grow">'+it.ico+' <b>'+it.name+'</b><div class="small">Adet: '+S.inventory[it.id]+'</div></div>');
  var price=document.createElement("input");price.type="number";price.min="1";price.value=marketValue(it);price.placeholder="Fiyat";price.style.width="90px";r.appendChild(price);
  var cur=document.createElement("select");cur.innerHTML='<option value="coins">🪙 Para</option><option value="ruby">🔴 Yakut</option><option value="dia">💎 Elmas</option>';r.appendChild(cur);
   var kind=document.createElement("select");kind.innerHTML='<option value="fixed">Sabit fiyat</option><option value="auction">Açık artırma · 24 saat</option>';r.appendChild(kind);
  var b=document.createElement("button");b.className="btn2";b.textContent="İlan ver";b.onclick=function(){
   var n=Math.floor(+price.value);if(!Number.isSafeInteger(n)||n<1)return toast("Geçerli fiyat gir.");
   if((S.inventory[it.id]||0)<1||S.equipped[it.slot]===it.id)return toast("Eşya artık satılamıyor.");
   S.inventory[it.id]--;save();
   db.collection("playerMarket").add({sellerId:UID,sellerName:S.nick||"Oyuncu",itemId:it.id,itemName:it.name,ico:it.ico,price:n,currency:cur.value,status:"active",listingType:kind.value,currentBid:n,topBidderId:"",topBidderName:"",bidCount:0,endsAt:kind.value==="auction"?Date.now()+86400000:0,created:Date.now()}).then(function(){toast("İlan pazara eklendi.");show()}).catch(function(){S.inventory[it.id]++;save();toast("İlan açılamadı. Firebase kurallarını kontrol et.");});
  };r.appendChild(b);
 });
 var board=panel("🛒 Diğer oyuncuların ilanları");
 var active=pmListings.filter(function(x){return x.status==="active"&&x.sellerId!==UID&&(x.listingType!=="auction"||Date.now()<Number(x.endsAt||0))});
 if(!active.length)row(board,'<div class="small">Henüz başka oyuncu ilanı yok.</div>');
 active.forEach(function(x){
  var r=row(board,'<div class="grow">'+(x.ico||"🎁")+' <b>'+esc(String(x.itemName||"Eşya"))+'</b><div class="small">Satıcı: '+esc(String(x.sellerName||"Oyuncu"))+'</div></div><b>'+fmt(x.price)+' '+({coins:"🪙",ruby:"🔴",dia:"💎"}[x.currency]||"")+'</b>');
   var auction=x.listingType==="auction",shown=auction?Number(x.currentBid||x.price):Number(x.price);
   if(auction){r.firstChild.innerHTML += '<div class="small">Açık artırma · '+Math.max(0,Math.ceil((Number(x.endsAt)-Date.now())/3600000))+' saat kaldı · '+(x.bidCount||0)+' teklif</div>';r.lastChild.textContent=fmt(shown)+' '+({coins:"🪙",ruby:"🔴",dia:"💎"}[x.currency]||"");}
  var b=document.createElement("button");b.className="btn2";b.textContent=x.listingType==="auction"?"Teklif ver":"Satın al";b.onclick=function(){
    if(auction){
     if(Date.now()>=Number(x.endsAt||0))return toast("Açık artırma sona ermiş.");
     var offer=Number(prompt("Mevcut teklif: "+shown+" · Yeni teklifini gir:",String(shown+1)));
     if(!Number.isSafeInteger(offer)||offer<=shown)return toast("Teklif mevcut fiyattan yüksek olmalı.");
     db.runTransaction(function(tx){var ref=db.doc("playerMarket/"+x.id);return tx.get(ref).then(function(s){var v=s.data()||{};if(v.status!=="active"||Date.now()>=Number(v.endsAt||0)||offer<=Number(v.currentBid||v.price))throw new Error("Teklif artık geçerli değil.");tx.update(ref,{currentBid:offer,topBidderId:UID,topBidderName:S.nick||"Oyuncu",bidCount:Number(v.bidCount||0)+1});});}).then(function(){toast("Teklifin kaydedildi.");}).catch(function(e){toast(e.message||"Teklif gönderilemedi.");});return;
    }
   if((S[x.currency]||0)<Number(x.price))return toast("Yeterli bakiyen yok.");
   if(pmTrades.some(function(t){return t.listingId===x.id&&t.status==="pending"}))return toast("Bu ilan için bekleyen isteğin var.");
   if(!confirm(x.itemName+" için "+x.price+" ödeme yaparak satın alma isteği gönderilsin mi?"))return;
   S[x.currency]-=Number(x.price);save();
   db.collection("marketTrades").add({listingId:x.id,sellerId:x.sellerId,buyerId:UID,buyerName:S.nick||"Oyuncu",itemId:x.itemId,itemName:x.itemName,price:Number(x.price),currency:x.currency,status:"pending",created:Date.now()}).then(function(){toast("İstek satıcıya gönderildi.")}).catch(function(){S[x.currency]+=Number(x.price);save();toast("İstek gönderilemedi, ödeme iade edildi.")});
  };r.appendChild(b);
 });
  pmListings.filter(function(x){return x.status==="active"&&x.listingType==="auction"&&Number(x.endsAt)<=Date.now()&&x.topBidderId===UID}).forEach(function(x){
   var r=row(board,'<div class="grow"><b>🏆 Açık artırmayı kazandın: '+esc(String(x.itemName||"Eşya"))+'</b><div class="small">Kazanan teklif: '+fmt(x.currentBid)+' '+({coins:"🪙",ruby:"🔴",dia:"💎"}[x.currency]||"")+'</div></div>');
   var pay=document.createElement("button");pay.className="btn2";pay.textContent="Öde ve teslim al";pay.onclick=function(){
    if((S[x.currency]||0)<Number(x.currentBid))return toast("Kazanan teklifi ödemek için bakiyen yetmiyor.");
    if(pmTrades.some(function(t){return t.listingId===x.id&&t.buyerId===UID&&t.status==="pending"}))return toast("Ödeme isteğin zaten satıcıda.");
    S[x.currency]-=Number(x.currentBid);save();
    db.collection("marketTrades").add({listingId:x.id,sellerId:x.sellerId,buyerId:UID,buyerName:S.nick||"Oyuncu",itemId:x.itemId,itemName:x.itemName,price:Number(x.currentBid),currency:x.currency,status:"pending",created:Date.now()}).then(function(){toast("Ödeme isteği satıcıya gönderildi.");}).catch(function(){S[x.currency]+=Number(x.currentBid);save();toast("İstek gönderilemedi, bakiye iade edildi.");});
   };r.appendChild(pay);
  });
 var req=panel("📨 Gelen satın alma istekleri"),pending=pmTrades.filter(function(t){return t.status==="pending"});
 if(!pending.length)row(req,'<div class="small">Bekleyen istek yok.</div>');
 pending.forEach(function(t){
  var r=row(req,'<div class="grow"><b>'+t.itemName+'</b><div class="small">'+t.buyerName+' · '+fmt(t.price)+' '+({coins:"🪙",ruby:"🔴",dia:"💎"}[t.currency]||"")+'</div></div>');
  var a=document.createElement("button");a.className="btn2";a.textContent="Onayla";a.onclick=function(){
   var listing=pmListings.filter(function(x){return x.id===t.listingId&&x.status==="active"&&x.sellerId===UID})[0];if(!listing)return toast("İlan aktif değil.");
   db.doc("playerMarket/"+t.listingId).update({status:"sold"}).then(function(){return db.doc("marketTrades/"+t.id).update({status:"accepted"})}).then(function(){S[t.currency]=(S[t.currency]||0)+Number(t.price);save();toast("Satış tamamlandı, ödeme eklendi.");show()}).catch(function(){toast("Satış onaylanamadı. Firebase kurallarını kontrol et.")});
  };r.appendChild(a);
  var d=document.createElement("button");d.className="btn2 g";d.textContent="Reddet";d.onclick=function(){db.doc("marketTrades/"+t.id).update({status:"rejected"}).then(function(){toast("İstek reddedildi.")}).catch(function(){toast("İstek reddedilemedi.")})};r.appendChild(d);
 });
}
function drawMarketX(){
 var p=panelX("🛒 Oyuncu pazarı");line(p,'<div class="small">Diğer oyuncularla eşya alışverişi yap. Satıcı onayladığında eşya alıcının envanterine geçer.</div>');
 var n=panelX("⛏️ Malzeme pazarı");line(n,'<div class="small">Fazla malzemelerini oyun parasına dönüştür.</div>');
 Object.keys(mats).forEach(function(k){var have=S.materials[k]||0;line(n,'<div class="grow">'+mats[k][0]+" "+mats[k][1]+": "+have+'</div>',"10 tanesini sat (+"+fmt(250)+" 🪙)",function(){if((S.materials[k]||0)<10)return toast("En az 10 adet gerekli");S.materials[k]-=10;S.coins+=250;S.marketStats.sold+=10;S.marketStats.earned+=250;save();show();toast("10 malzeme satıldı");});});
 pmWatch();pmDraw();
}
function drawArena(){
 var p=panelX("⚔️ Takımlı bot düellosu");
 line(p,'<div class="small">1v1–5v5 modlarında eksik oyuncular botlarla tamamlanır. Bu mod ücretsizdir ve cihazında çalışır; çevrimiçi eşleştirme değildir.</div>');
 modes.forEach(function(n){
  line(p,'<div class="grow"><b>'+n+'v'+n+'</b><div class="small">'+(n-1)+' takım arkadaşın ve '+n+' rakip bot</div></div>',"Savaşa gir",function(){startBotMatch(n)});
 });
 line(p,'<div class="small">Galibiyet malzeme ve oyun parası kazandırır. Ekipman bonusların takım gücüne eklenir.</div>');
 line(p,'<b>Bot maçları</b><span>🏆 '+S.botStats.w+' galibiyet · '+S.botStats.l+' mağlubiyet</span>');
}
function startBotMatch(n){
 if(window.botBattle&&window.botBattle.timer)clearInterval(window.botBattle.timer);
 var old=document.getElementById("botBattleOverlay");if(old)old.remove();
 var battle={n:n,me:0,ally:0,enemy:0,left:20,done:false,timer:null};window.botBattle=battle;
 var overlay=document.createElement("div");overlay.id="botBattleOverlay";
 overlay.style.cssText="position:fixed;inset:0;z-index:99999;background:rgba(8,10,16,.97);color:#fff;display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto";
 overlay.innerHTML='<div style="width:min(900px,100%);text-align:center"><div style="font-size:26px;font-weight:900;margin:8px">⚔️ '+n+'v'+n+' BOT SAVAŞI</div><div id="bbTimer" style="font-size:48px;font-weight:900;color:#ffd166">20</div><div style="color:#b9c2d0;margin-bottom:12px">Süre bitene kadar kendi takımının butonuna olabildiğince çok bas!</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="border:2px solid #4388ff;border-radius:16px;padding:12px;background:#17243a"><h2>🔵 BİZİM TAKIM</h2><div id="bbAlly" style="font-size:32px;font-weight:900">0 tık</div><button id="bbClick" style="width:100%;min-height:150px;margin-top:12px;border:0;border-radius:14px;background:#2878ed;color:white;font-size:25px;font-weight:900;touch-action:manipulation">👆 BAS!</button><div style="font-size:13px;margin-top:8px">Sen + '+(n-1)+' takım arkadaşı bot</div></div><div style="border:2px solid #e05252;border-radius:16px;padding:12px;background:#351b22"><h2>🔴 RAKİP TAKIM</h2><div id="bbEnemy" style="font-size:32px;font-weight:900">0 tık</div><div style="font-size:13px;margin-top:18px">Rakip botlar</div><div style="font-size:48px;margin-top:16px">🤖</div></div></div><div id="bbResult" style="font-size:22px;font-weight:900;min-height:36px;margin:14px"></div><button id="bbClose" style="display:none;padding:13px 28px;border:0;border-radius:10px;background:#ffd166;color:#171717;font-weight:900">Sonuca dön</button></div>';
 document.body.appendChild(overlay);var $=function(id){return document.getElementById(id)};
 function paint(){$("bbAlly").textContent=(battle.me+battle.ally)+" tık";$("bbEnemy").textContent=battle.enemy+" tık";$("bbTimer").textContent=battle.left+" sn"}
 $("bbClick").addEventListener("pointerdown",function(e){e.preventDefault();if(battle.done)return;battle.me++;paint();if(navigator.vibrate)navigator.vibrate(8)});
 $("bbClose").onclick=function(){if(battle.timer)clearInterval(battle.timer);overlay.remove();window.botBattle=null;show()};
 battle.timer=setInterval(function(){
  if(battle.done)return;battle.left--;battle.ally+=Math.floor(Math.random()*3);battle.enemy+=Math.floor(Math.random()*(n+2))+1;paint();
  if(battle.left<=0){
   battle.done=true;clearInterval(battle.timer);
   var ally=battle.me+battle.ally,opp=battle.enemy,win=ally>opp,coins=win?1500*n:350*n;S.coins+=coins;S.total=(S.total||0)+coins;
   if(win){S.botStats.w++;var keys=Object.keys(mats);for(var i=0;i<3+n;i++)addMat(keys[Math.floor(Math.random()*keys.length)],1);if(Math.random()<.4)S.dia+=1;if(Math.random()<.25)S.ruby+=1}
   else{S.botStats.l++;addMat("wood",1);addMat("leather",1)}
   save();$("bbClick").disabled=true;$("bbClick").textContent="MAÇ BİTTİ";
   $("bbResult").textContent=(win?"🏆 KAZANDIN!":ally===opp?"🤝 BERABERE!":"😕 KAYBETTİN")+" ("+ally+" - "+opp+")";$("bbClose").style.display="inline-block";
  }
 },1000);paint();
}
window.show=function(){
 state();oldShow();
 if(tab==="forge"||tab==="gear"||tab==="market"||tab==="arena"){
  document.getElementById("content").innerHTML="";
  if(tab==="forge")drawForge();if(tab==="gear")drawGear();
  if(tab==="market")drawMarketX();if(tab==="arena")drawArena();
 }
 var labels={forge:"🧰 Üretim",gear:"🎒 Ekipman",market:"🛒 Pazar",arena:"⚔️ Takımlı Bot"};
 tabButtons.forEach(function(t){
  if(!Array.from(document.getElementById("tabs").children).some(function(b){return b.textContent===labels[t]}))btnTab(t,labels[t]);
 });
 draw();
};
window.duelReward=function(){
 var r=oldReward();
 if(r){
  addMat("iron",2);addMat("leather",1);
  if(Math.random()<.35)addMat("ruby_shard",1);
  if(Math.random()<.2)addMat("diamond_shard",1);
  save();
 }
 return r;
};
state();show();
})();