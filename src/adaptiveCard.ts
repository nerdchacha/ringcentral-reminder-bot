import momentTimezone, {Moment} from 'moment-timezone';

export const SNOOZE_CHOICES = [
  {
    title: '5 minutes',
    value: '5 minutes',
  },
  {
    title: '15 minutes',
    value: '15 minutes',
  },
  {
    title: '30 minutes',
    value: '30 minutes',
  },
  {
    title: '1 hour',
    value: '1 hours',
  },
  {
    title: '6 hours',
    value: '6 hours',
  },
  {
    title: '1 day',
    value: '1 days',
  },
];

export const CARDS = {
  Reminder: (options: {reminderId: string; message: string; botId: string}) => {
    const {reminderId, message, botId} = options;
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'TextBlock',
          text: 'Reminder :alarm_clock:',
          wrap: true,
          size: 'Large',
          weight: 'Bolder',
          color: 'Accent',
        },
        {
          type: 'TextBlock',
          text: message,
          weight: 'Bolder',
          wrap: true,
        },
        {
          type: 'TextBlock',
          text: 'Snooze for',
          wrap: true,
        },
        {
          type: 'Input.Text',
          id: 'reminderId',
          value: reminderId,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'message',
          value: message,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'bot_id',
          value: botId,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'action',
          value: 'snooze',
          isVisible: false,
        },
        {
          type: 'Input.ChoiceSet',
          id: 'snooze',
          choices: SNOOZE_CHOICES,
          value: '5 minutes',
          isRequired: true,
          errorMessage: 'A snooze time is needed',
        },
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Snooze',
        },
      ],
    };
  },
  SetTime: (options: {
    message: string;
    date?: string;
    time?: string;
    timezone: string;
    creatorId: string;
    messageId: string;
    botId: string;
  }) => {
    const {
      message,
      date = momentTimezone().tz(options.timezone).format('YYYY-MM-DD'),
      time = momentTimezone()
        .tz(options.timezone)
        .add(10, 'minutes')
        .format('HH:mm'),
      creatorId,
      messageId,
      botId,
      timezone,
    } = options;
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'TextBlock',
          size: 'Medium',
          text: 'When would you like me to remind you to',
          weight: 'Bolder',
          color: 'Accent',
        },
        {
          type: 'TextBlock',
          text: message,
          weight: 'Bolder',
          wrap: true,
        },
        {
          type: 'Input.Text',
          id: 'action',
          value: 'set',
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'message',
          value: message,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'bot_id',
          value: botId,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'creatorId',
          value: creatorId,
          isVisible: false,
        },
        {
          type: 'Input.Text',
          id: 'messageId',
          value: messageId,
          isVisible: false,
        },
        {
          type: 'ColumnSet',
          columns: [
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'Input.Date',
                  label: 'Date',
                  id: 'date',
                  isRequired: true,
                  errorMessage: 'A date is needed',
                  value: date,
                },
              ],
            },
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'Input.Time',
                  id: 'time',
                  label: 'Time',
                  value: time,
                  isRequired: true,
                  errorMessage: 'A time is needed',
                },
              ],
            },
            {
              type: 'Column',
              width: 'stretch',
              items: [
                {
                  type: 'Input.ChoiceSet',
                  label: 'Timezone',
                  id: 'timezone',
                  choices: momentTimezone.tz
                    .names()
                    .map(name => ({title: name, value: name})),
                  value: timezone,
                  isRequired: true,
                  errorMessage: 'A timezone is needed',
                },
              ],
            },
          ],
        },
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Confirm',
        },
      ],
    };
  },
  ReminderSaved: (message: string, dateTime: Moment) => ({
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.3',
    body: [
      {
        type: 'TextBlock',
        weight: 'Bolder',
        wrap: true,
        text: `:+1: I will remind you to "${message}" on ${dateTime.format(
          'YYYY/MM/DD'
        )} at ${dateTime.format('hh:mm A Z z')}`,
      },
    ],
  }),
  ReminderSnoozed: (message: string, duration: string) => ({
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.3',
    body: [
      {
        type: 'TextBlock',
        wrap: true,
        weight: 'Bolder',
        text: `:+1: I will remind you again to "${message}" in ${duration}`,
      },
    ],
  }),
};
