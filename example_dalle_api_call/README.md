# Using the example DALLE api call

The example dalle api call program will automatically create an image from the user's text and save it to a file.

## Installation

1) Clone repository that includes 'example_dalle_api_call' directory

2) Open up a terminal and go to the 'example_dalle_api_call' directory

3) Get your own DALLE api key at 'https://platform.openai.com/account' --> go to 'API keys' --> click 'Create new secret key' --> Copy key

4) Create a new file called '.env' and write 'DALLE_API_KEY=<Secret key here>' and paste the secret key copied.

5) Type 'npm install' to install all dependencies.

6) type 'node index.js' to run program

## Output

Puts generated image from DALLE into 'output.png' with the base64 encoded string inside 'output.json'.

![](example_image.png)