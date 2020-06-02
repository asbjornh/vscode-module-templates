import { Uri, window, workspace } from "vscode";

import { Config, Engine, engines } from "./config";

export function showErrorAndThrow(message: string): never {
  window.showErrorMessage(message);
  throw new Error(message);
}

export function getConfig(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  const wsFolder = currentUri && workspace.getWorkspaceFolder(currentUri);
  return workspace.getConfiguration("module-templates", wsFolder) as Config;
}

export function getEngine(uri: Uri | undefined): Engine {
  const engine = getConfig(uri).engine || "legacy";

  if (!engines.includes(engine)) {
    showErrorAndThrow(`Unknown template engine '${engine}'`);
  }

  return engine;
}

export function getFolderPath(
  uri: Uri | undefined,
  folderName: string | undefined,
  defaultPath: string | undefined,
) {
  const workspaceRoot = workspace.workspaceFolders?.[0].uri.fsPath;

  if (!workspaceRoot && !uri) {
    showErrorAndThrow(
      "When running 'New From Template' from the command palette, you must be in a workspace",
    );
  }

  const root = uri?.fsPath
    ? uri.fsPath
    : defaultPath
    ? `${workspaceRoot}/${defaultPath}`
    : workspaceRoot;

  return folderName ? `${root}/${folderName}` : root;
}
