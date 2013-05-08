// JavaScript Document

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
		

		$.getJSON('http://idesignmatters.com/mobile/_js/file.JSON',function(data) {
	  		dataJSONObj = data;
			createDataGrid();
		});
					
	
       	map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
 		$('#mapInfoClose').html("X");
        $('#locationBar').html("<div class='locationList' id='us'>United States</div><div class='locationList' id='Europe'>Europe</div><div class='locationList' id='Asia'>Asia</div><div class='locationList' id='Global'>Global</div>");
        $('#propHeader').html("Property Types");
        $('#geoHeader').html("Geogrpahical Regions<br>(all property types)");
        $('#uiToggle').html("UI Toggle");
      
	  
	  	$('#keepOpen').html("<input class='cbox' type='checkbox' id='ko'/><label for='ko'>Keep Open</label>");
	  
        $('.locationList').click(function(){
            var id = $(this).attr('id');
            if ('us' == id){
                loadRegion("United States");
            }else{
                
                loadRegion(id);
            }
        });			
	
      }


	  function createDataGrid(){
		var usaMarkerOrder = ['E','NE','MA','SE','C','S','MW','W','NW', 'SW'];
		var usTemp = [];

	
	
		var i;
		var len = dataJSONObj.length;
		for (i = 0; i < len; i++){
			
			addMarker(i);
			var cg = dataJSONObj[i].companyGroup;
			switch(cg){
				case "Europe":
					markerEurope.push(i);
					addLocArray(dataJSONObj[i].companyCountry, euroLocs);
					break;
				case "Asia":
					markerAsia.push(i);
					addLocArray(dataJSONObj[i].companyCountry, asiaLocs);
					break;	
				default:
					markerUSA.push(i);
					addLocArray(cg, usTemp);
					break;																		
				
			}
			// CHECK FOR USA // 
			var pt = dataJSONObj[i].companyPropertyType;
			switch(pt){
				case "CorpOffice":
					markerCorpOff.push(i);
					break;
				case "Office":
					markerOff.push(i);
					break;
				case "WDL":
					 markerWDL.push(i);
					break;						
				case "Retail":
					markerRet.push(i);
					break;
				default:
					propMarkerErrors.push(i);
					break;		
			}

	
		}
			
			
			usaLocs = sortRegions(usaMarkerOrder, usTemp);	
		
		
			/* NEW SUB HEADER 
				PROP TYPE 				
				
			*/
			
		// Add Prop Type List // 	
		$('#propHeader').html("Propert Types");
		  
		div = "<div class='listItem' id='OfficeSide'><div class='dot' id='officeDot'></div><input class='cbox' type='checkbox' id='p0'/><label for='p0'>Office</label></div>";
		 $('#propList').append(div);
		
		div = "<div class='listItem' id='WDLSide'><div class='dot' id='WDLDot'></div><input class='cbox' type='checkbox' id='p1'/><label for='p1'>Warehouse/<br>Distribution/<br>Logisitics</label></div>";
		 $('#propList').append(div);
		 
		div = "<div class='listItem' id='RetailSide'><div class='dot' id='retailDot'></div><input type='checkbox' class='cbox' id='p2'/><label for='p2'>Retail</label></div>";
		 $('#propList').append(div);
		 
		div = "<div class='listItem' id='corpOffice'><div class='dot' id='corpOfficeDot'></div>Corporate Office</div>";
		 $('#propList').append(div);			 
		 
		 $('cbox').click(runMarkers);
		 
		 
		  $('#picContainer').click(function(){
			closeInfo();
		  });
		  
		  $('#mapInfoClose').click(function(){
			closeInfo();
		  });
		  
		  
		  $('#uiToggle').click(showUi);		 
		  
		loadRegion("United States");
       
	   
	   /// SWITCH ALL CSS VISIBLE //// 
		  
	  }
	  
	  
	  function runMarkers(){	  
	  
	  	// GET PROPERT TYPE ///
		hideMarkers(); 
		var propArray = [];
		var propAdd = false;
		if("Asia" != currentMap){
			 if(p0.checked){
				 propAdd = true;
				 propArray = propArray.concat(markerOff);
			 }
					 
			if(p1.checked){
				propAdd = true;
				propArray = propArray.concat(markerWDL);
			 }
					 
			if(p2.checked){
				propAdd = true;
				 propArray = propArray.concat(markerRet);
			 }	
		
		}
		
		/// GET LOCATIONS /////
		var regionArray = [];
		var locArray = [];
		var placeArray = [];		
		if("Global" == currentMap){
 			if(usaCB.checked){
				 regionArray = regionArray.concat(markerUSA);
			 }
					 
			if(euroCB.checked){
				regionArray = regionArray.concat(markerEurope);
			 }
					 
			if(asiaCB.checked){
				 regionArray = regionArray.concat(markerAsia);
			 }				
			
		
	
		}else{
				
			switch(currentMap){
				case "United States":
					locArray = markerUSA;
					placeArray = usaLocs;
					break;
				case "Europe":
					locArray = markerEurope;
					placeArray = euroLocs;
					break;
				case "Asia":
					placeArray = asiaLocs;
					locArray = markerAsia;
					break;
					
				}
				
			var len = placeArray.length;
			var i;
			var loc;
			var geoCBID;
			var place;
			for (i = 0; i < len; i++){
				var geoCBID = "#g" +i;
				place = placeArray[i];
						
					if(  $(geoCBID).is(':checked')){
						// add Country //
						var lenj = locArray.length; 	
						var j;
						for(j = 0; j < lenj; j++){
							if(place == dataJSONObj[locArray[j]].companyCountry || place == dataJSONObj[locArray[j]].companyGroup){
									regionArray.push(locArray[j]);
							}
								
						}
							
					}
						
				}
		
		}
		
		///// SHOW COMMON  MARKERS ////
		
		var commonArray = []
		if(regionArray.length > 0 && propAdd ){
			commonArray = combineArraysCommon(regionArray, propArray);
			
		}else if(regionArray.length > 0){
			commonArray = commonArray.concat(regionArray);
		}else if (propArray.length > 0 ){
			if("Global" != currentMap){
				commonArray = combineArraysCommon(locArray, propArray);
				
			}else{
				commonArray = commonArray.concat(propArray);
			}
		}
		/// CORP OFFICES TO US AND GLOBAL MAP
		if("Global" == currentMap||"United States" == currentMap){
			commonArray = commonArray.concat(markerCorpOff);
		}

		showProperty(commonArray);
		return;
	 }

  function addMarker(n){
		var spot = new google.maps.LatLng(Number (dataJSONObj[n].lat),Number (dataJSONObj[n].long));
		var typeIcon;
		switch(dataJSONObj[n].companyPropertyType){
			case "CorpOffice":
				typeIcon = corpIcon;
				break;
			case "Retail":
				typeIcon = retailIcon;
				break;				
			case "WDL":
				typeIcon = wdlIcon;
				break;							
			case "Office":
				typeIcon = officeIcon;
				break;				
		}
		
		
		var marker = new google.maps.Marker({
				position: spot,
				animation: google.maps.Animation.DROP,
				title:dataJSONObj[n].companyName,
				icon:typeIcon
			});	  
		  markersArray.push(marker);
			  
		 google.maps.event.addListener(marker, 'click', function() {
			 	addInfoDiv(n);
			});		  
		  

		  
	  }
	
	function clearPropertyChecks(){
		 p0.checked = false;
		 p1.checked = false;
		 p2.checked = false;
		 return;	
		
	}
	
	/// MAKE AND ARRAY OF COMMON ELEMENTS 
	function combineArraysCommon(a, b){
		var newArray = [];
		var lenA = a.length;
		var lenB = b.length;
		var i;
		var j;
		for(i = 0; i < lenA; i++){
			for(j=0; j < lenB; j++){
				if(a[i] == b[j]){
					newArray.push(a[i]);
					break;	
				}
			
			}
		}
		return newArray;
	}
	
	function showProperty(array){
		
	
		hideMarkers();
		if (markersArray) {
			for (i in array) {
				markersArray[array[i]].setMap(map);
				markersArray[array[i]].setAnimation(google.maps.Animation.DROP);
			}
		  }
		hideUi();
	}	 
	
	  
	function hideMarkers() {
	  if (markersArray) {
		for (i in markersArray) {
			  markersArray[i].setMap(null);
			}
		  }
		 closeInfo();
	}



	 function showUi(){
		$('#uiCanvas').css('visibility','visible');
		$('#uiToggle').css('visibility','hidden');
		closeInfo();
		 
	 }
	 
	 function hideUi(){
		if(!ko.checked){
			$('#uiCanvas').css('visibility','hidden');	
			$('#uiToggle').css('visibility','visible');
		}
	 }	 
	
	function closeInfo(){
		$('#mapInfoShell').css('visibility','hidden');
		$('#picContainer').css('visibility','hidden');
	}
	

	function loadRegion(r){
		
		switch(r){
			case "United States":
				map.setZoom(4);
				map.setCenter(usaCenter);			
				addDynamicGeoLinks(markerUSA, usaLocs);
				$('#corpOffice').show();
				$('#propHeader').show();
				$('#propList').show();	 
				break;
			case "Europe":
				map.setZoom(4);
				map.setCenter(europeCenter);
				addDynamicGeoLinks(markerEurope, euroLocs);
				$('#propHeader').show();
				$('#propList').show();
				$('#corpOffice').hide();	 				
				break;
			case "Asia":
				map.setZoom(3);
				map.setCenter(asiaCenter);		
				addDynamicGeoLinks(markerAsia, asiaLocs);
				$('#propHeader').hide();
				$('#propList').hide();	 
				break;
			case "Global":
				map.setZoom(1);
				map.setCenter(earthCenter);
				addGlobalGeoLinks();
				$('#propHeader').show();
				$('#propList').show();	
				$('#corpOffice').show(); 
				break;	
				
			}
			
		if(r!= currentMap){
			hideMarkers();
			clearPropertyChecks();
		}
		
		currentMap = r;
		$(typeHeader).html(r);
		runMarkers();	
	}
	

	
	function addGlobalGeoLinks(){
		$('#geoLists').empty();
		
		var	globalDivs = "<div class='geoItem'><input type='checkbox' class='cbox' id='usaCB'/><label for='usaCB'>United States</label></div>";
		$('#geoLists').append(globalDivs);
	
		globalDivs = "<div class='geoItem'><input type='checkbox' class='cbox' id='euroCB'/><label for='euroCB'>Europe</label></div>";
		$('#geoLists').append(globalDivs);
		globalDivs = "<div class='geoItem'><input type='checkbox' class='cbox' id='asiaCB'/><label for='asiaCB'>Asia</label></div>";
		$('#geoLists').append(globalDivs);
		$('.cbox').click(runMarkers);	
	}
	
	function addLocArray(c, a){
		var len = a.length;
		var notExists = true;
		var i;
		for (i = 0; i < len; i++){
			if(c == a[i]){
				notExists = false;
				break;	
			}
			
		}
		if(notExists){
			a.push(c);	
		}
	}	
		
	
	function addDynamicGeoLinks(markerArray, locArray){		
		$('#geoLists').empty();	
		var div;
		
		var len = locArray.length;
		var i;
		var loc;
		var id;
		for (i = 0; i < len; i++){
			loc = locArray[i];
			id = "#" + loc;
			
			var geoCBID = "g" +i
			div = "<div class='geoItem' id='"+loc+"'><input type='checkbox' class='cbox' id='"+geoCBID+"'/><label for='"+geoCBID+"'>"+getLocFullName(loc)+"</label></div>";
			$('#geoLists').append(div);
			
		}
		
		$('.cbox').click(runMarkers);	
	}
	
	function getLocFullName(l){
		var name;
		switch(l){
			case "E":
				return "East";
			case "NE":
				return "Northeast";
			case "SE":
				return "Southeast";
			case "C":
				return "Centeral";		
			case "MA":
				return "Mid Atlantic";	
			case "S":
				return "South";		
			case "NW":
				return "Northwest";
			case "SW":
				return "Southwest";
			case "W":
				return "West";	
			case "MW":
				return "Midwest";														
		}
		
		return l;
	}
	
	function showAllMarkers() {
		  if (markersArray) {
			for (i in markersArray) {
			  markersArray[i].setMap(map);
			   markersArray[i].setAnimation(google.maps.Animation.DROP);
			}
		  }
		  hideUi();
		}	 

	function showSingleMarker(n) {
			hideMarkers();		
		  if (markersArray) {
			  markersArray[n].setMap(map);
			  markersArray[n].setAnimation(google.maps.Animation.DROP);
			  
  			 map.setZoom(6);
   			 map.setCenter(markersArray[n].getPosition());			  
			  
		  }
		  
		  hideUi();
		}		
	
	function getInfo(n){
		var contentString = "<div><div id='mapInfoSubHeader'>Property Name</div>";
		contentString += "<div id='mapInfoSubLine'>"+ dataJSONObj[n].companyName + "</div>";
		contentString += "<div id='mapInfoSubHeader'>Market</div>";		
		contentString += "<div id='mapInfoSubLine'>" +dataJSONObj[n].companyMarket+ "</div>";
		contentString += "<div id='mapInfoSubHeader'>Date Acquired</div>";	
		contentString += "<div id='mapInfoSubLine'>" +dataJSONObj[n].companyDateAcq+ "</div>";
		contentString += "<div id='mapInfoSubHeader'>Property Type</div>";	
		contentString += "<div id='mapInfoSubLine'>" +dataJSONObj[n].companyPropertyType+ "</div>";
		contentString += "<div id='mapInfoSubHeader'>Description</div>";	
		contentString += "<div id='mapInfoPharagraph'>" +dataJSONObj[n].longText+ "</div></div>";	
		return contentString;		
	}
			
		 
	  function addInfoDiv(n){
		$('#mapInfo').html(getInfo(n));
		$('#picContainer').css('background-image', 'url('+dataJSONObj[n].image+')');
		$('#picContainer').css('visibility','visible');
		$('#mapInfoShell').css('visibility','visible');
		hideUi();
		return;          
	  }
	  
	 function sortRegions(a, b){
		var newArray = [];
		var len = a.length;
		var i;
		var j;
		var checkItem;
		var lenj =b.length;
		for(i = 0; i < len; i++){
			checkItem = a[i];
			for(j = 0; j < lenj; j++){
				if(checkItem == b[j]){
					newArray.push(checkItem);
					break;	
				}
				
			}
			
			
		}
		return newArray;
	 }	
	 
     google.maps.event.addDomListener(window, 'load', initialize);	  