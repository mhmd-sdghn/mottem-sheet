import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import useInit from "../../../hooks/useInit.ts";

import { SheetProps } from "../../../../types/Sheet.ts";
import SheetNoHead from "./SheetNoHead.tsx";
import SheetWithHead from "./SheetWithHead.tsx";

enum PhaseTargetDirections {
  NEXT = "NEXT_PHASE",
  PRE = "PREVIOUS_PHASE",
  CURRENT = "CURRENT_PHASE",
}

enum ChildrenNames {
  SHEET_HEAD = "SheetHead",
  SHEET_BODY = "SheetBody",
}

enum FinalAnimDirection {
  UP = "UP",
  DOWN = "DOWN",
}

export default function Sheet(props: SheetProps) {
  const ref = useRef(null);
  const headRef = useRef<HTMLDivElement>(null);
  const initPhase = { value: 0, scrollable: false };
  const extendedPhase = { value: 100, scrollable: true };
  const phaseThreshold = 60;

  const hasHeader =
    Array.isArray(props.children) &&
    props.children.length >= 2 &&
    props.children[0].type.name === ChildrenNames.SHEET_HEAD &&
    props.children[1].type.name === ChildrenNames.SHEET_BODY;

  const [phases] = useState([
    ...(hasHeader ? [initPhase, ...props.middlePhases] : props.middlePhases),
    extendedPhase,
  ]);
  const [isDragLocked, setIsDragLocked] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [phaseActiveIndex, setPhaseActiveIndex] = useState(
    props.initPhaseActiveIndex || 0,
  );

  const { api, style, vh } = useInit({
    headRef,
    phaseActiveIndex,
    initPhase: phases[phaseActiveIndex],
  });

  const handlePhaseActiveIndexChange = (index: number) => {
    if (typeof props.onActiveIndexChange === "function") {
      props.onActiveIndexChange(index);
    }
  };

  const handleClose = () => {
    if (typeof props.setIsOpen === "function") {
      props.setIsOpen(false);
    }
  };

  const switchPhaseTo = (target?: PhaseTargetDirections) => {
    switch (target) {
      case PhaseTargetDirections.PRE:
        if (phaseActiveIndex <= 0) {
          setPhaseActiveIndex(0);
          handlePhaseActiveIndexChange(0);
          handleClose();
          return initPhase.value;
        }

        setPhaseActiveIndex(phaseActiveIndex - 1);
        return phases[phaseActiveIndex - 1].value;

      case PhaseTargetDirections.NEXT:
        if (phaseActiveIndex === phases.length - 1) {
          handlePhaseActiveIndexChange(phases.length - 1);
          setPhaseActiveIndex(phases.length - 1);
          return extendedPhase.value;
        }

        handlePhaseActiveIndexChange(phaseActiveIndex + 1);
        setPhaseActiveIndex(phaseActiveIndex + 1);
        return phases[phaseActiveIndex + 1].value;

      default:
        return phases[phaseActiveIndex].value;
    }
  };

  let distanceFromBottom: number = -1;
  let hiddenHeadSpace: number = -1;
  const handleScrollYChange = (value: number, last: boolean, down: boolean) => {
    // hide header on extended mode when body scrolled
    if (hiddenHeadSpace === -1) {
      hiddenHeadSpace = style.y.get();
    }

    let animTo = hiddenHeadSpace - value;
    if (phaseActiveIndex === phases.length - 1) {
      if (animTo < vh * -1) {
        animTo = vh * -1;
      }

      if (value === 0 && headRef.current) {
        animTo = vh * -1 + headRef.current.offsetHeight;
      }

      api.start({ y: animTo, immediate: down });

      if (last) {
        hiddenHeadSpace = -1;
      }
    }

    setScrollY(value);
  };

  const bind = useDrag(
    (state) => {
      const {
        // args: [childName],
        down,
        movement: [, my],
        last,
        target,
        cancel,
      } = state;

      let disabled = false;

      const headH = headRef.current?.offsetHeight || 0;

      const unsignedMy = Math.abs(my);

      const finalDirection =
        my > 0 ? FinalAnimDirection.DOWN : FinalAnimDirection.UP;

      if (isDragLocked) {
        if (scrollY !== 0 || my < 0) disabled = true;
      }

      const _target = target as HTMLElement;
      if (_target.closest("[data-drag-area]")) {
        disabled = false;
      }

      if (disabled) {
        cancel();
        return;
      }

      if (distanceFromBottom === -1) {
        distanceFromBottom = style.y.get();
      }

      // free way
      let newY = distanceFromBottom + my;

      // back to phases
      if (!down && last) {
        // drag is over
        setIsScrollLocked(false);

        distanceFromBottom = -1;

        // here we should calculate which phases we should switch to after user drag is over

        if (unsignedMy >= phaseThreshold) {
          // switch phases
          if (finalDirection === FinalAnimDirection.UP) {
            // switch to the next phases
            newY =
              ((vh * switchPhaseTo(PhaseTargetDirections.NEXT)) / 100) * -1 +
              headH;
          } else {
            // switch to the previous phases
            newY =
              ((vh * switchPhaseTo(PhaseTargetDirections.PRE)) / 100) * -1 +
              headH;
          }
        } else {
          // return to current phases
          newY =
            ((vh * switchPhaseTo(PhaseTargetDirections.CURRENT)) / 100) * -1 +
            headH;
        }
      }

      if (Math.abs(newY) > vh) newY = vh * -1;
      else if (newY > 0) newY = 0;

      api.start({ y: newY, immediate: down });
    },
    {
      from: () => [0, style.y.get()],
      pointer: { touch: true },
    },
  );

  if (hasHeader && Array.isArray(props.children) && props.children.length === 2)
    return (
      <SheetWithHead
        {...bind()}
        ref={headRef}
        style={style}
        handleScrollYChange={handleScrollYChange}
        isScrollLocked={isScrollLocked}
        activePhase={phases[phaseActiveIndex]}
        setIsDragLocked={setIsDragLocked}
        showDragArea={props.showDragArea}
      >
        {props.children}
      </SheetWithHead>
    );

  return (
    <SheetNoHead
      {...bind()}
      ref={ref}
      style={style}
      showDragArea={props.showDragArea}
      handleScrollYChange={handleScrollYChange}
      isScrollLocked={isScrollLocked}
      activePhase={phases[phaseActiveIndex]}
      setIsDragLocked={setIsDragLocked}
    >
      {props.children}
    </SheetNoHead>
  );
}
