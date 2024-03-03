import ChildrenWithProps from "../../ChildrenWithProps";
import styled from "styled-components";
import { animated } from "@react-spring/web";
import { BottomSheetNoHeadProps } from "../../../../types/Sheet.ts";
import { forwardRef } from "react";

const BottomSheetNoHead = forwardRef<HTMLDivElement, BottomSheetNoHeadProps>(
  function BottomSheetNoHead(
    {
      children,
      activePhase,
      isScrollLocked = false,
      showDragArea = false,
      setIsDragLocked,
      handleScrollYChange,

      style,
      ...others
    },
    ref,
  ) {
    return (
      <BodyWrapper ref={ref} style={style} {...others}>
        {showDragArea ? (
          <div
            data-drag-area="true"
            style={{ background: "#fff", height: 30 }}
          ></div>
        ) : null}
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

export default BottomSheetNoHead;

const BodyWrapper = styled(animated.section)`
  position: fixed;
  left: 0;
  right: 0;
  top: 100%;
  touch-action: none;
`;
