import { Uri, window } from "vscode";

import { getConfig } from "./utils";
import { Template } from "./config";
import { readJson, showErrorAndThrow } from "./utils";

export default async function getTemplate(uri: Uri | undefined) {
  const config = getConfig(uri);
  const templatesFromConfig = config.templates || [];
  const templateFiles = config.templateFiles || [];

  const templatesFromFiles: Template[] = templateFiles
    .map(filePath => {
      const json = readJson(uri, filePath);
      return Array.isArray(json)
        ? json
        : showErrorAndThrow(`Content in '${filePath}' is not an array`);
    })
    .flat();

  const templates = [...templatesFromFiles, ...templatesFromConfig];

  if (templates.length === 0) {
    showErrorAndThrow(
      "No templates found. Add some to your user, workspace or folder settings!",
    );
  }

  if (templates.length === 1) {
    const [firstTemplate] = templates;
    return resolveInheritance(firstTemplate, templates);
  } else {
    const result = await window.showQuickPick(
      templates
        .filter(({ displayName }) => displayName)
        .map(template => ({
          label: template.displayName!,
          value: template,
        })),
      { placeHolder: "Select a template" },
    );
    return result ? resolveInheritance(result.value, templates) : undefined;
  }
}

function resolveInheritance(template: Template, templates: Template[]) {
  if (!template.extends || template.extends.length === 0) return template;

  const inheritedData = template.extends.map(id => {
    const data = templates.find(template => template.id === id);
    if (!data) {
      const msg = `Template extends '${id}', which was not found.`;
      window.showErrorMessage(msg);
      throw Error(msg);
    }
    return resolveInheritance(data, templates);
  });

  const combined: Template = [...inheritedData, template].reduce(
    (accum: Template, data) => ({
      ...accum,
      ...data,
      extends: [],
      files: [...accum.files, ...data.files],
      id: template.id,
      questions: { ...accum.questions, ...data.questions },
    }),
    { displayName: template.displayName, files: [] },
  );
  return combined;
}
