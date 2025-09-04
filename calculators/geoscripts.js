$(function() {
    $("#calcAll").on("click", function(){
        // $("#magResult").html(`${mag2E(parseFloat($("#mag").val()))} Joules`);
    })
    $("#mag").on("input", function() {
        m = parseFloat(this.value);

        console.log("magchanged",m,mag2E(m))

        $("#magResult").html(`Magnitude ${m} is equivalent to ${mag2E(m).toFixed(2)} joules`)
    })

})

function mag2E(m) {
    return parseFloat(3/2 * 10**(m))
}