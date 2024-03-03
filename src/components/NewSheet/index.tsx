import { BottomSheetProps } from "../../../types/Sheet.ts";

export { default as Sheet } from "./Sheet";
export { default as SheetBody } from "./SheetBody";

export function ButtonSheet(props: BottomSheetProps) {
  if (props.isOpen) {
    return <>{props.children}</>;
  } else return null;
}
