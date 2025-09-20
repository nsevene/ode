// SEO data centralized
export const menuItems = [
  {
    name: 'Signature Wagyu Burger',
    description:
      'Signature Wagyu Burger with truffle mayo and caramelized onions',
    price: 28,
    category: 'Burgers',
    image: '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png',
  },
  {
    name: 'Truffle Pasta',
    description: 'Black truffle pasta with parmesan and white mushrooms',
    price: 24,
    category: 'Pasta',
    image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
  },
  {
    name: 'Dragon Roll',
    description: 'Signature roll with eel, avocado and tobiko caviar',
    price: 18,
    category: 'Sushi',
    image: '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
  },
];

export const upcomingEvents = [
  {
    id: 'chef-table-tasting',
    name: "Chef's Table Tasting Experience",
    description:
      "Exclusive chef's table tasting experience in intimate setting",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    price: 55,
    maxAttendees: 6,
    instructor: 'Chef Andrew Ivanov',
    category: 'Gastronomy',
  },
];
