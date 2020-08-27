// Import data in json file
var url = "https://raw.githubusercontent.com/aluna0806/Plotly/master/data/samples.json";

// Fetch the json data and console log it
d3.json(url).then((data) => {
    var sampleData = data;
    console.log(sampleData);
    var metadata = data.metadata;
    console.log(metadata);
    var names = data.names;
    console.log(names);
    var samples = data.samples;
    console.log(samples);
});

// Initialize page with Test Subject ID dropdown options and display data for first ID
function init() {
    // Grab a reference to the dropdown select element
    var dropdown = d3.select("#selDataset");
    //pull IDs from names
    d3.json(url).then(function (IDs) {
        var IDs = IDs.names;
        IDs.forEach((id) => {
          dropdown
            .append("option")
            .text(id)
            .property("value", id);
        });
    //Put first ID to the first name
    var firstID = IDs[0];
    //build the plots with the firstID
    Demos(firstID);
    Plots(firstID);
    });
};

//Demographic Info section
function Demos(ID) {
    d3.json(url).then(function (data) {
    var metadata = data.metadata;
    //filter to get metadata for passed ID
    var filteredDemo = metadata.filter(metadataID => metadataID.id == ID)[0];
    //clear any previous metadata
    d3.select('#sample-metadata').html('');
    //add each key value pair from metaData
        Object.entries(filteredDemo).forEach(([key, value]) => {
            d3.select('#sample-metadata')
            .append('p').text(`${key}: ${value}`);
        });
    });
};