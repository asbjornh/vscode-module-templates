import * as fs from "fs";
import * as fse from "fs-extra";
import { Uri, window, workspace } from "vscode";
import { pascalCase, paramCase, camelCase, snakeCase } from "change-case";

import { Config, Template } from "./config";

export function getConfig() {
  return workspace.getConfiguration("module-templates") as Config;
}

const replaceTokens = (input: string, newValue: string) =>
  input
    .replace(/{name\.raw}/g, newValue)
    .replace(/{name\.pascal}/g, pascalCase(newValue))
    .replace(/{name\.kebab}/g, paramCase(newValue))
    .replace(/{name\.camel}/g, camelCase(newValue))
    .replace(/{name\.snake}/g, snakeCase(newValue));

export function createFiles(
  moduleName: string,
  uri: Uri | undefined,
  template: Template
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
    ? replaceTokens(template.folder, moduleName)
    : undefined;
  const fullPath = folderName ? `${path}/${folderName}` : path;

  fse.ensureDirSync(fullPath);

  template.files.forEach(({ name, content }) => {
    const fileName = replaceTokens(name, moduleName);
    const fileContent = content
      .map(line => replaceTokens(line, moduleName))
      .join("\n");
    fs.writeFileSync(`${fullPath}/${fileName}`, fileContent);
  });
}
