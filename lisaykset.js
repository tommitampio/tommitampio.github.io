// Etusivun lisäosiot: Päivän uutiset ja Kysy Tommilta.
// Lisää kaksi uutta laatikkoa Vastausten kirjan perään (ennen Omat kappaleet -osiota).
document.addEventListener("DOMContentLoaded", function () {
  var k = document.getElementById("kappaleet");
  if (!k || document.getElementById("uutiset-osio")) return;
  var l = "fi";
  try { l = localStorage.getItem("lang") || document.documentElement.lang || "fi"; } catch (e) {}
  var T = {
    fi: ["Päivän uutiset", "Tuoreimmat uutiset Helsingistä ja Ruotsista sekä päivän hyvä uutinen.", "Avaa uutiset →",
         "Kysy Tommilta", "Kysy sivusta, peleistä tai minusta – tai lähetä minulle terveiset.", "Kysy →"],
    sv: ["Dagens nyheter", "Senaste nytt från Helsingfors och Sverige samt dagens goda nyhet.", "Öppna nyheterna →",
         "Fråga Tommi", "Fråga om sidan, spelen eller mig – eller skicka mig en hälsning.", "Fråga →"],
    en: ["Today's news", "The latest from Helsinki and Sweden, plus the good news of the day.", "Open the news →",
         "Ask Tommi", "Ask about the site, the games or me – or send me a greeting.", "Ask →"]
  };
  var t = T[String(l).slice(0, 2)] || T.fi;
  function osio(id, otsikko, teksti, linkki, osoite) {
    var s = document.createElement("section");
    s.id = id;
    var h = document.createElement("h2"); h.textContent = otsikko;
    var d = document.createElement("div");
    var p1 = document.createElement("p"); p1.textContent = teksti;
    var p2 = document.createElement("p");
    var a = document.createElement("a"); a.className = "go"; a.href = osoite; a.textContent = linkki;
    p2.appendChild(a); d.appendChild(p1); d.appendChild(p2);
    s.appendChild(h); s.appendChild(d);
    k.parentNode.insertBefore(s, k);
  }
  osio("uutiset-osio", t[0], t[1], t[2], "uutiset.html");
  osio("kysy-osio", t[3], t[4], t[5], "kysy.html");
});
