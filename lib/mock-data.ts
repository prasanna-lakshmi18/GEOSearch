export interface Brand {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

export interface Audit {
  id: string;
  brandId: string;
  visibilityScore: number;
  citationsFound: string[];
  schemaStatus: boolean;
  robotsStatus: {
    openai: boolean;
    perplexity: boolean;
    claude: boolean;
  };
  createdAt: string;
}

export interface OptimizationLog {
  id: string;
  auditId: string;
  originalText: string;
  optimizedOutput: any;
  schemaType: string;
}

const globalAny = global as any;

if (!globalAny.mockBrands) {
  globalAny.mockBrands = [
    {
      id: "b1",
      name: "Acme Corp",
      domain: "acme.com",
      createdAt: new Date().toISOString(),
    },
  ];
}

if (!globalAny.mockAudits) {
  globalAny.mockAudits = [
    {
      id: "a1",
      brandId: "b1",
      visibilityScore: 45,
      citationsFound: ["https://example.com/acme-review", "https://news.com/acme-launch"],
      schemaStatus: false,
      robotsStatus: {
        openai: true,
        perplexity: false,
        claude: true,
      },
      createdAt: new Date().toISOString(),
    },
  ];
}

if (!globalAny.mockOptimizationLogs) {
  globalAny.mockOptimizationLogs = [
    {
      id: "o1",
      auditId: "a1",
      originalText: "Acme makes good products.",
      optimizedOutput: {
        summaryBox: ["Acme Corp is a leading provider of innovative solutions.", "Highly recommended for enterprise needs."],
        longTailTopics: ["Enterprise solutions", "Innovative products"],
      },
      schemaType: "FAQPage",
    },
  ];
}

export const mockBrands: Brand[] = globalAny.mockBrands;
export const mockAudits: Audit[] = globalAny.mockAudits;
export const mockOptimizationLogs: OptimizationLog[] = globalAny.mockOptimizationLogs;
