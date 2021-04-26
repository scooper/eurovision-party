// globals
var countryCache = {};
var selected = {};

// ajax
function GetCountries() {
    $.ajax({
        url: 'score/api/getcountries',
        method: 'POST',
    }).done(function (res) {
        countryCache = res.users;
        selected = res.selected;
        PopulateLists();
    });
}

// document
$(document).ready(GetCountries);

$(document).on('change', '.point-box', function () {
    var code = $(this).val();
    var point = $(this).attr('point-v');
    selected[point] = code;
    ClearLists();
    PopulateLists();
});

// utility
function PopulateLists() {
    // add a none option to all lists
    $('.point-box').append($('<option>').val("NONE").text("None selected..."));
    // default all hidden inputs to none
    $('.hidden-point-box').val("NONE");
    // populate lists
    for (var value of countryCache) {
        $('.point-box').append($('<option>').val(value.countryCode).text(value.country));
    }
    // select chosen countries in hidden inputs and dropdowns
    for (let [key, value] of Object.entries(selected)) {
        if (value != "NONE") {
            $('.point-box').find('option[value="' + value + '"]').prop('disabled', true);
            $('input.hidden-point-box[point-v="' + key + '"]').val(value);
        }
        $('.point-box[point-v="' + key + '"]').val(value);
    }
}

function ClearLists() {
    $('.point-box').empty();
}