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
var modes=[1,2,3,4,5],oldShow=window.show,oldReward=window.duelReward;
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
function drawMarketX(){
 var p=panelX("🛒 Ücretsiz NPC pazarı");
 line(p,'<div class="small">Bu pazar cihazındaki oyun kaydında çalışır. Diğer oyuncuların ilanlarını göstermez; gerçek oyuncular arası güvenli ticaret için ücret gerektirmeyen güvenli sunucu altyapısı bulunmuyor.</div>');
 line(p,'<b>Satış istatistiği</b><span>'+S.marketStats.sold+' eşya · '+fmt(S.marketStats.earned)+' değerinde satış</span>');
 var q=panelX("📦 Eşyalarını sat");
 var owned=gear.filter(function(it){return(S.inventory[it.id]||0)>0});
 if(!owned.length)line(q,'<div class="small">Satabileceğin eşya yok. Önce üretim yap.</div>');
 owned.forEach(function(it){
  var v=marketValue(it),r=line(q,'<div class="grow">'+it.ico+" <b>"+it.name+'</b><div class="small">Adet: '+S.inventory[it.id]+' · Tahmini değer: '+fmt(v)+' 🪙</div></div>');
  [["🪙 Sat","coin"],["🔴 Yakuta sat","ruby"],["💎 Elmasa sat","dia"]].forEach(function(x){
   var b=document.createElement("button");b.className="btn2";b.textContent=x[0];b.onclick=function(){sellItem(it,x[1])};r.appendChild(b);
  });
 });
 var n=panelX("⛏️ Malzeme pazarı");
 line(n,'<div class="small">Fazla malzemelerini oyun parasına dönüştürebilirsin.</div>');
 Object.keys(mats).forEach(function(k){
  var have=S.materials[k]||0;
  line(n,'<div class="grow">'+mats[k][0]+" "+mats[k][1]+": "+have+'</div>',"10 tanesini sat (+"+fmt(250)+" 🪙)",function(){
   if((S.materials[k]||0)<10)return toast("En az 10 adet gerekli");
   S.materials[k]-=10;S.coins+=250;S.marketStats.sold+=10;S.marketStats.earned+=250;save();show();toast("10 malzeme satıldı");
  });
 });
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
 var z=bonus(),power=18+z.atk+z.def+Math.floor(Math.random()*16);
 var ally=power+(n-1)*(14+Math.floor(Math.random()*12));
 var opp=n*(18+Math.floor(Math.random()*15))+(n-1)*(12+Math.floor(Math.random()*12));
 var win=ally>=opp,coins=win?1500*n:350*n;
 S.coins+=coins;S.total=(S.total||0)+coins;
 if(win){
  S.botStats.w++;var keys=Object.keys(mats);
  for(var i=0;i<3+n;i++)addMat(keys[Math.floor(Math.random()*keys.length)],1);
  if(Math.random()<.4)S.dia+=1;if(Math.random()<.25)S.ruby+=1;
 }else{S.botStats.l++;addMat("wood",1);addMat("leather",1)}
 save();show();
 var p=panelX("🏁 "+n+"v"+n+" sonucu");
 line(p,'<b>'+(win?"🏆 Zafer!":"Bu kez olmadı")+'</b>');
 line(p,"Senin takım gücü: "+ally+" · Rakip takım gücü: "+opp);
 line(p,"Ödül: "+fmt(coins)+" 🪙"+(win?" · Malzemeler eklendi":" · 1 odun + 1 deri"));
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