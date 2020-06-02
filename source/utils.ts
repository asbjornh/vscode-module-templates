import { Uri, window, workspace } from "vscode";

import { Config, Template } from "./config";

export function getConfig(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  const wsFolder = currentUri && workspace.getWorkspaceFolder(currentUri);
  return workspace.getConfiguration("module-templates", wsFolder) as Config;
}

export function getFolderPath(
  uri: Uri | undefined,
  folderName: string | undefined,
  defaultPath: string | undefined,
) {
  const workspaceRoot = workspace.workspaceFolders?.[0].uri.fsPath;

  if (!workspaceRoot && !uri) {
    window.showErrorMessage(
      "When running 'New From Template' from the command palette, you must be in a workspace",
    );
    return;
  }

  const root = uri?.fsPath
    ? uri.fsPath
    : defaultPath
    ? `${workspaceRoot}/${defaultPath}`
    : workspaceRoot;

  return folderName ? `${root}/${folderName}` : root;
}
