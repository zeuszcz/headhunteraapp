/** Согласовано с backend/app/schemas/profiles.py (Read) */

export type CompanyProfile = {
  user_id: string;
  company_name: string;
  description: string | null;
  city: string | null;
  regions_text: string | null;
  project_types: string | null;
  years_on_market: number | null;
  contact_person: string | null;
  phone: string | null;
  messengers_text: string | null;
  email_public: string | null;
  cooperation_terms: string | null;
  avg_budget_note: string | null;
  payment_methods_text: string | null;
  media_note: string | null;
  avatar_url: string | null;
  rating_avg: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
};

export type WorkerProfile = {
  user_id: string;
  full_name: string;
  profession: string | null;
  specialization: string | null;
  experience_years: number | null;
  skills_text: string | null;
  city: string | null;
  willing_to_travel: boolean;
  desired_rate_note: string | null;
  work_format: string | null;
  bio: string | null;
  documents_note: string | null;
  portfolio_note: string | null;
  avatar_url: string | null;
  rating_avg: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
};

export type BrigadeProfile = {
  user_id: string;
  name: string;
  leader_name: string | null;
  headcount: number;
  roles_composition_text: string | null;
  specialization: string | null;
  past_objects_note: string | null;
  regions_text: string | null;
  has_tools: boolean;
  has_transport: boolean;
  avg_price_note: string | null;
  availability_note: string | null;
  bio: string | null;
  portfolio_note: string | null;
  avatar_url: string | null;
  rating_avg: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function parseCompanyProfile(raw: Record<string, unknown>): CompanyProfile {
  return {
    user_id: str(raw.user_id),
    company_name: str(raw.company_name) || "Компания",
    description: raw.description != null ? String(raw.description) : null,
    city: raw.city != null ? String(raw.city) : null,
    regions_text: raw.regions_text != null ? String(raw.regions_text) : null,
    project_types: raw.project_types != null ? String(raw.project_types) : null,
    years_on_market: num(raw.years_on_market),
    contact_person: raw.contact_person != null ? String(raw.contact_person) : null,
    phone: raw.phone != null ? String(raw.phone) : null,
    messengers_text: raw.messengers_text != null ? String(raw.messengers_text) : null,
    email_public: raw.email_public != null ? String(raw.email_public) : null,
    cooperation_terms: raw.cooperation_terms != null ? String(raw.cooperation_terms) : null,
    avg_budget_note: raw.avg_budget_note != null ? String(raw.avg_budget_note) : null,
    payment_methods_text: raw.payment_methods_text != null ? String(raw.payment_methods_text) : null,
    media_note: raw.media_note != null ? String(raw.media_note) : null,
    avatar_url: raw.avatar_url != null && String(raw.avatar_url).trim() ? String(raw.avatar_url) : null,
    rating_avg: Number(raw.rating_avg) || 0,
    reviews_count: Number(raw.reviews_count) || 0,
    created_at: str(raw.created_at),
    updated_at: str(raw.updated_at),
  };
}

export function parseWorkerProfile(raw: Record<string, unknown>): WorkerProfile {
  return {
    user_id: str(raw.user_id),
    full_name: str(raw.full_name) || "Специалист",
    profession: raw.profession != null ? String(raw.profession) : null,
    specialization: raw.specialization != null ? String(raw.specialization) : null,
    experience_years: num(raw.experience_years),
    skills_text: raw.skills_text != null ? String(raw.skills_text) : null,
    city: raw.city != null ? String(raw.city) : null,
    willing_to_travel: bool(raw.willing_to_travel, true),
    desired_rate_note: raw.desired_rate_note != null ? String(raw.desired_rate_note) : null,
    work_format: raw.work_format != null ? String(raw.work_format) : null,
    bio: raw.bio != null ? String(raw.bio) : null,
    documents_note: raw.documents_note != null ? String(raw.documents_note) : null,
    portfolio_note: raw.portfolio_note != null ? String(raw.portfolio_note) : null,
    avatar_url: raw.avatar_url != null && String(raw.avatar_url).trim() ? String(raw.avatar_url) : null,
    rating_avg: Number(raw.rating_avg) || 0,
    reviews_count: Number(raw.reviews_count) || 0,
    created_at: str(raw.created_at),
    updated_at: str(raw.updated_at),
  };
}

export function parseBrigadeProfile(raw: Record<string, unknown>): BrigadeProfile {
  return {
    user_id: str(raw.user_id),
    name: str(raw.name) || "Бригада",
    leader_name: raw.leader_name != null ? String(raw.leader_name) : null,
    headcount: Math.max(1, Number(raw.headcount) || 1),
    roles_composition_text: raw.roles_composition_text != null ? String(raw.roles_composition_text) : null,
    specialization: raw.specialization != null ? String(raw.specialization) : null,
    past_objects_note: raw.past_objects_note != null ? String(raw.past_objects_note) : null,
    regions_text: raw.regions_text != null ? String(raw.regions_text) : null,
    has_tools: bool(raw.has_tools, false),
    has_transport: bool(raw.has_transport, false),
    avg_price_note: raw.avg_price_note != null ? String(raw.avg_price_note) : null,
    availability_note: raw.availability_note != null ? String(raw.availability_note) : null,
    bio: raw.bio != null ? String(raw.bio) : null,
    portfolio_note: raw.portfolio_note != null ? String(raw.portfolio_note) : null,
    avatar_url: raw.avatar_url != null && String(raw.avatar_url).trim() ? String(raw.avatar_url) : null,
    rating_avg: Number(raw.rating_avg) || 0,
    reviews_count: Number(raw.reviews_count) || 0,
    created_at: str(raw.created_at),
    updated_at: str(raw.updated_at),
  };
}
