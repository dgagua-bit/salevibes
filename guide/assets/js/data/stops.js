/**
 * Places to stop, rest and eat along the routes. Independent picks; no venue paid to be listed.
 * kind: restaurant | cafe | winery | rest | market | bakery | viewpoint | guesthouse
 * price: 1 (cheap) – 3 (expensive). `near` links to a place id for "eat nearby".
 * Opening hours are deliberately not stated — the UI links to Google Maps for current info.
 */
export const STOPS = [
  /* Tbilisi */
  { id: "shavi-lomi", name: { en: "Shavi Lomi", ka: "შავი ლომი" }, kind: "restaurant", lat: 41.7080, lng: 44.7995, near: "fabrika", area: { en: "Tbilisi, Marjanishvili", ka: "თბილისი, მარჯანიშვილი" }, price: 2,
    desc: { en: "Modern Georgian cooking in an old house with a courtyard: pkhali plates, chakapuli in spring, good natural wine list.", ka: "თანამედროვე ქართული სამზარეულო ძველ ეზოიან სახლში: ფხალი, გაზაფხულზე ჩაქაფული, კარგი ბუნებრივი ღვინოების სია." }, specials: ["pkhali", "chakapuli", "wine"] },
  { id: "barbarestan", name: { en: "Barbarestan", ka: "ბარბარესთან" }, kind: "restaurant", lat: 41.7120, lng: 44.8000, near: "fabrika", area: { en: "Tbilisi, Aghmashenebeli Ave", ka: "თბილისი, აღმაშენებლის გამზ." }, price: 3,
    desc: { en: "Dishes recreated from a 19th-century Georgian cookbook by Barbare Jorjadze; book ahead.", ka: "ბარბარე ჯორჯაძის XIX საუკუნის სამზარეულო წიგნიდან აღდგენილი კერძები; წინასწარ დაჯავშნე." }, specials: ["history", "wine"] },
  { id: "cafe-leila", name: { en: "Café Leila", ka: "კაფე ლეილა" }, kind: "cafe", lat: 41.6912, lng: 44.8077, near: "narikala", area: { en: "Tbilisi, Old Town", ka: "თბილისი, ძველი ქალაქი" }, price: 2,
    desc: { en: "Vegetarian café with painted ceilings next to Sioni — pkhali, lobio, badrijani, herbal teas.", ka: "ვეგეტარიანული კაფე მოხატული ჭერით სიონთან — ფხალი, ლობიო, ბადრიჯანი, მცენარეული ჩაი." }, specials: ["vegetarian"] },
  { id: "zakhar", name: { en: "Zakhar Zakharich", ka: "ზახარ ზახარიჩი" }, kind: "restaurant", lat: 41.7010, lng: 44.7955, near: "drybridge", area: { en: "Tbilisi, by the Dry Bridge", ka: "თბილისი, მშრალ ხიდთან" }, price: 1,
    desc: { en: "No-frills khinkali hall open late; the classic place to learn how to eat them.", ka: "უბრალო ხინკლის სახლი, გვიანობამდე ღიაა; კლასიკური ადგილი ხინკლის ჭამის სასწავლად." }, specials: ["khinkali"] },
  { id: "stamba", name: { en: "Café Stamba", ka: "კაფე სტამბა" }, kind: "cafe", lat: 41.7070, lng: 44.7870, near: "natmuseum", area: { en: "Tbilisi, Kostava St", ka: "თბილისი, კოსტავას ქ." }, price: 2,
    desc: { en: "All-day café in a former printing house: breakfast, coffee, work-friendly, a courtyard.", ka: "მთელი დღის კაფე ყოფილ სტამბაში: საუზმე, ყავა, სამუშაოდ მოსახერხებელი, ეზო." }, specials: ["coffee", "breakfast"] },
  { id: "dezerter", name: { en: "Dezerter Bazaar", ka: "დეზერტირების ბაზარი" }, kind: "market", lat: 41.7205, lng: 44.7960, near: "fabrika", area: { en: "Tbilisi, Station Square", ka: "თბილისი, სადგურის მოედანი" }, price: 1,
    desc: { en: "The city's main food market: cheese, spices, churchkhela, tklapi, walnuts, fruit. Best in the morning.", ka: "ქალაქის მთავარი სასურსათო ბაზარი: ყველი, სანელებლები, ჩურჩხელა, ტყლაპი, ნიგოზი, ხილი. დილით საუკეთესოა." }, specials: ["market"] },
  { id: "meidan-tone", name: { en: "Tone bakeries at Meidan", ka: "თონეები მეიდანთან" }, kind: "bakery", lat: 41.6890, lng: 44.8095, near: "abanotubani", area: { en: "Tbilisi, Meidan", ka: "თბილისი, მეიდანი" }, price: 1,
    desc: { en: "Watch shotis puri slapped onto the walls of a clay tone oven; buy it hot for ~1 GEL.", ka: "ნახე, როგორ აკრავენ შოთის პურს თონის კედელზე; ცხელი იყიდე ~1 ₾-ად." }, specials: ["bread"] },

  /* Mtskheta & the Military Highway */
  { id: "salobie", name: { en: "Salobie (lobio house)", ka: "სალობიე" }, kind: "restaurant", lat: 41.8250, lng: 44.7190, near: "svetitskhoveli", area: { en: "Mtskheta road", ka: "მცხეთის გზა" }, price: 1,
    desc: { en: "A 1960s institution on the Tbilisi–Mtskheta road: lobio in clay pots, mchadi, pickles, nothing else needed.", ka: "1960-იანების ინსტიტუცია თბილისი–მცხეთის გზაზე: ლობიო ქოთანში, მჭადი, მწნილი — სხვა არაფერი სჭირდება." }, specials: ["lobio"] },
  { id: "ananuri-stalls", name: { en: "Ananuri lakeside stalls", ka: "ანანურის დახლები" }, kind: "rest", lat: 42.1640, lng: 44.7040, near: "ananuri", area: { en: "Ananuri car park", ka: "ანანურის ავტოსადგომი" }, price: 1,
    desc: { en: "Toilets, coffee, churchkhela, honey and a view of the reservoir — the standard first break out of Tbilisi.", ka: "ტუალეტი, ყავა, ჩურჩხელა, თაფლი და წყალსაცავის ხედი — სტანდარტული პირველი შესვენება თბილისიდან." }, specials: ["rest"] },
  { id: "pasanauri", name: { en: "Pasanauri khinkali", ka: "ფასანაურის ხინკალი" }, kind: "restaurant", lat: 42.3500, lng: 44.6890, near: "ananuri", area: { en: "Pasanauri village", ka: "სოფელი ფასანაური" }, price: 1,
    desc: { en: "The village where mountain khinkali comes from; several roadside restaurants serve them hand-made with mutton and beef.", ka: "სოფელი, საიდანაც მთის ხინკალი მოდის; რამდენიმე გზისპირა რესტორანი ხელით გაკეთებულ ხინკალს აწვდის." }, specials: ["khinkali"] },
  { id: "jvari-pass-tea", name: { en: "Jvari Pass tea stalls", ka: "ჯვრის უღელტეხილი — ჩაი" }, kind: "rest", lat: 42.5050, lng: 44.4550, near: "friendship", area: { en: "Jvari Pass, 2,395 m", ka: "ჯვრის უღელტეხილი, 2395 მ" }, price: 1,
    desc: { en: "Hot tea, churchkhela and mineral springs at the top of the pass. A 10-minute leg-stretch with big views.", ka: "ცხელი ჩაი, ჩურჩხელა და მინერალური წყაროები უღელტეხილის თავზე. 10 წუთი ფეხის გასაშლელად დიდი ხედებით." }, specials: ["rest"] },
  { id: "rooms-terrace", name: { en: "Rooms Hotel terrace, Kazbegi", ka: "Rooms Hotel-ის ტერასა" }, kind: "cafe", lat: 42.6520, lng: 44.6350, near: "stepantsminda", area: { en: "Stepantsminda", ka: "სტეფანწმინდა" }, price: 3,
    desc: { en: "Pay for a coffee, get the famous terrace view of Gergeti and Kazbek. Non-guests welcome.", ka: "ყავის ფასად გერგეთისა და მყინვარწვერის ცნობილი ხედი ტერასიდან. არასტუმრებიც შედიან." }, specials: ["view", "coffee"] },
  { id: "kazbegi-guesthouses", name: { en: "Stepantsminda family restaurants", ka: "სტეფანწმინდის საოჯახო რესტორნები" }, kind: "restaurant", lat: 42.6575, lng: 44.6430, near: "stepantsminda", area: { en: "Stepantsminda centre", ka: "სტეფანწმინდის ცენტრი" }, price: 1,
    desc: { en: "Around the main square: khinkali, trout, kada pastry and khabizgina (cheese-potato pie) — the Mokheve mountain classics.", ka: "მთავარი მოედნის ირგვლივ: ხინკალი, კალმახი, ქადა და ხაბიზგინა — მოხევური კლასიკა." }, specials: ["khinkali", "trout"] },

  /* Kakheti */
  { id: "pheasants-tears", name: { en: "Pheasant's Tears", ka: "ხოხბის ცრემლები" }, kind: "winery", lat: 41.6195, lng: 45.9230, near: "sighnaghi", area: { en: "Sighnaghi", ka: "სიღნაღი" }, price: 2,
    desc: { en: "The winery that put Georgian natural qvevri wine on the world map; tastings and a restaurant of seasonal village food.", ka: "მარანი, რომელმაც ქართული ბუნებრივი ქვევრის ღვინო მსოფლიოს გააცნო; დეგუსტაციები და სეზონური სოფლური კერძების რესტორანი." }, specials: ["wine", "qvevri"] },
  { id: "okros", name: { en: "Okro's Wines", ka: "ოქროს ღვინო" }, kind: "winery", lat: 41.6200, lng: 45.9210, near: "sighnaghi", area: { en: "Sighnaghi", ka: "სიღნაღი" }, price: 2,
    desc: { en: "Small family winery with a terrace over the Alazani valley; tasting flights of amber wines.", ka: "პატარა საოჯახო მარანი ალაზნის ველზე გადმომზირალი ტერასით; ქარვისფერი ღვინოების დეგუსტაცია." }, specials: ["wine", "view"] },
  { id: "twins", name: { en: "Twins Wine Cellar, Napareuli", ka: "ტყუპების მარანი, ნაფარეული" }, kind: "winery", lat: 42.0300, lng: 45.4350, near: "alaverdi", area: { en: "Napareuli, 10 km from Alaverdi", ka: "ნაფარეული, ალავერდიდან 10 კმ" }, price: 2,
    desc: { en: "A qvevri museum where you can climb into an empty clay vessel, then taste; lunch and rooms on site.", ka: "ქვევრის მუზეუმი, სადაც ცარიელ ქვევრში ჩასვლა შეიძლება, შემდეგ დეგუსტაცია; სადილი და ოთახებიც არის." }, specials: ["wine", "qvevri", "lunch"] },
  { id: "shumi", name: { en: "Shumi Winery", ka: "შუმი" }, kind: "winery", lat: 41.8990, lng: 45.5690, near: "tsinandali", area: { en: "Tsinandali", ka: "წინანდალი" }, price: 2,
    desc: { en: "Opposite the Tsinandali estate: a vine collection of 300 varieties, a small museum and a shaded tasting garden.", ka: "წინანდლის მამულის პირდაპირ: 300 ჯიშის ვაზის კოლექცია, პატარა მუზეუმი და ჩრდილიანი სადეგუსტაციო ბაღი." }, specials: ["wine"] },
  { id: "telavi-bazaar", name: { en: "Telavi bazaar", ka: "თელავის ბაზარი" }, kind: "market", lat: 41.9180, lng: 45.4700, near: "telavi", area: { en: "Telavi centre", ka: "თელავის ცენტრი" }, price: 1,
    desc: { en: "Spices, sulguni, fresh churchkhela and bread in the morning; bring cash.", ka: "სანელებლები, სულგუნი, ახალი ჩურჩხელა და პური დილით; ნაღდი ფული წამოიღე." }, specials: ["market"] },
  { id: "khareba", name: { en: "Khareba wine tunnel", ka: "ხარების ღვინის გვირაბი" }, kind: "winery", lat: 41.9520, lng: 45.8150, near: "kvareli", area: { en: "Kvareli", ka: "ყვარელი" }, price: 2,
    desc: { en: "7.7 km of Soviet-era tunnel cut into the Caucasus, now a wine cellar; guided walk and tasting, restaurant above.", ka: "კავკასიონში გაყვანილი 7.7 კმ საბჭოთა გვირაბი, ახლა ღვინის სარდაფი; ტური და დეგუსტაცია, ზემოთ რესტორანი." }, specials: ["wine"] },
  { id: "kindzmarauli", name: { en: "Kindzmarauli Corporation", ka: "ქინძმარაულის კორპორაცია" }, kind: "winery", lat: 41.9560, lng: 45.8080, near: "kvareli", area: { en: "Kvareli", ka: "ყვარელი" }, price: 1,
    desc: { en: "Large producer with a walk-in tour and cheap tasting of the semi-sweet Kindzmarauli made only here.", ka: "დიდი მწარმოებელი, ტური ჯავშნის გარეშე და იაფი დეგუსტაცია — ნახევრადტკბილი ქინძმარაული მხოლოდ აქ იწარმოება." }, specials: ["wine"] },
  { id: "oasis-udabno", name: { en: "Oasis Club, Udabno", ka: "ოაზისი, უდაბნო" }, kind: "cafe", lat: 41.4550, lng: 45.3220, near: "davitgareja", area: { en: "Udabno village", ka: "სოფელი უდაბნო" }, price: 1,
    desc: { en: "The only café-hostel in the steppe village before David Gareja; simple lunches, cold drinks, horse rides.", ka: "ერთადერთი კაფე-ჰოსტელი სტეპის სოფელში დავით გარეჯამდე; მარტივი სადილი, ცივი სასმელი, ცხენით გასეირნება." }, specials: ["lunch"] },

  /* Shida Kartli / Samtskhe */
  { id: "gori-bazaar", name: { en: "Gori bazaar & bakeries", ka: "გორის ბაზარი და თონეები" }, kind: "market", lat: 41.9830, lng: 44.1130, near: "gori", area: { en: "Gori centre", ka: "გორის ცენტრი" }, price: 1,
    desc: { en: "Quick, cheap lunch: hot lobiani or khachapuri from the bakeries by the market, fruit from the stalls.", ka: "სწრაფი, იაფი სადილი: ცხელი ლობიანი ან ხაჭაპური ბაზრის თონეებიდან, ხილი დახლებიდან." }, specials: ["bread"] },
  { id: "borjomi-park", name: { en: "Borjomi park spring & cafés", ka: "ბორჯომის პარკის წყარო და კაფეები" }, kind: "rest", lat: 41.8390, lng: 43.3830, near: "borjomi", area: { en: "Borjomi Central Park", ka: "ბორჯომის ცენტრალური პარკი" }, price: 1,
    desc: { en: "Fill your bottle at the warm spring for free, then coffee and khachapuri at the park cafés.", ka: "ბოთლი უფასოდ აავსე თბილ წყაროზე, მერე ყავა და ხაჭაპური პარკის კაფეებში." }, specials: ["rest", "water"] },
  { id: "rabati-cafes", name: { en: "Rabati lower-town cafés", ka: "რაბათის ქვედა ქალაქის კაფეები" }, kind: "cafe", lat: 41.6425, lng: 42.9750, near: "rabati", area: { en: "Akhaltsikhe, Rabati", ka: "ახალციხე, რაბათი" }, price: 2,
    desc: { en: "Inside the free part of the castle: terraces for lunch or dinner, Meskhetian dishes (apokhti dried meat, tatarberi pastry).", ka: "ციხის უფასო ნაწილში: ტერასები სადილისა და ვახშმისთვის, მესხური კერძები (აპოხტი, თათარბერი)." }, specials: ["lunch", "dinner"] },
  { id: "vardzia-tavern", name: { en: "Riverside taverns at Vardzia", ka: "მდინარისპირა სასადილოები ვარძიასთან" }, kind: "restaurant", lat: 41.3840, lng: 43.2900, near: "vardzia", area: { en: "Vardzia car park", ka: "ვარძიის ავტოსადგომი" }, price: 1,
    desc: { en: "Trout, khachapuri and cold beer on the river below the caves; a few family-run guesthouses serve dinner too.", ka: "კალმახი, ხაჭაპური და ცივი ლუდი მდინარეზე გამოქვაბულების ქვემოთ; რამდენიმე საოჯახო სასტუმრო ვახშამსაც ამზადებს." }, specials: ["trout"] },

  /* Imereti / Samegrelo */
  { id: "palaty", name: { en: "Palaty", ka: "პალატი" }, kind: "restaurant", lat: 42.2700, lng: 42.7060, near: "kutaisi", area: { en: "Kutaisi, Pushkin St", ka: "ქუთაისი, პუშკინის ქ." }, price: 2,
    desc: { en: "The reliable Kutaisi dinner: Imeretian khachapuri, ojakhuri, live music some nights.", ka: "ქუთაისის საიმედო ვახშამი: იმერული ხაჭაპური, ოჯახური, ზოგ საღამოს ცოცხალი მუსიკა." }, specials: ["khachapuri"] },
  { id: "bikentia", name: { en: "Bikentia's Kebabery", ka: "ბიკენტიას ქაბაბი" }, kind: "restaurant", lat: 42.2718, lng: 42.7080, near: "kutaisi", area: { en: "Kutaisi, Tsminda Nino St", ka: "ქუთაისი, წმ. ნინოს ქ." }, price: 1,
    desc: { en: "A tiny standing-room kebab shop that has served one dish since Soviet times: kebab in a wrap with sauce and beer.", ka: "პატარა ქაბაბის დუქანი, საბჭოთა დროიდან ერთ კერძს აკეთებს: ქაბაბი ლავაშში სოუსით და ლუდით." }, specials: ["kebab"] },
  { id: "kutaisi-bazaar", name: { en: "Kutaisi Green Bazaar", ka: "ქუთაისის მწვანე ბაზარი" }, kind: "market", lat: 42.2680, lng: 42.7030, near: "kutaisi", area: { en: "Kutaisi centre", ka: "ქუთაისის ცენტრი" }, price: 1,
    desc: { en: "Covered market with the best spice sellers in the west — Svan salt, ajika, khmeli-suneli; cheese and tklapi too.", ka: "დახურული ბაზარი დასავლეთის საუკეთესო სანელებლებით — სვანური მარილი, აჯიკა, ხმელი სუნელი; ყველი და ტყლაპიც." }, specials: ["market"] },
  { id: "gordi-guesthouses", name: { en: "Gordi village lunch", ka: "სადილი სოფელ გორდში" }, kind: "guesthouse", lat: 42.4850, lng: 42.5400, near: "okatse", area: { en: "Gordi, by Okatse visitor centre", ka: "გორდი, ოკაცეს ვიზიტორთა ცენტრთან" }, price: 1,
    desc: { en: "Family guesthouses around the visitor centre cook home lunches for canyon visitors: khachapuri, lobio, salad, homemade wine.", ka: "ვიზიტორთა ცენტრის ირგვლივ საოჯახო სასტუმროები კანიონის სტუმრებისთვის სახლის სადილს ამზადებენ: ხაჭაპური, ლობიო, სალათი, საოჯახო ღვინო." }, specials: ["lunch"] },
  { id: "martvili-cafes", name: { en: "Martvili canyon cafés", ka: "მარტვილის კანიონის კაფეები" }, kind: "cafe", lat: 42.4570, lng: 42.3790, near: "martvili", area: { en: "Martvili canyon entrance", ka: "მარტვილის კანიონის შესასვლელი" }, price: 1,
    desc: { en: "Simple cafés at the entrance; for a real Mingrelian lunch drive 10 min to Martvili town — elarji, kharcho with walnuts.", ka: "მარტივი კაფეები შესასვლელთან; ნამდვილი მეგრული სადილისთვის 10 წთ მარტვილამდე — ელარჯი, ნიგვზიანი ხარჩო." }, specials: ["lunch"] },
  { id: "diaroni", name: { en: "Diaroni, Zugdidi", ka: "დიარონი, ზუგდიდი" }, kind: "restaurant", lat: 42.5070, lng: 41.8700, near: "zugdidi", area: { en: "Zugdidi centre", ka: "ზუგდიდის ცენტრი" }, price: 1,
    desc: { en: "Mingrelian home cooking at family prices: elarji, kupati sausages, gebzhalia cheese rolls, spicy ajika on everything.", ka: "მეგრული სახლის სამზარეულო საოჯახო ფასებში: ელარჯი, კუპატი, გებჟალია, აჯიკა ყველაფერზე." }, specials: ["mingrelian"] },
  { id: "enguri-view", name: { en: "Enguri Dam viewpoint", ka: "ენგურის კაშხლის ხედი" }, kind: "viewpoint", lat: 42.7610, lng: 42.0340, near: "enguri", area: { en: "Svaneti road", ka: "სვანეთის გზა" }, price: 1,
    desc: { en: "Leg-stretch, toilets and a small café at the dam crest; the next stop with food is Mestia, 2.5 h on.", ka: "ფეხის გაშლა, ტუალეტი და პატარა კაფე კაშხლის თავზე; შემდეგი საკვები გაჩერება მესტიაა, 2.5 სთ-ში." }, specials: ["rest"] },

  /* Svaneti */
  { id: "cafe-laila", name: { en: "Café Laila", ka: "კაფე ლაილა" }, kind: "restaurant", lat: 43.0455, lng: 42.7285, near: "mestia", area: { en: "Mestia, main square", ka: "მესტია, მთავარი მოედანი" }, price: 2,
    desc: { en: "The Mestia meeting point: kubdari, chvishtari (cheese cornbread), beer, Svan singing some evenings.", ka: "მესტიის შეხვედრის ადგილი: კუბდარი, ჭვიშტარი, ლუდი, ზოგ საღამოს სვანური სიმღერა." }, specials: ["kubdari"] },
  { id: "mestia-guesthouses", name: { en: "Mestia guesthouse dinners", ka: "მესტიის საოჯახო სასტუმროების ვახშამი" }, kind: "guesthouse", lat: 43.0440, lng: 42.7310, near: "mestia", area: { en: "Mestia", ka: "მესტია" }, price: 1,
    desc: { en: "Most guesthouses serve a huge half-board dinner (~25–35 GEL): soups, kubdari, tashmijabi (cheese mashed potato), homemade chacha.", ka: "საოჯახო სასტუმროების უმეტესობა უზარმაზარ ვახშამს აწვდის (~25–35 ₾): წვნიანი, კუბდარი, თაშმიჯაბი, საოჯახო ჭაჭა." }, specials: ["dinner"] },
  { id: "ushguli-cafes", name: { en: "Ushguli cafés", ka: "უშგულის კაფეები" }, kind: "cafe", lat: 42.9170, lng: 43.0100, near: "ushguli", area: { en: "Chazhashi / Zhibiani", ka: "ჩაჟაში / ჟიბიანი" }, price: 1,
    desc: { en: "A few guesthouse cafés serve lunch and tea; take snacks for the glacier walk.", ka: "რამდენიმე საოჯახო კაფე სადილსა და ჩაის აწვდის; მყინვარის ბილიკისთვის საჭმელი წამოიღე." }, specials: ["lunch"] },

  /* Racha */
  { id: "shaori-trout", name: { en: "Shaori lakeside trout", ka: "კალმახი შაორის ტბაზე" }, kind: "restaurant", lat: 42.4150, lng: 43.1050, near: "shaori", area: { en: "Shaori lake", ka: "შაორის ტბა" }, price: 1,
    desc: { en: "Open-air trout restaurants on the lake road; lobiani and Racha ham (lori) to go with it.", ka: "ღია ცის ქვეშ კალმახის რესტორნები ტბის გზაზე; ლობიანი და რაჭული ლორი თან." }, specials: ["trout"] },
  { id: "khvanchkara-cellars", name: { en: "Khvanchkara family cellars", ka: "ხვანჭკარის საოჯახო მარნები" }, kind: "winery", lat: 42.5230, lng: 43.1350, near: "oni", area: { en: "Ambrolauri–Khvanchkara road", ka: "ამბროლაური–ხვანჭკარის გზა" }, price: 1,
    desc: { en: "Village cellars sell the naturally semi-sweet Khvanchkara (Aleksandrouli + Mujuretuli grapes) by the bottle and the glass.", ka: "სოფლის მარნები ბუნებრივად ნახევრადტკბილ ხვანჭკარას (ალექსანდროული + მუჯურეთული) ბოთლით და ჭიქით ყიდიან." }, specials: ["wine"] },

  /* Adjara */
  { id: "retro", name: { en: "Retro", ka: "რეტრო" }, kind: "restaurant", lat: 41.6435, lng: 41.6330, near: "batumi", area: { en: "Batumi, Takaishvili St", ka: "ბათუმი, თაყაიშვილის ქ." }, price: 1,
    desc: { en: "Locals' favourite for Adjarian khachapuri — the boat-shaped one with the egg. Nothing fancy, always full.", ka: "ადგილობრივების ფავორიტი აჭარული ხაჭაპურისთვის — ნავის ფორმის, კვერცხით. უბრალო, ყოველთვის სავსე." }, specials: ["khachapuri"] },
  { id: "laguna", name: { en: "Laguna", ka: "ლაგუნა" }, kind: "restaurant", lat: 41.6520, lng: 41.6280, near: "batumi", area: { en: "Batumi, the boulevard", ka: "ბათუმი, ბულვარი" }, price: 2,
    desc: { en: "Seafood on the boulevard: Black Sea fish, mussels, prawns; sunset tables.", ka: "ზღვის პროდუქტები ბულვარზე: შავი ზღვის თევზი, მიდიები, კრევეტი; მზის ჩასვლის მაგიდები." }, specials: ["fish"] },
  { id: "fish-market", name: { en: "Batumi fish market", ka: "ბათუმის თევზის ბაზარი" }, kind: "market", lat: 41.6600, lng: 41.6530, near: "batumi", area: { en: "Batumi, by the port", ka: "ბათუმი, პორტთან" }, price: 1,
    desc: { en: "Buy the fish, then have it grilled at one of the cafés next door for a few GEL — the cheapest seafood dinner in town.", ka: "თევზი იყიდე და გვერდით კაფეში რამდენიმე ლარად შეაწვევინე — ქალაქში ყველაზე იაფი ზღვის ვახშამი." }, specials: ["fish"] },
  { id: "makhuntseti-restaurants", name: { en: "Makhuntseti riverside restaurants", ka: "მახუნცეთის მდინარისპირა რესტორნები" }, kind: "restaurant", lat: 41.5985, lng: 41.8790, near: "makhuntseti", area: { en: "Makhuntseti", ka: "მახუნცეთი" }, price: 1,
    desc: { en: "Tables over the river at the waterfall: grilled trout, Adjarian khachapuri, borano (cheese fried in butter), local Chkhaveri wine.", ka: "მაგიდები მდინარის თავზე ჩანჩქერთან: შემწვარი კალმახი, აჭარული ხაჭაპური, ბორანო, ადგილობრივი ჩხავერი." }, specials: ["trout", "khachapuri"] },
  { id: "adjarian-wine-house", name: { en: "Adjarian Wine House", ka: "აჭარული ღვინის სახლი" }, kind: "winery", lat: 41.6090, lng: 41.8400, near: "makhuntseti", area: { en: "Acharistskali, Keda road", ka: "აჭარისწყალი, ქედის გზა" }, price: 2,
    desc: { en: "Tasting of Chkhaveri rosé and Tsolikouri in a garden on the way to Makhuntseti; restaurant with Adjarian dishes.", ka: "ჩხავერისა და ცოლიკოურის დეგუსტაცია ბაღში მახუნცეთის გზაზე; რესტორანი აჭარული კერძებით." }, specials: ["wine"] },
  { id: "sarpi-beach", name: { en: "Sarpi beach cafés", ka: "სარფის სანაპიროს კაფეები" }, kind: "rest", lat: 41.5210, lng: 41.5500, near: "gonio", area: { en: "Sarpi, Turkish border", ka: "სარფი, თურქეთის საზღვარი" }, price: 1,
    desc: { en: "Clearest water on the coast, loungers, simple beach cafés; a 25-minute drive from Batumi.", ka: "ყველაზე სუფთა წყალი სანაპიროზე, შეზლონგები, მარტივი კაფეები; ბათუმიდან 25 წთ." }, specials: ["rest", "swim"] },
  { id: "mtirala-visitor", name: { en: "Mtirala visitor centre café", ka: "მტირალას ვიზიტორთა ცენტრის კაფე" }, kind: "rest", lat: 41.6672, lng: 41.8640, near: "mtirala", area: { en: "Mtirala NP", ka: "მტირალას პარკი" }, price: 1,
    desc: { en: "Tea, snacks and shelter from the rain at the trailhead; guesthouses in Chakvistavi village serve lunch.", ka: "ჩაი, წასახემსებელი და წვიმისგან თავშესაფარი ბილიკის დასაწყისში; ჩაქვისთავის საოჯახო სასტუმროები სადილს აწვდიან." }, specials: ["rest"] }
];
export const stopById = id => STOPS.find(s => s.id === id);
