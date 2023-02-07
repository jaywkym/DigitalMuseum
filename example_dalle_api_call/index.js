const axios      = require('axios').default
const bodyParser = require('body-parser')
const express    = require('express')
const fs         = require('fs')
const app        = express()
                   require('dotenv').config()

app.use(bodyParser.json())

const PORT          = process.env.PORT
const DALLE_API_KEY = process.env.DALLE_API_KEY

const prompt = 'A dog surfing a wave with a swan in the background eating a horse and the sun is smiling while the cow jumped over the moon, drawn with crayon like a child drew it.';
const amount = 1;

(async() => {

    const image_urls = await requestDalleImages(prompt)

    console.log("Image Generated. Parsing image...")

    const image_b64 = image_urls.data[0].b64_json
    const buffer = Buffer.from(image_b64, "base64");
    fs.writeFileSync("output.png", buffer);

    console.log("Done")

})()

async function readImagesFromFile(file) {
    try {
        const json = fs.readFileSync(file)
        const data = JSON.parse(json)
        return data
    } catch(err) {
        console.log(err)
    }
}

async function writeURLSToFile(images) {
    try {
        fs.writeFileSync('output.json', JSON.stringify(images))
        console.log('success')
    } catch(err) {
        console.log(err)
    }
    
}

async function getImageFromURL(url) {
    const request = {
        method: 'get',
        url   : url
    }


    try {
        console.log("Drawing Image...")
        const resp = await axios.request(request)

        console.log(resp)
        console.log(resp.status)
        return resp.data
        // console.log(resp.data)
    } catch (err) {
        console.log(err)
    }
    


}

async function requestDalleImages(prompt) {
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
            'size'  : "1024x1024",
            'response_format': 'b64_json'
        }
    }

    try {
        const resp = await axios.request(dalle_request);

        console.log(resp.status)
        return resp.data
    } catch (err) {
        console.log(err)
        console.log(err.data)
    }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })
