import { SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "styled-components";
import { useTr } from "../../hooks/useTr";
import { mostAccessed } from "../../services";
import type { RequestsOverTime } from "../../types";
import { formatNumber } from "../../utils/helpers";
import ChartHeader from "./ChartHeader";
import { ChartCard } from "./RequestsOverTime";
import { getTooltipContentStyle, getTooltipItemStyle, getTooltipLabelStyle } from "./styles";

const colors = [
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#818cf8",
  "#f472b6",
  "#f59e0b",
  "#16a34a",
  "#3b82f6",
  "#6366f1",
];

const MostAccessed = () => {
  const translate = useTr();
  const theme = useTheme();
  const [filterBy, setFilterBy] = useState("week");
  const [apiRequestsOverTime, setApiRequestsOverTime] = useState<RequestsOverTime[]>([]);
  useEffect(() => {
    mostAccessed(filterBy).then((data) => {
      setApiRequestsOverTime(data);
    });
  }, [filterBy]);
  return (
    <ChartCard>
      <ChartHeader
        title={translate("chart.mostAccessed.title")}
        description={translate("chart.mostAccessed.description", {
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
        <PieChart>
          <Pie
            stroke="rgba(255, 255, 255, 0.2)"
            data={apiRequestsOverTime}
            dataKey="total"
            nameKey="name"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const RADIAN = Math.PI / 180;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {apiRequestsOverTime.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            separator=" "
            cursor={getTooltipItemStyle(theme)}
            formatter={(v: number, name: string) => [formatNumber(v), name]}
            itemStyle={getTooltipItemStyle(theme)}
            contentStyle={getTooltipContentStyle(theme)}
            labelStyle={getTooltipLabelStyle(theme)}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default MostAccessed;
