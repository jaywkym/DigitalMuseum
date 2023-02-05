const axios      = require('axios').default
const bodyParser = require('body-parser')
const express    = require('express')
const app        = express()
                   require('dotenv').config()

app.use(bodyParser.json())

const PORT          = 3000;
const DALLE_API_KEY = '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';

const prompt = 'A dog surfing a wave, painting';
const amount = 3;

(async() => {

    console.log("Starting")

    const dalle_request = {
        method: 'post',
        url   : 'https://api.openai.com/v1/images/generations',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DALLE_API_KEY}`
        },
        data: {
            'prompt': prompt,
            'n'     : amount,
            'size'  : "1024x1024"
        }
    }

    try {
        const resp = await axios.request(dalle_request);

        console.log(resp)
        console.log(resp.status)
        console.log(resp.statusText)
        console.log(resp.data)
    } catch (err) {
        console.log(err)
    }
    

})()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
