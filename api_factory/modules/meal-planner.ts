import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const meal_planner_api = {
  generatePlan: (params: { budget: number; mealsPerDay: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/meal-planner', { params });
  },
  generateIterations: (payload: { budget?: number; dailyBudget?: number; bufferAmount?: number; mealsPerDay?: number; vendors?: string[]; dislikes?: string[]; medicalConditions?: string[]; allowCustomErrands?: boolean; includeDrinks?: boolean; count?: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/meal-planner/iterations', payload, { timeout: 35000 });
  },
  getMealItems: (params?: { vendors?: string[] }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/meal-planner/items', { params });
  }
};
