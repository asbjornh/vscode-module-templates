import * as fse from "fs-extra";
import { Uri, window, workspace } from "vscode";
import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

import { Config, Template } from "./config";

export function getConfig(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  const wsFolder = currentUri && workspace.getWorkspaceFolder(currentUri);
  return workspace.getConfiguration("module-templates", wsFolder) as Config;
}

const pattern = (name, type) => new RegExp(`{${name}\.${type}}`, "g");

const replaceToken = (input: string, name: string, value: string) =>
  input
    .replace(pattern(name, "raw"), value)
    .replace(pattern(name, "pascal"), pascalCase(value))
    .replace(pattern(name, "kebab"), paramCase(value))
    .replace(pattern(name, "camel"), camelCase(value))
    .replace(pattern(name, "snake"), snakeCase(value));

const replaceManyTokens = (
  input: string,
  tokenMap: { [key: string]: string }
) =>
  Object.entries(tokenMap).reduce(
    (acc, [name, value]) => replaceToken(acc, name, value),
    input
  );

const replaceName = (input: string, value: string) =>
  replaceToken(input, "name", value);

export function createFiles(
  moduleName: string,
  uri: Uri | undefined,
  template: Template,
  answers: { [key: string]: string }
) {
  const workspaceRoot = workspace.workspaceFolders?.[0].uri.fsPath;

  if (!workspaceRoot && !uri) {
    window.showErrorMessage(
      "When running 'New From Template' from the command palette, you must be in a workspace"
    );
    return;
  }

  const path = uri?.fsPath
    ? uri.fsPath
    : template.defaultPath
    ? `${workspaceRoot}/${template.defaultPath}`
    : workspaceRoot;

  const folderName = template.folder
    ? replaceName(template.folder, moduleName)
    : undefined;
  const fullPath = folderName ? `${path}/${folderName}` : path;

  template.files.forEach(({ name, content }) => {
    const fileName = replaceName(name, moduleName);
    const fileContent = content
      .map(line => replaceName(line, moduleName))
      .map(line => replaceManyTokens(line, answers))
      .join("\n");
    fse.outputFileSync(`${fullPath}/${fileName}`, fileContent);
  });
}
