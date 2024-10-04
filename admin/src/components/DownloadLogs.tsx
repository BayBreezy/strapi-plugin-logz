import { Button, DatePicker, Dialog, Field, Tooltip, Typography } from "@strapi/design-system";
import { Download } from "@strapi/icons";
import { useNotification } from "@strapi/strapi/admin";
import dayjs from "dayjs";
import { useState } from "react";
import { useTr } from "../hooks/useTr";
import { downloadLogs } from "../services";

const DownloadLogs = () => {
  const translate = useTr();
  const { toggleNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().toDate());
  const [endDate, setEndDate] = useState(dayjs().add(1, "month").toDate());

  const handleDownload = async () => {
    try {
      await downloadLogs({ start: startDate, end: endDate });
      toggleNotification({
        type: "success",
        title: translate("success"),
        message: translate("success.download"),
      });
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("error.download"),
      });
    }
  };
  return (
    <>
      <Dialog.Root open={showModal} onOpenChange={() => setShowModal((s) => !s)}>
        <Dialog.Content>
          <Dialog.Header>Confirmation</Dialog.Header>
          <Dialog.Body style={{ alignItems: "normal" }}>
            <Typography tag="p" variant="delta" style={{ marginBottom: "12px" }}>
              Please select the date range for the download
            </Typography>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Field.Root hint={translate("startDate.hint")}>
                <Field.Label>{translate("startDate.label")}</Field.Label>
                <DatePicker value={startDate} onChange={(date: Date) => setStartDate(date)} />
                <Field.Error />
                <Field.Hint />
              </Field.Root>
              <Field.Root hint={translate("endDate.hint")}>
                <Field.Label>{translate("endDate.label")}</Field.Label>
                <DatePicker value={endDate} onChange={(date: Date) => setEndDate(date)} />
                <Field.Error />
                <Field.Hint />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button fullWidth variant="tertiary">
                {translate("cancel")}
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={handleDownload} startIcon={<Download />} fullWidth>
                {translate("download")}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <Tooltip label={translate("home.cta.tooltip")}>
        <Button onClick={() => setShowModal(true)} startIcon={<Download />}>
          {translate("home.cta")}
        </Button>
      </Tooltip>
    </>
  );
};

export default DownloadLogs;
