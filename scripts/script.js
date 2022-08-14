$(document).ready(function(){
    // Til boks på forsiden
    if (typeof(Storage) == "undefined") { $("#ikke-localstorage").show(); }

    // Header
    $("#openMenu").click(function(){ $(".nav").show(); });
    $("#closeMenu").click(function(){ $(".nav").hide(); });
});


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