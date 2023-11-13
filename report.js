const { spawn } = require('child_process');
const path = require('path');

// Define the base directory as the folder containing your script
const baseDirectory = path.join(__dirname);

// Define an array of scripts to run
const scripts = [
  'get_news_text.js',
  'news_summarizer.mjs',
  'format_md.js'
];

// Function to run scripts sequentially
function runScripts(scriptIndex) {
  if (scriptIndex < scripts.length) {
    const scriptPath = path.join(baseDirectory, scripts[scriptIndex]);
    console.log(`Running: ${scriptPath}`);
    
    const childProcess = spawn('node', [scriptPath]);
    
    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    childProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Script completed: ${scriptPath}`);
        runScripts(scriptIndex + 1); // Run the next script
      } else {
        console.error(`Error running script: ${scriptPath}`);
      }
    });
  } else {
    console.log('All scripts have been executed.');
  }
}

// Start running the scripts from the first one
runScripts(0);
