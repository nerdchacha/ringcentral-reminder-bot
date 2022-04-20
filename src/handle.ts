import {BotType} from 'ringcentral-chatbot/dist/types';

export const handle = async (event: any) => {
  const {
    bot,
    type,
    message,
  }: {text: string; bot: BotType; group: any; type: string; message: any} =
    event;
  console.log('Handle core logic here');
};
