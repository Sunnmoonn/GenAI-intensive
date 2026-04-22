import { getPersonalizedComment } from './personalization';

// Menu data for recommendations
const menuItems = [
  {
    id: 1,
    name: 'Спагетти Неро с креветками в томатном соусе',
    price: 339,
    weight: '250 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1749385326259-5f2380496a3d?w=400&q=75',
    description: 'Погрузитесь в контрасты Итальянского побережья. Угольно-черные спагетти, окрашенные чернилами каракатицы, в ярком соусе из сочных томатов и черри. Нежные креветки, пикантные каперсы и ноты чеснока создают свежий, насыщенный вкус. Завершает картину лёгкая солоноватость сыра — идеальная морская симфония в вашей тарелке.',
    emoji: '🥰',
    ingredients: ['Креветки', 'Томаты', 'Паста'],
    allergens: ['Морепродукты', 'Глютен'],
  },
  {
    id: 2,
    name: 'Мусс из манки с рикоттой и клюквой',
    price: 339,
    weight: '250 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1641677317132-045e9e367d5d?w=400&q=75',
    description: 'Воздушный мусс из манной крупы с нежной рикоттой, украшенный яркой клюквой и малиной. Легкий и освежающий десерт.',
    emoji: null,
    ingredients: ['Рикотта', 'Ягоды'],
    allergens: ['Лактоза'],
  },
  {
    id: 3,
    name: 'Ёжики мясные с рисом',
    price: 339,
    weight: '250 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1649777476920-0eef34169cdb?w=400&q=75',
    description: 'Сочные мясные тефтели с рисом, томленные в ароматном соусе. Классическое домашнее блюдо.',
    emoji: null,
    ingredients: ['Мясо', 'Рис'],
    allergens: [],
  },
  {
    id: 4,
    name: 'Курица в азиатском соусе',
    price: 339,
    weight: '250 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1682622110433-65513a55d7da?w=400&q=75',
    description: 'Нежное куриное филе с хрустящими овощами и кунжутом. Легкое и питательное блюдо.',
    emoji: null,
    ingredients: ['Курица'],
    allergens: ['Глютен'],
  },
  {
    id: 5,
    name: 'Томатный суп с морепродуктами',
    price: 339,
    weight: '250 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1626200419537-f07108a01aac?w=400&q=75',
    description: 'Насыщенный томатный суп с ассорти из морепродуктов, чесноком и базиликом.',
    emoji: null,
    ingredients: ['Томаты', 'Морепродукты'],
    allergens: ['Морепродукты'],
  },
  {
    id: 6,
    name: 'Крем-суп из чечевицы с беконом',
    price: 339,
    weight: '250 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1711915408337-ae6b1207e42d?w=400&q=75',
    description: 'Бархатистый крем-суп из красной чечевицы с хрустящим беконом и сливками.',
    emoji: null,
    ingredients: ['Бекон'],
    allergens: ['Лактоза'],
  },
  {
    id: 7,
    name: 'Паста Карбонара',
    price: 389,
    weight: '280 г',
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=75',
    description: 'Классическая итальянская паста с беконом, яйцом, сыром пармезан и черным перцем. Сливочная и насыщенная.',
    emoji: null,
    ingredients: ['Паста', 'Сыр', 'Бекон'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 8,
    name: 'Феттучини с грибами в сливочном соусе',
    price: 369,
    weight: '270 г',
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=75',
    description: 'Нежная феттучини с лесными грибами в сливочном соусе с чесноком и пармезаном.',
    emoji: null,
    ingredients: ['Паста', 'Грибы', 'Сыр'],
    allergens: ['Глютен', 'Лактоза', 'Грибы'],
  },
  {
    id: 10,
    name: 'Ризотто с морепродуктами',
    price: 429,
    weight: '280 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1476124369491-f6e5c3f9c4e5?w=400&q=75',
    description: 'Кремовое ризотто с креветками, мидиями и кальмарами. Изысканное блюдо с морским вкусом.',
    emoji: null,
    ingredients: ['Рис', 'Морепродукты', 'Креветки'],
    allergens: ['Морепродукты', 'Лактоза'],
  },
  {
    id: 11,
    name: 'Стейк из лосося на гриле',
    price: 459,
    weight: '200 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=75',
    description: 'Сочный стейк из лосося на гриле с лимонным маслом и свежими овощами.',
    emoji: null,
    ingredients: ['Рыба'],
    allergens: ['Рыба'],
  },
  {
    id: 12,
    name: 'Грибной крем-суп',
    price: 299,
    weight: '300 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=75',
    description: 'Бархатистый крем-суп из белых грибов со сливками и трюфельным маслом.',
    emoji: null,
    ingredients: ['Грибы'],
    allergens: ['Грибы', 'Лактоза'],
  },
  {
    id: 13,
    name: 'Том Ям с креветками',
    price: 379,
    weight: '350 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=75',
    description: 'Острый тайский суп с креветками, лемонграссом, кафир-лаймом и грибами.',
    emoji: null,
    ingredients: ['Креветки', 'Грибы', 'Морепродукты'],
    allergens: ['Морепродукты', 'Острое', 'Грибы'],
  },
  {
    id: 14,
    name: 'Тирамису классический',
    price: 319,
    weight: '150 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75',
    description: 'Легендарный итальянский десерт с печеньем савоярди, маскарпоне и кофе.',
    emoji: null,
    ingredients: ['Сыр'],
    allergens: ['Лактоза', 'Глютен'],
  },
  {
    id: 15,
    name: 'Чизкейк Нью-Йорк',
    price: 339,
    weight: '180 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1533134242820-b4f65b3b6ed0?w=400&q=75',
    description: 'Классический американский чизкейк с нежной текстурой и легкой кислинкой.',
    emoji: null,
    ingredients: ['Сыр'],
    allergens: ['Лактоза', 'Глютен'],
  },
  {
    id: 16,
    name: 'Панна-котта с ягодным соусом',
    price: 289,
    weight: '140 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=75',
    description: 'Итальянский молый десерт с ванилью и свежим ягодным соусом.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоза'],
  },
  {
    id: 18,
    name: 'Капучино',
    price: 179,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=75',
    description: 'Классический кофе с молоком и воздушной молочной пенкой.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоза'],
    temperature: 'hot',
  },
  {
    id: 19,
    name: 'Латте',
    price: 189,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=75',
    description: 'Нежный кофе с большим количеством молока и тонким слоем пенки.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоза'],
    temperature: 'hot',
  },
  {
    id: 20,
    name: 'Апельсиновый фреш',
    price: 199,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=75',
    description: 'Свежевыжатый сок из спелых апельсинов. Богат витамином C.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
  },
  {
    id: 22,
    name: 'Смузи ягодный',
    price: 219,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=75',
    description: 'Густой смузи из клубники, малины, черники и банана.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
  },
  {
    id: 24,
    name: 'Цезарь с курицей',
    price: 359,
    weight: '280 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=75',
    description: 'Классический салат с курицей гриль, листьями романо, сухариками и соусом цезарь.',
    emoji: null,
    ingredients: ['Курица', 'Сыр'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 25,
    name: 'Греческий салат',
    price: 329,
    weight: '260 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=75',
    description: 'Свежие огурцы, томаты, болгарский перец, красный лук, оливки и сыр фета.',
    emoji: null,
    ingredients: ['Томаты', 'Сыр'],
    allergens: ['Лактоза'],
  },
  {
    id: 26,
    name: 'Салат с креветками и авокадо',
    price: 399,
    weight: '240 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=75',
    description: 'Нежные креветки с авокадо, микс салатов и лимонной заправкой.',
    emoji: null,
    ingredients: ['Креветки', 'Морепродукты'],
    allergens: ['Морепродукты'],
  },
  {
    id: 27,
    name: 'Теплый салат с курицей и грибами',
    price: 369,
    weight: '270 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=75',
    description: 'Теплый салат с жареной курицей, шампиньонами и бальзамической заправкой.',
    emoji: null,
    ingredients: ['Курица', 'Грибы'],
    allergens: ['Грибы'],
  },
  {
    id: 28,
    name: 'Стейк Рибай с картофелем',
    price: 899,
    weight: '350 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=75',
    description: 'Сочный стейк из мраморной говядины средней прожарки с жареным картофелем и овощами гриль.',
    emoji: null,
    ingredients: ['Мясо'],
    allergens: [],
  },
  {
    id: 29,
    name: 'Утиная грудка с апельсиновым соусом',
    price: 749,
    weight: '280 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1626074353765-517a65aeaf50?w=400&q=75',
    description: 'Нежная утиная грудка с карамелизированными апельсинами и медовым соусом.',
    emoji: null,
    ingredients: ['Мясо'],
    allergens: [],
  },
  {
    id: 30,
    name: 'Боул с тунцом и киноа',
    price: 429,
    weight: '320 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=75',
    description: 'Питательный боул с обжаренным тунцом, киноа, авокадо, эдамаме и кунжутным соусом.',
    emoji: null,
    ingredients: ['Рыба'],
    allergens: ['Рыба', 'Глютен'],
  },
  {
    id: 31,
    name: 'Тыквенный крем-суп',
    price: 279,
    weight: '300 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=75',
    description: 'Бархатистый крем-суп из запеченной тыквы с имбирем, кокосовым молоком и тыквенными семечками.',
    emoji: null,
    ingredients: [],
    allergens: ['Орехи'],
  },
  {
    id: 32,
    name: 'Бургер с говядиной',
    price: 459,
    weight: '320 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75',
    description: 'Сочная котлета из мраморной говядины, сыр чеддер, салат айсберг, томаты, маринованные огурцы и фирменный соус.',
    emoji: null,
    ingredients: ['Мясо', 'Сыр'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 33,
    name: 'Пицца Маргарита',
    price: 529,
    weight: '450 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=75',
    description: 'Классическая итальянская пицца с томатами, моцареллой и свежим базиликом.',
    emoji: null,
    ingredients: ['Томаты', 'Сыр'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 34,
    name: 'Пицца с прошутто и рукколой',
    price: 629,
    weight: '480 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=75',
    description: 'Пицца с итальянской ветчиной прошутто, рукколой, пармезаном и бальзамическим кремом.',
    emoji: null,
    ingredients: ['Мясо', 'Сыр'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 35,
    name: 'Лазанья болоньезе',
    price: 449,
    weight: '350 г',
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=400&q=75',
    description: 'Традиционная итальянская лазанья с мясным соусом болоньезе, бешамелем и сыром.',
    emoji: null,
    ingredients: ['Паста', 'Мясо', 'Сыр'],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 36,
    name: 'Шоколадный фондан',
    price: 349,
    weight: '130 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=75',
    description: 'Горячий шокола��ный кекс с жидкой начинкой, подается с шариком ванильного мороженого.',
    emoji: null,
    ingredients: [],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 37,
    name: 'Медовик классический',
    price: 299,
    weight: '160 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=75',
    description: 'Многослойный торт с медовыми коржами и нежным кремом.',
    emoji: null,
    ingredients: [],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 38,
    name: 'Эклер шоколадный',
    price: 189,
    weight: '100 г',
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1612201142855-ba9bd6c94726?w=400&q=75',
    description: 'Воздушный эклер с заварным кремом и шоколадной глазурью.',
    emoji: null,
    ingredients: [],
    allergens: ['Глютен', 'Лактоза'],
  },
  {
    id: 39,
    name: 'Капрезе салат',
    price: 389,
    weight: '220 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=75',
    description: 'Классический итальянский салат с томатами, моцареллой, базиликом и оливковым маслом.',
    emoji: null,
    ingredients: ['Томаты', 'Сыр'],
    allergens: ['Лактоза'],
  },
  {
    id: 40,
    name: 'Вино красное сухое',
    price: 450,
    weight: '150 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=75',
    description: 'Бокал красного сухого вина с нотами вишни и специй.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'room',
    isAlcohol: true,
  },
  {
    id: 41,
    name: 'Вино белое сухое',
    price: 430,
    weight: '150 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&q=75',
    description: 'Освежающее белое сухое вино с цитрусовыми нотами.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 42,
    name: 'Просекко',
    price: 520,
    weight: '150 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1598254436213-8a9d569159d9?w=400&q=75',
    description: 'Игристое итальянское вино с легкими фруктовыми нотами.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 43,
    name: 'Апероль Шприц',
    price: 390,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=400&q=75',
    description: 'Освежающий коктейль с Апероль, просекко и содовой с апельсином.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 44,
    name: 'Мохито классический',
    price: 350,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=75',
    description: 'Кубинский коктейль с ромом, лаймом, мятой и содовой.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 45,
    name: 'Негрони',
    price: 420,
    weight: '100 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400&q=75',
    description: 'Классический итальянский коктейль с джином, кампари и вермутом.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 46,
    name: 'Пиво светлое',
    price: 280,
    weight: '500 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=75',
    description: 'Освежающее светлое пиво с легким хмелевым вкусом.',
    emoji: null,
    ingredients: [],
    allergens: ['Глютен'],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 47,
    name: 'Пиво темное',
    price: 290,
    weight: '500 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=75',
    description: 'Темное пиво с насыщенным солодовым вкусом и нотами карамели.',
    emoji: null,
    ingredients: [],
    allergens: ['Глютен'],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 48,
    name: 'Виски кола',
    price: 380,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1527281400689-41d3fa32857e?w=400&q=75',
    description: 'Классическое сочетание виски с колой и льдом.',
    emoji: null,
    ingredients: [],
    allergens: [],
    temperature: 'cold',
    isAlcohol: true,
  },
  {
    id: 49,
    name: 'Капрезе с буррата',
    price: 459,
    weight: '250 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=75',
    description: 'Итальянский салат с кремовой буррата, томатами черри, базиликом и бальзамическим кремом.',
    emoji: null,
    ingredients: ['Томаты', 'Сыр'],
    allergens: ['Лактоза'],
  },
  {
    id: 50,
    name: 'Рамен с курицей',
    price: 399,
    weight: '400 г',
    category: 'soup',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=75',
    description: 'Японский суп с лапшой рамен, курицей, яйцом, грибами и зеленым луком в насыщенном бульоне.',
    emoji: null,
    ingredients: ['Курица', 'Паста', 'Грибы'],
    allergens: ['Глютен', 'Грибы'],
  },
];

interface QuizData {
  favoriteIngredients: string[];
  hatedIngredients: string[];
  hungerLevel: string;
  mood: string;
  name: string;
  drinks?: string[];
}

interface Recommendation {
  id: number;
  name: string;
  category: string;
  image: string;
  reason: string;
}

// Helper function to check if ingredient matches (with fuzzy matching)
const ingredientMatches = (ingredient: string, target: string): boolean => {
  const ing = ingredient.toLowerCase();
  const targ = target.toLowerCase();
  return ing.includes(targ) || targ.includes(ing);
};

// Calculate match score for a dish
const calculateScore = (dish: any, data: QuizData): number => {
  let score = 0;
  
  // Check for allergens (dealbreaker)
  const hasAllergen = dish.allergens.some((allergen: string) =>
    data.hatedIngredients.some(hated => ingredientMatches(allergen, hated))
  );
  if (hasAllergen) return -1000; // Exclude dishes with allergens

  // Check for favorite ingredients (big bonus)
  dish.ingredients.forEach((ingredient: string) => {
    if (data.favoriteIngredients.some(fav => ingredientMatches(ingredient, fav))) {
      score += 10;
    }
  });

  // NEW: Handle preference categories from new quiz format
  data.favoriteIngredients.forEach((pref: string) => {
    const prefLower = pref.toLowerCase();
    
    // Vegetables preference
    if (prefLower.includes('овощ')) {
      if (dish.category === 'salad') score += 8;
    }
    
    // Meat preference
    if (prefLower.includes('мясо')) {
      if (dish.ingredients.some((ing: string) => 
        ing.toLowerCase().includes('мясо') || 
        ing.toLowerCase().includes('говяд') || 
        ing.toLowerCase().includes('свин')
      )) score += 10;
    }
    
    // Chicken is also meat
    if (dish.ingredients.some((ing: string) => ing.toLowerCase().includes('курица'))) {
      if (prefLower.includes('мясо')) score += 8;
    }
    
    // Fish preference
    if (prefLower.includes('рыба')) {
      if (dish.ingredients.some((ing: string) => 
        ing.toLowerCase().includes('рыб') || 
        ing.toLowerCase().includes('лосос')
      )) score += 10;
    }
    
    // Seafood preference
    if (prefLower.includes('морепродукт')) {
      if (dish.ingredients.some((ing: string) => 
        ing.toLowerCase().includes('креветк') || 
        ing.toLowerCase().includes('морепродукт')
      )) score += 10;
    }
    
    // Spicy preference
    if (prefLower.includes('остр')) {
      if (dish.allergens.includes('Острое')) score += 10;
    }
    
    // Sweet preference (desserts)
    if (prefLower.includes('сладк')) {
      if (dish.category === 'dessert') score += 15;
    }
    
    // Soup preference
    if (prefLower.includes('суп')) {
      if (dish.category === 'soup') score += 15;
    }
  });

  // Mood-based scoring
  if (data.mood === 'Грустно' || data.mood === 'Устало') {
    if (dish.category === 'dessert') score += 5;
    if (dish.ingredients.some((ing: string) => ing.includes('Сыр'))) score += 3;
  }
  
  if (data.mood === 'Романтично') {
    if (dish.category === 'main' && dish.price > 400) score += 5;
    if (dish.ingredients.some((ing: string) => ing.includes('Морепродукты') || ing.includes('Креветки'))) score += 4;
  }

  if (data.mood === 'Энергично' || data.mood === 'Счастливо') {
    if (dish.category === 'salad') score += 3;
    if (dish.allergens.includes('Острое')) score += 2;
  }

  // Hunger level scoring
  if (data.hungerLevel === 'Очень голоден') {
    if (dish.category === 'main' || dish.category === 'pasta') score += 5;
    if (dish.price > 380) score += 2; // Bigger portions tend to be pricier
  }

  if (data.hungerLevel === 'Немного голоден') {
    if (dish.category === 'soup' || dish.category === 'salad') score += 5;
  }
  
  // Give drinks a base score so they always appear
  if (dish.category === 'drinks') {
    score += 3; // Base score for drinks
    
    // Boost score based on drink preferences
    if (data.drinks && data.drinks.length > 0) {
      data.drinks.forEach((drinkPref: string) => {
        const prefLower = drinkPref.toLowerCase();
        
        // Hot drinks preference
        if (prefLower.includes('тепл') && dish.temperature === 'hot') {
          score += 12;
        }
        
        // Cold drinks preference
        if (prefLower.includes('холодн') && dish.temperature === 'cold') {
          score += 12;
        }
      });
    }
  }

  return score;
};

function generateRecommendations(data: QuizData): Recommendation[] {
  try {
    // Validate input data
    if (!data) {
      console.error('No data provided to generateRecommendations');
      return [];
    }

    // Ensure arrays exist
    const safeData = {
      ...data,
      favoriteIngredients: Array.isArray(data.favoriteIngredients) ? data.favoriteIngredients : [],
      hatedIngredients: Array.isArray(data.hatedIngredients) ? data.hatedIngredients : [],
    };

    const scored = menuItems.map(dish => ({
      ...dish,
      score: calculateScore(dish, safeData),
    })).filter(dish => dish.score > -1000); // Remove dishes with allergens

    // Sort all dishes by score
    scored.sort((a, b) => b.score - a.score);

    const recommendations: Recommendation[] = [];
    
    // Analyze user preferences to determine what categories to prioritize
    const prefLower = safeData.favoriteIngredients.map(p => p.toLowerCase());
    const wantsSweets = prefLower.some(p => p.includes('сладк'));
    const wantsVegetables = prefLower.some(p => p.includes('овощ'));
    const wantsSoup = prefLower.some(p => p.includes('суп'));
    const wantsMeat = prefLower.some(p => p.includes('мясо'));
    const wantsFish = prefLower.some(p => p.includes('рыба'));
    const wantsSeafood = prefLower.some(p => p.includes('морепродукт'));
    const wantsSpicy = prefLower.some(p => p.includes('остр'));
    
    const hasDrinkPreferences = safeData.drinks && safeData.drinks.length > 0;

    // Dynamic recommendation strategy based on preferences with smart fallbacks
    if (wantsSweets) {
      // User wants sweets - recommend multiple desserts (3-4)
      const desserts = scored.filter(d => d.category === 'dessert').slice(0, 4);
      desserts.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // If not enough desserts, don't add fallbacks for sweets
      // (sweets are very specific, no good alternatives)
    }
    
    if (wantsVegetables) {
      // User wants vegetables - recommend multiple salads (2-3)
      const salads = scored.filter(d => d.category === 'salad').slice(0, 3);
      salads.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // Fallback: If not enough salads, add vegetable soups
      if (salads.length < 2) {
        const veggieSoups = scored.filter(d => 
          d.category === 'soup' && 
          !d.ingredients.some((ing: string) => 
            ing.toLowerCase().includes('мясо') || 
            ing.toLowerCase().includes('морепродукт') ||
            ing.toLowerCase().includes('креветк')
          )
        ).slice(0, 2);
        veggieSoups.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
    }
    
    if (wantsSoup) {
      // User wants soup - recommend multiple soups (2-3)
      const soups = scored.filter(d => d.category === 'soup').slice(0, 3);
      soups.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
    }
    
    if (wantsFish) {
      // User wants fish - first try to find fish dishes
      const fishDishes = scored.filter(d => 
        d.ingredients.some((ing: string) => 
          ing.toLowerCase().includes('рыб') || 
          ing.toLowerCase().includes('лосос')
        )
      ).slice(0, 3);
      
      fishDishes.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // SMART FALLBACK: If no fish or not enough, recommend seafood as next best alternative
      if (fishDishes.length < 2) {
        const seafoodDishes = scored.filter(d => 
          d.ingredients.some((ing: string) => 
            ing.toLowerCase().includes('креветк') || 
            ing.toLowerCase().includes('морепродукт')
          ) &&
          !fishDishes.some(fd => fd.id === d.id) // Don't duplicate
        ).slice(0, 3 - fishDishes.length);
        
        seafoodDishes.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
      
      // Second fallback: If still not enough, add general main dishes
      if (fishDishes.length + recommendations.length < 2) {
        const mainDishes = scored.filter(d => 
          (d.category === 'main' || d.category === 'pasta') &&
          !recommendations.some(r => r.id === d.id)
        ).slice(0, 1);
        
        mainDishes.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
    }
    
    if (wantsSeafood) {
      // User wants seafood - first try seafood
      const seafoodDishes = scored.filter(d => 
        d.ingredients.some((ing: string) => 
          ing.toLowerCase().includes('креветк') || 
          ing.toLowerCase().includes('морепродукт')
        )
      ).slice(0, 3);
      
      seafoodDishes.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // SMART FALLBACK: If no seafood or not enough, recommend fish as close alternative
      if (seafoodDishes.length < 2) {
        const fishDishes = scored.filter(d => 
          d.ingredients.some((ing: string) => 
            ing.toLowerCase().includes('рыб') || 
            ing.toLowerCase().includes('лосос')
          ) &&
          !seafoodDishes.some(sd => sd.id === d.id) // Don't duplicate
        ).slice(0, 3 - seafoodDishes.length);
        
        fishDishes.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
    }
    
    if (wantsMeat) {
      // User wants meat - first try pure meat dishes
      const meatDishes = scored.filter(d => 
        d.ingredients.some((ing: string) => 
          ing.toLowerCase().includes('мясо') || 
          ing.toLowerCase().includes('говяд') || 
          ing.toLowerCase().includes('свин') ||
          ing.toLowerCase().includes('бекон')
        )
      ).slice(0, 3);
      
      meatDishes.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // SMART FALLBACK: If not enough meat, recommend chicken as close alternative
      if (meatDishes.length < 2) {
        const chickenDishes = scored.filter(d => 
          d.ingredients.some((ing: string) => 
            ing.toLowerCase().includes('курица')
          ) &&
          !meatDishes.some(md => md.id === d.id) // Don't duplicate
        ).slice(0, 2);
        
        chickenDishes.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
      
      // Second fallback: If still not enough, add pasta with meat
      if (meatDishes.length === 0) {
        const pastaWithMeat = scored.filter(d => 
          d.category === 'pasta' &&
          !recommendations.some(r => r.id === d.id)
        ).slice(0, 2);
        
        pastaWithMeat.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
    }
    
    if (wantsSpicy) {
      // User wants spicy - find all spicy dishes
      const spicyDishes = scored.filter(d => 
        d.allergens.includes('Острое')
      ).slice(0, 3);
      
      spicyDishes.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
      
      // Fallback: If no spicy dishes available, recommend main dishes with bold flavors
      if (spicyDishes.length === 0) {
        const boldDishes = scored.filter(d => 
          d.category === 'main' &&
          (d.ingredients.some((ing: string) => 
            ing.toLowerCase().includes('морепродукт') ||
            ing.toLowerCase().includes('креветк')
          ))
        ).slice(0, 2);
        
        boldDishes.forEach(dish => {
          recommendations.push(createRecommendation(dish, safeData));
        });
      }
    }
    
    if (hasDrinkPreferences) {
      // User specified drink preferences - recommend 1-2 drinks
      const drinks = scored.filter(d => d.category === 'drinks').slice(0, 2);
      drinks.forEach(dish => {
        recommendations.push(createRecommendation(dish, safeData));
      });
    }

    // If no specific preferences were strong, use balanced approach
    if (recommendations.length === 0) {
      // Get top dish from each category (classic approach)
      const categories = [
        { key: 'soup', name: 'Суп' },
        { key: 'salad', name: 'Салат' },
        { key: 'main', name: 'Основное' },
        { key: 'dessert', name: 'Десерт' },
        { key: 'drinks', name: 'Напиток' },
      ];

      categories.forEach(({ key }) => {
        const categoryDishes = scored.filter(d => d.category === key);
        if (categoryDishes.length > 0) {
          const topDish = categoryDishes[0];
          if (topDish && topDish.id && topDish.name) {
            recommendations.push(createRecommendation(topDish, safeData));
          }
        }
      });
    } else {
      // Remove duplicates based on dish ID
      const uniqueRecommendations = recommendations.filter((rec, index, self) =>
        index === self.findIndex((r) => r.id === rec.id)
      );
      return uniqueRecommendations.slice(0, 8); // Limit to max 8 recommendations
    }

    return recommendations;
  } catch (error) {
    console.error('Error in generateRecommendations:', error);
    return [];
  }
}

// Helper function to create a recommendation object
function createRecommendation(dish: any, safeData: any): Recommendation {
  let personalizedComment = 'Отличный выбор!';
  try {
    if (typeof getPersonalizedComment === 'function') {
      personalizedComment = getPersonalizedComment(dish, {
        favoriteIngredients: safeData.favoriteIngredients,
        hatedIngredients: safeData.hatedIngredients,
        hungerLevel: safeData.hungerLevel,
        mood: safeData.mood,
        name: safeData.name,
      });
    }
  } catch (commentError) {
    console.error('Error getting personalized comment:', commentError);
  }
  
  return {
    id: dish.id,
    name: dish.name,
    category: dish.category,
    image: dish.image,
    reason: personalizedComment,
  };
}

export { generateRecommendations };
export default generateRecommendations;