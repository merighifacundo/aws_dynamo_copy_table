
import AWS  from 'aws-sdk';
import inquirer from 'inquirer';

const awsRegions = {
  "us-east-1": "US East (N. Virginia)",
  "us-east-2": "US East (Ohio)",
  "us-west-1": "US West (N. California)",
  "us-west-2": "US West (Oregon)",
  "ca-central-1": "Canada (Central)",
  "eu-west-1": "EU (Ireland)",
  "eu-central-1": "EU (Frankfurt)",
  "eu-west-2": "EU (London)",
  "eu-west-3": "EU (Paris)",
  "eu-north-1": "EU (Stockholm)",
  "ap-northeast-1": "Asia Pacific (Tokyo)",
  "ap-northeast-2": "Asia Pacific (Seoul)",
  "ap-southeast-1": "Asia Pacific (Singapore)",
  "ap-southeast-2": "Asia Pacific (Sydney)",
  "ap-south-1": "Asia Pacific (Mumbai)",
  "sa-east-1": "South America (São Paulo)",
  "us-gov-west-1": "US Gov West 1",
  "us-gov-east-1": "US Gov East 1"
};

const questions = [
  {
    type: 'input',
    name: 'accessKeyId',
    message: 'Please write the AWS Access Key Id',
	},
	{
    type: 'password',
    name: 'secretAccessKey',
    message: 'Please write the AWS Secret Access Key?',
	},
	{
		type: 'list',
		name: 'region',
		message: 'What region do you want to operate?',
		choices: Object.keys(awsRegions)
	},
	
];

export async function askSameEnvironment() {
	const awsEnvironment = await inquirer.prompt([	{
		type: 'list',
		name: 'sameEnvironment',
		message: 'Do you want to use the same AWS environment for the destination Table?',
		choices: ['Yes', 'No']
	}]);
	return awsEnvironment;
}

export default async function askDynamoEnvironment(message) {
	console.log(`\n\n${message}\n\n`);
	const awsEnvironment = await inquirer.prompt(questions);
	AWS.config.update(awsEnvironment);
	let db = new AWS.DynamoDB();
	const data = await db.listTables({}).promise();
	return {db: db, tables: data};
}




