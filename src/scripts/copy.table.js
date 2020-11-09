function clearGlobalSecondaryIndexes(GlobalSecondaryIndexes) {
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

export default async function copyTable(fromTable, toTable, environmentFrom, environmentTo) {
  const { Table } = await environment.db
    .describeTable({ TableName: fromTable })
    .promise();

  const { KeySchema, AttributeDefinitions, GlobalSecondaryIndexes, ProvisionedThroughput } = Table;

  const newTableDescription = {
    TableName: toTable,
    KeySchema,
    AttributeDefinitions,
    GlobalSecondaryIndexes: clearGlobalSecondaryIndexes(GlobalSecondaryIndexes),
    ProvisionedThroughput: {
      ReadCapacityUnits: ProvisionedThroughput.ReadCapacityUnits,
      WriteCapacityUnits: ProvisionedThroughput.WriteCapacityUnits,
    },
  };

  return environment.db.createTable(newTableDescription).promise();
}
