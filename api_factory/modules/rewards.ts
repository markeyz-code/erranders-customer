import { GATEWAY_ENDPOINT } from "../axios.config";

export const rewards_api = {
  getLeaderboard(type: 'points' | 'orders' | 'deliveries' = 'points') {
    return GATEWAY_ENDPOINT.get(`/rewards/leaderboard?type=${type}`);
  },
  getMyPoints() {
    return GATEWAY_ENDPOINT.get("/rewards/my-points");
  },
  getQuests() {
    return GATEWAY_ENDPOINT.get("/rewards/quests");
  },
  spinWheel(deviceId?: string) {
    return GATEWAY_ENDPOINT.post("/rewards/spin-the-wheel", { deviceId });
  },
  redeemPoints(points: number) {
    return GATEWAY_ENDPOINT.post("/rewards/redeem-wallet", { points });
  }
};
