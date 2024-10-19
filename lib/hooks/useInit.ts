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

let FirstCall = true;

export default function useInit({
  phases,
  phaseActiveIndex,
  initWithNoAnimation = false,
  hasHeader,
}: Props) {
  function getVH() {
    if (FirstCall) return -1;
    return Math.max(document.documentElement.clientHeight, window.innerHeight);
  }

  const [vh, setVH] = useState(getVH());

  const getInitAnimationConfig = useCallback(
    (customVh?: number) => {
      const viewHeight = customVh || vh;

      return initWithNoAnimation
        ? {
            y: ((phases[phaseActiveIndex].value * viewHeight) / 100) * -1,
            immediate: true,
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
    },
    [vh, phases, phaseActiveIndex, initWithNoAnimation, hasHeader],
  );

  const [style, api] = useSpring(getInitAnimationConfig);

  useEffect(() => {
    if (vh === -1) {
      const viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight,
      );
      setVH(viewHeight);

      // react state update is asynchronous, so we have to pass the new vh to this function
      api.start(getInitAnimationConfig(viewHeight));
    }
  }, [vh, api, getInitAnimationConfig]);

  useLayoutEffect(() => {
    if (!FirstCall) {
      api.start({ y: ((phases[phaseActiveIndex].value * vh) / 100) * -1 });
    }

    FirstCall = false;

    document.body.style.overflow = "hidden";

    const handleResize = () => {
      const newVH = getVH();
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
  }, [phaseActiveIndex, api, vh, phases]);

  return { vh, style, api };
}
