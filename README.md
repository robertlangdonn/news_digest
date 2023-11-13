# News Digest Summary
The purpose of this project is to extract text from news articles using the Text Extract API and summarize them using the GPT 3.5 OpenAI API. The need for this project emerged from my part of my job to create a daily news summary report for CXOs.

# Prerequisites

- Text Extract API Key: You'll need to obtain your Text Extract API Key from [here](https://rapidapi.com/altanalys/api/text-extract7). It offers a paid option with a free tier.
- OpenAI API Key: Get your OpenAI API Key from [here](https://platform.openai.com/account/api-keys). This is a paid service.
- Create/update the `.env` file with your Text Extract API Key & OpenAI API Key.
- Node.js: Download it from [here](https://nodejs.org/en).
- Install all the dependencies from `package.json` using the following:
```

npm i

``` 

# How to Use
- Populate `input.csv` with the URLs of the news articles you wish to summarize. Also, make sure you have your API keys in the `.env` file.

- Understand the Scripts:
  - `get_news_text.js`: Scrapes metadata and content from the provided news URLs using the Text Extract API.
  - `news_summarizer.mjs`: Uses the GPT 3.5 model from OpenAI to summarize the extracted text into 3 key points for each article.
  - `format_md.js`: Formats the summaries into a structured format, saving them in both Markdown and JSON files, each tagged with a timestamp.
- Run all three scripts sequentially with a single command:
```

node report.js

```

# Understanding How to Run the Scripts Individually

## Step 1: Extract Text from News Articles
- Create a list of URLs of the news articles you want to summarize in the `input.csv` file.
- Run `get_news_text.js` to scrape the text, metadata, and other information from each news article. The output will be saved in `scraped_news.json`. During the process, you will see console log messages for each link, indicating whether the data was saved successfully or failed to save. At the end, you'll see the total number of successfully saved links and a list of any failed URLs which are saved in `failed_urls.csv` file. Note that both `scraped_news.json` and `failed_urls.csv` are overwritten with each script run, not appended.


```

node get_news_text.js

```


## Step 2: Summarize News Articles
- To summarize the extracted news articles, run `news_summarizer.mjs`. This script uses GPT-3.5 to condense the text of each article. You can adjust the script parameters, including changing the model, number of input and output tokens, and modifying the prompt. The default summarization prompt is: "Read noisy scraped news text and summarize it in 3 bullet points. You will only share the 3 bullet point summary as your response."
- As the script runs, log statements provide updates on each URL's processing status, indicating whether the message is valid, and if the entry has been successfully processed and saved.
- The completed summaries are stored in `news_summary.json`. This file includes the headline, URL, and a concise 3-point summary for each article.
```

node news_summarizer.mjs

```


## Step 3: Format the Output
Run the `format_md.js` script to format the output into Markdown, creating a file named `news_report_{TIMESTAMP}.md` in the `daily_reports\md` folder. It also renames the `news_summary.json` to `news_report_{TIMESTAMP}.json` and moves it to the `daily_reports\json` folder, ensuring both Markdown and JSON formatted reports are neatly organized and timestamped for easy reference.

```

node format_md.js

```


# Limitations

- The scraping API used in `get_news.js` does not have JavaScript enabled, which means some news sites may not be successfully scraped.

- When running `news_summarizer.mjs`, if you encounter instances where the OpenAI API does not respond for a specific entry, leading to a blank console, you will need to manually terminate the process using CTRL+C. Upon restarting the script, it automatically checks for duplicate URLs in `news_summary.json` and skips them. This functionality ensures that previously processed URLs are not reprocessed, allowing the script to resume summarization from the next unique URL in the sequence.



# Next Steps?
- Write a custom scraper instead of using the paid API?
- Use open-source LLM on the local machine to summarize the text instead of OpenAI paid APIs?
