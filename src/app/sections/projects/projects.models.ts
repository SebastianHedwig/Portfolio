export interface ProjectStageDetailData {
  label: string;
  value: string;
}

export interface ProjectStageItemData {
  index: string;
  eyebrow: string;
  title: string;
  description: ProjectStageDetailData;
  stack: ProjectStageDetailData;
}

export interface ProjectStageVisualState {
  opacity: string;
  pointerEvents: string;
  transform: string;
  zIndex: string;
}
