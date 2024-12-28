import type { Phase } from "../../types/phase";


const calculateNewY = (vh =  -1, headerHeight: number, activePhase: Phase) => {
  const _headerHeight = headerHeight && activePhase.value !== 0 ? headerHeight : 0
  const phaseOffset = activePhase?.offsetUp || 0
  const offset = _headerHeight + phaseOffset
  return (((activePhase.value * vh) / 100) - offset) * -1;
}

export default calculateNewY