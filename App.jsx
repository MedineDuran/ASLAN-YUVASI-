import React, { useEffect, useMemo, useRef, useState } from "react"; import { createRoot } from "react-dom/client"; import { Canvas, useFrame } from "@react-three/fiber"; import { OrbitControls } from "@react-three/drei"; import { Menu, Send, User, LogIn, LogOut, Play, Pause, MessageSquarePlus, X } from "lucide-react";

/**

ASLAN YUVASI – Güvenli ve lisans dostu tek-dosya prototip

Notlar (önemli hukuki ve teknik):

"Maçı anında izleme" alanı yalnızca LİSANSLI yayın sağlayıcılarına yönlendirme/yerleştirme için tasarlanmıştır.


Korsan yayın gömme / yönlendirme YOKTUR ve eklenmeyecektir.

Otomatik müzik çoğu tarayıcıda kullanıcı etkileşimi olmadan sesli çalmaz. Bu yüzden girişten sonra


bir "Sesi Aç" düğmesi sunuyoruz.

"CVV" gibi kart güvenlik kodu DEPOLANMAZ. Ödeme yapılacaksa PCI-DSS uyumlu ödeme sağlayıcısı kullanın.


Gmail/Telefon ile giriş, bu prototipte simüle edilmiştir (Firebase vb. ile gerçek kimlik doğrulama


eklemek için işaretlenmiş yerlere backend anahtarlarınızı girmeniz gerekir). */


export default function AslanYuvasiApp() { const [sidebarOpen, setSidebarOpen] = useState(false); const [authedUser, setAuthedUser] = useState(() => { const cached = localStorage.getItem("aslan:yuvasi:user"); return cached ? JSON.parse(cached) : null; }); const [welcomeRun, setWelcomeRun] = useState(false); const [anthemPlaying, setAnthemPlaying] = useState(false); const anthemRef = useRef(null); const roarRef = useRef(null);

useEffect(() => { if (authedUser) { setWelcomeRun(true); // Sessiz başlatmayı dene (tarayıcılar sessiz autoplay'e izin verir) try { anthemRef.current && anthemRef.current.play().catch(() => {}); } catch {} const t = setTimeout(() => setWelcomeRun(false), 4200); return () => clearTimeout(t); } }, [authedUser]);

const signInGoogle = () => { // TODO: Firebase Auth Google Sign-In ile değiştirin. const fake = { name: "Aslan Üye", method: "Google", id: String(Date.now()) }; localStorage.setItem("aslan:yuvasi:user", JSON.stringify(fake)); setAuthedUser(fake); }; const signInPhone = () => { // TODO: Firebase Auth Phone (reCAPTCHA) ile değiştirin. const fake = { name: "Telefon Üyesi", method: "Phone", id: String(Date.now()) }; localStorage.setItem("aslan:yuvasi:user", JSON.stringify(fake)); setAuthedUser(fake); }; const signOut = () => { localStorage.removeItem("aslan:yuvasi:user"); setAuthedUser(null); };

const toggleAnthem = async () => { if (!anthemRef.current) return; if (anthemPlaying) { await anthemRef.current.pause(); setAnthemPlaying(false); } else { try { await anthemRef.current.play(); setAnthemPlaying(true); } catch {} } };

return ( <div className="min-h-screen bg-neutral-950 text-neutral-100"> {/* Üst Şerit */} <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-neutral-950/70"> <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3"> <button className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition" onClick={() => setSidebarOpen(true)} aria-label="Yan paneli aç" > <Menu className="w-5 h-5" /> </button> <div className="flex items-center gap-2"> <span className="text-2xl">🦁</span> <h1 className="text-xl font-bold tracking-wide">ASLAN YUVASI</h1> </div> <div className="ml-auto flex items-center gap-2"> {authedUser ? ( <> <span className="text-sm text-white/70 hidden sm:block">Merhaba, {authedUser.name}</span> <button
onClick={toggleAnthem}
className="flex items-center gap-2 rounded-2xl px-3 py-2 bg-amber-600 hover:bg-amber-500 transition"
> {anthemPlaying ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} <span className="text-sm">Marşı {anthemPlaying ? "Duraklat" : "Çal"}</span> </button> <button
onClick={signOut}
className="flex items-center gap-2 rounded-2xl px-3 py-2 bg-white/10 hover:bg-white/20 transition"
> <LogOut className="w-4 h-4"/> <span className="text-sm">Çıkış</span> </button> </> ) : ( <div className="flex items-center gap-2"> <button onClick={signInGoogle} className="flex items-center gap-2 rounded-2xl px-3 py-2 bg-red-600 hover:bg-red-500 transition"> <LogIn className="w-4 h-4"/> <span className="text-sm">Google ile Giriş</span> </button> <button onClick={signInPhone} className="flex items-center gap-2 rounded-2xl px-3 py-2 bg-white/10 hover:bg-white/20 transition"> <User className="w-4 h-4"/> <span className="text-sm">Telefon ile Giriş</span> </button> </div> )} </div> </div> </header>

{/* Site Hakkında Bilgi */}
  <section className="max-w-7xl mx-auto px-4 py-6">
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-5 rounded-3xl bg-white/5 border border-white/10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-2">Hakkında</h2>
        <p className="text-white/80 leading-relaxed">
          ASLAN YUVASI, Galatasaray tutkunlarının buluşma noktasıdır. Canlı maçları YASAL ve LİSANSLI
          yayın sağlayıcıları üzerinden takip eder, stadyumu 3D keşfeder, oyuncuları yakından tanır ve toplulukla
          sohbet edersin. Korsan yayın yoktur. Kulübümüze ve emeğe saygı. 💛❤️
        </p>
      </div>
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="font-semibold mb-2">Hızlı Erişim</h3>
        <ul className="space-y-2 text-white/80">
          <li>• Canlı Maç – Lisanslı Kaynak</li>
          <li>• 3D Stadyum – Dolaş, keşfet</li>
          <li>• Oyuncu Galerisi – 3D</li>
          <li>• Topluluk – Sohbet & Paylaşım</li>
        </ul>
      </div>
    </div>
  </section>

  {/* Canlı Maç (Lisanslı Yayın Yerleştirme/Link) */}
  <section className="max-w-7xl mx-auto px-4 pb-6">
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5">
        <h2 className="text-lg font-semibold">Canlı Maç (Yasal Yayın)</h2>
        <a
          className="text-sm underline hover:no-underline text-white/80"
          href="#"
          onClick={(e) => { e.preventDefault(); alert("Buraya sadece lisanslı yayın sağlayıcısının resmi gömme kodu/linki eklenir."); }}
        >
          Yayını Aç
        </a>
      </div>
      <div className="aspect-video w-full bg-neutral-900 flex items-center justify-center text-white/60">
        <div className="text-center p-6">
          <p className="mb-2">Burada lisanslı yayın sağlayıcının embed iFrame'i olur.</p>
          <p className="text-xs">(Örn. Resmi yayıncıdan alınan <code>&lt;iframe&gt;</code> / DRM destekli oynatıcı)</p>
        </div>
      </div>
    </div>
  </section>

  {/* 3D Stadyum – Basit sahne */}
  <section className="max-w-7xl mx-auto px-4 pb-6">
    <h2 className="text-xl font-semibold mb-3">Ali Sami Yen Spor Kompleksi – 3D Keşif (Prototip)</h2>
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
      <div className="h-[420px]">
        <Canvas camera={{ position: [0, 6, 12], fov: 50 }}>
          <color attach="background" args={["#0a0a0a"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          {/* Zemin */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Basitleştirilmiş stadyum: eliptik halka + saha */}
          <Stadium />
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </div>
    </div>
  </section>

  {/* Oyuncular – 3D Ayakta Görüntü (Prototip kapsül modeller) */}
  <section className="max-w-7xl mx-auto px-4 pb-6">
    <h2 className="text-xl font-semibold mb-3">Oyuncular – 3D Ayakta (Prototip)</h2>
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="h-48 bg-black">
            <Canvas camera={{ position: [0, 1.2, 3], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 3, 2]} intensity={0.8} />
              <StandingFigure index={i} />
              <OrbitControls enablePan={false} enableZoom={false} enableRotate />
            </Canvas>
          </div>
          <div className="p-3 text-sm">
            <div className="font-semibold">Oyuncu #{i + 1}</div>
            <div className="text-white/70">Mevki: — | No: —</div>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Yorumlar (Alt Kısım) */}
  <section className="max-w-7xl mx-auto px-4 pb-24">
    <h2 className="text-xl font-semibold mb-3">Site Yorumları</h2>
    <Comments />
  </section>

  {/* Yan Panel – Sohbet / Profil / Paylaşım */}
  {sidebarOpen && (
    <Sidebar onClose={() => setSidebarOpen(false)} authedUser={authedUser} />
  )}

  {/* Hoş geldin animasyonu */}
  {welcomeRun && <WelcomeOverlay roarRef={roarRef} />}

  {/* Ses dosyaları: Girişte marş ve kükreme (uygun dosyaları public'e ekleyin) */}
  <audio ref={anthemRef} src="/assets/gs-anthem.mp3" preload="none" />
  <audio ref={roarRef} src="/assets/lion-roar.mp3" preload="auto" />

  {/* Alt sabit çubuk: hızlı giriş */}
  {!authedUser && (
    <div className="fixed bottom-4 inset-x-0 flex justify-center">
      <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center gap-2">
        <span className="hidden sm:block text-sm text-white/80">Topluluğa katıl:</span>
        <button onClick={signInGoogle} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-red-600 hover:bg-red-500 transition text-sm">
          <LogIn className="w-4 h-4"/> Google
        </button>
        <button onClick={signInPhone} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 transition text-sm">
          <User className="w-4 h-4"/> Telefon
        </button>
      </div>
    </div>
  )}
</div>

); }

/** Basitleştirilmiş stadyum / function Stadium() { return ( <group> {/ Saha /} <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}> <planeGeometry args={[20, 30]} /> <meshStandardMaterial color="#115522" /> </mesh> {/ Tribün halkaları /} <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}> <torusGeometry args={[16, 0.6, 16, 120]} /> <meshStandardMaterial color="#aa0000" metalness={0.1} roughness={0.6} /> </mesh> <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}> <torusGeometry args={[13.5, 0.6, 16, 120]} /> <meshStandardMaterial color="#d97706" metalness={0.1} roughness={0.6} /> </mesh> {/ Basit odalar/kulisler */} {[-6, 0, 6].map((x, i) => ( <mesh key={i} position={[x, 1, -10]}> <boxGeometry args={[4, 2, 4]} /> <meshStandardMaterial color="#333" /> </mesh> ))} </group> ); }

/** Basit ayakta duran figür / function StandingFigure({ index = 0 }) { const ref = useRef(); useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.6 + index) * 0.2; }); return ( <group ref={ref} position={[0, -1, 0]}> {/ Beden /} <mesh position={[0, 1, 0]}> <cylinderGeometry args={[0.35, 0.45, 1.6, 24]} /> <meshStandardMaterial color="#b91c1c" /> </mesh> {/ Kafa /} <mesh position={[0, 2, 0]}> <sphereGeometry args={[0.32, 24, 24]} /> <meshStandardMaterial color="#e5e5e5" /> </mesh> {/ Bacaklar */} <mesh position={[-0.15, 0.1, 0]}> <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} /> <meshStandardMaterial color="#d97706" /> </mesh> <mesh position={[0.15, 0.1, 0]}> <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} /> <meshStandardMaterial color="#d97706" /> </mesh> </group> ); }

/** Yorumlar / function Comments() { const [items, setItems] = useState(() => { const cached = localStorage.getItem("aslan:yuvasi:comments"); return cached ? JSON.parse(cached) : [ { id: 1, name: "UltrAslan", text: "Site efsane, emeğe saygı!", ts: Date.now() - 100060*60 }, ]; }); const [text, setText] = useState(""); const add = () => { if (!text.trim()) return; const next = [...items, { id: Date.now(), name: "Misafir", text, ts: Date.now() }]; setItems(next); localStorage.setItem("aslan:yuvasi:comments", JSON.stringify(next)); setText(""); }; return ( <div className="space-y-3"> <div className="flex gap-2"> <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Yorum yaz..." className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-amber-600" /> <button onClick={add} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 transition flex items-center gap-2"> <Send className="w-4 h-4"/> Gönder </button> </div> <ul className="space-y-2"> {items.slice().reverse().map((c) => ( <li key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/10"> <div className="text-sm text-white/70">{new Date(c.ts).toLocaleString()}</div> <div className="font-semibold">{c.name}</div> <div>{c.text}</div> </li> ))} </ul> </div> ); }

/** Yan panel */ function Sidebar({ onClose, authedUser }) { const [chat, setChat] = useState(() => { const cached = localStorage.getItem("aslan:yuvasi:chat"); return cached ? JSON.parse(cached) : [ { id: 1, from: "Sistem", text: "Sohbete hoş geldin! Saygı ve fair play unutulmaz." }, ]; }); const [msg, setMsg] = useState(""); const [tab, setTab] = useState("chat"); const [profile, setProfile] = useState(() => { const cached = localStorage.getItem("aslan:yuvasi:profile"); return cached ? JSON.parse(cached) : { nick: authedUser?.name || "Misafir", bio: "Forza Cimbom!" }; }); const [post, setPost] = useState("");

useEffect(() => { localStorage.setItem("aslan:yuvasi:profile", JSON.stringify(profile)); }, [profile]);

const send = () => { if (!msg.trim()) return; const next = [...chat, { id: Date.now(), from: profile.nick, text: msg }]; setChat(next); localStorage.setItem("aslan:yuvasi:chat", JSON.stringify(next)); setMsg(""); };

const share = () => { if (!post.trim()) return; alert("Paylaşım yayınlandı (prototip). Moderasyon ve kurallar geçerlidir."); setPost(""); };

return ( <div className="fixed inset-0 z-50"> <div className="absolute inset-0 bg-black/60" onClick={onClose} /> <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-900 border-l border-white/10 p-4 overflow-y-auto"> <div className="flex items-center justify-between mb-4"> <h3 className="text-lg font-semibold">Topluluk Paneli</h3> <button onClick={onClose} className="p-2 rounded-xl bg-white/5"><X className="w-4 h-4"/></button> </div> <div className="flex gap-2 mb-4"> {[ { id: "chat", label: "Sohbet" }, { id: "profile", label: "Profil" }, { id: "share", label: "Paylaş" }, ].map(t => ( <button key={t.id} onClick={()=>setTab(t.id)} className={px-3 py-2 rounded-xl border ${tab===t.id?"bg-amber-600 border-amber-500":"bg-white/5 border-white/10"}}>{t.label}</button> ))} </div>

{tab === "chat" && (
      <div>
        <div className="space-y-2 mb-3">
          {chat.slice(-50).map(m => (
            <div key={m.id} className="p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/70">{m.from}</div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Mesaj yaz..." className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10" />
          <button onClick={send} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 transition"><Send className="w-4 h-4"/></button>
        </div>
      </div>
    )}

    {tab === "profile" && (
      <div className="space-y-3">
        <div>
          <label className="text-sm text-white/70">Kullanıcı Adı</label>
          <input value={profile.nick} onChange={(e)=>setProfile(p=>({...p, nick: e.target.value}))} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" />
        </div>
        <div>
          <label className="text-sm text-white/70">Biyografi</label>
          <textarea value={profile.bio} onChange={(e)=>setProfile(p=>({...p, bio: e.target.value}))} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" rows={4} />
        </div>
        <div className="text-xs text-white/60">
          Güvenlik: Kredi kartı bilgisi, CVV veya kişisel hassas veri paylaşmayın. Topluluk kurallarına uyun.
        </div>
      </div>
    )}

    {tab === "share" && (
      <div className="space-y-3">
        <textarea value={post} onChange={(e)=>setPost(e.target.value)} placeholder="Paylaşımını yaz..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10" rows={5} />
        <button onClick={share} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 transition flex items-center gap-2"><MessageSquarePlus className="w-4 h-4"/> Paylaş</button>
      </div>
    )}
  </div>
</div>

); }

/** Giriş anı – Koşan aslan ve yazı */ function WelcomeOverlay({ roarRef }) { useEffect(() => { try { roarRef?.current?.currentTime = 0; roarRef?.current?.play().catch(()=>{}); } catch {} }, [roarRef]); return ( <div className="fixed inset-0 z-[60] pointer-events-none"> <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent flex items-start justify-center pt-24"> <div className="text-center"> <div className="text-3xl md:text-5xl font-extrabold tracking-wide">YUVAYA HOŞ GELDİN ASLAN</div> <div className="mt-2 text-white/80">Stadyumun önünde dizilen oyuncular arasından 🦁 sahneye çıkıyor!</div> </div> </div> <div className="absolute bottom-10 left-[-20%] animate-lion-run text-7xl select-none">🦁</div> <style>{@keyframes lionRun { 0% { transform: translateX(0) scale(1); filter: drop-shadow(0 0 0 rgba(255,176,0,0)); } 60% { transform: translateX(120vw) scale(1.05); filter: drop-shadow(0 0 24px rgba(255,176,0,0.5)); } 100% { transform: translateX(140vw) scale(1.05); opacity: 0; } } .animate-lion-run { animation: lionRun 3.8s ease-in forwards; }}</style> </div> ); }

// ———————————————————————————————————————————— // Mount l // const root = createRoot(document.getElementById("root")); // root.render(<AslanYuvasiApp />);

