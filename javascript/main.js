
	var map = L.map('map');

    if (L.Browser.mobile) {
      map.setView([42.365, -71.085], 13);
    } else {
      map.setView([42.365, -71.085], 13);
    }

    var GreyBasemap = L.esri.basemapLayer('DarkGray');
	
	var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Mapdesign by Nelson Schäfer | Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var Hydda_Full = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// layer control for basemaps
var basemaps = {
	"Satellite image": Esri_WorldImagery,
	"GreyBasemap": GreyBasemap,
	"Hydda Full": Hydda_Full,

}
L.control.layers(basemaps).addTo(map);

var geojsonMarkerOptions = {
    radius: 3,
    weight: 0,
    color: 'rgb(247, 143, 42))',
    fillColor: 'rgb(247, 143, 42)',
    fillOpacity: 0.9,
    click: true,
    riseOnHover: true
};

var bike_stations = L.geoJson(bike_stations, {
	pointToLayer: function(feature, latlng) {
		return L.circleMarker(latlng, geojsonMarkerOptions)
	}, onEachFeature: onEachStation
}).addTo(map);

function onEachStation(feature, layer){
	layer.on('mouseover', function (e) {
	this.openPopup();
	});
	layer.on('mouseout', function (e) {
	this.closePopup();
	});
	layer.bindTooltip('Station ' +
    feature.properties.Name)};

	var filepath = 'data/201905-bluebikes-tripdata_alt.csv';

	Papa.parse(filepath, {
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
			  style: function(geoJsonFeature) {
  // use leaflet's path styling options

  // since the GeoJSON feature properties are modified by the layer,
  // developers can rely on the "isOrigin" property to set different
  // symbols for origin vs destination CircleMarker stylings



//these values have no effect on the output????
  if (geoJsonFeature.properties.isOrigin) {
    return {
      renderer: canvasRenderer, // recommended to use your own L.canvas()
      radius: 500,
      weight: 1,
      color: 'rgb(0, 166, 226)',
      fillColor: 'rgba(195, 255, 62, 1)',
      fillOpacity: 0.6
    };
  } else {
    return {
      renderer: canvasRenderer,
      radius: 2500,
      weight: 0.25,
      color: 'rgb(0, 166, 226)',
      fillColor: 'rgb(17, 142, 170)',
      fillOpacity: 0.7
    };
  }
  
}
			  
			  
            }
          })
        };

//Bezier Flow Curves
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
            // the layer will use the defaultSymbol if a data value doesn't fit
            // in any of the defined classBreaks
            defaultSymbol: {
              strokeStyle: '#cc0000',
              lineWidth: 3,
              lineCap: 'round',
              shadowColor: '#cc0000',
              shadowBlur: 1.5
            },
          },
		  
		  animatedCanvasBezierStyle: {
            type: 'classBreaks',
            field: 'count',
			classBreakInfos: [{
				classMinValue: 1,
				classMaxValue: 1000,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 3,
				lineDashOffsetSize: 2, // custom property used with animation sprite sizes
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },
			{
				classMinValue: 3,
				classMaxValue: 10,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 5,
				lineDashOffsetSize: 2, // custom property used with animation sprite sizes
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },
						{
				classMinValue: 11,
				classMaxValue: 20,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 5,
				lineDashOffsetSize: 2, // custom property used with animation sprite sizes
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },
						{
				classMinValue: 21,
				classMaxValue: 50,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 5,
				lineDashOffsetSize: 1, // custom property used with animation sprite sizes
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },
									{
				classMinValue: 51,
				classMaxValue: 1000,
				symbol: {
				strokeStyle: '#000000',
				lineWidth: 5,
				lineDashOffsetSize: 1, // custom property used with animation sprite sizes
				lineCap: 'round',
				shadowColor: '#000000',
				shadowBlur: 0
              }
            },
			
			],
			defaultSymbol: {
          strokeStyle: '#000000',
          lineWidth: 3,
          lineDashOffsetSize: 1, // custom property used with animation sprite sizes
          lineCap: 'round',
          shadowColor: '#000000',
          shadowBlur: 0
            },

      },
		  

		  //valid inputs: 'selection', 'all'
          pathDisplayMode: 'selection',
		  //valid inputs: true, false
          animationStarted: true,
		  //Cubic, Circular, Bounce, ...
          animationEasingFamily: 'Linear',
		  //valid inputs: Out, In, None
          animationEasingType: 'None',
          animationDuration: 2000,
		  //animationStyle: 'Linear', 
		  
		  
        }).addTo(map);
		
		//getAnimationEasingOptions();

/*
////////////
canvasBezierStyle: {
        type: 'simple',
        symbol: {
          // use canvas styling options (compare to CircleMarker styling below)
          strokeStyle: 'rgba(255, 0, 51, 0.8)',
          lineWidth: 0.75,
          lineCap: 'round',
          shadowColor: 'rgb(255, 0, 51)',
          shadowBlur: 1.5
        }
      },

      animatedCanvasBezierStyle: {
        type: 'simple',
        symbol: {
          // use canvas styling options (compare to CircleMarker styling below)
          strokeStyle: 'rgb(255, 46, 88)',
          lineWidth: 1.25,
          lineDashOffsetSize: 100, // custom property used with animation sprite sizes
          lineCap: 'round',
          shadowColor: 'rgb(255, 0, 51)',
          shadowBlur: 5
        }
      },


////////
*/






        // since this demo is using the optional "pathDisplayMode" as "selection",
        // it is up to the developer to wire up a click or mouseover listener
        // and then call the "selectFeaturesForPathDisplay()" method to inform the layer
        // which Bezier paths need to be drawn
        oneToManyFlowmapLayer.on('click', function(e) {
          if (e.sharedOriginFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');
          }
          if (e.sharedDestinationFeatures.length) {
            oneToManyFlowmapLayer.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
          }
        });

        // immediately select an origin point for Bezier path display,
        // instead of waiting for the first user click event to fire
        //oneToManyFlowmapLayer.selectFeaturesForPathDisplayById('start station id', 221, true, 'SELECTION_NEW');
      }
    });
	
	
	
	
	//BLUEbikes logo
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
			
			
			
			sidebar.addPanel({
			id: 'test',
			tab: '<i class="fa fa-github"></i>',
			button: 'https://github.com/nickpeihl/leaflet-sidebar-v2',
			
});
			sidebar.removePanel('test');
			sidebar.removePanel('autopan');



		//sidebar.remove();
		
		
		
		
		
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ['0', '1', '2'],
        datasets: [{
            backgroundColor: [
				'#9e9e9e',
				'#4d94ff',
				'#ff4d4d'],
            //borderColor: 'rgb(255, 99, 132)',
            data: [6510, 44014, 15011]
        }]
    },

    // Configuration options go here
    options: {
		 animation: {duration: 5000}
	}
});

var ctx2 = document.getElementById('myChart2').getContext('2d');
var chart = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['1950','1955', '1960','1965', '1970','1975', '1980','1985', '1990','1995', '2000'],
        datasets: [{
			label: 'number of users',
            backgroundColor: '#ff4d4d',

            //borderColor: 'rgb(255, 99, 132)',
            data: [220,683,1667,2328,8657,3084,4490,7051,13823,16305,7078]
        }]
    },

    // Configuration options go here
    options: {
				 animation: {duration: 5000}
	}
});



