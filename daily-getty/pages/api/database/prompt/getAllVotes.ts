// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { database } from '@/firebase/clientApp';
import { DatabaseVotingPrompt, PromptResponse, VotingPromptsResponse } from '@/types/DalleResponseTypes';
import { onValue, ref, set } from 'firebase/database';
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
  res: NextApiResponse<VotingPromptsResponse>
) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            {success: false, prompts: []}
        )
        
        return;
    }

    const db = database;
    const dbref = ref(db, `prompts/vote/`)
    const prompts = await asyncOnValue(dbref);

    res.status(200).json({success: true, prompts: prompts})

}



function asyncOnValue(ref): Promise<DatabaseVotingPrompt[]> {

    return new Promise((resolve) => {
        onValue(ref, (snapshot) => {
            const data = snapshot.val();
            resolve(data as DatabaseVotingPrompt[])
        })
    })
}