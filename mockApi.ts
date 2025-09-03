import {
  Garden,
  Activity,
  Vegetable,
  GardenType,
  PlotStatus,
  ActivityType,
  ChatMessage,
  Producer,
  User,
  Plot,
} from './types';
import { AVAILABLE_VEGETABLES } from './constants';

// --- MOCK DATABASE ---

const mockProducers: Producer[] = [
  {
    id: 'p1',
    name: 'Ivan Horvat',
    specialty: 'Specijalist za otvorene vrtove',
    avatar:
      'https://ui-avatars.com/api/?name=Ivan+Horvat&background=059669&color=fff',
  },
  {
    id: 'p2',
    name: 'Ana Kovač',
    specialty: 'Stručnjakinja za plastenike',
    avatar:
      'https://ui-avatars.com/api/?name=Ana+Kovac&background=10b981&color=fff',
  },
  {
    id: 'p3',
    name: 'Marko Marić',
    specialty: 'Svestrani uzgajivač povrća',
    avatar:
      'https://ui-avatars.com/api/?name=Marko+Maric&background=34d399&color=fff',
  },
];

let mockGardens: Garden[] = [
  {
    id: 'garden1',
    name: 'Moj sunčani vrt',
    location: 'Zagreb, Hrvatska',
    type: GardenType.OPEN_AIR,
    leaseDate: new Date('2023-03-15'),
    producer: { name: 'Ivan Horvat' },
    cameraUrl: 'https://picsum.photos/seed/garden1/1280/720',
    activities: [
      {
        id: 'act1',
        gardenId: 'garden1',
        type: ActivityType.PLANTING,
        date: new Date('2023-03-20'),
        comment: 'Posađene rajčice, salata i mrkva.',
        imageUrl: 'https://picsum.photos/seed/activity1/400/300',
      },
      {
        id: 'act2',
        gardenId: 'garden1',
        type: ActivityType.WATERING,
        date: new Date('2023-03-22'),
        comment: 'Vrt je zaliven nakon suhog dana.',
      },
      {
        id: 'act3',
        gardenId: 'garden1',
        type: ActivityType.FERTILIZING,
        date: new Date('2023-03-25'),
        comment: 'Dodano organsko gnojivo za bolji rast.',
      },
    ],
    vegetables: [
      { ...AVAILABLE_VEGETABLES[0], id: 'veg1' }, // Tomato
      { ...AVAILABLE_VEGETABLES[1], id: 'veg2' }, // Lettuce
      { ...AVAILABLE_VEGETABLES[2], id: 'veg3' }, // Carrot
    ],
    plot: [
      {
        id: 1,
        status: PlotStatus.PLANTED,
        vegetable: AVAILABLE_VEGETABLES[0],
        plantedDate: new Date(),
        progress: 25,
      }, // Tomato
      {
        id: 2,
        status: PlotStatus.GROWING,
        vegetable: AVAILABLE_VEGETABLES[1],
        plantedDate: new Date(),
        progress: 50,
      }, // Lettuce
      { id: 3, status: PlotStatus.EMPTY },
      {
        id: 4,
        status: PlotStatus.PLANTED,
        vegetable: AVAILABLE_VEGETABLES[2],
        plantedDate: new Date(),
        progress: 0,
      }, // Carrot
      {
        id: 5,
        status: PlotStatus.HARVEST_READY,
        vegetable: AVAILABLE_VEGETABLES[1],
        plantedDate: new Date('2023-04-10'),
        progress: 100,
      }, // Lettuce ready
      { id: 6, status: PlotStatus.EMPTY },
      {
        id: 7,
        status: PlotStatus.HARVEST_READY,
        vegetable: AVAILABLE_VEGETABLES[5],
        plantedDate: new Date('2023-04-15'),
        progress: 100,
      },
      { id: 8, status: PlotStatus.EMPTY },
      { id: 9, status: PlotStatus.EMPTY },
    ],
  },
  {
    id: 'garden2',
    name: 'Plastenik Zeleni prsti',
    location: 'Pariz, Francuska',
    type: GardenType.GREENHOUSE,
    leaseDate: new Date('2023-05-01'),
    producer: { name: 'Ana Kovač' },
    cameraUrl: 'https://picsum.photos/seed/garden2/1280/720',
    vegetables: [
      { ...AVAILABLE_VEGETABLES[3], id: 'veg4' }, // Spinach
      { ...AVAILABLE_VEGETABLES[4], id: 'veg5' }, // Bell Pepper
    ],
    plot: Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      status: PlotStatus.EMPTY,
    })),
  },
];

let mockActivities: Activity[] = [
  {
    id: 'act4',
    gardenId: 'garden1',
    type: ActivityType.PEST_CONTROL,
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    comment: 'Obavljena preventivna zaštita prirodnim sredstvima.',
  },
  {
    id: 'act3',
    gardenId: 'garden1',
    type: ActivityType.WATERING,
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    comment: 'Vrt je zaliven nakon suhog dana.',
    imageUrl: 'https://picsum.photos/seed/activity3/400/300',
  },
  {
    id: 'act2',
    gardenId: 'garden2',
    type: ActivityType.FERTILIZING,
    date: new Date(new Date().setDate(new Date().getDate() - 5)),
    comment: 'Dodano organsko gnojivo za bolji rast.',
  },
  {
    id: 'act1',
    gardenId: 'garden1',
    type: ActivityType.PLANTING,
    date: new Date(new Date().setDate(new Date().getDate() - 10)),
    comment: 'Posađene su rajčice, salata i mrkva prema vašem odabiru.',
    imageUrl: 'https://picsum.photos/seed/activity1/400/300',
  },
];

const mockUser: User = {
  id: 'user1',
  firstName: 'Petra',
  lastName: 'Perić',
  phone: '091 234 5678',
  email: 'petra.peric@example.com',
  address: {
    street: 'Ilica 123',
    city: 'Zagreb',
    zipCode: '10000',
  },
  deliveryAddress: [
    {
      id: 'addr1',
      street: 'Ilica 123',
      city: 'Zagreb',
      zipCode: '10000',
    },
    {
      id: 'addr2',
      street: 'Trg bana Jelačića 1',
      city: 'Zagreb',
      zipCode: '10000',
    },
  ],
};

interface ProducerConversations {
  [key: string]: ChatMessage[];
}

let PRODUCER_CONVERSATIONS: ProducerConversations = {
  garden1: [
    {
      sender: 'bot',
      text: 'Pozdrav! Ja sam Ivan. Ako imate pitanja o vašem Sunčanom vrtu, slobodno pitajte.',
    },
    { sender: 'user', text: 'Super, hvala! Kada mogu očekivati prve plodove?' },
    {
      sender: 'bot',
      text: 'Rajčicama će trebati malo duže, ali salata bi trebala biti spremna za berbu za otprilike 2-3 tjedna, ovisno o vremenu.',
    },
  ],
  garden2: [
    {
      sender: 'bot',
      text: 'Dobrodošli u Plastenik Zeleni prsti! Ja sam Ana, tu sam za sva pitanja.',
    },
  ],
};

const simulateDelay = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

// --- MOCK API FUNCTIONS ---

export const fetchUser: () => Promise<User> = async (): Promise<User> => {
  await simulateDelay(300);
  return JSON.parse(JSON.stringify(mockUser));
};

export const updateUser: (user: User) => Promise<User> = async (
  user: User,
): Promise<User> => {
  await simulateDelay(600);
  Object.assign(mockUser, user);
  return JSON.parse(JSON.stringify(mockUser));
};

export const fetchGardens: () => Promise<Garden[]> = async (): Promise<
  Garden[]
> => {
  await simulateDelay(500);
  return JSON.parse(JSON.stringify(mockGardens)); // Deep copy
};

export const fetchGardenActivitiesAll: () => Promise<
  Activity[]
> = async (): Promise<Activity[]> => {
  await simulateDelay(700);
  return JSON.parse(JSON.stringify(mockActivities));
};

export const fetchGardenById: (
  id: string,
) => Promise<Garden | undefined> = async (
  id: string,
): Promise<Garden | undefined> => {
  await simulateDelay(500);
  // Sanitize id: trim whitespace and remove surrounding quotes
  let cleanId = id.trim();
  if (cleanId.startsWith('"') && cleanId.endsWith('"')) {
    cleanId = cleanId.slice(1, -1);
  }
  const garden = mockGardens.find((garden) => {
    // Also sanitize garden.id just in case
    let gid = typeof garden.id === 'string' ? garden.id.trim() : garden.id;
    if (gid.startsWith('"') && gid.endsWith('"')) {
      gid = gid.slice(1, -1);
    }
    return gid === cleanId;
  });
  return garden ? JSON.parse(JSON.stringify(garden)) : undefined;
};

export const fetchActivities: () => Promise<Activity[]> = async (): Promise<
  Activity[]
> => {
  await simulateDelay(700);
  return JSON.parse(JSON.stringify(mockActivities));
};

export const fetchProducers: () => Promise<Producer[]> = async (): Promise<
  Producer[]
> => {
  await simulateDelay(200);
  return JSON.parse(JSON.stringify(mockProducers));
};

export const fetchPlotsReadyForHarvestPerGarden: (
  gardenId: string,
) => Promise<Plot[]> = async (gardenId: string): Promise<Plot[]> => {
  await simulateDelay(300);
  return JSON.parse(
    JSON.stringify(
      mockGardens
        .find((garden) => garden.id === gardenId)
        ?.plot.filter((plot) => plot.status === PlotStatus.HARVEST_READY) || [],
    ),
  );
};

export const fetchAllPlotsReadyForHarvest: () => Promise<
  Plot[]
> = async (): Promise<Plot[]> => {
  await simulateDelay(300);
  return JSON.parse(
    JSON.stringify(
      mockGardens.flatMap((garden) =>
        garden.plot.filter((plot) => plot.status === PlotStatus.HARVEST_READY),
      ),
    ),
  );
};

export const fetchAllVegetablesReadyForHarvest: () => Promise<
  Vegetable[]
> = async (): Promise<Vegetable[]> => {
  await simulateDelay(300);
  return JSON.parse(
    JSON.stringify(
      mockGardens.flatMap((garden) =>
        garden.plot
          .filter((plot) => plot.status === PlotStatus.HARVEST_READY)
          .map((plot) => plot.vegetable)
          .filter(Boolean),
      ),
    ),
  );
};

export interface LeaseNewGardenArgs {
  name: string;
  type: GardenType;
  producer: { name: string };
}
export interface LeaseNewGardenResult {
  newGarden: Garden;
  newActivity: Activity;
}

export const leaseNewGarden: (
  name: string,
  type: GardenType,
  producer: { name: string },
) => Promise<LeaseNewGardenResult> = async (
  name: string,
  type: GardenType,
  producer: { name: string },
): Promise<LeaseNewGardenResult> => {
  await simulateDelay(1200);
  const newGarden: Garden = {
    id: `garden${Date.now()}`,
    name: name,
    type: type,
    leaseDate: new Date(),
    producer: producer,
    cameraUrl: `https://picsum.photos/seed/garden${Date.now()}/1280/720`,
    plot: Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      status: PlotStatus.EMPTY,
    })),
  };
  mockGardens.push(newGarden);

  if (!PRODUCER_CONVERSATIONS[newGarden.id]) {
    PRODUCER_CONVERSATIONS[newGarden.id] = [
      {
        sender: 'bot',
        text: `Pozdrav! Ja sam ${producer.name}. Dobrodošli u vaš novi vrt '${name}'. Tu sam za sva pitanja!`,
      },
    ];
  }

  const newActivity: Activity = {
    id: `act${Date.now()}`,
    gardenId: newGarden.id,
    type: ActivityType.LEASE,
    date: new Date(),
    comment: `Uspješno ste zakupili novi vrt: ${name}.`,
  };
  mockActivities.unshift(newActivity);

  return { newGarden, newActivity };
};

export interface PlantVegetableArgs {
  gardenId: string;
  squareId: number;
  vegetable: Vegetable;
}
export interface PlantVegetableResult {
  updatedGarden: Garden;
  newActivity: Activity;
}

export const plantVegetable: (
  gardenId: string,
  squareId: number,
  vegetable: Vegetable,
) => Promise<PlantVegetableResult> = async (
  gardenId: string,
  squareId: number,
  vegetable: Vegetable,
): Promise<PlantVegetableResult> => {
  await simulateDelay(800);
  const gardenIndex = mockGardens.findIndex((g) => g.id === gardenId);
  if (gardenIndex === -1) throw new Error('Garden not found');

  const squareIndex = mockGardens[gardenIndex].plot.findIndex(
    (s) => s.id === squareId,
  );
  if (squareIndex === -1) throw new Error('Square not found');

  mockGardens[gardenIndex].plot[squareIndex] = {
    ...mockGardens[gardenIndex].plot[squareIndex],
    status: PlotStatus.PLANTED,
    vegetable: vegetable,
    plantedDate: new Date(),
  };

  const newActivity: Activity = {
    id: `act${Date.now()}`,
    gardenId: gardenId,
    type: ActivityType.PLANTING,
    date: new Date(),
    comment: `Zasađeno: ${vegetable.name}.`,
  };
  mockActivities.unshift(newActivity);

  return {
    updatedGarden: JSON.parse(JSON.stringify(mockGardens[gardenIndex])),
    newActivity,
  };
};

export interface OrderHarvestResult {
  updatedGarden: Garden;
  newActivity: Activity;
}

export const orderHarvest: (
  gardenId: string,
) => Promise<OrderHarvestResult> = async (
  gardenId: string,
): Promise<OrderHarvestResult> => {
  await simulateDelay(1000);
  const gardenIndex = mockGardens.findIndex((g) => g.id === gardenId);
  if (gardenIndex === -1) throw new Error('Garden not found');

  let harvestedCount = 0;
  mockGardens[gardenIndex].plot = mockGardens[gardenIndex].plot.map((s) => {
    if (s.status === PlotStatus.HARVEST_READY) {
      harvestedCount++;
      return {
        ...s,
        status: PlotStatus.EMPTY,
        vegetable: undefined,
        plantedDate: undefined,
      };
    }
    return s;
  });

  if (harvestedCount === 0) throw new Error('No items to harvest');

  const newActivity: Activity = {
    id: `act${Date.now()}`,
    gardenId: gardenId,
    type: ActivityType.HARVEST,
    date: new Date(),
    comment: `Naručili ste dostavu za ${harvestedCount} zrele kulture. Uskoro kreće dostava!`,
  };
  mockActivities.unshift(newActivity);

  return {
    updatedGarden: JSON.parse(JSON.stringify(mockGardens[gardenIndex])),
    newActivity,
  };
};

export const fetchProducerMessages: (
  gardenId: string,
) => Promise<ChatMessage[]> = async (
  gardenId: string,
): Promise<ChatMessage[]> => {
  await simulateDelay(300);
  return JSON.parse(JSON.stringify(PRODUCER_CONVERSATIONS[gardenId] || []));
};

export const sendProducerMessage: (
  gardenId: string,
  message: ChatMessage,
) => Promise<ChatMessage> = async (
  gardenId: string,
  message: ChatMessage,
): Promise<ChatMessage> => {
  await simulateDelay(400);
  if (!PRODUCER_CONVERSATIONS[gardenId]) {
    PRODUCER_CONVERSATIONS[gardenId] = [];
  }
  PRODUCER_CONVERSATIONS[gardenId].push(message);
  return JSON.parse(JSON.stringify(message));
};
