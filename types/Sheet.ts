import { PropsWithChildren } from "react";
import { Phase } from "./phase";
import { SpringValue } from "@react-spring/web";

export interface BottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  initPhaseActiveIndex: number;
  showDragArea?: boolean;
  middlePhases: Phase[];
  setIsOpen: (status: boolean) => void;
  onActiveIndexChange?: (index: number) => void;
}

export interface BottomSheetNoHeadProps extends PropsWithChildren {
  activePhase: Phase;
  showDragArea?: boolean;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}

export interface BottomSheetWithHeadProps extends PropsWithChildren {
  activePhase: Phase;
  showDragArea?: boolean;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}
