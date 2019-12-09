let binsToLegend = function (bins, colours) {
    let e = document.getElementById('population-legend-content');
    e.innerHTML = '';
    bins.forEach(function (bin, i) {
        var element = document.createElement("div");
        var labelElement = document.createTextNode(bin.toLocaleString());
        element.appendChild(labelElement);
        var colourElement = document.createElement('span');
        colourElement.style = "background-color: " + colours[i];
        element.appendChild(colourElement);
        e.appendChild(element);
    });
};

let colourSequence = function (numBins) {
    let colours = [];
    let n = numBins - 1;
    for (let i = 0; i < n; ++i) {
        colours.push(d3.interpolateViridis(i / (n - 1)));
    }
    colours.reverse();
    colours.unshift('#f6f6f4');

    return colours;
};

let getColourExpression = function (bins, colours, currentColumn) {
    if (bins.length > 0) {
        let cE = ["interpolate", ["linear"], ["to-number", ["get", currentColumn]]];
        bins.map(function (e, i) { return [e, colours[i]] }).map(function (a) {
            cE = cE.concat(a)
        });
        return cE
    } else {
        return '#f6f6f4';
    }
};

let bins = [0, 1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
let colours = colourSequence(bins.length);
let fillColour = getColourExpression(bins, colours, 'pop_total_26');
binsToLegend(bins, colours);
