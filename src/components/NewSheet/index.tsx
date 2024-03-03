import { BottomSheetProps } from "@appTypes/Sheet.ts";
import ChildrenWithProps from "@/components/ChildrenWithProps";
import { useEffect, useState } from "react";

export { default as Sheet } from "./Sheet";
export { default as SheetBody } from "./SheetBody";

export function ButtonSheet(props: BottomSheetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(props.isOpen);

  const handleIsOpenChange = (state: boolean) => {
    setInternalIsOpen(state);
    props.setIsOpen(state);
  };

  useEffect(() => {
    if (props.isOpen) {
      setInternalIsOpen(true);
    }
  }, [props.isOpen]);

  if (internalIsOpen) {
    return (
      <ChildrenWithProps isOpen={props.isOpen} setIsOpen={handleIsOpenChange}>
        {props.children}
      </ChildrenWithProps>
    );
  } else return null;
}
