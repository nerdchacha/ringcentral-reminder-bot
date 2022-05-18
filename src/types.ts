import {BotType} from 'ringcentral-chatbot/dist/types';

export type EventType = {
  type: string;
  message: {
    id: string;
    groupId: string;
    type: string;
    text: string;
    creatorId: string;
    addedPersonIds: any;
    creationTime: string;
    lastModifiedTime: string;
    attachments: any;
    activity: any;
    title: string;
    iconUri: string;
    iconEmoji: any;
    mentions: any[];
    eventType: string;
    data?: any;
    card?: any;
  };
  bot?: BotType;
  text?: string;
  group?: any;
  userId: string;
};

export type ReminderType = {
  id: string;
  message: string;
  time: string;
  botId: string;
  messageId: string;
  creatorId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  markAsDone: (reminderId: string) => void;
};

export type TimezoneType = {
  creatorId: string;
  name: string;
};
