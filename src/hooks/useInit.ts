import { useState, RefObject, useLayoutEffect } from "react";
import type { Phase } from "~types/phase.ts";
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
}: Props) {
  function getVH() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight);
  }

  const [vh, setVH] = useState(getVH());

  const [style, api] = useSpring(() =>
    initWithNoAnimation
      ? {
          y: ((phases[phaseActiveIndex].value * vh) / 100) * -1,
        }
      : {
          from: {
            // opacity: 0,
            y: hasHeader ? vh : 0,
          },
          to: {
            // opacity: 1,
            y: hasHeader
              ? 0
              : ((phases[phaseActiveIndex].value * vh) / 100) * -1,
          },
        },
  );

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";
    const handleResize = () => {
      setVH(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.addEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, []);

  return { vh, style, api };
}
