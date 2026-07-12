import { BusFront, ChartLine, Route, ShieldCheck } from 'lucide-react'

const highlights = [
  {
    icon: Route,
    title: 'Route Intelligence',
    description: 'Monitor routes, ETAs, and dispatch updates from one control center.',
  },
  {
    icon: ChartLine,
    title: 'Fleet Performance',
    description: 'Track on-time delivery, fuel usage, and operational KPIs in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Secure',
    description: 'Role-based access, audit visibility, and secure team collaboration.',
  },
]

export default function AuthLayout({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 8% 10%, rgba(37,99,235,0.12) 0%, transparent 38%), radial-gradient(circle at 90% 90%, rgba(16,185,129,0.12) 0%, transparent 35%)',
        }}
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 sm:px-8 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-white/60 bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-9 text-white shadow-2xl shadow-blue-950/20 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <BusFront className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">TransitOps</p>
              <p className="text-xs text-blue-100">Smart Transport Operations Platform</p>
            </div>
          </div>

          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Centralize dispatch, fleet insights, and operations.
          </h1>

          <div className="mt-10 space-y-6">
            {highlights.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-xl bg-white/20 p-2">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="mt-1 text-sm text-blue-100">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="w-full">{children}</section>
      </div>
    </main>
  )
}
