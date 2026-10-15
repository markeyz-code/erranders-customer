import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const orders_api = {
  getOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/mine');
  },

  getAllOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders');
  },
  
  getOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/orders/${id}`);
  },

  createOrder: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/orders', payload);
  },

  updateOrderStatus: (id: string, status: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/status`, { status });
  },

  cancelOrder: (id: string, reason: string = 'User cancelled') => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/cancel`, { reason });
  },

  trackOrder: (orderNumber: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/track/guest', { params: { orderNumber, email } });
  },

  cancelTrackedOrder: (orderNumber: string, email: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/orders/track/cancel', { orderNumber, email });
  },

  getErrandrOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/available');
  },

  assignOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/accept`);
  },

  getBatchStatus: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/batch/status');
  },

  rateOrder: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${id}/rate`, payload);
  },
  submitFeedback: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/feedback`, payload);
  },
  reorder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${id}/reorder`);
  },

  getOrderChat: (orderId: string, userA?: string, userB?: string) => {
    let url = `/chat/order/${orderId}`;
    if (userA && userB) {
      url += `?userA=${userA}&userB=${userB}`;
    }
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url);
  },

  getCustomErrandSettings: () => {
    return GATEWAY_ENDPOINT.get('/settings/errands/custom');
  },

  getOpenPools: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/pool/open');
  },

  createPool: (orderId: string, payload: { title: string, maxParticipants?: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${orderId}/pool/create`, payload);
  },

  joinPool: (orderId: string, poolId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/orders/${orderId}/pool/${poolId}/join`);
  },

  updateErrandFee: (orderId: string, newFee: number) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${orderId}/custom/fee`, { newFee });
  },

  acceptBid: (orderId: string, bidId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${orderId}/custom/bid/${bidId}/accept`);
  },

  counterBid: (orderId: string, bidId: string, amount: number, role: 'student' | 'errander' = 'student') => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${orderId}/custom/bid/${bidId}/counter`, { amount, role });
  },

  rejectBid: (orderId: string, bidId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${orderId}/custom/bid/${bidId}/reject`);
  },

  approveReconciliation: (orderId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/orders/${orderId}/reconcile/approve`);
  },

  // Recurring Orders
  createRecurringOrder: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/recurring-orders', payload);
  },
  getRecurringOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/recurring-orders');
  },
  updateRecurringOrder: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/recurring-orders/${id}`, payload);
  },
  cancelRecurringOrder: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/recurring-orders/${id}/cancel`);
  },
};
