import { CurrentPromptResponse } from "@/types/DalleResponseTypes";

const crypto = require('crypto')

export default async function generatePrompt() {
    //Fetch File
    try {
        const resp = await fetch('/api/database/prompt/getCurrent');
        const promptObj = await resp.json() as CurrentPromptResponse
       
        return promptObj.success? promptObj.prompt : ""
        // Return the random line as a string

    } catch (err: any) {
        console.error(err)
        return '';
    }
   
}