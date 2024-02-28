import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SheetHead(props: Props) {
  return (
    <div style={{ background: "orange", height: 150 }}>{props.children}</div>
  );
}
