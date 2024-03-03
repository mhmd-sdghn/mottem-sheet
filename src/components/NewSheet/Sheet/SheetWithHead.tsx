import ChildrenWithProps from "../../ChildrenWithProps";
import styled from "styled-components";
import { animated } from "@react-spring/web";
import type { SheetWithHeadProps } from "~types/Sheet";
import { forwardRef } from "react";

const SheetWithHead = forwardRef<HTMLDivElement, SheetWithHeadProps>(
  function BottomSheetWithHead(
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
    if (Array.isArray(children) && children.length >= 2)
      return (
        <Wrapper>
          <Header ref={ref} data-drag-area="true" style={style} {...others}>
            {showDragArea ? (
              <div style={{ background: "#fff", height: 30 }}></div>
            ) : null}
            {children[0]}
          </Header>
          <Main style={style} {...others}>
            <ChildrenWithProps
              setLockDrag={(state: boolean) => setIsDragLocked(state)}
              phase={activePhase}
              disableScroll={isScrollLocked}
              setScrollY={handleScrollYChange}
            >
              {children[1]}
            </ChildrenWithProps>
          </Main>
        </Wrapper>
      );
  },
);
export default SheetWithHead;

const Wrapper = styled(animated.div)`
  background: red;
`;

const Header = styled(animated.header)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  touch-action: none;
`;

const Main = styled(animated.main)`
  position: fixed;
  left: 0;
  right: 0;
  top: 100%;
  touch-action: none;
`;
