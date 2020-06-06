export type FileTemplate = {
  name: string;
  open?: boolean;
  content: string[];
};

type QuestionObj = {
  defaultValue: string;
  displayName: string;
};

export type QuestionAlternative = {
  displayName: string;
  value: {};
};

export type Question = string | QuestionObj | QuestionAlternative[];
export type Questions = { [key: string]: Question };

export type Template = {
  displayName?: string;
  defaultPath?: string;
  extends?: string[];
  files: FileTemplate[];
  folder?: string;
  hidden?: boolean;
  id?: string;
  questions?: Questions;
};

const enginesDict = {
  legacy: "legacy",
  handlebars: "handlebars",
};

export const engines = Object.values(enginesDict);

export type Engine = keyof typeof enginesDict;

export type Globals = { [key: string]: any };

export type Config = {
  engine?: Engine;
  globals?: string | Globals,
  templates?: Template[];
  templateFiles?: string[];
};
