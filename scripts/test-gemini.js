require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })
const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY

console.log('--- Gemini API Test ---')
console.log('API key present:', !!apiKey)
console.log('API key length:', apiKey?.length ?? 0)
console.log('API key prefix:', apiKey?.slice(0, 10) ?? '(none)')
console.log('')

if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY not found in environment.')
  process.exit(1)
}

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = 'What is the median house price in Fitzroy Melbourne?'
    console.log('Model: gemini-2.0-flash')
    console.log('Sending prompt:', prompt)
    console.log('')

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log('--- Response ---')
    console.log(text)
    console.log('')
    console.log('--- Success ---')
  } catch (err) {
    console.error('--- Error ---')
    console.error('name:        ', err.name)
    console.error('message:     ', err.message)
    console.error('status:      ', err.status ?? '(none)')
    console.error('statusText:  ', err.statusText ?? '(none)')
    console.error('errorDetails:', JSON.stringify(err.errorDetails ?? null, null, 2))
    process.exit(1)
  }
}

run()
