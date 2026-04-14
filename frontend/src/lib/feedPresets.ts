const KEY = "headhunter_feed_presets";

export type FeedPreset = {
  id: string;
  name: string;
  city: string;
  q: string;
  payment: string;
};

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadFeedPresets(): FeedPreset[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is FeedPreset =>
        p &&
        typeof p === "object" &&
        typeof (p as FeedPreset).name === "string" &&
        typeof (p as FeedPreset).city === "string",
    );
  } catch {
    return [];
  }
}

export function saveFeedPreset(name: string, city: string, q: string, payment: string): FeedPreset[] {
  const list = loadFeedPresets();
  const next: FeedPreset = { id: uid(), name: name.trim() || "Без названия", city, q, payment };
  const merged = [...list, next];
  try {
    localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    /* ignore */
  }
  return merged;
}

export function removeFeedPreset(id: string): FeedPreset[] {
  const list = loadFeedPresets().filter((p) => p.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return list;
}
