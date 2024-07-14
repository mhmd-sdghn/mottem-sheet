import { BottomSheetProps } from "@appTypes/Sheet.ts";
import { useEffect, useState } from "react";
import ChildrenWithProps from "@lib/components/ChildrenWithProps";

export default function BottomSheet(props: BottomSheetProps) {
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
