/* Pelisivujen kielivalinta: suomi (oletus), ruotsi, englanti.
   Sivujen teksti on suomeksi. Tämä kääntää tekstisolmut ja osan attribuuteista lennossa,
   myös pelien itse kirjoittamat viestit (MutationObserver). Valinta on sama kuin etusivulla. */
(function () {
  var LANGS = ["fi", "sv", "en"];
  var DAYS = {
    maanantai: ["måndag", "Monday"], tiistai: ["tisdag", "Tuesday"], keskiviikko: ["onsdag", "Wednesday"],
    torstai: ["torsdag", "Thursday"], perjantai: ["fredag", "Friday"], lauantai: ["lördag", "Saturday"], sunnuntai: ["söndag", "Sunday"]
  };
  var DAYRE = "(maanantai|tiistai|keskiviikko|torstai|perjantai|lauantai|sunnuntai)";
  var IS_DD = /doomsday/.test(location.pathname);
  function day(w, i) { return DAYS[w] ? DAYS[w][i] : w; }
  function ord(n) { n = +n; var t = n % 100, o = n % 10; return n + (t > 10 && t < 14 ? "th" : o === 1 ? "st" : o === 2 ? "nd" : o === 3 ? "rd" : "th"); }
  function svOrd(n) { n = +n; var t = n % 100, o = n % 10; return n + (t !== 11 && t !== 12 && (o === 1 || o === 2) ? ":a" : ":e"); }
  var SYM = { Kahvi: ["Kaffe", "Coffee"], Kirja: ["Bok", "Book"], Shakki: ["Schack", "Chess"], Kitara: ["Gitarr", "Guitar"], Timantti: ["Diamant", "Diamond"] };
  function sym(w, i) { return SYM[w] ? SYM[w][i] : w; }

  // suomi → [ruotsi, englanti]
  var D = {
    // Yhteiset
    "‹ Pelit": ["‹ Spel", "‹ Games"],
    "‹ Etusivu": ["‹ Startsida", "‹ Home"],
    "Etusivu": ["Startsida", "Home"],
    "Pelit": ["Spel", "Games"],
    "Helppo": ["Lätt", "Easy"], "Keskitaso": ["Medel", "Medium"], "Vaikea": ["Svår", "Hard"],
    "Tallenna listalle": ["Spara på listan", "Save to list"],
    "Ei vielä tuloksia. Ole ensimmäinen!": ["Inga resultat än. Bli den första!", "No results yet. Be the first!"],
    "Nimesi": ["Ditt namn", "Your name"],
    "Pelaa uudelleen": ["Spela igen", "Play again"],
    "Kysymys": ["Fråga", "Question"],
    "· Pisteet": ["· Poäng", "· Points"],
    "· Putki": ["· Svit", "· Streak"],
    "Seuraava": ["Nästa", "Next"],
    "Katso tulos": ["Se resultatet", "See result"],
    "Oikein!": ["Rätt!", "Correct!"],

    // Pelit-sivu
    "Valitse peli. Tulokset ja top-listat tallentuvat omaan selaimeesi.": ["Välj ett spel. Resultat och topplistor sparas i din egen webbläsare.", "Pick a game. Results and top lists are saved in your own browser."],
    "Laske minkä tahansa päivämäärän viikonpäivä päässä John Horton Conwayn menetelmällä. Kolme vaikeustasoa ja ohjeet.": ["Räkna ut veckodagen för vilket datum som helst i huvudet med John Horton Conways metod. Tre svårighetsnivåer och instruktioner.", "Work out the weekday of any date in your head with John Horton Conway's method. Three difficulty levels and instructions."],
    "Pelaa →": ["Spela →", "Play →"],
    "Presidenttivisa": ["Presidentquiz", "Presidents quiz"],
    "Tunnetko Yhdysvaltain 47 presidenttiä? Neljä pelitapaa järjestyksestä vuosilukuihin.": ["Känner du till USA:s 47 presidenter? Fyra spelsätt, från ordningsföljd till årtal.", "Do you know the 47 presidents of the United States? Four ways to play, from order to years."],
    "Miinaharava": ["Minröj", "Minesweeper"],
    "Klassinen miinaharava puhelimelle sopivana. Kolme tasoa ja nopeimpien aikojen top-lista.": ["Klassiskt minröj anpassat för mobilen. Tre nivåer och en topplista över de snabbaste tiderna.", "Classic minesweeper made for the phone. Three levels and a top list of the fastest times."],
    "Pisteholvi": ["Poängvalvet", "Points Vault"],
    "Viiden kiekon holvipeli, jossa pelataan pisteillä eikä rahalla. Holvibonus, tuplaus ja suurimpien voittojen top-lista.": ["Ett valvspel med fem hjul där man spelar om poäng, inte pengar. Valvbonus, dubbling och en topplista över de största vinsterna.", "A five-reel vault game played for points, not money. Vault bonus, double-up and a top list of the biggest wins."],

    // Miinaharava
    "Avaa kaikki ruudut, joissa ei ole miinaa. Numero kertoo, montako miinaa ympäröivissä ruuduissa on.": ["Öppna alla rutor som inte har en mina. Siffran visar hur många minor det finns i rutorna runt omkring.", "Open every square that has no mine. The number tells you how many mines are in the surrounding squares."],
    "Ensimmäinen avaus on aina turvallinen.": ["Den första öppningen är alltid säker.", "The first move is always safe."],
    "Pum! Napauta naamaa aloittaaksesi uudelleen.": ["Pang! Tryck på ansiktet för att börja om.", "Boom! Tap the face to start again."],
    "Voitit ajassa": ["Du vann på", "You won in"],
    "Napauta avataksesi. Lipun saa pitämällä sormea ruudun päällä tai Lippu-tilassa napauttamalla (tietokoneella hiiren oikealla). Kun numeron ympärillä on oikea määrä lippuja, numeron napautus avaa loput naapurit.": ["Tryck för att öppna. En flagga sätter du genom att hålla fingret på rutan eller genom att trycka i flaggläget (på datorn med höger musknapp). När det finns rätt antal flaggor runt en siffra öppnar ett tryck på siffran resten av grannarna.", "Tap to open. Place a flag by holding your finger on a square or by tapping in flag mode (right-click on a computer). When a number has the right number of flags around it, tapping the number opens the remaining neighbours."],
    "Uusi peli": ["Nytt spel", "New game"],

    // Pisteholvi
    "Pyöritä kiekkoja ja kerää pisteitä. Kuusi kolikkoa avaa holvin. Pelissä ei ole rahaa, vain pisteitä.": ["Snurra hjulen och samla poäng. Sex mynt öppnar valvet. Spelet har inga pengar, bara poäng.", "Spin the reels and collect points. Six coins open the vault. There is no money in the game, only points."],
    "Saldo": ["Saldo", "Balance"],
    "Panos": ["Insats", "Bet"],
    "Voitto": ["Vinst", "Win"],
    "Pyöritä": ["Snurra", "Spin"],
    "Tuplaa voitto": ["Dubbla vinsten", "Double the win"],
    "Hae 1 000 pistettä lisää": ["Hämta 1 000 poäng till", "Get 1,000 more points"],
    "Tuplaus": ["Dubbling", "Double-up"],
    "· pelissä": ["· i spel", "· at stake"],
    "pistettä": ["poäng", "points"],
    "pistettä.": ["poäng.", "points."],
    "Kruuna": ["Krona", "Heads"],
    "Klaava": ["Klave", "Tails"],
    "Ota talteen": ["Ta hem vinsten", "Collect"],
    "Top 10 · Suurimmat voitot": ["Topp 10 · Största vinsterna", "Top 10 · Biggest wins"],
    "Säännöt ja voittotaulu": ["Regler och vinsttabell", "Rules and paytable"],
    "Luvut ovat pisteitä valitulla panoksella.": ["Siffrorna är poäng med den valda insatsen.", "The numbers are points at the selected bet."],
    "Kuvio": ["Symbol", "Symbol"],
    "JOKERI": ["JOKER", "WILD"],
    "Valitse panos ja paina Pyöritä.": ["Välj insats och tryck på Snurra.", "Choose your bet and press Spin."],
    "Ei voittoa tällä kertaa.": ["Ingen vinst den här gången.", "No win this time."],
    "Pisteet loppuivat. Hae lisää ja jatka.": ["Poängen tog slut. Hämta fler och fortsätt.", "You're out of points. Get more and carry on."],
    "Holvi pysyi kiinni: yksi kolikko jäi puuttumaan.": ["Valvet förblev stängt: ett mynt fattades.", "The vault stayed shut: one coin short."],
    "Holvi pysyi kiinni: yksi kolikko jäi puuttumaan. Linjavoitto": ["Valvet förblev stängt: ett mynt fattades. Linjevinst", "The vault stayed shut: one coin short. Line win"],
    "Viisi kolikkoa!": ["Fem mynt!", "Five coins!"],
    "Muut ruudut pyörivät vielä kerran.": ["De andra rutorna snurrar en gång till.", "The other squares spin once more."],
    "Holvi aukeaa…": ["Valvet öppnas…", "The vault is opening…"],
    "Holvibonus": ["Valvbonus", "Vault bonus"],
    "· kolikoissa": ["· i mynten", "· in coins"],
    "2×-kierros!": ["2×-omgång!", "2× round!"],
    "Koko holvi täynnä!": ["Hela valvet är fullt!", "The whole vault is full!"],
    "Voitit": ["Du vann", "You won"],
    "Arvaa oikein, niin voitto tuplaantuu. Väärä arvaus vie sen.": ["Gissa rätt så dubblas vinsten. En fel gissning tar den.", "Guess right and the win doubles. A wrong guess loses it."],
    "Kruuna! Voitto on nyt": ["Krona! Vinsten är nu", "Heads! The win is now"],
    "Klaava! Voitto on nyt": ["Klave! Vinsten är nu", "Tails! The win is now"],
    ". Tuplausraja täynnä.": [". Dubblingsgränsen är nådd.", ". Double-up limit reached."],
    "Kruuna. Voitto meni tällä kertaa.": ["Krona. Vinsten gick förlorad den här gången.", "Heads. The win is gone this time."],
    "Klaava. Voitto meni tällä kertaa.": ["Klave. Vinsten gick förlorad den här gången.", "Tails. The win is gone this time."],
    "Sait 1 000 pistettä lisää.": ["Du fick 1 000 poäng till.", "You got 1,000 more points."],
    "Ei vielä tuloksia. Voita vähintään kymmenen kertaa panoksesi, niin pääset listalle.": ["Inga resultat än. Vinn minst tio gånger din insats så kommer du in på listan.", "No results yet. Win at least ten times your bet to make the list."],

    // Presidenttivisa
    "Yhdysvaltain presidentit 1789–2025": ["USA:s presidenter 1789–2025", "Presidents of the United States 1789–2025"],
    "Järjestyksessä": ["I ordning", "In order"],
    "Washingtonista nykypäivään, kaikki 47": ["Från Washington till i dag, alla 47", "From Washington to today, all 47"],
    "Satunnainen kymppi": ["Tio slumpvisa", "Random ten"],
    "Kuka oli n:s presidentti? 10 kysymystä": ["Vem var den n:te presidenten? 10 frågor", "Who was the nth president? 10 questions"],
    "Monesko presidentti?": ["Vilken president i ordningen?", "Which number president?"],
    "Näet nimen, arvaat järjestysnumeron. 10 kysymystä": ["Du ser namnet och gissar ordningsnumret. 10 frågor", "You see the name and guess the number. 10 questions"],
    "Kuka oli vallassa?": ["Vem satt vid makten?", "Who was in office?"],
    "Näet vuoden, arvaat presidentin. 10 kysymystä": ["Du ser året och gissar presidenten. 10 frågor", "You see the year and guess the president. 10 questions"],
    "🏆 Tulokset": ["🏆 Resultat", "🏆 Results"],
    "Tulokset": ["Resultat", "Results"],
    "‹ Valikko": ["‹ Meny", "‹ Menu"],
    "Valikkoon": ["Till menyn", "To the menu"],
    "Ei vielä tuloksia.": ["Inga resultat än.", "No results yet."],
    "Väärin.": ["Fel.", "Wrong."],
    "Demokraatti": ["Demokrat", "Democrat"],
    "Republikaani": ["Republikan", "Republican"],
    "Muu puolue": ["Annat parti", "Other party"],
    "Lue lisää ja katso kuva Wikipediasta ›": ["Läs mer och se en bild på Wikipedia ›", "Read more and see a picture on Wikipedia ›"],
    "Seuraava ›": ["Nästa ›", "Next ›"],
    "Täydellinen! 🇺🇸": ["Perfekt! 🇺🇸", "Perfect! 🇺🇸"],
    "Erinomaista!": ["Utmärkt!", "Excellent!"],
    "Hyvä suoritus!": ["Bra jobbat!", "Well done!"],
    "Harjoitus tekee mestarin.": ["Övning ger färdighet.", "Practice makes perfect."],
    "Kertaa nämä:": ["Repetera de här:", "Review these:"],
    "🏆 Pääsit top 10 -listalle!": ["🏆 Du kom in på topp 10-listan!", "🏆 You made the top 10!"],
    "Kirjoita nimesi:": ["Skriv ditt namn:", "Enter your name:"],
    "Nimi": ["Namn", "Name"],
    "Tallenna": ["Spara", "Save"],

    // Doomsday
    "Doomsday-menetelmä. Matemaatikko John Horton Conwayn keksimällä menetelmällä voi laskea päässä minkä tahansa päivämäärän viikonpäivän, oli se menneisyydessä, tänään tai tulevaisuudessa.": ["Doomsday-metoden. Med metoden som matematikern John Horton Conway uppfann kan man i huvudet räkna ut veckodagen för vilket datum som helst, i det förflutna, i dag eller i framtiden.", "The Doomsday method. With the method invented by mathematician John Horton Conway, you can work out in your head the day of the week for any date, past, present or future."],
    "Lue ohjeet, valitse taso ja kokeile. Kierroksen lopuksi voit kirjoittaa nimimerkkisi top 20 -listalle. Vastata voi myös näppäimillä 1–7 (maanantai–sunnuntai).": ["Läs instruktionerna, välj nivå och prova. Efter omgången kan du skriva in din signatur på topp 20-listan. Du kan också svara med tangenterna 1–7 (måndag–söndag).", "Read the instructions, pick a level and give it a go. After a round you can add your initials to the top 20 list. You can also answer with keys 1–7 (Monday–Sunday)."],
    "Näin menetelmä toimii": ["Så fungerar metoden", "How the method works"],
    "1. Viikonpäivät numeroina": ["1. Veckodagar som siffror", "1. Weekdays as numbers"],
    "su": ["sö", "Sun"], "ma": ["må", "Mon"], "ti": ["ti", "Tue"], "ke": ["on", "Wed"], "to": ["to", "Thu"], "pe": ["fr", "Fri"], "la": ["lö", "Sat"],
    "Jos luku on suurempi kuin 6, vähennä siitä 7 (tai 14, 21 …), kunnes se on 0–6.": ["Om talet är större än 6, dra av 7 (eller 14, 21 …) tills det är 0–6.", "If the number is greater than 6, subtract 7 (or 14, 21 …) until it is 0–6."],
    "2. Vuosisadan koodi": ["2. Sekelkoden", "2. The century code"],
    "1800-luku": ["1800-talet", "1800s"], "1900-luku": ["1900-talet", "1900s"], "2000-luku": ["2000-talet", "2000s"], "2100-luku": ["2100-talet", "2100s"],
    "3. Vuoden tuomiopäivä, esimerkkinä 1928": ["3. Årets domedag, exempel 1928", "3. The year's doomsday, example 1928"],
    "Ota vuosiluvun kaksi viimeistä numeroa:": ["Ta årtalets två sista siffror:", "Take the last two digits of the year:"],
    ", jää yli": [", rest", ", remainder"],
    "vuosisadan koodi": ["sekelkoden", "century code"],
    "Laske yhteen vain korostetut numerot. Vuoden 1928 tuomiopäivä on siis keskiviikko.": ["Lägg bara ihop de markerade siffrorna. Domedagen för 1928 är alltså onsdag.", "Add up only the highlighted numbers. So the doomsday for 1928 is Wednesday."],
    "4. Muistipäivät": ["4. Minnesdagar", "4. Anchor dates"],
    "Kuukausi": ["Månad", "Month"],
    "Muistipäivä": ["Minnesdag", "Anchor date"],
    "sama päivä ja kuukausi: 4.4., 6.6., 8.8., 10.10., 12.12.": ["samma dag och månad: 4/4, 6/6, 8/8, 10/10, 12/12", "same day and month: 4/4, 6/6, 8/8, 10/10, 12/12"],
    "9.5., 5.9., 11.7., 7.11. (”töissä 9–5 ja kaupassa 7–11”)": ["9/5, 5/9, 11/7, 7/11 (”jobbar 9–5 på 7-Eleven”)", "9 May, 5 Sep, 11 Jul, 7 Nov (“I work 9 to 5 at the 7-Eleven”)"],
    "14.3. (piin päivä)": ["14/3 (pi-dagen)", "14 March (Pi Day)"],
    "helmikuun viimeinen päivä": ["sista dagen i februari", "the last day of February"],
    "3.1. (karkausvuonna 4.1.)": ["3/1 (skottår 4/1)", "3 January (4 January in a leap year)"],
    "Karkausvuosi on joka neljäs vuosi. Täysistä vuosisadoista vain 400:lla jaolliset ovat karkausvuosia (2000 oli, 1900 ei).": ["Skottår är vart fjärde år. Av jämna sekelår är bara de som är delbara med 400 skottår (2000 var det, 1900 inte).", "A leap year comes every four years. Of the century years, only those divisible by 400 are leap years (2000 was, 1900 was not)."],
    "5. Lopuksi oikea päivä, esimerkkinä 24.12.1928": ["5. Till sist rätt dag, exempel 24/12 1928", "5. Finally the right day, example 24 Dec 1928"],
    "12.12.1928 on tuomiopäivä eli keskiviikko": ["12/12 1928 är domedag, alltså onsdag", "12 Dec 1928 is the doomsday, so Wednesday"],
    "10 kysymystä · vuodet 2000–2030 · vihjeet käytössä": ["10 frågor · åren 2000–2030 · ledtrådar finns", "10 questions · years 2000–2030 · hints available"],
    "20 kysymystä · vuodet 1900–2099 · yksi vihje": ["20 frågor · åren 1900–2099 · en ledtråd", "20 questions · years 1900–2099 · one hint"],
    "30 kysymystä · vuodet 1800–2199 · ei apuja": ["30 frågor · åren 1800–2199 · ingen hjälp", "30 questions · years 1800–2199 · no help"],
    "Mikä viikonpäivä?": ["Vilken veckodag?", "Which day of the week?"],
    "Vihje": ["Ledtråd", "Hint"],
    "Ei enempää vihjeitä": ["Inga fler ledtrådar", "No more hints"],
    "Lopeta": ["Avsluta", "Quit"],
    "Pelaa uudestaan": ["Spela igen", "Play again"],
    "Vaihda tasoa": ["Byt nivå", "Change level"],
    "Nimimerkki, 3 kirjainta": ["Signatur, 3 bokstäver", "Initials, 3 letters"],
    "Taso": ["Nivå", "Level"],
    "Top 20": ["Topp 20", "Top 20"],
    "Top 10": ["Topp 10", "Top 10"],
    "Uusi ennätys! Sijoitus 1.": ["Nytt rekord! Plats 1.", "New record! 1st place."],
    "Kirjoita kolme merkkiä, esimerkiksi TOM.": ["Skriv tre tecken, till exempel TOM.", "Enter three characters, for example TOM."],
    "Ma": ["Må", "Mo"], "Ti": ["Ti", "Tu"], "Ke": ["On", "We"], "To": ["To", "Th"], "Pe": ["Fr", "Fr"], "La": ["Lö", "Sa"], "Su": ["Sö", "Su"]
  };

  var CHEER = { "Oikein!": ["Rätt!", "Correct!"], "Hyvä putki!": ["Bra svit!", "Nice streak!"], "Tulessa!": ["Du är het!", "On fire!"], "Mahtava putki!": ["Fantastisk svit!", "Amazing streak!"] };
  var SYMRE = "(J|Q|K|A|Kahvi|Kirja|Shakki|Kitara|Timantti)";
  // [säännöllinen lauseke, ruotsi, englanti]; käännös on merkkijono ($1…) tai funktio (m) => teksti
  var P = [
    // Miinaharava
    [/^Top 10 · (Helppo|Keskitaso|Vaikea)$/, function (m) { return "Topp 10 · " + D[m[1]][0]; }, function (m) { return "Top 10 · " + D[m[1]][1]; }],
    [/^🚩 Lippu-tila: (pois|päällä)$/, function (m) { return "🚩 Flaggläge: " + (m[1] === "pois" ? "av" : "på"); }, function (m) { return "🚩 Flag mode: " + (m[1] === "pois" ? "off" : "on"); }],
    // Pisteholvi
    [/^(\d+) voittolinjaa ·$/, "$1 vinstlinjer ·", "$1 winning lines ·"],
    [new RegExp("^" + SYMRE + " × (\\d) ·$"), function (m) { return sym(m[1], 0) + " × " + m[2] + " ·"; }, function (m) { return sym(m[1], 1) + " × " + m[2] + " ·"; }],
    [new RegExp("^(\\S+) " + SYMRE + "$"), function (m) { return m[1] + " " + sym(m[2], 0); }, function (m) { return m[1] + " " + sym(m[2], 1); }],
    [/^(\d+) kolikkoa!$/, "$1 mynt!", "$1 coins!"],
    [/^Holvin saalis: (\d+) kolikkoa( ·)?$/, function (m) { return "Valvets byte: " + m[1] + " mynt" + (m[2] || ""); }, function (m) { return "Vault haul: " + m[1] + " coins" + (m[2] || ""); }],
    [/^(\d+) kolikkoa( ·)?$/, function (m) { return m[1] + " mynt" + (m[2] || ""); }, function (m) { return m[1] + " coins" + (m[2] || ""); }],
    // Presidenttivisa
    [/^Kuka oli (\d+)\. presidentti\?$/, function (m) { return "Vem var den " + svOrd(m[1]) + " presidenten?"; }, function (m) { return "Who was the " + ord(m[1]) + " president?"; }],
    [/^Kuka oli presidenttinä vuonna (\d+)\?$/, "Vem var president år $1?", "Who was president in $1?"],
    [/^(\d+) \/ (\d+) · (\d+) oikein$/, "$1 / $2 · $3 rätt", "$1 / $2 · $3 correct"],
    [/^· paras (\d+)%$/, "· bästa $1 %", "· best $1%"],
    [/^(.+) \((\d)\. kausi\)$/, function (m) { return m[1] + " (" + (m[2] === "1" ? "första" : "andra") + " perioden)"; }, function (m) { return m[1] + " (" + ord(m[2]) + " term)"; }],
    // Doomsday
    [/^Vuosisadan (\d+) koodi on$/, "Sekelkoden för $1 är", "The century code for $1 is"],
    [new RegExp("^\\(" + DAYRE + "\\)$"), "({d1})", "({d1})"],
    [new RegExp("^→ vuoden (\\d+) tuomiopäivä on " + DAYRE + "$"), "→ domedagen för $1 är {d2}", "→ the doomsday for $1 is {d2}"],
    [new RegExp("^Muistipäivä (\\S+) on " + DAYRE + "$"), "Minnesdagen $1 är en {d2}", "The anchor date $1 is a {d2}"],
    [new RegExp("^(\\S+) on itse muistipäivä → " + DAYRE + "$"), "$1 är själv en minnesdag → {d2}", "$1 is itself an anchor date → {d2}"],
    [/^Kuukauden muistipäivä on (.+)$/, "Månadens minnesdag är $1", "The month's anchor date is $1"],
    [/^Vihje \((\d+)\/(\d+)\)$/, "Ledtråd ($1/$2)", "Hint ($1/$2)"],
    [/^(Oikein!|Hyvä putki!|Tulessa!|Mahtava putki!) \+(\d+)$/, "{c1} +$2", "{c1} +$2"],
    [/^\(putkibonus \+(\d+)\)$/, "(svitbonus +$1)", "(streak bonus +$1)"],
    [new RegExp("^Väärin, oikea vastaus on " + DAYRE + "\\.$"), "Fel, rätt svar är {d1}.", "Wrong, the answer is {d1}."],
    [/^(\d+)\/(\d+) oikein · pisin putki (\d+) · aika (\d+) min (\d+) s$/, "$1/$2 rätt · längsta svit $3 · tid $4 min $5 s", "$1/$2 correct · longest streak $3 · time $4 min $5 s"],
    [/^(\d+)\/(\d+) oikein$/, "$1/$2 rätt", "$1/$2 correct"],
    [/^Pääsit listalle sijalle (\d+)\.$/, "Du kom in på listan på plats $1.", "You made the list in place $1."]
  ];

  // Rikkaat kappaleet (sisältävät lihavointeja), käännetään kokonaisina
  var RICH = {
    "dd-h1": ["Idén är enkel: varje år infaller vissa lättminnta datum, som 4/4, 6/6 och 12/12, alltid på samma veckodag. Den veckodagen kallas årets <b>domedag</b>. När du vet den räknar du bara några dagar framåt eller bakåt.",
              "The idea is simple: every year, certain easy-to-remember dates such as 4/4, 6/6 and 12/12 always fall on the same day of the week. That day is called the year's <b>doomsday</b>. Once you know it, you just count a few days forward or back."],
    "ph-r1": ["En vinst uppstår när samma symbol finns minst tre gånger i rad på en vinstlinje, räknat från vänster kant. Det finns tio linjer. Nyckeln 🗝️ är joker och ersätter alla symboler utom myntet.",
              "You win when the same symbol appears at least three times in a row on a winning line, starting from the left edge. There are ten lines. The key 🗝️ is wild and replaces any symbol except the coin."],
    "ph-r2": ["<b>Valvbonus:</b> när det finns minst sex mynt på skärmen öppnas valvet. Mynten låses och du får tre extra snurr. Varje nytt mynt återställer snurren till tre. Till sist får du poängen från alla mynt. Om hela skärmen fylls får du dessutom 250 gånger insatsen.",
              "<b>Vault bonus:</b> when there are at least six coins on screen, the vault opens. The coins lock and you get three extra spins. Every new coin resets the spins to three. At the end you get the points from all the coins. If the whole screen fills up, you also get 250 times your bet."],
    "ph-r3": ["<b>Fem mynt:</b> om det finns exakt fem mynt låses de och de andra rutorna snurrar en gång till. Ett enda nytt mynt öppnar valvet. Det här extrasnurret ger inga linjevinster.",
              "<b>Five coins:</b> if there are exactly five coins, they lock and the other squares spin once more. A single new coin opens the vault. This extra spin does not pay line wins."],
    "ph-r4": ["<b>2×-omgång:</b> i valvbonusen kan vilket snurr som helst bli en 2×-omgång. Då är mynten som landar på det snurret värda dubbelt.",
              "<b>2× round:</b> in the vault bonus, any spin can be a 2× round. The coins that land on that spin are then worth double."],
    "ph-r5": ["<b>Dubbling:</b> efter en vinst kan du gissa om det blir krona eller klave. Rätt gissning dubblar vinsten, fel gissning tar den. Du kan dubbla högst fem gånger i rad.",
              "<b>Double-up:</b> after a win you can guess heads or tails. A right guess doubles the win, a wrong guess loses it. You can double at most five times in a row."],
    "ph-r6": ["Resultaten slumpas fram. På lång sikt ger spelet tillbaka ungefär lika många poäng som insatserna kostar, så vinster och förluster jämnar ut sig. Du kan alltid hämta fler poäng gratis.",
              "The results are random. In the long run the game pays back roughly as many points as the bets cost, so wins and losses even out. You can always get more points for free."]
  };

  // Presidenttivisan faktat: numero → [perusfakta, lisäfakta 1, lisäfakta 2]
  var PV_SV = {
    1: ["Den enda presidenten som har valts med elektorernas enhälliga röster.", "Hans löständer innehöll inget trä: de var gjorda av bland annat flodhästelfenben samt tänder från djur och människor.", "Bodde aldrig i Vita huset – det blev färdigt först efter hans död."],
    2: ["Den första presidenten som bodde i Vita huset.", "Dog samma dag som Jefferson: 4 juli 1826, på självständighetsförklaringens 50-årsdag.", "Försvarade som jurist de brittiska soldaterna i rättegången efter Bostonmassakern."],
    3: ["Självständighetsförklaringens huvudförfattare. Köpte Louisianaterritoriet av Frankrike.", "Grundade University of Virginia.", "Sålde sitt bibliotek till kongressen när britterna hade bränt kongressbiblioteket 1814."],
    4: ["Han kallas konstitutionens fader.", "Den kortaste presidenten, bara omkring 163 cm.", "Britterna brände Vita huset under hans tid, 1814."],
    5: ["Monroedoktrinen: Europa får inte blanda sig i Amerikas angelägenheter.", "Liberias huvudstad Monrovia är uppkallad efter honom.", "Dog den 4 juli 1831 – den tredje presidenten som dog på självständighetsdagen."],
    6: ["Son till den andra presidenten, John Adams.", "Satt efter sin presidenttid ytterligare 17 år i representanthuset.", "Lär ha simmat i Potomacfloden på morgnarna."],
    7: ["Hans porträtt finns på 20-dollarsedeln.", "Utkämpade flera dueller, och en kula satt kvar i hans bröst resten av livet.", "Den första presidenten som utsattes för ett mordförsök (1835). Angriparens båda pistoler klickade."],
    8: ["Den första presidenten som föddes i det självständiga USA.", "Hans modersmål var nederländska.", "Ordet OK:s popularitet kopplas ofta till hans smeknamn Old Kinderhook."],
    9: ["Dog bara omkring en månad efter sitt tillträde.", "Höll historiens längsta installationstal, nästan två timmar i kallt väder.", "Hans sonson Benjamin Harrison blev den 23:e presidenten."],
    10: ["Den första vicepresidenten som blev president när företrädaren dog.", "Han hade 15 barn, fler än någon annan president.", "Några av hans barnbarn levde ännu på 2000-talet."],
    11: ["USA växte under hans tid ända till Stilla havet.", "Lovade att bara sitta en period och höll sitt löfte.", "Dog bara omkring tre månader efter att hans period tog slut."],
    12: ["Hjälte från mexikanska kriget, dog i ämbetet.", "Hade såvitt man vet aldrig röstat i ett presidentval före sitt eget.", "Hans häst Old Whitey betade på Vita husets gräsmatta."],
    13: ["Den sista presidenten från whigpartiet.", "Grundade såvitt man vet Vita husets första bibliotek.", "Skickade kommendör Perry med sin flotta för att öppna Japan för handel."],
    14: ["Kansas–Nebraska-lagen skärpte slaveristriden under hans tid.", "Höll sitt installationstal utantill, utan papper.", "Studerade vid samma college som författaren Nathaniel Hawthorne, som skrev hans valbiografi."],
    15: ["Den enda presidenten som aldrig gifte sig.", "Den enda presidenten från Pennsylvania.", "Många historiker räknar honom som en av de svagaste presidenterna."],
    16: ["Ledde landet genom inbördeskriget och avskaffade slaveriet. Mördades 1865.", "Den längsta presidenten, omkring 193 cm.", "Den enda presidenten med ett patent: en anordning för att lyfta båtar över grund."],
    17: ["Den första presidenten som ställdes inför riksrätt.", "Gick inte en enda dag i skolan och var skräddare till yrket.", "Under hans tid köpte USA Alaska av Ryssland, 1867."],
    18: ["Nordstaternas överbefälhavare i inbördeskriget.", "Hans memoarer gavs ut av Mark Twains förlag.", "Enligt historien fick han fortkörningsböter med häst och vagn när han var president."],
    19: ["Vann ett av historiens mest omstridda val, 1876.", "Den första presidenten som hade telefon i Vita huset.", "Hans fru serverade ingen alkohol och fick smeknamnet Lemonade Lucy."],
    20: ["Sköts bara några månader efter sitt tillträde.", "Kom på ett eget bevis för Pythagoras sats.", "Enligt historien kunde han skriva latin med ena handen och grekiska med den andra samtidigt."],
    21: ["Reformerade hur federala tjänstemän anställs.", "Var känd för sin eleganta klädstil och smeknamnet Elegant Arthur.", "Dolde sin allvarliga njursjukdom under hela sin tid i ämbetet."],
    22: ["Satt två skilda perioder: han är både den 22:a och den 24:e presidenten.", "Den enda presidenten som har gift sig i Vita huset (1886).", "Var som ung sheriff och verkställde själv två hängningar."],
    23: ["Sonson till den 9:e presidenten, William Henry Harrison.", "Elektriskt ljus installerades i Vita huset under hans tid, men familjen vågade först inte röra strömbrytarna.", "Under hans tid anslöt sig sex nya delstater till unionen."],
    24: ["Återvände till ämbetet efter fyra års uppehåll.", "Opererades i hemlighet på en lustjakt för en tumör i gommen 1893.", "Chokladkakan Baby Ruth sägs ha fått sitt namn efter hans dotter Ruth."],
    25: ["Mördades 1901 i början av sin andra period.", "Bar en röd nejlika i knapphålet som lyckoblomma.", "Under hans tid annekterade USA Hawaii."],
    26: ["Teddybjörnen är uppkallad efter honom.", "Den yngsta presidenten: 42 år vid tillträdet.", "Sköts 1912 i början av ett tal men höll talet till slut – talmanuset i bröstfickan bromsade kulan."],
    27: ["Blev senare ordförande i Högsta domstolen.", "Den tyngsta presidenten, som mest över 150 kg.", "Inledde traditionen att presidenten kastar basebollsäsongens första kast."],
    28: ["Ledde USA in i första världskriget och drev på för Nationernas förbund.", "Den enda presidenten med doktorsexamen.", "Fick Nobels fredspris 1919."],
    29: ["Dog i ämbetet. Hans administration kantades av skandaler.", "Den första sittande senatorn som valdes till president.", "Var tidningsutgivare före politiken."],
    30: ["Kallades Tysta Cal för att han var så fåordig.", "Svor presidenteden på natten på sin fars gård i skenet av en fotogenlampa – eden togs av hans far.", "Han hade en tvättbjörn som hette Rebecca som husdjur i Vita huset."],
    31: ["Börskraschen och den stora depressionen började under hans tid.", "Skänkte sin presidentlön till välgörenhet.", "Talade kinesiska med sin fru när de inte ville att andra skulle förstå."],
    32: ["Den enda presidenten som har valts mer än två gånger (fyra gånger).", "Insjuknade i polio 1921 och använde rullstol, vilket sällan visades offentligt.", "Efter honom infördes en gräns på två perioder i konstitutionen."],
    33: ["Fattade beslutet att använda atombomberna mot Japan.", "Hans andra namn är bara bokstaven S.", "På hans skrivbord stod skylten \"The buck stops here\" – ansvaret stannar här."],
    34: ["De allierades överbefälhavare vid landstigningen i Normandie.", "Lät bygga USA:s motorvägsnät.", "Lät anlägga en övningsgreen för golf på Vita husets tomt."],
    35: ["Mördades i Dallas i november 1963.", "Den yngsta folkvalda presidenten, 43 år.", "Den första katolska presidenten."],
    36: ["Undertecknade medborgarrättslagen 1964.", "Svor presidenteden ombord på ett flygplan efter mordet på Kennedy.", "Hela familjens initialer var LBJ: Lady Bird, Lynda Bird och Luci Baines."],
    37: ["Den enda presidenten som har avgått (Watergate).", "Besökte Kina 1972 som den första sittande presidenten.", "Ringde 1969 ett samtal till astronauterna på månens yta."],
    38: ["Den enda presidenten som varken valdes till president eller vicepresident.", "Överlevde två mordförsök under samma månad 1975.", "Var som ung en lovande spelare i amerikansk fotboll."],
    39: ["Fick Nobels fredspris 2002.", "Levde längre än någon annan president, till 100 års ålder.", "Var jordnötsodlare före politiken."],
    40: ["Var Hollywoodskådespelare före politiken.", "Överlevde ett mordförsök 1981, bara 69 dagar efter sitt tillträde.", "Var ordförande för skådespelarfacket i Hollywood."],
    41: ["Kalla kriget tog slut och Sovjetunionen upplöstes under hans tid.", "Hoppade fallskärm på sin 75-, 80-, 85- och 90-årsdag.", "Pilot i andra världskriget som sköts ner över Stilla havet."],
    42: ["Arkansas tidigare guvernör, spelar saxofon.", "Träffade som ung president Kennedy i Vita huset 1963.", "Har vunnit en Grammy för ett album med talat ord."],
    43: ["Son till den 41:a presidenten. Attackerna den 11 september skedde under hans tid.", "Den enda presidenten med MBA-examen.", "Målar numera oljemålningar."],
    44: ["Den första afroamerikanska presidenten.", "Bodde som barn några år i Indonesien.", "Fick Nobels fredspris 2009."],
    45: ["Affärsman och tv-personlighet före politiken.", "Var programledare för tv-programmet The Apprentice.", "Han har en stjärna på Hollywood Walk of Fame."],
    46: ["Var tidigare Obamas vicepresident.", "Valdes in i senaten redan som 29-åring (1972).", "Var vid tillträdet 2021 den dittills äldsta presidenten."],
    47: ["Den andra efter Cleveland som återvände till ämbetet för en skild period.", "Den äldsta presidenten vid tillträdet, 78 år.", "Hans vicepresident är JD Vance."]
  };
  var PV_EN = {
    1: ["The only president elected by a unanimous vote of the electors.", "His false teeth contained no wood: they were made of hippopotamus ivory, among other things, and of animal and human teeth.", "Never lived in the White House – it was finished only after his death."],
    2: ["The first president to live in the White House.", "Died on the same day as Jefferson: 4 July 1826, the 50th anniversary of the Declaration of Independence.", "As a lawyer, defended the British soldiers in the Boston Massacre trial."],
    3: ["Main author of the Declaration of Independence. Bought the Louisiana Territory from France.", "Founded the University of Virginia.", "Sold his library to Congress after the British burned the Library of Congress in 1814."],
    4: ["He is called the Father of the Constitution.", "The shortest president, only about 163 cm (5 ft 4 in).", "The British burned the White House during his term, in 1814."],
    5: ["The Monroe Doctrine: Europe must not interfere in the affairs of the Americas.", "Liberia's capital, Monrovia, is named after him.", "Died on 4 July 1831 – the third president to die on Independence Day."],
    6: ["Son of the second president, John Adams.", "After his presidency he served another 17 years in the House of Representatives.", "Is said to have swum in the Potomac River in the mornings."],
    7: ["His portrait is on the 20-dollar bill.", "Fought several duels, and one bullet stayed in his chest for the rest of his life.", "The first president to face an assassination attempt (1835). Both of the attacker's pistols misfired."],
    8: ["The first president born in the independent United States.", "His first language was Dutch.", "The popularity of the word OK is often linked to his nickname, Old Kinderhook."],
    9: ["Died only about a month after taking office.", "Gave the longest inaugural address in history, nearly two hours in cold weather.", "His grandson Benjamin Harrison was the 23rd president."],
    10: ["The first vice president to become president on the death of his predecessor.", "He had 15 children, more than any other president.", "Some of his grandsons were still alive in the 2000s."],
    11: ["During his term the US expanded all the way to the Pacific.", "Promised to serve only one term and kept his promise.", "Died only about three months after his term ended."],
    12: ["Hero of the Mexican–American War, died in office.", "As far as is known, had never voted in a presidential election before his own.", "His horse Old Whitey grazed on the White House lawn."],
    13: ["The last president from the Whig Party.", "Is said to have set up the first library in the White House.", "Sent Commodore Perry and his fleet to open Japan to trade."],
    14: ["The Kansas–Nebraska Act sharpened the dispute over slavery during his term.", "Gave his inaugural address from memory, without notes.", "Studied at the same college as the writer Nathaniel Hawthorne, who wrote his campaign biography."],
    15: ["The only president who never married.", "The only president from Pennsylvania.", "Many historians rank him among the weakest presidents."],
    16: ["Led the country through the Civil War and abolished slavery. Assassinated in 1865.", "The tallest president, about 193 cm (6 ft 4 in).", "The only president to hold a patent: a device for lifting boats over shoals."],
    17: ["The first president to be impeached.", "Never went to school for a single day and was a tailor by trade.", "During his term the US bought Alaska from Russia, in 1867."],
    18: ["Commander of the Union armies in the Civil War.", "His memoirs were published by Mark Twain's publishing house.", "According to the story, he got a speeding ticket in a horse-drawn carriage while president."],
    19: ["Won one of the most disputed elections in history, in 1876.", "The first president to have a telephone in the White House.", "His wife served no alcohol and was nicknamed Lemonade Lucy."],
    20: ["Was shot only a few months after taking office.", "Devised his own proof of the Pythagorean theorem.", "According to the story, he could write Latin with one hand and Greek with the other at the same time."],
    21: ["Reformed the hiring of federal civil servants.", "Was known for dressing stylishly and for the nickname Elegant Arthur.", "Kept his serious kidney disease secret throughout his term."],
    22: ["Served two separate terms: he is both the 22nd and the 24th president.", "The only president to be married in the White House (1886).", "As a young sheriff he personally carried out two hangings."],
    23: ["Grandson of the 9th president, William Henry Harrison.", "Electric lights were installed in the White House during his term, but at first the family did not dare touch the switches.", "Six new states joined the Union during his term."],
    24: ["Returned to office after a four-year break.", "Had secret surgery on a yacht for a tumour in his mouth in 1893.", "The Baby Ruth chocolate bar is said to have been named after his daughter Ruth."],
    25: ["Assassinated in 1901 at the start of his second term.", "Wore a red carnation in his buttonhole as a lucky flower.", "During his term the US annexed Hawaii."],
    26: ["The teddy bear is named after him.", "The youngest president: 42 years old when he took office.", "Was shot in 1912 at the start of a speech but finished it – the folded speech in his breast pocket slowed the bullet."],
    27: ["Later served as Chief Justice of the Supreme Court.", "The heaviest president, at most over 150 kg (330 lb).", "Started the tradition of the president throwing the first pitch of the baseball season."],
    28: ["Led the US into the First World War and championed the League of Nations.", "The only president with a doctoral degree.", "Won the Nobel Peace Prize in 1919."],
    29: ["Died in office. His administration was overshadowed by scandals.", "The first sitting senator to be elected president.", "Was a newspaper publisher before politics."],
    30: ["Nicknamed Silent Cal because he spoke so little.", "Took the oath of office at night on his father's farm by the light of an oil lamp – his father administered it.", "He kept a pet raccoon named Rebecca in the White House."],
    31: ["The stock market crash and the Great Depression began during his term.", "Donated his presidential salary to charity.", "Spoke Chinese with his wife when they did not want others to understand."],
    32: ["The only president elected more than twice (four times).", "Contracted polio in 1921 and used a wheelchair, which was rarely shown in public.", "After him, a two-term limit was added to the Constitution."],
    33: ["Made the decision to use the atomic bombs against Japan.", "His middle name is just the letter S.", "A sign on his desk read \"The buck stops here\"."],
    34: ["Supreme Commander of the Allied forces at the Normandy landings.", "Had the US Interstate Highway System built.", "Had a golf putting green installed on the White House grounds."],
    35: ["Assassinated in Dallas in November 1963.", "The youngest president ever elected, at 43.", "The first Catholic president."],
    36: ["Signed the Civil Rights Act of 1964.", "Took the oath of office on an aeroplane after Kennedy's assassination.", "The whole family's initials were LBJ: Lady Bird, Lynda Bird and Luci Baines."],
    37: ["The only president to have resigned (Watergate).", "Visited China in 1972 as the first sitting president to do so.", "In 1969 made a phone call to the astronauts on the surface of the Moon."],
    38: ["The only president who was elected neither president nor vice president.", "Survived two assassination attempts in the same month in 1975.", "Was a promising American football player in his youth."],
    39: ["Won the Nobel Peace Prize in 2002.", "Lived longer than any other president, to the age of 100.", "Was a peanut farmer before politics."],
    40: ["Was a Hollywood actor before politics.", "Survived an assassination attempt in 1981, only 69 days after taking office.", "Was president of the Screen Actors Guild in Hollywood."],
    41: ["The Cold War ended and the Soviet Union broke up during his term.", "Went skydiving on his 75th, 80th, 85th and 90th birthdays.", "A Second World War pilot who was shot down over the Pacific."],
    42: ["Former governor of Arkansas, plays the saxophone.", "As a young man he met President Kennedy at the White House in 1963.", "Has won a Grammy Award for a spoken-word album."],
    43: ["Son of the 41st president. The September 11 attacks happened during his term.", "The only president with an MBA.", "Nowadays paints oil paintings."],
    44: ["The first African American president.", "Lived in Indonesia for a few years as a child.", "Won the Nobel Peace Prize in 2009."],
    45: ["Businessman and TV personality before politics.", "Hosted the TV show The Apprentice.", "He has a star on the Hollywood Walk of Fame."],
    46: ["Previously served as Obama's vice president.", "Was elected to the Senate at just 29 (1972).", "When he took office in 2021 he was the oldest president up to that point."],
    47: ["The second after Cleveland to return to office for a separate term.", "The oldest president to take office, at 78.", "His vice president is JD Vance."]
  };
  // Liitetään faktat sanakirjaan sivun omien suomenkielisten tekstien perusteella
  (function () {
    var gp, gf;
    try { gp = (0, eval)("typeof P!=='undefined'&&Array.isArray(P)&&typeof F!=='undefined'?[P,F]:null"); } catch (e) { gp = null; }
    if (!gp) return;
    gf = gp[1]; gp = gp[0];
    gp.forEach(function (p) {
      var n = p[0], fi = [p[4]].concat(gf[n] || []);
      fi.forEach(function (s, k) { if (s && PV_SV[n] && PV_SV[n][k] && PV_EN[n] && PV_EN[n][k]) D[s] = [PV_SV[n][k], PV_EN[n][k]]; });
    });
  })();

  var lang = "fi";
  try { var saved = localStorage.getItem("kieli"); if (LANGS.indexOf(saved) > 0) lang = saved; } catch (e) {}
  var orig = new WeakMap(), out = new WeakMap();
  var ATTRS = ["aria-label", "placeholder", "title", "alt"];

  function trCore(s) {
    if (lang === "fi" || !s) return s;
    var i = lang === "sv" ? 0 : 1;
    if (D.hasOwnProperty(s)) return D[s][i];
    for (var k = 0; k < P.length; k++) {
      var m = s.match(P[k][0]);
      if (!m) continue;
      var t = P[k][1 + i];
      if (typeof t === "function") return t(m);
      return t.replace(/\{d(\d)\}/g, function (_, g) { return day(m[+g], i); })
        .replace(/\{c(\d)\}/g, function (_, g) { return CHEER[m[+g]][i]; })
        .replace(/\$(\d)/g, function (_, g) { return m[+g]; });
    }
    return IS_DD ? s.replace(new RegExp(DAYRE, "g"), function (w) { return day(w, i); }) : s;
  }
  function tr(s) {
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/);
    return m[1] + trCore(m[2]) + m[3];
  }
  function skip(el) {
    for (; el && el !== document.body; el = el.parentNode) {
      var t = el.nodeName;
      if (t === "SCRIPT" || t === "STYLE" || t === "svg" || t === "TEXTAREA") return true;
      if (el.hasAttribute && (el.hasAttribute("data-i18n") || el.hasAttribute("data-noi18n"))) return true;
    }
    return false;
  }
  function doText(n) {
    if (!/[A-Za-zÅÄÖåäö]/.test(n.data)) return;
    var base = out.has(n) && out.get(n) === n.data ? orig.get(n) : n.data;
    orig.set(n, base);
    var r = tr(base);
    out.set(n, r);
    if (n.data !== r) n.data = r;
  }
  function doAttrs(el) {
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var key = "__i18n_" + a, cur = el.getAttribute(a);
      var base = el[key] && el[key].out === cur ? el[key].orig : cur;
      var r = tr(base);
      el[key] = { orig: base, out: r };
      if (cur !== r) el.setAttribute(a, r);
    });
  }
  function walk(root) {
    if (root.nodeType === 3) { if (!skip(root.parentNode)) doText(root); return; }
    if (root.nodeType === 1 && root.nodeName === "svg") { doAttrs(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    doAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (n) {
        if (n.nodeType === 1 && n.nodeName === "svg") { doAttrs(n); return NodeFilter.FILTER_REJECT; }
        if (n.nodeType === 1) return skip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  function rich() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!el.__fi) el.__fi = el.innerHTML;
      var t = RICH[el.getAttribute("data-i18n")];
      el.innerHTML = lang === "fi" || !t ? el.__fi : t[lang === "sv" ? 0 : 1];
    });
  }

  // Valitsimen tyylit
  var css = document.createElement("style");
  css.textContent =
    ".lang{position:absolute;top:.75rem;right:max(16px,env(safe-area-inset-right,0px));z-index:20;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".lang-btn{display:inline-flex;align-items:center;gap:.35rem;font:inherit;font-size:.8rem;letter-spacing:.06em;color:inherit;opacity:.8;background:Canvas;background:var(--bg,Canvas);border:1px solid rgba(128,128,128,.45);border-radius:999px;padding:.3rem .65rem;cursor:pointer}" +
    ".lang-btn:hover,.lang-btn[aria-expanded=true]{opacity:1}" +
    ".lang-menu{position:absolute;right:0;top:calc(100% + .35rem);margin:0;padding:.25rem;list-style:none;background:Canvas;background:var(--bg,Canvas);border:1px solid rgba(128,128,128,.45);border-radius:10px;min-width:8rem;box-shadow:0 6px 20px rgba(0,0,0,.2)}" +
    ".lang-menu[hidden]{display:none}" +
    ".lang-menu button{display:block;width:100%;text-align:left;font:inherit;font-size:.95rem;color:inherit;background:none;border:0;border-radius:6px;padding:.45rem .6rem;cursor:pointer}" +
    ".lang-menu button:hover,.lang-menu button:focus-visible{background:rgba(128,128,128,.18)}" +
    ".lang-menu button[aria-checked=true]{font-weight:700}";
  document.head.appendChild(css);

  // Valitsin
  var NAMES = { fi: "Suomi", sv: "Svenska", en: "English" };
  var box = document.createElement("div");
  box.className = "lang"; box.setAttribute("data-noi18n", "");
  box.innerHTML = '<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Kieli / Språk / Language">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>' +
    '<span class="lang-code"></span></button><ul class="lang-menu" role="menu" hidden></ul>';
  document.body.insertBefore(box, document.body.firstChild);
  var btn = box.querySelector(".lang-btn"), menu = box.querySelector(".lang-menu"), code = box.querySelector(".lang-code");
  LANGS.forEach(function (l) {
    var li = document.createElement("li"), b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "menuitemradio"); b.lang = l; b.dataset.l = l; b.textContent = NAMES[l];
    b.addEventListener("click", function () { setLang(l); close(); btn.focus(); });
    li.appendChild(b); menu.appendChild(li);
  });
  function close() { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = menu.hidden;
    menu.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var cur = menu.querySelector('[data-l="' + lang + '"]'); if (cur) cur.focus(); }
  });
  document.addEventListener("click", function (e) { if (!box.contains(e.target)) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });

  var mo;
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("kieli", l); } catch (e) {}
    document.documentElement.lang = l;
    code.textContent = l.toUpperCase();
    menu.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.l === l ? "true" : "false"); });
    if (mo) mo.disconnect();
    rich(); walk(document.body);
    try { document.dispatchEvent(new CustomEvent("kielivaihto", { detail: l })); } catch (e) {}
    if (mo) mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  mo = new MutationObserver(function (list) {
    mo.disconnect();
    list.forEach(function (r) {
      if (r.type === "childList") r.addedNodes.forEach(walk);
      else if (r.type === "characterData") { if (!skip(r.target.parentNode)) doText(r.target); }
      else if (r.target.nodeName === "svg" || !skip(r.target)) doAttrs(r.target);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  });
  setLang(lang);
})();
