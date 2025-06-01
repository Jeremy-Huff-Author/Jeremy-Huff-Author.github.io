const { Client } = require('@notionhq/client');
const path = require('path');
const fs = require('fs').promises;

// Initialize Notion client (replace with your integration token)
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Replace with your database ID
const databaseId = process.env.NOTION_LOCATION_DB_ID;

async function buildGallery() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    for (const page of response.results) {
      console.log(page);
    }

    console.log('Gallery built successfully!');

  } catch (error) {
    console.error('Error building gallery:', error);
  }
}

buildGallery();