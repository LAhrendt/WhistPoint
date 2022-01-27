function nyt_spil() {
    var spil = {
        navn: document.getElementById("spil_navn").value.trim(),
        spillere: [
            {spiller: document.getElementById("spiller1_navn").value.trim(), point: 0, ændring: ""},
            {spiller: document.getElementById("spiller2_navn").value.trim(), point: 0, ændring: ""},
            {spiller: document.getElementById("spiller3_navn").value.trim(), point: 0, ændring: ""},
            {spiller: document.getElementById("spiller4_navn").value.trim(), point: 0, ændring: ""},
        ], 
        grundtakst: parseInt(document.getElementById("grundtakst").value)
    };

    var err_str = "";
    // Tjekker om spilnavnet er tastet
    if (spil.navn == "") { err_str += "<p>Indtast et navn til dit spil.</p>"; }
    // Tjekker for om alle spillernavne er unikke.
    var spillernavne = [spil.spillere[0].spiller, spil.spillere[1].spiller, spil.spillere[2].spiller, spil.spillere[3].spiller];
    if ((new Set(spillernavne)).size !== spillernavne.length) { err_str += "<p>Sørg for at alle spillernavne er unikke.</p>"; }
    for (var i = 0; i < spillernavne.length; i++) {
        if (spillernavne[i] == "") {
            err_str += "<p>Husk at indtaste navne til alle spillerne.</p>";
            break;
        }
    }

    // Tjek om grundtaksten er mindst 1.
    if ((Number.isInteger(spil.grundtakst) && spil.grundtakst >= 1) == false) { err_str += "<p>Sørg for at grundtaksten er et helt, positivt tal.</p>" }
    
    if (err_str) {
        document.getElementById("err").innerHTML = "<h2>Fejl!</h2>" + err_str;
        w3.show("#err");
        return false;
    } else {
        // Der er ingen problemer og man kan starte et spil.
        spil.oprettet = new Date();
        spil.sidst_spillet = spil.oprettet;
        spil.key = Date.parse(spil.oprettet);

        localStorage.setItem(spil.key, JSON.stringify(spil));

        document.getElementById("gameKey").value = spil.key;
        return true;
    }
}

function gammelt_spil() {
    // Find tidligere spil.

    // Find alle keys i localStorage.
    var keys = Object.keys(localStorage).sort();

    if (keys.length > 0) {
        // Der findes spil.
        w3.hide("#err");
        var spil = {spil: []};
        for (var i = 0; i < keys.length; i++) {
            // Hent hvert spil.
            var tmp = JSON.parse(localStorage.getItem(keys[i]));
            spil.spil.push({
                key: tmp.key,
                navn: tmp.navn,
                dateToSort: tmp.sidst_spillet,
                sidst_spillet: toReadableDateSr(tmp.sidst_spillet)
            });
        }

        // Sorter arrayet så det nyeste spil er først.
        const { compare } = Intl.Collator('da-DK');
        spil.spil.sort((a, b) => compare(a.dateToSort, b.dateToSort));
        spil.spil.reverse();

        w3.displayObject("tabel", spil);
        w3.show("#tabel");
    }

    function toReadableDateSr(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }
}

function start_spil() {
    vis_div("spil.start_spil")
    document.getElementById("tester").style.display = "block";

    var spil = JSON.parse(localStorage.getItem(sessionStorage.current));
    document.getElementById("spil.start_spil.spilnavn").innerHTML = "<b>" + spil.navn + "</b>";
}

function melding() {
    var melding = document.getElementById("spil.start_spil.melding");
    var tillaeg = document.getElementById("spil.start_spil.tillæg");

    


    if (melding.value == parseInt(melding.value)) {
        // Der er tale om en tal-melding.
        tillaeg.disabled = false;

        if (tillaeg.value == "Vip") {
            document.getElementById("spil.start_spil.tillæg.vip.tr").style.visibility = "visible";
        } else {
            document.getElementById("spil.start_spil.tillæg.vip.tr").style.visibility = "collapse";
        }

        if (tillaeg.value == "Halve" || tillaeg.value == "Vip") {
            document.getElementById("spil.start_spil.tillæg.sans.td").style.visibility = "visible";
            document.getElementById("spil.start_spil.tillæg.gode.td").style.visibility = "visible";
        } else {
            document.getElementById("spil.start_spil.tillæg.sans.td").style.visibility = "collapse";
            document.getElementById("spil.start_spil.tillæg.gode.td").style.visibility = "collapse";
        }

    } else {
        // Find ud af, hvilken af de andre meldinger der er tale om.
        tillaeg.disabled = true;
        document.getElementById("spil.start_spil.tillæg.sans.td").style.visibility = "collapse";
        document.getElementById("spil.start_spil.tillæg.gode.td").style.visibility = "collapse";
        document.getElementById("spil.start_spil.tillæg.vip.tr").style.visibility = "collapse";
    }
}

function start_side() {
    if (typeof(Storage) == "undefined") {
        // Ingen localStorage
        document.getElementById("spil").innerHTML += 
            "<p>Din browser understøtter ikke localStorage (eller du har blokeret for det). Du skal tillade localStorage for at denne side fungerer.</p>";
    } else {
        vis_div("spil.vaelg");
    }
}

function gode_sans(id) {
    var check = document.getElementById(id).checked;
    if (id == "spil.start_spil.gode" && check) {
        document.getElementById("spil.start_spil.sans").checked = false;
    } else if (id == "spil.start_spil.sans" && check) {
        document.getElementById("spil.start_spil.gode").checked = false;
    }
}

function vis_div(div_id) {
    var x = document.getElementById("spil").querySelectorAll("div");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(div_id).style.display = "block";
}

Number.isInteger = Number.isInteger || function(value) {
    // Polyfill til IE
    return typeof value === 'number' && 
        isFinite(value) && 
        Math.floor(value) === value;
};