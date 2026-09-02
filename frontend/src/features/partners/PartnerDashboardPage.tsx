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

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-neutral-500">Loading…</div>;
  }

  if (hasNoProfileYet || !profile) {
    return <BecomePartnerForm />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <EditPartnerProfileSection profile={profile} />
      <ManageServicesSection profile={profile} />
      <ManageAvailabilitySection profile={profile} />
    </div>
  );
}
