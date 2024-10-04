import { type DefaultTheme } from "styled-components";

export const getTooltipContentStyle = (theme: DefaultTheme) => ({
  borderRadius: "6px",
  padding: "10px 12px",
  border: `1px solid ${theme.colors.neutral150}`,
  background: theme.colors.neutral0,
});

export const getTooltipLabelStyle = (theme: DefaultTheme) => ({
  color: theme.colors.neutral900,
  fontWeight: theme.fontWeights.semiBold,
  fontSize: "14px",
});

export const getTooltipItemStyle = (theme: DefaultTheme) => ({
  color: theme.colors.neutral500,
  fontSize: "13px",
});

export const getTooltipCursorStyle = (theme: DefaultTheme) => ({ stroke: theme.colors.neutral200 });

export const getAxisTickStyle = (theme: DefaultTheme) => ({
  stroke: theme.colors.neutral500,
  strokeWidth: 0.4,
});
