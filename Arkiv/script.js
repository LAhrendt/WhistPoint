function nyt_spil() {
    w3_close("spil.nyt_spil.err");

    var err_str = "";
    var spil = {
        navn: document.getElementById("spil.nyt_spil.spil_navn").value.trim(),
        spiller1_navn: document.getElementById("spil.nyt_spil.spiller1_navn").value.trim(),
        spiller2_navn: document.getElementById("spil.nyt_spil.spiller2_navn").value.trim(),
        spiller3_navn: document.getElementById("spil.nyt_spil.spiller3_navn").value.trim(),
        spiller4_navn: document.getElementById("spil.nyt_spil.spiller4_navn").value.trim(),
        grundtakst: parseInt(document.getElementById("spil.nyt_spil.grundtakst").value)
    };

    // Tjekker om spilnavnet er tastet
    if (spil.navn == "") {
        err_str += "<p>Indtast et navn til dit spil.</p>";
    }

    // Tjekker for om alle spillernavne er unikke.
    var spillernavne = [spil.spiller1_navn, spil.spiller2_navn, spil.spiller3_navn, spil.spiller4_navn];
    if ((new Set(spillernavne)).size !== spillernavne.length) {
        err_str += "<p>Sørg for at alle spillernavne er unikke.</p>";
    }

    for (var i = 0; i < spillernavne.length; i++) {
        if (spillernavne[i] == "") {
            err_str += "<p>Husk at indtaste navne til alle spillerne.</p>";
            break;
        }
    }

    // Tjek om grundtaksten er mindst 1.
    if ((Number.isInteger(spil.grundtakst) && spil.grundtakst >= 1) == false) {
        err_str += "<p>Sørg for at grundtaksten er et helt, positivt tal.</p>"
    }
    
    if (err_str) {
        document.getElementById("spil.nyt_spil.err").innerHTML = "<h2>Fejl!</h2>" + err_str;
        w3_open("spil.nyt_spil.err");
    } else {
        // Der er ingen problemer og man kan starte et spil.
        spil.oprettet = new Date();
        spil.sidst_spillet = null;

        spil.spiller1_point = [0];
        spil.spiller2_point = [0];
        spil.spiller3_point = [0];
        spil.spiller4_point = [0];

        var key = Date.parse(spil.oprettet);

        localStorage.setItem(key, JSON.stringify(spil));
        sessionStorage.current = key;
        start_spil();
    }
}

function gammelt_spil() {
    // Find tidligere spil.

    // Find alle keys i localStorage.
    var keys = Object.keys(localStorage).sort();
    if (keys.length == 0) {
        // Ingen tidligere spil.
        w3_open("spil.gammelt_spil.err");
        w3_close("spil.gammelt_spil.tabel");
    } else {
        w3_open("spil.gammelt_spil.tabel");
        w3_close("spil.gammelt_spil.err");
        var table = document.getElementById("spil.gammelt_spil.tabel");
        for (i=keys.length - 1; i >= 0; --i) {
            var data = JSON.parse(localStorage.getItem(keys[i]));
            var row = table.insertRow(-1);
            var cell_navn = row.insertCell(0);
            var cell_oprettet = row.insertCell(1);
            var cell_sidstspillet = row.insertCell(2);

            cell_navn.innerHTML = "<a href='javascript:void(0)' onclick='sessionStorage.current=" + keys[i] + 
                                    "; start_spil();'>" + data.navn + "</a>";

            var d = new Date(data.oprettet);
            cell_oprettet.innerHTML = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});

            if (data.sidst_spillet) {
                var d = new Date(typeof(data.sidst_spillet));
                cell_sidstspillet.innerHTML = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
            } else {
                // Sidst spillet er null
                cell_sidstspillet.innerHTML = "-";
            }
        }
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

function toggleAvanceret() {
    var avanceret = document.getElementById("spil.nyt_spil.avanceret");
    var tekst = document.getElementById("spil.nyt_spil.avanceret_tekst");
    if (avanceret.className.indexOf("w3-show") == -1) {
        avanceret.className += " w3-show";
        tekst.innerHTML = 'Avanceret <i class="fas fa-chevron-up"></i>';
    } else { 
        avanceret.className = avanceret.className.replace(" w3-show", "");
        tekst.innerHTML = 'Avanceret <i class="fas fa-chevron-down"></i>';
    }
}

function vis_div(div_id) {
    var x = document.getElementById("spil").querySelectorAll("div");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(div_id).style.display = "block";
}

function w3_open(element_id) {
    document.getElementById(element_id).style.display = "block";
}
   
function w3_close(element_id) {
    document.getElementById(element_id).style.display = "none";
}

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open_nav() {
    var mySidebar = document.getElementById("mySidebar");
    var overlayBg = document.getElementById("myOverlay");
    
    if (mySidebar.style.display === "block") {
      mySidebar.style.display = "none";
      overlayBg.style.display = "none";
    } else {
      mySidebar.style.display = "block";
      overlayBg.style.display = "block";
    }
}
  
  // Close the sidebar with the close button
function w3_close_nav() {
    var mySidebar = document.getElementById("mySidebar");
    var overlayBg = document.getElementById("myOverlay");

    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
}

Number.isInteger = Number.isInteger || function(value) {
    // Polyfill til IE
    return typeof value === 'number' && 
        isFinite(value) && 
        Math.floor(value) === value;
};