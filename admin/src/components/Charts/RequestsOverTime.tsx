import { SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { styled, useTheme } from "styled-components";
import { useTr } from "../../hooks/useTr";
import { requestsOverTime } from "../../services";
import type { RequestsOverTime } from "../../types";
import { formatNumber } from "../../utils/helpers";
import ChartHeader from "./ChartHeader";
import {
  getAxisTickStyle,
  getTooltipContentStyle,
  getTooltipCursorStyle,
  getTooltipItemStyle,
  getTooltipLabelStyle,
} from "./styles";

export const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: 6px;
  width: 100%;
  min-height: 300px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    padding: 20px 20px 30px;
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: normal;
      gap: 10px;
    }
    .select {
      width: 100px;
      flex-shrink: 0;
      @media (max-width: 768px) {
        width: 100%;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 1px;
      .title {
        font-size: 18px;
        font-weight: bold;
      }
      .description {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.neutral500};
      }
    }
  }
`;

const RequestsOverTime = () => {
  const translate = useTr();
  const theme = useTheme();
  const [filterBy, setFilterBy] = useState("week");
  const [apiRequestsOverTime, setApiRequestsOverTime] = useState<RequestsOverTime[]>([]);
  useEffect(() => {
    requestsOverTime(filterBy).then((data) => {
      setApiRequestsOverTime(data.reverse());
    });
  }, [filterBy]);
  return (
    <ChartCard style={{ marginTop: "20px" }}>
      <ChartHeader
        title={translate("chart.apiRequestOverTime.title")}
        description={translate("chart.apiRequestOverTime.description", {
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
        <LineChart margin={{ top: 5, right: 20, left: 0, bottom: 5 }} data={apiRequestsOverTime}>
          <Line type="monotone" dataKey="total" stroke={theme.colors.primary600} />
          <XAxis tick={getAxisTickStyle(theme)} stroke={theme.colors.neutral300} name="Day" dataKey="name" />
          <YAxis stroke={theme.colors.neutral300} tick={getAxisTickStyle(theme)} />
          <Tooltip
            cursor={getTooltipCursorStyle(theme)}
            separator=" "
            formatter={(value: number) => [formatNumber(value), "Total Requests"]}
            itemStyle={getTooltipItemStyle(theme)}
            contentStyle={getTooltipContentStyle(theme)}
            labelStyle={getTooltipLabelStyle(theme)}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default RequestsOverTime;
