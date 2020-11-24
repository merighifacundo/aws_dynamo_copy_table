#!/usr/bin/env node

import askDynamoEnvironment, {askSameEnvironment} from "./src/questions/aws.setup.js";
import askTableToCopy from "./src/questions/table.picker.js";
import copyTable from "./src/scripts/copy.table.js";

async function main() {
  try {
		console.log(`\nWelcome to AWS DynamoDB copy table Utility developed by Facundo Merighi\n`);
		const environmentSource = await askDynamoEnvironment("Please provide the information of the source AWS account");;
		const response = await askSameEnvironment();
		console.log(response.sameEnvironment);
		let environmentDestination = null;
		if (response.sameEnvironment === 'Yes') {
			environmentDestination = environmentSource;
		} else {
			environmentDestination = await askDynamoEnvironment("Please provide the information of the destination AWS account");;
		}
		const table = await askTableToCopy(environmentSource);
		const copyResult = await copyTable(table.sourceTable, table.destinationTable, environmentSource, environmentDestination);
		console.log(`Copy structure done ${JSON.stringify(copyResult)}`);
  } catch (error) {
		console.log("Handled error ");
		console.error(error);
	}
}

main();