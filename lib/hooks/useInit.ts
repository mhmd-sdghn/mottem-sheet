import {
  RefObject,
  useEffect
} from "react";
import type { Phase } from "@appTypes/phase.ts";
import { useSpring } from "@react-spring/web";
import useViewPortHeight from "@lib/hooks/useViewPortHeight.ts";
import getInitAnimationConfig from '../utils/getInitAnimationConfig'
import calculateNewY from '../utils/calculateNewY.ts'

interface Props {
  headRef: RefObject<HTMLDivElement>;
  phases: Phase[];
  phaseActiveIndex: number
  initWithNoAnimation?: boolean;
}


let first_mounted = true;
let first_mount_timer : ReturnType<typeof setTimeout>;
export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  headRef
}: Props) {

  const vh = useViewPortHeight(() => {
    api.start({
      y: newY,
      immediate: true,
    });
  })
  const [style, api] = useSpring(getInitAnimationConfig);
  const newY = calculateNewY(vh, (headRef.current?.offsetHeight || 0), phases[phaseActiveIndex])


  useEffect(() => {
    if (document.querySelector('[data-is-interactive=true]')) return;


    api.start(getInitAnimationConfig(vh, initWithNoAnimation, !!headRef.current, newY, first_mounted));


   if (first_mounted) {
     clearTimeout(first_mount_timer)
     first_mount_timer = setTimeout(() => {
       first_mounted= false
     } , 200)
   }




  }, [vh, api, phaseActiveIndex, headRef, phases.length]);

  return { vh, style, api };
}
