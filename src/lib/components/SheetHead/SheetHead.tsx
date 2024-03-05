import { ReactNode } from "react";
import { ChildrenNames } from "@appTypes/Sheet.ts";

interface Props {
  children: ReactNode;
}

export default function SheetHead(props: Props) {
  return <>{props.children}</>;
}

SheetHead.componentId = ChildrenNames.SHEET_HEAD;
