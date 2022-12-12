import {
  Avatar,
  Card,
  ChatBubble,
  ChatLog,
  ChatMessage,
  ChatMessageMeta,
  ChatMessageMetaItem,
  SkeletonLoader,
  Box,
  ChatBookend,
  ChatBookendItem,
  Tooltip,
} from "@twilio-paste/core";
import Moment from "react-moment";
import { useEffect, useState } from "react";
import { useI18n } from "react-simple-i18n";

export interface CallTranscriptProps {
  CallSid: any;
}

export type TranscriptEntry = {
  accountSid: string;
  createdBy: string;
  dateCreated: string;
  dateExpires: string;
  dateUpdated: string;
  index: number;
  listSid: string;
  revision: string;
  serviceSid: string;
  url: string;
  data: TranscriptTurn;
};

export type TranscriptTurn = {
  Confidence: string;
  ConversationId: string;
  EndUserId: string;
  IntentDisplayName: string;
  IntentId: string;
  LanguageCode: string;
  Parameters: string;
  ReplyText: string;
  ResolvedInput: string;
};

// Standard variation
function api<T>(url: string, params: any): Promise<T> {
  return fetch(url, params).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

export const CallTranscript: React.FC<CallTranscriptProps> = (
  props: CallTranscriptProps
) => {
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>();

  const BASE_URL = process.env.REACT_APP_TRANSCRIPT_SERVICE_API_BASE || "";
  const API_TRANSCRIPT = "/transcript/retrieve?CallSid=";

  useEffect(() => {
    if (!props.CallSid || props.CallSid == undefined) return;
    console.log(t("log.lookup-callsid-start"), props.CallSid);

    api<any>(BASE_URL + API_TRANSCRIPT + props.CallSid, {})
      .then((apiData) => {
        console.log(t("log.lookup-callsid-response"), apiData);
        setTranscript(apiData);
        console.log(`${t("log.transcription-length")} ${apiData.length}`);
      })
      .catch((error) => {
        /* show error message */
        console.log(t("log.error-api-data"), error);
      })
      .finally(() => setLoading(false));
  }, [props.CallSid]);

  if (loading)
    return (
      <>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </>
    );

  return (
    <Card>
      <Box
        overflow="scroll"
        inset={undefined}
        gridRow={undefined}
        gridColumn={undefined}
        gridAutoFlow={undefined}
        gridAutoColumns={undefined}
        gridAutoRows={undefined}
        gridTemplateColumns={undefined}
        gridTemplateRows={undefined}
        gridTemplateAreas={undefined}
        gridArea={undefined}
      >
        <ChatLog>
          {transcript && (
            <ChatBookend>
              <ChatBookendItem>
                <strong>{t("transcript.bot-name")}</strong>{" "}
                {t("transcript.transcript-start")}・
                <Moment format="hh:mm:ss" date={transcript[0].dateCreated} />
              </ChatBookendItem>
            </ChatBookend>
          )}

          {transcript &&
            transcript.map((item: TranscriptEntry, idx: number) => {
              return (
                <Box
                  key={idx}
                  inset={undefined}
                  gridRow={undefined}
                  gridColumn={undefined}
                  gridAutoFlow={undefined}
                  gridAutoColumns={undefined}
                  gridAutoRows={undefined}
                  gridTemplateColumns={undefined}
                  gridTemplateRows={undefined}
                  gridTemplateAreas={undefined}
                  gridArea={undefined}
                >
                  {item.data.ResolvedInput && (
                    <ChatMessage variant="inbound">
                      <ChatBubble>{item.data.ResolvedInput}</ChatBubble>
                      <ChatMessageMeta
                        aria-label={t("transcript.said-by-customer")}
                      >
                        <Tooltip text={item.data.EndUserId}>
                          <ChatMessageMetaItem>
                            <Avatar
                              name={t("transcript.customer")}
                              size="sizeIcon20"
                            />
                            {t("transcript.customer")} ・{" "}
                            <Moment format="hh:mm:ss" date={item.dateCreated} />
                          </ChatMessageMetaItem>
                        </Tooltip>
                      </ChatMessageMeta>
                    </ChatMessage>
                  )}
                  <ChatMessage variant="outbound">
                    <ChatBubble>{item.data.ReplyText}</ChatBubble>
                    <ChatMessageMeta
                      aria-label={t("transcript.said-by-customer")}
                    >
                      <Tooltip
                        text={
                          item.data.IntentDisplayName ||
                          item.data.IntentId ||
                          t("word.unknown")
                        }
                      >
                        <ChatMessageMetaItem>
                          <Avatar
                            name={t("transcript.bot-name")}
                            size="sizeIcon20"
                          />
                          {t("transcript.bot-name")} ・{" "}
                          <Moment format="hh:mm:ss" date={item.dateCreated} />
                        </ChatMessageMetaItem>
                      </Tooltip>
                    </ChatMessageMeta>
                  </ChatMessage>
                </Box>
              );
            })}
          {transcript && (
            <ChatBookend>
              <ChatBookendItem>
                <strong>{t("transcript.end-message")}</strong>・
                <Moment
                  format="hh:mm:ss"
                  date={transcript[transcript.length - 1].dateCreated}
                />
              </ChatBookendItem>
            </ChatBookend>
          )}
        </ChatLog>
      </Box>
    </Card>
  );
};
