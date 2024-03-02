import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SheetHead(props: Props) {
  return <>{props.children}</>;
}
