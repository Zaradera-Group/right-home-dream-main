export type RightAIRole = "assistant" | "user";

export type RightAIMessage = {
  role: RightAIRole;
  content: string;
};

export type RightAIChartType = "area" | "bar" | "line" | "pie";

export type RightAIChartPoint = {
  label: string;
  value: number;
};

export type RightAIChart = {
  shouldRender: boolean;
  title: string;
  description: string;
  chartType: RightAIChartType;
  yAxisLabel: string;
  data: RightAIChartPoint[];
};

export type RightAIRequestBody = {
  prompt?: string;
  messages?: RightAIMessage[];
};
