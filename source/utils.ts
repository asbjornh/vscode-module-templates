import { Uri, window, workspace, WorkspaceFolder } from "vscode";
import * as path from "path";
import * as fse from "fs-extra";
import * as handlebars from "handlebars";
import untildify from "untildify";

import { Config, Engine, engines } from "./config";

export function showModal(message: string) {
  window.showInformationMessage(message, { modal: true });
}

export async function pick<T>(
  placeHolder,
  alternatives: { label: string; value: T }[],
) {
  const result = await window.showQuickPick(alternatives, { placeHolder });
  return result?.value;
}

// Returns the root folder that matches `uri`, if any. If no `uri` is provided, the uri of the currently open text file is used. If no file is open, one of the available workspace folders is returned (if any).
export async function getCurrentRoot(uri: Uri | undefined) {
  const currentUri = uri || window.activeTextEditor?.document.uri;
  const workspaceFolder = currentUri
    ? workspace.getWorkspaceFolder(currentUri)
    : undefined;

  if (workspaceFolder) return workspaceFolder;

  const roots = workspace.workspaceFolders || [];

  const selectedRoot =
    roots.length === 1
      ? roots[0]
      : roots.length > 1
      ? await pick(
          "You have more than one workspace folder. Which one do you want to use?",
          roots.map(folder => ({ label: folder.name, value: folder })),
        )
      : undefined;

  if (selectedRoot) return selectedRoot;

  throw new Error(`Couldn't determine which folder to use.`);
}

export function resolveFilePath(root: WorkspaceFolder, filePath: string) {
  if (path.isAbsolute(filePath)) return filePath;
  if (filePath.startsWith("~")) return untildify(filePath);
  if (root) return path.resolve(root.uri.fsPath, "./.vscode", filePath);
  throw new Error(`Couldn't resolve path for file '${filePath}'`);
}

// Reads a json file from an absolute path or a path relative to the `.vscode/settings.json` file for the current workspace
export function readJson(root: WorkspaceFolder, filePath: string) {
  const resolvedPath = resolveFilePath(root, filePath);
  if (fse.pathExistsSync(resolvedPath)) return fse.readJsonSync(resolvedPath);
  throw new Error(`File not found: '${resolvedPath}'`);
}

export function readFile(root: WorkspaceFolder, filePath: string) {
  const resolvedPath = resolveFilePath(root, filePath);
  if (fse.pathExistsSync(resolvedPath))
    return fse.readFileSync(resolvedPath, { encoding: "utf8" });
  throw new Error(`File not found: '${resolvedPath}'`);
}

export function getConfig(root: WorkspaceFolder) {
  return workspace.getConfiguration("module-templates", root) as Config;
}

export function getEngine(root: WorkspaceFolder): Engine {
  const engine = getConfig(root).engine || "legacy";

  if (!engines.includes(engine)) {
    throw new Error(`Unknown template engine '${engine}'`);
  }

  return engine;
}

const tryRequire = (path: string) => {
  try {
    // NOTE: Webpack does some shenanigans with `require` when building (this does not happen when debugging the extension in VSCode)
    return eval("require")(path);
  } catch (error) {
    throw new Error(
      `${error.name}: ${error.message} in ${error.stack.split("\n")[0]}`,
    );
  }
};

export function getHbsConfig(root: WorkspaceFolder): Record<string, any> {
  const filePath = getConfig(root).handlebarsConfig;

  if (!filePath) return {};

  const module = tryRequire(resolveFilePath(root, filePath));

  if (typeof module === "object") return module;

  if (typeof module !== "function")
    throw new Error(`File ${filePath} does not export a function`);

  const options = module(handlebars);
  if (options === undefined) return {};
  if (typeof options !== "object")
    throw new Error(`Function in ${filePath} does not return an object.`);

  return options;
}

export function getFolderPath(
  uri: Uri | undefined,
  root: WorkspaceFolder,
  folderName: string | undefined,
  defaultPath: string | undefined,
) {
  if (uri) return folderName ? path.join(uri.fsPath, folderName) : uri.fsPath;
  const rootToUse = defaultPath
    ? path.join(root.uri.fsPath, defaultPath)
    : root.uri.fsPath;
  return folderName ? path.join(rootToUse, folderName) : rootToUse;
}
