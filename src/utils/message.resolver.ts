import messages from '../messages/en.json';

const messageResolver = (
  key: string,
  ...args: (string | number)[]
): string | null => {
  console.log(args);
  let msg = (messages as Record<string, string>)[key];
  if (!msg) return null;

  if (args.length > 0) {
    msg = msg.replace(/{(\d+)}/g, (_, index) =>
      String(args[Number(index)] ?? ''),
    );
  }

  return msg;
};

export default messageResolver;
