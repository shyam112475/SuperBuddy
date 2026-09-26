import { Link } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck';

export function HomePage() {
  const { data, isLoading, isError, error } = useHealthCheck();
  return <div className="ch-bottom-space">
    <section className="relative overflow-hidden bg-[#11101a] text-white">
      <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute -bottom-36 -right-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 backdrop-blur"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Real people · real activities</div>
          <h1 className="max-w-2xl text-[42px] font-black leading-[.98] tracking-[-.055em] sm:text-6xl">Find your people for whatever's <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">next.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Discover verified Buddy's for travel, hikes, events, conversations and everyday experiences — built around safe, meaningful connections.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/partners" className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-extrabold text-neutral-900 shadow-xl shadow-black/20 hover:bg-neutral-100">Explore companions</Link>
            <Link to="/register" className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 text-sm font-extrabold text-white backdrop-blur hover:bg-white/15">Create your profile</Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative mx-auto max-w-[380px] rotate-2 rounded-[32px] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[25px] bg-white p-5 text-neutral-900">
              <div className="flex items-center justify-between"><span className="text-xs font-bold text-neutral-400">NEAR YOU</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">VERIFIED</span></div>
              <div className="mt-5 flex items-center gap-4"><div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400"/><div><p className="font-extrabold">Your next companion</p><p className="text-sm text-neutral-500">Travel · Food · Outdoors</p></div></div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-neutral-50 p-3"><b>4.9</b><span className="block text-neutral-400">rating</span></div><div className="rounded-xl bg-neutral-50 p-3"><b>24</b><span className="block text-neutral-400">reviews</span></div><div className="rounded-xl bg-neutral-50 p-3"><b>12</b><span className="block text-neutral-400">trips</span></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-4 sm:grid-cols-3">
        {[['01','Discover','Browse people by interests, location and activities.'],['02','Connect','Choose someone who fits your vibe and plan together.'],['03','Experience','Enjoy the activity with safety and clear expectations.']].map(([n,t,d]) => <div key={n} className="rounded-[22px] border border-neutral-200 bg-white p-5 shadow-[0_8px_28px_rgba(20,20,40,.05)]"><span className="text-xs font-black text-brand-600">{n}</span><h2 className="mt-3 text-lg font-extrabold">{t}</h2><p className="mt-1.5 text-sm leading-6 text-neutral-500">{d}</p></div>)}
      </div>
      <div className="mt-5 rounded-[22px] border border-neutral-200 bg-white p-4 text-sm shadow-[0_8px_28px_rgba(20,20,40,.04)] sm:p-5">
        <div className="flex items-center justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-wider text-neutral-400">System status</span><div className="mt-1 font-semibold">CompanionHub services</div></div><div className="text-right text-sm">{isLoading && <span className="text-neutral-500">Checking…</span>}{isError && <span className="text-red-500">Offline</span>}{data && <span className="font-semibold text-emerald-600">● {data.data.status}</span>}</div></div>
        {isError && <p className="mt-2 text-xs text-neutral-400">{error instanceof Error ? error.message : 'Service is currently unreachable.'}</p>}
      </div>
    </section>
  </div>;
}
