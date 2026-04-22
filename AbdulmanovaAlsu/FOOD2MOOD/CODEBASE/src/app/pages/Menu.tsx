import { useState } from 'react';
import { Sparkles, Shell, Drumstick, Flame, Fish, Nut, Pizza, Wheat, Heart, Milk, UtensilsCrossed, Cookie, HeartCrack, ShoppingBag } from 'lucide-react';
import MenuItem from '../components/MenuItem';
import MenuDetail from '../components/MenuDetail';
import ChatBot from '../components/ChatBot';
import Basket from '../components/Basket';
import { usePreferences } from '../context/PreferencesContext';
import { useBasket } from '../context/BasketContext';
import { getPersonalizedComment } from '../utils/personalization';

// Predefined ingredient options from quiz
const predefinedFavorites = ['Креветки', 'Сыр', 'Грибы', 'Томаты', 'Курица', 'Рис', 'Паста', 'Морепродукты'];
const predefinedHated = ['Лактоза', 'Глютен', 'Орехи', 'Грибы', 'Мясо', 'Рыба', 'Морепродукты', 'Острое'];

// Allergen icon mapping
const allergenIcons: Record<string, LucideIcon> = {
  'Лактоза': Milk,
  'Глютен': Wheat,
  'Морепродукты': Shell,
  'Мясо': Drumstick,
  'Острое': Flame,
  'Рыба': Fish,
  'Орехи': Nut,
};

// Ingredient icon mapping for favorites
const ingredientIcons: Record<string, LucideIcon> = {
  'Креветки': Shell,
  'Томаты': Flame,
  'Паста': Wheat,
  'Рикотта': Pizza,
  'Ягоды': Heart,
  'Мясо': Drumstick,
  'Рис': Wheat,
  'Курица': Drumstick,
  'Морепродукты': Shell,
  'Бекон': Drumstick,
  'Рыба': Fish,
  'Орехи': Nut,
  'Сыр': Pizza,
  'Грибы': Nut,
};

export const menuItems = [
  {
    id: 1,
    name: 'Спагетти Неро с креветками в томатном соусе',
    price: 339,
    weight: '250 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1765100778802-f684a4b7fd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1599034596263-63c68c75ef8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1655405192379-cfef4cb0ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1763627719029-d7122ae87e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1711915408847-ae32b80a3fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1596381490792-137ce067f89e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Нежная феттучини с лесными грибами в сливочном соусе с чесноком и пармезаном.',
    emoji: null,
    ingredients: ['Паста', 'Грибы', 'Сыр'],
    allergens: ['Глютен', 'Лактоза', 'Грибы'],
  },
  {
    id: 9,
    name: 'Пенне Аррабьята',
    price: 329,
    weight: '250 г',
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1634614731657-77a43ff82ba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Острая паста в томатном соусе с чесноком, перцем чили и базиликом. Для любителей острых ощущений.',
    emoji: null,
    ingredients: ['Паста', 'Томаты'],
    allergens: ['Глютен', 'Острое'],
  },
  {
    id: 10,
    name: 'Ризотто с морепродуктами',
    price: 429,
    weight: '280 г',
    category: 'main',
    image: 'https://images.unsplash.com/photo-1763647738062-d83e44328a6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1738010710717-d2895fc5b706?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1608376630927-d064ac74866e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1761037994516-502ed10932b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1611497438246-dcbb383de3c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1639402218173-87129a933825?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Итальянский молочный десерт с ванилью и свежим ягодным соусом.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоа'],
  },
  {
    id: 17,
    name: 'Эспрессо',
    price: 129,
    weight: '30 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1645445644664-8f44112f334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Крепкий итальянский кофе с насыщенным вкусом и ароматом.',
    emoji: null,
    ingredients: [],
    allergens: [],
  },
  {
    id: 18,
    name: 'Капучино',
    price: 179,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1643909618082-d916d591c2a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Классический кофе с молоком и воздушной молочной пенкой.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоза'],
  },
  {
    id: 19,
    name: 'Латте',
    price: 189,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1619192734912-ef21a714f975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Нежный кофе с большим количеством молока и тонким слоем пенки.',
    emoji: null,
    ingredients: [],
    allergens: ['Лактоза'],
  },
  {
    id: 20,
    name: 'Апельсиновый фреш',
    price: 199,
    weight: '250 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1641659735894-45046caad624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Свежевыжатый сок из спелых апельсинов. Богат витамином C.',
    emoji: null,
    ingredients: [],
    allergens: [],
  },
  {
    id: 21,
    name: 'Лимонад домашний',
    price: 169,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1656936632107-0bfa69ea06de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Освежающий лимонад с мятой, лимоном и тростниковым сахаром.',
    emoji: null,
    ingredients: [],
    allergens: [],
  },
  {
    id: 22,
    name: 'Смузи ягодный',
    price: 219,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1657041381305-12e765b7444f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Густой смузи из клубники, малины, черники и банана.',
    emoji: null,
    ingredients: [],
    allergens: [],
  },
  {
    id: 23,
    name: 'Чай зеленый',
    price: 119,
    weight: '300 мл',
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1594525480694-2d878f9eb08a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Ароматный зеленый чай с легкими травяными нотами.',
    emoji: null,
    ingredients: [],
    allergens: [],
  },
  {
    id: 24,
    name: 'Цезарь с курицей',
    price: 359,
    weight: '280 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1772302541031-a3b86115ba5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1764397514710-227681ae8e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1749146878355-12966d7a83e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1771471529618-b54b7a809f87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1708414768203-b8745ab86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Сочный стейк из мраморной говядины средней прожарки с жареным картофелем и овощами гриль.',
    emoji: null,
    ingredients: ['Мясо'],
    allergens: [],
  },
  // {
  //   id: 29,
  //   name: 'Утиная грудка с апельсиновым соусом',
  //   price: 749,
  //   weight: '280 г',
  //   category: 'main',
  //   image: 'https://images.unsplash.com/photo-1701120006891-87186be6c59c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  //   description: 'Нежная утиная грудка с карамелизированными апельсинами и медовым соусом.',
  //   emoji: null,
  //   ingredients: ['Мясо'],
  //   allergens: [],
  // },
  {
    id: 30,
    name: 'Боул с тунцом и киноа',
    price: 429,
    weight: '320 г',
    category: 'salad',
    image: 'https://images.unsplash.com/photo-1728691192410-ae2ece584c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1625937712842-061738bb1e2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1576843776838-032ac46fbb93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1762922425226-9411194abb68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1625228202128-fcd5495a66b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Горячий шоколадный кекс с жидкой начинкой, подается с шариком ванильного мороженого.',
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
    image: 'https://images.unsplash.com/photo-1605138693981-6c8a5ea87796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1768775134268-6068c6d7c841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1769458313937-b5ad8f84942e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    category: 'alcohol',
    image: 'https://images.unsplash.com/photo-1665567176924-52c7cd5b9393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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
    category: 'alcohol',
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

export const menuCalories: Record<number, number> = {
  1: 520, 2: 280, 3: 480, 4: 380, 5: 180, 6: 230, 7: 620, 8: 560,
  9: 430, 10: 580, 11: 320, 12: 190, 13: 210, 14: 340, 15: 390,
  16: 250, 17: 5, 18: 80, 19: 110, 20: 90, 21: 70, 22: 140, 23: 5,
  24: 320, 25: 210, 26: 280, 27: 300, 28: 750, 30: 350, 31: 170,
  32: 680, 33: 850, 34: 900, 35: 640, 36: 450, 37: 380, 38: 280,
  39: 220, 40: 130, 41: 120, 42: 115, 43: 180, 44: 160, 45: 190,
  46: 200, 47: 220, 48: 230, 49: 240, 50: 420,
};

const categories = [
  { id: 'main', name: 'Основное' },
  { id: 'pasta', name: 'Паста' },
  { id: 'soup', name: 'Супы' },
  { id: 'salad', name: 'Салаты' },
  { id: 'dessert', name: 'Десерты' },
  { id: 'drinks', name: 'Напитки' },
  { id: 'alcohol', name: 'Алкоголь' },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('main');
  const [selectedItem, setSelectedItem] = useState<typeof menuItems[0] | null>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { preferences } = usePreferences();
  const { getTotalItems } = useBasket();

  // Calculate relevance score for sorting
  const calculateRelevanceScore = (item: typeof menuItems[0]) => {
    let score = 0;

    if (!preferences?.preferences || preferences.preferences.length === 0) {
      return 0; // No sorting if no preferences
    }

    // Check if dish matches user preferences
    preferences.preferences.forEach(pref => {
      const prefLower = pref.toLowerCase();
      
      // Vegetables preference
      if (prefLower.includes('овощ')) {
        if (item.category === 'salad') score += 20;
        if (item.ingredients.some(ing => 
          ing.toLowerCase().includes('овощ') || 
          ing.toLowerCase().includes('томат') ||
          ing.toLowerCase().includes('огур') ||
          ing.toLowerCase().includes('салат')
        )) score += 10;
      }
      
      // Meat preference
      if (prefLower.includes('мясо')) {
        if (item.ingredients.some(ing => 
          ing.toLowerCase().includes('мясо') || 
          ing.toLowerCase().includes('говяд') || 
          ing.toLowerCase().includes('свин') ||
          ing.toLowerCase().includes('курица') ||
          ing.toLowerCase().includes('бекон')
        )) score += 25;
      }
      
      // Fish preference
      if (prefLower.includes('рыба')) {
        if (item.ingredients.some(ing => 
          ing.toLowerCase().includes('рыб') || 
          ing.toLowerCase().includes('лосос') ||
          ing.toLowerCase().includes('тунец')
        )) score += 25;
      }
      
      // Seafood preference
      if (prefLower.includes('морепродукт')) {
        if (item.ingredients.some(ing => 
          ing.toLowerCase().includes('креветк') || 
          ing.toLowerCase().includes('морепродукт') ||
          ing.toLowerCase().includes('мидии') ||
          ing.toLowerCase().includes('кальмар')
        )) score += 25;
      }
      
      // Spicy preference
      if (prefLower.includes('остр')) {
        if (item.description.toLowerCase().includes('остр') ||
            item.ingredients.some(ing => ing.toLowerCase().includes('остр')) ||
            item.allergens.some(all => all.toLowerCase().includes('остр'))) {
          score += 25;
        }
      }
      
      // Sweet preference (desserts)
      if (prefLower.includes('сладк')) {
        if (item.category === 'dessert') score += 30;
      }
      
      // Soup preference
      if (prefLower.includes('суп')) {
        if (item.category === 'soup') score += 30;
      }
    });

    // Hunger level bonus
    if (preferences.hungerLevel === 'Очень голоден' || preferences.hungerLevel === 'Голоден') {
      if (item.category === 'main' || item.category === 'pasta') score += 10;
      const cal = menuCalories[item.id] ?? 0;
      if (cal > 500) score += 8;
    }

    if (preferences.hungerLevel === 'Хочу перекусить' || preferences.hungerLevel === 'Совсем не голоден') {
      if (item.category === 'soup' || item.category === 'salad') score += 10;
      const cal = menuCalories[item.id] ?? 999;
      if (cal < 300) score += 8;
    }

    // Drink preferences
    if (preferences.drinks && preferences.drinks.length > 0) {
      preferences.drinks.forEach(drink => {
        const drinkLower = drink.toLowerCase();
        if (item.category === 'drinks') {
          if (drinkLower.includes('тепл') && 
              (item.name.toLowerCase().includes('кофе') || 
               item.name.toLowerCase().includes('капучино') ||
               item.name.toLowerCase().includes('латте'))) {
            score += 20;
          }
          if (drinkLower.includes('холодн') && 
              (item.name.toLowerCase().includes('фреш') || 
               item.name.toLowerCase().includes('смузи') ||
               item.name.toLowerCase().includes('сок'))) {
            score += 20;
          }
        }
      });
    }

    return score;
  };

  // Generate personalized tags based on preferences
  const getPersonalizedTags = (item: typeof menuItems[0]) => {
    const tags: Array<{ text: string; color: string }> = [];

    // Check if dish matches user preferences - GREEN TAG
    const matchesPreferences = preferences?.preferences?.some(pref => {
      const prefLower = pref.toLowerCase();
      
      // Map preference categories to item properties
      if (prefLower.includes('овощ')) {
        // Check for vegetable-related items
        return item.category === 'salad' || 
               item.ingredients.some(ing => 
                 ing.toLowerCase().includes('овощ') || 
                 ing.toLowerCase().includes('томат') ||
                 ing.toLowerCase().includes('огур') ||
                 ing.toLowerCase().includes('салат')
               );
      }
      
      if (prefLower.includes('мясо')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('мясо') ||
          ing.toLowerCase().includes('говяд') ||
          ing.toLowerCase().includes('свин') ||
          ing.toLowerCase().includes('курица') ||
          ing.toLowerCase().includes('бекон')
        );
      }
      
      if (prefLower.includes('рыба')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('рыб') ||
          ing.toLowerCase().includes('лосос') ||
          ing.toLowerCase().includes('тунец')
        );
      }
      
      if (prefLower.includes('морепродукт')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('креветк') ||
          ing.toLowerCase().includes('морепродукт') ||
          ing.toLowerCase().includes('мидии') ||
          ing.toLowerCase().includes('кальмар')
        );
      }
      
      if (prefLower.includes('остр')) {
        return item.description.toLowerCase().includes('остр') ||
               item.ingredients.some(ing => ing.toLowerCase().includes('остр')) ||
               item.allergens.some(all => all.toLowerCase().includes('остр'));
      }
      
      if (prefLower.includes('сладк')) {
        return item.category === 'dessert';
      }
      
      if (prefLower.includes('суп')) {
        return item.category === 'soup';
      }
      
      // Check if mentioned in description or ingredients
      if (item.description.toLowerCase().includes(prefLower)) {
        return true;
      }
      
      return false;
    }) || false;

    if (matchesPreferences) {
      tags.push({ 
        text: 'Соответствует вашим предпочтениям', 
        color: 'green' 
      });
    }

    const cal = menuCalories[item.id] ?? 0;
    const weightNum = parseInt(item.weight);

    // Calorie-based tags
    if (cal > 0 && cal < 300) {
      tags.push({ text: 'Некалорийно', color: 'blue' });
    }

    if (cal >= 600 && (preferences?.hungerLevel === 'Очень голоден' || preferences?.hungerLevel === 'Голоден')) {
      tags.push({ text: 'Сытное блюдо', color: 'orange' });
    }

    // Large portion tag
    if (!isNaN(weightNum) && weightNum >= 350) {
      tags.push({ text: 'Большая порция', color: 'purple' });
    }

    return tags;
  };

  // Get icon to display on the image
  const getDisplayIcon = (item: typeof menuItems[0]) => {
    // Check if dish matches user's preferences and show GREEN icon
    const matchedPreference = preferences?.preferences?.find(pref => {
      const prefLower = pref.toLowerCase();
      
      // Map preference categories to item properties
      if (prefLower.includes('овощ')) {
        return item.category === 'salad' || 
               item.ingredients.some(ing => 
                 ing.toLowerCase().includes('овощ') || 
                 ing.toLowerCase().includes('томат') ||
                 ing.toLowerCase().includes('огур')
               );
      }
      
      if (prefLower.includes('мясо')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('мясо') ||
          ing.toLowerCase().includes('говяд') ||
          ing.toLowerCase().includes('курица') ||
          ing.toLowerCase().includes('бекон')
        );
      }
      
      if (prefLower.includes('рыба')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('рыб') ||
          ing.toLowerCase().includes('лосос')
        );
      }
      
      if (prefLower.includes('морепродукт')) {
        return item.ingredients.some(ing => 
          ing.toLowerCase().includes('креветк') ||
          ing.toLowerCase().includes('морепродукт')
        );
      }
      
      if (prefLower.includes('остр')) {
        return item.allergens.some(all => all.toLowerCase().includes('остр'));
      }
      
      if (prefLower.includes('сладк')) {
        return item.category === 'dessert';
      }
      
      if (prefLower.includes('суп')) {
        return item.category === 'soup';
      }
      
      return false;
    });

    if (matchedPreference) {
      const prefLower = matchedPreference.toLowerCase();
      
      // Map preferences to icons
      if (prefLower.includes('мясо')) {
        return { icon: Drumstick, color: 'green' };
      }
      if (prefLower.includes('рыба')) {
        return { icon: Fish, color: 'green' };
      }
      if (prefLower.includes('морепродукт')) {
        return { icon: Shell, color: 'green' };
      }
      if (prefLower.includes('остр')) {
        return { icon: Flame, color: 'green' };
      }
      if (prefLower.includes('сладк')) {
        return { icon: Cookie, color: 'green' };
      }
      if (prefLower.includes('овощ')) {
        return { icon: Heart, color: 'green' };
      }
      
      // Default green heart for matched preferences
      return { icon: Heart, color: 'green' };
    }

    return null;
  };

  const filteredItems = menuItems
    .filter(item => item.category === activeCategory)
    .map(item => ({
      ...item,
      relevanceScore: calculateRelevanceScore(item)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance (highest first)

  if (isChatOpen) {
    return (
      <ChatBot
        isFullPage={true}
        onClose={() => setIsChatOpen(false)}
        onRecommendationClick={(dishId) => {
          const dish = menuItems.find(item => item.id === dishId);
          if (dish) {
            setIsChatOpen(false);
            setSelectedItem(dish);
          }
        }}
      />
    );
  }

  if (selectedItem) {
    return (
      <MenuDetail
        item={selectedItem}
        tags={getPersonalizedTags(selectedItem)}
        displayIcon={getDisplayIcon(selectedItem)}
        personalizedComment={getPersonalizedComment(selectedItem, preferences)}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-3 shadow-sm">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm font-medium flex-shrink-0 ${
                activeCategory === category.id
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="px-4 grid grid-cols-1 gap-3 mt-4">
        {filteredItems.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            tags={getPersonalizedTags(item)}
            displayIcon={getDisplayIcon(item)}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* ChatBot */}
      <ChatBot 
        isFullPage={false}
        onOpenFullPage={() => setIsChatOpen(true)}
        onRecommendationClick={(dishId) => {
          const dish = menuItems.find(item => item.id === dishId);
          if (dish) {
            setSelectedItem(dish);
          }
        }} 
      />

      {/* Basket Floating Button */}
      {getTotalItems() > 0 && (
        <button
          onClick={() => setIsBasketOpen(true)}
          className="fixed bottom-24 right-6 w-16 h-16 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-green-700 transition-all"
        >
          <ShoppingBag className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {getTotalItems()}
          </span>
        </button>
      )}

      {/* Basket Panel */}
      <Basket isOpen={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
    </div>
  );
}