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
import { Phase } from "@appTypes/phase.ts";

export default function Sheet(props: SheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const initPhase = { value: 0 };
  const extendedPhase = { value: 100 };
  const phaseThreshold = props.phaseThreshold || 60;

  const hasHeader =
    Array.isArray(props.children) &&
    props.children.length >= 2 &&
    props.children[0].type.componentId === ChildrenNames.SHEET_HEAD &&
    props.children[1].type.componentId === ChildrenNames.SHEET_BODY;

  const createPhases = () => {

    if (!Array.isArray(props.phases)) throw new Error("bottom-sheet Phases must be an array");

    let phases: Phase[] = [];

    if (hasHeader && props.phases[0].value !== 0) {
      phases.push(initPhase)
    }

    phases = phases.concat(props.phases)

    if (props.phases[props.phases.length - 1].value !== 100) {
      phases.push(extendedPhase)
    }

    return phases;
  }

  const phases = createPhases()

  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  if (
    props.phaseActiveIndex > phases.length - 1 ||
    props.phaseActiveIndex < 0
  ) {
    const values = JSON.stringify({
      phaseActiveIndex: props.phaseActiveIndex,
      phasesLength: phases.length,
    });

    throw new Error(
      `Invalid 'phaseActiveIndex', hint: 0 < phaseActiveIndex < phases.length, values are ${values}`,
    );
  }

  const { api, style, vh } = useInit({
    headRef,
    phaseActiveIndex: props.phaseActiveIndex,
    initWithNoAnimation: props.initWithNoAnimation,
    phases: phases
  });

  const handleClose = async () => {
    if (typeof props.setIsOpen === "function") {
      const r = api.start({ y: headRef.current?.offsetHeight || 0 });

      await r[0];

      props.setIsOpen(false);
    }
  };

  const getNextIndex = (target?: PhaseTargetDirections, unsignedMy = 0) => {

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


    return Math.min(acceleratorSign + props.phaseActiveIndex , phases.length - 1);
  }

  const switchPhaseTo = (nextPhaseIndex: number) => {

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


  const animate = (newY: number, immediate = false) => {
    if (headRef) {
      headRef.current?.setAttribute('data-is-interactive', "true");
    } else {
      ref.current?.setAttribute('data-is-interactive', "true");
    }

    api.start({
      to: async (next) => {
        await next({ y: newY, immediate });
        if (headRef) {
          headRef.current?.setAttribute('data-is-interactive', "false");
        } else {
          ref.current?.setAttribute('data-is-interactive', "false");
        }
      }
    });
  }

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
        my > 0
          ? FinalAnimDirection.DOWN
          : my < 0
            ? FinalAnimDirection.UP
            : null;


      if (
        !isScrollLocked &&
        finalDirection === FinalAnimDirection.DOWN &&
        scrollY <= 0
      ) {
        setIsScrollLocked(true);
      } else if (!isScrollLocked && scrollY > 0) {
        disabled = true;
      } else if (
        isScrollLocked &&
        finalDirection === FinalAnimDirection.UP &&
        scrollY === 0
      ) {
        setIsScrollLocked(false);
        disabled = true;
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
      let newY: number;

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

            const nextIndex = getNextIndex(PhaseTargetDirections.NEXT, unsignedMy)
            const offset = props.phaseActiveIndex === nextIndex ? 0 : headH   + (phases[nextIndex]?.offsetUp || 0)

            newY =
              ((vh * switchPhaseTo(nextIndex)) /
                100 - offset) *
              -1;

            console.log('salam 1');
            animate(newY)
          } else {
            // switch to the previous phases

            const nextIndex = getNextIndex(PhaseTargetDirections.PRE, unsignedMy);

            newY = switchPhaseTo(nextIndex);
            console.log('salam 2');
            if (newY === -1 && !props.keepHeadOpen) {
              handleClose().then();
            } else {
              newY = ((vh * newY) / 100) * -1 + headH  + (phases[nextIndex]?.offsetDown || 0);

              if (newY > 0) newY = 0;


              animate(newY)
            }
          }
        } else if (finalDirection) {
          // return to current phases

          const offset = (finalDirection === FinalAnimDirection.DOWN ? phases[props.phaseActiveIndex]?.offsetDown : phases[props.phaseActiveIndex]?.offsetUp) || 0;

          newY =
            ((vh * switchPhaseTo(getNextIndex(PhaseTargetDirections.CURRENT))) / 100) * -1 +
            headH ;

          if (newY > 0) newY = 0;

          console.log('salam 3' , offset, finalDirection) ;
          animate(newY)
        }
      } else {
        newY = distanceFromBottom + my;

        if (Math.abs(newY) > vh) newY = vh * -1;

        if (newY > 0 && props.keepHeadOpen) newY = 0
        console.log('salam 4');
        animate(newY, true)
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
        setIsScrollLocked={setIsScrollLocked}
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
      data-bottom-sheet="body"
      handleScrollYChange={handleScrollYChange}
      isScrollLocked={isScrollLocked}
      setIsScrollLocked={setIsScrollLocked}
      activePhase={phases[props.phaseActiveIndex]}
    >
      {props.children}
    </SheetNoHead>
  );
}
