export interface ProjectStageDetailData {
  label: string;
  value: string;
  icons?: readonly ProjectStageVisualData[];
}

export interface ProjectStageVisualData {
  alt: string;
  src: string;
}

export interface ProjectStageItemData {
  index: string;
  eyebrow: string;
  title: string;
  description: ProjectStageDetailData;
  stack: ProjectStageDetailData;
  visual?: ProjectStageVisualData;
}

export interface ProjectStageVisualState {
  opacity: string;
  pointerEvents: string;
  transform: string;
  zIndex: string;
}
