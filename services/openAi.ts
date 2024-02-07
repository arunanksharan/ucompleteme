import { IOpenAITextCompletionReqParams } from '@/interface/ITextCompletion';

const textCompletionUrl = 'https://api.openai.com/v1/chat/completions';

export const getCompletedText = async (
  inputBody: IOpenAITextCompletionReqParams
) => {
  const response = await fetch(textCompletionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(inputBody),
  });
  const data = await response.json();
  console.log('line 35 data in openAi service', data);
  return data;
};
