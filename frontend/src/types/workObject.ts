/** Согласовано с backend/app/schemas/work_objects.py WorkObjectRead */

export type WorkObject = {
  id: string;
  company_user_id: string;
  title: string;
  address_or_region: string | null;
  description: string | null;
  work_type: string | null;
  start_date: string | null;
  duration_days: number | null;
  workers_needed: number;
  brigades_needed: number;
  required_skills_text: string | null;
  conditions_text: string | null;
  payment_format: string | null;
  payment_amount_note: string | null;
  urgency: string | null;
  contact_override: string | null;
  cover_image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  company_name: string | null;
  company_city: string | null;
};
