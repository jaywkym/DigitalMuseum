import { String } from 'aws-sdk/clients/appstream';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function IHateEverything (
    req: NextApiRequest,
    res: NextApiResponse
) {

    const query = req.body;
    
    const url: string = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-PoZvpKsYSEfRw83jqVAraHjM/user-53bDplmON2kZ3LICNSkzMA9I/img-R0QCtFodWOalXPJ5lpeUdVal.png?st=2023-04-05T20%3A39%3A59Z&se=2023-04-05T22%3A39%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-05T20%3A47%3A20Z&ske=2023-04-06T20%3A47%3A20Z&sks=b&skv=2021-08-06&sig=zojhfngnLyI6DtM21J9DX9nWRjGGKr7dghNQRyckTKw%3D'


//     GET /private/org-PoZvpKsYSEfRw83jqVAraHjM/user-53bDplmON2kZ3LICNSkzMA9I/img-R0QCtFodWOalXPJ5lpeUdVal.png?st=2023-04-05T20%3A39%3A59Z&se=2023-04-05T22%3A39%3A59Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-05T20%3A47%3A20Z&ske=2023-04-06T20%3A47%3A20Z&sks=b&skv=2021-08-06&sig=zojhfngnLyI6DtM21J9DX9nWRjGGKr7dghNQRyckTKw%3D HTTP/1.1
// Host: oaidalleapiprodscus.blob.core.windows.net
// User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/111.0
// Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
// Accept-Language: en-US,en;q=0.5
// Accept-Encoding: gzip, deflate, br
// Connection: keep-alive
// Upgrade-Insecure-Requests: 1
// Sec-Fetch-Dest: document
// Sec-Fetch-Mode: navigate
// Sec-Fetch-Site: none
// Sec-Fetch-User: ?1
    const request = {
        method : "GET", 
        headers: {
            'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language' : 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
        }
    }

    console.log(url)
    console.log(request)

    try {
        const resp = await fetch(url, request);
        const buffer = await resp.arrayBuffer()

        console.log(buffer)

        res.status(200).json({success: true, buffer : Buffer.from(buffer).toString('base64')})
        return;
    } catch (err: any) {
        console.error(err)
    }

    res.status(400).json({success: false})

}