import { SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTheme } from "styled-components";
import { useTr } from "../../hooks/useTr";
import { loginVsRegister } from "../../services";
import type { LoginVsRegister } from "../../types";
import ChartHeader from "./ChartHeader";
import { ChartCard } from "./RequestsOverTime";
import {
  getAxisTickStyle,
  getTooltipContentStyle,
  getTooltipItemStyle,
  getTooltipLabelStyle,
} from "./styles";

const LoginVsRegister = () => {
  const translate = useTr();
  const theme = useTheme();
  const [filterBy, setFilterBy] = useState("week");
  const [apiRequestsOverTime, setApiRequestsOverTime] = useState<LoginVsRegister[]>([]);
  useEffect(() => {
    loginVsRegister(filterBy).then((data) => {
      setApiRequestsOverTime(data.reverse());
    });
  }, [filterBy]);
  return (
    <ChartCard>
      <ChartHeader
        title={translate("chart.loginVsRegister.title")}
        description={translate("chart.loginVsRegister.description", {
          period: filterBy == "week" ? "7 days" : "7 months",
        })}
        SelectComponent={() => (
          <SingleSelect value={filterBy} onChange={(e: string) => setFilterBy(e)}>
            <SingleSelectOption value="week">{translate("week")}</SingleSelectOption>
            <SingleSelectOption value="month">{translate("month")}</SingleSelectOption>
          </SingleSelect>
        )}
      />
      <ResponsiveContainer minHeight="300px">
        <BarChart data={apiRequestsOverTime}>
          <Bar radius={[4, 4, 0, 0]} dataKey="login" fill="#0ea5e9" />
          <Bar radius={[4, 4, 0, 0]} dataKey="register" fill="#eab308" />
          <XAxis tick={getAxisTickStyle(theme)} stroke={theme.colors.neutral300} name="Day" dataKey="name" />
          <Tooltip
            cursor={{ fill: "rgba(109, 109, 109, 0.1)" }}
            separator=" "
            formatter={(value: number) => [value, "Total Requests"]}
            itemStyle={getTooltipItemStyle(theme)}
            contentStyle={getTooltipContentStyle(theme)}
            labelStyle={getTooltipLabelStyle(theme)}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LoginVsRegister;
