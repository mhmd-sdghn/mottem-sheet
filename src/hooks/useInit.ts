import { useEffect, useState, RefObject, useLayoutEffect } from "react";
import type { Phase } from "../../types/phase.ts";
import { useSpring } from "@react-spring/web";

interface Props {
  headRef: RefObject<HTMLDivElement>;
  initPhase: Phase;
  phaseActiveIndex: number;
}

export default function useInit({
  headRef,
  initPhase,
  phaseActiveIndex,
}: Props) {
  function getVH() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight);
  }

  const [vh, setVH] = useState(getVH());

  const [style, api] = useSpring(() => ({
    y: ((initPhase.value * vh) / 100) * -1,
  }));

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

  useEffect(() => {
    // initial height based on active phase (header mode)
    if (headRef.current && phaseActiveIndex !== 0) {
      const distanceFromTop = ((vh * initPhase.value) / 100) * -1;
      const headHeight = headRef.current.offsetHeight;

      api.start({ y: distanceFromTop + headHeight, immediate: true });
    }
  }, []);

  return { vh, style, api };
}
