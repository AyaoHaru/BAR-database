exports.handler = async function (event) {
  const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;
  const NOTION_VERSION = '2022-06-28';
  const body = JSON.parse(event.body);

  try {
    const pageId = body.pageId;
    const stockChange = body.stockChange;

    // 1. Get the current page
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_TOKEN}`,
        'Notion-Version': NOTION_VERSION
      }
    });

    const page = await pageRes.json();
    const currentStock = page.properties?.Stock?.number || 0;
    const newStock = currentStock + stockChange;

    // 2. Update the page
    await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_VERSION
      },
      body: JSON.stringify({
        properties: {
          Stock: { number: newStock }
        }
      })
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        newStock,
        newCoins: page.properties.Coins?.number || 0
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
