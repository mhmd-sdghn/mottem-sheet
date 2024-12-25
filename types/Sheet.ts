import { PropsWithChildren, CSSProperties } from "react";
import { Phase } from "./phase";
import { SpringValue } from "@react-spring/web";

export interface BottomSheetProps extends PropsWithChildren {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}
export interface SheetProps extends PropsWithChildren {
  isOpen?: boolean;
  setIsOpen?: (status: boolean) => void;
  phaseActiveIndex: number;
  setPhaseActiveIndex: (index: number) => void;
  initWithNoAnimation?: boolean;
  phases: Phase[];
  onActiveIndexChange?: (index: number) => void;
  phaseThreshold?: number;
  expandedPhasePositionOffset?: number;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  keepHeadOpen?: boolean;
}

export interface SheetNoHeadProps extends PropsWithChildren {
  activePhase: Phase;
  isScrollLocked: boolean;
  setIsScrollLocked: (status: boolean) => void;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
  className?: string;
}

export interface SheetWithHeadProps extends PropsWithChildren {
  activePhase: Phase;
  isScrollLocked: boolean;
  handleScrollYChange: (value: number, last: boolean, down: boolean) => void;
  style: { y: SpringValue<number> };
  others?: never;
  bodyClassName?: string;
  bodyStyle?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  setIsScrollLocked: (status: boolean) => void;
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
