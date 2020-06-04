import { Uri, window, workspace } from "vscode";
import * as path from "path";
import * as fse from "fs-extra";
import untildify from "untildify";

import { Config, Engine, engines } from "./config";

export function showErrorAndThrow(message: string): never {
  window.showErrorMessage(message);
  throw new Error(message);
}

export function showModal(message: string) {
  window.showInformationMessage(message, { modal: true });
}

function getWorkspaceRoot(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  return currentUri && workspace.getWorkspaceFolder(currentUri);
}

function resolveFilePath(uri: Uri | undefined, filePath: string) {
  if (path.isAbsolute(filePath)) return filePath;
  if (filePath.startsWith("~")) return untildify(filePath);
  const root = getWorkspaceRoot(uri);
  return root
    ? path.resolve(root.uri.fsPath, "./.vscode", filePath)
    : showErrorAndThrow(`Couldn't resolve path for file '${filePath}'`);
}

// Reads a json file from an absolute path or a path relative to the `.vscode/settings.json` file for the current workspace
export function readJson(uri: Uri | undefined, filePath: string) {
  const resolvedPath = resolveFilePath(uri, filePath);
  return fse.pathExistsSync(resolvedPath)
    ? fse.readJsonSync(resolvedPath)
    : showErrorAndThrow(`File not found: '${resolvedPath}'`);
}

export function getConfig(uri: Uri | undefined) {
  return workspace.getConfiguration(
    "module-templates",
    getWorkspaceRoot(uri),
  ) as Config;
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
