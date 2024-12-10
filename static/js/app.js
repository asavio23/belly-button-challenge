// Function to render metadata for the selected sample
function renderMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const metadata = data.metadata; // Extract metadata
    const sampleMetadata = metadata.find(item => item.id === sample); // Find the selected sample

    // Clear previous metadata display
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear content

    // Dynamically append metadata key-value pairs
    Object.keys(sampleMetadata).forEach(key => {
      metadataPanel.append("h6").text(`${key}: ${sampleMetadata[key]}`);
    });
  });
}

// Function to build charts for the selected sample
function renderCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const samples = data.samples; // Extract sample data
    const selectedSample = samples.find(item => item.id === sample); // Get the selected sample data

    const { otu_ids, otu_labels, sample_values } = selectedSample; // Destructure required fields

    // Build Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      },
      text: otu_labels
    };

    const bubbleLayout = {
      title: "Bacterial OTU Counts per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacterial OTUs" }
    };

    // Plot the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // Prepare the Bar Chart data
    const top10Values = sample_values.slice(0, 10).reverse();
    const top10OTUs = otu_ids.slice(0, 10).reverse();
    const top10Labels = otu_labels.slice(0, 10).reverse();

    const barTrace = {
      x: top10Values,
      y: top10OTUs.map(id => `OTU: ${id}`),
      type: "bar",
      orientation: "h",
      marker: { color: "blue" },
      text: top10Labels
    };

    const barLayout = {
      title: "Top 10 Bacteria Most Abundant Bacterial OTUs Found",
      xaxis: { title: "Number of Bacterial OTUs" }
    };

    // Plot the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);
  });
}

// Function to initialize the dashboard on page load
function initializeDashboard() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    const sampleNames = data.names; // Get sample names for dropdown

    const dropdown = d3.select("#selDataset");
    dropdown.selectAll("option").remove(); // Clear any existing options
    sampleNames.forEach(name => {
      dropdown.append("option").text(name).property("value", name); // Populate dropdown
    });

    // Set initial sample as the first in the list
    const initialSample = sampleNames[0];

    // Build charts and metadata for the first sample
    renderCharts(initialSample);
    renderMetadata(initialSample);
  });
}

// Function to update charts and metadata when a new sample is selected
function onSampleChange(newSample) {
  renderCharts(newSample);
  renderMetadata(newSample);
}

// Initialize dashboard when the page loads
initializeDashboard();
