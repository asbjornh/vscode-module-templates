import * as fs from "fs";
import * as fse from "fs-extra";
import { Uri, window, workspace } from "vscode";

import { Config, Template } from "./config";

export function getConfig() {
  return workspace.getConfiguration("module-templates") as Config;
}

export function createFiles(
  moduleName: string,
  uri: Uri | undefined,
  template: Template
) {
  // const root = workspace.workspaceFolders?.[0].uri.fsPath;
  // const path = uri?.fsPath || template.defaultPath || root;
  const root = uri?.fsPath || workspace.workspaceFolders?.[0].uri.fsPath;
  const path =
    template.defaultPath && root ? `${root}/${template.defaultPath}` : root;

  if (!path) {
    const msg =
      "No output path found. Consider adding a 'defaultPath' to your template.";
    window.showErrorMessage(msg);
    throw new Error(msg);
  }

  const folderName = template.folder
    ? template.folder.replace(/{name}/g, moduleName)
    : undefined;
  const fullPath = folderName ? `${path}/${folderName}` : path;

  fse.ensureDirSync(fullPath);

  template.files.forEach(({ name, content }) => {
    const fileName = name.replace(/{name}/g, moduleName);
    const fileContent = content
      .map(line => line.replace(/{name}/g, moduleName))
      .join("\n");
    fs.writeFileSync(`${fullPath}/${fileName}`, fileContent);
  });
}
