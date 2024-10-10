import { Images } from '../../theme/images';

export enum WhipType {
  BachelorParty = 'BachelorParty',
  Birthday = 'Birthday',
  Christening = 'Christening',
  Corporate = 'Corporate',
  Dinner = 'Dinner',
  Event = 'Event',
  GroupTickets = 'GroupTickets',
  Holiday = 'Holiday',
  NightOut = 'NightOut',
  OfficeParty = 'OfficeParty',
  SportEvent = 'SportEvent',
  Wedding = 'Wedding',
}

export interface IWhipType {
  fontSize?: number;
  icon?: any;
  image?: string;
  title: string;
  type: WhipType | string;
}

const eventImages = [
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxfHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwyfHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1536010305525-f7aa0834e2c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwzfHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1473973916745-60839aebf06b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw0fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw1fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1517867065801-e20f409696b0?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1482164565953-04b62dcac1cd?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1438557068880-c5f474830377?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw2fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw3fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw4fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHw5fHxldmVudCUyMHdpdGglMjBmcmllbmRzfGVufDB8fHx8MTcwMTI1Nzk4M3ww&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1455734729978-db1ae4f687fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxMHx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxMXx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxMnx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxM3x8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxNHx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1536392706976-e486e2ba97af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxNXx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxNnx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1516600164266-f3b8166ae679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxN3x8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxOHx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwxOXx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1511396651042-2153ae4f2bb4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
  'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwyMHx8ZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTc5ODN8MA&ixlib=rb-4.0.3&q=80&w=400',
  'https://images.unsplash.com/photo-1473177027534-53d906e9abcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MzQ0NjR8MHwxfHNlYXJjaHwyM3x8ZnVuJTIwZXZlbnQlMjB3aXRoJTIwZnJpZW5kc3xlbnwwfHx8fDE3MDEyNTgyOTV8MA&ixlib=rb-4.0.3&q=80&w=400',
];

export const getRandomImageFromEventImages = () => {
  const randomIndex = Math.floor(Math.random() * eventImages.length);
  return eventImages[randomIndex];
};

export const categories = (): IWhipType[] => [
  {
    title: 'Awesome \nEvent',
    icon: Images.iconOther,
    fontSize: 12,
    image: getRandomImageFromEventImages(),
    type: WhipType.Event,
  },
  {
    title: 'Holiday',
    icon: Images.iconHoliday,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1440778303588-435521a205bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.Holiday,
  },
  {
    title: 'Office Party',
    icon: Images.iconOfficeParty,
    fontSize: 13,
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.OfficeParty,
  },
  {
    title: 'Bachelor & \nBachelorette\n Party',
    icon: Images.iconBachelor,
    fontSize: 10,
    image:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.BachelorParty,
  },
  {
    title: 'Group Tickets',
    icon: Images.iconGroupTicket,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.GroupTickets,
  },
  {
    title: 'Birthdays',
    icon: Images.iconBirthday,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1502035618526-6b2f1f5bca1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJpcnRoZGF5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    type: WhipType.Birthday,
  },
  {
    title: 'Dinner',
    icon: Images.iconDinner,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.Dinner,
  },
  {
    title: 'Night Out',
    icon: Images.iconNightOut,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1542628682-88321d2a4828?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bmlnaHQlMjBvdXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    type: WhipType.NightOut,
  },
  {
    title: 'Sport Events',
    icon: Images.iconSportEvent,
    fontSize: 13,
    image:
      'https://images.unsplash.com/photo-1574602904324-a9ac0fe65331?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.SportEvent,
  },
  {
    title: 'Weddings',
    icon: Images.iconWedding,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80',
    type: WhipType.Wedding,
  },
  {
    title: 'Christenings',
    icon: Images.iconChristening,
    fontSize: 14,
    image:
      'https://images.unsplash.com/photo-1550522233-57798719b886?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1769&q=80',
    type: WhipType.Christening,
  },
  {
    title: 'Corporate',
    icon: Images.iconCoOperate,
    fontSize: 13,
    image:
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    type: WhipType.Corporate,
  },
];
