export type GlobalUserDto = {
  id: string;
  email: string;
  email_verified_at: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  already_set_password: boolean;
  avatar: string | null;
  is_oauth: boolean;
  name: string;
  oauth_provider: string | null;
  title: string;
  human_readable_id: string;
};
export type GlobalMetadataDto = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  links: {
    prev: string | null;
    first: string | null;
    next: string | null;
    last: string | null;
  };
};
export type DonationsDto = {
  id: string;
  human_readable_id: string;
  title: string;
  recipient: string;
  description: string;
  thumbnail: string;
  program_image: string;
  current_donation: number;
  target: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
export type DonationHistoriesDto = {
  id: string;
  human_readable_id: string;
  name: string;
  program_name: string;
  donation_amount: number;
  payment: {
    method: string;
    status: string;
  };
  created_at: string;
  updated_at: string;
};
export type DetailDonationHistoryDto = {
  id: string;
  human_readable_id: string;
  name: string;
  email: string;
  program_name: string;
  donation_amount: number;
  target_amount: number;
  payment: {
    method: string;
    status: string;
  };
  created_at: string;
  updated_at: string;
};
export type DonationHistoryStatisticsDto = {
  total_donations: string;
  total_users: string;
  total_active_programs: string;
};
