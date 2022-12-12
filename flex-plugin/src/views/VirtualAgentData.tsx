import { withTaskContext } from "@twilio/flex-ui";
import { DataTable } from "../components/DataTable";
import React from "react";
import { Alert, Box, Text } from "@twilio-paste/core";
import { useI18n } from "react-simple-i18n";

export type VirtualAgentViewProps = {
  task: any;
};

function getKVPs(data: any) {
  let returnData: any = {};
  Object.entries(data).map(([k, v]) => {
    if (typeof v === "string" && typeof k === "string") {
      if (k === "From" || k === "To") return;
      returnData[k] = v;
    }
  });
  return returnData;
}

const VirtualAgentView = (props: VirtualAgentViewProps) => {
  const { t } = useI18n();

  // Show transcript if we have a AgentHandoffParameters
  if (props?.task?.attributes && props?.task?.attributes.AgentHandoffParameters)
    return (
      <Box width={"100%"} padding={"space40"}>
        <DataTable data={getKVPs(props.task.attributes)} />
      </Box>
    );

  return (
    <Box width={"100%"} padding={"space40"}>
      <Alert variant="warning">
        <Text as="p">
          <strong>{t("error.no-va-data")}</strong>{" "}
          {t("error.no-va-data-description")}
        </Text>
      </Alert>
    </Box>
  );
};

export default withTaskContext(VirtualAgentView);
