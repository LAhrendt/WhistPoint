$(document).ready(function(){
    var key = getUrlParameter("id");
    if (key) {
        // Key findes
        var data = JSON.parse(localStorage.getItem(key));
        
    } else {
        // Key findes ikke
    }


    $(".tjekMelding").change(function(){
        var melding = $("#melding");
        var tillaeg = $("#tillæg");
        var tomTillaeg = document.createElement("option");

        if (melding.val() == parseInt(melding.val())) {
            // Der er tale om en tal-melding.
            tillaeg.removeAttr("disabled");
            if (tillaeg.val() == "")  tillaeg.remove(0);

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
    });
});


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};