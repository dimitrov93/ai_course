import {OpenAI} from 'openai'
import { encoding_for_model } from 'tiktoken'

const openai = new OpenAI()


async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
    
      {role: 'system', content: `Resond like a cool dude, in JSON format, like this: 
        coolnessLevel: 1-10, 
        answer: your answer`},
      {role: 'user', content: 'How tall is mount Everest?'},
    ],
    
  })
  console.log(response.choices[0].message)
}


function countTokens(): void {
  const prompts = "how tall is mount everest?"
  const encoder = encoding_for_model('gpt-4o')
  const tokens = encoder.encode(prompts)
  console.log(tokens)
  console.log(tokens.length)
  }

main()