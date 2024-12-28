import {
  RefObject,
  useEffect
} from "react";
import type { Phase } from "@appTypes/phase.ts";
import { useSpring } from "@react-spring/web";
import useViewPortHeight from "@lib/hooks/useViewPortHeight.ts";

interface Props {
  headRef: RefObject<HTMLDivElement>;
  phases: Phase[];
  phaseActiveIndex: number
  initWithNoAnimation?: boolean;
}


const getInitAnimationConfig = (viewHeight: number, initWithNoAnimation: boolean, hasHeader: boolean, newY: number) =>
  initWithNoAnimation ? {
      y: newY,
      immediate: true,
    }
    : {
      from : {
        y: hasHeader ? viewHeight : 0
      },
      to: {
        y: newY,
      },
    }


export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  headRef
}: Props) {

  let vh = -1
  const [style, api] = useSpring(getInitAnimationConfig);
  const headerHeight = headRef.current?.offsetHeight && phases[phaseActiveIndex].value !== 0 ? headRef.current?.offsetHeight : 0
  const phaseOffset = phases[phaseActiveIndex]?.offsetUp || 0
  const offset = headerHeight + phaseOffset
  const newY = (((phases[phaseActiveIndex].value * vh) / 100) - offset) * -1;
  vh = useViewPortHeight(() => {
    api.start({
      y: newY,
      immediate: true,
    });
  })



  // const getInitAnimationConfig = useCallback(
  //   (customVh?: number) => {
  //     const viewHeight = customVh || vh;
  //     return initWithNoAnimation
  //       ? {
  //           y: newY,
  //           immediate: true,
  //         }
  //       : {
  //           from : {
  //             y: headRef.current ? viewHeight : 0
  //           },
  //           to: {
  //             y: newY,
  //           },
  //         };
  //   },
  //   [vh, phases.length, phaseActiveIndex, initWithNoAnimation, headRef.current],
  // );


  useEffect(() => {
    if (document.querySelector('[data-is-interactive=true]')) return;
    api.start(getInitAnimationConfig(vh, initWithNoAnimation, !!headRef.current, newY));
  }, [vh, api, phaseActiveIndex, headRef, phases.length]);

  return { vh, style, api };
}
