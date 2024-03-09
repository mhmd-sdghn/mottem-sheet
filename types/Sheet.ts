import { PropsWithChildren } from "react";
import { Phase } from "./phase";
import { SpringValue } from "@react-spring/web";

export interface BottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}
export interface SheetProps extends PropsWithChildren {
  isOpen?: boolean;
  setIsOpen?: (status: boolean) => void;
  initPhaseActiveIndex: number;
  initWithNoAnimation?: boolean;
  middlePhases: Phase[];
  onActiveIndexChange?: (index: number) => void;
  phaseThreshold?: number;
}

export interface SheetNoHeadProps extends PropsWithChildren {
  activePhase: Phase;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}

export interface SheetWithHeadProps extends PropsWithChildren {
  activePhase: Phase;
  isScrollLocked: boolean;
  setIsDragLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
}

export enum ChildrenNames {
  SHEET_HEAD = "SheetHead",
  SHEET_BODY = "SheetBody",
}

export enum PhaseTargetDirections {
  NEXT = "NEXT_PHASE",
  PRE = "PREVIOUS_PHASE",
  CURRENT = "CURRENT_PHASE",
}

export enum FinalAnimDirection {
  UP = "UP",
  DOWN = "DOWN",
}
