// Use the D3 library to read in samples.json  

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


// Create the default plots and dropdown menu

function init() {

    // Select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        console.log(data);
    
        // Use a list of sample names to populate the dropdown menu options
        let sampleNames = data.names;
        
        sampleNames.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first sample name to a variable    
        firstName = sampleNames[0];
        
        // Call the functions to make the first demographic panel, bar chart, bubble chart, and gauge
        bar(firstName);
        bubble(firstName);
        demographic(firstName);
    });
}

// Initialize the default 
init();


// Make a function for the bar chart

function bar(selection) {

    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        console.log(data);

        // Assign a variable to an array of sample objects
        let samples = data.samples;

        // Filter to create an array that matches the selected sample number
        let results = samples.filter((sample) => sample.id == selection);    

        // Assign the first object in the array to a variable
        let firstObject = results[0];
        
        // Create the Plotly trace object
        let trace = [{
            x: firstObject.sample_values.slice(0,10).reverse(),
            y: firstObject.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: firstObject.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        // Create the layout for the bar chart
        let layout = {
            title: "Top 10 Operational Taxonomic Units"
        };

        // Use Plotly to plot bar chart
        Plotly.newPlot("bar", trace, layout);

    });
}


// Make a function for the bubble chart

function bubble(selection) {

    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        console.log(data);

        // Assign a variable to an array of sample objects
        let samples = data.samples;

        // Filter to create an array that matches the selected sample number
        let results = samples.filter((sample) => sample.id == selection);   

        // Assign the first object in the array to a variable
        let firstObject = results[0];

        // Create the Plotly trace object
        let trace = [{
            x: firstObject.otu_ids,
            y: firstObject.sample_values,
            text: firstObject.otu_labels,
            mode: "markers",
            marker: {
                size: firstObject.sample_values,
                color: firstObject.otu_ids,
                colorscale: "Viridis"
            }
        }];

        // Create the layout for the bubble chart
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        // Use Plotly to plot bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}


// Make a function for the demographic panel

function demographic(selection) {

    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        console.log(data);

        // Assign a variable to an array of metadata objects
        let metadata = data.metadata;

        // Filter to create an array that matches the selected sample number
        let results = metadata.filter((sample) => sample.id == selection);

        // Assign the first object in the array to a variable
        let firstObject = results[0];

        // Select the panel with the sample-metadata id and clear any existing metadata
        let demoPanel = d3.select("#sample-metadata");
        demoPanel.html("");

        // Add each key and value pair to the panel using an h5 element
        Object.entries(firstObject).forEach(([key, value]) => {
            demoPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}


// Toggle to new plots when option changed

function optionChanged(selection) {
    bar(selection);
    bubble(selection);
    demographic(selection);
}