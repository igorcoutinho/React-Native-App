export const onboardings: {
  name: string;
  title: string;
  message: string;
}[] = [
    {
      name: 'FirstTimeOnboarding',
      // First access + user don't have whips he is a owner,
      title: 'Welcome to Whip App!',
      message: 'This is your first time here!',
    },
    {
      name: 'FirstTimeFromInvite',
      // User came from an invite for the first time
      title: 'Welcome to Whip App!',
      message: 'This is your first time here!',
    },
    {
      name: 'WhatIsAWhip',
      // User creates a Whip for the first time
      title: 'What is a Whip?',
      message:
        'A Whip is a group of friends that share a credit card to pay for something.',
    },
    {
      name: 'WhatICanDoWithMyWhip',
      // User see Whip details for the first time
      title: 'What can I do with my Whip?',
      message:
        'You can purchase online, buy anything, invite friends, and see the Whip balance.',
    },
    {
      name: 'OnboardingAccount',
      title: 'Welcome to your Account!',
      message: 'Welcome to your Account!',
    },
  ];
