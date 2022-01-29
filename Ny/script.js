function nyt_spil() {
    var spil = {
        navn: document.getElementById("spil_navn").value.trim(),
        spillere: [
            {spiller: document.getElementById("spiller1_navn").value.trim(), point: [0], ændring: ""},
            {spiller: document.getElementById("spiller2_navn").value.trim(), point: [0], ændring: ""},
            {spiller: document.getElementById("spiller3_navn").value.trim(), point: [0], ændring: ""},
            {spiller: document.getElementById("spiller4_navn").value.trim(), point: [0], ændring: ""},
        ], 
        grundtakst: parseInt(document.getElementById("grundtakst").value),
        storslem: 8,
        sol: 15
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
        return d.toLocaleDateString();// + " " + d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }
}

function tjekMelding() {
    var melding = document.getElementById("melding");
    var tillaeg = document.getElementById("tillæg");
    var tomTillaeg = document.createElement("option");

    if (melding.value == parseInt(melding.value)) {
        // Der er tale om en tal-melding.
        tillaeg.disabled = false;
        if (tillaeg.value == "") tillaeg.remove(0);

        if (tillaeg.value == "Vip") {
            document.getElementById("tillæg.vip.tr").style.visibility = "visible";
        } else {
            document.getElementById("tillæg.vip.tr").style.visibility = "collapse";
        }

        if (tillaeg.value == "Halve" || tillaeg.value == "Vip") {
            document.getElementById("tillæg.sans.td").style.visibility = "visible";
            document.getElementById("tillæg.gode.td").style.visibility = "visible";
        } else {
            document.getElementById("tillæg.sans.td").style.visibility = "collapse";
            document.getElementById("tillæg.gode.td").style.visibility = "collapse";
        }

    } else {
        // Find ud af, hvilken af de andre meldinger der er tale om.
        tillaeg.disabled = true;
        tillaeg.add(tomTillaeg, 0);
        tillaeg.selectedIndex = 0;

        document.getElementById("tillæg.sans.td").style.visibility = "collapse";
        document.getElementById("tillæg.gode.td").style.visibility = "collapse";
        document.getElementById("tillæg.vip.tr").style.visibility = "collapse";
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

function udregnPoint(data) {
    var melding = document.getElementById("melding").value;
    var tillaeg = document.getElementById("tillæg").value;
    var gode = document.getElementById("tillæg.gode").checked;
    var sans = document.getElementById("tillæg.sans").checked;

    var antalStik = parseInt(document.getElementById("antalStik").value);

    var takst = data.grundtakst;
    var sol = takst * data.sol;
    var storslem = takst * data.storslem;

    if (melding == parseInt(melding)) {
        // Der er tale om en tal-melding.
        melding = parseInt(melding);
        // Taksten fordobles for hver melding over 7.
        takst *= Math.pow(2, melding-7);

        // Taksten fordobles hvis der er meldt gode eller sans.
        if (tillaeg == "Gode" || tillaeg == "Sans") takst *= 2;
        // Den fordobles hvis der meldes halve og fordobles igen hvis der er tale om enten gode eller sans (kun en af dem kan gælde).
        else if (tillaeg == "Halve") takst *= Math.pow(2, 1 + gode + sans);
        // Den fordobles også for hver gang der vippes, samt hvis der er tale om gode eller sans.
        else if (tillaeg == "Vip") {
            takst *= Math.pow(2, 1 + gode + sans);
            if (document.getElementById("tillæg.vip.2").checked) takst *= 2;
            else if (document.getElementById("tillæg.vip.3").checked) takst *= 4;
        }

        if (antalStik >= melding) {
            // For hvert stik over meldingen får man taksten.
            takst *= antalStik - melding + 1;
        } else {
            // Taksten fordobles hvis man ikke opnår meldingen.
            takst *= 2;
            // For hvert stik under meldingen mister man taksten.
            takst *= antalStik - melding;
        }

        if (antalStik == 12 || antalStik == 1) takst += storslem/2;
        else if (antalStik == 13 || antalStik == 0) takst += storslem;

        console.log(takst);
        

    } else if (melding == "Sol") {
        takst = sol;
    } else if (melding = "Ren sol") {
        takst = sol * 2;
    } else if (melding = "Bordlægger"){
        takst = sol * 4;
    }

    return false;
}

Number.isInteger = Number.isInteger || function(value) {
    // Polyfill til IE
    return typeof value === 'number' && 
        isFinite(value) && 
        Math.floor(value) === value;
};