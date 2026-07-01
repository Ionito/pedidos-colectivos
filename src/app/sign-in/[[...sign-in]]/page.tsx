import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white relative overflow-hidden"
            style={{ background: 'var(--teal)', fontFamily: 'var(--pc-font-display)', fontSize: '20px', fontWeight: 800, boxShadow: 'var(--sh)' }}
          >
            PC
            <span className="absolute right-[-6px] bottom-[-6px] w-5 h-5 rounded-md" style={{ background: 'var(--amber)' }} />
          </div>
          <div>
            <p className="font-bold" style={{ fontFamily: 'var(--pc-font-display)', fontSize: '18px', color: 'var(--ink)' }}>Pedidos Colectivos</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>Compras en grupo, sin caos</p>
          </div>
        </div>
        <SignIn fallbackRedirectUrl="/explorar" />
      </div>
    </div>
  );
}
