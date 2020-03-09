export type FileTemplate = {
  name: string;
  content: string[];
};

export type Template = {
  displayName: string;
  defaultPath?: string;
  files: FileTemplate[];
  folder?: string;
  questions?: { [key: string]: string };
};

export type Config = {
  templates?: Template[];
};
