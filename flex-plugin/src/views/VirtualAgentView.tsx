import { withTaskContext } from "@twilio/flex-ui";
import { CallTranscript } from "../components/CallTranscript";
import React from "react";

export type VirtualAgentViewProps = {
  task: any;
};

const VirtualAgentView = (props: VirtualAgentViewProps) => {
  // Show transcript if we have a CallSid
  if (props?.task?.attributes && props?.task?.attributes.call_sid)
    return <CallTranscript CallSid={props?.task?.attributes.call_sid} />;

  return <div>No call SID</div>;
};

export default withTaskContext(VirtualAgentView);
