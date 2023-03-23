import prompts from '../public/prompts.txt';

export default async function generatePrompt() {
    //Fetch File
    //const res = await fetch('/prompts.txt');
    //const fileContents = await res.text();

    //const fileContents = 

    var file = new File([""], prompts);
    var fr = new FileReader();
    const data = fr.readAsText(file);
    console.log(data);
    const lines = data.split('\n');
    // Split the file contents into an array of lines

    //const lines = fileContents.split('\n');

    // Choose a random line from the array
    const randomIndex = Math.floor(Math.random() * lines.length);
    const randomLine = lines[randomIndex];
