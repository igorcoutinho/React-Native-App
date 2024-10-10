import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';

/**
 * Creates a notification that will be triggered at the specified time.
 * @param {Object} options - The notification options.
 * @param {string} options.body - The notification body.
 * @param {string} options.channelId - The notification channel ID.
 * @param {string} options.title - The notification title.
 * @param {Date} options.when - The time when the notification will be triggered.
 * @returns {Promise<void>} A promise that resolves when the notification is created.
 * @example
 *  await createTriggerNotification({
 *    body: 'Your Whipapp Card is ready to use with Apple Pay, the safer and faster way to pay.',
 *    title: 'Whipapp',
 *    when: add(new Date(), { minutes: 10 }),
 *  });
 */
export const createTriggerNotification = async ({
  body,
  channelId = 'default',
  title,
  when,
}: {
  body: string;
  channelId?: string;
  title: string;
  when: Date;
}) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: when.getTime(),
  };
  await notifee.createTriggerNotification(
    {
      title,
      body,
      android: {
        channelId,
      },
    },
    trigger,
  );
};
