const fetch = require('node-fetch');

exports.handler = async function(event, context) {

  const body = JSON.parse(event.body);
  const { Client } = require('@notionhq/client');

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  (async () => {
    const databaseId = '23e78abfd47880d39f15c9bcb6a36823';
    const response = await notion.databases.retrieve({ database_id: databaseId});
    console.log(response);
  })();

  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(data)
  };
};
