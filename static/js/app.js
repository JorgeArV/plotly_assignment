//Initial test to ensure that we can run the data:

function retreiveData(sample) {
    d3.json("samples.json").then(data=> {
        console.log(data)
    });
};

retreiveData();

//SHOW ALL ALTERNATIVES USING THE DROPDOWN BUTTON: 

// We add the ID number of all individuals to the dropdown option:
function dropdown_options(){

    var choice = d3.select("#selDataset");
    
    d3.json("samples.json").then(function(data) {
        var alternatives = data.names;
        alternatives.forEach(function(x){
            choice.append("option").text(x).property("value",x)
        })
    })    
};

dropdown_options();

// SHOW INITIAL VISUALIZATIONS

function initial_look(){

    d3.json("samples.json").then(function(data) {

        //we extract the user ID of the selected individual     
            var dropdownMenuValue = d3.selectAll("#selDataset").node().value;
    
        //we filter the dataset based on the user ID selected in the dropdown tool:
            var chosen_data_set = data.samples.filter(x => x.id === dropdownMenuValue);  
            var chosen_data_set_v1 = chosen_data_set[0];
        
        //Bar chart: We assign variables to the x axis (sample_values) and the y values (otu_ids)
            var sample_values = chosen_data_set_v1.sample_values.slice(0,10);
            var otu_ids = chosen_data_set_v1.otu_ids.slice(0,10);
            var otu_labels = chosen_data_set_v1.otu_labels.slice(0,10);
        
        //Bar chart: We transform the two values above to get the exact type of chart we are being requested, and to accomodate Plotly's defaults    
            var final_bar_y_axis = [].reverse();
    
            otu_ids.forEach(function(x){
    
                var datapoint = `OTU ${x}`;
    
                final_bar_y_axis.push(datapoint);
    
            });
            var final_bar_x_axis = sample_values.reverse();
            var final_labels = otu_labels.reverse();       
    
        //Horizontal bar chart: Trace, data & layout    
           var trace1 = {
             x: final_bar_x_axis,
             y: final_bar_y_axis,
             text: final_labels,
             type: "bar",
             orientation: "h"
           };
    
           var data1 = [trace1];
    
           var layout = {
               title: "Bar chart: Number of OTUs per subject",
               xaxis:{title:"# of OTUs"},
               yaxis: {title:"OTU IDs"}
           };
    
           Plotly.newPlot("bar",data1,layout);


        //Bubble chart: We assign variables to x axis (otu_ids) and the y values (sample_values)
           var x_axis_color_bubble = chosen_data_set_v1.otu_ids;
           var y_axis_marker_bubble = chosen_data_set_v1.sample_values;
        
        //Bubble chart: Trace, data & layout 
           var trace2 = {
            x: x_axis_color_bubble,
            y: y_axis_marker_bubble,
            mode: 'markers',
            marker: {color:x_axis_color_bubble, size:y_axis_marker_bubble}
           };

           var data2 = [trace2];

           var layout = {
            title: "Bubble chart: Number of OTUs per subject",
            xaxis:{title:"OTU IDs"},
            yaxis: {title:"# of OTUs"}
           }

           Plotly.newPlot("bubble",data2,layout);

        //Table: We find the index of the user ID chosen. We need this index to gather information from data.metadata
            
            var IDs_and_index = data.names.map(function(value,index){
                return {value,index}
            });

            var chosen_id = IDs_and_index.filter(x => x.value === dropdownMenuValue);
            var chosen_index = chosen_id[0].index;

        // We create the variables taht will be included in our panel
            var id_table = data.metadata[chosen_index].id;
            var id_ethnicity = data.metadata[chosen_index].ethnicity;
            var id_gender = data.metadata[chosen_index].gender;
            var id_age = data.metadata[chosen_index].age;
            var id_location = data.metadata[chosen_index].location;
            var id_bbtype = data.metadata[chosen_index].bbtype;
            var id_wfreq = data.metadata[chosen_index].wfreq;
        
        //We add the datapoints to the panel:
            var panel1 = d3.select(".panel-body");

            panel1.html(`id: ${id_table} <br> ethnicity: ${id_ethnicity} <br> gender: ${id_gender} <br> age: ${id_age} <br> location: ${id_location} <br> bbtype: ${id_bbtype} <br> wfreq: ${id_wfreq}`)
            console.log(id_table)

    })};  

    initial_look()


  d3.selectAll("#selDataset").on("change", optionChanged);

  // DETERMINE WHAT HAPPENS WHEN SOMEONE CHOOSES A DIFFERENT USER ID:
  
  function optionChanged() {
       
    d3.json("samples.json").then(function(data) {

    //we extract the user ID of the selected individual     
        var dropdownMenuValue = d3.selectAll("#selDataset").node().value;

    //we filter the dataset based on the user ID selected in the dropdown tool:
        var chosen_data_set = data.samples.filter(x => x.id === dropdownMenuValue);  
        var chosen_data_set_v1 = chosen_data_set[0];
    
    //Bar chart: We assign variables to the x axis (out_ids) and the y values (sample_values)
        var sample_values = chosen_data_set_v1.sample_values.slice(0,10);
        var otu_ids = chosen_data_set_v1.otu_ids.slice(0,10);
        var otu_labels = chosen_data_set_v1.otu_labels.slice(0,10);
    //Bar chart: We transform the two values above to get the exact type of chart we are being requested, and to accomodate Plotly's defaults    
        var final_bar_y_axis = [].reverse();
        var final_labels = otu_labels.reverse(); 

        otu_ids.forEach(function(x){

            var datapoint = `OTU ${x}`;

            final_bar_y_axis.push(datapoint);

        });
        
        var final_bar_x_axis = sample_values.reverse();      
    //Bar chart: We restyle the necessary items:

        Plotly.restyle("bar","x",[final_bar_x_axis])
        Plotly.restyle("bar","y",[final_bar_y_axis])
        Plotly.restyle("bar","text",[final_labels])

   
    //Bubble chart: We assign variables to x axis (otu_ids) and the y values (sample_values)
    var x_axis_color_bubble = chosen_data_set_v1.otu_ids;
    var y_axis_marker_bubble = chosen_data_set_v1.sample_values;
    var new_marker_bubble = {color:x_axis_color_bubble, size:y_axis_marker_bubble}

    //Bubble chart: We restyle the necessary items:

        Plotly.restyle("bubble","x",[x_axis_color_bubble])
        Plotly.restyle("bubble","y",[y_axis_marker_bubble])
        Plotly.restyle("bubble","marker",[new_marker_bubble])
    
    
            //Table: We find the index of the user ID chosen. We need this index to gather information from data.metadata
            
            var IDs_and_index = data.names.map(function(value,index){
                return {value,index}
            });

            var chosen_id = IDs_and_index.filter(x => x.value === dropdownMenuValue);
            var chosen_index = chosen_id[0].index;

        // We create the variables taht will be included in our panel
            var id_table = data.metadata[chosen_index].id;
            var id_ethnicity = data.metadata[chosen_index].ethnicity;
            var id_gender = data.metadata[chosen_index].gender;
            var id_age = data.metadata[chosen_index].age;
            var id_location = data.metadata[chosen_index].location;
            var id_bbtype = data.metadata[chosen_index].bbtype;
            var id_wfreq = data.metadata[chosen_index].wfreq;
        
        //We add the datapoints to the panel:
            var panel1 = d3.select(".panel-body");

            panel1.html(`id: ${id_table} <br> ethnicity: ${id_ethnicity} <br> gender: ${id_gender} <br> age: ${id_age} <br> location: ${id_location} <br> bbtype: ${id_bbtype} <br> wfreq: ${id_wfreq}`)
            console.log(id_table)

    })};





