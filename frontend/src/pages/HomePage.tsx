import { Link } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck';

const activities = [
  {
    icon: '🥾',
    title: 'Outdoor & Hiking',
    description: 'Find someone to explore trails, parks, and outdoor experiences with.',
  },
  {
    icon: '✈️',
    title: 'Travel Companion',
    description: 'Have a companion for trips, sightseeing, or exploring a new city.',
  },
  {
    icon: '🎉',
    title: 'Events & Occasions',
    description: 'Find a plus-one for events, social gatherings, and special occasions.',
  },
  {
    icon: '☕',
    title: 'Social & Activities',
    description: 'Coffee, games, conversations, movies, and everyday activities.',
  },
];

const features = [
  {
    icon: '✓',
    title: 'Verified people',
    description:
      'Profiles are reviewed and identity verification helps keep the community trustworthy.',
  },
  {
    icon: '🛡',
    title: 'Safety first',
    description:
      'Built-in reporting, blocking, SOS alerts, and emergency contact support.',
  },
  {
    icon: '💬',
    title: 'Stay in control',
    description:
      'Chat, discuss the activity, and agree on the details before meeting.',
  },
];

export function HomePage() {
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-8 py-24">
          <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-16">

            {/* Hero content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Safe, verified companionship
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-neutral-950">
                Find the right
                <span className="text-brand-600"> companion </span>
                for whatever's next.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                Hiking partners, travel companions, event plus-ones, or simply
                someone to spend time with. Discover verified people for
                genuine, non-sexual activities and social experiences.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  to="/partners"
                  className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md"
                >
                  Find a companion
                </Link>

                <Link
                  to="/partner/dashboard"
                  className="rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Become a companion
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
                    ✓
                  </span>
                  Verified profiles
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">
                    🛡
                  </span>
                  Safety tools
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-xs">
                    💬
                  </span>
                  Secure chat
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-5 shadow-xl">

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Popular activity
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-neutral-900">
                        Weekend Hiking
                      </h3>
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl">
                      👩
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">
                        Ananya Sharma
                      </p>

                      <p className="mt-0.5 text-xs text-neutral-500">
                        Hiking · Bhopal
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs">
                        <span className="text-amber-500">★</span>
                        <span className="font-semibold text-neutral-700">
                          4.9
                        </span>
                        <span className="text-neutral-400">
                          · 24 reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
                      <p className="text-[11px] text-neutral-400">
                        Starting from
                      </p>
                      <p className="mt-0.5 font-semibold text-neutral-900">
                        ₹500/hr
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
                      <p className="text-[11px] text-neutral-400">
                        Verification
                      </p>
                      <p className="mt-0.5 font-semibold text-green-600">
                        Verified ✓
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white"
                  >
                    View companion
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                    🛡
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-800">
                      Safety built into every experience
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                      Reporting · Blocking · SOS support
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-8 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">
                      Verified community
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Meet with confidence
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="mx-auto max-w-6xl px-8 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">
              WHAT ARE YOU LOOKING FOR?
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
              Find companionship around your interests
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
              From outdoor adventures to everyday social activities, find
              someone who actually wants to do the same things.
            </p>
          </div>

          <Link
            to="/partners"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Explore all companions →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-5">
          {activities.map((activity) => (
            <Link
              key={activity.title}
              to="/partners"
              className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50 text-2xl transition group-hover:bg-brand-50">
                {activity.icon}
              </div>

              <h3 className="mt-5 font-semibold text-neutral-900">
                {activity.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {activity.description}
              </p>

              <span className="mt-4 inline-block text-xs font-semibold text-brand-600">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-8 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold text-brand-600">
              SIMPLE & SAFE
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              How SuperBuddy works
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">
              Finding someone to share an experience with shouldn't be
              complicated.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Discover',
                text: 'Browse verified companions and find people offering activities that match your plans.',
              },
              {
                number: '02',
                title: 'Request',
                text: 'Choose an activity, select your preferred details, and send a booking request.',
              },
              {
                number: '03',
                title: 'Meet & enjoy',
                text: 'Chat beforehand, confirm the details, and enjoy your activity together.',
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold text-brand-100">
                  {step.number}
                </span>

                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="mx-auto max-w-6xl px-8 py-20">
        <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-16">

          <div>
            <p className="text-sm font-semibold text-brand-600">
              SAFETY COMES FIRST
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight">
              Built for real-world connections, with safety at the center.
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-500">
              SuperBuddy is designed around legitimate social and activity
              based companionship. We don't facilitate sexual services or
              solicitation.
            </p>

            <Link
              to="/partners"
              className="mt-7 inline-flex rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Explore the community
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  {feature.icon}
                </div>

                <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-900">
        <div className="mx-auto max-w-6xl px-8 py-16">
          <div className="flex items-center justify-between gap-10">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Got plans? Find someone to share them with.
              </h2>

              <p className="mt-3 text-sm text-neutral-400">
                Discover companions for activities, events, travel and more.
              </p>
            </div>

            <Link
              to="/partners"
              className="shrink-0 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Find a companion
            </Link>
          </div>
        </div>
      </section>

      {/* API status — dev visibility */}
      <section className="mx-auto max-w-6xl px-8 py-8">
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 text-sm">
          <span className="font-medium text-neutral-700">
            API status:
          </span>{' '}

          {isLoading && (
            <span className="text-neutral-500">
              Checking…
            </span>
          )}

          {isError && (
            <span className="text-red-600">
              Unreachable (
              {error instanceof Error
                ? error.message
                : 'unknown error'}
              )
            </span>
          )}

          {data && (
            <span className="text-green-600">
              {data.data.status} — {data.message}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}