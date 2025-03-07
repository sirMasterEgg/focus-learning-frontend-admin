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
};
export type GlobalMetadataDto = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url?: string;
  prev_page_url?: string;
  path: string;
  from: number;
  to: number;
};
