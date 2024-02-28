import styled from "styled-components";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { Phase } from "../BottomSheet/BottomSheet.tsx";
import { useScroll } from "@use-gesture/react";

interface Props extends PropsWithChildren {
  height?: string;
  scrollable?: boolean;
  phase?: Phase;
  setLockDrag?: (state: boolean) => void;
  setScrollY?: (state: number) => void;
  disableScroll?: boolean;
}

interface StyledWrapperProps {
  readonly height?: string;
  readonly $scrollable?: boolean;
}

export default function SheetBody(props: Props) {
  const ref = useRef(null);

  const bind = useScroll((state) => {
    const {
      values: [, y],
    } = state;

    if (typeof props.setScrollY === "function") props.setScrollY(y);
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
      $scrollable={props.phase?.scrollable}
    >
      {props.children}
    </Wrapper>
  );
}

const Wrapper = styled.div<StyledWrapperProps>`
  height: ${(props) => props.height || "auto"};
  overflow-y: ${(props) => (props.$scrollable ? "auto" : "hidden")};
  background: blue;
`;
