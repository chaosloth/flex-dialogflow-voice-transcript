import { Table, TBody, Td, Th, THead, Tr, Text } from "@twilio-paste/core";
import { useI18n } from "react-simple-i18n";

export interface DataTableProps {
  data: any;
}

export const DataTable: React.FC<DataTableProps> = (props: DataTableProps) => {
  const { t } = useI18n();

  if (!props.data)
    return (
      <Text inset={undefined} as={"p"}>
        {t("table.no-data")}
      </Text>
    );
  return (
    <Table width={"100%"}>
      <THead>
        <Tr>
          <Th width="size20">{t("table.attribute")}</Th>
          <Th>{t("table.value")}</Th>
        </Tr>
      </THead>
      <TBody>
        {props.data &&
          Object.entries(props.data).map(([key, value]) => {
            return (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>{value as string}</Td>
              </Tr>
            );
          })}
      </TBody>
    </Table>
  );
};
