import { Icon } from "@iconify/react";
import { Grid } from "@strapi/design-system";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useTr } from "../hooks/useTr";
import { getDashboardTotals } from "../services";
import { DashboardStat } from "../types";
import { formatNumber } from "../utils/helpers";

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: 6px;
  width: 100%;
  padding: 20px;
  transition: box-shadow 0.3s ease;

  .title {
    font-size: 36px;
    font-weight: bold;
  }

  .description {
    font-size: 15px;
    text-transform: capitalize;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.neutral500};
  }

  .icon {
    margin-bottom: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
    width: 52px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.neutral150};
    svg {
      font-size: 28px;
      color: ${({ theme }) => theme.colors.neutral700};
    }
  }
`;

const CardStats = () => {
  const translate = useTr();
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([]);
  useEffect(() => {
    getDashboardTotals().then((data) => {
      setDashboardStats(() => [
        {
          value: data.totalRequests,
          description: translate("stats.totalApiCalls"),
          icon: "solar:plug-circle-line-duotone",
        },
        {
          value: data.totalLoginRequests,
          description: translate("stats.totalLoginRequests"),
          icon: "solar:login-3-line-duotone",
        },
        {
          value: data.totalRegisterRequests,
          description: translate("stats.totalRegisterRequests"),
          icon: "solar:user-id-line-duotone",
        },
        {
          value: data.totalErrorRequests,
          description: translate("stats.totalErrorRequests"),
          icon: "solar:close-circle-line-duotone",
        },
      ]);
    });
  }, []);
  return (
    <Grid.Root gap={5}>
      {dashboardStats.map((d, idx) => (
        <Grid.Item key={idx} xs={12} m={6} col={3}>
          <StatCard>
            <div className="icon">
              <Icon icon={d.icon} />
            </div>
            <p className="description">{d.description}</p>
            <h3 className="title">{formatNumber(d.value)}</h3>
          </StatCard>
        </Grid.Item>
      ))}
    </Grid.Root>
  );
};

export default CardStats;
