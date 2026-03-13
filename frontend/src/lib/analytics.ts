declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}

export type AnalyticsGoal =
  | 'order_form_opened'
  | 'order_submitted'
  | 'phone_clicked'
  | 'cta_hero_click';

export function reachGoal(goal: AnalyticsGoal): void {
  const id = Number(import.meta.env.VITE_YANDEX_METRIKA_ID);
  if (typeof window.ym === 'function' && id) {
    window.ym(id, 'reachGoal', goal);
  }
}

export function scrollToOrderForm(): void {
  const el = document.getElementById('order-form');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
