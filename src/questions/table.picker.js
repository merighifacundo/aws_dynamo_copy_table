import inquirer from "inquirer";

function buildQuestion(tables) {
  return [
    {
      type: "list",
      name: "sourceTable",
      message: "What table do you want to copy?",
      choices: tables,
    },
    {
      type: "input",
      name: "destinationTable",
      message: "What is the destination name of the table?",
    },
  ];
}

export default async function askTableToCopy(environment) {
  const table = await inquirer.prompt(
    buildQuestion(environment.tables.TableNames)
  );
  return table;
}
