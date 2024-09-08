import styled from "@emotion/styled";
import { PropsWithChildren, useRef } from "react";
import { Phase } from "@appTypes/phase.ts";
import { useScroll } from "@use-gesture/react";
import { ChildrenNames } from "@appTypes/Sheet.ts";

interface Props extends PropsWithChildren {
  height?: string;
  phase?: Phase;
  setIsScrollLocked?: (state: boolean) => void;
  setScrollY?: (y: number, last: boolean, down: boolean) => void;
  disableScroll?: boolean;
  viewPortHeight?: number;
}

interface StyledWrapperProps {
  readonly height?: string;
  readonly $scrollable?: boolean;
}

export default function SheetBody(props: Props) {
  const ref = useRef(null);

  const bind = useScroll((state) => {
    const {
      last,
      down,
      values: [, y],
    } = state;

    if (
      y <= 0 &&
      typeof props?.setIsScrollLocked === "function" &&
      ref.current
    ) {
      const el = ref.current as HTMLDivElement;
      el.scrollTo(0, 0);

      if (typeof props.setScrollY === "function")
        props.setScrollY(y, last, down);
    } else if (typeof props.setScrollY === "function")
      props.setScrollY(y, last, down);
  }, {});

  return (
    <Wrapper
      {...bind()}
      ref={ref}
      height={props.height}
      $scrollable={!props.disableScroll && props.phase?.value === 100}
    >
      {props.children}
    </Wrapper>
  );
}

SheetBody.componentId = ChildrenNames.SHEET_BODY;

const Wrapper = styled.div<StyledWrapperProps>`
  height: ${(props) => props.height || "100vh"};
  overflow-y: ${(props) => (props.$scrollable ? "auto" : "hidden")};
`;
