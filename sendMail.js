const fs = require('fs');
const path = require('path');
const gitPages = require('./reportGitCommands')

async function readFilesInDirectory(directoryPath) {
  try {
    

    // Read the files in the directory
    const files = fs.readdirSync(directoryPath);

    files.forEach(async file => {
      const filePath = path.join(directoryPath, file);

      // Check if the file is HTML or JSON
      if (path.extname(file).toLowerCase() === '.html' || path.extname(file).toLowerCase() === '.json') {
        const fileData = fs.readFileSync(filePath, 'utf8');
        console.log('File:', file);
      }
      console.log("**************copying github files")
    });
    await gitPages.copyReportToGithub(); 
  } catch (error) {
    console.error('Error reading files in the directory:', error);
  }
}

// Usage example:
const directoryPath = path.resolve("Reporting", "IDPTestingReport"); // Replace with the actual directory path
readFilesInDirectory(directoryPath);
