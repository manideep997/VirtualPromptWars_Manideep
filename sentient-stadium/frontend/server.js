const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const net = require('net')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

function checkEnv() {
  const apiKey = process.env.GEMINI_API_KEY;
  // Also explicitly check if .env file exists in frontend root or parent
  const envInFrontend = fs.existsSync(path.join(__dirname, '.env'));
  const envInParent = fs.existsSync(path.join(__dirname, '..', '.env'));
  const envExists = envInFrontend || envInParent;

  if (!apiKey || apiKey.trim() === '') {
    console.error('\n========================================================');
    console.error('CRITICAL ERROR: GEMINI_API_KEY is missing!');
    if (!envExists) {
        console.error('There is no .env file found in the project root either.');
    }
    console.error('Please add your Gemini API Key to the .env file or environment variables.');
    console.error('The Sentient Stadium frontend requires the AI orchestration to function.');
    console.error('========================================================\n');
    process.exit(1);
  }
}

function checkPort(port) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer()
      .once('error', err => (err.code == 'EADDRINUSE' ? resolve(false) : reject(err)))
      .once('listening', () => tester.once('close', () => resolve(true)).close())
      .listen(port)
  })
}

async function startServer() {
  checkEnv();
  
  let port = 3000;
  const isPort3000Free = await checkPort(3000);
  if (!isPort3000Free) {
    console.log('Port 3000 is in use. Falling back to port 3001...');
    port = 3001;
  }

  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      handle(req, res, parsedUrl)
    }).listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}

startServer();
