const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonData = fs.readFileSync('news_summary.json', 'utf8'); //read the summarized news output
const data = JSON.parse(jsonData);

// Function to convert an object to Markdown format
const objectToMarkdown = (obj) => {
  const { Title, URL, Source, Summary } = obj;
  const markdown = `### [${Title}](${URL})\n\n#### Source: ${Source}\n\n${Summary.replace(/\n/g, '\n ')}`;
  return markdown;
};

// Convert each object in the array to Markdown
const markdownArray = data.map(objectToMarkdown);

// Generate a timestamp
const currentDate = new Date();
const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');

// Define the directory where you want to save the file relative to the current directory
const outputDirectory = path.join(__dirname,'daily_reports');

// Ensure the directory exists; if not, create it
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Construct the output filename with the timestamp
const outputMarkdownFilename = path.join(outputDirectory, `news_report_${timestamp}.md`);

// Write the Markdown content to the file with the timestamped filename
fs.writeFileSync(outputMarkdownFilename, markdownArray.join('\n\n'));
