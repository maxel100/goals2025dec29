export interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}