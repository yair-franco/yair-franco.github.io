$(function() {
    console.log("page loaded")
    // $("#lastUpdate").html(`Page last updated: ${getCurrTime(now)}`)
    $("#haywardTimer")
        .html(`(<em>${yearsSince(hayward,now)} years ago</em>)`)
        .attr("title", `Or ${daysSince(hayward,now)} days!`)
})

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