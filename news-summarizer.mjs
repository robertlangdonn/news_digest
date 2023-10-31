import fs from 'fs'; // Import the 'fs' module to read and write JSON files
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "YOUR_API_KEY",
}); //Replace this with your OpenAI API Key

// Read the JSON file
const jsonData = fs.readFileSync('scraped_news.json', 'utf8'); //Replace the file name
const data = JSON.parse(jsonData);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Define a rate limiting function
const rateLimit = async (fn, delayMs, ...args) => {
  await delay(delayMs);
  return fn(...args);
};

// Initialize an array to store the results
const results = [];

// Loop through the entries in the JSON file
const processEntries = async () => {
  for (const entry of data) {
    const userMessage = entry.extractedText.text; // Access the "text" field within the nested structure

    // Check if userMessage is not empty
    if (userMessage && userMessage.trim() !== '') {
      try {
        // Make the API request with rate limiting
        const response = await rateLimit(async () => {
          return await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  "Read noisy scraped news text and summarize it in 3 bullet points. You will only share the 3 bullet point summary as your response.",
              },
              {
                role: 'user',
                content: userMessage,
              },
            ],
            //Adjust temperature and output tokens as needed
            temperature: 0.1, 
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
        }, 1500); // Wait for this number of milliseconds between requests 

        // Extract the required values and add them to the results array
        const result = {
          Title: entry.extractedText.title,
          URL: entry.url,
          Source: entry.extractedText.hostname,
          Summary: response.choices[0].message.content,
        };

        results.push(result);

        // Save the API response somewhere (you can remove this if not needed)
        console.log(response.choices[0].message.content);
        console.log(response);
      } catch (error) {
        console.error('Error making API request:', error);
      }
    } else {
      console.log('Empty userMessage found, skipping...');
    }
  }

  // Write the results to a JSON file
  fs.writeFileSync('news_summary.json', JSON.stringify(results, null, 2));
};

// Call the function to start processing entries
processEntries();
