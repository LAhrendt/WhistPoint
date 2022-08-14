$(document).ready(function(){
    // Find tidligere spil.

    // Find alle keys i localStorage.
    var keys = Object.keys(localStorage).sort();

    if (keys.length > 0) {
        // Der findes spil.
        $("#err").hide();
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

        for (var i = 0; i < spil.spil.length; i++) {
            var htmlstr = '<tr><td><a href="/spil/?id=' + spil.spil[i].key + '">' + spil.spil[i].navn + '</a></td> <td>' + spil.spil[i].sidst_spillet + '</td></tr>';
            $("#tabel tr:last").after(htmlstr);
        }

        $("#tabel").show();
    }

    function toReadableDateSr(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString();// + " " + d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    }
});