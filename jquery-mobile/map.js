	var map;
	var markersArray = [];
	
	
	/// MARKER STYLES 
	officeIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/yellow.png";
	wdlIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/green.png";
	retailIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/purple.png";
	corpIcon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/red.png";
	
	/// JSON DATA FOR STYLE //
	
	var mapStyle = [
		 {
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [
			  { "visibility": "on" },
			  { "color": "#0091b7" }
			]
		  },{
			"featureType": "administrative.country",
			"elementType": "geometry.stroke",
			"stylers": [
			  { "color": "#999999" },
			  { "weight": 1.5 }
			]
		  },
		  {
			"featureType": "administrative.province",
			"elementType": "geometry.stroke",
			"stylers": [
			  {  "color": "#999999" },
			  { "weight": 1 }
			]
		  }
		  
		];

					
	var dataJSONObj = {};
	
	/// SubDivisions of Markers /// 

	
	var markerUSA = [];
	var markerEurope = [];
	var markerAsia = [];
	
	var usaLocs = [];
	var euroLocs = [];
	var asiaLocs = [];
	
	var currentMap = "blorp";
	
	
	/// MAPS BY PROP TYP
	
	var markerCorpOff = [];
	var markerOff = [];
	var markerWDL = [];
	var markerRet = [];
	
	
	// -- ERROR ARRAYS -- // 
	
	var locMarkerErrors = [];
	var propMarkerErrors = [];
  
	var usaCenter;
	var asiaCenter;
	var europeCenter;
	var earthCenter;
	
     function initialize() {
	
		asiaCenter =  new google.maps.LatLng(34.047863,100.6196553)
		europeCenter =  new google.maps.LatLng(54.5259614,15.2551187);  
		usaCenter =  new google.maps.LatLng(39,-93); 
		earthCenter = new google.maps.LatLng(0, 0);
        var mapOptions = {
          center:usaCenter,
          zoom:4,
		  styles: mapStyle,
          mapTypeId: google.maps.MapTypeId.TERRAIN
        };
		
/*
		$.getJSON('_js/file.JSON',function(data) {
	  		dataJSONObj = data;
			createDataGrid();
		});
					*/
	
       	map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
 /*		$('#mapInfoClose').html("X");
        $('#locationBar').html("<div class='locationList' id='us'>United States</div><div class='locationList' id='Europe'>Europe</div><div class='locationList' id='Asia'>Asia</div><div class='locationList' id='Global'>Global</div>");
        $('#propHeader').html("Property Types");
        $('#geoHeader').html("Geogrpahical Regions<br>(all property types)");
        $('#uiToggle').html("UI Toggle");
      
        $('.locationList').click(function(){
            var id = $(this).attr('id');
            if ('us' == id){
                loadRegion("United States");
            }else{
                
                loadRegion(id);
            }
        });	
		
		*/		
	
      }
	  
     google.maps.event.addDomListener(window, 'load', initialize);	  