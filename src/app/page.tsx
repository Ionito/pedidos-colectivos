"use client";

import { useEffect } from "react";
import "./landing.css";

export default function HomePage() {
  useEffect(() => {
    // nav shadow on scroll
    const nav = document.getElementById("nav");
    const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // FAQ: single-open accordion
    const faqs = Array.from(document.querySelectorAll(".faq-item"));
    const handlers = [];
    faqs.forEach((d) => {
      const h = () => {
        if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; });
      };
      d.addEventListener("toggle", h);
      handlers.push([d, h]);
    });

    // smooth anchor scroll with header offset
    const anchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" }); }
      }
    };
    document.addEventListener("click", anchorClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      handlers.forEach(([d, h]) => d.removeEventListener("toggle", h));
      document.removeEventListener("click", anchorClick);
    };
  }, []);

  return (
    <div className="pc-landing">
      {/* ============== NAV ============== */}
      <nav className="nav" id="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#top">
            <div className="brand-mark">PC</div>
            <div>
              <div className="brand-name">Pedidos Colectivos</div>
              <div className="brand-sub">Compras en grupo, sin caos</div>
            </div>
          </a>
          <div className="nav-links">
            <a className="lnk" href="#como">Cómo funciona</a>
            <a className="lnk" href="#roles">Roles</a>
            <a className="lnk" href="#features">Funcionalidades</a>
            <a className="lnk" href="#faq">Preguntas</a>
          </div>
          <div className="nav-cta">
            <a className="btn btn-ghost btn-sm" href="/sign-in">Ingresar</a>
            <a className="btn btn-teal btn-sm" href="/orders">Crear un pedido</a>
          </div>
        </div>
      </nav>
      
      <span id="top"></span>
      
      {/* ============== HERO ============== */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">🥜 Compras colectivas de barrio</span>
            <h1 style={{ marginTop: '16px' }}>Juntá el pedido del grupo <span className="hl hl-teal">en un solo lugar</span>.</h1>
            <p className="hero-lead">Alguien consigue un proveedor y todos quieren sumarse. En vez de cientos de mensajes volando por WhatsApp, creás el pedido, compartís el link y cada uno elige lo suyo. Vos ves el total listo para el proveedor.</p>
            <div className="hero-actions">
              <a className="btn btn-teal" href="/orders">Crear un pedido gratis →</a>
              <a className="btn btn-ghost" href="#como">Ver cómo funciona</a>
            </div>
            <div className="hero-trust">
              <span className="free-tag">✦ Gratis, siempre</span>
              <span className="trust-pill"><span className="dot"></span> Sin instalar nada</span>
              <span className="trust-pill"><span className="dot"></span> Entran con Google o Facebook</span>
            </div>
          </div>
      
          <div className="phone-stage">
            <div className="blob-amber"></div>
            <div className="float-chip fc-1"><span className="ic" style={{ background: 'var(--amber-tint)' }}>📋</span> Pegás la lista de productos</div>
            <div className="float-chip fc-2"><span className="ic" style={{ background: 'var(--teal-tint)' }}>⚡</span> En tiempo real</div>
            <div className="float-chip fc-3"><span className="ic" style={{ background: 'var(--green-tint)' }}>💰</span> Total para el proveedor</div>
            <div className="phone">
              <div className="phone-screen" id="heroScreen">
                <div className="phone-notch"></div>
                <div className="ps-status">
                  <span>9:41</span>
                  <span className="sig">●●●● <span style={{ fontWeight: '700' }}>PC</span> 🔋</span>
                </div>
                <div className="ps-head">
                  <div className="ps-back">‹</div>
                  <div className="ps-title">Frutos secos · Mayo</div>
                  <div className="ps-badge">Abierto</div>
                </div>
                <div className="ps-rolebanner">
                  <div className="av">👋</div>
                  <div>
                    <div className="rb-k">Vos organizás</div>
                    <div className="rb-v">Sos responsable de este pedido</div>
                  </div>
                </div>
                <div className="ps-tabs">
                  <div className="ps-tab on">Productos</div>
                  <div className="ps-tab">Pedidos · 8</div>
                  <div className="ps-tab">Totales</div>
                </div>
                <div className="ps-list">
                  <div className="ps-row">
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <div className="pn">Almendras tostadas</div>
                      <div className="pp">$3.500 / 250 g</div>
                    </div>
                    <div className="ps-step">
                      <div className="mb">−</div><div className="qn">2</div><div className="pl">+</div>
                    </div>
                  </div>
                  <div className="ps-row">
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <div className="pn">Nueces mariposa</div>
                      <div className="pp">$4.200 / 250 g</div>
                    </div>
                    <div className="ps-step">
                      <div className="mb">−</div><div className="qn">1</div><div className="pl">+</div>
                    </div>
                  </div>
                  <div className="ps-row">
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <div className="pn">Mix energético</div>
                      <div className="pp">$3.900 / 250 g</div>
                    </div>
                    <div className="ps-step">
                      <div className="mb">−</div><div className="qn">0</div><div className="pl">+</div>
                    </div>
                  </div>
                </div>
                <div className="ps-cartbar">
                  <div>
                    <div className="cl">Tu pedido · 3 productos</div>
                    <div className="cv">$11.200</div>
                  </div>
                  <div className="cgo">Ver resumen →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============== PROBLEMA -> SOLUCIÓN ============== */}
      <section className="band tight ps-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow amber">El problema de siempre</span>
            <h2 style={{ marginTop: '14px' }}>Sumarse a un pedido grupal no debería ser un dolor de cabeza.</h2>
            <p>Alguien comparte un proveedor en el grupo y enseguida son 20 personas pidiendo cosas distintas. Coordinar eso por chat es un caos.</p>
          </div>
          <div className="compare">
            <div className="compare-card bad">
              <span className="cc-tag bad">😵 Por WhatsApp</span>
              <div className="cc-line"><span className="x">✕</span> Mensajes volando, te perdés quién pidió qué</div>
              <div className="cc-line"><span className="x">✕</span> Copiás y pegás el listado de productos mil veces</div>
              <div className="cc-line"><span className="x">✕</span> Sumás todo a mano y siempre falta alguien</div>
              <div className="cc-line"><span className="x">✕</span> Calcular el envío de cada uno es un lío</div>
            </div>
            <div className="compare-arrow"><div className="circ">→</div></div>
            <div className="compare-card good">
              <span className="cc-tag good">✦ Con Pedidos Colectivos</span>
              <div className="cc-line"><span className="v">✓</span> Un solo link con todo el pedido ordenado</div>
              <div className="cc-line"><span className="v">✓</span> Cada uno elige sus cantidades, sin pisarse</div>
              <div className="cc-line"><span className="v">✓</span> El total para el proveedor se arma solo</div>
              <div className="cc-line"><span className="v">✓</span> El envío se reparte entre todos, automático</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============== CÓMO FUNCIONA ============== */}
      <section className="band" id="como">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Cómo funciona</span>
            <h2 style={{ marginTop: '14px' }}>De la idea al pedido, en tres pasos.</h2>
            <p>Sin instalar nada. Sin planillas. Funciona desde el celular.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Creás el pedido</h3>
              <p>Le ponés un título, una fecha de cierre y pegás tu lista de productos. La app la lee sola y arma todo.</p>
              <div className="paste"><span className="nm">Almendras tostadas</span> <span className="pr">250g $3500</span><br/><span className="nm">Nueces mariposa</span> <span className="pr">250g $4200</span><br/><span className="nm">Mix energético</span> <span className="pr">250g $3900</span></div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Compartís el link</h3>
              <p>Pegás el link en el grupo de WhatsApp. Los que se suman entran con su Google o Facebook y eligen al toque — sin crear una cuenta nueva.</p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--teal-tint)', borderRadius: '12px', padding: '12px 14px' }}>
                <span style={{ fontSize: '18px' }}>🔗</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--teal-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>pedidoscolectivos.app/p/frutos-secos</span>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Ves el total armado</h3>
              <p>En tiempo real ves quién pidió qué y cuánto. Cuando cerrás, tenés el total listo para pasarle al proveedor.</p>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-soft)' }}><span style={{ whiteSpace: 'nowrap' }}>Almendras · 14 u</span><span style={{ fontWeight: '700' }}>$49.000</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--ink-soft)' }}><span style={{ whiteSpace: 'nowrap' }}>Nueces · 9 u</span><span style={{ fontWeight: '700' }}>$37.800</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', background: 'var(--ink)', color: '#fff', borderRadius: '10px', padding: '9px 12px', marginTop: '3px' }}><span style={{ fontWeight: '700' }}>Total</span><span style={{ fontWeight: '800' }}>$86.800</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============== ROLES ============== */}
      <section className="band roles-band" id="roles">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow" style={{ color: 'var(--amber-600)' }}>Dos roles, una app</span>
            <h2 style={{ marginTop: '14px' }}>Siempre hay alguien que organiza<br/>y otros que se suman.</h2>
            <p>Dejamos clarísimo quién es quién. Así nadie se pierde y el responsable del pedido tiene el control.</p>
          </div>
          <div className="roles-grid">
            <div className="role-card org">
              <div className="role-ic">👋</div>
              <div className="role-k">El que organiza</div>
              <h3>Abrís y manejás el pedido</h3>
              <p className="role-sub">Conseguiste el proveedor. Vos sos el responsable: armás la lista y le pasás el total final.</p>
              <ul className="role-list">
                <li><span className="tick">✓</span> Cargás los productos pegando tu lista</li>
                <li><span className="tick">✓</span> Ponés fecha de cierre y costo de envío</li>
                <li><span className="tick">✓</span> Ves todos los pedidos y el total para el proveedor</li>
                <li><span className="tick">✓</span> Marcás lo que no hay stock y cerrás cuando querés</li>
              </ul>
            </div>
            <div className="role-card part">
              <div className="role-ic">🛒</div>
              <div className="role-k">El que se suma</div>
              <h3>Pedís lo tuyo y listo</h3>
              <p className="role-sub">Te llegó un link. Entrás, elegís tus cantidades y ves cuánto te toca pagar. Nada más.</p>
              <ul className="role-list">
                <li><span className="tick">✓</span> Entrás con tu Google o Facebook</li>
                <li><span className="tick">✓</span> Elegís cantidades con los botones + y −</li>
                <li><span className="tick">✓</span> Ves tu subtotal y tu parte del envío</li>
                <li><span className="tick">✓</span> Cambiás tu pedido hasta que cierre</li>
              </ul>
            </div>
          </div>
          <div className="role-note">
            <span className="em">🙌</span>
            <div>
              <div className="rn-t">¿Y si organizo pero también quiero pedir? Obvio que sí.</div>
              <div className="rn-d">El que organiza también es un participante más. Dentro del pedido vas a ver tu rol marcado con un color —<span className="twocol"><span className="mini-badge org">👋 Organizás</span></span> o <span className="twocol"><span className="mini-badge part">🛒 Te sumás</span></span>— así nunca hay confusión.</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============== FUNCIONALIDADES ============== */}
      <section className="band" id="features">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Todo lo que necesitás</span>
            <h2 style={{ marginTop: '14px' }}>Pensado para que coordinar sea fácil.</h2>
          </div>
          <div className="feat-grid">
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--amber-tint)' }}>📋</div>
              <h3>Carga rápida de productos</h3>
              <p>Pegás tu lista en texto libre y la app detecta nombre, precio y unidad sola. Vista previa al instante.</p>
            </div>
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--teal-tint)' }}>⚡</div>
              <h3>En tiempo real</h3>
              <p>Cuando alguien suma o cambia su pedido, todos lo ven al instante. Sin recargar ni preguntar.</p>
            </div>
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--teal-tint)' }}>👥</div>
              <h3>Resumen por persona</h3>
              <p>Quién se sumó, qué eligió y cuánto le toca. Copiás el resumen de cada uno con un toque.</p>
            </div>
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--green-tint)' }}>💰</div>
              <h3>Total para el proveedor</h3>
              <p>El consolidado de todos los productos, listo para pasar. Lo copiás y lo mandás como mensaje.</p>
            </div>
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--amber-tint)' }}>🚚</div>
              <h3>Envío repartido</h3>
              <p>Cargás el costo de envío y la app lo divide en partes iguales entre todos los que pidieron.</p>
            </div>
            <div className="feat">
              <div className="feat-ic" style={{ background: 'var(--bg-2)' }}>🔗</div>
              <h3>Un link para compartir</h3>
              <p>Todo el pedido vive en un link. Lo tirás al grupo y listo. Los que se suman no instalan nada.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ============== GRATIS ============== */}
      <section className="band tight">
        <div className="wrap">
          <div className="free-band">
            <h2>Es gratis. Y va a seguir siéndolo.</h2>
            <p>Nació para resolver el pedido de un barrio, no para cobrarte. Creás todos los pedidos que quieras, con la gente que quieras, sin límites.</p>
            <a className="btn btn-amber" href="/orders" style={{ background: '#fff', color: 'var(--teal-700)' }}>Crear mi primer pedido →</a>
          </div>
        </div>
      </section>
      
      {/* ============== FAQ ============== */}
      <section className="band" id="faq">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 style={{ marginTop: '14px' }}>Lo que todos preguntan.</h2>
          </div>
          <div className="faq-grid">
            <details className="faq-item" open>
              <summary className="faq-q">¿Es realmente gratis? <span className="pm">+</span></summary>
              <div className="faq-a">Sí. Crear pedidos, sumar gente y ver los totales no tiene costo. La app nació para resolver un problema de barrio, no para cobrarte.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">¿Tengo que instalar algo? <span className="pm">+</span></summary>
              <div className="faq-a">No. Funciona desde el navegador del celular o la compu. Más adelante vas a poder "instalarla" como app en tu teléfono si querés, pero no hace falta.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">Los que se suman, ¿necesitan crear una cuenta? <span className="pm">+</span></summary>
              <div className="faq-a">Entran con el link y eligen sus productos al toque. Solo se identifican con Google o Facebook para guardar su pedido — sin formularios ni contraseñas nuevas.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">Si yo organizo, ¿también puedo pedir? <span className="pm">+</span></summary>
              <div className="faq-a">Claro. El que organiza es un participante más: además de manejar el pedido <span className="mini-badge mb-amber">👋 Organizás</span>, podés elegir tus propias cantidades como cualquiera <span className="mini-badge mb-teal">🛒 Te sumás</span>. La app te muestra siempre tu rol.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">¿Cómo se reparte el costo del envío? <span className="pm">+</span></summary>
              <div className="faq-a">El organizador carga el costo total del envío y la app lo divide en partes iguales entre todos los que pidieron. Cada uno ve su parte sumada a su total.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">¿Qué pasa cuando se cierra el pedido? <span className="pm">+</span></summary>
              <div className="faq-a">Cuando el organizador lo cierra, ya no se pueden sumar más cambios. Queda el resumen final por persona y el total consolidado para pasarle al proveedor.</div>
            </details>
            <details className="faq-item">
              <summary className="faq-q">¿Cómo se cobra la plata de cada uno? <span className="pm">+</span></summary>
              <div className="faq-a">Eso lo arreglan entre ustedes como siempre (transferencia, efectivo, lo que usen). La app te da el número exacto de cuánto le toca a cada uno, así no hay vueltas.</div>
            </details>
          </div>
        </div>
      </section>
      
      {/* ============== CTA FINAL ============== */}
      <section className="band final-cta">
        <div className="wrap">
          <span className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Listo para arrancar</span>
          <h2 style={{ marginTop: '16px' }}>El próximo pedido del grupo, sin caos.</h2>
          <p>Creá tu primer pedido en menos de dos minutos.</p>
          <div className="final-actions">
            <a className="btn btn-teal" href="/orders">Crear un pedido gratis →</a>
            <a className="btn btn-ghost" href="/explorar">Ver un pedido de ejemplo</a>
          </div>
        </div>
      </section>
      
      <footer>
        <div className="wrap foot-inner">
          <a className="brand" href="#top">
            <div className="brand-mark">PC</div>
            <div>
              <div className="brand-name">Pedidos Colectivos</div>
              <div className="brand-sub">Compras en grupo, sin caos</div>
            </div>
          </a>
          <div className="foot-links">
            <a href="#como">Cómo funciona</a>
            <a href="#roles">Roles</a>
            <a href="#features">Funcionalidades</a>
            <a href="#faq">Preguntas</a>
            <a href="/orders">Entrar a la app</a>
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--muted)' }}>Hecho con 🧡 para coordinar mejor.</div>
        </div>
      </footer>
    </div>
  );
}
