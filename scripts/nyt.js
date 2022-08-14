$(document).ready(function(){
    // Til boks med avancerede indstillinger
    $("#toggleAdvanced").click(function(){ $("#avanceret").toggle(); });

    // Til nyt spil
    $("#nytspilform").submit(function(event){
        var spil = {
            navn: $("#spil_navn").val().trim(),
            spillere: [
                {spiller: $("#spiller1_navn").val().trim(), point: [0], ændring: ""},
                {spiller: $("#spiller2_navn").val().trim(), point: [0], ændring: ""},
                {spiller: $("#spiller3_navn").val().trim(), point: [0], ændring: ""},
                {spiller: $("#spiller4_navn").val().trim(), point: [0], ændring: ""},
            ], 
            grundtakst: parseInt($("#grundtakst").val()),
            storslem: parseInt($("#storslemtakst").val()),
            sol: parseInt($("#soltakst").val())
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
    
        // Tjek at taksterne er mindst 1.
        if ((Number.isInteger(spil.grundtakst) && spil.grundtakst >= 1) == false) { err_str += "<p>Sørg for at grundtaksten er et helt, positivt tal.</p>" }
        if ((Number.isInteger(spil.storslem) && spil.storslem >= 1) == false) { err_str += "<p>Sørg for at taksten for storslem er et helt, positivt tal.</p>" }
        if ((Number.isInteger(spil.sol) && spil.sol >= 1) == false) { err_str += "<p>Sørg for at taksten for sol er et helt, positivt tal.</p>" }
        
        if (err_str) {
            $("#err").html("<h2>Fejl!</h2>" + err_str).show();
            event.preventDefault();
        } else {
            // Der er ingen problemer og man kan starte et spil.
            spil.oprettet = new Date();
            spil.sidst_spillet = spil.oprettet;
            spil.key = Date.parse(spil.oprettet);
    
            localStorage.setItem(spil.key, JSON.stringify(spil));
    
            $("#gameKey").val(spil.key);
        }
    })
});