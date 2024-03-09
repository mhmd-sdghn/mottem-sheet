import { useEffect, useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import useInit from "@lib/hooks/useInit.ts";

import {
  ChildrenNames,
  FinalAnimDirection,
  PhaseTargetDirections,
  SheetProps,
} from "@appTypes/Sheet.ts";
import SheetNoHead from "./SheetNoHead.tsx";
import SheetWithHead from "./SheetWithHead.tsx";

export default function Sheet(props: SheetProps) {
  const ref = useRef(null);
  const headRef = useRef<HTMLDivElement>(null);
  const initPhase = { value: 0, scrollable: false };
  const extendedPhase = { value: 100, scrollable: true };
  const phaseThreshold = props.phaseThreshold || 60;

  const hasHeader =
    Array.isArray(props.children) &&
    props.children.length >= 2 &&
    props.children[0].type.componentId === ChildrenNames.SHEET_HEAD &&
    props.children[1].type.componentId === ChildrenNames.SHEET_BODY;

  const [phases] = useState([
    ...(hasHeader ? [initPhase, ...props.middlePhases] : props.middlePhases),
    extendedPhase,
  ]);
  const [isDragLocked, setIsDragLocked] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // const [props.phaseActiveIndex, props.setPhaseActiveIndex] = useState(
  //   props.initPhaseActiveIndex || 0,
  // );

  const { api, style, vh } = useInit({
    headRef,
    hasHeader,
    phaseActiveIndex: props.phaseActiveIndex,
    initWithNoAnimation: props.initWithNoAnimation,
    phases: phases,
  });

  const handleClose = async () => {
    if (typeof props.setIsOpen === "function") {
      const r = api.start({ y: headRef.current?.offsetHeight || 0 });

      await r[0];

      props.setIsOpen(false);
    }
  };

  const switchPhaseTo = (target?: PhaseTargetDirections, unsignedMy = 0) => {
    const threshold =
      props.phaseActiveIndex === phases.length - 1
        ? phaseThreshold * 4
        : phaseThreshold * 3;

    const accelerator =
      target === PhaseTargetDirections.CURRENT
        ? 0
        : Math.round(unsignedMy / threshold) || 1;

    const acceleratorSign =
      target === PhaseTargetDirections.PRE ? accelerator * -1 : accelerator;

    const nextPhaseIndex = acceleratorSign + props.phaseActiveIndex;

    if (nextPhaseIndex < 0) {
      props.setPhaseActiveIndex(0);
      return -1;
    } else if (nextPhaseIndex >= phases.length - 1) {
      props.setPhaseActiveIndex(phases.length - 1);
      return extendedPhase.value;
    }

    props.setPhaseActiveIndex(nextPhaseIndex);
    return phases[nextPhaseIndex].value;
  };

  let distanceFromBottom: number = -1;
  let hiddenHeadSpace: number = -1;
  const handleScrollYChange = (value: number, last: boolean, down: boolean) => {
    // hide header on extended mode when body scrolled
    if (hiddenHeadSpace === -1) {
      hiddenHeadSpace = style.y.get();
    }

    let animTo = hiddenHeadSpace - value;
    if (props.phaseActiveIndex === phases.length - 1) {
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
        movement: [mx, my],
        last,
        target,
        cancel,
      } = state;

      let disabled = false;

      const unsignedMy = Math.abs(my);
      const unsignedMx = Math.abs(mx);

      const finalDirection =
        my > 0 ? FinalAnimDirection.DOWN : FinalAnimDirection.UP;

      if (isDragLocked) {
        if (scrollY !== 0 || my < 0) disabled = true;
      }

      const _target = target as HTMLElement;
      if (_target.closest("[data-drag-area]")) {
        disabled = false;
      }

      if (unsignedMx > 10 && unsignedMy < 10) {
        disabled = true;
      }

      if (disabled) {
        cancel();
        return;
      }

      if (distanceFromBottom === -1) {
        distanceFromBottom = style.y.get();
      }

      // free way
      let newY;

      // back to phases
      if (!down && last) {
        const headH = headRef.current?.offsetHeight || 0;

        // drag is over
        setIsScrollLocked(false);

        distanceFromBottom = -1;

        // here we should calculate which phases we should switch to after user drag is over

        if (unsignedMy >= phaseThreshold) {
          // switch phases
          if (finalDirection === FinalAnimDirection.UP) {
            // switch to the next phases
            newY =
              ((vh * switchPhaseTo(PhaseTargetDirections.NEXT, unsignedMy)) /
                100 -
                headH) *
              -1;

            api.start({ y: newY });
          } else {
            // switch to the previous phases
            newY = switchPhaseTo(PhaseTargetDirections.PRE, unsignedMy);

            if (newY === -1) {
              handleClose().then();
            } else {
              newY = ((vh * newY) / 100) * -1 + headH;

              if (newY > 0) newY = 0;

              api.start({ y: newY });
            }
          }
        } else {
          // return to current phases
          newY =
            ((vh * switchPhaseTo(PhaseTargetDirections.CURRENT)) / 100) * -1 +
            headH;

          if (newY > 0) newY = 0;

          api.start({ y: newY });
        }
      } else {
        newY = distanceFromBottom + my;

        if (Math.abs(newY) > vh) newY = vh * -1;

        api.start({ y: newY, immediate: down });
      }
    },
    {
      from: () => [0, style.y.get()],
      pointer: { touch: true },
    },
  );

  useEffect(() => {
    if (!props.isOpen) {
      handleClose().then(null);
    }
  }, [props.isOpen]);

  if (hasHeader && Array.isArray(props.children) && props.children.length === 2)
    return (
      <SheetWithHead
        {...bind()}
        ref={headRef}
        style={style}
        headerStyle={props.headerStyle}
        bodyStyle={props.bodyStyle}
        handleScrollYChange={handleScrollYChange}
        isScrollLocked={isScrollLocked}
        headerClassName={props.headerClassName}
        bodyClassName={props.bodyClassName}
        activePhase={phases[props.phaseActiveIndex]}
        setIsDragLocked={setIsDragLocked}
      >
        {props.children}
      </SheetWithHead>
    );

  return (
    <SheetNoHead
      {...bind()}
      ref={ref}
      style={{ ...props.bodyStyle, ...style }}
      className={props.bodyClassName}
      handleScrollYChange={handleScrollYChange}
      isScrollLocked={isScrollLocked}
      activePhase={phases[props.phaseActiveIndex]}
      setIsDragLocked={setIsDragLocked}
    >
      {props.children}
    </SheetNoHead>
  );
}
