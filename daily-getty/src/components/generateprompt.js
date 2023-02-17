export default async function generatePrompt() {
    //Fetch File
    const res = await fetch('@/static/prompts.txt');
    const fileContents = await res.text();

    // Split the file contents into an array of lines
    const lines = fileContents.split('\n');

    // Choose a random line from the array
    const randomIndex = Math.floor(Math.random() * lines.length);
    const randomLine = lines[randomIndex];

    // Return the random line as a string
    return randomLine.trim();
}