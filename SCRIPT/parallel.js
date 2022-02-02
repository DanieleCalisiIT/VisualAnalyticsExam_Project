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

    let Countries =["Albania","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark"]
    /*let Countries =["Albania","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France",
                    "Germany","Greece","Iceland","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Moldova","Montenegro","Netherlands",
                    "Norway","Poland","Portugal","Romania","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom","Macedonia","Hungary"]
    */


    let years = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,2017];
    
    //Range di colori preso al sito: https://hihayk.github.io/scale/#20/20/17/82/285/47/0/53/3C8C08/223/57/177/white
    /*let Colors = ["#009179","#008291","#005B91","#003491","#000E91","#000091","#1E0091","#450091","#6B0091","#8F0090","#90006D","#900049","#900026","#8F0004","#8F1800",
                  "#8E3B00","#8E5E01","#8E7F03", "#7B8D04", "#5B8D06","#3C8C08","#499112","#56951C","#629A26","#6D9F31","#79A43B","#83A845","#8EAD4F","#98B259","#A1B663",
                    "#ABBB6D","#B3C077","#BCC582","#C3C98C","#CBCE96","#D2D3A0","#D7D7AA","#DCDAB4","#E1DDBE0","#E6E2C8","#EAE6D3"]
       */
    var Colors = ['#00429d', '#3861aa', '#5881b3', '#76a2b6', '#97c4ad', '#d1a439', '#d77748', '#cd4b4b', '#b62246', '#93003a']

            
    //let Colors = ["#009179","#7B8D04","#DCDAB4"]

    //var years = [2000, 2001, 2002];


    var mylist = document.getElementById("List_Deaths");
    mylist.addEventListener('change', Change_In_ParallelPlot);

    var slider = document.getElementById("Slider_Year");
    slider.addEventListener('change', Change_In_ParallelPlot);


    function Change_In_ParallelPlot(){

        var death_Selected = mylist.options[mylist.selectedIndex].value;
        var year_Selected = document.getElementById("Slider_Year").value;


         // set the dimensions and margins of the graph
        var margin = {top: 30, right: 50, bottom: 10, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
        
        var svg = d3.select("#parallel")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        
        //Dictionary for normalized data (key: year, value: sum of death per that year)
        var Dict_Of_TotalDeath_Year = {}

        for(var l=0; l<years.length ; l++){
            var year_ = years[l];
            Dict_Of_TotalDeath_Year[year_] = 0
        }
        var addendo =0;
        for (var i=0; i<data.length;i++){

            if(Countries.includes(data[i].Country)){
                if(years.includes(data[i].Year)){

                    for(l=0; l<years.length ; l++){
                        var year_ = years[l];
                        
                        addendo = data[i+l][death_Selected];
                        
                        Dict_Of_TotalDeath_Year[year_] = Dict_Of_TotalDeath_Year[year_] + addendo;

                        }

                        i = i+years.length-1;

                    }
                    
                }

        }

        var color = d3.scaleOrdinal()
                    .domain(Countries)
                    .range(Colors)

        

        //causa di morte selezionata dall'utente


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
        function highlight(d){
            
            var selectedCountry = d.Country

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(100)

                .style("opacity", "0.1")
            // Second the hovered country takes its color
            d3.selectAll("." + selectedCountry)
                .transition().duration(100)

                .style("opacity", "1")
        }

        //Unhighlight
        function doNotHighlight(d){
            var selectedCountry = d.Country
            d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("opacity", "1")
        }


        function Create_Points(){
            var dict = {};
            var Points_Of_Countries = [];
            for (var i = 0; i<data.length ; i++){
                if(Countries.includes(data[i].Country)){
                    if(years.includes(data[i].Year)){
                        
                        for(var l=0; l<years.length ; l++){
                            var x_ = x(years[l]);
                            var Norm = 100 *(data[i+l][death_Selected] / Dict_Of_TotalDeath_Year[years[l]])
                            var y_ = y(Norm);
                            var Point = [x_,y_]
                            Points_Of_Countries.push(Point)

                            }
                            dict[data[i].Country]=Points_Of_Countries
                            Points_Of_Countries = []
                            i = i+years.length-1;

                        }
                        
                    }
                    
            }

            return dict;
        }


        
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
                if(Countries.includes(d.Country)){
                    if(years.includes(d.Year)){
                        var dict = Create_Points();
                            Points = dict[d.Country]

                        return d3.line()(Points)
                }
            }
        }

        // Draw the lines
        svg
        .selectAll("myPath")
        .data(data)
        .enter()
        .append("path")
            .attr("class", function (d) { return "line "+ d.Country } ) // 2 class for each line: 'line' and the group name
            .attr("d",  path)
            .style("fill", "none" )
            .style("stroke", function(d){ return( color(d.Country))} )
            .style("opacity", 0.5)
            .on("mouseover", function(_event,d){
                highlight(d)
            })
            .on("mouseleave", function(_event,d){
                doNotHighlight(d)
            })

    // Draw the axis:
        svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(years).enter()
        .append("g")
        .attr("class", "axis")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { 
            d3.select(this)
            .call(d3.axisLeft(y)); })
        // Add axis title
        .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")
    }

    Change_In_ParallelPlot();

});