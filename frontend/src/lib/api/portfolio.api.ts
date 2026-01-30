import { PortfolioResponse } from "@/types/portfolio.types";
import { apiClient } from "./api-client";

export const portfolioApi = {
  // We specify the return type so your components know exactly what 'res.data' looks like
  getPortfolio: () => apiClient.get<PortfolioResponse>("/api/portfolio"),
};