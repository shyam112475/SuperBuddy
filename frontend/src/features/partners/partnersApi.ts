import { apiClient } from '../../services/api';
import type { ApiSuccessResponse } from '../../types/api';
import type {
  AddServiceOfferingPayload,
  AvailabilitySlot,
  CreatePartnerProfilePayload,
  PartnerSearchFilters,
  PartnerSearchResult,
  PublicPartner,
  ServiceCategory,
  UpdatePartnerProfilePayload,
} from './types';

export const partnersApi = {
  async search(filters: PartnerSearchFilters) {
    const { data } = await apiClient.get<ApiSuccessResponse<PartnerSearchResult>>('/partners', {
      params: filters,
    });
    return data.data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<ApiSuccessResponse<{ profile: PublicPartner }>>(
      `/partners/${id}`
    );
    return data.data.profile;
  },

  async getCategories() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ categories: ServiceCategory[] }>>(
      '/partners/categories'
    );
    return data.data.categories;
  },

  async getMyProfile() {
    const { data } = await apiClient.get<ApiSuccessResponse<{ profile: PublicPartner }>>(
      '/partners/profile'
    );
    return data.data.profile;
  },

  async createProfile(payload: CreatePartnerProfilePayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ profile: PublicPartner }>>(
      '/partners/profile',
      payload
    );
    return data.data.profile;
  },

  async updateProfile(payload: UpdatePartnerProfilePayload) {
    const { data } = await apiClient.put<ApiSuccessResponse<{ profile: PublicPartner }>>(
      '/partners/profile',
      payload
    );
    return data.data.profile;
  },

  async addServiceOffering(payload: AddServiceOfferingPayload) {
    const { data } = await apiClient.post<ApiSuccessResponse<{ profile: PublicPartner }>>(
      '/partners/profile/services',
      payload
    );
    return data.data.profile;
  },

  async removeServiceOffering(offeringId: string) {
    const { data } = await apiClient.delete<ApiSuccessResponse<{ profile: PublicPartner }>>(
      `/partners/profile/services/${offeringId}`
    );
    return data.data.profile;
  },

  async setAvailability(slots: AvailabilitySlot[]) {
    const { data } = await apiClient.put<ApiSuccessResponse<{ profile: PublicPartner }>>(
      '/partners/profile/availability',
      { slots }
    );
    return data.data.profile;
  },
};
