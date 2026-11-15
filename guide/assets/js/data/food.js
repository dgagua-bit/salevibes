/** Georgian cuisine: dishes, drinks, how a supra works, phrases and indicative prices (GEL, 2025–26). */
export const DISHES = [
  { id: "khinkali", name: { en: "Khinkali", ka: "ხინკალი", ru: "Хинкали" }, region: { en: "Mountains (Pshavi, Khevsureti, Mtiuleti)", ka: "მთა (ფშავი, ხევსურეთი, მთიულეთი)", ru: "Горы (Пшави, Хевсурети, Мтиулети)" }, veg: false, spicy: false, price: "1–2 each", icon: "🥟",
    desc: { en: "Pleated dumplings of spiced minced beef and pork (or lamb in the mountains) in a juicy broth. Also with cheese, mushrooms or potato.", ka: "ნაოჭებიანი ცომის პარკუჭები სანელებლიანი ხორცითა და წვნით; ასევე ყველით, სოკოთი ან კარტოფილით.", ru: "Мешочки из теста с пряным мясом и бульоном; также с сыром, грибами или картофелем." },
    how: { en: "Hold by the knob, bite a hole, drink the broth, then eat around the knob and leave it on the plate. Never use a knife. Black pepper, no sauce. Count your knobs at the end.", ka: "კუდით დაიჭირე, ჩამოკბიჩე, წვენი შესვი, შემდეგ კუდის ირგვლივ შეჭამე და კუდი თეფშზე დატოვე. დანას არ ხმარობენ. შავი პილპილი, სოუსი არა.", ru: "Держите за хвостик, надкусите, выпейте бульон, съешьте вокруг хвостика и оставьте его на тарелке. Без ножа и соуса — только чёрный перец." } },
  { id: "khachapuri-adjaruli", name: { en: "Adjarian khachapuri", ka: "აჭარული ხაჭაპური", ru: "Хачапури по-аджарски" }, region: { en: "Adjara (Batumi)", ka: "აჭარა (ბათუმი)", ru: "Аджария (Батуми)" }, veg: true, spicy: false, price: "12–25", icon: "🛶",
    desc: { en: "A boat-shaped bread filled with molten cheese, a raw egg yolk and a slab of butter stirred in at the table.", ka: "ნავის ფორმის პური გამდნარი ყველით, უმი კვერცხის გულითა და კარაქით, რომელსაც მაგიდაზე ურევენ.", ru: "Хлеб-лодочка с расплавленным сыром, сырым желтком и куском масла, которые перемешивают за столом." },
    how: { en: "Stir egg and butter into the cheese with a fork, then tear off the crust and dip. One per person is a full meal.", ka: "კვერცხი და კარაქი ჩანგლით ყველში აურიე, შემდეგ კიდე მოწყვიტე და ჩააწე. ერთი ადამიანზე სრული კერძია.", ru: "Размешайте яйцо и масло в сыре вилкой, отрывайте корку и макайте. Одна штука — полноценный обед." } },
  { id: "khachapuri-imeruli", name: { en: "Imeretian & Megrelian khachapuri", ka: "იმერული და მეგრული ხაჭაპური", ru: "Хачапури по-имеретински и по-мегрельски" }, region: { en: "Imereti, Samegrelo — everywhere", ka: "იმერეთი, სამეგრელო — ყველგან", ru: "Имеретия, Мегрелия — повсюду" }, veg: true, spicy: false, price: "10–20", icon: "🫓",
    desc: { en: "The round cheese bread. Imeruli has cheese inside; Megruli adds more on top. The national comfort food, served at every meal.", ka: "მრგვალი ყველიანი პური. იმერულს ყველი შიგნით აქვს; მეგრულს ზემოდანაც. ყოველ სუფრაზეა.", ru: "Круглый хлеб с сыром. У имеретинского сыр внутри, у мегрельского — ещё и сверху. Подают к каждой трапезе." },
    how: { en: "Cut in wedges, eat hot. Lobiani is the same bread with bean filling — great for the road.", ka: "ნაჭრებად დაჭერი, ცხელი შეჭამე. ლობიანი იგივე პურია ლობიოს გულსართით — გზისთვის იდეალური.", ru: "Режут на сектора, едят горячим. Лобиани — тот же хлеб с фасолью, идеален в дорогу." } },
  { id: "mtsvadi", name: { en: "Mtsvadi (shashlik)", ka: "მწვადი", ru: "Мцвади (шашлык)" }, region: { en: "Everywhere; best in Kakheti", ka: "ყველგან; საუკეთესო კახეთში", ru: "Повсюду; лучший в Кахетии" }, veg: false, spicy: false, price: "18–35", icon: "🍢",
    desc: { en: "Chunks of pork (or veal) grilled on vine cuttings, served with raw onion, pomegranate seeds and tkemali plum sauce.", ka: "ღორის (ან ხბოს) ნაჭრები ვაზის ლერწზე შემწვარი, ხახვით, ბროწეულითა და ტყემლით.", ru: "Куски свинины (или телятины) на виноградной лозе, с луком, гранатом и соусом ткемали." },
    how: { en: "Wrap in shotis puri bread with onion and dip in tkemali. Order by the portion (usually 250–300 g).", ka: "შოთის პურში ხახვით გაახვიე და ტყემალში ჩააწე. პორციით შეუკვეთე (250–300 გ).", ru: "Заверните в шоти с луком, макайте в ткемали. Заказывают порциями (250–300 г)." } },
  { id: "pkhali", name: { en: "Pkhali", ka: "ფხალი", ru: "Пхали" }, region: { en: "Everywhere", ka: "ყველგან", ru: "Повсюду" }, veg: true, spicy: false, price: "8–15", icon: "🟢",
    desc: { en: "Chopped spinach, beetroot leaves or green beans mixed with walnut paste, garlic, coriander and vinegar, shaped into balls and topped with pomegranate.", ka: "ისპანახი, ჭარხლის ფოთოლი ან მწვანე ლობიო ნიგვზით, ნივრით, ქინძითა და ძმრით, ბურთულებად, ბროწეულით.", ru: "Шпинат, свекольная ботва или фасоль с ореховой пастой, чесноком, кинзой и уксусом, в виде шариков с гранатом." },
    how: { en: "Order an assorted plate (pkhali asorti) as the first thing on the table. Spread on bread.", ka: "ასორტი შეუკვეთე სუფრის დასაწყისში. პურზე წაუსვი.", ru: "Закажите ассорти в начале. Намазывайте на хлеб." } },
  { id: "badrijani", name: { en: "Badrijani nigvzit", ka: "ბადრიჯანი ნიგვზით", ru: "Баклажаны с орехами" }, region: { en: "Everywhere", ka: "ყველგან", ru: "Повсюду" }, veg: true, spicy: false, price: "10–16", icon: "🍆",
    desc: { en: "Fried aubergine slices rolled around a walnut, garlic and herb paste, dotted with pomegranate seeds. Georgia's best cold starter.", ka: "შემწვარი ბადრიჯანის ფირფიტები ნიგვზის, ნივრისა და მწვანილის პასტით გახვეული, ბროწეულით. საუკეთესო ცივი კერძი.", ru: "Обжаренные ломтики баклажана, свёрнутые с ореховой пастой с чесноком и зеленью, с гранатом. Лучшая холодная закуска." },
    how: { en: "Eat cold with bread; pairs with a dry amber wine.", ka: "ცივი შეჭამე პურით; ქარვისფერ მშრალ ღვინოს უხდება.", ru: "Едят холодным с хлебом; хорошо с сухим янтарным вином." } },
  { id: "lobio", name: { en: "Lobio", ka: "ლობიო", ru: "Лобио" }, region: { en: "Everywhere; Racha and Mtskheta famous", ka: "ყველგან; რაჭა და მცხეთა ცნობილია", ru: "Повсюду; Рача и Мцхета славятся им" }, veg: true, spicy: true, price: "8–14", icon: "🫘",
    desc: { en: "Red kidney beans stewed with coriander, garlic, onion and spices, served bubbling in a clay pot with cornbread (mchadi) and pickles.", ka: "წითელი ლობიო ქინძით, ნივრით, ხახვითა და სუნელებით, ქოთანში ადუღებული, მჭადითა და მწნილით.", ru: "Красная фасоль с кинзой, чесноком, луком и специями, кипящая в глиняном горшке, с мчади и соленьями." },
    how: { en: "Crumble mchadi into it; add pickled jonjoli flowers. A full vegetarian meal for a few GEL.", ka: "მჭადი ჩაფშვენი; ჯონჯოლი მიაყოლე. სრული ვეგეტარიანული სადილი რამდენიმე ლარად.", ru: "Крошите мчади в горшок; добавьте маринованные джонджоли. Сытный вегетарианский обед за копейки." } },
  { id: "kharcho", name: { en: "Kharcho", ka: "ხარჩო", ru: "Харчо" }, region: { en: "Samegrelo (walnut version), Tbilisi (soup)", ka: "სამეგრელო (ნიგვზიანი), თბილისი (წვნიანი)", ru: "Мегрелия (с орехами), Тбилиси (суп)" }, veg: false, spicy: true, price: "12–20", icon: "🍲",
    desc: { en: "Two dishes share the name: a thick beef and rice soup with sour plum, and the Mingrelian stew of beef in a rich walnut sauce.", ka: "ორი კერძი ერთი სახელით: სქელი საქონლის ხორცისა და ბრინჯის წვნიანი ტყემლით, და მეგრული ნიგვზიანი ხარჩო.", ru: "Два блюда с одним названием: густой суп из говядины с рисом и ткемали, и мегрельское рагу в ореховом соусе." },
    how: { en: "The Mingrelian one comes with elarji or ghomi (cornmeal) to soak up the sauce.", ka: "მეგრულს ელარჯი ან ღომი მოყვება სოუსისთვის.", ru: "Мегрельское подают с эларджи или гоми (кукурузная каша) для соуса." } },
  { id: "chakapuli", name: { en: "Chakapuli", ka: "ჩაქაფული", ru: "Чакапули" }, region: { en: "Kakheti; spring dish", ka: "კახეთი; საგაზაფხულო", ru: "Кахетия; весеннее блюдо" }, veg: false, spicy: false, price: "18–30", icon: "🌿",
    desc: { en: "Lamb (or veal) stewed in white wine with tarragon, green plums and heaps of herbs. The taste of Georgian spring, essential at Easter.", ka: "ბატკანი (ან ხბო) თეთრ ღვინოში ტარხუნით, მწვანე ტყემლითა და ბლომად მწვანილით. ქართული გაზაფხულის გემო, აღდგომის კერძი.", ru: "Баранина (или телятина) в белом вине с тархуном, зелёной алычой и горой зелени. Вкус грузинской весны." },
    how: { en: "April–June only, when green tkemali plums are in season. Eat with bread and the broth.", ka: "მხოლოდ აპრილი–ივნისი, მწვანე ტყემლის სეზონზე. პურითა და წვნით.", ru: "Только апрель–июнь, в сезон зелёной алычи. С хлебом и бульоном." } },
  { id: "ojakhuri", name: { en: "Ojakhuri", ka: "ოჯახური", ru: "Оджахури" }, region: { en: "Everywhere", ka: "ყველგან", ru: "Повсюду" }, veg: false, spicy: false, price: "15–25", icon: "🍳",
    desc: { en: "\"Family-style\": fried pork with roast potatoes, onion and herbs served sizzling on a clay plate (ketsi).", ka: "შემწვარი ღორის ხორცი კარტოფილით, ხახვითა და მწვანილით, ცხელ კეცზე.", ru: "«По-семейному»: жареная свинина с картофелем, луком и зеленью на горячей кеци." },
    how: { en: "A safe, filling choice in any roadside restaurant.", ka: "უსაფრთხო, დამანაყრებელი არჩევანი ნებისმიერ გზისპირა რესტორანში.", ru: "Надёжный сытный выбор в любом придорожном ресторане." } },
  { id: "kubdari", name: { en: "Kubdari", ka: "კუბდარი", ru: "Кубдари" }, region: { en: "Svaneti", ka: "სვანეთი", ru: "Сванетия" }, veg: false, spicy: true, price: "12–20", icon: "🥧",
    desc: { en: "The Svan meat pie: chopped beef or pork with onion, Svan salt and fenugreek baked inside bread. Hikers' fuel.", ka: "სვანური ხორციანი ღვეზელი: დაკეპილი ხორცი ხახვით, სვანური მარილითა და უცხო სუნელით. მოლაშქრეების საწვავი.", ru: "Сванский мясной пирог: рубленая говядина или свинина с луком, сванской солью и пажитником. Топливо для походов." },
    how: { en: "Only good hot from the oven; buy Svan salt (spiced salt) to take home.", ka: "მხოლოდ ცხელი, ღუმელიდან; სვანური მარილი სახლში წაიღე.", ru: "Вкусен только горячим; купите сванскую соль домой." } },
  { id: "elarji", name: { en: "Elarji & gebzhalia", ka: "ელარჯი და გებჟალია", ru: "Эларджи и гебжалия" }, region: { en: "Samegrelo", ka: "სამეგრელო", ru: "Мегрелия" }, veg: true, spicy: false, price: "10–18", icon: "🧀",
    desc: { en: "Elarji: cornmeal porridge beaten with so much sulguni cheese it stretches a metre. Gebzhalia: cheese rolls in mint and yogurt sauce.", ka: "ელარჯი: ღომი იმდენი სულგუნით, რომ მეტრზე იწელება. გებჟალია: ყველის რულეტები პიტნიან მაწონში.", ru: "Эларджи: кукурузная каша с таким количеством сулугуни, что тянется на метр. Гебжалия: сырные рулетики в мятно-йогуртовом соусе." },
    how: { en: "Elarji is a performance — ask them to lift it with a fork. Try in Zugdidi or Martvili.", ka: "ელარჯი სანახაობაა — ჩანგლით ამოწევა სთხოვე. ზუგდიდში ან მარტვილში სცადე.", ru: "Эларджи — это шоу: попросите поднять вилкой. Пробуйте в Зугдиди или Мартвили." } },
  { id: "satsivi", name: { en: "Satsivi", ka: "საცივი", ru: "Сациви" }, region: { en: "West Georgia; New Year dish", ka: "დასავლეთ საქართველო; საახალწლო", ru: "Западная Грузия; новогоднее блюдо" }, veg: false, spicy: false, price: "15–25", icon: "🦃",
    desc: { en: "Turkey or chicken in a cold, thick walnut sauce with garlic, coriander and saffron-like marigold.", ka: "ინდაური ან ქათამი ცივ, სქელ ნიგვზის სოუსში ნივრით, ქინძითა და ზაფრანით.", ru: "Индейка или курица в холодном густом ореховом соусе с чесноком, кинзой и имеретинским шафраном." },
    how: { en: "Served cold, often on New Year's Eve; order it where the walnuts are fresh (autumn–winter).", ka: "ცივად, ხშირად ახალ წელს; იქ შეუკვეთე, სადაც ნიგოზი ახალია (შემოდგომა–ზამთარი).", ru: "Подают холодным, часто на Новый год; заказывайте там, где свежие орехи (осень–зима)." } },
  { id: "chikhirtma", name: { en: "Chikhirtma", ka: "ჩიხირთმა", ru: "Чихиртма" }, region: { en: "Everywhere", ka: "ყველგან", ru: "Повсюду" }, veg: false, spicy: false, price: "10–15", icon: "🥣",
    desc: { en: "Chicken soup thickened with egg and vinegar, with coriander — the official Georgian hangover cure after a supra.", ka: "ქათმის წვნიანი კვერცხითა და ძმრით, ქინძით — ოფიციალური წამალი სუფრის შემდეგ.", ru: "Куриный суп, загущённый яйцом и уксусом, с кинзой — официальное средство от похмелья после супры." },
    how: { en: "Breakfast the morning after. Khashi (tripe soup, eaten at dawn with vodka and garlic) is the hardcore version.", ka: "მეორე დილის საუზმე. ხაში (გამთენიისას, არყითა და ნივრით) — მძიმე ვერსია.", ru: "Завтрак на следующее утро. Хаши (суп из рубца на рассвете с водкой и чесноком) — версия для сильных." } },
  { id: "shotis-puri", name: { en: "Shotis puri & tone bread", ka: "შოთის პური", ru: "Шоти" }, region: { en: "Everywhere", ka: "ყველგან", ru: "Повсюду" }, veg: true, spicy: false, price: "1–2", icon: "🥖",
    desc: { en: "Canoe-shaped bread slapped onto the wall of a clay tone oven. Sold hot from hatches in every neighbourhood.", ka: "კანოეს ფორმის პური თონის კედელზე მიკრული. ცხელი იყიდება ყოველ უბანში.", ru: "Хлеб в форме каноэ, приклеенный к стенке глиняной печи тоне. Продаётся горячим в каждом квартале." },
    how: { en: "Buy one for ~1 GEL, tear, eat walking. Watch the baker lean into the oven.", ka: "~1 ₾-ად იყიდე, მოწყვიტე, სიარულისას შეჭამე. მცხობელს უყურე.", ru: "Купите за ~1 GEL, отрывайте и ешьте на ходу. Посмотрите, как пекарь ныряет в печь." } },
  { id: "churchkhela", name: { en: "Churchkhela", ka: "ჩურჩხელა", ru: "Чурчхела" }, region: { en: "Kakheti, Imereti", ka: "კახეთი, იმერეთი", ru: "Кахетия, Имеретия" }, veg: true, spicy: false, price: "3–6 each", icon: "🍇",
    desc: { en: "Walnuts or hazelnuts on a string, dipped in thickened grape juice (tatara) and dried — the \"Georgian Snickers\". Tklapi is the same juice dried flat.", ka: "ნიგოზი ან თხილი ძაფზე, თათარაში ამოვლებული და გამხმარი. ტყლაპი — იგივე წვენი ბრტყლად გამხმარი.", ru: "Орехи на нитке в загущённом виноградном соке (татара), высушенные — «грузинский сникерс». Тклапи — тот же сок, высушенный пластом." },
    how: { en: "The dull, matte ones are the good ones; shiny means added sugar or flour. Keeps for months.", ka: "მქრქალი უკეთესია; პრიალა — დამატებული შაქარი ან ფქვილი. თვეობით ინახება.", ru: "Матовые — настоящие; блестящие — с сахаром или мукой. Хранится месяцами." } },
  { id: "ajapsandali", name: { en: "Ajapsandali", ka: "აჯაფსანდალი", ru: "Аджапсандали" }, region: { en: "Everywhere; summer", ka: "ყველგან; ზაფხული", ru: "Повсюду; лето" }, veg: true, spicy: true, price: "9–14", icon: "🫑",
    desc: { en: "Summer stew of aubergine, peppers, tomato, potato and lots of basil and coriander. Served warm or cold.", ka: "საზაფხულო ჩაშუშული: ბადრიჯანი, წიწაკა, პომიდორი, კარტოფილი, ბლომად რეჰანი და ქინძი.", ru: "Летнее рагу из баклажанов, перца, томатов, картофеля с базиликом и кинзой. Тёплым или холодным." },
    how: { en: "Vegan by default. Ask for \"uxorcho\" (without meat) for any dish to be sure.", ka: "ვეგანურია. „უხორცო“ სთხოვე ნებისმიერ კერძზე დასაზუსტებლად.", ru: "Веганское по умолчанию. Для любого блюда просите «ухорчо» (без мяса)." } },
  { id: "khabizgina", name: { en: "Khabizgina & kada", ka: "ხაბიზგინა და ქადა", ru: "Хабизгина и када" }, region: { en: "Kazbegi / Khevi", ka: "ყაზბეგი / ხევი", ru: "Казбеги / Хеви" }, veg: true, spicy: false, price: "8–12", icon: "🥔",
    desc: { en: "Mountain bread stuffed with cheese and potato (khabizgina), and kada, a flaky pastry with a sweet or savoury butter-flour filling, for the road.", ka: "მთის პური ყველითა და კარტოფილით (ხაბიზგინა) და ქადა — ფენოვანი, ტკბილი ან მარილიანი გულსართით, გზისთვის.", ru: "Горный хлеб с сыром и картофелем (хабизгина) и када — слоёная выпечка со сладкой или солёной начинкой в дорогу." },
    how: { en: "Find them in Stepantsminda and at the Jvari Pass stalls.", ka: "სტეფანწმინდასა და ჯვრის უღელტეხილის დახლებზე.", ru: "Ищите в Степанцминде и на лотках Крестового перевала." } },
  { id: "pelamushi", name: { en: "Pelamushi & honey-nut sweets", ka: "ფელამუში და ტკბილეული", ru: "Пеламуши и сладости" }, region: { en: "Kakheti, Imereti", ka: "კახეთი, იმერეთი", ru: "Кахетия, Имеретия" }, veg: true, spicy: false, price: "5–10", icon: "🍮",
    desc: { en: "Grape-juice pudding set with flour, served cold with walnuts; gozinaki (honey-walnut brittle) at New Year; nazuki sweet bread from the Surami roadside.", ka: "ყურძნის წვენის პუდინგი ფქვილით, ცივად ნიგვზით; გოზინაყი ახალ წელს; ნაზუქი სურამიდან.", ru: "Пудинг из виноградного сока с мукой, холодный с орехами; гозинаки на Новый год; сладкий хлеб назуки с обочины в Сурами." },
    how: { en: "Georgian desserts are few — fruit and wine usually end the meal.", ka: "ქართული დესერტი ცოტაა — სუფრა ხილითა და ღვინით მთავრდება.", ru: "Десертов в Грузии немного — трапезу обычно завершают фрукты и вино." } }
];

export const DRINKS = [
  { id: "qvevri", name: { en: "Qvevri wine (amber & red)", ka: "ქვევრის ღვინო", ru: "Вино из квеври" }, icon: "🏺",
    desc: { en: "Wine fermented with skins in buried clay vessels — the 8,000-year-old method on UNESCO's heritage list. White grapes become amber, tannic, nutty; look for Rkatsiteli, Kisi, Mtsvane (amber) and Saperavi (deep red).", ka: "ქვევრში ჭაჭაზე დადუღებული ღვინო — 8000 წლის მეთოდი UNESCO-ს სიაში. რქაწითელი, ქისი, მწვანე (ქარვისფერი) და საფერავი (წითელი).", ru: "Вино, сброженное с кожицей в закопанных глиняных сосудах — метод возрастом 8000 лет из списка ЮНЕСКО. Ищите Ркацители, Киси, Мцване (янтарные) и Саперави (красное)." } },
  { id: "semisweet", name: { en: "Semi-sweet reds: Kindzmarauli, Khvanchkara", ka: "ნახევრადტკბილი: ქინძმარაული, ხვანჭკარა", ru: "Полусладкие: Киндзмараули, Хванчкара" }, icon: "🍷",
    desc: { en: "Naturally semi-sweet reds from Kvareli and Racha, Stalin's favourite. Buy from wineries or supermarkets, not from stalls.", ka: "ბუნებრივად ნახევრადტკბილი წითელი ყვარლიდან და რაჭიდან. მარნებში ან სუპერმარკეტში იყიდე, დახლებზე არა.", ru: "Природно-полусладкие красные из Кварели и Рачи, любимые Сталиным. Покупайте на винодельнях или в супермаркетах, не с лотков." } },
  { id: "chacha", name: { en: "Chacha", ka: "ჭაჭა", ru: "Чача" }, icon: "🥃",
    desc: { en: "Grape pomace brandy, 45–65%. Homemade in every village; one shot after a meal is polite, three is a commitment.", ka: "ჭაჭის არაყი, 45–65%. ყველა სოფელში სახლში ხდიან; ერთი ჭიქა ჭამის შემდეგ ზრდილობაა, სამი — ვალდებულება.", ru: "Виноградный самогон, 45–65%. Домашний в каждом селе; одна рюмка после еды — вежливость, три — обязательство." } },
  { id: "lemonade", name: { en: "Lemonades & mineral water", ka: "ლიმონათი და მინერალური წყალი", ru: "Лимонады и минеральная вода" }, icon: "🥤",
    desc: { en: "Tarragon (tarkhuna, bright green), pear and cream-soda lemonades by Natakhtari, Zedazeni or Lagidze; Borjomi (salty, volcanic), Nabeghlavi and Likani mineral waters.", ka: "ტარხუნა, მსხალი და კრემ-სოდა — ნატახტარი, ზედაზენი, ლაღიძე; ბორჯომი, ნაბეღლავი, ლიკანი.", ru: "Тархун (ярко-зелёный), грушевый и крем-сода от Натахтари, Зедазени или Лагидзе; минеральные воды Боржоми, Набеглави, Ликани." } },
  { id: "beer", name: { en: "Beer & tea", ka: "ლუდი და ჩაი", ru: "Пиво и чай" }, icon: "🍺",
    desc: { en: "Natakhtari, Zedazeni, Kazbegi lagers; craft beer in Tbilisi. Georgia grew the USSR's tea — Guria and Adjara still do; try it in Batumi.", ka: "ნატახტარი, ზედაზენი, ყაზბეგი; კრაფტი თბილისში. გურია და აჭარა ჩაის დღესაც აწარმოებს.", ru: "Лагеры Натахтари, Зедазени, Казбеги; крафт в Тбилиси. Гурия и Аджария до сих пор выращивают чай — попробуйте в Батуми." } }
];

export const SUPRA = {
  en: [
    "A supra is a feast led by a tamada (toastmaster). Toasts come in a set order: to God/peace, to Georgia, to the hosts, to family, to those who passed, to love, to the guests.",
    "Don't sip wine between toasts — drink when the toast is made. You may drink less; say \"gaumarjos\" (victory) and sip.",
    "Dishes arrive in waves and pile on top of each other. Nobody expects you to finish; leaving food is normal.",
    "Say \"madloba\" (thank you) to the host, and toast them back once if you can — it will be loved.",
    "Restaurants add a 10–15% service charge; tip a little extra for great service. Cards are accepted nearly everywhere except villages."
  ],
  ka: [
    "სუფრას თამადა უძღვება. სადღეგრძელოებს რიგი აქვს: ღმერთს/მშვიდობას, საქართველოს, მასპინძლებს, ოჯახს, გარდაცვლილებს, სიყვარულს, სტუმრებს.",
    "სადღეგრძელოებს შორის ღვინოს არ სვამენ — სადღეგრძელოზე სვამენ. ნაკლები შეგიძლია; თქვი „გაუმარჯოს“ და მოსვი.",
    "კერძები ტალღებად მოდის და ერთმანეთს ადევს. არავინ ელის, რომ ყველაფერს შეჭამ.",
    "მასპინძელს „მადლობა“ უთხარი და ერთხელ მაინც თვითონ თქვი სადღეგრძელო — ძალიან მოეწონებათ.",
    "რესტორნები 10–15% მომსახურებას ამატებენ; კარგი მომსახურებისთვის ცოტა დაამატე. ბარათი სოფლების გარდა თითქმის ყველგან მიიღება."
  ],
  ru: [
    "Супра — застолье во главе с тамадой. Тосты идут в порядке: за Бога/мир, за Грузию, за хозяев, за семью, за ушедших, за любовь, за гостей.",
    "Не пейте вино между тостами — пьют на тост. Можно меньше: скажите «гаумарджос» и пригубите.",
    "Блюда приходят волнами и ставятся друг на друга. Никто не ждёт, что вы всё съедите.",
    "Скажите хозяину «мадлоба» (спасибо) и хотя бы раз поднимите тост сами — это оценят.",
    "Рестораны добавляют 10–15% за обслуживание; за отличный сервис оставьте немного сверху. Карты принимают почти везде, кроме сёл."
  ]
};

export const PHRASES = [
  { en: "Hello", ka: "გამარჯობა", tr: "gamarjoba", ru: "Здравствуйте" },
  { en: "Thank you", ka: "მადლობა", tr: "madloba", ru: "Спасибо" },
  { en: "Please / you're welcome", ka: "ინებეთ / არაფრის", tr: "inebet / arapris", ru: "Пожалуйста" },
  { en: "Yes / No", ka: "კი / არა", tr: "ki / ara", ru: "Да / Нет" },
  { en: "How much is it?", ka: "რა ღირს?", tr: "ra ghirs?", ru: "Сколько стоит?" },
  { en: "The bill, please", ka: "ანგარიში, თუ შეიძლება", tr: "angarishi, tu sheidzleba", ru: "Счёт, пожалуйста" },
  { en: "Delicious!", ka: "გემრიელია!", tr: "gemrielia!", ru: "Вкусно!" },
  { en: "Cheers! (to victory)", ka: "გაუმარჯოს!", tr: "gaumarjos!", ru: "За здоровье!" },
  { en: "Without meat", ka: "უხორცო", tr: "ukhortso", ru: "Без мяса" },
  { en: "Not spicy", ka: "არა ცხარე", tr: "ara tskhare", ru: "Не острое" },
  { en: "Water", ka: "წყალი", tr: "tsqali", ru: "Вода" },
  { en: "Where is…?", ka: "სად არის…?", tr: "sad aris…?", ru: "Где…?" },
  { en: "I don't understand", ka: "არ მესმის", tr: "ar mesmis", ru: "Я не понимаю" },
  { en: "Goodbye", ka: "ნახვამდის", tr: "nakhvamdis", ru: "До свидания" }
];

export const PRICES = [
  { item: { en: "Khinkali (each)", ka: "ხინკალი (ცალი)", ru: "Хинкали (шт.)" }, gel: "1–2" },
  { item: { en: "Khachapuri", ka: "ხაჭაპური", ru: "Хачапури" }, gel: "10–25" },
  { item: { en: "Main course", ka: "მთავარი კერძი", ru: "Основное блюдо" }, gel: "15–35" },
  { item: { en: "Glass of house wine", ka: "ჭიქა ღვინო", ru: "Бокал домашнего вина" }, gel: "6–15" },
  { item: { en: "Bottle of wine (shop)", ka: "ბოთლი ღვინო (მაღაზია)", ru: "Бутылка вина (магазин)" }, gel: "15–40" },
  { item: { en: "Coffee", ka: "ყავა", ru: "Кофе" }, gel: "5–10" },
  { item: { en: "Dinner for two with wine", ka: "ვახშამი ორზე ღვინით", ru: "Ужин на двоих с вином" }, gel: "80–150" },
  { item: { en: "Guesthouse half board (per person)", ka: "საოჯახო სასტუმრო ნახევარპანსიონით", ru: "Гостевой дом с полупансионом (чел.)" }, gel: "70–120" }
];
