function samplePlots(id) {
    //Read samples.json
    d3.json("samples.json").then(sampleData => {
        console.log(sampleData)
        var ids = sampleData.samples.otu_ids;
        console.log(ids)
        const sampleValues = sampleData.samples[0].sample_values.slice(0, 10).reverse();
        console.log(sampleValues)
        var otuLabels = sampleData.samples[0].otu_labels.slice(0, 10);
        console.log(otuLabels)
        // get only top 10  bacteria for the plot OTU and reversing it. 
        var bacteriaTop = (sampleData.samples[0].otu_ids.slice(0, 10)).reverse();
        console.log(bacteriaTop)
        // get the otu id's to the desired form for the plot
        var otuID = bacteriaTop.map(id => id + ":bacteria");
        console.log(`OTU IDS: ${otuID}`)
        // get the top 10 labels for the plot
        var labels = sampleData.samples[0].otu_labels.slice(0, 10);
        console.log(`OTU_labels: ${labels}`)

        // TRACE 1 Top 10 Bacteria - Selected Subject

        const trace = {
            x: sampleValues,
            y: otuID,
            text: labels,
            type: "bar",
            orientation: "h",

        };

        var data = [trace];

        var layout = {
            title: "Top 10 Bacteria - Selected Subject",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        Plotly.newPlot("bar1", data, layout);

        // TRACE2 Bar Plot for TOP 10 Bacteria Subject
        const trace2 = {
            x: bacteriaTop,
            y: otuID,
            text: labels,
            type: "bar",
            orientation: "h"
            };

        var data2 = [trace2];

        var layout2 = {
            title: "Top 10 Bacteria - All Subjects",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        Plotly.newPlot("bar2", data2, layout2);

        const trace1 = {
            x: sampleData.samples[0].sample_values,
            y: sampleData.samples[0].otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.samples[0].sample_values,
                // color: sampleData.samples[0].otu_ids
            },
            text: sampleData.samples[0].otu_labels
        };

        // set the layout for the bubble plot
        var layout1 = {
            xaxis: { title: "Count of Bacteria by Family - Selected Subject" },
            height: 600,
            width: 1250,
            margin: {
                l: 500,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // creating data variable 
        const data1 = [trace1];

        Plotly.newPlot("bubble", data1, layout1);

    });
}

// create the function to get demographic data
function getDemoInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data) => {
        // get the metadata info for the demographic panel
        const metadata = data.metadata;

        console.log(metadata)

        // filter metadata info by id
        const result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel to put data
        const demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    samplePlots(id);
    getDemoInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    const dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        samplePlots(data.names[0]);
        getDemoInfo(data.names[0]);
    });
}

// Initialize the dashboard
init();
