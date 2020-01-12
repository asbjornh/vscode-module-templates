export type FileTemplate = {
  name: string;
  content: string[];
};

export type Template = {
  displayName: string;
  defaultPath?: string;
  files: FileTemplate[];
  folder?: string;
};

export type Config = {
  templates?: Template[];
};
