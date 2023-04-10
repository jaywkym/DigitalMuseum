// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { database } from '@/firebase/clientApp';
import { DatabaseVotingPrompt, PromptResponse, VotingPromptsResponse } from '@/types/DalleResponseTypes';
import { ref, set } from 'firebase/database';
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * 
 * request_image_handler: A request handler for the endpoint /api/dalle/generate)image.
 *                        Attempts to generate an AI image of the given prompt. Returns
 *                        ImageResponse object on success with retrieved image with the
 *                        image attribute filled. On error returns Image Response object
 *                        with the error field filled.
 * 
 * @param req Request from client
 * @param res Response to client
 * @returns 
 */
export default async function request_image_handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


    /* Count votes for previous prompt */
    const allVotesObj = await getAllVotes();
    if(!allVotesObj.success) {
        res.status(200).json({success: false})
        return
    }

    const promptObjs = allVotesObj.prompts;

    let votedPrompt = promptObjs[0];
    if(votedPrompt.votes == undefined)
        votedPrompt.votes = []

    promptObjs.forEach((promptObj) => {
        if(promptObj.votes === undefined)
            return;


        const votes = promptObj.votes.length;
        if(votes > votedPrompt.votes.length)
            votedPrompt = promptObj;
    })

    console.log("New prompt")
    console.log(votedPrompt);

    /* Set new prompt to voted prompt */
    await saveVotedPrompt(votedPrompt.prompt)

    /* Generate new prompts */
    const newPromptsResponse = await requestNewPrompts();
    if(!newPromptsResponse.success) {
        console.error("ERROR: Could not generate prompts")
        res.status(200).json({success: false})
        return
    }

    const newPrompts = newPromptsResponse.prompts

    const promptsObj: DatabaseVotingPrompt[] = newPrompts.map((prompt) => {
        return {prompt: prompt, votes: []} as DatabaseVotingPrompt
    })

    /* Set voting prompts to new prompts.*/
    await storeNewPrompts(promptsObj);

    res.status(200).json({success: true})
}

async function saveVotedPrompt(prompt: string) {
    const db = database;
    await set(ref(db, 'prompts/current'), prompt);
}

async function getAllVotes() {
    try {
        const resp = await fetch(process.env.NEXTAUTH_URL + 'api/database/prompt/getAllVotes', {method: 'POST'})
        return await resp.json() as VotingPromptsResponse;

    } catch (err: any) {
        console.error(err)
        return {success: false, prompts: []}
    }
}

async function storeNewPrompts(prompts: DatabaseVotingPrompt[]) {
    const db = database;
    await set(ref(db, `/prompts/vote`), prompts)
}

async function requestNewPrompts(): Promise<PromptResponse> {
    try {
        const resp = await fetch(process.env.NEXTAUTH_URL + 'api/database/prompt/gpt/generatePrompts', {method: 'POST'});
        
        return await resp.json() as PromptResponse
    } catch (err: any) {
        console.error(err);
        return {success: false, prompts: []}
    }
}