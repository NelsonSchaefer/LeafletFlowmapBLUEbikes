# LeafletFlowmapBLUEbikes

This web map application visualizes trip data from a bike sharing service using flow maps.
It uses [LeafletJS](https://leafletjs.com/) as a basis and creates flow lines using the plugin [Leaflet.Canvas-Flowmap-Layer](https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer).

![](title_image.png)

[See the application in action here](https://nelsonschaefer.github.io/LeafletFlowmapBLUEbikes/)!

A detailed report about this project can be found here.

# the map
The web map application shows bike sharing stations and the routes taken between them. A click on a station lets you see all stations that were used as a destination from this very starting point.
The flow lines, the animation and the points of the bike stations were all created by fucntions of the [Leaflet.Canvas-Flowmap-Layer](https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer) library. To do this, the raw data has to be provided in a specially structured CSV-file.
# the data
The dataset used in this project are trip data from the BLUEbikes bike sharing system in Boston, Massachussets. On their [website](https://www.bluebikes.com/system-data) BLUEbikes provides free datasets about the usage of their system. This data was edited in Excel and then visualized in this application.
# additional features
This web application also includes a sidebar which provides a map description for the user. It was implemented by using the Leaflet Plugin [leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2/).
Part of the content of this sidebar are charts describing the bike sharing data. These were created using the [Chart.js](https://www.chartjs.org/) library.


