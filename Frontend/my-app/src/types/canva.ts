export interface CanvaDto {
  id?: string | null;
  userId: string;
  chatSignture: string;
  content: string;
  isSolved: boolean;
  userAnswer?: string | null;
  canvaType: string;
}
