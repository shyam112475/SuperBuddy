import { Link } from 'react-router-dom';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { Button } from '../components/Button';
import { Card, CardImage, CardBody } from '../components/Card';
import { Badge } from '../components/Badge';
import { cn } from '../utils/cn';

/**
 * Activity data with enhanced descriptions for premium feel
 */
const activities = [
  {
    icon: '🥾',
    title: 'Outdoor & Hiking',
    description: 'Explore trails, parks, and mountain peaks with someone who shares your adventurous spirit.',
    color: 'emerald',
  },
  {
    icon: '✈️',
    title: 'Travel Companion',
    description: 'Navigate new cities and create unforgettable travel memories with a trusted travel partner.',
    color: 'blue',
  },
  {
    icon: '🎉',
    title: 'Events & Occasions',
    description: 'Find the perfect plus-one for weddings, parties, concerts, and special celebrations.',
    color: 'purple',
  },
  {
    icon: '☕',
    title: 'Social & Activities',
    description: 'Coffee dates, movie nights, games, and genuine conversations without the awkwardness.',
    color: 'amber',
  },
];

/**
 * Trust & safety features with premium language
 */
const trustFeatures = [
  {
    icon: '✓',
    title: 'Verified People',
    description:
      'Identity verification, profile reviews, and community ratings create a trustworthy environment.',
  },
  {
    icon: '🛡️',
    title: 'Safety First',
    description:
      'In-app reporting, blocking, emergency SOS alerts, and real-time safety support.',
  },
  {
    icon: '💬',
    title: 'Stay in Control',
    description:
      'Secure messaging, activity confirmation, and complete transparency before every meet.',
  },
];

/**
 * How it works steps
 */
const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'Browse verified companions and find people offering activities that match your interests.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Chat securely, discuss details, and agree on the perfect time and activity together.',
    icon: '💬',
  },
  {
    number: '03',
    title: 'Enjoy',
    description: 'Meet your companion and create genuine, memorable experiences together.',
    icon: '🎉',
  },
];

export function HomePage() {
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <div className="min-h-screen bg-neutral-0">
      {/* ========================================================================
          PREMIUM HERO SECTION
          ======================================================================== */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        {/* Background gradients */}
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              {/* Tagline Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" icon="✓">
                  Safe, verified companionship
                </Badge>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-neutral-900">
                  Find the perfect
                  <span className="block bg-gradient-brand bg-clip-text text-transparent">
                    companion
                  </span>
                  for your next adventure
                </h1>

                <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-lg">
                  Discover verified companions for hiking, travel, events, and genuine social experiences. 
                  Connect with real people who share your interests.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/partners">
                  <Button variant="primary" size="lg" className="sm:w-auto">
                    Discover Companions
                  </Button>
                </Link>

                <Link to="/partner/dashboard">
                  <Button variant="outline" size="lg" className="sm:w-auto">
                    Become a Companion
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-neutral-600">
                    Verified profiles
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    🛡️
                  </div>
                  <span className="text-sm font-medium text-neutral-600">
                    Safety tools
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    💬
                  </div>
                  <span className="text-sm font-medium text-neutral-600">
                    Secure chat
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Visual - Premium Companion Card */}
            <div className="relative hidden lg:block">
              {/* Main card */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl overflow-hidden">
                {/* Featured companion card */}
                <div className="rounded-2xl bg-gradient-subtle overflow-hidden">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-brand opacity-20 flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Header with name and status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          Featured Companion
                        </p>
                        <h3 className="text-2xl font-bold text-neutral-900 mt-1">
                          Priya Sharma
                        </h3>
                      </div>

                      <Badge variant="success" size="sm">
                        Available
                      </Badge>
                    </div>

                    {/* Location & Services */}
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600">
                        📍 Bhopal, India
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge size="sm">Hiking</Badge>
                        <Badge size="sm">Travel</Badge>
                        <Badge size="sm">Photography</Badge>
                      </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-neutral-200">
                      <div>
                        <p className="text-xs text-neutral-500">Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-lg">⭐</span>
                          <span className="font-bold text-neutral-900">4.9</span>
                          <span className="text-xs text-neutral-500">(24)</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-500">Rate</p>
                        <p className="font-bold text-neutral-900 mt-1">₹500/hr</p>
                      </div>
                    </div>

                    {/* About */}
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Adventure enthusiast and wildlife photographer. Love exploring new trails and sharing stories.
                    </p>

                    {/* CTA */}
                    <Button variant="primary" fullWidth>
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-8 -right-8 rounded-2xl bg-white border border-neutral-200 shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🛡️</div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      Safety built in
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Verified · Secure · Real people
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          ACTIVITIES/SERVICES SECTION - Image-first cards
          ======================================================================== */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-12">
            <div className="space-y-4">
              <Badge variant="primary">What You're Looking For</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900">
                Find companionship around your interests
              </h2>
              <p className="text-lg text-neutral-600 max-w-2xl">
                From outdoor adventures to social activities, discover someone who genuinely shares your passion.
              </p>
            </div>

            <Link to="/partners">
              <Button variant="ghost">
                Explore All →
              </Button>
            </Link>
          </div>

          {/* Activity cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <Link key={activity.title} to="/partners">
                <Card 
                  interactive 
                  className="h-full overflow-hidden hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Icon as background */}
                  <div className="h-32 bg-gradient-subtle flex items-center justify-center text-5xl relative overflow-hidden group">
                    <span className="transform group-hover:scale-110 transition-transform duration-300">
                      {activity.icon}
                    </span>
                  </div>

                  {/* Card content */}
                  <CardBody className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200">
                      <span className="text-sm font-semibold text-brand-600 inline-flex items-center gap-2">
                        Explore <span>→</span>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          HOW IT WORKS SECTION
          ======================================================================== */}
      <section className="relative py-20 sm:py-24 lg:py-28 bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <Badge variant="primary">Simple & Safe</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mt-4">
              How SuperBuddy Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mt-4">
              Finding your perfect companion is easy, safe, and transparent.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step number - large background */}
                <div className="absolute -top-8 -left-4 text-7xl font-bold text-neutral-100 -z-10">
                  {step.number}
                </div>

                {/* Step card */}
                <Card className="h-full">
                  <CardBody className="space-y-4">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-50 text-2xl">
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Connector line to next step (hidden on last) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-brand" />
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================
          TRUST & SAFETY SECTION
          ======================================================================== */}
      <section className="relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge variant="primary">Safety Comes First</Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mt-4">
                  Built for real connections, with safety at the center
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-neutral-600 leading-relaxed">
                  SuperBuddy is designed exclusively for legitimate social companionship and activity-based connections. We maintain strict community standards and don't facilitate any inappropriate services.
                </p>

                <p className="text-lg text-neutral-600 leading-relaxed">
                  Every profile is verified, every interaction is monitored, and every member has access to safety tools.
                </p>
              </div>

              <Link to="/partners">
                <Button variant="primary" size="lg">
                  Explore Safe Community →
                </Button>
              </Link>
            </div>

            {/* Trust features cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustFeatures.map((feature) => (
                <Card key={feature.title} className="bg-gradient-subtle border-0">
                  <CardBody className="space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          PREMIUM CTA SECTION
          ======================================================================== */}
      <section className="relative py-16 sm:py-20 bg-gradient-brand overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready for your next adventure?
              </h2>
              <p className="text-lg text-white/80">
                Join thousands of people discovering genuine companionship and real experiences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/partners" className="flex-1">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth 
                  className="bg-white text-brand-600 hover:bg-neutral-100"
                >
                  Find a Companion
                </Button>
              </Link>

              <Link to="/partner/dashboard" className="flex-1">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  fullWidth 
                  className="text-white border-white hover:bg-white/10"
                >
                  Become a Companion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          API STATUS (Dev visibility - can be removed in production)
          ======================================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gradient-subtle border-0">
          <CardBody className="text-sm">
            <span className="font-medium text-neutral-700">
              API Status:
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
              <span className="text-emerald-600">
                {data.data.status} — {data.message}
              </span>
            )}
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
