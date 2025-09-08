$(function() {
    let magConvSelector = $('input[name="magTo"]:checked').val();
    let magSource = "#magN";
    let magTarget = "#magS";
    $('input[name="magTo"]').on("click", function() {
        magConvSelector = this.value;
        magHandler(magSource, magTarget, magConvSelector)
    });

    $("#magS, #magN").on("input", function() {
        magSource = this.id === "magS" ? "#magS" : "#magN";
        magTarget = this.id === "magS" ? "#magN" : "#magS";
        magHandler(magSource, magTarget, magConvSelector);
    });


})


function magHandler(source, target, selector) {
    console.log(source,target,selector);
    const m = parseFloat($(source).val());
    let output;
    let unit;
    let sqrtArea;
    let note = "";
    if (selector === 'moment') {
        output = mag2M0(m);
        unit = "newton-meters";
    } else if (selector === 'area') {
        output = mag2A(m);
        unit = "km<sup>2</sup>";
        if (output < 1e-1) {
            output *= 1e6;
            unit = "m<sup>2</sup>";
        }
        sqrtArea = Math.sqrt(output);
        sqrtArea = (sqrtArea < 1e-1) ? sqrtArea.toExponential(3) : sqrtArea.toFixed(2);
        note = `That is a ${sqrtArea} x ${sqrtArea} ${unit.replace("<sup>2</sup>","")} square.`;
        if (output > 510072000) note = "That is larger than the surface area of the Earth!"
        if (output > 3.57e80) note = "That is larger than the observable universe! Better drop, cover, and hold..."
        if (output < 6e-12) note = "That is smaller than a single bacterium!"
    };

    output = (output < 1e-1 || output > 1e5) ? output.toExponential(3) : output.toFixed(2);
    $(target).attr("value", m);
    $("#magResult").html(`Magnitude ${m} is equivalent to ${output} ${unit}. <br> ${note}`);
}

function mag2A(m) {
    return 10 ** ((m - 4.07) / 0.98)
}

function mag2M0(m) {
    return 10 ** ((3/2) * (m + 9.1))
}