import { useState, RefObject, useLayoutEffect } from "react";
import type { Phase } from "@appTypes/phase.ts";
import { useSpring } from "@react-spring/web";

interface Props {
  headRef: RefObject<HTMLDivElement>;
  phases: Phase[];
  phaseActiveIndex: number;
  initWithNoAnimation?: boolean;
  hasHeader: boolean;
}

let FirstCall = true;

export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  hasHeader,
}: Props) {
  function getVH() {
    const isSsr = typeof window === "undefined";
    if (isSsr) return -1;
    return Math.max(document.documentElement.clientHeight, window.innerHeight);
  }

  const [vh, setVH] = useState(-1);

  const getInitAnimationConfig = (customVh?: number) => {
    const viewHeight = customVh || vh;

    return initWithNoAnimation
      ? {
          y: ((phases[phaseActiveIndex].value * viewHeight) / 100) * -1,
        }
      : {
          from: {
            y: hasHeader ? viewHeight : 0,
          },
          to: {
            y: hasHeader
              ? 0
              : ((phases[phaseActiveIndex].value * viewHeight) / 100) * -1,
          },
        };
  };

  const [style, api] = useSpring(getInitAnimationConfig);

  useLayoutEffect(() => {
    if (!FirstCall) {
      api.start({ y: ((phases[phaseActiveIndex].value * vh) / 100) * -1 });
    } else if (vh === -1) {
      const viewHeight = getVH();
      setVH(viewHeight);
      api.start({
        ...getInitAnimationConfig(viewHeight),
        immediate: initWithNoAnimation,
      });
    }

    FirstCall = false;

    document.body.style.overflow = "hidden";

    const handleResize = () => {
      setVH(getVH());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.addEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [phaseActiveIndex]);

  return { vh, style, api };
}
