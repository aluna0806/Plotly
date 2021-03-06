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

function Plots(ID) {
    d3.json(url).then(function(plotData) {
        //filter samples data to ID for plotting
        var samplePlot = plotData.samples.filter(plotID => plotID.id == ID)[0];
        //slice sample data: otu_ids, otu_labels, and sample_values
        //map otu_ids to string with OTU label
        var slice_otu_ids = samplePlot.otu_ids.slice(0, 10).map(id => "OTU "+id.toString());
        var slice_otu_labels = samplePlot.otu_labels.slice(0, 10);
        var slice_sample_values = samplePlot.sample_values.slice(0, 10);
        
        //BAR CHART
        var traceBar = {
            type: 'bar',
            x: slice_sample_values.reverse(),
            y: slice_otu_ids.reverse(),
            text: slice_otu_labels.reverse(),
            marker: {
                color: '#1978B5',
              },
            orientation: 'h'
        };

        var barData = [traceBar];

        var barLayout = {
            title: 'Top 10 Microbes (OTUs) Found',
            showlegend: false,
            width: 600,
            height: 400
        };

        Plotly.newPlot('bar', barData, barLayout);

        //BUBBLE CHART
        var otu_ids = samplePlot.otu_ids.slice(0, 10);
        var traceBubble = {
            type: 'bubble',
            x: otu_ids,
            y: slice_sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'Blues',
                size: slice_sample_values
              },
            text: slice_otu_labels
        };

        var bubbleData = [traceBubble];

        var bubbleLayout = {
            title: "Microbe Type Bubble Chart",
            x: "OTU ID",
            pointStyle: "circle"
        }

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
};

//Reload w/ change in dropdown
function optionChanged(newID) {
    Demos(newID);
    Plots(newID);
  };

//run init to start
init();