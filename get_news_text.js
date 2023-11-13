const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv'); // Import json2csv to convert JSON to CSV
require('dotenv').config();


async function getText(url) {
  const options = {
    method: 'GET',
    url: 'https://text-extract7.p.rapidapi.com/',
    params: { url: url },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Use the API key from the .env file
      'X-RapidAPI-Host': 'text-extract7.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(`Text extraction successful for URL #${processedCount + 1}`);
    return response.data;
  } catch (error) {
    console.error(`Error processing URL #${processedCount + 1}: ${url}: ${error.message}`);
    return null;
  }
}

const inputCsvFilePath = 'input.csv';
const outputJsonFilePath = 'scraped_news.json';
const failedUrlsCsvFilePath = 'failed_urls.csv'; // File path for failed URLs CSV

const urls = [];
let processedCount = 0;
let failedCount = 0;
const failedUrls = []; // Array to store failed URLs

// Read input CSV file and store URLs
fs.createReadStream(inputCsvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const url = row.url;
    urls.push(url);
  })
  .on('end', async () => {
    const results = [];
    const totalUrls = urls.length;
    console.log(`Total URLs to process: ${totalUrls}`);

    for (const url of urls) {
      processedCount++;
      console.log(`Processing URL #${processedCount}: ${url}`);
      const extractedText = await getText(url);
      if (extractedText !== null) {
        results.push({ url, extractedText });
        console.log(`Data for URL #${processedCount} saved successfully.`);
      } else {
        console.log(`Failed to process URL #${processedCount}: ${url}`);
        failedCount++;
        failedUrls.push(url); // Add the failed URL to the array
      }
    }

    // Save the results array to a JSON file
    fs.writeFileSync(outputJsonFilePath, JSON.stringify(results, null, 2));
    console.log('Results saved to:', outputJsonFilePath);

    // Log summary information
    console.log(`Total URLs processed: ${processedCount}`);
    console.log(`Total URLs failed: ${failedCount}`);

    // Save failed URLs to a CSV file
    if (failedCount > 0) {
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(failedUrls.map(url => ({ url })));
      fs.writeFileSync(failedUrlsCsvFilePath, csv);
      console.log('Failed URLs saved to:', failedUrlsCsvFilePath);
    }
  });
