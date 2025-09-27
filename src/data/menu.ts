// Zam Zam Ice Bar Menu Data
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
    id: 'ice-cream',
    name: 'Ice Cream',
    nameUrdu: 'آئسکریم',
    icon: '🍨',
    color: 'bg-gradient-to-br from-pink-400 to-purple-500',
    items: [
      { id: 'vanilla', name: 'Vanilla Ice Cream', nameUrdu: 'ونیلا آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'pista', name: 'Pista Ice Cream', nameUrdu: 'پستہ آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'strawberry', name: 'Strawberry Ice Cream', nameUrdu: 'اسٹرابیری آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'chocolate', name: 'Chocolate Ice Cream', nameUrdu: 'چاکلیٹ آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'orange', name: 'Orange Ice Cream', nameUrdu: 'اورنج آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'banana', name: 'Banana Ice Cream', nameUrdu: 'بنانا آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'chocolate-chip', name: 'Chocolate Chip Ice Cream', nameUrdu: 'چاکلیٹ چپ آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'pineapple', name: 'Pineapple Ice Cream', nameUrdu: 'پائن ایپل آئسکریم', category: 'ice-cream', price: 200 },
      { id: 'mango', name: 'Mango Ice Cream', nameUrdu: 'منگو آئسکریم', category: 'ice-cream', price: 160 },
      { id: 'tutti-frutti', name: 'Tutti Frutti Ice Cream', nameUrdu: 'ٹوٹی فروٹی آئسکریم', category: 'ice-cream', price: 250 },
      { id: 'double-chocolate', name: 'Double Chocolate Ice Cream', nameUrdu: 'ڈبل چاکلیٹ آئسکریم', category: 'ice-cream', price: 200 },
      { id: 'kulfi', name: 'Kulfi Ice Cream', nameUrdu: 'کلفی آئسکریم', category: 'ice-cream', price: 170 },
      { id: 'pistachio-kulfi', name: 'Pistachio Kulfi Ice Cream', nameUrdu: 'پستہ کلفی آئسکریم', category: 'ice-cream', price: 180 },
      { id: 'malai-kulfi', name: 'Malai Kulfi Ice Cream', nameUrdu: 'ملائی کلفی آئسکریم', category: 'ice-cream', price: 150 },
      { id: 'family-pack', name: 'Family Pack Ice Cream', nameUrdu: 'فیملی پیک آئسکریم', category: 'ice-cream', price: 900 },
      { id: 'half-family-pack', name: '1/2 Family Pack Ice Cream', nameUrdu: 'نصف فیملی پیک آئسکریم', category: 'ice-cream', price: 450 },
      { id: 'faloodha-special', name: 'Faloodha Special', nameUrdu: 'فالودہ اسپیشل', category: 'ice-cream', price: 20 }
    ]
  },
  {
    id: 'milkshakes',
    name: 'Milk Shakes',
    nameUrdu: 'ملک شیک',
    icon: '🥤',
    color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    items: [
      { id: 'chocolate-shake', name: 'Chocolate Shake', nameUrdu: 'چاکلیٹ شیک', category: 'milkshakes', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'banana-shake', name: 'Banana Shake', nameUrdu: 'بنانا شیک', category: 'milkshakes', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'strawberry-shake', name: 'Strawberry Shake', nameUrdu: 'اسٹرابیری شیک', category: 'milkshakes', sizes: { small: 180, medium: 270, large: 350 } },
      { id: 'apple-shake', name: 'Apple Shake', nameUrdu: 'ایپل شیک', category: 'milkshakes', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'mango-shake', name: 'Mango Shake', nameUrdu: 'آم شیک', category: 'milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'vanilla-shake', name: 'Vanilla Shake', nameUrdu: 'ونیلا شیک', category: 'milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'kulfa-shake', name: 'Kulfa Shake', nameUrdu: 'کلفہ شیک', category: 'milkshakes', sizes: { small: 180, medium: 270, large: 350 } },
      { id: 'kheer-shake', name: 'Kheer Shake', nameUrdu: 'کھیر شیک', category: 'milkshakes', sizes: { small: 180, medium: 270, large: 350 } },
      { id: 'dates-shake', name: 'Dates Shake', nameUrdu: 'کھجور شیک', category: 'milkshakes', sizes: { small: 160, medium: 240, large: 320 } },
      { id: 'coconut-shake', name: 'Coconut Shake', nameUrdu: 'ناریل شیک', category: 'milkshakes', sizes: { small: 250, medium: 370, large: 500 } },
      { id: 'dry-fruit-shake', name: 'Dry Fruit Shake', nameUrdu: 'ڈرائی فروٹ شیک', category: 'milkshakes', sizes: { small: 300, medium: 450, large: 600 } },
      { id: 'kashmiri-shake', name: 'Kashmiri Shake', nameUrdu: 'کشمیری شیک', category: 'milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'sev-shake', name: 'Sev Shake', nameUrdu: 'سیو شیک', category: 'milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'sitafal-shake', name: 'Sitafal Shake', nameUrdu: 'سیتا پھل شیک', category: 'milkshakes', sizes: { small: 300, medium: 450, large: 600 } },
      { id: 'oreo-shake', name: 'Oreo Shake', nameUrdu: 'اوریو شیک', category: 'milkshakes', sizes: { small: 300, medium: 450, large: 600 } }
    ]
  },
  {
    id: 'ice-cream-milkshakes',
    name: 'Ice Cream Milk Shakes',
    nameUrdu: 'آئسکریم ملک شیک',
    icon: '🍦',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    items: [
      { id: 'chocolate-ice-shake', name: 'Chocolate Ice Cream Shake', nameUrdu: 'چاکلیٹ آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'banana-ice-shake', name: 'Banana Ice Cream Shake', nameUrdu: 'بنانا آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'strawberry-ice-shake', name: 'Strawberry Ice Cream Shake', nameUrdu: 'اسٹرابیری آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'pista-ice-shake', name: 'Pista Ice Cream Shake', nameUrdu: 'پستہ آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'orange-ice-shake', name: 'Orange Ice Cream Shake', nameUrdu: 'اورنج آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'vanilla-ice-shake', name: 'Vanilla Ice Cream Shake', nameUrdu: 'ونیلا آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'kulfa-ice-shake', name: 'Kulfa Ice Cream Shake', nameUrdu: 'کلفہ آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 280, medium: 420, large: 550 } },
      { id: 'malai-ice-shake', name: 'Malai Ice Cream Shake', nameUrdu: 'ملائی آئسکریم شیک', category: 'ice-cream-milkshakes', sizes: { small: 240, medium: 360, large: 480 } }
    ]
  },
  {
    id: 'fruit-ice-milkshakes',
    name: 'Fruit Ice Cream Milk Shakes',
    nameUrdu: 'فروٹ آئسکریم ملک شیک',
    icon: '🍓',
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    items: [
      { id: 'mango-fruit-shake', name: 'Mango Fruit Ice Cream Shake', nameUrdu: 'آم فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'banana-fruit-shake', name: 'Banana Fruit Ice Cream Shake', nameUrdu: 'کیلا فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'apple-fruit-shake', name: 'Apple Fruit Ice Cream Shake', nameUrdu: 'سیب فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'strawberry-fruit-shake', name: 'Strawberry Fruit Ice Cream Shake', nameUrdu: 'اسٹرابیری فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 240, medium: 360, large: 480 } },
      { id: 'mixed-fruit-shake', name: 'Mixed Fruit Ice Cream Shake', nameUrdu: 'مکس فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'guava-fruit-shake', name: 'Guava Fruit Ice Cream Shake', nameUrdu: 'امرود فروٹ آئسکریم شیک', category: 'fruit-ice-milkshakes', sizes: { small: 230, medium: 350, large: 460 } }
    ]
  },
  {
    id: 'fresh-juices',
    name: 'Fresh Juices',
    nameUrdu: 'فریش جوسز',
    icon: '🧃',
    color: 'bg-gradient-to-br from-amber-400 to-red-500',
    items: [
      { id: 'orange-juice', name: 'Orange Juice', nameUrdu: 'اورنج جوس', category: 'fresh-juices', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'carrot-juice', name: 'Carrot Juice', nameUrdu: 'گاجر جوس', category: 'fresh-juices', sizes: { small: 100, medium: 150, large: 200 } },
      { id: 'mixed-juice', name: 'Mixed Juice', nameUrdu: 'مکس جوس', category: 'fresh-juices', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'pomegranate-juice', name: 'Pomegranate Juice', nameUrdu: 'انار جوس', category: 'fresh-juices', sizes: { small: 400, medium: 600, large: 800 } },
      { id: 'lemon-juice', name: 'Lemon Juice', nameUrdu: 'لیموں جوس', category: 'fresh-juices', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'sugarcane-juice', name: 'Sugarcane Juice', nameUrdu: 'گنے کا جوس', category: 'fresh-juices', sizes: { small: 200, medium: 300, large: 400 } },
      { id: 'watermelon-juice', name: 'Watermelon Juice', nameUrdu: 'تربوز جوس', category: 'fresh-juices', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'musk-melon-juice', name: 'Musk Melon Juice', nameUrdu: 'خربوزہ جوس', category: 'fresh-juices', sizes: { small: 350, medium: 530, large: 700 } },
      { id: 'banana-juice', name: 'Banana Juice', nameUrdu: 'کیلا جوس', category: 'fresh-juices', sizes: { small: 150, medium: 230, large: 300 } },
      { id: 'falsa-juice', name: 'Falsa Juice', nameUrdu: 'فالسہ جوس', category: 'fresh-juices', sizes: { small: 120, medium: 180, large: 240 } },
      { id: 'kinnow-juice', name: 'Kinnow Juice', nameUrdu: 'کینو جوس', category: 'fresh-juices', sizes: { small: 350, medium: 530, large: 700 } },
      { id: 'seasonal-juice', name: 'Seasonal Juice', nameUrdu: 'موسمی جوس', category: 'fresh-juices', sizes: { small: 250, medium: 370, large: 500 } }
    ]
  },
  {
    id: 'doodh-soda',
    name: 'Doodh Soda',
    nameUrdu: 'دودھ سوڈا',
    icon: '🥛',
    color: 'bg-gradient-to-br from-indigo-400 to-purple-500',
    items: [
      { id: 'regular-doodh-soda', name: 'Regular Doodh Soda 250ml', nameUrdu: 'ریگولر دودھ سوڈا ۲۵۰ملی', category: 'doodh-soda', price: 180 },
      { id: 'chocolate-doodh-soda', name: 'Chocolate Doodh Soda', nameUrdu: 'چاکلیٹ دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'banana-doodh-soda', name: 'Banana Doodh Soda', nameUrdu: 'کیلا دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'strawberry-doodh-soda', name: 'Strawberry Doodh Soda', nameUrdu: 'اسٹرابیری دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'pista-doodh-soda', name: 'Pista Doodh Soda', nameUrdu: 'پستہ دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'kulfa-doodh-soda', name: 'Kulfa Doodh Soda', nameUrdu: 'کلفہ دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'orange-doodh-soda', name: 'Orange Doodh Soda', nameUrdu: 'اورنج دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'vanilla-doodh-soda', name: 'Vanilla Doodh Soda', nameUrdu: 'ونیلا دودھ سوڈا', category: 'doodh-soda', price: 280 },
      { id: 'special-doodh-soda', name: 'Special Doodh Soda 1 Liter', nameUrdu: 'اسپیشل دودھ سوڈا ۱ لیٹر', category: 'doodh-soda', price: 450 }
    ]
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    nameUrdu: 'فاسٹ فوڈز',
    icon: '🍔',
    color: 'bg-gradient-to-br from-red-400 to-pink-500',
    items: [
      { id: 'zinger-burger', name: 'Zinger Burger', nameUrdu: 'زنگر برگر', category: 'fast-food', price: 150 },
      { id: 'chicken-burger', name: 'Chicken Burger', nameUrdu: 'چکن برگر', category: 'fast-food', price: 200 },
      { id: 'double-zinger', name: 'Double Zinger Burger', nameUrdu: 'ڈبل زنگر برگر', category: 'fast-food', price: 200 },
      { id: 'double-chicken', name: 'Double Chicken Burger', nameUrdu: 'ڈبل چکن برگر', category: 'fast-food', price: 200 },
      { id: 'pizza-burger', name: 'Pizza Burger', nameUrdu: 'پیزا برگر', category: 'fast-food', price: 200 },
      { id: 'crispy-burger', name: 'Crispy Burger', nameUrdu: 'کرسپی برگر', category: 'fast-food', price: 350 }
    ]
  },
  {
    id: 'fruit-chat',
    name: 'Fruit Chat',
    nameUrdu: 'فروٹ چاٹ',
    icon: '🍇',
    color: 'bg-gradient-to-br from-lime-400 to-green-500',
    items: [
      { id: 'mixed-fruit-chat', name: 'Mixed Fruit Chat', nameUrdu: 'مکس فروٹ چاٹ', category: 'fruit-chat', price: 170 },
      { id: 'banana-chat', name: 'Banana Chat', nameUrdu: 'کیلا چاٹ', category: 'fruit-chat', price: 240 },
      { id: 'apple-pomegranate-chat', name: 'Apple Pomegranate Chat', nameUrdu: 'سیب انار چاٹ', category: 'fruit-chat', price: 220 },
      { id: 'faloodha-special-chat', name: 'Faloodha Special Chat', nameUrdu: 'فالودہ اسپیشل چاٹ', category: 'fruit-chat', price: 20 }
    ]
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    nameUrdu: 'چکن بریانی',
    icon: '🍛',
    color: 'bg-gradient-to-br from-orange-400 to-red-600',
    items: [
      { id: 'chicken-biryani-full', name: 'Chicken Biryani Full', nameUrdu: 'چکن بریانی فل', category: 'chicken-biryani', price: 300 },
      { id: 'chicken-biryani-half', name: 'Chicken Biryani Half', nameUrdu: 'چکن بریانی ہاف', category: 'chicken-biryani', price: 200 },
      { id: 'french-fries', name: 'French Fries', nameUrdu: 'فرنچ فرائز', category: 'chicken-biryani', price: 30 },
      { id: 'masala-french-fries', name: 'Masala French Fries', nameUrdu: 'مسالہ فرنچ فرائز', category: 'chicken-biryani', price: 30 }
    ]
  }
];

export const shopInfo = {
  name: 'Zam Zam Ice Bar',
  nameUrdu: 'زم زم آئس بار',
  phone: '0370-9191370',
  address: 'Free Home Delivery Available',
  addressUrdu: 'مفت ہوم ڈیلیوری دستیاب ہے'
};