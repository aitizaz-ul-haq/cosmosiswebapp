// European countries and cities used for scheduling a client's onboarding.
// Each city resolves to an IANA time zone so the scheduled moment is exact.

const flagFromCode = (code) =>
  code === "XK"
    ? "\u{1F1FD}\u{1F1F0}"
    : String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));

// cities: "Name" uses the country time zone, ["Name", "Zone"] overrides it.
const country = (code, name, tz, cities) => ({
  code,
  name,
  flag: flagFromCode(code),
  cities: cities.map((c) =>
    Array.isArray(c) ? { name: c[0], tz: c[1] } : { name: c, tz }
  ),
});

export const EUROPE_COUNTRIES = [
  country("AL", "Albania", "Europe/Tirane", ["Tirana", "Durrës", "Vlorë", "Shkodër"]),
  country("AD", "Andorra", "Europe/Andorra", ["Andorra la Vella", "Escaldes-Engordany"]),
  country("AT", "Austria", "Europe/Vienna", ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"]),
  country("BY", "Belarus", "Europe/Minsk", ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Brest"]),
  country("BE", "Belgium", "Europe/Brussels", ["Brussels", "Antwerp", "Ghent", "Bruges", "Liège"]),
  country("BA", "Bosnia and Herzegovina", "Europe/Sarajevo", ["Sarajevo", "Banja Luka", "Mostar", "Tuzla"]),
  country("BG", "Bulgaria", "Europe/Sofia", ["Sofia", "Plovdiv", "Varna", "Burgas"]),
  country("HR", "Croatia", "Europe/Zagreb", ["Zagreb", "Split", "Rijeka", "Dubrovnik", "Osijek"]),
  country("CY", "Cyprus", "Asia/Nicosia", ["Nicosia", "Limassol", "Larnaca", "Paphos"]),
  country("CZ", "Czechia", "Europe/Prague", ["Prague", "Brno", "Ostrava", "Plzeň"]),
  country("DK", "Denmark", "Europe/Copenhagen", ["Copenhagen", "Aarhus", "Odense", "Aalborg"]),
  country("EE", "Estonia", "Europe/Tallinn", ["Tallinn", "Tartu", "Narva"]),
  country("FI", "Finland", "Europe/Helsinki", ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"]),
  country("FR", "France", "Europe/Paris", ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Bordeaux", "Lille", "Strasbourg"]),
  country("DE", "Germany", "Europe/Berlin", ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Stuttgart", "Düsseldorf"]),
  country("GR", "Greece", "Europe/Athens", ["Athens", "Thessaloniki", "Patras", "Heraklion"]),
  country("HU", "Hungary", "Europe/Budapest", ["Budapest", "Debrecen", "Szeged", "Pécs"]),
  country("IS", "Iceland", "Atlantic/Reykjavik", ["Reykjavík", "Akureyri", "Kópavogur"]),
  country("IE", "Ireland", "Europe/Dublin", ["Dublin", "Cork", "Galway", "Limerick", "Waterford"]),
  country("IT", "Italy", "Europe/Rome", ["Rome", "Milan", "Naples", "Turin", "Florence", "Venice", "Bologna"]),
  country("XK", "Kosovo", "Europe/Belgrade", ["Pristina", "Prizren", "Peja"]),
  country("LV", "Latvia", "Europe/Riga", ["Riga", "Daugavpils", "Liepāja"]),
  country("LI", "Liechtenstein", "Europe/Vaduz", ["Vaduz", "Schaan"]),
  country("LT", "Lithuania", "Europe/Vilnius", ["Vilnius", "Kaunas", "Klaipėda"]),
  country("LU", "Luxembourg", "Europe/Luxembourg", ["Luxembourg City", "Esch-sur-Alzette"]),
  country("MT", "Malta", "Europe/Malta", ["Valletta", "Sliema", "Birkirkara"]),
  country("MD", "Moldova", "Europe/Chisinau", ["Chișinău", "Bălți", "Tiraspol"]),
  country("MC", "Monaco", "Europe/Monaco", ["Monaco", "Monte Carlo"]),
  country("ME", "Montenegro", "Europe/Podgorica", ["Podgorica", "Budva", "Nikšić"]),
  country("NL", "Netherlands", "Europe/Amsterdam", ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"]),
  country("MK", "North Macedonia", "Europe/Skopje", ["Skopje", "Bitola", "Ohrid"]),
  country("NO", "Norway", "Europe/Oslo", ["Oslo", "Bergen", "Trondheim", "Stavanger"]),
  country("PL", "Poland", "Europe/Warsaw", ["Warsaw", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź"]),
  country("PT", "Portugal", "Europe/Lisbon", [
    "Lisbon",
    "Porto",
    "Faro",
    "Coimbra",
    ["Funchal (Madeira)", "Atlantic/Madeira"],
    ["Ponta Delgada (Azores)", "Atlantic/Azores"],
  ]),
  country("RO", "Romania", "Europe/Bucharest", ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța"]),
  country("RU", "Russia", "Europe/Moscow", [
    "Moscow",
    "Saint Petersburg",
    "Kazan",
    ["Kaliningrad", "Europe/Kaliningrad"],
    ["Samara", "Europe/Samara"],
  ]),
  country("SM", "San Marino", "Europe/San_Marino", ["San Marino", "Serravalle"]),
  country("RS", "Serbia", "Europe/Belgrade", ["Belgrade", "Novi Sad", "Niš"]),
  country("SK", "Slovakia", "Europe/Bratislava", ["Bratislava", "Košice", "Prešov"]),
  country("SI", "Slovenia", "Europe/Ljubljana", ["Ljubljana", "Maribor", "Celje"]),
  country("ES", "Spain", "Europe/Madrid", [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Bilbao",
    "Málaga",
    ["Las Palmas (Canary Islands)", "Atlantic/Canary"],
  ]),
  country("SE", "Sweden", "Europe/Stockholm", ["Stockholm", "Gothenburg", "Malmö", "Uppsala"]),
  country("CH", "Switzerland", "Europe/Zurich", ["Zurich", "Geneva", "Bern", "Basel", "Lausanne"]),
  country("TR", "Turkey", "Europe/Istanbul", ["Istanbul", "Ankara", "Izmir", "Bursa"]),
  country("UA", "Ukraine", "Europe/Kiev", ["Kyiv", "Kharkiv", "Odesa", "Lviv", "Dnipro"]),
  country("GB", "United Kingdom", "Europe/London", [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh",
    "Glasgow",
    "Cardiff",
    "Belfast",
    "Liverpool",
  ]),
  country("VA", "Vatican City", "Europe/Vatican", ["Vatican City"]),
];
