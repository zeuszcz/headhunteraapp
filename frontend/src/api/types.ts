export type JobApplication = {
  id: string;
  company_name: string;
  role_title: string;
  status: string;
  notes: string | null;
  applied_at: string;
  created_at: string;
  updated_at: string;
};

export type JobApplicationCreate = {
  company_name: string;
  role_title: string;
  status?: string;
  notes?: string | null;
};
