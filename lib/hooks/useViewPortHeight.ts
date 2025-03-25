import { useLayoutEffect, useState } from "react";

export default function useViewPortHeight(
  afterViewPortUpdate: (newVH: number) => void,
) {
  const [vh, setVH] = useState(-1);

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden";

    function handleResize() {
      const newVH = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight,
      );
      setVH(newVH);

      afterViewPortUpdate(newVH);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, []);

  return vh;
}
