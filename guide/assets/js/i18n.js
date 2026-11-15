/** UI strings. Content (places, routes, food) carries its own en/ka text; ru falls back to en. */
const STR = {
  en: {
    appName: "Georgia Guide", tagline: "Your pocket guide to Georgia — routes, places, food and how to get around.",
    nav: { home: "Home", arrival: "Arrival", routes: "Routes", places: "Places", food: "Food", plan: "My plan" },
    lang: "Language", install: "Install app", installed: "Installed", installHint: "Add to your home screen to use it offline.",
    offline: "You are offline — saved pages still work, the map needs a connection.",
    hero: { kicker: "Welcome to Georgia", title: "Mountains, sea, wine and 8,000 years of hospitality.", lead: "Pick a route, discover places worth stopping for, find where to eat, and get from the airport to your hotel — no guide needed.", ctaArrival: "I just landed", ctaRoutes: "Choose a route" },
    quick: { title: "Start here", arrival: "Airport → hotel", arrivalSub: "Taxi apps, buses, SIM cards, cash", routes: "Routes", routesSub: "1–4 day itineraries", places: "Places", placesSub: "What to see, when, how much", food: "Georgian food", foodSub: "What to order and where" },
    regions: { title: "Where do you want to go?", mountain: "Mountains", sea: "Black Sea", city: "Cities", wine: "Wine country", mountainSub: "Kazbegi, Svaneti, Racha", seaSub: "Batumi and Adjara", citySub: "Tbilisi, Kutaisi, Mtskheta", wineSub: "Kakheti" },
    featured: "Popular routes", allRoutes: "All routes", allPlaces: "All places",
    days: "days", day: "Day", hours: "h", km: "km", drive: "drive", walk: "walk",
    filters: { all: "All", type: "Type", region: "Region", days: "Length", search: "Search", reset: "Reset", results: "results", noResults: "Nothing matches. Try another filter." },
    types: { mountain: "Mountains", sea: "Sea", city: "City", wine: "Wine" },
    cats: { nature: "Nature", history: "History", religion: "Churches & monasteries", museum: "Museum", viewpoint: "Viewpoint", town: "Town", architecture: "Architecture", activity: "Activity", park: "Park" },
    kinds: { restaurant: "Restaurant", cafe: "Café", winery: "Winery", rest: "Rest stop", market: "Market", bakery: "Bakery", viewpoint: "Viewpoint", guesthouse: "Guesthouse" },
    route: { addPlan: "Add to my plan", inPlan: "In my plan", removePlan: "Remove from plan", highlights: "Highlights", season: "Best season", difficulty: "Difficulty", start: "Starts in", stopsEat: "Where to stop, rest and eat", onTheWay: "On the way", openMap: "Open route in Google Maps", seeOnMap: "See on map", backToRoutes: "All routes", itinerary: "Itinerary", practical: "Good to know", included: "Places on this route", easy: "Easy", moderate: "Moderate", hard: "Demanding", overnight: "Overnight", selectHint: "Tick several routes and open My plan to see all places, rest stops and restaurants together." },
    place: { visit: "Time needed", fee: "Entry", hoursLabel: "Opening", getThere: "Getting there", tips: "Tips", nearby: "Eat & rest nearby", routesWith: "Routes that include this place", directions: "Directions", save: "Save place", saved: "Saved", unsave: "Remove", free: "Free", altitude: "Altitude", bestTime: "Best time" },
    food: { title: "Georgian cuisine", lead: "Georgian food is built for sharing: bread, cheese, walnuts, herbs, grilled meat and wine made in clay qvevri for 8,000 years. Here is what to order and how.", dishes: "Dishes", drinks: "Drinks", veg: "Vegetarian", spicy: "Spicy", region: "From", howToEat: "How to eat it", order: "How to order", etiquette: "The supra (feast) — how it works", phrases: "Useful phrases", where: "Where to eat", allDishes: "All", filterVeg: "Vegetarian only", pricing: "What things cost", cheers: "Gaumarjos! (Cheers!)" },
    plan: { title: "My plan", lead: "Routes and places you picked, together on one map, with rest stops and restaurants along the way.", empty: "Your plan is empty. Add routes or save places and they will appear here.", routes: "Selected routes", placesSaved: "Saved places", stops: "Rest stops & restaurants", share: "Copy link to this plan", copied: "Link copied", print: "Print", clear: "Clear plan", clearConfirm: "Remove everything from your plan?", totalDays: "Total", mapTitle: "Everything on one map" },
    arrival: { title: "Just landed?", lead: "Pick your airport. Here is how to reach your hotel, get a SIM card and cash, and what to know on day one.", airport: "Airport", toHotel: "Get to my hotel", hotelLabel: "Hotel name or address", hotelPlaceholder: "e.g. Stamba Hotel, Tbilisi", transitBtn: "Public transport", driveBtn: "Taxi / car", boltBtn: "Open Bolt", yandexBtn: "Open Yandex Go", hotelHint: "Opens directions in Google Maps from the airport you selected. Taxi apps open in the app or the store.", options: "Ways into town", cost: "Cost", time: "Time", runs: "Runs", tip: "Tip", sim: "SIM cards & internet", money: "Money", emergency: "Emergency", essentials: "Essentials", intercity: "Moving on to the regions", verify: "Prices and timetables change — treat these as a guide and check on site.", nextStep: "Next: pick a route" },
    footer: { about: "Independent guide for travellers in Georgia. Prices, hours and timetables change — verify locally. Not affiliated with any airport, operator or venue.", qr: "QR poster for the airport" },
    qr: { title: "Scan to open Georgia Guide", sub: "Free offline-ready travel guide: airport transport, routes, places, food.", print: "Print poster", urlLabel: "App address", urlHint: "The QR code points at this page's own address. Host the app at its final address first, then print." },
    common: { more: "More", less: "Less", close: "Close", approx: "approx.", gel: "GEL", open: "Open", mapLoading: "Loading map…", mapOffline: "Map tiles need an internet connection.", verifyNote: "Approximate — check on site." },
    map: { you: "You are here", locate: "Show my location" }
  },
  ka: {
    appName: "საქართველოს გიდი", tagline: "ჯიბის გიდი საქართველოსთვის — მარშრუტები, ადგილები, კერძები და გადაადგილება.",
    nav: { home: "მთავარი", arrival: "ჩამოსვლა", routes: "მარშრუტები", places: "ადგილები", food: "კერძები", plan: "ჩემი გეგმა" },
    lang: "ენა", install: "აპის დაყენება", installed: "დაყენებულია", installHint: "დაამატე მთავარ ეკრანზე, რომ ინტერნეტის გარეშეც იმუშაოს.",
    offline: "ინტერნეტი არ არის — შენახული გვერდები მუშაობს, რუკას კავშირი სჭირდება.",
    hero: { kicker: "კეთილი იყოს თქვენი მობრძანება", title: "მთები, ზღვა, ღვინო და 8000 წლის სტუმართმოყვარეობა.", lead: "აირჩიე მარშრუტი, აღმოაჩინე ღირსშესანიშნავი ადგილები, იპოვე სად დანაყრდე და აეროპორტიდან სასტუმრომდე მიდი გიდის გარეშე.", ctaArrival: "ახლა ჩამოვედი", ctaRoutes: "მარშრუტის არჩევა" },
    quick: { title: "დაიწყე აქედან", arrival: "აეროპორტი → სასტუმრო", arrivalSub: "ტაქსი, ავტობუსი, SIM, ნაღდი ფული", routes: "მარშრუტები", routesSub: "1–4 დღიანი გეგმები", places: "ადგილები", placesSub: "რა ნახო, როდის, რა ფასად", food: "ქართული სამზარეულო", foodSub: "რა შეუკვეთო და სად" },
    regions: { title: "სად გინდა წასვლა?", mountain: "მთები", sea: "შავი ზღვა", city: "ქალაქები", wine: "ღვინის მხარე", mountainSub: "ყაზბეგი, სვანეთი, რაჭა", seaSub: "ბათუმი და აჭარა", citySub: "თბილისი, ქუთაისი, მცხეთა", wineSub: "კახეთი" },
    featured: "პოპულარული მარშრუტები", allRoutes: "ყველა მარშრუტი", allPlaces: "ყველა ადგილი",
    days: "დღე", day: "დღე", hours: "სთ", km: "კმ", drive: "გზა", walk: "ფეხით",
    filters: { all: "ყველა", type: "ტიპი", region: "რეგიონი", days: "ხანგრძლივობა", search: "ძიება", reset: "გასუფთავება", results: "შედეგი", noResults: "ვერაფერი მოიძებნა. სცადე სხვა ფილტრი." },
    types: { mountain: "მთა", sea: "ზღვა", city: "ქალაქი", wine: "ღვინო" },
    cats: { nature: "ბუნება", history: "ისტორია", religion: "ეკლესია-მონასტრები", museum: "მუზეუმი", viewpoint: "ხედი", town: "ქალაქი/დაბა", architecture: "არქიტექტურა", activity: "აქტივობა", park: "პარკი" },
    kinds: { restaurant: "რესტორანი", cafe: "კაფე", winery: "მარანი", rest: "გასაჩერებელი", market: "ბაზარი", bakery: "თონე", viewpoint: "ხედი", guesthouse: "საოჯახო სასტუმრო" },
    route: { addPlan: "გეგმაში დამატება", inPlan: "გეგმაშია", removePlan: "გეგმიდან ამოღება", highlights: "მთავარი", season: "საუკეთესო სეზონი", difficulty: "სირთულე", start: "იწყება", stopsEat: "სად გაჩერდე, დაისვენო და დანაყრდე", onTheWay: "გზად", openMap: "მარშრუტი Google Maps-ში", seeOnMap: "რუკაზე ნახვა", backToRoutes: "ყველა მარშრუტი", itinerary: "დღეების გეგმა", practical: "კარგია იცოდე", included: "ადგილები ამ მარშრუტზე", easy: "მარტივი", moderate: "საშუალო", hard: "რთული", overnight: "ღამისთევით", selectHint: "მონიშნე რამდენიმე მარშრუტი და გახსენი „ჩემი გეგმა“ — ყველა ადგილი, გასაჩერებელი და რესტორანი ერთად იქნება." },
    place: { visit: "საჭირო დრო", fee: "შესვლა", hoursLabel: "სამუშაო საათები", getThere: "როგორ მივიდე", tips: "რჩევები", nearby: "ახლოს: კვება და დასვენება", routesWith: "მარშრუტები ამ ადგილით", directions: "მიმართულება", save: "შენახვა", saved: "შენახულია", unsave: "ამოღება", free: "უფასო", altitude: "სიმაღლე", bestTime: "საუკეთესო დრო" },
    food: { title: "ქართული სამზარეულო", lead: "ქართული სუფრა გასაზიარებლადაა შექმნილი: პური, ყველი, ნიგოზი, მწვანილი, მწვადი და ქვევრის ღვინო. აი, რა შეუკვეთო და როგორ.", dishes: "კერძები", drinks: "სასმელები", veg: "ვეგეტარიანული", spicy: "ცხარე", region: "მხარე", howToEat: "როგორ ჭამენ", order: "როგორ შეუკვეთო", etiquette: "სუფრა — როგორ მუშაობს", phrases: "საჭირო ფრაზები", where: "სად ვჭამოთ", allDishes: "ყველა", filterVeg: "მხოლოდ ვეგეტარიანული", pricing: "სავარაუდო ფასები", cheers: "გაუმარჯოს!" },
    plan: { title: "ჩემი გეგმა", lead: "შენ მიერ არჩეული მარშრუტები და ადგილები ერთ რუკაზე, გზად გასაჩერებლებითა და რესტორნებით.", empty: "გეგმა ცარიელია. დაამატე მარშრუტი ან შეინახე ადგილი და აქ გამოჩნდება.", routes: "არჩეული მარშრუტები", placesSaved: "შენახული ადგილები", stops: "გასაჩერებლები და რესტორნები", share: "გეგმის ბმულის კოპირება", copied: "ბმული დაკოპირდა", print: "ბეჭდვა", clear: "გეგმის გასუფთავება", clearConfirm: "წავშალოთ ყველაფერი გეგმიდან?", totalDays: "სულ", mapTitle: "ყველაფერი ერთ რუკაზე" },
    arrival: { title: "ახლა ჩამოხვედი?", lead: "აირჩიე აეროპორტი. აი, როგორ მიხვიდე სასტუმრომდე, აიღო SIM ბარათი და ნაღდი ფული, და რა იცოდე პირველ დღეს.", airport: "აეროპორტი", toHotel: "სასტუმრომდე მისვლა", hotelLabel: "სასტუმროს სახელი ან მისამართი", hotelPlaceholder: "მაგ. Stamba Hotel, თბილისი", transitBtn: "საზოგადოებრივი ტრანსპორტი", driveBtn: "ტაქსი / მანქანა", boltBtn: "Bolt-ის გახსნა", yandexBtn: "Yandex Go-ს გახსნა", hotelHint: "ხსნის მიმართულებას Google Maps-ში არჩეული აეროპორტიდან. ტაქსის აპები იხსნება აპში ან მაღაზიაში.", options: "როგორ ჩახვიდე ქალაქში", cost: "ფასი", time: "დრო", runs: "მოძრაობს", tip: "რჩევა", sim: "SIM ბარათები და ინტერნეტი", money: "ფული", emergency: "გადაუდებელი დახმარება", essentials: "აუცილებელი", intercity: "რეგიონებში გადაადგილება", verify: "ფასები და განრიგი იცვლება — გადაამოწმე ადგილზე.", nextStep: "შემდეგი: აირჩიე მარშრუტი" },
    footer: { about: "დამოუკიდებელი გიდი საქართველოში მოგზაურთათვის. ფასები, საათები და განრიგი იცვლება — გადაამოწმე ადგილზე. არ არის დაკავშირებული არც ერთ აეროპორტთან, ოპერატორთან ან დაწესებულებასთან.", qr: "QR პოსტერი აეროპორტისთვის" },
    qr: { title: "დაასკანერე და გახსენი საქართველოს გიდი", sub: "უფასო გიდი, მუშაობს ინტერნეტის გარეშეც: აეროპორტის ტრანსპორტი, მარშრუტები, ადგილები, კერძები.", print: "პოსტერის ბეჭდვა", urlLabel: "აპის მისამართი", urlHint: "QR კოდი ამ გვერდის საკუთარ მისამართზე მიუთითებს. ჯერ საბოლოო მისამართზე განათავსე აპი, მერე დაბეჭდე." },
    common: { more: "მეტი", less: "ნაკლები", close: "დახურვა", approx: "დაახლ.", gel: "₾", open: "გახსნა", mapLoading: "რუკა იტვირთება…", mapOffline: "რუკას ინტერნეტი სჭირდება.", verifyNote: "სავარაუდო — გადაამოწმე ადგილზე." },
    map: { you: "შენ აქ ხარ", locate: "ჩემი ადგილმდებარეობა" }
  },
  ru: {
    appName: "Гид по Грузии", tagline: "Карманный гид по Грузии — маршруты, места, еда и транспорт.",
    nav: { home: "Главная", arrival: "Прилёт", routes: "Маршруты", places: "Места", food: "Еда", plan: "Мой план" },
    lang: "Язык", install: "Установить", installed: "Установлено", installHint: "Добавьте на главный экран, чтобы пользоваться офлайн.",
    offline: "Нет сети — сохранённые страницы работают, карте нужно подключение.",
    hero: { kicker: "Добро пожаловать в Грузию", title: "Горы, море, вино и 8000 лет гостеприимства.", lead: "Выберите маршрут, найдите места, где стоит остановиться, где поесть, и доберитесь из аэропорта до отеля — без гида.", ctaArrival: "Я только прилетел", ctaRoutes: "Выбрать маршрут" },
    quick: { title: "Начните здесь", arrival: "Аэропорт → отель", arrivalSub: "Такси, автобусы, SIM, наличные", routes: "Маршруты", routesSub: "Планы на 1–4 дня", places: "Места", placesSub: "Что смотреть, когда, сколько стоит", food: "Грузинская кухня", foodSub: "Что заказать и где" },
    regions: { title: "Куда хотите поехать?", mountain: "Горы", sea: "Чёрное море", city: "Города", wine: "Винный край", mountainSub: "Казбеги, Сванетия, Рача", seaSub: "Батуми и Аджария", citySub: "Тбилиси, Кутаиси, Мцхета", wineSub: "Кахетия" },
    featured: "Популярные маршруты", allRoutes: "Все маршруты", allPlaces: "Все места",
    days: "дн.", day: "День", hours: "ч", km: "км", drive: "в пути", walk: "пешком",
    filters: { all: "Все", type: "Тип", region: "Регион", days: "Длительность", search: "Поиск", reset: "Сбросить", results: "результатов", noResults: "Ничего не найдено. Попробуйте другой фильтр." },
    types: { mountain: "Горы", sea: "Море", city: "Город", wine: "Вино" },
    cats: { nature: "Природа", history: "История", religion: "Храмы и монастыри", museum: "Музей", viewpoint: "Смотровая", town: "Город", architecture: "Архитектура", activity: "Активность", park: "Парк" },
    kinds: { restaurant: "Ресторан", cafe: "Кафе", winery: "Винодельня", rest: "Остановка", market: "Рынок", bakery: "Пекарня", viewpoint: "Смотровая", guesthouse: "Гостевой дом" },
    route: { addPlan: "Добавить в план", inPlan: "В плане", removePlan: "Убрать из плана", highlights: "Главное", season: "Лучший сезон", difficulty: "Сложность", start: "Начало", stopsEat: "Где остановиться, отдохнуть и поесть", onTheWay: "По пути", openMap: "Маршрут в Google Maps", seeOnMap: "На карте", backToRoutes: "Все маршруты", itinerary: "План по дням", practical: "Полезно знать", included: "Места на маршруте", easy: "Легко", moderate: "Средне", hard: "Сложно", overnight: "С ночёвкой", selectHint: "Отметьте несколько маршрутов и откройте «Мой план» — все места, остановки и рестораны будут вместе." },
    place: { visit: "Время", fee: "Вход", hoursLabel: "Часы работы", getThere: "Как добраться", tips: "Советы", nearby: "Поесть и отдохнуть рядом", routesWith: "Маршруты с этим местом", directions: "Маршрут", save: "Сохранить", saved: "Сохранено", unsave: "Убрать", free: "Бесплатно", altitude: "Высота", bestTime: "Лучшее время" },
    food: { title: "Грузинская кухня", lead: "Грузинская еда создана, чтобы делиться: хлеб, сыр, орехи, зелень, мясо на углях и вино из квеври. Вот что заказать и как.", dishes: "Блюда", drinks: "Напитки", veg: "Вегетарианское", spicy: "Острое", region: "Откуда", howToEat: "Как есть", order: "Как заказать", etiquette: "Супра (застолье) — как это работает", phrases: "Полезные фразы", where: "Где поесть", allDishes: "Все", filterVeg: "Только вегетарианское", pricing: "Примерные цены", cheers: "Гаумарджос! (За здоровье!)" },
    plan: { title: "Мой план", lead: "Выбранные маршруты и места на одной карте, с остановками и ресторанами по пути.", empty: "План пуст. Добавьте маршруты или сохраните места — они появятся здесь.", routes: "Выбранные маршруты", placesSaved: "Сохранённые места", stops: "Остановки и рестораны", share: "Скопировать ссылку на план", copied: "Ссылка скопирована", print: "Печать", clear: "Очистить план", clearConfirm: "Удалить всё из плана?", totalDays: "Итого", mapTitle: "Всё на одной карте" },
    arrival: { title: "Только прилетели?", lead: "Выберите аэропорт. Как добраться до отеля, купить SIM-карту и снять наличные, и что знать в первый день.", airport: "Аэропорт", toHotel: "Доехать до отеля", hotelLabel: "Название или адрес отеля", hotelPlaceholder: "напр. Stamba Hotel, Тбилиси", transitBtn: "Общественный транспорт", driveBtn: "Такси / авто", boltBtn: "Открыть Bolt", yandexBtn: "Открыть Yandex Go", hotelHint: "Откроет маршрут в Google Maps от выбранного аэропорта. Приложения такси откроются в приложении или в магазине.", options: "Как доехать в город", cost: "Цена", time: "Время", runs: "Ходит", tip: "Совет", sim: "SIM-карты и интернет", money: "Деньги", emergency: "Экстренные службы", essentials: "Главное", intercity: "Дальше — в регионы", verify: "Цены и расписания меняются — уточняйте на месте.", nextStep: "Дальше: выберите маршрут" },
    footer: { about: "Независимый гид для путешественников по Грузии. Цены, часы и расписания меняются — проверяйте на месте. Не связан с аэропортами, перевозчиками или заведениями.", qr: "QR-постер для аэропорта" },
    qr: { title: "Отсканируйте, чтобы открыть Гид по Грузии", sub: "Бесплатный гид, работает офлайн: транспорт из аэропорта, маршруты, места, еда.", print: "Печать постера", urlLabel: "Адрес приложения", urlHint: "QR-код указывает на адрес этой страницы. Сначала разместите приложение по окончательному адресу, потом печатайте." },
    common: { more: "Ещё", less: "Меньше", close: "Закрыть", approx: "ок.", gel: "GEL", open: "Открыть", mapLoading: "Карта загружается…", mapOffline: "Карте нужен интернет.", verifyNote: "Примерно — уточните на месте." },
    map: { you: "Вы здесь", locate: "Моё местоположение" }
  }
};

export const LANGS = [{ code: "en", label: "EN" }, { code: "ka", label: "ქარ" }, { code: "ru", label: "RU" }];
const KEY = "gg:lang";
let current = detect();

function detect() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q && STR[q]) { try { localStorage.setItem(KEY, q); } catch {} return q; }
  try { const s = localStorage.getItem(KEY); if (s && STR[s]) return s; } catch {}
  const nav = (navigator.language || "en").slice(0, 2);
  return STR[nav] ? nav : "en";
}
export function lang() { return current; }
export function setLang(code) {
  if (!STR[code]) return;
  current = code;
  try { localStorage.setItem(KEY, code); } catch {}
  document.documentElement.lang = code;
  window.dispatchEvent(new CustomEvent("gg:lang", { detail: code }));
}
/** t("route.addPlan") → string in current language, falling back to en. */
export function t(path) {
  const get = l => path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), STR[l]);
  const v = get(current);
  return v !== undefined ? v : (get("en") ?? path);
}
/** Pick a localized field from content: { en, ka, ru? }. */
export function L(obj) {
  if (obj === null || obj === undefined) return "";
  if (typeof obj === "string") return obj;
  return obj[current] ?? obj.en ?? Object.values(obj)[0] ?? "";
}
document.documentElement.lang = current;
