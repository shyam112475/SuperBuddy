import type { AxiosError } from 'axios';
import { useMyPartnerProfile } from './hooks';
import { BecomePartnerForm } from './BecomePartnerForm';
import { EditPartnerProfileSection } from './EditPartnerProfileSection';
import { ManageServicesSection } from './ManageServicesSection';
import { ManageAvailabilitySection } from './ManageAvailabilitySection';

export function PartnerDashboardPage() {
  const { data: profile, isLoading, error } = useMyPartnerProfile();

  const apiError = error as AxiosError | null;
  const hasNoProfileYet = apiError?.response?.status === 404;

  /* ----------------------------------------
     Loading
  ---------------------------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 rounded-lg bg-neutral-200" />
            <div className="h-4 w-80 rounded bg-neutral-200" />

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="h-5 w-40 rounded bg-neutral-200" />
                <div className="h-10 w-full rounded-lg bg-neutral-100" />
                <div className="h-28 w-full rounded-lg bg-neutral-100" />
                <div className="h-10 w-40 rounded-lg bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------
     No Partner Profile
  ---------------------------------------- */
  if (hasNoProfileYet || !profile) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Hero */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-8 text-white shadow-lg sm:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                Become a Companion
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn your free time into meaningful connections.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-brand-100 sm:text-base">
                Create your companion profile, choose the activities you enjoy,
                and let people discover and book time with you.
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Benefit
                icon="✓"
                title="Get verified"
                description="Build trust with users"
              />

              <Benefit
                icon="⌁"
                title="Choose activities"
                description="Offer what you enjoy"
              />

              <Benefit
                icon="₹"
                title="Set your pricing"
                description="Control your rates"
              />
            </div>
          </div>

          {/* Become Partner Form */}
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
            <BecomePartnerForm />
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------
     Partner Profile
  ---------------------------------------- */
  const isVerified =
    profile.partner.verificationStatus === 'VERIFIED';

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================
            Dashboard Header
        ====================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
              Companion Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Manage your profile
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              Keep your profile, activities, pricing and availability up to
              date.
            </p>
          </div>

          {/* Verification Status */}
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isVerified
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isVerified ? 'bg-green-500' : 'bg-amber-500'
              }`}
            />

            {isVerified
              ? 'Profile verified'
              : 'Verification pending'}
          </div>
        </div>

        {/* =====================================
            Verification Notice
        ====================================== */}
        {!isVerified && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Your profile is waiting for verification
              </p>

              <p className="mt-0.5 text-xs leading-5 text-amber-700">
                You can continue setting up your profile, activities,
                pricing and availability. Your profile will become
                publicly visible after an admin verifies it.
              </p>
            </div>
          </div>
        )}

        {/* =====================================
            Profile Information
        ====================================== */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <SectionIcon type="profile" />

              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Profile information
                </h2>

                <p className="text-xs text-neutral-500">
                  Tell people who you are and what kind of company you offer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <EditPartnerProfileSection profile={profile} />
          </div>
        </div>

        {/* =====================================
            Activities & Pricing
        ====================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <SectionIcon type="services" />

              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Activities & pricing
                </h2>

                <p className="text-xs text-neutral-500">
                  Choose the activities people can book you for and set
                  your hourly pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* IMPORTANT:
                Pricing + activities are handled here.
            */}
            <ManageServicesSection profile={profile} />
          </div>
        </div>

        {/* =====================================
            Availability
        ====================================== */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand-50 to-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <SectionIcon type="calendar" />

              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Weekly availability
                </h2>

                <p className="text-xs text-neutral-500">
                  Let people know when you're generally available.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <ManageAvailabilitySection profile={profile} />
          </div>
        </div>

        {/* =====================================
            Bottom Safety Note
        ====================================== */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />

                <path
                  strokeLinecap="round"
                  d="M12 10v6M12 7h.01"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-900">
                Keep your profile authentic
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                SuperBuddy is for genuine, non-sexual companionship
                and activities. Accurate information helps users find
                the right companion and builds trust on the platform.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================
   Benefit Component
========================================= */

function Benefit({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-sm font-bold">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-0.5 text-xs text-brand-100">
        {description}
      </p>
    </div>
  );
}

/* =========================================
   Section Icon
========================================= */

function SectionIcon({
  type,
}: {
  type: 'profile' | 'services' | 'calendar';
}) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600">

      {/* Profile */}
      {type === 'profile' && (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.5" />

          <path
            strokeLinecap="round"
            d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"
          />
        </svg>
      )}

      {/* Services / Pricing */}
      {type === 'services' && (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3l2.7 5.5L21 9.4l-4.5 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.4l6.3-.9L12 3z"
          />
        </svg>
      )}

      {/* Calendar */}
      {type === 'calendar' && (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15"
            rx="2"
          />

          <path
            strokeLinecap="round"
            d="M8 3v4M16 3v4M3.5 10h17"
          />
        </svg>
      )}
    </div>
  );
}