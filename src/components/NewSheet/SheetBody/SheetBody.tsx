import styled from "styled-components";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { Phase } from "~types/phase.ts";
import { useScroll } from "@use-gesture/react";

interface Props extends PropsWithChildren {
  height?: string;
  phase?: Phase;
  setLockDrag?: (state: boolean) => void;
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

    if (typeof props.setScrollY === "function") props.setScrollY(y, last, down);
  }, {});

  useLayoutEffect(() => {
    if (typeof props.setLockDrag === "function") {
      if (props.phase?.scrollable) {
        props?.setLockDrag(true);
      } else {
        props?.setLockDrag(false);
      }
    }
  }, [props]);

  return (
    <Wrapper
      {...bind()}
      ref={ref}
      height={props.height}
      $scrollable={props.phase?.scrollable && !props.disableScroll}
    >
      {props.children}
    </Wrapper>
  );
}

const Wrapper = styled.div<StyledWrapperProps>`
  height: ${(props) => props.height || "100vh"};
  overflow-y: ${(props) => (props.$scrollable ? "auto" : "hidden")};
  background: blue;
`;
