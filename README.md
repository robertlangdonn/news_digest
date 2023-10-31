# News Digest Summary
The purpose of this project is to extract text from news articles using the Text Extract API and summarize them using the GPT3.5 OpenAI API. The need for this project emerged from my job to create a daily news summary report for CXOs.

# Prerequisites

- Text Extract API Key: You'll need to obtain your Text Extract API Key from [here](https://rapidapi.com/altanalys/api/text-extract7). It offers a paid option with a free tier.
- OpenAI API Key: Get your OpenAI API Key from [here](https://platform.openai.com/account/api-keys). Please note that this is a paid service.
- Node.js: Download it from [here](https://nodejs.org/en).
- Code-related Packages: Make sure to install the necessary Node.js packages for this project, you should see the missing ones when you run the scripts for the first time.

# How to use
## Step 1: Extract Text from News Articles
- Create a list of URLs of the news articles you want to summarize in the `input.csv` file.
- Run `get_news_text.js` to scrape the text, metadata, and other information from each news article. The output will be saved in `scraped_news.json`. During the process, you will see console log messages for each link, indicating whether the data was saved successfully or failed to save. At the end, you'll see the total number of successfully saved links and a list of any failed URLs.
```

node get_news_text.js
```  

## Step 2: Summarize News Articles
- Run `news_summarizer.mjs` to summarize the extracted text of the news articles using GPT3.5 (tweak the parameters, change the model, and the prompt in the code). The summarization is performed using the prompt: _Read noisy scraped news text and summarize it in 3 bullet points. You will only share the 3 bullet point summary as your response._ The generated summary is displayed in the console and is also saved in `news_summary.json`.
```

node news_summarizer.mjs
```

## Step 3: Format the Output
Run `format_md.js` to format the output in markdown format. The output files are saved as `news_report_{TIMESTAMP}.md` in the `daily_reports` folder.

```

node format_md.js
```

# Limitations

- The scraping API used in `get_news.js` does not have JavaScript enabled, which means some news sites may not be successfully scraped.

- In `news_summarizer.mjs`, there may be instances where there is no response from the OpenAI API for a particular entry, resulting in a blank console. In such cases, you'll need to terminate the process (CTRL+C) and run the script again on the entire file.

- The scraped news in the first step and the summarized news in the second step are overwritten in the same `scraped_news.json` and `news_summary.json` files when you run the scripts multiple times. However, the final, formatted output is saved with a timestamp in a new file in the `daily_reports` folder for every run.
