// Zam Zam Pizza Hut Menu Data
export interface MenuItem {
  id: string;
  name: string;
  nameUrdu: string;
  category: string;
  sizes?: {
    small: number;
    medium: number;
    large: number;
  };
  price?: number;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
  color: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 'pizza-traditional',
    name: 'Traditional Flavor Pizza',
    nameUrdu: 'روایتی ذائقہ پیزا',
    icon: '🍕',
    color: 'bg-gradient-to-br from-red-500 to-orange-600',
    items: [
      { id: 'chicken-tikka', name: 'Chicken Tikka Pizza', nameUrdu: 'چکن ٹکا پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } },
      { id: 'chicken-fajita', name: 'Chicken Fajita Pizza', nameUrdu: 'چکن فجیتا پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } },
      { id: 'vegetarian', name: 'Vegetarian Pizza', nameUrdu: 'سبزی پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } },
      { id: 'bar-b-q', name: 'Bar B Q Pizza', nameUrdu: 'بار بی کیو پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } },
      { id: 'hot-spicy', name: 'Hot and Spicy Pizza', nameUrdu: 'ہاٹ اینڈ اسپائسی پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } },
      { id: 'kabab-crust', name: 'Kabab Crust Pizza', nameUrdu: 'کباب کرسٹ پیزا', category: 'pizza-traditional', sizes: { small: 550, medium: 990, large: 1350 } }
    ]
  },
  {
    id: 'pizza-signature',
    name: 'Zam Zam Signature Flavor',
    nameUrdu: 'زم زم دستخط ذائقہ',
    icon: '⭐',
    color: 'bg-gradient-to-br from-purple-500 to-pink-600',
    items: [
      { id: 'smoky-pizza', name: 'Smoky Pizza', nameUrdu: 'سموکی پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } },
      { id: 'sultani-pizza', name: 'Sultani Pizza', nameUrdu: 'سلطانی پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } },
      { id: 'peri-peri', name: 'Peri Peri Pizza', nameUrdu: 'پیری پیری پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } },
      { id: 'cheese-lover', name: 'Cheese Lover Pizza', nameUrdu: 'چیز لوور پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } },
      { id: 'lazania', name: 'Lazania Pizza', nameUrdu: 'لازانیا پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } },
      { id: 'four-in-one', name: '4 In 1 Pizza', nameUrdu: 'چار میں ایک پیزا', category: 'pizza-signature', sizes: { medium: 1200, large: 1630 } }
    ]
  },
  {
    id: 'pizza-stuffed',
    name: 'Stuffed Crust Pizza',
    nameUrdu: 'سٹفڈ کرسٹ پیزا',
    icon: '🧀',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    items: [
      { id: 'stuffed-crust', name: 'Stuffed Crust Pizza', nameUrdu: 'سٹفڈ کرسٹ پیزا', category: 'pizza-stuffed', sizes: { medium: 1350, large: 1850 } }
    ]
  },
  {
    id: 'burgers',
    name: 'Burger Zone',
    nameUrdu: 'برگر زون',
    icon: '🍔',
    color: 'bg-gradient-to-br from-red-400 to-pink-500',
    items: [
      { id: 'zinger', name: 'Zinger (Fries + Coleslaw)', nameUrdu: 'زنگر (فرائز + کول سلاو)', category: 'burgers', price: 350 },
      { id: 'zinger-cheese', name: 'Zinger Cheese', nameUrdu: 'زنگر چیز', category: 'burgers', price: 450 },
      { id: 'tower-zinger', name: 'Tower Zinger', nameUrdu: 'ٹاور زنگر', category: 'burgers', price: 500 },
      { id: 'shami-burger', name: 'Shami Burger', nameUrdu: 'شامی برگر', category: 'burgers', price: 150 },
      { id: 'chicken-shami', name: 'Chicken Shami Burger', nameUrdu: 'چکن شامی برگر', category: 'burgers', price: 230 },
      { id: 'chicken-patti', name: 'Chicken Patti Burger', nameUrdu: 'چکن پٹی برگر', category: 'burgers', price: 250 },
      { id: 'lappeta-burger', name: 'Lappeta Burger', nameUrdu: 'لاپیتا برگر', category: 'burgers', price: 200 }
    ]
  },
  {
    id: 'appetizers',
    name: 'Appetizer',
    nameUrdu: 'اشتہا انگیز',
    icon: '🍗',
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    items: [
      { id: 'malaysian-strips', name: 'Malaysian Strips (6 Pcs)', nameUrdu: 'ملائیشین سٹرپس (6 عدد)', category: 'appetizers', price: 600 },
      { id: 'hot-wings-5', name: 'Hot Wings (5 Pcs)', nameUrdu: 'ہاٹ ونگز (5 عدد)', category: 'appetizers', price: 300 },
      { id: 'hot-wings-10', name: 'Hot Wings (10 Pcs)', nameUrdu: 'ہاٹ ونگز (10 عدد)', category: 'appetizers', price: 550 },
      { id: 'oven-baked-5', name: 'Oven Baked Wings (5 Pcs)', nameUrdu: 'اوون بیکڈ ونگز (5 عدد)', category: 'appetizers', price: 300 },
      { id: 'oven-baked-10', name: 'Oven Baked Wings (10 Pcs)', nameUrdu: 'اوون بیکڈ ونگز (10 عدد)', category: 'appetizers', price: 570 },
      { id: 'nuggets-5', name: 'Nuggets (5 Pcs)', nameUrdu: 'نگیٹس (5 عدد)', category: 'appetizers', price: 270 },
      { id: 'nuggets-10', name: 'Nuggets (10 Pcs)', nameUrdu: 'نگیٹس (10 عدد)', category: 'appetizers', price: 490 }
    ]
  },
  {
    id: 'wraps-shawarma',
    name: 'Wraps / Shawarma',
    nameUrdu: 'رپس / شوارما',
    icon: '🌯',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    items: [
      { id: 'arabic-shwarma', name: 'Arabic Shwarma', nameUrdu: 'عربی شوارما', category: 'wraps-shawarma', price: 400 },
      { id: 'zinger-shwarma', name: 'Zinger Shwarma', nameUrdu: 'زنگر شوارما', category: 'wraps-shawarma', price: 350 },
      { id: 'malai-boti', name: 'Malai Boti', nameUrdu: 'ملائی بوٹی', category: 'wraps-shawarma', price: 250 },
      { id: 'cheese-malai-boti', name: 'Cheese Malai Boti', nameUrdu: 'چیز ملائی بوٹی', category: 'wraps-shawarma', price: 300 },
      { id: 'chicken-shwarma', name: 'Chicken Shwarma', nameUrdu: 'چکن شوارما', category: 'wraps-shawarma', price: 150 },
      { id: 'fajita-shwarma', name: 'Fajita Shwarma', nameUrdu: 'فجیتا شوارما', category: 'wraps-shawarma', price: 250 },
      { id: 'cheese-fajita-shwarma', name: 'Cheese Fajita Shwarma', nameUrdu: 'چیز فجیتا شوارما', category: 'wraps-shawarma', price: 300 }
    ]
  },
  {
    id: 'pasta',
    name: 'Pasta',
    nameUrdu: 'پاستا',
    icon: '🍝',
    color: 'bg-gradient-to-br from-red-600 to-pink-700',
    items: [
      { id: 'arrabiata', name: 'Arrabiata Pasta', nameUrdu: 'ارابیاتا پاستا', category: 'pasta', sizes: { small: 350, large: 650 } },
      { id: 'sultani-pasta', name: 'Sultani Pasta', nameUrdu: 'سلطانی پاستا', category: 'pasta', sizes: { small: 350, large: 650 } },
      { id: 'crunchy-pasta', name: 'Crunchy Pasta', nameUrdu: 'کرنچی پاستا', category: 'pasta', sizes: { small: 350, large: 650 } }
    ]
  },
  {
    id: 'french-fries',
    name: 'French Fries',
    nameUrdu: 'فرنچ فرائز',
    icon: '🍟',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    items: [
      { id: 'plain-fries-small', name: 'Plain Fries (Small)', nameUrdu: 'سادہ فرائز (چھوٹا)', category: 'french-fries', price: 250 },
      { id: 'plain-fries-family', name: 'Plain Fries (Family)', nameUrdu: 'سادہ فرائز (فیملی)', category: 'french-fries', price: 400 },
      { id: 'masala-fries-small', name: 'Masala Fries (Small)', nameUrdu: 'مسالہ فرائز (چھوٹا)', category: 'french-fries', price: 280 },
      { id: 'masala-fries-family', name: 'Masala Fries (Family)', nameUrdu: 'مسالہ فرائز (فیملی)', category: 'french-fries', price: 430 },
      { id: 'loaded-fries', name: 'Loaded Fries', nameUrdu: 'لوڈڈ فرائز', category: 'french-fries', price: 590 }
    ]
  },
  {
    id: 'beverages',
    name: 'Beverages',
    nameUrdu: 'مشروبات',
    icon: '🥤',
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    items: [
      { id: 'drink-500ml', name: '500ml Drink', nameUrdu: '500 ملی مشروب', category: 'beverages', price: 120 },
      { id: 'drink-1ltr', name: '1 Ltr. Drink', nameUrdu: '1 لیٹر مشروب', category: 'beverages', price: 170 },
      { id: 'drink-1.5ltr', name: '1.5 Ltr. Drink', nameUrdu: '1.5 لیٹر مشروب', category: 'beverages', price: 230 },
      { id: 'tin-pack', name: 'Tin Pack', nameUrdu: 'ٹن پیک', category: 'beverages', price: 120 }
    ]
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    nameUrdu: 'آئسکریم',
    icon: '🍨',
    color: 'bg-gradient-to-br from-pink-400 to-purple-500',
    items: [
      { id: 'mixed-ice-cream', name: 'Mixed Ice Cream', nameUrdu: 'مکس آئسکریم', category: 'ice-cream', price: 130 },
      { id: 'kulfa', name: 'Kulfa', nameUrdu: 'کلفہ', category: 'ice-cream', price: 130 },
      { id: 'kulfa-badam', name: 'Kulfa Badam', nameUrdu: 'کلفہ بادام', category: 'ice-cream', price: 180 },
      { id: 'strawberry', name: 'Strawberry', nameUrdu: 'اسٹرابیری', category: 'ice-cream', price: 130 },
      { id: 'mango', name: 'Mango', nameUrdu: 'منگو', category: 'ice-cream', price: 130 },
      { id: 'banana', name: 'Banana', nameUrdu: 'بنانا', category: 'ice-cream', price: 130 },
      { id: 'chocolate', name: 'Chocolate', nameUrdu: 'چاکلیٹ', category: 'ice-cream', price: 130 },
      { id: 'pineapple', name: 'Pineapple', nameUrdu: 'پائن ایپل', category: 'ice-cream', price: 130 },
      { id: 'vanilla', name: 'Vanilla Ice Cream', nameUrdu: 'ونیلا آئسکریم', category: 'ice-cream', price: 130 },
      { id: 'pista', name: 'Pista Ice Cream', nameUrdu: 'پستہ آئسکریم', category: 'ice-cream', price: 200 },
      { id: 'tutti-frutti', name: 'Tutti Frutti Jumbo Cup', nameUrdu: 'ٹوٹی فروٹی جمبو کپ', category: 'ice-cream', price: 200 }
    ]
  },
  {
    id: 'ice-cream-milkshake',
    name: 'Ice Cream Milkshake',
    nameUrdu: 'آئسکریم ملک شیک',
    icon: '🥤',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    items: [
      { id: 'mango-ice-shake', name: 'Mango Ice Cream Milkshake', nameUrdu: 'منگو آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'banana-ice-shake', name: 'Banana Ice Cream Milkshake', nameUrdu: 'بنانا آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'strawberry-ice-shake', name: 'Strawberry Ice Cream Milkshake', nameUrdu: 'اسٹرابیری آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'kulfa-ice-shake', name: 'Kulfa Ice Cream Milkshake', nameUrdu: 'کلفہ آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'pineapple-ice-shake', name: 'Pineapple Ice Cream Milkshake', nameUrdu: 'پائن ایپل آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'vanilla-ice-shake', name: 'Vanilla Ice Cream Milkshake', nameUrdu: 'ونیلا آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } },
      { id: 'chocolate-ice-shake', name: 'Chocolate Ice Cream Milkshake', nameUrdu: 'چاکلیٹ آئسکریم ملک شیک', category: 'ice-cream-milkshake', sizes: { glass: 240, mug: 360 } }
    ]
  },
  {
    id: 'fruit-shakes',
    name: 'Fruit Shakes',
    nameUrdu: 'فروٹ شیکس',
    icon: '🍓',
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    items: [
      { id: 'mango-milkshake', name: 'Mango Milkshake', nameUrdu: 'منگو ملک شیک', category: 'fruit-shakes', sizes: { glass: 180, mug: 270 } },
      { id: 'banana-milkshake', name: 'Banana Milkshake', nameUrdu: 'بنانا ملک شیک', category: 'fruit-shakes', sizes: { glass: 150, mug: 250 } },
      { id: 'strawberry-milkshake', name: 'Strawberry Milkshake', nameUrdu: 'اسٹرابیری ملک شیک', category: 'fruit-shakes', sizes: { glass: 180, mug: 270 } },
      { id: 'apple-milkshake', name: 'Apple Milkshake', nameUrdu: 'ایپل ملک شیک', category: 'fruit-shakes', sizes: { glass: 150, mug: 250 } },
      { id: 'khajor-milkshake', name: 'Khajor Milkshake', nameUrdu: 'کھجور ملک شیک', category: 'fruit-shakes', sizes: { glass: 200, mug: 300 } },
      { id: 'khoya-khajor', name: 'Khoya Khajor Milkshake', nameUrdu: 'کھویا کھجور ملک شیک', category: 'fruit-shakes', sizes: { glass: 240, mug: 360 } },
      { id: 'banana-khajor', name: 'Banana Khajor Milkshake', nameUrdu: 'بنانا کھجور ملک شیک', category: 'fruit-shakes', sizes: { glass: 180, mug: 270 } },
      { id: 'apple-khajor', name: 'Apple Khajor Milkshake', nameUrdu: 'ایپل کھجور ملک شیک', category: 'fruit-shakes', sizes: { glass: 180, mug: 270 } },
      { id: 'peach-milkshake', name: 'Peach Milkshake', nameUrdu: 'پیچ ملک شیک', category: 'fruit-shakes', sizes: { glass: 160, mug: 240 } },
      { id: 'chocolate-milkshake', name: 'Chocolate Milkshake', nameUrdu: 'چاکلیٹ ملک شیک', category: 'fruit-shakes', sizes: { glass: 250, mug: 370 } },
      { id: 'pineapple-milkshake', name: 'Pineapple Milkshake', nameUrdu: 'پائن ایپل ملک شیک', category: 'fruit-shakes', sizes: { glass: 300, mug: 450 } },
      { id: 'mixed-fruit-milkshake', name: 'Mixed Fruit Milkshake', nameUrdu: 'مکس فروٹ ملک شیک', category: 'fruit-shakes', sizes: { glass: 200, mug: 300 } },
      { id: 'cocktail-milkshake', name: 'Cocktail Milkshake', nameUrdu: 'کوک ٹیل ملک شیک', category: 'fruit-shakes', sizes: { glass: 300, mug: 450 } },
      { id: 'oreo-milkshake', name: 'Oreo Milkshake', nameUrdu: 'اوریو ملک شیک', category: 'fruit-shakes', sizes: { glass: 300, mug: 450 } }
    ]
  },
  {
    id: 'platters',
    name: 'Platters',
    nameUrdu: 'پلیٹرز',
    icon: '🍽️',
    color: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    items: [
      { id: 'malai-boti-platter', name: 'Malai Boti Platter', nameUrdu: 'ملائی بوٹی پلیٹر', category: 'platters', price: 650 },
      { id: 'shawarma-platter', name: 'Shawarma Platter', nameUrdu: 'شوارما پلیٹر', category: 'platters', price: 490 }
    ]
  },
  {
    id: 'pizza-deals',
    name: 'Pizza Deals',
    nameUrdu: 'پیزا ڈیلز',
    icon: '🎁',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    items: [
      { id: 'pizza-deal-01', name: 'Deal 01: 1 Small Pizza + 5 Hot Wings + 500ml Drink', nameUrdu: '', category: 'pizza-deals', price: 899 },
      { id: 'pizza-deal-02', name: 'Deal 02: 1 Large Pizza + 1 Special Pasta + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 2150 },
      { id: 'pizza-deal-03', name: 'Deal 03: 1 Medium Pizza + 1 Pasta + 1L Drink', nameUrdu: '', category: 'pizza-deals', price: 1670 },
      { id: 'pizza-deal-04', name: 'Deal 04: 2 Medium Pizza + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 2050 },
      { id: 'pizza-deal-05', name: 'Deal 05: 1 Large Pizza + 10 Hot Wings + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 1970 },
      { id: 'pizza-deal-06', name: 'Deal 06: 2 Large Pizza + 10 Hot Wings + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 3190 },
      { id: 'pizza-deal-07', name: 'Deal 07: 1 Large Pizza + 1 Medium Pizza + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 2370 },
      { id: 'pizza-deal-08', name: 'Deal 08: 1 Large Pizza + 3 Zinger Burger + 1.5L Drink', nameUrdu: '', category: 'pizza-deals', price: 2460 }
    ]
  },
  {
    id: 'burger-deals',
    name: 'Burger Deals',
    nameUrdu: 'برگر ڈیلز',
    icon: '🍔',
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    items: [
      { id: 'burger-deal-01', name: 'Deal 01: 2 Zinger + Regular Fries + Regular Drink', nameUrdu: '', category: 'burger-deals', price: 890 },
      { id: 'burger-deal-02', name: 'Deal 02: 10 Hot Wings + 5 Nuggets + 500ml Drink', nameUrdu: '', category: 'burger-deals', price: 870 },
      { id: 'burger-deal-03', name: 'Deal 03: 3 Zinger + 1 Family Fries + 1L Drink', nameUrdu: '', category: 'burger-deals', price: 1350 },
      { id: 'burger-deal-04', name: 'Deal 04: 5 Zinger + 1 Family Fries + 1.5L Drink', nameUrdu: '', category: 'burger-deals', price: 1999 }
    ]
  },
  {
    id: 'birthday-deals',
    name: 'Birthday Deals',
    nameUrdu: 'سالگرہ ڈیلز',
    icon: '🎂',
    color: 'bg-gradient-to-br from-pink-500 to-purple-600',
    items: [
      { id: 'birthday-deal-01', name: 'Birthday Deal 01: 4 Large Special Pizzas + 20 Hot Wings + 3 (1.5L) Drinks + 1 Pound Cake Free', nameUrdu: '', category: 'birthday-deals', price: 7850 },
      { id: 'birthday-deal-02', name: 'Birthday Deal 02: 2 Large Special Pizzas + 20 Hot Wings + 2 Special Pasta + 2 (1.5L) Drinks + 1 Pound Cake Free', nameUrdu: '', category: 'birthday-deals', price: 5790 }
    ]
  }
];

export const shopInfo = {
  name: 'Zam Zam Pizza Hut',
  nameUrdu: 'زم زم پیزا ہٹ',
  phone: '0370-9191370',
  address: 'Burewala - Free Home Delivery Available',
  addressUrdu: 'بورے والا - مفت ہوم ڈیلیوری دستیاب ہے'
};
