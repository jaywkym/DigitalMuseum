const crypto = require('crypto')

export default async function generatePrompt() {
    //Fetch File
    try {
        const res = await fetch(`/static/prompts.txt`);
        const fileContents = await res.text();
    
        // Split the file contents into an array of lines
        const lines = fileContents.split('\n');

        let date = (new Date()).toISOString().substr(0, 10)
        const hash = crypto.createHash('sha').update(date).digest('hex')
    
        // Choose a random line from the array
        const randomIndex = Math.floor(parseInt(hash, 16) % lines.length);
        const randomLine = lines[randomIndex];
    
        // Return the random line as a string
        return randomLine.trim();
    } catch (err: any) {
        console.error(err)
        return '';
    }
   
}