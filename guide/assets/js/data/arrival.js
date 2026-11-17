/**
 * Arrival information. Prices/timetables are indicative (late 2025) — the page says to verify on site.
 * mode: bus | taxi | shuttle | train | car
 */
export const AIRPORTS = [
  { id: "TBS", name: { en: "Tbilisi (TBS)", ka: "თბილისი (TBS)", ru: "Тбилиси (TBS)" }, city: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси" }, lat: 41.6692, lng: 44.9547, distance: 17, mapsName: "Tbilisi International Airport",
    options: [
      { mode: "bus", title: { en: "City bus 337", ka: "ავტობუსი 337", ru: "Автобус 337" }, cost: "~1 GEL", time: { en: "40–60 min to Rustaveli / Station Square", ka: "40–60 წთ რუსთაველამდე / სადგურის მოედნამდე", ru: "40–60 мин до Руставели / Вокзальной площади" }, runs: { en: "24 h, every 15–30 min; stop outside Arrivals", ka: "24 სთ, ყოველ 15–30 წთ; გაჩერება ჩამოსვლის დარბაზთან", ru: "Круглосуточно, каждые 15–30 мин; остановка у выхода" }, tip: { en: "Pay with a contactless bank card on the validator, or buy a Metromoney card at the metro later. Luggage is fine.", ka: "გადაიხადე უკონტაქტო საბანკო ბარათით ვალიდატორზე ან მოგვიანებით მეტროში Metromoney იყიდე. ბარგი პრობლემა არაა.", ru: "Платите бесконтактной картой на валидаторе или купите позже Metromoney в метро. С багажом можно." } },
      { mode: "taxi", title: { en: "Taxi app (Bolt, Yandex Go, Maxim)", ka: "ტაქსის აპი (Bolt, Yandex Go, Maxim)", ru: "Такси через приложение (Bolt, Yandex Go, Maxim)" }, cost: "25–45 GEL", time: { en: "25–40 min to the centre", ka: "25–40 წთ ცენტრამდე", ru: "25–40 мин до центра" }, runs: { en: "24 h", ka: "24 სთ", ru: "Круглосуточно" }, tip: { en: "Order from the app on airport Wi-Fi; pickup at the marked rideshare point outside. Drivers at the door quote 2–3× the app price.", ka: "აეროპორტის Wi-Fi-ით აპიდან გამოიძახე; აყვანა მონიშნულ წერტილში. კართან მდგომი მძღოლები აპის ფასის 2–3-ჯერ მეტს ითხოვენ.", ru: "Вызывайте через приложение по Wi-Fi аэропорта; посадка в отмеченной зоне. Таксисты у выхода просят в 2–3 раза больше." } },
      { mode: "train", title: { en: "Railway shuttle to Central Station", ka: "მატარებელი ცენტრალურ სადგურამდე", ru: "Электричка до Центрального вокзала" }, cost: "~1 GEL", time: { en: "~35 min", ka: "~35 წთ", ru: "~35 мин" }, runs: { en: "Only a couple of departures a day; check the board", ka: "დღეში მხოლოდ რამდენიმე რეისი; დაფა შეამოწმე", ru: "Лишь пара рейсов в день; смотрите табло" }, tip: { en: "Cheap but rarely convenient; the bus is the practical choice.", ka: "იაფია, მაგრამ იშვიათად მოსახერხებელი; ავტობუსი პრაქტიკულია.", ru: "Дёшево, но редко удобно; автобус практичнее." } },
      { mode: "car", title: { en: "Car rental", ka: "მანქანის ქირაობა", ru: "Аренда авто" }, cost: "80–150 GEL/day", time: { en: "—", ka: "—", ru: "—" }, runs: { en: "Desks in Arrivals", ka: "დახლები ჩამოსვლის დარბაზში", ru: "Стойки в зале прилёта" }, tip: { en: "Local companies are cheaper than the majors; check insurance covers unpaved roads if you plan Svaneti or Tusheti.", ka: "ადგილობრივი კომპანიები უფრო იაფია; შეამოწმე დაზღვევა გრუნტის გზებზე სვანეთისთვის ან თუშეთისთვის.", ru: "Местные компании дешевле; проверьте, покрывает ли страховка грунтовые дороги для Сванетии или Тушетии." } }
    ],
    intercity: { en: "Marshrutkas (minibuses) leave from Didube station (north & west: Kazbegi, Gori, Kutaisi, Borjomi) and Samgori / Ortachala (east: Kakheti). Trains to Batumi, Kutaisi and Zugdidi from Central Station — book on tkt.ge.", ka: "სამარშრუტოები დიდუბიდან (ჩრდილოეთი და დასავლეთი: ყაზბეგი, გორი, ქუთაისი, ბორჯომი) და სამგორი / ორთაჭალიდან (აღმოსავლეთი: კახეთი). მატარებლები ბათუმში, ქუთაისსა და ზუგდიდში ცენტრალური სადგურიდან — tkt.ge.", ru: "Маршрутки с Дидубе (север и запад: Казбеги, Гори, Кутаиси, Боржоми) и Самгори / Ортачала (восток: Кахетия). Поезда в Батуми, Кутаиси и Зугдиди с Центрального вокзала — билеты на tkt.ge." } },

  { id: "KUT", name: { en: "Kutaisi (KUT)", ka: "ქუთაისი (KUT)", ru: "Кутаиси (KUT)" }, city: { en: "Kutaisi", ka: "ქუთაისი", ru: "Кутаиси" }, lat: 42.1767, lng: 42.4826, distance: 22, mapsName: "Kutaisi International Airport",
    options: [
      { mode: "shuttle", title: { en: "Georgian Bus / Omnibus shuttles", ka: "Georgian Bus / Omnibus შატლები", ru: "Шаттлы Georgian Bus / Omnibus" }, cost: "Kutaisi ~5–10 · Tbilisi ~25–35 · Batumi ~20–25 GEL", time: { en: "Kutaisi 30 min · Batumi 2.5 h · Tbilisi 4 h", ka: "ქუთაისი 30 წთ · ბათუმი 2.5 სთ · თბილისი 4 სთ", ru: "Кутаиси 30 мин · Батуми 2,5 ч · Тбилиси 4 ч" }, runs: { en: "Timed to every flight, day and night", ka: "ყველა ფრენაზეა მორგებული, დღე და ღამე", ru: "Под каждый рейс, днём и ночью" }, tip: { en: "Book online (georgianbus.ge, omnibusexpress.ge) or pay at the desk in Arrivals. They wait for delayed flights.", ka: "ონლაინ დაჯავშნე (georgianbus.ge, omnibusexpress.ge) ან დახლთან გადაიხადე. დაგვიანებულ ფრენებს ელოდებიან.", ru: "Бронируйте онлайн (georgianbus.ge, omnibusexpress.ge) или платите на стойке. Ждут задержанные рейсы." } },
      { mode: "taxi", title: { en: "Taxi (Bolt / Yandex Go) to Kutaisi", ka: "ტაქსი (Bolt / Yandex Go) ქუთაისში", ru: "Такси (Bolt / Yandex Go) в Кутаиси" }, cost: "30–45 GEL", time: { en: "30 min", ka: "30 წთ", ru: "30 мин" }, runs: { en: "24 h; fewer cars at night", ka: "24 სთ; ღამით ნაკლები მანქანა", ru: "Круглосуточно; ночью машин меньше" }, tip: { en: "Agree the price before you get in if it's not from the app.", ka: "თუ აპიდან არაა, ფასი ჩაჯდომამდე შეათანხმე.", ru: "Если не через приложение — договоритесь о цене заранее." } },
      { mode: "bus", title: { en: "Municipal bus to Kutaisi", ka: "მუნიციპალური ავტობუსი ქუთაისში", ru: "Городской автобус в Кутаиси" }, cost: "~1–2 GEL", time: { en: "45 min", ka: "45 წთ", ru: "45 мин" }, runs: { en: "Daytime, roughly hourly", ka: "დღისით, დაახლოებით ყოველ საათში", ru: "Днём, примерно раз в час" }, tip: { en: "Slow but the cheapest option; stops on the main road outside the terminal.", ka: "ნელია, მაგრამ ყველაზე იაფი; გაჩერება ტერმინალის გარეთ მთავარ გზაზე.", ru: "Медленно, но дешевле всего; остановка на трассе у терминала." } }
    ],
    intercity: { en: "Kutaisi is the hub of the west: Mestia (Svaneti) 5–6 h by marshrutka, Batumi 2 h, Tbilisi 3–4 h; trains from Kutaisi-1 (Rioni) station.", ka: "ქუთაისი დასავლეთის კვანძია: მესტია 5–6 სთ სამარშრუტოთი, ბათუმი 2 სთ, თბილისი 3–4 სთ; მატარებლები ქუთაისი-1 (რიონი) სადგურიდან.", ru: "Кутаиси — узел запада: Местиа 5–6 ч на маршрутке, Батуми 2 ч, Тбилиси 3–4 ч; поезда со станции Кутаиси-1 (Риони)." } },

  { id: "BUS", name: { en: "Batumi (BUS)", ka: "ბათუმი (BUS)", ru: "Батуми (BUS)" }, city: { en: "Batumi", ka: "ბათუმი", ru: "Батуми" }, lat: 41.6103, lng: 41.5997, distance: 5, mapsName: "Batumi International Airport",
    options: [
      { mode: "taxi", title: { en: "Taxi (Bolt / Yandex Go)", ka: "ტაქსი (Bolt / Yandex Go)", ru: "Такси (Bolt / Yandex Go)" }, cost: "10–20 GEL", time: { en: "15 min to the boulevard", ka: "15 წთ ბულვარამდე", ru: "15 мин до бульвара" }, runs: { en: "24 h", ka: "24 სთ", ru: "Круглосуточно" }, tip: { en: "The airport is practically in town — the easiest arrival in Georgia.", ka: "აეროპორტი თითქმის ქალაქშია — საქართველოში ყველაზე მარტივი ჩამოსვლა.", ru: "Аэропорт почти в городе — самый простой прилёт в Грузии." } },
      { mode: "bus", title: { en: "City bus (line 10 / 14 direction centre)", ka: "ქალაქის ავტობუსი (10 / 14 ცენტრისკენ)", ru: "Городской автобус (10 / 14 в центр)" }, cost: "~1 GEL", time: { en: "25 min", ka: "25 წთ", ru: "25 мин" }, runs: { en: "~07:00–23:00", ka: "~07:00–23:00", ru: "~07:00–23:00" }, tip: { en: "Stop on the main road 200 m from the terminal; pay with a contactless bank card.", ka: "გაჩერება ტერმინალიდან 200 მ-ში მთავარ გზაზე; უკონტაქტო ბარათით გადაიხადე.", ru: "Остановка на трассе в 200 м от терминала; оплата бесконтактной картой." } },
      { mode: "shuttle", title: { en: "Marshrutka towards Kobuleti / Batumi", ka: "სამარშრუტო ქობულეთი / ბათუმისკენ", ru: "Маршрутка в сторону Кобулети / Батуми" }, cost: "~1–2 GEL", time: { en: "20 min", ka: "20 წთ", ru: "20 мин" }, runs: { en: "Daytime", ka: "დღისით", ru: "Днём" }, tip: { en: "Flag one down on the road; say \"Batumi\".", ka: "გზაზე ხელი დაუქნიე; თქვი „ბათუმი“.", ru: "Остановите на дороге; скажите «Батуми»." } }
    ],
    intercity: { en: "Batumi bus station (and the old station on Gogebashvili St) serve Kutaisi, Tbilisi, Akhaltsikhe and Trabzon. Trains to Tbilisi from Batumi Central (Makhinjauri).", ka: "ბათუმის ავტოსადგური ემსახურება ქუთაისს, თბილისს, ახალციხესა და ტრაბზონს. მატარებლები თბილისში ბათუმის ცენტრალური (მახინჯაური) სადგურიდან.", ru: "Автовокзал Батуми (и старый на ул. Гогебашвили) — в Кутаиси, Тбилиси, Ахалцихе и Трабзон. Поезда в Тбилиси с вокзала Батуми-Центральный (Махинджаури)." } }
];

export const SIM = {
  en: [
    "Three networks: Magti (best coverage in the mountains), Silknet (formerly Geocell) and Cellfie (formerly Beeline). All have counters in Arrivals; a tourist SIM with 10–30 GB costs about 15–30 GEL for a month.",
    "Bring your passport — registration is mandatory. eSIMs are available from all three and from international apps, but airport counters are usually cheaper.",
    "Georgian 4G is fast and reaches most valleys; expect gaps in Tusheti, upper Svaneti and deep gorges."
  ],
  ka: [
    "სამი ქსელი: მაგთი (საუკეთესო დაფარვა მთაში), სილქნეთი და სელფი. ყველას აქვს დახლი ჩამოსვლის დარბაზში; ტურისტული SIM 10–30 GB-ით თვეში ~15–30 ₾.",
    "პასპორტი თან იქონიე — რეგისტრაცია სავალდებულოა. eSIM სამივესთან და საერთაშორისო აპებშია, მაგრამ აეროპორტის დახლი ჩვეულებრივ იაფია.",
    "4G სწრაფია და ხეობების უმეტესობას სწვდება; ხარვეზები თუშეთში, ზემო სვანეთსა და ღრმა ხეობებშია."
  ],
  ru: [
    "Три сети: Magti (лучшее покрытие в горах), Silknet (бывший Geocell) и Cellfie (бывший Beeline). Стойки в зале прилёта; туристическая SIM с 10–30 ГБ стоит около 15–30 GEL в месяц.",
    "Нужен паспорт — регистрация обязательна. eSIM есть у всех трёх и в международных приложениях, но в аэропорту обычно дешевле.",
    "4G быстрый и ловит в большинстве долин; пробелы в Тушетии, верхней Сванетии и глубоких ущельях."
  ]
};

export const MONEY = {
  en: [
    "Currency: Georgian lari (GEL, ₾). 1 USD ≈ 2.7 GEL, 1 EUR ≈ 3.1 GEL (check the live rate).",
    "ATMs (Bank of Georgia, TBC, Liberty) are everywhere in towns and dispense lari; most charge no local fee. Exchange offices in the city centre give better rates than the airport.",
    "Cards work in cities, chains and most restaurants; carry cash for marshrutkas, markets, mountain guesthouses and small churches' candle stalls.",
    "Tipping: 10% is appreciated when no service charge is added; round up taxis."
  ],
  ka: [
    "ვალუტა: ლარი (GEL, ₾). 1 USD ≈ 2.7 ₾, 1 EUR ≈ 3.1 ₾ (კურსი შეამოწმე).",
    "ბანკომატები (საქართველოს ბანკი, თიბისი, ლიბერთი) ქალაქებში ყველგანაა. გადამცვლელი პუნქტები ცენტრში აეროპორტზე უკეთეს კურსს იძლევა.",
    "ბარათი ქალაქებში, ქსელებსა და რესტორნების უმეტესობაში მუშაობს; ნაღდი ფული სამარშრუტოსთვის, ბაზრისთვის, მთის სასტუმროებისთვის.",
    "ჩაი: 10% მისასალმებელია, თუ მომსახურება არ არის დამატებული; ტაქსში დაამრგვალე."
  ],
  ru: [
    "Валюта: грузинский лари (GEL, ₾). 1 USD ≈ 2,7 GEL, 1 EUR ≈ 3,1 GEL (проверьте текущий курс).",
    "Банкоматы (Bank of Georgia, TBC, Liberty) есть повсюду в городах. Обменники в центре дают курс лучше, чем в аэропорту.",
    "Карты работают в городах, сетях и большинстве ресторанов; наличные нужны для маршруток, рынков, горных гостевых домов.",
    "Чаевые: 10% приветствуются, если не включено обслуживание; в такси округляйте."
  ]
};

export const EMERGENCY = [
  { label: { en: "All emergencies (police, ambulance, fire) — English spoken", ka: "ერთიანი ნომერი (პოლიცია, სასწრაფო, სახანძრო)", ru: "Единый номер (полиция, скорая, пожарные) — говорят по-английски" }, number: "112" },
  { label: { en: "Georgian National Tourism Administration", ka: "ტურიზმის ეროვნული ადმინისტრაცია", ru: "Национальная администрация туризма" }, number: "0 800 800 909" }
];

export const ESSENTIALS = {
  en: [
    { k: "Visa", v: "Citizens of ~95 countries (EU, UK, US, Canada, Australia, Gulf states and more) enter visa-free for up to one year; others use the e-visa at evisa.gov.ge. Check your status before flying." },
    { k: "Time & power", v: "UTC+4 all year. 220 V, European type C/F plugs." },
    { k: "Water", v: "Tap water is safe in Tbilisi and most towns; bottled is cheap. Mountain springs are the local pride." },
    { k: "Language", v: "Georgian, with its own alphabet. English is common with younger people and in tourism; Russian is widely understood." },
    { k: "Safety", v: "Very low street crime. Main risks: traffic (cross carefully), mountain weather, and the occasional stray dog — most are vaccinated and tagged." },
    { k: "Driving", v: "Right-hand side. Georgian driving is assertive; roads to Svaneti, Tusheti and Vardzia need daylight and patience. Zero alcohol tolerance." },
    { k: "Getting around", v: "Marshrutkas (minibuses, 1–40 GEL) link everything; Bolt / Yandex Go taxis are cheap in cities; the Tbilisi metro costs 1 GEL." },
    { k: "Dress in churches", v: "Shoulders and knees covered; women cover their hair (scarves at the door). Men remove hats." }
  ],
  ka: [
    { k: "ვიზა", v: "~95 ქვეყნის მოქალაქე ერთ წლამდე უვიზოდ შემოდის; სხვებისთვის ელექტრონული ვიზა evisa.gov.ge-ზე. ფრენამდე შეამოწმე." },
    { k: "დრო და დენი", v: "UTC+4 მთელი წელი. 220 V, ევროპული C/F ჩამრთველი." },
    { k: "წყალი", v: "ონკანის წყალი თბილისსა და ქალაქების უმეტესობაში უსაფრთხოა; ბოთლის წყალი იაფია." },
    { k: "ენა", v: "ქართული, საკუთარი ანბანით. ინგლისური ახალგაზრდებსა და ტურიზმში გავრცელებულია; რუსული ფართოდ ესმით." },
    { k: "უსაფრთხოება", v: "ქუჩის დანაშაული ძალიან დაბალია. მთავარი რისკები: ტრანსპორტი, მთის ამინდი და მაწანწალა ძაღლები — უმეტესობა აცრილია." },
    { k: "მართვა", v: "მარჯვენამხრივი. გზები სვანეთში, თუშეთსა და ვარძიაში დღის სინათლესა და მოთმინებას მოითხოვს. ალკოჰოლი — ნულოვანი ტოლერანტობა." },
    { k: "გადაადგილება", v: "სამარშრუტოები (1–40 ₾) ყველაფერს აკავშირებს; Bolt / Yandex Go ქალაქებში იაფია; თბილისის მეტრო 1 ₾." },
    { k: "ჩაცმულობა ეკლესიაში", v: "დაფარული მხრები და მუხლები; ქალები თავს იფარავენ. მამაკაცები ქუდს იხდიან." }
  ],
  ru: [
    { k: "Виза", v: "Граждане ~95 стран въезжают без визы на срок до года; остальным — электронная виза на evisa.gov.ge. Проверьте до вылета." },
    { k: "Время и розетки", v: "UTC+4 круглый год. 220 В, европейские вилки C/F." },
    { k: "Вода", v: "Водопроводная вода безопасна в Тбилиси и большинстве городов; бутилированная дешёвая." },
    { k: "Язык", v: "Грузинский с собственным алфавитом. Английский распространён среди молодёжи и в туризме; русский понимают широко." },
    { k: "Безопасность", v: "Уличной преступности почти нет. Основные риски: дорожное движение, горная погода и бродячие собаки — большинство привиты." },
    { k: "Вождение", v: "Правостороннее. Дороги в Сванетию, Тушетию и Вардзию требуют светового дня и терпения. Алкоголь за рулём — ноль." },
    { k: "Передвижение", v: "Маршрутки (1–40 GEL) связывают всё; Bolt / Yandex Go в городах дёшевы; метро Тбилиси — 1 GEL." },
    { k: "Одежда в храмах", v: "Закрытые плечи и колени; женщины покрывают голову. Мужчины снимают головные уборы." }
  ]
};
