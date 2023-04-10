
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
  res: NextApiResponse<UserVotedResponse>
) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            {success: false, voted : false}
        )
        
        return;
    }

    const user_id = req.body.user_id as string;

    const votesResponse = await getAllVotes();
    if(!votesResponse.success) {
        res.status(200).json({success: false, voted : false})
        return;
    }

    const promptsObj = votesResponse.prompts;
    let voted = false;

    promptsObj.forEach((promptObj) => {

        const votes = promptObj.votes

        if(votes === undefined || voted)
            return;

        if(votes.includes(user_id)) {
            voted = true;
            res.status(200).json({success: true, voted: true})
            return;
        }
    })

    if(voted) return;

    res.status(200).json({success: true, voted : false})
}

async function getAllVotes(): Promise<VotingPromptsResponse> {

    try {
        const resp = await fetch(process.env.NEXTAUTH_URL + 'api/database/prompt/getAllVotes', {method: 'POST'});
        return await resp.json() as VotingPromptsResponse;

    } catch (err: any) {
        console.error(err);
        return {success: false, prompts: []}
    }
}