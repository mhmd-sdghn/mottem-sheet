import styled from "styled-components";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import ChildrenWithProps from "../../ChildrenWithProps";

export interface Props extends PropsWithChildren {
  pushHeadAsPhase?: boolean;
  showDragArea?: boolean;
}

export interface Phase {
  value: number;
  scrollable?: boolean;
}

enum PhaseTargetDirections {
  NEXT = "NEXT_PHASE",
  PRE = "PREVIOUS_PHASE",
  CURRENT = "CURRENT_PHASE",
}

enum FinalAnimDirection {
  UP = "UP",
  DOWN = "DOWN",
}

export default function BottomSheet(props: Props) {
  const ref = useRef(null);
  const headRef = useRef(null);
  const closePhase = { value: 0, scrollable: false };
  const extendedPhase = { value: 100, scrollable: true };
  const phaseThreshold = 60;

  const _phases: Phase[] = [
    closePhase,
    { value: 20, scrollable: false },
    {
      value: 60,
      scrollable: true,
    },
    extendedPhase,
  ];

  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  const [phases] = useState(_phases);
  const [activePhaseIndex, setActivePhaseIndex] = useState(1);
  const [isDragLocked, setIsDragLocked] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const switchPhaseTo = (target?: PhaseTargetDirections) => {
    switch (target) {
      case PhaseTargetDirections.PRE:
        if (activePhaseIndex === 0) {
          setActivePhaseIndex(0);
          return closePhase.value;
        }

        setActivePhaseIndex(activePhaseIndex - 1);
        return phases[activePhaseIndex - 1].value;

      case PhaseTargetDirections.NEXT:
        if (activePhaseIndex === phases.length - 1) {
          setActivePhaseIndex(phases.length - 1);
          return extendedPhase.value;
        }

        setActivePhaseIndex(activePhaseIndex + 1);
        return phases[activePhaseIndex + 1].value;

      default:
        return phases[activePhaseIndex].value;
    }
  };

  const [style, api] = useSpring(() => ({
    y: ((vh * _phases[activePhaseIndex].value) / 100) * -1,
  }));

  let distanceFromBottom: number = -1;

  const bind = useDrag(
    (state) => {
      const {
        down,
        movement: [, my],
        last,
        target,
      } = state;

      let disabled = false;

      if (isDragLocked) {
        if (scrollY !== 0 || my < 0) disabled = true;
      }

      const _target = target as HTMLElement;

      if (_target.closest("[data-drag-area]")) {
        disabled = false;
      }

      if (disabled) {
        console.warn("drag fired but it's disabled ", isDragLocked);
        return;
      }

      if (distanceFromBottom === -1) {
        distanceFromBottom = style.y.get();
      }

      // free way
      let newY = distanceFromBottom + my;

      if (Math.abs(newY) > vh) newY = vh * -1;
      else if (newY > 0) newY = 0;

      // avoid scroll while drag
      setIsScrollLocked(true);

      // back to phases
      if (!down && last) {
        // drag is over
        setIsScrollLocked(false);
        distanceFromBottom = -1;

        // here we should calculate which phases we should switch to after user drag is over
        const finalDirection =
          my > 0 ? FinalAnimDirection.DOWN : FinalAnimDirection.UP;
        const unsignedMy = Math.abs(my);

        if (unsignedMy >= phaseThreshold) {
          // switch phases
          if (finalDirection === FinalAnimDirection.UP) {
            // switch to the next phases
            newY =
              ((vh * switchPhaseTo(PhaseTargetDirections.NEXT)) / 100) * -1;
          } else {
            // switch to the previous phases
            newY = ((vh * switchPhaseTo(PhaseTargetDirections.PRE)) / 100) * -1;
          }
        } else {
          // return to current phases
          newY =
            ((vh * switchPhaseTo(PhaseTargetDirections.CURRENT)) / 100) * -1;
        }
      }

      api.start({ y: newY, immediate: down });
    },
    {
      from: () => [0, style.y.get()],
      pointer: { touch: true },
    },
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [headRef]);

  if (
    Array.isArray(props.children) &&
    props.children.length >= 2 &&
    props.children[0].type.name === "SheetHead" &&
    props.children[0].type.name === "SheetBody"
  )
    return (
      <Wrapper ref={ref} {...bind()} style={style}>
        <header ref={headRef} data-drag-area="true">
          {props?.showDragArea ? (
            <div style={{ background: "#fff", height: 30 }}></div>
          ) : null}
          {props.children[0]}
        </header>
        <ChildrenWithProps
          setLockDrag={(state: boolean) => setIsDragLocked(state)}
          phase={phases[activePhaseIndex]}
          disableScroll={isScrollLocked}
          setScrollY={setScrollY}
        >
          {props.children[1]}
        </ChildrenWithProps>
      </Wrapper>
    );

  return <div>New Sheet requires the SheetBody and SheetHead Components</div>;
}

const Wrapper = styled(animated.div)`
  background: red;
  position: fixed;
  left: 0;
  right: 0;
  top: 100%;
  touch-action: none;
  transform-origin: bottom;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100svh;
`;
