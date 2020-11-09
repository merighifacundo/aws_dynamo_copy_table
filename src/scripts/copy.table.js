function clearGlobalSecondaryIndexes(GlobalSecondaryIndexes) {
	if (!GlobalSecondaryIndexes) {
		return null;
	}
  return GlobalSecondaryIndexes.map((index) => {
    const { IndexName, KeySchema, Projection, ProvisionedThroughput } = index;
    return {
      IndexName,
      KeySchema,
      Projection,
      ProvisionedThroughput: {
        ReadCapacityUnits: ProvisionedThroughput.ReadCapacityUnits,
        WriteCapacityUnits: ProvisionedThroughput.WriteCapacityUnits,
      },
    };
  });
}

export async function copyDefinition(fromTable, toTable, environmentFrom, environmentTo) {
	const { Table } = await environmentFrom.db
    .describeTable({ TableName: fromTable })
    .promise();
	console.log(JSON.stringify(Table));
  const { KeySchema, AttributeDefinitions, GlobalSecondaryIndexes, ProvisionedThroughput } = Table;

  let newTableDescription = {
    TableName: toTable,
    KeySchema,
    AttributeDefinitions,
    ProvisionedThroughput: {
      ReadCapacityUnits: ProvisionedThroughput.ReadCapacityUnits,
      WriteCapacityUnits: ProvisionedThroughput.WriteCapacityUnits,
    },
	};
	const globalSecondaryIndex = clearGlobalSecondaryIndexes(GlobalSecondaryIndexes);
	if (globalSecondaryIndex) {
		newTableDescription.GlobalSecondaryIndexes = globalSecondaryIndex;
	}
	console.log(JSON.stringify(newTableDescription));
  return environmentTo.db.createTable(newTableDescription).promise();
}

export async function copyContent(fromTable, toTable, environmentFrom, environmentTo) {
	let params = {
		TableName: fromTable,
	};
	let items = null;
	do {
    items = await environmentFrom.db.scan(params).promise();
		const request = {
			RequestItems: {}
		};
		request.RequestItems[toTable] = items.Items.map(item => {
			return {
				PutRequest: {
					Item: item
				}
			}
		});
		const result = await environmentTo.db.batchWriteItem(request).promise();
		//this is to iterate all the pages.
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey != 'undefined');
}

export default async function copyTable(fromTable, toTable, environmentFrom, environmentTo) {
	const result = await copyDefinition(fromTable, toTable, environmentFrom, environmentTo);
	console.log(JSON.stringify(result));
	const resultSave = await copyContent(fromTable, toTable, environmentFrom, environmentTo)	
	return resultSave;
}
