import {Bot} from 'ringcentral-chatbot/dist/models';
import {BotType} from 'ringcentral-chatbot/dist/types';
import moment from 'moment';
import {Op} from 'sequelize';

import {CARDS} from './adaptiveCard';

import {Reminder} from './models/reminder';
import {ReminderType} from './types';

const dispatcher = async () => {
  const reminders = (await Reminder.findAll({
    where: {
      active: true,
      time: {[Op.lte]: moment().toDate()},
    },
  })) as unknown as ReminderType[];
  for (const reminder of reminders) {
    const botId = reminder.botId;
    const bot = (await Bot.findByPk(botId)) as unknown as BotType;
    // TODO: Maybe save groupId in DB and only create a new conversaiton if the older one was closed
    const createConversationResponse = await (bot as any).rc
      .restapi()
      .glip()
      .conversations()
      .post({members: [{id: bot.id}, {id: reminder.creatorId}]});
    const groupId = createConversationResponse.id;
    await bot?.sendMessage(groupId, {
      text: `![:Person](${reminder.creatorId}) I was asked to remind you.`,
    });
    await bot.sendAdaptiveCard(
      groupId,
      CARDS.Reminder({
        reminderId: reminder.id,
        message: reminder.message,
        botId,
      })
    );
    await reminder.markAsDone(reminder.id);
  }
};

export default dispatcher;
