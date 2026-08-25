import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addServiceFormSchema,
  type AddServiceFormValues,
} from './schemas';

import {
  useAddServiceOffering,
  useRemoveServiceOffering,
  useServiceCategories,
} from './hooks';

import type { PublicPartner } from './types';
import type { AxiosError } from 'axios';

export function ManageServicesSection({
  profile,
}: {
  profile: PublicPartner;
}) {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useServiceCategories();

  const {
    mutate: addOffering,
    isPending: isAdding,
    error: addError,
  } = useAddServiceOffering();

  const {
    mutate: removeOffering,
    isPending: isRemoving,
  } = useRemoveServiceOffering();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddServiceFormValues>({
    resolver: zodResolver(addServiceFormSchema),

    defaultValues: {
      serviceCategoryId: '',
      pricePerHour: '',
      description: '',
    },
  });

  /*
   * IDs of activities already added to this profile.
   *
   * These activities should not appear again in
   * the "Add an activity" dropdown.
   */
  const offeredCategoryIds = new Set(
    profile.services.map(
      (service) => service.category.id,
    ),
  );

  /*
   * Only show categories which:
   * 1. Came from backend
   * 2. Are not already added
   */
  const availableCategories =
    categories?.filter(
      (category) =>
        !offeredCategoryIds.has(category.id),
    ) ?? [];

  const apiError =
    addError as AxiosError<{ message: string }> | null;

  function onSubmit(values: AddServiceFormValues) {
    /*
     * IMPORTANT:
     *
     * pricePerHour stays STRING inside React Hook Form
     * because the Zod schema expects a string.
     *
     * We convert it to NUMBER only when sending
     * the API request.
     */
    const price =
      values.pricePerHour !== undefined &&
      values.pricePerHour !== null &&
      values.pricePerHour !== ''
        ? Number(values.pricePerHour)
        : undefined;

    addOffering(
      {
        serviceCategoryId: values.serviceCategoryId,

        description:
          values.description?.trim() || undefined,

        pricePerHour: price,
      },
      {
        onSuccess: () => {
          reset({
            serviceCategoryId: '',
            pricePerHour: '',
            description: '',
          });
        },
      },
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* ========================================================= */}
      {/* CURRENT ACTIVITIES */}
      {/* ========================================================= */}

      {profile.services.length > 0 ? (
        <section className="w-full min-w-0">
          <div className="mb-4 flex w-full min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-neutral-900">
                Your activities
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500">
                Manage the activities you offer and their hourly pricing.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              {profile.services.length}{' '}
              {profile.services.length === 1
                ? 'activity'
                : 'activities'}
            </span>
          </div>

          <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2">
            {profile.services.map((service) => {
              const hasPrice =
                service.pricePerHour !== null &&
                service.pricePerHour !== undefined;

              return (
                <div
                  key={service.id}
                  className="flex min-w-0 w-full items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-sm"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3l2.2 4.45L19 8.15l-3.5 3.4.83 4.8L12 14.1l-4.33 2.25.83-4.8L5 8.15l4.8-.7L12 3z"
                        />
                      </svg>
                    </div>

                    {/* Information */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {service.category.name}
                      </p>

                      {service.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                          {service.description}
                        </p>
                      )}

                      {hasPrice ? (
                        <p className="mt-1 text-sm font-semibold text-brand-700">
                          ₹
                          {Number(
                            service.pricePerHour,
                          ).toLocaleString('en-IN')}

                          <span className="ml-1 text-xs font-normal text-neutral-500">
                            / hour
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-amber-600">
                          Price not specified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeOffering(service.id)
                    }
                    disabled={isRemoving}
                    className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRemoving
                      ? 'Removing…'
                      : 'Remove'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          </div>

          <h3 className="mt-3 text-sm font-semibold text-neutral-900">
            No activities added yet
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-neutral-500">
            Add an activity and set your hourly price
            so users know what they can book you for.
          </p>
        </section>
      )}

      {/* Divider */}
      <div className="my-6 border-t border-neutral-100" />

      {/* ========================================================= */}
      {/* LOADING */}
      {/* ========================================================= */}

      {isCategoriesLoading && (
        <div className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-center gap-3">
            <svg
              className="h-4 w-4 animate-spin text-brand-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />

              <path
                d="M21 12a9 9 0 00-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <p className="text-sm text-neutral-500">
              Loading available activities…
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY API ERROR */}
      {/* ========================================================= */}

      {!isCategoriesLoading &&
        isCategoriesError && (
          <div className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">
              Unable to load activities
            </p>

            <p className="mt-1 text-xs text-red-600">
              Please refresh the page and try again.
            </p>
          </div>
        )}

      {/* ========================================================= */}
      {/* ADD ACTIVITY */}
      {/* ========================================================= */}

      {!isCategoriesLoading &&
        !isCategoriesError &&
        availableCategories.length > 0 && (
          <section className="w-full min-w-0">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">
                Add an activity
              </h3>

              <p className="mt-0.5 text-xs text-neutral-500">
                Select an activity and set the hourly price
                users will see.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-4"
            >
              <div className="grid w-full gap-4 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-end">
                {/* ================================================= */}
                {/* ACTIVITY */}
                {/* ================================================= */}

                <div className="min-w-0">
                  <label
                    htmlFor="serviceCategoryId"
                    className="block text-xs font-semibold text-neutral-700"
                  >
                    Activity
                  </label>

                  <select
                    id="serviceCategoryId"
                    {...register('serviceCategoryId')}
                    className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="">
                      Select an activity
                    </option>

                    {availableCategories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      ),
                    )}
                  </select>

                  {errors.serviceCategoryId && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {
                        errors.serviceCategoryId
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* ================================================= */}
                {/* PRICE */}
                {/* ================================================= */}

                <div className="min-w-0">
                  <label
                    htmlFor="pricePerHour"
                    className="block text-xs font-semibold text-neutral-700"
                  >
                    Price per hour
                  </label>

                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                      ₹
                    </span>

                    <input
                      id="pricePerHour"
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      placeholder="e.g. 500"
                      {...register('pricePerHour')}
                      className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-7 pr-3 text-sm text-neutral-800 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>

                  {errors.pricePerHour && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.pricePerHour.message}
                    </p>
                  )}
                </div>

                {/* ================================================= */}
                {/* ADD BUTTON */}
                {/* ================================================= */}

                <button
                  type="submit"
                  disabled={isAdding}
                  className="inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdding && (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-30"
                      />

                      <path
                        d="M21 12a9 9 0 00-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {isAdding
                    ? 'Adding…'
                    : 'Add activity'}
                </button>
              </div>

              {/* API ERROR */}
              {apiError && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  {apiError.response?.data?.message ||
                    'Unable to add this activity. Please try again.'}
                </div>
              )}
            </form>
          </section>
        )}

      {/* ========================================================= */}
      {/* ALL ACTIVITIES ALREADY ADDED */}
      {/* ========================================================= */}

      {!isCategoriesLoading &&
        !isCategoriesError &&
        categories &&
        categories.length > 0 &&
        availableCategories.length === 0 && (
          <div className="flex w-full items-center gap-3 rounded-xl bg-green-50 px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold text-green-800">
                All activities added
              </p>

              <p className="mt-0.5 text-xs text-green-700">
                You've selected every available activity.
              </p>
            </div>
          </div>
        )}

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <div className="mt-5 flex w-full items-start gap-2 text-xs leading-5 text-neutral-400">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-3a1 1 0 10-2 0v.1a1 1 0 102 0V7zm-2 3a1 1 0 000 2h.01a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>

        <p>
          Set a price for each activity. This hourly rate
          will be used when users choose and book that
          activity.
        </p>
      </div>
    </div>
  );
}