import { forwardRef } from "react";
import styled from "@emotion/styled";
import { animated } from "@react-spring/web";
import ChildrenWithProps from "@lib/components/ChildrenWithProps";
import { SheetNoHeadProps } from "@appTypes/Sheet.ts";

const SheetNoHead = forwardRef<HTMLDivElement, SheetNoHeadProps>(
  function BottomSheetNoHead(
    {
      children,
      activePhase,
      isScrollLocked = false,
      handleScrollYChange,
      className,
      setIsScrollLocked,
      style,
      ...others
    },
    ref,
  ) {
    return (
      <BodyWrapper ref={ref} style={style} {...others} className={className}>
        <ChildrenWithProps
          phase={activePhase}
          disableScroll={isScrollLocked}
          setScrollY={handleScrollYChange}
          setIsScrollLocked={setIsScrollLocked}
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
