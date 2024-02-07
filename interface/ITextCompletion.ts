export enum OpenAIModel {
  GPT_4 = 'gpt-4',
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
}

export type MessageType = {
  role: string;
  content: string;
};

export interface IOpenAITextCompletionReqParams {
  temperature: number;
  max_tokens: number;
  model: OpenAIModel;
  messages: MessageType[];
}
