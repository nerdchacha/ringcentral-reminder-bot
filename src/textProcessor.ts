import {EventType} from './types';

export const checkIfForwarded = (text: string) =>
  text.match(
    /(^[\w'\-,.][^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}) posted in a direct conversation/gm
  ) ||
  text.match(
    /^[\w'\-,.][^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,} posted in !\[:Team\]\(\d+\)/gm
  );

export const sanitizeDM = (text: string, event: EventType) => {
  if (!text.startsWith('/r')) {
    return;
  }
  return sanitizeMessage(text.replace(/^\/r /, ''), event);
};

export const sanitizeForward = (text: string, event: EventType) => {
  text = text
    .replace(
      /(^[\w'\-,.][^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}) posted in a direct conversation/gm,
      ''
    )
    .replace(
      /^[\w'\-,.][^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,} posted in !\[:Team\]\(\d+\)/gm,
      ''
    );
  return sanitizeMessage(text, event);
};

const sanitizeMessage = (text: string, event: EventType) => {
  const mentions = event.message.mentions || [];
  return text
    .replace(new RegExp('!\\[:Person\\]\\((\\d+)\\)', 'gm'), (_, group) => {
      const mention = mentions.find(({id}) => id === group) || {name: ''};
      return mention.name;
    })
    .replace(new RegExp('!\\[:Team\\]\\((\\d+)\\)', 'gm'), (_, group) => {
      const mention = mentions.find(({id}) => id === group) || {name: ''};
      return mention.name;
    })
    .replace(/\n> /g, '\n');
};
