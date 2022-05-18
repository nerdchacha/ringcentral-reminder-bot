import Sequelize from 'sequelize';

import sequelize from './sequelize';

export const Timezone = sequelize.define('timezone', {
  creatorId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
});

Timezone.sync({alter: true});
