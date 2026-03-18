import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { reachGoal } from '../lib/analytics';
import type { OrderInput } from '@shared/schemas/order.schema';

interface SubmitOrderResponse {
  success: true;
  message: string;
}

export function useSubmitOrder() {
  return useMutation({
    mutationFn: (data: OrderInput) =>
      api.post<SubmitOrderResponse>('/orders', data),
    retry: 1,
    onSuccess: () => {
      reachGoal('order_submitted');
    },
  });
}
