import * as fs from "fs";
import { Uri, window, workspace } from "vscode";

export function createFile(name: string, uri: Uri | undefined) {
  const path = uri
    ? uri.fsPath
    : workspace.workspaceFolders
    ? workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  if (!path) {
    window.showErrorMessage("No output path found");
    throw new Error("No path found");
  }

  fs.writeFileSync(`${path}/${name}.js`, "const a = 1;");
}
