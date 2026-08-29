import { mockBrands, mockAudits, mockOptimizationLogs, Brand, Audit, OptimizationLog } from '../mock-data';

// Simulate async DB operations

export const getBrands = async (): Promise<Brand[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockBrands), 300));
};

export const getBrandById = async (id: string): Promise<Brand | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBrands.find(b => b.id === id));
    }, 200);
  });
};

export const getAuditsForBrand = async (brandId: string): Promise<Audit[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAudits.filter(a => a.brandId === brandId));
    }, 300);
  });
};

export const getAuditById = async (id: string): Promise<Audit | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAudits.find(a => a.id === id));
    }, 200);
  });
};

export const createAudit = async (audit: Omit<Audit, 'id' | 'createdAt'>): Promise<Audit> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAudit: Audit = {
        ...audit,
        id: `a${mockAudits.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      mockAudits.push(newAudit);
      resolve(newAudit);
    }, 500);
  });
};

export const createOptimizationLog = async (log: Omit<OptimizationLog, 'id'>): Promise<OptimizationLog> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLog: OptimizationLog = {
        ...log,
        id: `o${mockOptimizationLogs.length + 1}`,
      };
      mockOptimizationLogs.push(newLog);
      resolve(newLog);
    }, 400);
  });
};
