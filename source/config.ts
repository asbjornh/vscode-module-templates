export type FileTemplate = {
  name: string;
  content: string[];
};

export type Template = {
  displayName?: string;
  defaultPath?: string;
  extends?: string[];
  files: FileTemplate[];
  folder?: string;
  hidden?: boolean;
  id?: string;
  questions?: { [key: string]: string };
};

const enginesDict = {
  legacy: "legacy",
  mustache: "mustache",
};

export const engines = Object.values(enginesDict);

export type Engine = keyof typeof enginesDict;

export type Config = {
  engine?: Engine;
  templates?: Template[];
};
