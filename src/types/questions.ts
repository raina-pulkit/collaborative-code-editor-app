export enum DifficultyEnum {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme',
}

export type QuestionDto = {
  title: string;
  description: string;
  difficulty: DifficultyEnum;
};

export type Question = {
  id: number;
  title: string;
  description: string;
  difficulty: DifficultyEnum;
  createdAt: Date;
};
