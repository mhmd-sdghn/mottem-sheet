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
    if (typeof window === "undefined") return -1;
    return Math.max(document.documentElement.clientHeight, window.innerHeight);
  }

  const [vh, setVH] = useState(getVH());

  const [style, api] = useSpring(() =>
    initWithNoAnimation
      ? {
          y:
            vh === -1
              ? "-100vh"
              : ((phases[phaseActiveIndex].value * vh) / 100) * -1,
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
    if (!FirstCall)
      api.start({ y: ((phases[phaseActiveIndex].value * vh) / 100) * -1 });

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
