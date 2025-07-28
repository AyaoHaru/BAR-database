exports.handler = async function(event, context) {
  const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
  const DATABASE_ID = '23e78abfd47880d39f15c9bcb6a36823';

  const body = JSON.parse(event.body);

  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      filter: {
        property: 'ID',
        rich_text: { equals: body.id }
      }
    })
  });

  const data = await res.json();
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(data)
  };
};
