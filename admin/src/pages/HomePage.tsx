import { Layouts, Page } from "@strapi/admin/strapi-admin";
import { Divider, Grid } from "@strapi/design-system";
import { StrapiTheme } from "@strapi/design-system/dist/themes";
import CardStats from "../components/CardStats";
import LoginVsRegister from "../components/Charts/LoginVsRegister";
import MostAccessed from "../components/Charts/MostAccessed";
import RequestsOverTime from "../components/Charts/RequestsOverTime";
import DownloadLogs from "../components/DownloadLogs";
import { useTr } from "../hooks/useTr";

declare module "styled-components" {
  export interface DefaultTheme extends StrapiTheme {}
}

const HomePage = () => {
  const translate = useTr();

  return (
    <Page.Main>
      <Page.Title>{translate("name")}</Page.Title>
      <Layouts.Header
        id="title"
        title={translate("title")}
        subtitle={translate("description")}
        primaryAction={<DownloadLogs />}
      />

      <Layouts.Content>
        <Divider style={{ margin: "10px auto 30px" }} />
        <CardStats />
        <RequestsOverTime />
        <Grid.Root gap={5} style={{ margin: "30px auto" }}>
          <Grid.Item xs={12} m={6}>
            <LoginVsRegister />
          </Grid.Item>
          <Grid.Item xs={12} m={6}>
            <MostAccessed />
          </Grid.Item>
        </Grid.Root>
      </Layouts.Content>
    </Page.Main>
  );
};

export { HomePage };
