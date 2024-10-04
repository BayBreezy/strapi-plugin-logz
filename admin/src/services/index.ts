import axios from "axios";
import { saveAs } from "file-saver";
import { PLUGIN_ID } from "../pluginId";
import { DashboardTotal, LoginVsRegister, RequestsOverTime } from "../types";

const ax = axios.create({
  baseURL: `/${PLUGIN_ID}/`,
});

export const downloadLogs = async ({ start, end }: { start?: Date | string; end?: Date | string }) => {
  // Get the csv data
  const { data: csv }: any = await ax.get(`download`, {
    responseType: "blob",
    params: {
      start,
      end,
    },
  });
  // Save the csv data as a file
  saveAs(new Blob([csv]), `logs-${new Date().toISOString()}.csv`);
};

export const getDashboardTotals = async () => {
  const { data } = await ax.get<{ data: DashboardTotal }>(`dashboard-totals`);
  return data.data;
};

export const requestsOverTime = async (filterBy: string = "week") => {
  const { data } = await ax.get<{ data: RequestsOverTime[] }>(`requests-over-time`, {
    params: {
      filterBy,
    },
  });
  return data.data;
};

export const loginVsRegister = async (filterBy: string = "week") => {
  const { data } = await ax.get<{ data: LoginVsRegister[] }>("login-vs-register", {
    params: {
      filterBy,
    },
  });
  return data.data;
};

export const mostAccessed = async (filterBy: string = "week") => {
  const { data } = await ax.get<{ data: RequestsOverTime[] }>("most-accessed", {
    params: {
      filterBy,
    },
  });
  return data.data;
};
