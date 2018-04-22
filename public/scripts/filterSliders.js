/*global $*/
/*global filters*/
/*global DEF_MIN_SCORE*/
/*global DEF_MAX_SCORE*/
/*global DEF_MIN_AGE*/
/*global DEF_MAX_AGE*/
/*global DEF_MIN_HEIGHT*/
/*global DEF_MAX_HEIGHT*/
/*global DEF_DISTANCE*/

//defining sliders behavior
$(function() {
    $("#compatibilityScoreRange").slider({
        range: true,
        min: 1,
        max: 99,
        values: [DEF_MIN_SCORE, DEF_MAX_SCORE],
        slide: function(event, ui) {
            $("#compatibilityScore").val(ui.values[0] + "% - " + ui.values[1] + "%");
            filters.compatibilityScore.min = ui.values[0];
            filters.compatibilityScore.max = ui.values[1];
        }
    });
    $("#compatibilityScore").val($("#compatibilityScoreRange").slider("values", 0) + "% - " + $("#compatibilityScoreRange").slider("values", 1) + "%");
});
$(function() {
    $("#ageRange").slider({
        range: true,
        min: 18,
        max: 96,
        values: [DEF_MIN_AGE, DEF_MAX_AGE],
        slide: function(event, ui) {
            var maxValue = ui.values[1] > 95 ? "95+" : ui.values[1];
            $("#age").val(ui.values[0] + " - " + maxValue);
            filters.age.min = ui.values[0];
            filters.age.max = ui.values[1];
        }
    });
    $("#age").val($("#ageRange").slider("values", 0) + " - " + $("#ageRange").slider("values", 1));
});
$(function() {
    $("#heightRange").slider({
        range: true,
        min: 135,
        max: 211,
        values: [DEF_MIN_HEIGHT, DEF_MAX_HEIGHT],
        slide: function(event, ui) {
            var maxValue = ui.values[1] > 210 ? "210+ " : ui.values[1];
            $("#height").val(ui.values[0] + "cm - " + maxValue + "cm");
            filters.height.min = ui.values[0];
            filters.height.max = ui.values[1];
        }
    });
    $("#height").val($("#heightRange").slider("values", 0) + "cm - " + $("#heightRange").slider("values", 1) + "cm");
});
$(function() {
    $("#distanceMax").slider({
        range: "min",
        value: DEF_DISTANCE,
        min: 30,
        max: 301,
        slide: function(event, ui) {
            var value = ui.value > 300 ? ">300" : ui.value;
            $("#distance").val(value + " km");
            filters.distance = ui.value;
        }
    });
    $("#distance").val($("#distanceMax").slider("value") + " km");
});