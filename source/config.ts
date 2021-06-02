export type FileTemplate = {
  name: string;
  open?: boolean;
  content?: string[];
  contentFile?: string;
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

export interface TemplateWithoutId {
  displayName?: string;
  defaultPath?: string;
  extends?: string[];
  files?: FileTemplate[];
  folder?: string;
  questions?: Questions;
}

export interface Template extends TemplateWithoutId {
  id?: string;
}

const enginesDict = {
  legacy: "legacy",
  handlebars: "handlebars",
};

export const engines = Object.values(enginesDict);

export type Engine = keyof typeof enginesDict;

export type TemplatesObj = {
  [id: string]: TemplateWithoutId;
};

export type Config = {
  engine?: Engine;
  handlebarsConfig?: string;
  templates?: Template[] | TemplatesObj;
  templateFiles?: string[];
};
