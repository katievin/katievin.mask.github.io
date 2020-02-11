// check out 'external resources' in the sidebar - there are 2 javascript files there:
//    -jQuery: required for leaflet to work
//    -leaflet: the leaflet library

// create a map in the "map" div, set the view to a given place and zoom
// tell leaflet we want the map to be in the #map div
var center = []
$(document).ready(function() {
// 下載衛福部口罩地點
var numcom = []
var predata = (callback) => {
	$.get('./data/data.csv', function( CSVdata) {
		let data = $.csv.toObjects(CSVdata)
		var maskcon = []
		data.forEach(element => {
			if(element['TGOS X'] !== ''){
			 maskcon.push(element)
			}
		})
		$.get('./data/maskdata.csv', function( CSVdata) {
			var a = {}
			data = $.csv.toObjects(CSVdata)
			data.forEach(element => {
				let code = element['醫事機構代碼']
				let admask = element['成人口罩剩餘數']
				let childmask = element['兒童口罩剩餘數']
				a[code] = [admask , childmask]
			})
			maskcon.forEach(element => {
			 let code = element['醫事機構代碼']
			 if(a[code] !== undefined) {
				 let x = element['TGOS X']
				 let y = element['TGOS Y']
				 element['位置座標'] = [x, y]
				 element['成人口罩總剩餘數'] = a[code][0]
				 element['兒童口罩剩餘數'] = a[code][1]
				 numcom.push(element)
				 // L.marker([y, x]).addTo(map);	
			 }
			 // a[code] = [admask , childmask]
		 }) 
		 callback()
	 })
	 })
}
var getpos = () => {
	if (navigator.geolocation)
    {
		var mapstart = (a) => {
			var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	 	    osmAttrib = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	 	    osm = L.tileLayer(osmUrl, {
	 	        maxZoom: 18,
	 	        attribution: osmAttrib
	 	    });

	 	// initialize the map on the "map" div with a given center and zoom
			var map = L.map('map').setView([center[0], center[1]], 14).addLayer(osm);
			a.forEach(element =>{
				var marker = L.marker([element['位置座標'][1], element['位置座標'][0]]).addTo(map);
				marker.bindPopup("名稱：" + element['醫事機構名稱'] + "<br>成人口罩剩餘數：" + element['成人口罩總剩餘數'] + '<br>兒童口罩剩餘數：' + element['兒童口罩剩餘數']).openPopup();
			})
		}
		
		navigator.geolocation.getCurrentPosition(function(position){
			center.push(position.coords.latitude)
			center.push(position.coords.longitude)
			function distance(lat1, lon1, lat2, lon2, unit) {
				if ((lat1 == lat2) && (lon1 == lon2)) {
					return 0;
				}
				else {
					var radlat1 = Math.PI * lat1/180;
					var radlat2 = Math.PI * lat2/180;
					var theta = lon1-lon2;
					var radtheta = Math.PI * theta/180;
					var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					if (dist > 1) {
						dist = 1;
					}
					dist = Math.acos(dist);
					dist = dist * 180/Math.PI;
					dist = dist * 60 * 1.1515;
					if (unit=="K") { dist = dist * 1.609344 }
					if (unit=="N") { dist = dist * 0.8684 }
					return dist;
				}
			}
			var nearpha = []
			numcom.forEach(element => {
				if(distance(element['位置座標'][1], element['位置座標'][0], center[0], center[1], 'K') <= 3 ){
					nearpha.push(element)
				}
			})
			mapstart(nearpha)
		});
	
    }
  else{
	  x.innerHTML="Geolocation is not supported by this browser.";
	}
}
predata(getpos)
});
// define coordinates for a great brewpub
// $.get('./data/maskdata.csv', function( CSVdata) {
// //    console.log(maskcon)
//    data = $.csv.toObjects(CSVdata)
//    data.forEach(element => {
// 	   maskcon.push(element)
// 	   console.log(maskcon)
//    })
// })
// maskcsv = $.csv.toArray('./data/maskdata.csv');
// maskcsv = $.get('./data/maskdata.csv')
// console.log(maskcsv)
// $.get('http://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D50001-001&l=https://data.nhi.gov.tw/resource/mask/maskdata.csv').done(function (data) {
//     console.log(data);
// });
// $.ajax({
//   type: "GET",
//   headers: {"X-My-Custom-Header": "some value"},
//   url: "'http://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D50001-001&l=https://data.nhi.gov.tw/resource/mask/maskdata.csv'"
// }).done(function (data) {
//   console.log(data);
// });
// add those coordinates to the map as a marker
// var marker = L.marker(breakside).addTo(map);

// define coordinates for a great city park
// var pPark = [[45.569869911521714, -122.67479360103607],
//              [45.56989244332701, -122.67237961292267],
//              [45.56647501625207, -122.67237961292267],
//              [45.56646750519433, -122.67483651638031]
//             ];
// // add those coordinates to the map as a polygon
// var polygon = L.polygon(pPark).addTo(map);

// // add some popups to our marker and polygon
// marker.bindPopup("<b>Hello world!</b><br>I am a brewpub!");
// polygon.bindPopup("I am a lovely park.");