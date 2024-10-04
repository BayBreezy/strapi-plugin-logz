export interface DashboardTotal {
  totalRequests: number;
  totalLoginRequests: number;
  totalRegisterRequests: number;
  totalErrorRequests: number;
}

export interface DashboardStat {
  value: number;
  description: string;
  icon: string;
}

export interface RequestsOverTime {
  name: string;
  total: number;
}

export interface LoginVsRegister {
  name: string;
  login: number;
  register: number;
}
