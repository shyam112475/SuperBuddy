import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addServiceFormSchema, type AddServiceFormValues } from './schemas';
import { useAddServiceOffering, useRemoveServiceOffering, useServiceCategories } from './hooks';
import type { PublicPartner } from './types';
import type { AxiosError } from 'axios';

export function ManageServicesSection({ profile }: { profile: PublicPartner }) {
  const { data: categories } = useServiceCategories();
  const { mutate: addOffering, isPending: isAdding, error: addError } = useAddServiceOffering();
  const { mutate: removeOffering, isPending: isRemoving } = useRemoveServiceOffering();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddServiceFormValues>({ resolver: zodResolver(addServiceFormSchema) });

  const offeredCategoryIds = new Set(profile.services.map((s) => s.category.id));
  const availableCategories = categories?.filter((c) => !offeredCategoryIds.has(c.id)) ?? [];
  const apiError = addError as AxiosError<{ message: string }> | null;

  function onSubmit(values: AddServiceFormValues) {
    addOffering(
      {
        serviceCategoryId: values.serviceCategoryId,
        description: values.description || undefined,
        pricePerHour: values.pricePerHour ? Number(values.pricePerHour) : undefined,
      },
      { onSuccess: () => reset() }
    );
  }

  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="text-lg font-semibold text-neutral-900">Activities you offer</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Pick from CompanionHub's approved activity list — you can't add a custom category here.
      </p>

      {profile.services.length > 0 && (
        <ul className="mt-4 space-y-2">
          {profile.services.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2"
            >
              <div>
                <span className="text-sm font-medium text-neutral-900">{s.category.name}</span>
                {s.pricePerHour && (
                  <span className="ml-2 text-xs text-neutral-500">₹{s.pricePerHour}/hr</span>
                )}
              </div>
              <button
                onClick={() => removeOffering(s.id)}
                disabled={isRemoving}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {availableCategories.length > 0 ? (
        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label className="block text-xs font-medium text-neutral-700">Activity</label>
            <select
              className="mt-1 rounded-md border border-neutral-300 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              {...register('serviceCategoryId')}
            >
              <option value="">Select…</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700">Price/hr (₹, optional)</label>
            <input
              type="number"
              min={1}
              className="mt-1 w-28 rounded-md border border-neutral-300 px-2 py-1.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              {...register('pricePerHour')}
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isAdding ? 'Adding…' : 'Add'}
          </button>
        </form>
      ) : (
        categories && <p className="mt-4 text-sm text-neutral-500">You offer every available activity.</p>
      )}

      {(errors.serviceCategoryId || errors.pricePerHour || apiError) && (
        <p className="mt-2 text-xs text-red-600">
          {errors.serviceCategoryId?.message ||
            errors.pricePerHour?.message ||
            apiError?.response?.data?.message}
        </p>
      )}
    </section>
  );
}
