import { forwardRef } from "react";
import ChildrenWithProps from "@lib/components/ChildrenWithProps";
import styled from "@emotion/styled";
import { animated } from "@react-spring/web";
import type { SheetWithHeadProps } from "@appTypes/Sheet";

const SheetWithHead = forwardRef<HTMLDivElement, SheetWithHeadProps>(
  function BottomSheetWithHead(
    {
      children,
      activePhase,
      isScrollLocked = false,
      handleScrollYChange,
      headerStyle,
      bodyStyle,
      headerClassName,
      bodyClassName,
      style,
      setIsScrollLocked,
      ...others
    },
    ref,
  ) {
    if (Array.isArray(children) && children.length >= 2)
      return (
        <>
          <Header
            ref={ref}
            data-drag-area="true"
            style={{ ...headerStyle, ...style }}
            {...others}
            className={headerClassName}
          >
            {children[0]}
          </Header>
          <Main
            style={{ ...bodyStyle, ...style }}
            className={bodyClassName}
            {...others}
          >
            <ChildrenWithProps
              phase={activePhase}
              disableScroll={isScrollLocked}
              setScrollY={handleScrollYChange}
              setIsScrollLocked={setIsScrollLocked}
            >
              {children[1]}
            </ChildrenWithProps>
          </Main>
        </>
      );
  },
);
export default SheetWithHead;

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
