const fs = require('fs');
const path = require('path');

// Check if the source JSON file exists before reading
if (!fs.existsSync('news_summary.json')) {
  console.error('Error: Source JSON file not found. Exiting process.');
  process.exit(1);
} else {
  console.log('Source JSON file found. Proceeding with processing.');
}

// Read the JSON file
const jsonData = fs.readFileSync('news_summary.json', 'utf8');
const data = JSON.parse(jsonData);

// Function to convert an object to Markdown format
const objectToMarkdown = (obj) => {
  const { Title, URL, Source, Summary } = obj;
  const markdown = `### [${Title}](${URL})\n\n#### Source: ${Source}\n\n${Summary.replace(/\n/g, '\n\n')}`;
  return markdown;
};

// Convert each object in the array to Markdown
const markdownArray = data.map(objectToMarkdown);

// Generate a timestamp
const currentDate = new Date();
const timestamp = currentDate.toISOString().replace(/[:.]/g, '-');

// Define the directories where you want to save the files relative to the current directory
const reportsDirectory = path.join(__dirname, 'daily_reports');
const mdDirectory = path.join(reportsDirectory, 'md');
const jsonDirectory = path.join(reportsDirectory, 'json');

// Ensure the directories exist; if not, create them
if (!fs.existsSync(mdDirectory)) {
  fs.mkdirSync(mdDirectory, { recursive: true });
  console.log(`Created directory: ${mdDirectory}`);
} else {
  console.log(`Directory already exists: ${mdDirectory}`);
}

if (!fs.existsSync(jsonDirectory)) {
  fs.mkdirSync(jsonDirectory, { recursive: true });
  console.log(`Created directory: ${jsonDirectory}`);
} else {
  console.log(`Directory already exists: ${jsonDirectory}`);
}

// Construct the output filenames with the timestamp
const outputMarkdownFilename = path.join(mdDirectory, `news_report_${timestamp}.md`);
const newJsonFilename = path.join(jsonDirectory, `news_summary_${timestamp}.json`);

// Write the Markdown content to the file
fs.writeFileSync(outputMarkdownFilename, markdownArray.join('\n\n'));
console.log(`Markdown report saved as: ${outputMarkdownFilename}`);

// Check if the source JSON file still exists before trying to rename it
if (fs.existsSync('news_summary.json')) {
  // Rename and move the summary JSON file to the new directory
  fs.renameSync('news_summary.json', newJsonFilename);
  console.log(`Summary JSON file renamed and moved to: ${newJsonFilename}`);
} else {
  console.error('Error: Source JSON file was not found or already moved. Cannot rename.');
}
