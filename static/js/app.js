// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data["metadata"];

    // Filter the metadata for the object with the desired sample number
    let individual = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let [key, value] of Object.entries(individual)) {
      panel.append("h6").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data["samples"];

    // Filter the samples for the object with the desired sample number
    let individual = samples.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = individual["otu_ids"];
    let otuLabels = individual["otu_labels"];
    let sampleValues = individual["sample_values"];

    // Build a Bubble Chart
    let bubbleChart = {
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Earth"
      },
      text: otuLabels
      };
    let bubbleTraces = [bubbleChart]

    // Render the Bubble Chart
    let bubbleLayout = {
      title: "Bacterial OTU Counts per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacterial OTUs"}
    };

    Plotly.newPlot("bubble", bubbleTraces, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yAxis = otuIds.map(x => `OTU: ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barChart = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yAxis.slice(0, 10).reverse(),
      type: "bar",
      marker: {
        color: "blue"
      },
      text: otuLabels.slice(0, 10).reverse(),
      orientation: "h"
    };

    // Render the Bar Chart
    let barTraces = [barChart];
    let layout = {
      title: "Top 10 Bacteria Most Abundant Bacterial OTUs Found",
      xaxis: {title: "Number of Bacterial OTUs"}
    };
    Plotly.newPlot("bar", barTraces, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data["names"];

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      dropdown.append("option").text(name).property("value", name);
    }

    // Get the first sample from the list
    let firstName = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstName);
    buildMetadata(firstName);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();