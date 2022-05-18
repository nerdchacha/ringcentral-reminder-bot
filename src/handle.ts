import momentTimezone from 'moment-timezone';

import {EventType} from './types';
import {Reminder} from './models/reminder';
import {Timezone} from './models/timezone';
import {CARDS, SNOOZE_CHOICES} from './adaptiveCard';
import {TimezoneType} from './types';
import {checkIfForwarded, sanitizeDM, sanitizeForward} from './textProcessor';

const FALLBACK_MESSAGE = `Sorry, I did not understand the command.
To set a reminder either use \`/r\` followed by the message. Like ** /r check emails **
OR
Forward a message from any group/conversation to the Reminder Bot
`;

export const handle = async (event: EventType) => {
  const {type} = event;
  switch (type) {
    case 'Message4Bot': {
      handlePost(event);
      break;
    }
    case 'UserSubmit': {
      handleSubmit(event);
    }
  }
};

async function handlePost(event: EventType) {
  const isForwarded = checkIfForwarded(event.message.text);
  const {bot} = event;
  const {creatorId, id: messageId, groupId} = event.message;
  const text = isForwarded
    ? sanitizeForward(event.message.text, event)
    : sanitizeDM(event.message.text, event);
  if (!text) {
    return bot?.sendMessage(groupId, {
      text: FALLBACK_MESSAGE,
    });
  }
  const savedTimezoneData = (await Timezone.findByPk(
    creatorId
  )) as unknown as TimezoneType;
  const timezone = savedTimezoneData
    ? savedTimezoneData.name
    : 'America/Los_Angeles';
  const cardParams = {
    message: text,
    creatorId,
    messageId,
    botId: bot!.id,
    timezone,
  };
  await bot?.sendAdaptiveCard(groupId, CARDS.SetTime(cardParams));
}

const handleSubmit = async (event: EventType) => {
  const {action} = event.message.data;
  if (action === 'snooze') {
    handleSnooze(event);
  } else {
    handleSetTime(event);
  }
};

const handleSetTime = async (event: EventType) => {
  const {
    bot_id: botId,
    creatorId,
    message,
    messageId,
    date,
    time,
    timezone,
  } = event.message.data;
  const dateTime = momentTimezone.tz(
    `${date} ${time}`,
    'YYYY-M-D HH:mm',
    timezone
  );
  const currentTimezone = momentTimezone.tz.guess();
  const reminderTime = momentTimezone(dateTime).tz(currentTimezone);
  await Reminder.create({
    message,
    botId,
    messageId,
    creatorId,
    time: reminderTime.toDate(),
  });
  const cardId = event.message.card.id;
  const bot = event.bot;

  await Timezone.upsert({creatorId, name: timezone});
  (bot as any).updateAdaptiveCard(
    cardId,
    CARDS.ReminderSaved(message, dateTime)
  );
};

const handleSnooze = async (event: EventType) => {
  const {reminderId, snooze, message} = event.message.data;
  const cardId = event.message.card.id;
  const [value, part] = snooze.split(' ');
  const time = momentTimezone().add(parseInt(value), part);
  await Reminder.update({time, active: true}, {where: {id: reminderId}});
  const duration = SNOOZE_CHOICES.find(({value}) => value === snooze)!.title;
  const bot = event.bot;
  (bot as any).updateAdaptiveCard(
    cardId,
    CARDS.ReminderSnoozed(message, duration)
  );
};
