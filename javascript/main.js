//JavaScript

	//create new leaflet map
	var map = L.map('map');
	
	//set map center and zoom level
	map.setView([42.365, -71.085], 13);

	//define basemaps
    var GreyBasemap = L.esri.basemapLayer('DarkGray');
	
	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Mapdesign by Nelson Schäfer | Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

	var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	maxZoom: 18, attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//layer control for basemaps
	var basemaps = {
	"Satellite Image": Esri_WorldImagery,
	"Grey Basemap": GreyBasemap,
	"Hydda Full Basemap": Hydda_Full,
	}
	L.control.layers(basemaps).addTo(map);

	//define appearance of bike station points
	var geojsonMarkerOptions = {
    radius: 3,
    color: 'rgb(247, 143, 42))',
    fillColor: 'rgb(247, 143, 42)',
    fillOpacity: 0.9,
    click: true,
	};
	
	//create markers from bike stations file
	var bike_stations = L.geoJson(bike_stations, {
	pointToLayer: function(feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions)
	}, 
	//add tooltip function
	onEachFeature: TooltipName
	}).addTo(map);

	//create tooltip function on hover
	function TooltipName(feature, layer){
	layer.on('mouseover', function (e) {
	this.openPopup();
	});
	layer.on('mouseout', function (e) {
	this.closePopup();
	});
	layer.bindTooltip(feature.properties.Name)};

	//use function from PapaParse Library to parse the .csv file
	//create a 'geoJsonFeatureCollection' with all bike station points
	Papa.parse('data/201905-bluebikes-tripdata_alt.CSV', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
        var geoJsonFeatureCollection = {
          type: 'FeatureCollection',
          features: results.data.map(function(datum) {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [datum.s_lon, datum.s_lat]
              },
              properties: datum,
			  //define style of points
				style: function(geoJsonFeature) {
					if (geoJsonFeature.properties.isOrigin) {
					  return {
						renderer: canvasRenderer,
						radius: 15,
						weight: 1,
						color: 'rgba(0, 0, 0,0)',
						fillColor: 'rgb(247, 143, 42)',
						fillOpacity: 0.3
					  };
					} else {
					  return {
						renderer: canvasRenderer,
						radius: 2.5,
						weight: 0.25,
						color: 'rgb(0, 166, 226)',
						fillColor: 'rgb(247, 143, 42)',
						fillOpacity: 0.7
					  };
					}
				} 
            }
          })
        };

		//Bezier Flow Curves
		//here some column-names from the csv-file get assigned to define latitude, longitude, and start point of the flow lines
        var oneToManyFlowmapLayer = L.canvasFlowmapLayer(geoJsonFeatureCollection, {
          originAndDestinationFieldIds: {
            originUniqueIdField: 'start station id',
            originGeometry: {
              x: 'start station longitude',
              y: 'start station latitude'
            },
            destinationUniqueIdField: 'end station id',
            destinationGeometry: {
              x: 'end station longitude',
              y: 'end station latitude'
            }
          },
		  //style of the flow lines, divided in classes according to the column 'count' (= number of trips on a route)
		  canvasBezierStyle: {
            type: 'classBreaks',
            field: 'count',
            classBreakInfos: [{
              classMinValue: 1,
              classMaxValue: 2,
              symbol: {
                strokeStyle: '#ff6666',
                lineWidth: 2,
                lineCap: 'round',
                shadowColor: '#ff6666',
                shadowBlur: 1.5
              }
            }, {
              classMinValue: 3,
              classMaxValue: 10,
              symbol: {
                strokeStyle: '#ff1a1a',
                lineWidth: 4,
                lineCap: 'round',
                shadowColor: '#ff1a1a',
                shadowBlur: 1.5
              }
            }, {
              classMinValue: 11,
              classMaxValue: 20,
              symbol: {
                strokeStyle: '#cc0000',
                lineWidth: 7,
                lineCap: 'round',
                shadowColor: '#cc0000',
                shadowBlur: 1.5
              }
            }, {
              classMinValue: 21,
              classMaxValue: 50,
              symbol: {
                strokeStyle: '#800000',
                lineWidth: 12,
                lineCap: 'round',
                shadowColor: '#800000',
                shadowBlur: 1.5
              }
            }, {
              classMinValue: 51,
              classMaxValue: 1000,
              symbol: {
                strokeStyle: '#4d0000',
                lineWidth: 20,
                lineCap: 'round',
                shadowColor: '#4d0000',
                shadowBlur: 1.5
              }
            }, 
			
			],
            // the layer will use the defaultSymbol if a data value doesn't fit in any of the defined classBreaks
            defaultSymbol: {
              strokeStyle: '#cc0000',
              lineWidth: 3,
              lineCap: 'round',
              shadowColor: '#cc0000',
              shadowBlur: 1.5
            },
          },
		  
		  //define the animation of the flow lines
		  animatedCanvasBezierStyle: {
            type: 'classBreaks',
            field: 'count',
			classBreakInfos: [{
				classMinValue: 1,
				classMaxValue: 1000,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 3,
				lineDashOffsetSize: 2,
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },],
		  defaultSymbol: {
          strokeStyle: '#000000',
          lineWidth: 3,
          lineDashOffsetSize: 1,
          lineCap: 'round',
          shadowColor: '#000000',
          shadowBlur: 0
          },
		},
		//more properties of the animation
          pathDisplayMode: 'selection',
          animationStarted: true,
          animationEasingFamily: 'Linear',
          animationEasingType: 'None',
          animationDuration: 2000,
        }).addTo(map);

        oneToManyFlowmapLayer.on('click', function(e) {
          if (e.sharedOriginFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
          }
          if (e.sharedDestinationFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
          }
        });
      }
    });
	
	//add BLUEbikes logo in map
	L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
		
        var img = L.DomUtil.create('img');
        img.src = 'data/bluebikeslogo.png';
        img.style.width = '200px';
		img.innerHTML = (href='https://www.bluebikes.com/system-data')    
        return img;
    },
	});
	L.control.watermark = function(opts) {
    return new L.Control.Watermark(opts);
	}
	L.control.watermark({ position: 'bottomleft' }).addTo(map);
	
	
	//add map key in map
	var description = L.control({position: 'bottomright'});
	description.onAdd = function (map) {
    var description = L.DomUtil.create('div', 'description');
	description.innerHTML = 
	//html content of description box
	'<div style="width:30px;height:30px;background:rgba(247, 143, 42, 0.4) ;float:left;margin-right:10px;border-radius:30px"></div>'+ '<span style="float:left;margin-top:7px; font-weight:bold"> bike station</span>'+'<br/>'+'<br/>'+
	'<span style="font-size: 14px">number of trips:</span>'+'<br/>'+
	'<div style="width:70px;height:3px;background:#ff6666 ;float:left;margin-right:10px;border-radius:10px"></div><span style="float:left; font-weight:bold">1 - 2</span>'+'<br/>'+
	'<div style="width:70px;height:4px;background:#ff1a1a ;float:left;margin-right:10px;border-radius:10px"></div><span style="float:left; font-weight:bold">3 - 10</span>'+'<br/>'+
	'<div style="width:70px;height:7px;background:#cc0000 ;float:left;margin-right:10px;border-radius:10px"></div><span style="float:left; font-weight:bold">11 - 20</span>'+'<br/>'+
	'<div style="width:70px;height:12px;background:#800000 ;float:left;margin-right:10px;border-radius:10px"></div><span style="float:left; font-weight:bold">21 - 50</span>'+'<br/>'+
	'<div style="width:70px;height:20px;background:#4d0000 ;float:left;margin-right:10px;border-radius:10px"></div><span style="float:left; font-weight:bold">> 51</span>'+'<br/>'
    return description;
	};
	description.addTo(map);


	// create the sidebar instance and add it to the map
    var sidebar = L.control.sidebar({ 
		container: 'sidebar',
		autopan: true,
		position: 'left',
		})
        .addTo(map);
        sidebar.open('home');	
		sidebar.removePanel('autopan');
	
	//create charts from ChartJS library
	//Doughnut Chart
	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
	//type of chart
    type: 'doughnut',
    //data for our dataset
    data: {
        labels: ['0', '1', '2'],
        datasets: [{
            backgroundColor: [
				'#9e9e9e',
				'#4d94ff',
				'#ff4d4d'],
            data: [6510, 44014, 15011]
        }]
    },
    options: {
		animation: {duration: 5000}
	}
	});

	//Line Chart
	var ctx2 = document.getElementById('myChart2').getContext('2d');
	var chart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['1950','1955', '1960','1965', '1970','1975', '1980','1985', '1990','1995', '2000'],
        datasets: [{
			label: 'number of users',
            backgroundColor: '#ff4d4d',
            data: [220,683,1667,2328,8657,3084,4490,7051,13823,16305,7078]
        }]
    },
    options: {
		animation: {duration: 5000}
	}
	});



