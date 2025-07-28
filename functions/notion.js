const { Client } = require('@notionhq/client');

exports.handler = async function(event, context) {
  try {
    const { id } = JSON.parse(event.body);

    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const databaseId = '23e78abfd47880d39f15c9bcb6a36823';

    // Query the database with a filter on the 'ID' property (assuming it's a text property)
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'ID',   // Make sure this matches your Notion property name exactly
        rich_text: {
          equals: id
        }
      }
    });

    if (response.results.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No record found for this ID' })
      };
    }

    // Extract relevant info from the first matching page
    const page = response.results[0];
    // Example: get Stock and Coins from page properties
    const stock = page.properties.Stock?.rich_text[0]?.plain_text || 'N/A';
    const coins = page.properties.Coins?.rich_text[0]?.plain_text || 'N/A';

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ stock, coins })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
