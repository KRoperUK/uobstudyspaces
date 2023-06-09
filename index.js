let locale = navigator.language || navigator.userLanguage;
let date = new Date();

const report = browserReportSync();
const os = report.os.name;

if (localStorage.getItem("onlyOpen") === null) {
localStorage.setItem("onlyOpen", "true");
} else if (localStorage.getItem("onlyOpen") === "true") {
document.getElementById("openDisclaimer").innerHTML = "Showing only open study spaces";
} else if (localStorage.getItem("onlyOpen") === "false") {
document.getElementById("openDisclaimer").innerHTML = "Showing all study spaces";
}

if (localStorage.getItem("layerIndex") === null) {
localStorage.setItem("layerIndex", "0");
}

const studySpaceIcon = L.icon({
iconUrl: '/assets/studyspace.png',
// shadowUrl: 'leaf-shadow.png',

iconSize:     [32, 32], // size of the icon
// shadowSize:   [50, 64], // size of the shadow
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
// shadowAnchor: [4, 62],  // the same for the shadow
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

tileLayers = [];

customIcons = {};

customIcons["heybrew"] = L.icon({
iconUrl: '/assets/heybrew.jpeg',
// shadowUrl: 'leaf-shadow.png',

iconSize:     [32, 32], // size of the icon
// shadowSize:   [50, 64], // size of the shadow
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
// shadowAnchor: [4, 62],  // the same for the shadow
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

customIcons["200deg"] = L.icon({
    iconUrl: '/assets/200-degree.png',
    iconSize:     [32, 32], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

customIcons["costa"] = L.icon ({
iconUrl: '/assets/costa.png',
iconSize:     [32, 32], // size of the icon
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

customIcons["otherStudy"] = L.icon ({
iconUrl: '/assets/book.svg',
iconSize:     [32, 32], // size of the icon
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

customIcons["starbucks"] = L.icon ({
iconUrl: '/assets/starbucks.png',
iconSize:     [32, 32], // size of the icon
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

customIcons["coffee"] = L.icon ({
iconUrl: '/assets/coffee.svg',
iconSize:     [32, 32], // size of the icon
iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
popupAnchor:  [0,-16] // point from which the popup should open relative to the iconAnchor
});

var map = L.map('map').setView([52.45072845817002, -1.9305795352004038], 16);
// map.doubleTapDragZoom = true;
// map.doubleTapDragZoomOptions = {
//     reverse: false,
//   }
map.options.minZoom = 15;

tileLayers.push(OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}));

tileLayers.push (
Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
})
);

tileLayers.push(
Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
})
);

tileLayers.push(
DarkGreyBase = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
})
);
tileLayers.push(
LightGreyBase = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
})
);
tileLayers.push(
Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    maxZoom: 20,
})
);



var openStudySpaces = L.layerGroup();
var closedStudySpaces = L.layerGroup();

function updateMap() {
for (let campus in spaces) {
    for (let building of spaces[campus]) {

        var marker = L.marker(building.coordinates,
        {icon: building.customicon ? customIcons[building.customicon] : (campus == "Other" ? customIcons["otherStudy"] : studySpaceIcon)}
        );

        hoursFlag = false;

        markerPopup = L.DomUtil.create('div');

        markerHeading = L.DomUtil.create('h3');
        markerHeading.style.marginTop = 0;
        markerHeading.style.marginBottom = "2px";
        markerHeading.style.color = "black";

        
        markerHeadingText = L.DomUtil.create('small');

        if (building.url) {
            markerHeadingText.innerHTML = `<a style="text-decoration: none;" href="${building.url}">` + building.name + `</a>`;
            } else {
            markerHeadingText.innerHTML = building.name;
            }

            markerHeadingDirectionsA = L.DomUtil.create('a');
            markerHeadingDirectionsA.href = `https://www.google.com/maps/dir/?api=1&destination=${building.coordinates[0]},${building.coordinates[1]}&travelmode=walking`;
            markerHeadingDirectionsA.style.textDecoration = "none";

            markerHeadingDirectionsIcon = L.DomUtil.create('i');
            markerHeadingDirectionsIcon.style.marginLeft = "0.5em";
            markerHeadingDirectionsIcon.style.fontSize = "16px";
            markerHeadingDirectionsIcon.style.color = "black";
            markerHeadingDirectionsIcon.className = "fas fa-directions";
            markerHeadingDirectionsIcon.style.cursor = "pointer";
            markerHeadingDirectionsA.appendChild(markerHeadingDirectionsIcon);

            markerHeading.appendChild(markerHeadingText);
            markerHeading.appendChild(markerHeadingDirectionsA);

            markerPopup.appendChild(markerHeading);

            markerList = L.DomUtil.create('ul');
            markerList.style.marginTop = 0;
            markerList.style.marginBottom = 0;

        if (building.opening_hours) {
            markerListOpeningHours = L.DomUtil.create('li');
            markerListOpeningHours.innerHTML = `Opening hours: ${building.opening_hours}`;
            
            let oh = new opening_hours(building.opening_hours, null, { 'locale': locale });
            const state = oh.getState(date)
            
            if (state) {
                markerListOpeningHours.innerHTML += " (Open)";
                markerListOpeningHours.style.color = "green";
                hoursFlag = true;
            } else {
                markerListOpeningHours.innerHTML += " (Closed)";
                markerListOpeningHours.style.color = "red";
            }
            
            markerListOpeningHoursHint = L.DomUtil.create('li');
            markerList.appendChild(markerListOpeningHours);

            if (oh.getNextChange(date) > date) {
                var minutes = Math.floor((oh.getNextChange(date) - date) / 1000 / 60);
                var hours = Math.floor((oh.getNextChange(date) - date) / 1000 / 60 / 60);
                var days = Math.floor((oh.getNextChange(date) - date) / 1000 / 60 / 60 / 24);

                if (days <= 1) {
                    if (hours >= 1){
                        markerListOpeningHoursHint.innerHTML = `${state ? "Closing" : "Opening"} in ${hours} hour${hours > 1 ? "s" : ""}`;
                    } else {
                        if (minutes >= 1) {
                            console.log(building.name, minutes);
                            markerListOpeningHoursHint.innerHTML = `${state ? "Closing" : "Opening"} in ${minutes} minute${minutes > 1 ? "s" : ""}`;
                        } else {
                            markerListOpeningHoursHint.innerHTML = `${state ? "Closing" : "Opening"} in less than a minute`;
                        }
                    }
                } else {
                    markerListOpeningHoursHint.innerHTML = `${state ? "Closing" : "Opening"} in ${days} day${days > 1 ? "s" : ""}`;
                }
                markerListOpeningHoursHint.style.color = (state ? "red": "green" );
                markerList.appendChild(markerListOpeningHoursHint);
                
            }
            
            // console.log(oh.getWarnings());
        
        }

        if (building.notes) {
        markerListNotes = L.DomUtil.create('li');
        markerListNotes.innerHTML = building.notes;
        markerList.appendChild(markerListNotes);
        }

        if (building.spaces) {
        markerListSpaces = L.DomUtil.create('li');
        markerListSpaces.innerHTML = `Spaces: ${building.spaces}`;
        markerList.appendChild(markerListSpaces);
        }

        if (building.cafe) {
            markerListCafe = L.DomUtil.create('li');
            markerListCafe.innerHTML = `Has a cafe`;
            markerList.appendChild(markerListCafe);
        }

        if (building.usbc) {
            markerListUSBC = L.DomUtil.create('li');
            markerListUSBC.innerHTML = `Has USB-C port chargers`;
            markerList.appendChild(markerListUSBC);
        }

        if (building.adjustable_desks) {
            markerListAdjustable = L.DomUtil.create('li');
            markerListAdjustable.innerHTML = `Has adjustable desks`;
            markerList.appendChild(markerListAdjustable);
        }

        if (building.vending_machines) {
            markerListVending = L.DomUtil.create('li');
            markerListVending.innerHTML = `Has vending machines`;
            markerList.appendChild(markerListVending);
        }

        if (building.computers) {
            markerListComputers = L.DomUtil.create('li');
            markerListComputers.innerHTML = `Has computers`;
            markerList.appendChild(markerListComputers);
        }

        if (building.quiet) {
            markerListQuiet = L.DomUtil.create('li');
            markerListQuiet.innerHTML = `Has quiet study`;
            markerList.appendChild(markerListQuiet);
        }

        if (building.group) {
            markerListGroup = L.DomUtil.create('li');
            markerListGroup.innerHTML = `Has group study`;
            markerList.appendChild(markerListGroup);
        }

        markerPopup.appendChild(markerList);


        marker.bindPopup(markerPopup);
        
        if (hoursFlag) {
            marker.addTo(openStudySpaces);
        } else {
            marker.addTo(closedStudySpaces);
        }
        
    }
}
}
function handleRefresh(dateI = null) {
    if (dateI == null) {
        date = new Date();
    }
    openStudySpaces.clearLayers();
    closedStudySpaces.clearLayers();

    document.getElementById("time").innerHTML = date.toLocaleTimeString(locale, {weekday:"long", day: "2-digit", month: "long", year: "numeric",hour: '2-digit', minute:'2-digit'}) + "&nbsp;<i class='fas fa-sync-alt'></i>";
    if (document.getElementById("mapClockSpan")){
        document.getElementById("mapClockText").innerText = date.toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'});
    }
    console.log("Refreshed", date.toLocaleTimeString(locale, {weekday:"long", day: "2-digit", month: "long", year: "numeric",hour: '2-digit', minute:'2-digit'}));
    updateMap();
}

function handleOffset(hourOffset) {
    openStudySpaces.clearLayers();
    closedStudySpaces.clearLayers();
    date.setHours(date.getHours() + hourOffset);
    document.getElementById("time").innerHTML = date.toLocaleTimeString(locale, {weekday:"long", day: "2-digit", month: "long", year: "numeric",hour: '2-digit', minute:'2-digit'}) + "&nbsp;<i class='fas fa-sync-alt'></i>";
    document.getElementById("mapClockText").innerText = date.toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'});
    console.log("Offset", date.toLocaleTimeString(locale, {weekday:"long", day: "2-digit", month: "long", year: "numeric",hour: '2-digit', minute:'2-digit'}));
    updateMap();
}

updateMap();
function handleLayerChange() {
if (localStorage.getItem("layerIndex") == null || localStorage.getItem("layerIndex") >= tileLayers) {
    localStorage.setItem("layerIndex", 0);
}

tileLayers[parseInt(localStorage.getItem("layerIndex"))].removeFrom(map);
localStorage.setItem("layerIndex", (parseInt(localStorage.getItem("layerIndex")) + 1) % tileLayers.length);
tileLayers[parseInt(localStorage.getItem("layerIndex"))].addTo(map);
}
function handleTimingChange() {
if (localStorage.getItem("onlyOpen") == "true") {
    localStorage.setItem("onlyOpen", "false");
    if (!map.hasLayer(closedStudySpaces)) {
    closedStudySpaces.addTo(map);
    }
    if (document.getElementById("timingA") != null) {
        document.getElementById("timingA").style.color = "black";

    }
    document.getElementById("openDisclaimer").innerText = "Showing all study spaces";
    console.log("Showing all study spaces");
} else {
    localStorage.setItem("onlyOpen", "true");
    if (map.hasLayer(closedStudySpaces)) {
    closedStudySpaces.removeFrom(map);
    }
    if (document.getElementById("timingA") != null) {
        document.getElementById("timingA").style.color = "green";

    }
    document.getElementById("openDisclaimer").innerText = "Showing only open study spaces";
    console.log("Showing only open study spaces");
}

}

openStudySpaces.addTo(map);
if (localStorage.getItem("onlyOpen") != "true") {
closedStudySpaces.addTo(map);
}
if (localStorage.getItem("layerIndex") == null || localStorage.getItem("layerIndex") >= tileLayers.length - 1) {
localStorage.setItem("layerIndex", 0);
}
tileLayers[parseInt(localStorage.getItem("layerIndex"))].addTo(map);

function handleDateModal() {
    if (map.isFullscreen()) {
        map.toggleFullscreen();
    }

    document.getElementById("dateDialog").show();

    var prevDate = new Date(new Date().setDate(date.getDate()-7));
    var futureDate = new Date(new Date().setDate(date.getDate()+14));

    document.getElementById("dateInputDate").min = prevDate.toISOString().substring(0,10);
    document.getElementById("dateInputDate").max = futureDate.toISOString().substring(0,10);
    document.getElementById("dateInputTime").value = date.toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'});
    document.getElementById("dateInputDate").defaultValue = date.toISOString().substring(0,10);
}

L.Control.Clock = L.Control.extend({
    onAdd: function(map) {
        var clockD = L.DomUtil.create('div');
        clockD.id = "mapClock";
        clockD.className = 'leaflet-bar leaflet-control';
        clockD.style.backgroundColor = 'white';
        
        var clockS = L.DomUtil.create('span');
        clockS.id = "mapClockSpan";
        clockS.innerHTML = "<a style='display: inherit; color: var(--link-color);' href=javascript:handleDateModal(); id='mapClockText'>" + date.toLocaleTimeString(locale, {hour: '2-digit', minute:'2-digit'}) + "</a>";
        clockS.style.fontWeight = 'bold';
        clockS.style.fontSize = '2rem';
        clockS.style.padding = '0px 5px 0px 5px';

        clockD.appendChild(clockS);
        return clockD;
    }
});

L.control.clock = function(opts) {
return new L.Control.Clock(opts);
}

// L.control.clock({ position: 'bottomleft' }).addTo(map);

L.Control.LayerSwap = L.Control.extend({
onAdd: function(map) {
    var wholeD = L.DomUtil.create('div');
    // var barOne = L.DomUtil.create('div');
    var barTwo = L.DomUtil.create('div');
    // var layerA = L.DomUtil.create('a');
    // var timingA = L.DomUtil.create('a');
    var plusOneA = L.DomUtil.create('a');
    var minusOneA = L.DomUtil.create('a');
    var refreshA = L.DomUtil.create('a');

    // barOne.className = 'leaflet-bar leaflet-control';
    // barOne.style.marginTop = '0px';
    barTwo.className = 'leaflet-bar leaflet-control';

    // timingA.href="javascript:handleTimingChange()";
    // timingA.innerHTML=`<i id="timingA" style="color: ${localStorage.getItem("onlyOpen") == "true" ? "green" : "black"}" class=\"fas fa-clock\"></i>`;

    // layerA.href="javascript:handleLayerChange()";
    // layerA.innerHTML=`<i style="color: black;" class=\"fas fa-map\"></i>`;

    plusOneA.href="javascript:handleOffset(1)";
    plusOneA.innerHTML=`<i style="color: black;" class=\"fas fa-plus\"></i> <i id="time" style="color: black;" class=\"fas fa-clock\"></i></i>`;

    minusOneA.href="javascript:handleOffset(-1)";
    minusOneA.innerHTML=`<i style="color: black;" class=\"fas fa-minus\"></i> <i id="time" style="color: black;" class=\"fas fa-clock\"></i></i>`;

    refreshA.href="javascript:handleRefresh()";
    refreshA.innerHTML=`<i style="color: black;" class=\"fas fa-sync-alt\"></i> <i id="time" style="color: black;" class=\"fas fa-clock\"></i></i>`;

    // visitedD.appendChild(layerA);
    // barOne.appendChild(timingA);
    barTwo.appendChild(plusOneA);
    barTwo.appendChild(minusOneA);
    barTwo.appendChild(refreshA); 

    // wholeD.appendChild(barOne);
    wholeD.appendChild(barTwo);
    wholeD.addEventListener('mouseover', function() {
        mouseHoverMapButtons = true;
    });
    wholeD.addEventListener('mouseout', function() {
        mouseHoverMapButtons = false;
    });
    
    return wholeD;
},
    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.layerswap = function(opts) {
    return new L.Control.LayerSwap(opts);
}

handleRefresh();
L.control.clock({ position: 'topleft' }).addTo(map);
map.zoomControl.setPosition('topleft');
var lc = L.control.locate({onLocationError: function () { console.log("Location Denied"); }}).addTo(map);


// Create a new map with a fullscreen button:

// or, add to an existing map:
map.addControl(new L.Control.Fullscreen({
    fullscreenControl: true,
    position: "bottomleft",}
    ));
L.control.layerswap({ position: 'topright' }).addTo(map);

document.addEventListener('keydown', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
    const reg = /^\d+$/;
    // console.log(`Pressed ${key}`);

    if (key === "c") {
        lc.start();
        return;
    }
    if (key === "Escape") {
        if (document.getElementById("dateDialog").hasAttribute("open")) {
            document.getElementById("dateDialog").close();
        }
        map.closePopup();
        return;
    } else if (document.getElementById("dateDialog").hasAttribute("open")) {
        // event.preventDefault();
        if (key === "Enter") {
            document.getElementById("dateDialog").close();
        }
        return;
    } else if (document.activeElement.id != "map") { 
        if (key === "ArrowLeft") {
            handleOffset(-1);
        } else if (key === "ArrowRight") {
            handleOffset(1);
        } 
    }
    else if (key === "f") {
        map.toggleFullscreen();
    } else if (key === " " || key === "]") {
        event.preventDefault();
        handleOffset(24);
    } else if (key === "h") {
        handleTimingChange();
    } else if (key === "[") {
        handleOffset(-24);
    }
    if (key === "r") {
        handleRefresh();
    } else if (reg.test(key)) {
        handleOffset(parseInt(key));
    } 

    if (key === "d") {
        document.getElementById("dateDialog").show();
        document.getElementById("dateInputDate").focus();
    }

});

document.addEventListener('touchstart', function(event) {
    if (!document.getElementById("keys").hasAttribute("hidden")) {
        console.log("Touchscreen detected");
        document.getElementById("keys").setAttribute("hidden", true);
    }
}, false);

document.getElementById("dateInputDate").addEventListener('change', function(event) {
    date = new Date(document.getElementById("dateInputDate").value + "T" + document.getElementById("dateInputTime").value);
    handleRefresh(date);
});

document.getElementById("dateInputTime").addEventListener('change', function(event) {
    date = new Date(document.getElementById("dateInputDate").value + "T" + document.getElementById("dateInputTime").value);
    handleRefresh(date);
});

map.doubleClickZoom.disable();
map.on('dblclick', function(event){
    zoom = map.getZoom();

    map.flyTo([event.latlng.lat,event.latlng.lng], zoom, {animate: true, duration: 0.2});
    
    // map.setView(event.latlng, 11, { animation: true });     
    if (!mouseHoverMapButtons) {
        map.zoomIn();
    }
    // map.zoomIn();
});

mouseHoverMapButtons = false;