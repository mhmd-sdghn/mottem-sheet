import { PropsWithChildren } from "react";
import { Phase } from "./phase";
import { SpringValue } from "@react-spring/web";

export interface BottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}
export interface SheetProps extends PropsWithChildren {
  setIsOpen?: (status: boolean) => void;
  initPhaseActiveIndex: number;
  showDragArea?: boolean;
  middlePhases: Phase[];
  onActiveIndexChange?: (index: number) => void;
}

export interface SheetNoHeadProps extends PropsWithChildren {
  activePhase: Phase;
  showDragArea?: boolean;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}

export interface SheetWithHeadProps extends PropsWithChildren {
  activePhase: Phase;
  showDragArea?: boolean;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}
