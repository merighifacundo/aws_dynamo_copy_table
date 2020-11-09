import askDynamoEnvironment from "./src/questions/aws.setup.js";
import askTableToCopy from "./src/questions/table.picker.js";
import copyTable from "./src/scripts/copy.table.js";

async function main() {
  try {
		console.log(`\n\n\nWelcome to AWS DynamoDB copy table Utility developed by Facundo Merighi\n\n`);
		const environment = await askDynamoEnvironment();
		const table = await askTableToCopy(environment);
		console.log(table);
		const copyResult = await copyTable(table.sourceTable, table.destinationTable, environment);
		console.log(`Copy structure done ${JSON.stringify(copyResult)}`);
  } catch (error) {
		console.log("Handled error ");
		console.error(error);
	}
}

main();