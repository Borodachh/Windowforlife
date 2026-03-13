export interface CalculationInput {
  constructionType: string;
  width: number;
  height: number;
  profileSystem: string;
  sashCount: number;
  sashTypes: string[];
}

export interface CalculationResult {
  estimatedPrice: number | null; // null = расчёт не реализован
  breakdown: Record<string, number>;
  disclaimer: string;
}

export function calculatePrice(input: CalculationInput): CalculationResult {
  // TODO: реализовать логику расчёта
  void input;
  return {
    estimatedPrice: null,
    breakdown: {},
    disclaimer: 'Точную стоимость рассчитает менеджер после замера',
  };
}
