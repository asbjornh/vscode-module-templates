import * as fs from "fs";
import { workspace } from "vscode";

export function createFile(name: string) {
  const path = workspace.workspaceFolders
    ? workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  if (!path) {
    throw new Error("No path found");
  }

  fs.writeFileSync(`${path}/${name}.js`, "const a = 1;");
}
