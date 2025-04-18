import {
  RefObject,
  useEffect, useState
} from "react";
import type { Phase } from "@appTypes/phase.ts";
import { useSpring } from "@react-spring/web";
import useViewPortHeight from "@lib/hooks/useViewPortHeight.ts";
import getInitAnimationConfig from '../utils/getInitAnimationConfig'
import calculateNewY from '../utils/calculateNewY.ts'

interface Props {
  headRef: RefObject<HTMLDivElement>;
  bodyRef: RefObject<HTMLDivElement>;
  phases: Phase[];
  phaseActiveIndex: number
  initWithNoAnimation?: boolean;
}

export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  headRef,
  bodyRef
}: Props) {

  const [initialAnimationIsActive , setInitialAnimationIsActive] = useState(true)
  const vh = useViewPortHeight(() => {
    api.start({
      y: newY,
      immediate: true,
    });
  })
  const [style, api] = useSpring(getInitAnimationConfig);
  const newY = calculateNewY(vh, (headRef.current?.offsetHeight || 0), phases[phaseActiveIndex])


  const isElementInteractive = () => {
    const selector = '[data-mottem-sheet-is-interactive=true]';
    return !!headRef?.current?.querySelector(selector) ||
      !!bodyRef?.current?.querySelector(selector);
  };

  useEffect(() => {
    if (vh === -1 || isElementInteractive()) {
      return;
    }

    api.start(getInitAnimationConfig(vh, initWithNoAnimation, !!headRef.current, newY, initialAnimationIsActive));

    setInitialAnimationIsActive(false)

  }, [vh, api, phaseActiveIndex, headRef, phases.length]);

  return { vh, style, api };
}
