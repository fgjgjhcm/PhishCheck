export type RiskLevel = "Low" | "Medium" | "High";

export type AnalyzeResponse = {
  risk_level: RiskLevel;
  confidence_score: number;
  red_flags: string[];
  detected_indicators: string[];
  suspicious_links: string[];
  sender_signals: string[];
  analysis_method: "LLM" | "Heuristic+LLM";
  explanation: string;
  recommendation: string;
};
