import OpenAI from 'openai';

const openai = new OpenAI();

async function generateEmbeddings(input: string | string[]) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: input,
  });
  console.log(response.data[0].embedding);

  return response;
}
generateEmbeddings('Hello world');
