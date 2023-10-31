const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

async function getText(url) {
  const options = {
    method: 'GET',
    url: 'https://text-extract7.p.rapidapi.com/',
    params: {
      url: url
    },
    headers: {
      'X-RapidAPI-Key': 'YOUR_API_KEY', //Replace this with your RapidAPI Key for this API service: https://rapidapi.com/altanalys/api/text-extract7
      'X-RapidAPI-Host': 'text-extract7.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(`Error processing URL ${url}: ${error.message}`);
    return null;
  }
}

const inputCsvFilePath = 'input.csv'; //make sure you have input.csv file with a header as "url" and then a list of links below it
const outputJsonFilePath = 'scraped_news.json'; //this is the output file which saves text, metadata, etc for every link in json format

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

    for (const url of urls) {
      console.log(`Processing URL: ${url}`);
      const extractedText = await getText(url);
      if (extractedText !== null) {
        results.push({ url, extractedText });
        console.log(`Data for URL ${url} saved successfully.`);
      } else {
        console.log(`Failed to process URL: ${url}`);
        failedCount++;
        failedUrls.push(url); // Add the failed URL to the array
      }
      processedCount++;
    }

    // Save the results array to a JSON file
    fs.writeFileSync(outputJsonFilePath, JSON.stringify(results, null, 2));
    console.log('Results saved to:', outputJsonFilePath);

    // Log summary information
    console.log(`Total URLs processed: ${processedCount}`);
    console.log(`Total URLs failed: ${failedCount}`);

    // Log failed URLs
    if (failedCount > 0) {
      console.log('Failed URLs:');
      failedUrls.forEach((url) => {
        console.log(url);
      });
    }
  });
