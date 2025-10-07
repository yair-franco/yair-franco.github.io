$(function() {
    // $("#lastUpdate").html(`Page last updated: ${getCurrTime(now)}`)
    $("#haywardTimer")
        .html(`(<span class='hoverable'>${yearsSince(hayward,now)} years ago</span>)`)
        .attr("title", `Or ${daysSince(hayward,now)} days!`)

    $("#lastUpdate")
        .html(`Page last updated ${lastModifiedString}`)
        .attr("title", `(${daysSince(lastModified,now)} days ago)`)

    $("#darkMode").on("click", function() {
        console.log(darkMode)
        darkMode = !darkMode;
        $("html:not(#portrait)").css("filter",`invert(${darkMode ? "100%":"0%"})`);
        $("#portrait").css("filter", `invert(${darkMode ? "100%":"0%"})`);
        // $("#portrait").toggle();
    })
})

var darkMode = false;
const hayward = "1868-10-21"
const now = new Date();

const lastModified = document.lastModified;
const options = { year: 'numeric', month: 'long', day: 'numeric' }
const lastModifiedString = new Date(lastModified).toLocaleDateString('en-US', options)

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