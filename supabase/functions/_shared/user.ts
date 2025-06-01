export interface UserResponse {
  id: string;
  email_addresses: {
    email_address: string;
    id: string;
    verification: {
      status: string;
      strategy: string;
    };
  }[];
  first_name: string;
  last_name: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
  primary_email_address_id: string;
  external_accounts: any[];
  public_metadata: Record<string, any>;
  private_metadata: Record<string, any>;
}

export interface UserError {
  error: string;
  message: string;
}

export type UserResult = UserResponse | UserError;
