const express = require('express');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

app.post('/api/transaction', async (req, res) => {
  const { userId, action, amount } = req.body;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'User ID',
        text: { equals: userId }
      }
    });

    if (response.results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPage = response.results[0];
    const pageId = userPage.id;

    const currentStocks = userPage.properties['Stocks'].number;
    const currentCoins = userPage.properties['Coins'].number;

    let newStocks = currentStocks;
    let newCoins = currentCoins;

    if (action === 'buy') {
      newStocks += amount;
      newCoins -= amount * 10;
    } else if (action === 'sell') {
      newStocks -= amount;
      newCoins += amount * 10;
    }

    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Stocks': { number: newStocks },
        'Coins': { number: newCoins }
      }
    });

    res.json({ userId, newStocks, newCoins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
