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

export type Config = {
  templates?: Template[];
};
