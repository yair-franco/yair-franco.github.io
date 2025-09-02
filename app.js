$(function() {
    console.log("page loaded")
    // $("#lastUpdate").html(`Page last updated: ${getCurrTime(now)}`)
    $("#haywardTimer")
        .html(`(<em>${yearsSince(hayward,now)} years ago</em>)`)
        .attr("title", `Or ${daysSince(hayward,now)} days!`)

    $("#darkMode").on("click", function() {
        console.log(darkMode)
        darkMode = !darkMode;
        $("#darkMode").html(darkMode ? "&#x1F318" : "&#x1F311");
        $("html").css("filter",`invert(${darkMode ? "100%":"0%"})`);
        $("#portrait").toggle();
    })
})

var darkMode = false;
const hayward = "1868-10-21"
const now = new Date();

function getCurrTime(today) {
    return today.toString();
}

function yearsSince(start, now) {
    const dtStart = new Date(start);
    const dtNow = new Date(now);

    return dtNow.getFullYear() - dtStart.getFullYear();
}

function daysSince(start, now) {
    const dtStart = new Date(start);
    const dtNow = new Date(now);

    tDiff = dtNow - dtStart;
    diffDays = Math.floor(tDiff / 86400000);

    return diffDays;
}