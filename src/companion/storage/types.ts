export type ImportantEvent = {
  id: string;
  text: string;
  date: string;
};

export type CompanionSave = {
  version: 1;
  userNickname: string;
  companionCallsUser: string;
  preferences: string[];
  importantEvents: ImportantEvent[];
  affection: number;
  updatedAt: string;
};

export type CompanionMemoryPayload = {
  userNickname?: string;
  companionCallsUser?: string;
  preferences?: string[];
  importantEvents?: { text: string; date?: string }[];
};
