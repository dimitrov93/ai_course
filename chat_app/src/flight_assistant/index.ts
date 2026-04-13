import OpenAI from 'openai';
import { Context } from '../types/ai';

const openai = new OpenAI();

const context: Context = [
  {
    role: 'system',
    content: 'You are a helpful assistant that gives information about flights',
  },
];

export async function getFlightInfo() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: context,
    tools: [
      {
        type: 'function',
        function: {
          name: 'getFlights',
          description: 'Get flights between two airports',
        },
      },
      {
        type: 'function',
        function: {
          name: 'setUpReservation',
          description: 'Set up a reservation for a flight',
          parameters: {
            type: 'object',
            properties: {
              flightId: {
                type: 'string',
                enum: ['1235', '6894'],
                description: 'The id of the flight to set up a reservation for',
              },
            },
            required: ['flightId'],
          },
        },
      },
    ],
    tool_choice: 'auto',
  });

  const willInvokeFunction = response.choices[0].finish_reason == 'tool_calls';

  if (willInvokeFunction) {
    const toolCall = response.choices[0].message.tool_calls![0];

    if (toolCall.type == 'function') {
      const toolName = toolCall.function.name;
      context.push(response.choices[0].message);

      if (toolName == 'getFlights') {
        context.push({ role: 'tool', content: getFlights(), tool_call_id: toolCall.id });
      }

      if (toolName == 'setUpReservation') {
        const args = JSON.parse(toolCall.function.arguments) as { flightId: '1235' | '6894' };
        context.push({
          role: 'tool',
          content: setUpReservation(args.flightId),
          tool_call_id: toolCall.id,
        });
      }
    }
  }

  const secondResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: context,
  });

  console.log(secondResponse.choices[0].message.content);
}

// -----------------------------------------

function getFlights() {
  return 'There are 2 flights: 1235 and 6894';
}

function setUpReservation(flightId: '1235' | '6894') {
  return `Your reservation for flight ${flightId} has been set up!`;
}

process.stdin.addListener('data', async function (input) {
  const userInput = input.toString().trim();
  context.push({
    role: 'user',
    content: userInput,
  });
  await getFlightInfo();
});
