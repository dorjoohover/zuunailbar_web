export interface IUserService {
  id: string;
  service_id: string;
  user_id: string;
  service_name: string;
  user_name: string;
  updated_at?: Date;
  created_at?: Date;
}
