var resultBuilder = {};
var countryInfo = {};
var allCountries = {};

var stepScores = [];
var stepIndex = 0;
var countryIndex = 0;
var selectedCountry = null;

var container = null;

// ajax
function GetCountryResults() {
    $.ajax({
        url: '/admin/api/getfancyresults',
        method: 'POST',
    }).done(function (res) {
        countryInfo = res.countryInfo;
        stepScores = res.stepScores;
        allCountries = res.allCountries;
        Init();
    });
}

// call ajax on ready
$(document).ready(GetCountryResults);

// init function, put down all scores as zero
function Init() {
    for (var [code, value] of Object.entries(allCountries)) {
        resultBuilder[code] = 0;
        var name = $('<div>').addClass('float-left name').append($('<img>').attr('src', '/images/small/' + value.username + '.webp').addClass('img-small'), $('<span>').text(value.country.toUpperCase()));
        var score = $('<div>').addClass('float-right number').text(resultBuilder[code]);
        var item = $('<div>').addClass('grid-item').append(name, score.attr('data', code));
        $('.grid').append(item);
    }

    container = $('.grid').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitColumns',
        getSortData: {
            name: function (elem) {
                return $(elem).find('.name').text();
            },
            number: function (elem) {
                return parseInt($(elem).find('.number').text(), 10);
            }
        },
        sortAscending: {
            number: false
        }
    });

    SetCountry();
    $('.next-info').append('<p>').addClass('results-heading').text('Next: 1-7');
}

// utilities to go back and forward through scores
function AddBigScore(code, score) {
    if (code == 0)
        return;
    resultBuilder[code] += parseInt(score);
    $('.number[data="' + code + '"]').text(resultBuilder[code]);
    $('.number[data="' + code + '"]').closest('.grid-item').addClass('grid-highlighted');
    container.isotope('updateSortData', $(container).children());
    container.isotope({ sortBy: 'number', sortAscending: false });
}

function AddSmallScores(values) {
    var changes = false;
    for (var [score, code] of Object.entries(values)) {
        if (code == 0)
            continue;
        changes = true;
        resultBuilder[code] += parseInt(score);
        $('.number[data="' + code + '"]').text(resultBuilder[code]);
        $('.number[data="' + code + '"]').closest('.grid-item').addClass('grid-highlighted');
    }
    if (changes) {
        container.isotope('updateSortData', $(container).children());     
        container.isotope({ sortBy: 'number', sortAscending: false });
    }
}

function RemoveBigScore(code, score) {
    if (code == 0)
        return;
    resultBuilder[code] -= parseInt(score);
    $('.number[data="' + code + '"]').text(resultBuilder[code]);
    $('.number[data="' + code + '"]').closest('.grid-item').addClass('grid-highlighted');
    container.isotope('updateSortData', $(container).children());
    container.isotope({ sortBy: 'number', sortAscending: false });
}

function RemoveSmallScores(values) {
    var changes = false;
    for (var [score, code] of Object.entries(values)) {
        if (code == 0)
            continue;
        changes = true;
        resultBuilder[code] -= parseInt(score);
        $('.number[data="' + code + '"]').text(resultBuilder[code]);
    }
    if (changes) {
        container.isotope('updateSortData', $(container).children());
        container.isotope({ sortBy: 'number', sortAscending: false });
    }
}

function SetCountry() {
    $('.country').text(countryInfo[Object.keys(countryInfo)[countryIndex]].country.toUpperCase());
}

function ClearNextInfo() {
    $('.next-info').empty();
}

function ShowSummary() {
    var points = countryInfo[Object.keys(countryInfo)[countryIndex]].points;
    for (var [key, value] of Object.entries(points).reverse()) {
        var points = $('<span>').addClass("summary-cell-points").text(key);
        var spacer = $('<hr>').addClass('spacer');
        var country = $('<span>').addClass("summary-cell-country").text(allCountries[value].country);
        $('.summary').append($('<div>').addClass('cell small-1 float-center text-center summary-cell').append(points, spacer ,country));
        console.log(key + ' ' + value);
    }
}

function Next() {
    stepIndex++;
    if (stepIndex >= stepScores.length) {
        stepIndex = stepScores.length;
        return;
    }
    ClearNextInfo();
    var stage = stepScores[stepIndex];
    var toSwitch = Object.keys(stage)[0];
    switch (toSwitch) {
        case 'start':
            $('.summary').empty();
            $('.grid-item').removeClass('grid-highlighted');
            countryIndex++;
            SetCountry();
            $('.next-info').append('<p>').addClass('results-heading').text('Next: 1-7');
            break;
        case '7654321':
            AddSmallScores(stage[toSwitch]);
            $('.next-info').append('<p>').addClass('results-heading').text('Next: 8');
            break
        case '8':
        case '10':
            $('.next-info').append('<p>').addClass('results-heading').text('Next: ' + Object.keys(stepScores[stepIndex + 1])[0]);
        case '12':
            AddBigScore(stage[toSwitch], toSwitch);
            if (toSwitch == '12')
                $('.next-info').append('<p>').addClass('results-heading').text('Next: Summary');
            break;
        case 'end':
            ShowSummary();
            if (countryIndex + 1 == Object.keys(countryInfo).length)
                return;
            $('.next-info').append('<p>').addClass('results-heading').text('Next: ' + countryInfo[Object.keys(countryInfo)[countryIndex + 1]].country);
            // show next country
            break;
        default:
            break;
    }  
}

function Back() {
    stepIndex--;
    if (stepIndex < 0) {
        stepIndex = 0;
        return;
    }
    ClearNextInfo();
    var stage = stepScores[stepIndex];
    console.log(stage);
    switch (Object.keys(stage)[0]) {
        case 'start':
            //if (countryIndex - 1 < 0)
            //    return;
            $('.next-info').append('<p>').addClass('results-heading').text('Next: 1-7');
            break;
        case '7654321':
            RemoveSmallScores(stage[toSwitch]);
            $('.next-info').append('<p>').addClass('results-heading').text('Next: 8');
            break
        case '8':
        case '10':
            $('.next-info').append('<p>').addClass('results-heading').text('Next: ' + Object.keys(stepScores[stepIndex+1])[0]);
        case '12':
            RemoveBigScore(stage[toSwitch], toSwitch);
            break;
        case 'end':
            countryIndex--;
            SetCountry();
            $('.next-info').append('<p>').addClass('results-heading').text('Next: ' + countryInfo[Object.keys(countryInfo)[countryIndex + 1]].country);
            // show previous country
            break;
        default:
            break;
    }
}