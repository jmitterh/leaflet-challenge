// Store url of past 7 days
var earthQuakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get data and verify
d3.json(earthQuakeData, function (data) {
    console.log("checking data:", data);


    //Store data
    var data = data.features;

    // Define lightMap layer
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    // Define darkMap layer
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openlightMap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    ///////////////////Circle creation///////////////////////

    //Create array that shall hold the circle data
    var circleArray = new Array();

    // The JavaScript for/in statement loops through the properties of an object:
    // Creating the different color for the size of earthquake and also store all coordinates into a variable
    for (i in data) {
        coordinates = [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]]
        properties = data[i].properties;

        var color = "#33ff33";
        if (properties.mag < 1) {
            color = "#ccff33";
        }
        else if (properties.mag < 2) {
            color = "#ffff33";
        }
        else if (properties.mag < 3) {
            color = "#ffcc33";
        }
        else if (properties.mag < 4) {
            color = "#ff9933";
        }
        else if (properties.mag < 5) {
            color = "#ff3333";
        }
        // Function to format number two decimal places
        function numFormat(x) {
            return Number.parseFloat(x).toFixed(2);
        }

        // Circle and popup attributes
        var circleDef = L.circle(coordinates, {
            fillOpacity: 0.30,
            color: color,
            fillColor: color,
            // Adjust radius
            radius: (properties.mag * 30000)
            //toFixed is decimal point after two places
        }).bindPopup("<h3>" + properties.place + "</h3> <hr> <p>Magnitud: " + numFormat(properties.mag) + "</>");
        //Add the cricle to the array
        circleArray.push(circleDef);
    }

    //Layer for the circles
    var magnitudeCircles = L.layerGroup(circleArray);

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Light Map": lightMap,
        "Dark Map": darkMap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: magnitudeCircles
    };

    // Add the layer to the map amd define view
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 1.5,
        layers: [lightMap, magnitudeCircles]
    });

    // Create a control for our layers, add our overlay layers to it
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //create the legend
    var info = L.control({
        position: 'bottomright'
    });

    info.onAdd = function (map) {
        var divHeader = L.DomUtil.create('div', 'info');
        var magnitudeNum = ["0 - 1", "1 - 2", "2 - 3", "3 - 4", "4 - 5", "5 +"];
        var colors = ["#33ff33", "#ccff33", "#ffff33", "#ffcc33", "#ff9933", "#ff3333"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < magnitudeNum.length; i++) {
            divHeader.innerHTML +=
                '<h4 style="background-color:' + colors[i] + '">' + magnitudeNum[i] + '</h4>';
        }

        return divHeader;
    };

    //add legend to map
    info.addTo(myMap)

    //listener to overlay
    myMap.on('overlayadd', function (a) {
        //Add the legend
        info.addTo(myMap);
    });

    //listener to overlayremoval
    myMap.on('overlayremove', function (a) {
        //Remove the legend
        myMap.removeControl(info);
    });




});