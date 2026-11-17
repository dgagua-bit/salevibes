/**
 * Itineraries. Each day lists stops in order: `place` (places.js id), `drive` (minutes from the previous stop),
 * `eat` / `rest` (stops.js ids) and an optional note. `color` is used on the map.
 * type: mountain | sea | city | wine. difficulty: easy | moderate | hard.
 */
export const ROUTES = [
  { id: "tbilisi-1day", type: ["city"], days: 1, difficulty: "easy", season: { en: "All year", ka: "მთელი წელი", ru: "Круглый год" }, start: "Tbilisi", color: "#9f2529", icon: "🏙️",
    name: { en: "Tbilisi in a day", ka: "თბილისი ერთ დღეში", ru: "Тбилиси за один день" },
    summary: { en: "The old town on foot, the fortress by cable car, the baths at dusk and khinkali at night. Zero transport needed beyond the metro.", ka: "ძველი ქალაქი ფეხით, ციხე საბაგიროთი, აბანო ბინდისას და ხინკალი ღამით. მეტროს გარდა ტრანსპორტი არ გჭირდება.", ru: "Старый город пешком, крепость на канатке, бани на закате и хинкали ночью. Кроме метро транспорт не нужен." },
    highlights: ["narikala", "abanotubani", "rike", "mtatsminda"],
    itinerary: [
      { title: { en: "Old town, fortress, baths", ka: "ძველი ქალაქი, ციხე, აბანო", ru: "Старый город, крепость, бани" }, stops: [
        { place: "natmuseum", drive: 0, note: { en: "Start at Liberty Square; Rustaveli Avenue first, while the museum is quiet.", ka: "დაიწყე თავისუფლების მოედნიდან; ჯერ რუსთაველი, სანამ მუზეუმი წყნარია.", ru: "Начните с площади Свободы; сначала Руставели, пока в музее тихо." } },
        { place: "drybridge", walk: 15 },
        { place: "rike", walk: 20 },
        { place: "narikala", walk: 5, note: { en: "Cable car up, walk down through the old streets.", ka: "საბაგიროთი ზევით, ფეხით ქვევით ძველი ქუჩებით.", ru: "Наверх по канатке, вниз пешком по старым улицам." } },
        { place: "abanotubani", walk: 10 },
        { place: "mtatsminda", walk: 25, note: { en: "Funicular for sunset over the city.", ka: "ფუნიკულიორი მზის ჩასვლისთვის ქალაქის თავზე.", ru: "Фуникулёр на закат над городом." } }
      ], eat: ["cafe-leila", "meidan-tone", "zakhar", "shavi-lomi"], rest: ["stamba"] }
    ],
    practical: [
      { en: "Buy a Metromoney card (2 GEL) at any metro station, or tap a contactless bank card: metro, bus and cable car all take it.", ka: "ნებისმიერ მეტროსადგურში იყიდე Metromoney ბარათი (2 ₾) ან უკონტაქტო საბანკო ბარათი გამოიყენე: მეტრო, ავტობუსი და საბაგირო ყველას იღებს.", ru: "Купите карту Metromoney (2 GEL) в метро или платите бесконтактной картой: метро, автобус и канатка принимают её." },
      { en: "Churches: shoulders and knees covered; women cover hair (scarves at the door).", ka: "ეკლესიებში: დაფარული მხრები და მუხლები; ქალები თავს იფარავენ.", ru: "В храмах: закрытые плечи и колени; женщины покрывают голову." }
    ] },

  { id: "mtskheta-half", type: ["city"], days: 0.5, difficulty: "easy", season: { en: "All year", ka: "მთელი წელი", ru: "Круглый год" }, start: "Tbilisi", color: "#8a5a12", icon: "⛪",
    name: { en: "Mtskheta: the ancient capital (half day)", ka: "მცხეთა: უძველესი დედაქალაქი (ნახევარი დღე)", ru: "Мцхета: древняя столица (полдня)" },
    summary: { en: "Twenty kilometres from Tbilisi: Jvari on its cliff, Svetitskhoveli below, and lobio in a clay pot on the way back.", ka: "თბილისიდან ოცი კილომეტრი: ჯვარი კლდეზე, სვეტიცხოველი ქვემოთ და უკან გზაზე ლობიო ქოთანში.", ru: "Двадцать километров от Тбилиси: Джвари на скале, Светицховели внизу и лобио в глиняном горшке на обратном пути." },
    highlights: ["jvari", "svetitskhoveli"],
    itinerary: [
      { title: { en: "Jvari, Svetitskhoveli, lobio", ka: "ჯვარი, სვეტიცხოველი, ლობიო", ru: "Джвари, Светицховели, лобио" }, stops: [
        { place: "jvari", drive: 35 },
        { place: "svetitskhoveli", drive: 15, note: { en: "Walk the pedestrian street; churchkhela and wine stalls everywhere.", ka: "საფეხმავლო ქუჩა გაიარე; ყველგან ჩურჩხელა და ღვინოა.", ru: "Пройдитесь по пешеходной улице; повсюду чурчхела и вино." } }
      ], eat: ["salobie"], rest: [] }
    ],
    practical: [{ en: "Taxi from Tbilisi for the whole loop ~70–90 GEL with waiting; or marshrutka from Didube + taxi up to Jvari.", ka: "ტაქსი თბილისიდან მთელ წრეზე ~70–90 ₾ ლოდინით; ან სამარშრუტო დიდუბიდან + ტაქსი ჯვარამდე.", ru: "Такси из Тбилиси на весь круг ~70–90 GEL с ожиданием; или маршрутка с Дидубе + такси до Джвари." }] },

  { id: "kazbegi-2day", type: ["mountain"], days: 2, difficulty: "moderate", season: { en: "May–October (pass can close in winter)", ka: "მაისი–ოქტომბერი (უღელტეხილი ზამთარში შეიძლება დაიკეტოს)", ru: "Май–октябрь (перевал зимой может закрываться)" }, start: "Tbilisi", color: "#1f6f5f", icon: "🏔️",
    name: { en: "Georgian Military Highway to Kazbegi", ka: "საქართველოს სამხედრო გზა ყაზბეგამდე", ru: "Военно-Грузинская дорога до Казбеги" },
    summary: { en: "The most famous drive in Georgia: a fortress on a turquoise lake, khinkali in Pasanauri, a 2,395 m pass, and Gergeti church under a 5,000 m peak. Sleep in Stepantsminda.", ka: "საქართველოს ყველაზე ცნობილი გზა: ციხე ფირუზისფერ ტბაზე, ხინკალი ფასანაურში, 2395 მ უღელტეხილი და გერგეთის სამება 5000 მ მწვერვალის ქვეშ. ღამე სტეფანწმინდაში.", ru: "Самая известная дорога Грузии: крепость на бирюзовом озере, хинкали в Пасанаури, перевал 2395 м и Гергети под пятитысячником. Ночёвка в Степанцминде." },
    highlights: ["ananuri", "friendship", "gergeti", "gveleti"],
    itinerary: [
      { title: { en: "Tbilisi → Ananuri → Gudauri → Stepantsminda", ka: "თბილისი → ანანური → გუდაური → სტეფანწმინდა", ru: "Тбилиси → Ананури → Гудаури → Степанцминда" }, stops: [
        { place: "jvari", drive: 35, note: { en: "Optional 30-min stop if you haven't done Mtskheta.", ka: "სურვილისამებრ 30 წთ, თუ მცხეთა არ გინახავს.", ru: "По желанию 30 мин, если ещё не были в Мцхете." } },
        { place: "ananuri", drive: 50 },
        { place: "gudauri", drive: 60, note: { en: "Lunch in Pasanauri on the way (khinkali).", ka: "გზაზე სადილი ფასანაურში (ხინკალი).", ru: "Обед в Пасанаури по дороге (хинкали)." } },
        { place: "friendship", drive: 10 },
        { place: "stepantsminda", drive: 45, note: { en: "Check in; evening walk by the river, dinner on the square.", ka: "დაბინავება; საღამოს გასეირნება მდინარესთან, ვახშამი მოედანზე.", ru: "Заселение; вечерняя прогулка у реки, ужин на площади." } }
      ], eat: ["pasanauri", "kazbegi-guesthouses"], rest: ["ananuri-stalls", "jvari-pass-tea"] },
      { title: { en: "Gergeti at dawn → Dariali → back to Tbilisi", ka: "გერგეთი გამთენიისას → დარიალი → თბილისი", ru: "Гергети на рассвете → Дарьял → обратно в Тбилиси" }, stops: [
        { place: "gergeti", drive: 20, note: { en: "Walk up (2 h) or 4x4; the mountain is clearest before 10:00.", ka: "ფეხით (2 სთ) ან 4x4; მთა 10:00-მდე ყველაზე სუფთაა.", ru: "Пешком (2 ч) или на 4x4; гора чище всего до 10:00." } },
        { place: "gveleti", drive: 20 },
        { place: "truso", drive: 40, note: { en: "If you have a third day: the Truso valley walk instead of driving back early.", ka: "თუ მესამე დღე გაქვს: თრუსოს ხეობა ადრე დაბრუნების ნაცვლად.", ru: "Если есть третий день: прогулка по Трусо вместо раннего возвращения." } }
      ], eat: ["rooms-terrace", "pasanauri"], rest: ["jvari-pass-tea", "ananuri-stalls"] }
    ],
    practical: [
      { en: "Marshrutka Didube → Stepantsminda ~15 GEL, 3 h, every hour; shared taxi ~30 GEL per seat stops at the sights. Day tours from Tbilisi ~60–90 GEL.", ka: "სამარშრუტო დიდუბე → სტეფანწმინდა ~15 ₾, 3 სთ, ყოველ საათში; გაზიარებული ტაქსი ~30 ₾ ადგილზე ღირსშესანიშნაობებთან ჩერდება. ერთდღიანი ტურები თბილისიდან ~60–90 ₾.", ru: "Маршрутка Дидубе → Степанцминда ~15 GEL, 3 ч, каждый час; совместное такси ~30 GEL за место останавливается у достопримечательностей. Однодневные туры из Тбилиси ~60–90 GEL." },
      { en: "Altitude: Gudauri 2,200 m, Jvari Pass 2,395 m. Take a warm layer in any month and sunscreen.", ka: "სიმაღლე: გუდაური 2200 მ, ჯვრის უღელტეხილი 2395 მ. თბილი ტანსაცმელი ნებისმიერ თვეში და მზისგან დამცავი.", ru: "Высота: Гудаури 2200 м, Крестовый перевал 2395 м. Тёплая одежда в любой месяц и солнцезащитный крем." },
      { en: "Trucks queue for kilometres before the Larsi border; don't be alarmed, cars pass them.", ka: "ლარსის საზღვრამდე სატვირთოების კილომეტრიანი რიგია; ნუ შეშინდები, მსუბუქი მანქანები გაივლიან.", ru: "Перед границей Ларси многокилометровая очередь фур; не пугайтесь, легковые проезжают." }
    ] },

  { id: "kakheti-2day", type: ["wine"], days: 2, difficulty: "easy", season: { en: "All year; harvest (rtveli) late Sep–Oct", ka: "მთელი წელი; რთველი სექტემბრის ბოლო–ოქტომბერი", ru: "Круглый год; сбор урожая (ртвели) конец сентября–октябрь" }, start: "Tbilisi", color: "#6b2d5c", icon: "🍷",
    name: { en: "Kakheti wine road", ka: "კახეთის ღვინის გზა", ru: "Винная дорога Кахетии" },
    summary: { en: "Qvevri cellars, monasteries in vineyards and a walled hill town over the Alazani valley. Two days of amber wine, walnuts and long lunches.", ka: "ქვევრის მარნები, მონასტრები ვენახებში და გალავნიანი ქალაქი ალაზნის ველის თავზე. ორი დღე ქარვისფერი ღვინო, ნიგოზი და გრძელი სადილები.", ru: "Погреба с квеври, монастыри среди виноградников и город-крепость над Алазанской долиной. Два дня янтарного вина, орехов и долгих обедов." },
    highlights: ["sighnaghi", "bodbe", "alaverdi", "tsinandali", "kvareli"],
    itinerary: [
      { title: { en: "Tbilisi → Sighnaghi → Bodbe", ka: "თბილისი → სიღნაღი → ბოდბე", ru: "Тбилиси → Сигнахи → Бодбе" }, stops: [
        { place: "sighnaghi", drive: 105, note: { en: "Walk the wall, lunch, Pirosmani museum, a tasting.", ka: "გალავანი, სადილი, ფიროსმანის მუზეუმი, დეგუსტაცია.", ru: "Стена, обед, музей Пиросмани, дегустация." } },
        { place: "bodbe", drive: 10 }
      ], eat: ["pheasants-tears", "okros"], rest: [] },
      { title: { en: "Sighnaghi → Kvareli → Alaverdi → Tsinandali → Tbilisi", ka: "სიღნაღი → ყვარელი → ალავერდი → წინანდალი → თბილისი", ru: "Сигнахи → Кварели → Алаверди → Цинандали → Тбилиси" }, stops: [
        { place: "kvareli", drive: 60, note: { en: "Wine tunnel tour in the morning.", ka: "ღვინის გვირაბი დილით.", ru: "Винный туннель утром." } },
        { place: "nekresi", drive: 15 },
        { place: "gremi", drive: 15 },
        { place: "alaverdi", drive: 35 },
        { place: "tsinandali", drive: 35, note: { en: "Estate, garden and the cellar tasting; back to Tbilisi over the Gombori pass (1 h 45 min).", ka: "მამული, ბაღი და მარნის დეგუსტაცია; თბილისში გომბორის უღელტეხილით (1 სთ 45 წთ).", ru: "Усадьба, сад и дегустация в погребе; в Тбилиси через Гомборский перевал (1 ч 45 мин)." } }
      ], eat: ["khareba", "kindzmarauli", "twins", "shumi", "telavi-bazaar"], rest: [] }
    ],
    practical: [
      { en: "Driver for 2 days ~250–350 GEL; wine tours from Tbilisi ~80–120 GEL/day. Marshrutkas: Samgori → Sighnaghi, Ortachala → Telavi.", ka: "მძღოლი 2 დღით ~250–350 ₾; ღვინის ტურები თბილისიდან ~80–120 ₾/დღე. სამარშრუტოები: სამგორი → სიღნაღი, ორთაჭალა → თელავი.", ru: "Водитель на 2 дня ~250–350 GEL; винные туры из Тбилиси ~80–120 GEL/день. Маршрутки: Самгори → Сигнахи, Ортачала → Телави." },
      { en: "Tastings are 15–40 GEL for 4–6 wines; the driver does not drink — Georgian police are strict (0.03‰ limit).", ka: "დეგუსტაცია 15–40 ₾ 4–6 ღვინოზე; მძღოლი არ სვამს — პოლიცია მკაცრია.", ru: "Дегустации 15–40 GEL за 4–6 вин; водитель не пьёт — полиция строгая." }
    ] },

  { id: "svaneti-4day", type: ["mountain"], days: 4, difficulty: "hard", season: { en: "June–October (skiing Jan–Mar)", ka: "ივნისი–ოქტომბერი (თხილამური იან–მარ)", ru: "Июнь–октябрь (лыжи янв–март)" }, start: "Kutaisi", color: "#2b4c7e", icon: "🗼",
    name: { en: "Svaneti: towers, glaciers, Ushguli", ka: "სვანეთი: კოშკები, მყინვარები, უშგული", ru: "Сванетия: башни, ледники, Ушгули" },
    summary: { en: "The high Caucasus: a 271 m dam, a valley of medieval towers, an easy glacier walk, a hard lake hike, and Europe's highest villages under Shkhara.", ka: "მაღალი კავკასიონი: 271 მ კაშხალი, შუა საუკუნეების კოშკების ხეობა, მარტივი მყინვარის ბილიკი, რთული ტბების ლაშქრობა და ევროპის უმაღლესი სოფლები შხარას ქვეშ.", ru: "Высокий Кавказ: плотина 271 м, долина средневековых башен, лёгкая прогулка к леднику, тяжёлый подъём к озёрам и самые высокие сёла Европы под Шхарой." },
    highlights: ["mestia", "ushguli", "chalaadi", "koruldi"],
    itinerary: [
      { title: { en: "Kutaisi → Zugdidi → Enguri → Mestia", ka: "ქუთაისი → ზუგდიდი → ენგური → მესტია", ru: "Кутаиси → Зугдиди → Ингури → Местиа" }, stops: [
        { place: "zugdidi", drive: 75, note: { en: "Dadiani palace and a Mingrelian lunch.", ka: "დადიანების სასახლე და მეგრული სადილი.", ru: "Дворец Дадиани и мегрельский обед." } },
        { place: "enguri", drive: 40 },
        { place: "mestia", drive: 150, note: { en: "Museum before it closes; dinner at a guesthouse.", ka: "მუზეუმი დახურვამდე; ვახშამი საოჯახო სასტუმროში.", ru: "Музей до закрытия; ужин в гостевом доме." } }
      ], eat: ["diaroni", "cafe-laila", "mestia-guesthouses"], rest: ["enguri-view"] },
      { title: { en: "Chalaadi glacier & Hatsvali lift", ka: "ჩალაადის მყინვარი და ჰაწვალი", ru: "Ледник Чалаади и подъёмник Хацвали" }, stops: [
        { place: "chalaadi", drive: 20 },
        { place: "hatsvali", drive: 30, note: { en: "Summer chairlift for the Ushba panorama.", ka: "საზაფხულო საბაგირო უშბას პანორამისთვის.", ru: "Летний подъёмник ради панорамы Ушбы." } }
      ], eat: ["cafe-laila"], rest: [] },
      { title: { en: "Ushguli day trip", ka: "უშგული — ერთდღიანი", ru: "Ушгули — на день" }, stops: [
        { place: "ushguli", drive: 120, note: { en: "Shared 4x4; walk towards the Shkhara glacier; Lamaria church.", ka: "გაზიარებული 4x4; შხარას მყინვარისკენ ფეხით; ლამარია.", ru: "Совместный 4x4; пешком к леднику Шхара; церковь Ламария." } }
      ], eat: ["ushguli-cafes", "mestia-guesthouses"], rest: [] },
      { title: { en: "Koruldi lakes (or rest) → back down", ka: "ქორულდის ტბები (ან დასვენება) → დაბრუნება", ru: "Озёра Корулди (или отдых) → спуск" }, stops: [
        { place: "koruldi", drive: 60, note: { en: "Start at dawn; 4x4 if your legs are done. Afternoon marshrutka to Zugdidi / Kutaisi.", ka: "გამთენიისას დაიწყე; 4x4 თუ ფეხები დაიღალა. შუადღის სამარშრუტო ზუგდიდში / ქუთაისში.", ru: "Выходите на рассвете; 4x4, если ноги устали. Дневная маршрутка в Зугдиди / Кутаиси." } }
      ], eat: ["cafe-laila"], rest: ["enguri-view"] }
    ],
    practical: [
      { en: "Marshrutka Kutaisi → Mestia ~40 GEL (5–6 h) or Zugdidi → Mestia ~30 GEL (3 h); the Natakhtari–Mestia flight (~100 GEL, 1 h) sells out weeks ahead and is weather-dependent.", ka: "სამარშრუტო ქუთაისი → მესტია ~40 ₾ (5–6 სთ) ან ზუგდიდი → მესტია ~30 ₾ (3 სთ); ნატახტარი–მესტიის ფრენა (~100 ₾, 1 სთ) კვირებით ადრე იყიდება და ამინდზეა დამოკიდებული.", ru: "Маршрутка Кутаиси → Местиа ~40 GEL (5–6 ч) или Зугдиди → Местиа ~30 GEL (3 ч); рейс Натахтари–Местиа (~100 GEL, 1 ч) раскупают за недели, зависит от погоды." },
      { en: "Guesthouses with half board are the norm (~70–120 GEL/person). Cash: ATMs exist in Mestia only.", ka: "საოჯახო სასტუმრო ნახევარპანსიონით ნორმაა (~70–120 ₾/ადამიანი). ნაღდი ფული: ბანკომატი მხოლოდ მესტიაშია.", ru: "Гостевые дома с полупансионом — норма (~70–120 GEL/чел.). Наличные: банкоматы только в Местиа." },
      { en: "Weather turns fast above 2,000 m: waterproof jacket, hat, sunscreen, boots. Tell your guesthouse where you are hiking.", ka: "2000 მ-ზე ამინდი სწრაფად იცვლება: წყალგაუმტარი ქურთუკი, ქუდი, მზისგან დამცავი, ბოტები. სასტუმროს უთხარი, სად მიდიხარ.", ru: "Выше 2000 м погода меняется быстро: непромокаемая куртка, шапка, крем, ботинки. Скажите в гостевом доме, куда идёте." }
    ] },

  { id: "batumi-3day", type: ["sea"], days: 3, difficulty: "easy", season: { en: "May–October; warmest sea Aug–Sep", ka: "მაისი–ოქტომბერი; ზღვა ყველაზე თბილი აგვ–სექ", ru: "Май–октябрь; самое тёплое море авг–сент" }, start: "Batumi", color: "#2a7f9e", icon: "🌊",
    name: { en: "Batumi & the Black Sea coast", ka: "ბათუმი და შავი ზღვის სანაპირო", ru: "Батуми и побережье Чёрного моря" },
    summary: { en: "Beach, boulevard and skyline in the city; a Roman fortress and the clearest water at the Turkish border; waterfalls, a rainforest and mountain wine an hour inland.", ka: "სანაპირო, ბულვარი და ქალაქის სილუეტი; რომაული ციხე და ყველაზე სუფთა წყალი თურქეთის საზღვართან; ჩანჩქერები, ტროპიკული ტყე და მთის ღვინო ერთ საათში.", ru: "Пляж, бульвар и панорама города; римская крепость и самая чистая вода у турецкой границы; водопады, дождевой лес и горное вино в часе езды." },
    highlights: ["batumi", "botanical", "gonio", "makhuntseti", "mtirala"],
    itinerary: [
      { title: { en: "Batumi: boulevard, old town, cable car", ka: "ბათუმი: ბულვარი, ძველი ქალაქი, საბაგირო", ru: "Батуми: бульвар, старый город, канатка" }, stops: [
        { place: "batumi", drive: 0, note: { en: "Bike the boulevard, Europe Square, the Argo cable car for sunset, fountains at night.", ka: "ბულვარი ველოსიპედით, ევროპის მოედანი, „არგოს“ საბაგირო მზის ჩასვლაზე, შადრევნები ღამით.", ru: "Бульвар на велосипеде, площадь Европы, канатка «Арго» на закате, фонтаны ночью." } }
      ], eat: ["retro", "laguna", "fish-market"], rest: [] },
      { title: { en: "South: Gonio, Sarpi; north: Botanical Garden", ka: "სამხრეთი: გონიო, სარფი; ჩრდილოეთი: ბოტანიკური ბაღი", ru: "Юг: Гонио, Сарпи; север: Ботанический сад" }, stops: [
        { place: "gonio", drive: 25 },
        { place: "botanical", drive: 40, note: { en: "Swim at Sarpi first, then the garden in the afternoon (or split across two days).", ka: "ჯერ სარფში იცურავე, შემდეგ ბაღი შუადღისას (ან ორ დღეზე გაანაწილე).", ru: "Сначала купание в Сарпи, затем сад после обеда (или разбейте на два дня)." } }
      ], eat: ["sarpi-beach", "retro"], rest: ["sarpi-beach"] },
      { title: { en: "Mountain Adjara: waterfall, bridge, wine, rainforest", ka: "მთიანი აჭარა: ჩანჩქერი, ხიდი, ღვინო, ტყე", ru: "Горная Аджария: водопад, мост, вино, лес" }, stops: [
        { place: "makhuntseti", drive: 45 },
        { place: "mtirala", drive: 50, note: { en: "Pick one: Mtirala's waterfall trail (half day) or continue to Khulo for the cable car.", ka: "ერთი აირჩიე: მტირალას ჩანჩქერის ბილიკი (ნახევარი დღე) ან ხულოს საბაგირო.", ru: "Выберите одно: тропа к водопаду Мтирала (полдня) или дальше в Хуло на канатку." } },
        { place: "petra", drive: 50, note: { en: "On the way back, if there is light left.", ka: "უკან გზაზე, თუ სინათლე დარჩა.", ru: "На обратном пути, если ещё светло." } }
      ], eat: ["makhuntseti-restaurants", "adjarian-wine-house"], rest: ["mtirala-visitor"] }
    ],
    practical: [
      { en: "Tbilisi → Batumi: fast train ~5 h (book on tkt.ge a few days ahead), marshrutka ~6 h, flight 1 h. From Kutaisi airport: shuttle 2.5 h.", ka: "თბილისი → ბათუმი: სწრაფი მატარებელი ~5 სთ (tkt.ge-ზე რამდენიმე დღით ადრე), სამარშრუტო ~6 სთ, თვითმფრინავი 1 სთ. ქუთაისის აეროპორტიდან: შატლი 2.5 სთ.", ru: "Тбилиси → Батуми: скорый поезд ~5 ч (билеты на tkt.ge за несколько дней), маршрутка ~6 ч, самолёт 1 ч. Из аэропорта Кутаиси: шаттл 2,5 ч." },
      { en: "City buses take contactless bank cards. Beaches are pebble — water shoes help. It rains a lot; Batumi is subtropical.", ka: "ქალაქის ავტობუსები უკონტაქტო ბარათს იღებენ. სანაპირო კენჭოვანია — წყლის ფეხსაცმელი გამოგადგება. ბევრი წვიმს; ბათუმი სუბტროპიკულია.", ru: "Городские автобусы принимают бесконтактные карты. Пляжи галечные — пригодится обувь для воды. Часто дожди; Батуми — субтропики." }
    ] },

  { id: "imereti-2day", type: ["city", "mountain"], days: 2, difficulty: "easy", season: { en: "April–October for the canyons; caves all year", ka: "აპრილი–ოქტომბერი კანიონებისთვის; მღვიმეები მთელი წელი", ru: "Апрель–октябрь для каньонов; пещеры круглый год" }, start: "Kutaisi", color: "#3f6b4a", icon: "🪨",
    name: { en: "Kutaisi, canyons and caves", ka: "ქუთაისი, კანიონები და მღვიმეები", ru: "Кутаиси, каньоны и пещеры" },
    summary: { en: "The west in two days from Kutaisi airport: a UNESCO monastery and a cliff-top one, a cave with an underground river, and two green canyons with boat rides and walkways.", ka: "დასავლეთი ორ დღეში ქუთაისის აეროპორტიდან: UNESCO-ს მონასტერი და კლდის თავზე მეორე, მღვიმე მიწისქვეშა მდინარით და ორი მწვანე კანიონი ნავებითა და ბილიკებით.", ru: "Запад за два дня из аэропорта Кутаиси: монастырь ЮНЕСКО и ещё один на скале, пещера с подземной рекой и два зелёных каньона с лодками и мостками." },
    highlights: ["gelati", "prometheus", "martvili", "okatse"],
    itinerary: [
      { title: { en: "Kutaisi → Gelati → Motsameta → Prometheus Cave", ka: "ქუთაისი → გელათი → მოწამეთა → პრომეთეს მღვიმე", ru: "Кутаиси → Гелати → Моцамета → пещера Прометея" }, stops: [
        { place: "kutaisi", drive: 0, note: { en: "Bazaar and Bagrati in the morning.", ka: "ბაზარი და ბაგრატი დილით.", ru: "Базар и Баграти утром." } },
        { place: "motsameta", drive: 15 },
        { place: "gelati", drive: 10 },
        { place: "prometheus", drive: 40 }
      ], eat: ["kutaisi-bazaar", "bikentia", "palaty"], rest: [] },
      { title: { en: "Martvili Canyon → Okatse Canyon → Kinchkha", ka: "მარტვილის კანიონი → ოკაცე → კინჩხა", ru: "Каньон Мартвили → Окаце → Кинчха" }, stops: [
        { place: "martvili", drive: 60, note: { en: "Be there at opening for the boat.", ka: "გახსნისას მიდი ნავისთვის.", ru: "Приезжайте к открытию ради лодки." } },
        { place: "okatse", drive: 45, note: { en: "Lunch in Gordi, then the walkway and the waterfall.", ka: "სადილი გორდში, შემდეგ ბილიკი და ჩანჩქერი.", ru: "Обед в Горди, затем мостки и водопад." } },
        { place: "katskhi", drive: 90, note: { en: "Only if you are driving on to Tbilisi.", ka: "მხოლოდ თუ თბილისისკენ მიდიხარ.", ru: "Только если едете дальше в Тбилиси." } }
      ], eat: ["martvili-cafes", "gordi-guesthouses"], rest: [] }
    ],
    practical: [
      { en: "A taxi for the full canyon day from Kutaisi is ~120–160 GEL; day tours ~50–70 GEL/person. Prometheus Cave is closed on Mondays.", ka: "ტაქსი მთელი კანიონების დღისთვის ქუთაისიდან ~120–160 ₾; ერთდღიანი ტურები ~50–70 ₾/ადამიანი. პრომეთეს მღვიმე ორშაბათს დაკეტილია.", ru: "Такси на весь день каньонов из Кутаиси ~120–160 GEL; туры ~50–70 GEL/чел. Пещера Прометея закрыта по понедельникам." }
    ] },

  { id: "south-2day", type: ["mountain", "city"], days: 2, difficulty: "easy", season: { en: "April–November; Bakuriani skiing Dec–Mar", ka: "აპრილი–ნოემბერი; ბაკურიანი დეკ–მარ", ru: "Апрель–ноябрь; лыжи в Бакуриани дек–март" }, start: "Tbilisi", color: "#b5651d", icon: "🏰",
    name: { en: "Borjomi, Rabati and Vardzia", ka: "ბორჯომი, რაბათი და ვარძია", ru: "Боржоми, Рабат и Вардзиа" },
    summary: { en: "South-west from Tbilisi: a cave town on the way, mineral water at the source, a rebuilt citadel to sleep in, and a 12th-century city carved into a cliff.", ka: "თბილისიდან სამხრეთ-დასავლეთით: კლდის ქალაქი გზაზე, მინერალური წყალი წყაროდან, აღდგენილი ციტადელი ღამისთევისთვის და კლდეში ნაკვეთი XII საუკუნის ქალაქი.", ru: "На юго-запад от Тбилиси: пещерный город по пути, минеральная вода из источника, восстановленная цитадель для ночёвки и город XII века, вырубленный в скале." },
    highlights: ["uplistsikhe", "borjomi", "rabati", "vardzia"],
    itinerary: [
      { title: { en: "Tbilisi → Uplistsikhe → Borjomi → Akhaltsikhe", ka: "თბილისი → უფლისციხე → ბორჯომი → ახალციხე", ru: "Тбилиси → Уплисцихе → Боржоми → Ахалцихе" }, stops: [
        { place: "uplistsikhe", drive: 80 },
        { place: "gori", drive: 15, note: { en: "Optional: Stalin Museum (1 h).", ka: "სურვილისამებრ: სტალინის მუზეუმი (1 სთ).", ru: "По желанию: музей Сталина (1 ч)." } },
        { place: "borjomi", drive: 75, note: { en: "Park, spring, cable car; hot pools if time.", ka: "პარკი, წყარო, საბაგირო; ცხელი აუზები თუ დრო დარჩა.", ru: "Парк, источник, канатка; горячие бассейны, если есть время." } },
        { place: "rabati", drive: 60, note: { en: "Sleep in Akhaltsikhe; the castle is lit at night.", ka: "ღამე ახალციხეში; ციხე ღამით განათებულია.", ru: "Ночёвка в Ахалцихе; замок подсвечен ночью." } }
      ], eat: ["gori-bazaar", "borjomi-park", "rabati-cafes"], rest: ["borjomi-park"] },
      { title: { en: "Vardzia and back", ka: "ვარძია და უკან", ru: "Вардзиа и обратно" }, stops: [
        { place: "vardzia", drive: 75, note: { en: "Khertvisi fortress and the gorge on the way; caves 2 h; lunch by the river.", ka: "ხერთვისის ციხე და ხეობა გზაზე; გამოქვაბულები 2 სთ; სადილი მდინარესთან.", ru: "Крепость Хертвиси и ущелье по пути; пещеры 2 ч; обед у реки." } },
        { place: "bakuriani", drive: 150, note: { en: "Alternative return via Bakuriani and the Kukushka train if you have a third day.", ka: "ალტერნატივა: ბაკურიანი და „კუკუშკა“, თუ მესამე დღე გაქვს.", ru: "Альтернатива: Бакуриани и поезд «Кукушка», если есть третий день." } }
      ], eat: ["vardzia-tavern"], rest: [] }
    ],
    practical: [
      { en: "Public transport is thin beyond Akhaltsikhe (2 marshrutkas a day to Vardzia): a driver for 2 days ~300 GEL, or a day tour from Tbilisi (~90 GEL, 14 h).", ka: "ახალციხის იქით საზოგადოებრივი ტრანსპორტი ცოტაა (ვარძიაში დღეში 2 სამარშრუტო): მძღოლი 2 დღით ~300 ₾ ან ერთდღიანი ტური თბილისიდან (~90 ₾, 14 სთ).", ru: "За Ахалцихе транспорта мало (2 маршрутки в день до Вардзии): водитель на 2 дня ~300 GEL или тур из Тбилиси (~90 GEL, 14 ч)." }
    ] },

  { id: "racha-2day", type: ["mountain", "wine"], days: 2, difficulty: "moderate", season: { en: "May–October", ka: "მაისი–ოქტომბერი", ru: "Май–октябрь" }, start: "Kutaisi", color: "#6a4c93", icon: "🍯",
    name: { en: "Racha: the quiet mountains", ka: "რაჭა: წყნარი მთები", ru: "Рача: тихие горы" },
    summary: { en: "Where Georgians go on holiday: a lake in pine forest, the most carved church in the country, Khvanchkara from village cellars and valleys with almost no other tourists.", ka: "სადაც ქართველები ისვენებენ: ტბა ფიჭვნარში, ქვეყნის ყველაზე მოჩუქურთმებული ეკლესია, ხვანჭკარა სოფლის მარნებიდან და ხეობები თითქმის ტურისტების გარეშე.", ru: "Где отдыхают сами грузины: озеро в сосновом лесу, самая резная церковь страны, Хванчкара из сельских погребов и долины почти без туристов." },
    highlights: ["shaori", "oni"],
    itinerary: [
      { title: { en: "Kutaisi → Katskhi → Shaori → Nikortsminda → Ambrolauri", ka: "ქუთაისი → კაცხი → შაორი → ნიკორწმინდა → ამბროლაური", ru: "Кутаиси → Кацхи → Шаори → Никорцминда → Амбролаури" }, stops: [
        { place: "katskhi", drive: 70 },
        { place: "shaori", drive: 60, note: { en: "Trout lunch on the lake, then Nikortsminda's carved façade.", ka: "კალმახი ტბაზე, შემდეგ ნიკორწმინდის ჩუქურთმები.", ru: "Форель на озере, затем резной фасад Никорцминды." } }
      ], eat: ["shaori-trout"], rest: [] },
      { title: { en: "Khvanchkara → Oni → Shovi valley", ka: "ხვანჭკარა → ონი → შოვის ხეობა", ru: "Хванчкара → Они → долина Шови" }, stops: [
        { place: "oni", drive: 50, note: { en: "Synagogue, museum; drive on up the Rioni for an afternoon walk, back to Kutaisi or Tbilisi (3–4 h).", ka: "სინაგოგა, მუზეუმი; რიონის ზემოთ შუადღის გასეირნება, უკან ქუთაისში ან თბილისში (3–4 სთ).", ru: "Синагога, музей; вверх по Риони на прогулку, обратно в Кутаиси или Тбилиси (3–4 ч)." } }
      ], eat: ["khvanchkara-cellars"], rest: [] }
    ],
    practical: [
      { en: "Rent a car or hire a driver: marshrutkas reach Ambrolauri and Oni once or twice a day from Kutaisi and Tbilisi. Fill the tank in Ambrolauri.", ka: "მანქანა იქირავე ან მძღოლი: სამარშრუტო ამბროლაურსა და ონში დღეში ერთხელ-ორჯერ მიდის ქუთაისიდან და თბილისიდან. ამბროლაურში ბენზინი ჩაასხი.", ru: "Арендуйте машину или водителя: маршрутки в Амбролаури и Они ходят 1–2 раза в день из Кутаиси и Тбилиси. Заправьтесь в Амбролаури." }
    ] },

  { id: "gareja-1day", type: ["wine"], days: 1, difficulty: "moderate", season: { en: "March–May, September–November (very hot in summer)", ka: "მარტი–მაისი, სექტემბერი–ნოემბერი (ზაფხულში ძალიან ცხელა)", ru: "Март–май, сентябрь–ноябрь (летом очень жарко)" }, start: "Tbilisi", color: "#c9a227", icon: "🏜️",
    name: { en: "David Gareja: monasteries in the desert", ka: "დავით გარეჯა: მონასტრები უდაბნოში", ru: "Давид-Гареджи: монастыри в пустыне" },
    summary: { en: "A day in the semi-desert south-east of Tbilisi: 6th-century cave monasteries, a ridge walk on the Azerbaijani border, and lunch in a steppe village.", ka: "ერთი დღე თბილისის სამხრეთ-აღმოსავლეთ ნახევრადუდაბნოში: VI საუკუნის გამოქვაბული მონასტრები, ბილიკი ქედზე აზერბაიჯანის საზღვართან და სადილი სტეპის სოფელში.", ru: "День в полупустыне к юго-востоку от Тбилиси: пещерные монастыри VI века, тропа по хребту на границе с Азербайджаном и обед в степном селе." },
    highlights: ["davitgareja"],
    itinerary: [
      { title: { en: "Tbilisi → Udabno → Lavra → Tbilisi", ka: "თბილისი → უდაბნო → ლავრა → თბილისი", ru: "Тбилиси → Удабно → Лавра → Тбилиси" }, stops: [
        { place: "davitgareja", drive: 110, note: { en: "Lavra monastery, then the ridge if open. Combine with Sighnaghi on the way back if you have a car.", ka: "ლავრა, შემდეგ ქედი თუ ღიაა. მანქანით უკან სიღნაღი შეუთავსე.", ru: "Лавра, затем хребет, если открыт. На машине на обратном пути можно заехать в Сигнахи." } }
      ], eat: ["oasis-udabno"], rest: [] }
    ],
    practical: [
      { en: "No public transport. The Gareji Line shuttle leaves Tbilisi (Liberty Square) daily in season ~35–50 GEL return; private taxi ~120 GEL.", ka: "საზოგადოებრივი ტრანსპორტი არ არის. Gareji Line-ის შატლი სეზონზე ყოველდღე გადის თბილისიდან (თავისუფლების მოედანი) ~35–50 ₾ იქით-აქეთ; ტაქსი ~120 ₾.", ru: "Общественного транспорта нет. Шаттл Gareji Line в сезон ежедневно от площади Свободы ~35–50 GEL туда-обратно; такси ~120 GEL." },
      { en: "Carry your passport (border zone), 2 litres of water per person, hat; no shade anywhere.", ka: "პასპორტი თან იქონიე (სასაზღვრო ზონა), 2 ლიტრი წყალი, ქუდი; ჩრდილი არსად არის.", ru: "Паспорт с собой (погранзона), 2 литра воды на человека, головной убор; тени нет нигде." }
    ] }
];
export const routeById = id => ROUTES.find(r => r.id === id);
