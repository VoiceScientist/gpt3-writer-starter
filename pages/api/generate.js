import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Write 5 specific aims for the aims page of an NIH R01 application. 

Health relevance: 
`

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();
  
  // Optionally, build prompt 2 here for prompt chaining
  const secondPrompt =
  `
  Create testable hypotheses for the NIH R01 specific aims below and suggest a methodology.
  
  Health relevance: ${req.body.userInput}
  
  Aims: ${basePromptOutput.text}
  
  Hypotheses: 
  `

  const secondPromptCompletion = await openai.createCompletion({
	  model: 'text-davinci-003',
	  prompt: `${secondPrompt}`,
	  temperature: 0.85,
	  max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();
  
  
  // Output to UI
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;