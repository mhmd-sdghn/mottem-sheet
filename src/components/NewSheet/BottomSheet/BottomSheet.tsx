import styled from "styled-components";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import ChildrenWithProps from "../../ChildrenWithProps";

interface Props {
  children: ReactNode;
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
  const closePhase = 0;
  const extendedPhase = 100;
  const phaseThreshold = 60;

  const phases = [closePhase, 20, 60, extendedPhase];

  let activePhaseIndex = 1;
  const activePhase = phases[activePhaseIndex];

  const switchPhaseTo = (target?: PhaseTargetDirections) => {
    switch (target) {
      case PhaseTargetDirections.PRE:
        if (activePhaseIndex === 0) {
          activePhaseIndex = 0;
          return closePhase;
        }
        activePhaseIndex -= 1;
        return phases[activePhaseIndex];

      case PhaseTargetDirections.NEXT:
        if (activePhaseIndex === phases.length - 1) {
          activePhaseIndex = phases.length - 1;
          return extendedPhase;
        }
        activePhaseIndex += 1;
        return phases[activePhaseIndex];

      default:
        return activePhase;
    }
  };

  const ref = useRef(null);

  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0,
  );

  const [style, api] = useSpring(() => ({ y: vh - (vh * activePhase) / 100 }));

  let distanceFromTop: number;

  const bind = useDrag(
    (state) => {
      const {
        down,
        movement: [, my],
        first,
        last,
      } = state;

      if (first) {
        distanceFromTop = style.y.get();
      }

      // free way
      let newY = distanceFromTop + my;

      if (newY < 0) newY = 0;
      else if (newY > vh) newY = vh;

      // back to phases
      if (!down && last) {
        // here we should calculate which phases we should switch to after user drag is over

        const finalDirection =
          my > 0 ? FinalAnimDirection.DOWN : FinalAnimDirection.UP;
        const unsignedMy = Math.abs(my);

        if (unsignedMy >= phaseThreshold) {
          // switch phases
          if (finalDirection === FinalAnimDirection.UP) {
            // switch to the next phases
            newY = vh - (vh * switchPhaseTo(PhaseTargetDirections.NEXT)) / 100;
          } else {
            // switch to the previous phases
            newY = vh - (vh * switchPhaseTo(PhaseTargetDirections.PRE)) / 100;
          }
        } else {
          // return to current phases
          newY = vh - (vh * switchPhaseTo(PhaseTargetDirections.CURRENT)) / 100;
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
    //api.start({ y : vh - (vh * phases[0] / 100) , immediate: true })
  }, []);

  return (
    <Wrapper ref={ref} {...bind()} style={style}>
      <ChildrenWithProps onClick={() => console.log("cliked")}>
        {props.children}
      </ChildrenWithProps>
    </Wrapper>
  );
}

const Wrapper = styled(animated.div)`
  background: red;
  position: fixed;
  inset: 0;
  padding: 10px;
  touch-action: none;
`;
