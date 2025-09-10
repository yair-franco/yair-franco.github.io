$(function() {
    // magnitude inputs
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

    // fault plane vector inputs
    let strike = $("#strike").val();
    let dip = $("#dip").val();
    let faultNorm = getFaultNorm(strike, dip)

    $("#vecResult").html(`Fault plane normal vector: [${faultNorm}]`)

    $("#strike, #dip").on("input", function() {
        strike = $("#strike").val();
        dip = $("#dip").val();
        faultNorm = getFaultNorm(strike, dip)
    })

    // stress tensor inputs
    let T_n = $("#Tn").val();
    let T_d = $("#Td").val();
    let T_s = $("#Ts").val();
    let dipT = $("#dipT").val();
    let strT = $("#strikeT").val();
    let roundDigits = $("#digits").val();
    let s = trac2stress(T_n, T_d, T_s, dipT, strT, roundDigits);
    let stressString = `<p class="stressTensorLine">[${s[0]}]</p><br>\
                        <p class="stressTensorLine">[${s[1]}]</p><br>\
                        <p class="stressTensorLine">[${s[2]}]</p>`
    $("#stressResult").html(stressString)
    $("#Tn, #Td, #Ts, #dipT, #strikeT, #digits").on("input", function() {
        $("#tWarn").html("");
        T_n = $("#Tn").val();
        T_d = $("#Td").val();
        T_s = $("#Ts").val();
        dipT = $("#dipT").val();
        strT = $("#strikeT").val();
        roundDigits = $("#digits").val();
        if (roundDigits < 0) $("#tWarn").html("You have entered a rounding number below 0. The moment tensor will not display properly.");
        if (roundDigits > 10) $("#tWarn").html("You have entered a very high rounding number. The moment tensor may not display properly.");
        if (dipT < 0) $("#tWarn").html("Dip must be positive. To get an opposite orientation please reverse the strike direction.");
        if (dipT >= 90) $("#tWarn").html("A dip of 90° is parallel to the surface, and anything above is outside the surface. Please review your dip angle.");
        
        s = trac2stress(T_n, T_d, T_s, dipT, strT, roundDigits);
        stressString = `<p class="stressTensorLine">[${s[0]}]</p><br>\
                        <p class="stressTensorLine">[${s[1]}]</p><br>\
                        <p class="stressTensorLine">[${s[2]}]</p>`
        $("#stressResult").html(stressString);
    })
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

function getFaultNorm(strike, dip) {
    // Convert degrees to radians
    const deg2rad = Math.PI / 180;
    const strikeRad = strike * deg2rad;
    const dipRad = dip * deg2rad;

    // Calculate components of the normal vector
    const nx = -Math.sin(dipRad) * Math.sin(strikeRad);
    const ny = -Math.sin(dipRad) * Math.cos(strikeRad);
    const nz = Math.cos(dipRad);

    // Create the vector
    const N = [nx, ny, nz];

    // Normalize the vector
    const norm = Math.sqrt(N.reduce((sum, val) => sum + val ** 2, 0));
    let Nn = N.map(val => val / norm);

    // Set near-zero values to exactly zero and round the rest
    Nn = Nn.map(val => {
        if (Math.abs(val) <= 1e-7) return 0;
        return val;
    });

    return Nn.map(val => Math.round(val * 1e4) / 1e4);
}

function trac2stress(T_n,T_d,T_s,dip,strike,roundDigits=5) {
    //degrees to radians
    const deg2rad = angle => angle * Math.PI / 180;
    const thetax = deg2rad(-90 + dip);
    const thetay = deg2rad(0);
    const thetaz = deg2rad(strike);

     // Traction tensor A (symmetric)
    const A = [
        [T_s,  0,    0],
        [0,    T_n,  T_d],
        [0,    T_d,  0]
    ];

    // Rotation about x-axis
    const Tx = [
        [1, 0, 0],
        [0, Math.cos(thetax), -Math.sin(thetax)],
        [0, Math.sin(thetax),  Math.cos(thetax)]
    ];

    // Rotation about y-axis
    const Ty = [
        [ Math.cos(thetay), 0, Math.sin(thetay)],
        [0,                 1, 0],
        [-Math.sin(thetay), 0, Math.cos(thetay)]
    ];

    // Rotation about z-axis
    const Tz = [
        [Math.cos(thetaz), -Math.sin(thetaz), 0],
        [Math.sin(thetaz),  Math.cos(thetaz), 0],
        [0, 0, 1]
    ];

    let A_tempx = math.multiply(math.multiply(Tx, A), math.transpose(Tx));
    let A_tempy = math.multiply(math.multiply(Ty, A_tempx), math.transpose(Ty));
    let stress_global = math.multiply(math.multiply(Tz, A_tempy), math.transpose(Tz));

    stress_global = stress_global.map(row => row.map(val => Math.abs(val) < 1e-6 ? 0 : val.toFixed(roundDigits)));

    return stress_global;
}