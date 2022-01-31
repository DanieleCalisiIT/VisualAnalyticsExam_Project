d3.csv("DATASET/Deaths_EU.csv").then(function(data){
    data.forEach(function(d){
        d["Country"] = d.Entity;
        d.Year = +d.Year; //Convert to date
        d.Unsafe_water_source = +d.Unsafe_water_source; //Convert to number
        d.Unsafe_sanitation = +d.Unsafe_sanitation;
        d.Household_air_pollution_from_solid_fuels = +d.Household_air_pollution_from_solid_fuels;
        d.Child_wasting = +d.Child_wasting;
        d.Low_birth_weight_for_gestation = +d.Low_birth_weight_for_gestation;
        d.Secondhand_smoke = +d.Secondhand_smoke;
        d.Alcohol_use = +d.Alcohol_use;
        d.Drug_use = +d.Drug_use;
        d.Diet_low_in_fruits = +d.Diet_low_in_fruits;
        d.Unsafe_sex = +d.Unsafe_sex;
        d.High_fasting_plasma_glucose = +d.High_fasting_plasma_glucose;
        d.High_body_mass_index = +d.High_body_mass_index;
        d.High_systolic_blood_pressure = +d.High_systolic_blood_pressure;
        d.Smoking = +d.Smoking;
        d.Iron_deficiency = +d.Iron_deficiency;
        d.Vitamin_A_deficiency = +d.Vitamin_A_deficiency;
        d.Low_bone_mineral_density = d.Low_bone_mineral_density;
        d.Air_pollution = +d.Air_pollution;
        d.Outdoor_air_pollution = +d.Outdoor_air_pollution;
        d.Diet_high_in_sodium = +d.Diet_high_in_sodium;
    });

    let Array_Deaths = ["Unsafe_water_source","Unsafe_sanitation","Household_air_pollution_from_solid_fuels","Child_wasting","Low_birth_weight_for_gestation",         "Secondhand_smoke","Alcohol_use","Drug_use","Diet_low_in_fruits","Unsafe_sex","High_fasting_plasma_glucose","High_body_mass_index","High_systolic_blood_pressure",         "Smoking","Iron_deficiency","Vitamin_A_deficiency","Low_bone_mineral_density","Air_pollution","Outdoor_air_pollution","Diet_high_in_sodium"];

    let Countries =["Albania","Austria","Belarus"]
    
    //Range di colori preso al sito: https://hihayk.github.io/scale/#20/20/17/82/285/47/0/53/3C8C08/223/57/177/white
    /*let Colors = ["#009179","#008291","#005B91","#003491","#000E91","#000091","#1E0091","#450091","#6B0091","#8F0090","#90006D","#900049","#900026","#8F0004","#8F1800",
                  "#8E3B00","#8E5E01","#8E7F03", "#7B8D04", "#5B8D06","#3C8C08","#499112","#56951C","#629A26","#6D9F31","#79A43B","#83A845","#8EAD4F","#98B259","#A1B663",
                    "#ABBB6D","#B3C077","#BCC582","#C3C98C","#CBCE96","#D2D3A0","#D7D7AA","#DCDAB4","#E1DDBE0","#E6E2C8","#EAE6D3"]*/
    let Colors = ["#009179","#7B8D04","#DCDAB4"]

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 50, bottom: 10, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    function Change_In_ParallelPlot(){
        var svg = d3.select("#parallel")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        var color = d3.scaleOrdinal()
                    .domain(Countries)
                    .range(Colors)

        var years = [2000, 2001, 2002];

        //causa di morte selezionata dall'utente
        var death_Selected = "Unsafe_water_source";

        //L'asse verticale di ogni anno riporta valori normalizzati, per cui ogni anno avrà una scala con valori da zero a 100. Quindi non è necessario
        //fare un ciclo for con una scala per ogni anno dato che non lavoriamo con i valori assoluti

        var y = d3.scaleLinear()
            .domain([0,100])
            .range([height, 0])

        // Build the X scale -> it find the best position for each Y axis
        var x = d3.scalePoint()
            .range([0, width])
            .domain(years);

        // Highlight the specie that is hovered
        var highlight = function(d){
        
        var selectedCountry = d.Country

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        // Second the hovered country takes its color
        d3.selectAll("." + selectedCountry)
            .transition().duration(200)
            .style("stroke", color(selectedCountry))
            .style("opacity", "1")
        }

        //Unhighlight
        var doNotHighlight = function(d){

        var selectedCountry = d.Country
        d3.selectAll(".line")
        .transition().duration(200).delay(1000)
        .style("stroke", function(d){
            return( color(selectedCountry))
            })
        .style("opacity", "1")
        }

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            if(Countries.includes(d.Country)){
                if(years.includes(d.Year)){
                    return d3.line()(years.map(function(p) { 
                        //il return restituirà la posizione x quindi l'asse verticale dell'anno scelto(p), la posizione sull'asse y per ogni tipo di morte
                        //rispetto numero di morti
                        console.log(years)
                        return [x(p), y(d[death_Selected])]; 
                    }));
                }

            }
            
        }

        // Draw the lines
        svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
            .attr("class", function (d) { return d.Country } ) // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", function(d){ return( color(d.Country))} )
            .style("opacity", 0.5)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight )

    /*// Draw the axis:
        svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(years).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
        // Add axis title
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")*/
    }

    Change_In_ParallelPlot();

});
