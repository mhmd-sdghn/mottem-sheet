import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import type { Phase } from "@appTypes/phase.ts";
import { useSpring } from "@react-spring/web";

interface Props {
  headRef: RefObject<HTMLDivElement>;
  phases: Phase[];
  phaseActiveIndex: number;
  initWithNoAnimation?: boolean;
  hasHeader: boolean;
}


export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  hasHeader,
  headRef
}: Props) {

  const [vh, setVH] = useState(-1);
  const headerHeight = headRef.current?.offsetHeight && phases[phaseActiveIndex].value !== 0 ? headRef.current?.offsetHeight : 0
  const phaseOffset = phases[phaseActiveIndex]?.offsetUp || 0
  const offset = headerHeight + phaseOffset
  const newY = (((phases[phaseActiveIndex].value * vh) / 100) - offset) * -1;

  const getInitAnimationConfig = useCallback(
    (customVh?: number) => {
      const viewHeight = customVh || vh;
      return initWithNoAnimation
        ? {
            y: newY,
            immediate: true,
          }
        : {
            from : {
              y: headRef.current ? viewHeight : 0
            },
            to: {
              y: newY,
            },
          };
    },
    [vh, phases.length, phaseActiveIndex, initWithNoAnimation, headRef.current],
  );

  const [style, api] = useSpring(getInitAnimationConfig);

  useEffect(() => {

    if (document.querySelector('[data-is-interactive=true]')) return;


    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight,
    );
    setVH(viewHeight);

    // react state update is asynchronous, so we have to pass the new vh to this function
    api.start(getInitAnimationConfig(viewHeight));
  }, [vh, api, getInitAnimationConfig, phaseActiveIndex, headRef, phases.length]);

  useLayoutEffect(() => {

    document.body.style.overflow = "hidden";

    const handleResize = () => {
      const newVH =  Math.max(
        document.documentElement.clientHeight,
        window.innerHeight,
      );
      setVH(newVH);

      api.start({
        y: ((phases[phaseActiveIndex].value * newVH) / 100) * -1,
        immediate: true,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [phaseActiveIndex, api, vh, hasHeader, headRef, phases.length]);

  return { vh, style, api };
}
