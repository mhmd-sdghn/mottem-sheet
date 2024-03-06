import ChildrenWithProps from "@lib/components/ChildrenWithProps";
import styled from "styled-components";
import { animated } from "@react-spring/web";
import { SheetNoHeadProps } from "@appTypes/Sheet.ts";
import { forwardRef } from "react";

const SheetNoHead = forwardRef<HTMLDivElement, SheetNoHeadProps>(
  function BottomSheetNoHead(
    {
      children,
      activePhase,
      isScrollLocked = false,
      setIsDragLocked,
      handleScrollYChange,

      style,
      ...others
    },
    ref,
  ) {
    return (
      <BodyWrapper ref={ref} style={style} {...others}>
        <ChildrenWithProps
          setLockDrag={(state: boolean) => setIsDragLocked(state)}
          phase={activePhase}
          disableScroll={isScrollLocked}
          setScrollY={handleScrollYChange}
        >
          {children}
        </ChildrenWithProps>
      </BodyWrapper>
    );
  },
);

export default SheetNoHead;

const BodyWrapper = styled(animated.section)`
  position: fixed;
  left: 0;
  right: 0;
  top: 100%;
  touch-action: none;
`;
