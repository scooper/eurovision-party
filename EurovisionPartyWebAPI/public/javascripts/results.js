var results = [];

function CreateResultsTable(tableLocation) {
    $(tableLocation).empty();
    var table = $('<table>');
    var body = $('<tbody>');
    for (let [key, value, score] of results) {
        var row = $('<tr>');
        row.append($('<td>').text(value));
        row.append($('<td>').text(score));
        body.append(row);
    }
    table.append(body);
    $(tableLocation).append(table);
}