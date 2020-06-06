import { window } from "vscode";

import { Dictionary } from "./render";
import { Question, QuestionAlternative, Questions } from "./config";
import { pick } from "./utils";

// NOTE: The empty type expresses `any`, excluding `null` and `undefined`
export type Answer = {};
export type Answers = Dictionary<Answer>;

const prompt = async (question: string, defaultValue?: string) => {
  const answer = await window.showInputBox({
    prompt: question,
    placeHolder: defaultValue,
  });
  return answer || defaultValue;
};

async function promptAnswers(
  questions: [string, Question][],
): Promise<[string, Answer | undefined][]> {
  const [first, ...rest] = questions;
  const [key, question] = first;
  const answer =
    typeof question === "string"
      ? await prompt(question)
      : Array.isArray(question)
      ? await pick(
          "Pick one!",
          question.map(({ displayName: label, value }) => ({ label, value })),
        )
      : await prompt(question.displayName, question.defaultValue);
  return rest.length > 0
    ? [[key, answer], ...(await promptAnswers(rest))]
    : [[key, answer]];
}

export default async function ask(
  questions: Questions | undefined,
): Promise<Answers | undefined> {
  if (!questions) return {};
  const answers = await promptAnswers(Object.entries(questions));

  // NOTE: `undefined` means the user cancelled (https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)
  if (answers.some(([, value]) => typeof value === "undefined")) return;

  return answers
    .filter(([, value]) => typeof value !== "undefined")
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
