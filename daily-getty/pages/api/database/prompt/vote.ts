// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { database } from '@/firebase/clientApp';
import { DatabaseVotingPrompt, PromptResponse, UserVotedResponse, VotingPromptsResponse } from '@/types/DalleResponseTypes';
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

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            {success: false}
        )
        
        return;
    }

    const user_id = req.body.user_id;
    const prompt_id = req.body.prompt_id

    const userVotedResponse = await getIfUserVoted(user_id);

    console.log(userVotedResponse)
    if(!userVotedResponse.success || userVotedResponse.voted) {
        res.status(200).json({success: false})
        return
    }

    const votesResponse = await getAllVotes();
    if(!votesResponse.success) {
        res.status(200).json({success: false});
        return;
    }

    const votesObj = votesResponse.prompts;
    const voteObj = votesObj[prompt_id]
    let votes = voteObj.votes;

    if(votes === undefined)
        votes = [];

    votes.push(user_id);

    const newVoteObj: DatabaseVotingPrompt = {
        prompt: voteObj.prompt,
        votes: votes
    }

    await saveVotesForPrompt(newVoteObj, prompt_id)

    res.status(200).json({success: true})

}

async function saveVotesForPrompt(promptObj: DatabaseVotingPrompt, index: number) {
    const db = database;
    await set(ref(db, 'prompts/vote/' + index), promptObj);
}

async function getAllVotes() : Promise<VotingPromptsResponse> {

    try {
        const resp = await fetch(process.env.NEXTAUTH_URL + 'api/database/prompt/getAllVotes', {method: 'POST'});
        return await resp.json() as VotingPromptsResponse;
    } catch(err: any) {
        console.error(err);
        return {success: false, prompts: []};
    }
}

async function getIfUserVoted(user_id): Promise<UserVotedResponse> {

    const request = {
        method: 'POST',
        headers: {
            'Content-Type' : 'Application/json'
        },
        body: JSON.stringify({user_id: user_id})
    }

    try {
        const resp = await fetch(process.env.NEXTAUTH_URL + 'api/database/prompt/checkUserVoted', request);
        return await resp.json() as UserVotedResponse;
    } catch (err: any) {
        console.error(err)
        return {success: false, voted: false, prompt: -1}
    }
}