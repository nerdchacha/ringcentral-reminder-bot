import Sequelize from 'sequelize';

import sequelize from './sequelize';

export const Reminder = sequelize.define('reminder', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.DATE,
  },
  botId: {
    type: Sequelize.STRING,
  },
  messageId: {
    type: Sequelize.STRING,
  },
  creatorId: {
    type: Sequelize.STRING,
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

Reminder.prototype.markAsDone = async function (reminderId: string) {
  await this.update({active: false}, {where: {id: reminderId}});
};

Reminder.sync({alter: true});
