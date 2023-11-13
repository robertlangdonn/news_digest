import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This will now pull the API key from your .env file
});

console.log('Script initialized.');

// Function to read JSON data from a file
function readJsonFile(filePath) {
  console.log(`Reading data from ${filePath}...`);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    console.log(`Data read successfully from ${filePath}.`);
    return JSON.parse(fileData);
  } else {
    console.log(`File not found: ${filePath}. Creating a new one.`);
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
}

// Read the scraped data and the summary file
const scrapedData = readJsonFile('scraped_news.json');
const summaryData = readJsonFile('news_summary.json');
const totalEntries = scrapedData.length;

// Create a set of processed URLs
const processedUrls = new Set(summaryData.map(entry => entry.URL));

// Function to append results to the summary file
const appendToSummaryFile = (result) => {
  console.log(`Appending result for URL: ${result.URL}`);
  summaryData.push(result);
  fs.writeFileSync('news_summary.json', JSON.stringify(summaryData, null, 2));
  console.log(`Result for URL: ${result.URL} appended to summary file.`);
};

// Delay function for rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Rate limiting wrapper function
const rateLimit = async (fn, delayMs, ...args) => {
  console.log(`Rate limiting: Waiting for ${delayMs}ms.`);
  await delay(delayMs);
  console.log('Delay finished, executing function.');
  return fn(...args);
};

// Main function to process entries
const processEntries = async () => {
  console.log(`Starting to process entries. Total entries found: ${totalEntries}`);

  for (let index = 0; index < totalEntries; index++) {
    const entry = scrapedData[index];
    const { url, extractedText } = entry;
    console.log(`Processing entry ${index + 1}/${totalEntries}: ${url}`);

    if (!processedUrls.has(url)) {
      const userMessage = extractedText.text;

      if (userMessage && userMessage.trim() !== '') {
        console.log(`Valid userMessage found for entry ${index + 1}. Making API request for URL: ${url}`);

        try {
          const response = await rateLimit(async () => {
            return openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: "Read noisy scraped news text and summarize it in 3 bullet points.",
                },
                {
                  role: 'user',
                  content: userMessage,
                },
              ],
              temperature: 0.5,
              max_tokens: 256,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
            });
          }, 1500);

          const result = {
            Title: extractedText.title,
            URL: url,
            Source: extractedText.hostname,
            Summary: response.choices[0].message.content,
          };

          appendToSummaryFile(result);
          processedUrls.add(url);
          console.log(`Processed and saved result for entry ${index + 1}: ${url}`);
        } catch (error) {
          console.error(`API request failed for entry ${index + 1}: ${url}`, error);
        }
      } else {
        console.log(`No userMessage found or it was empty for entry ${index + 1}: ${url}, skipping.`);
      }
    } else {
      console.log(`URL already processed for entry ${index + 1}: ${url}, skipping.`);
    }
  }

  console.log('Processing of all entries completed.');
};

processEntries().catch(error => {
  console.error('An error occurred during the processing of entries:', error);
});
