const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

buildDD();

//adds the city names to the dropdown button
//driver function
function buildDD() {
  //grab the ul menu for the dropdown
  let eventDD = document.getElementById("eventDropDown");
  //clear out any li before adding
  eventDD.innerHTML = "";

  //get a copy of the template
  let ddItemTemplate = document.getElementById("cityDD-template");

  //import the node
  let ddItemNode = document.importNode(ddItemTemplate.content, true);
  //<li><a></a></li> is what is being grabbed
  let ddItem = ddItemNode.querySelector("a");
  //<a></a>
  ddItem.textContent = "All";
  ddItem.setAttribute("data-string", "All");
  //<a>All</a>//

  //<li><a>All</a></li>
  eventDD.appendChild(ddItemNode);

  let currentEvents = getEventData();

  //function to return an array of distinct cities
  let distinctCities = [...new Set(currentEvents.map((event) => event.city))];

  for (let index = 0; index < distinctCities.length; index++) {
    let cityName = distinctCities[index];
    ddItemNode = document.importNode(ddItemTemplate.content, true);
    ddItem = ddItemNode.querySelector("a");
    ddItem.textContent = cityName;
    ddItem.setAttribute("data-string", cityName);
    eventDD.appendChild(ddItemNode);
  }

  displayStats(currentEvents);
  displayData(currentEvents);
}

//display the stats for the selected city(or all)
function displayStats(currentEvents) {
  let total = 0;
  let average = 0;
  let most = 0;
  let least = currentEvents[0].attendance;

  //i want the currentevents array to add up all the attendance PER CITY and return the value
  //this should be done for each city AND all of the cities together.
  for (let index = 0; index < currentEvents.length; index++) {
    //240000
    let attendance = currentEvents[index].attendance;
    total += attendance;

    //determine the most attendance
    // if 0 < 240000, replace 0 with 240000
    if (most < attendance) {
      most = attendance;
    }

    //determine the least attendance
    //if attendance -1 > 150000 OR -1 < 0
    if (least > attendance) {
      least = attendance;
    }
    document.getElementById(
      "statsHeader"
    ).innerHTML = `Stats for ${currentEvents[index].city}`;
  }
  average = total / currentEvents.length;

  //throw all of our calculated values to the page, in the table

  document.getElementById("total").innerHTML = total.toLocaleString();
  document.getElementById("most").innerHTML = most.toLocaleString();
  document.getElementById("least").innerHTML = least.toLocaleString();
  document.getElementById("average").innerHTML = average.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
}

//remember "this" is being passed in. which is an <a></a>
function getEvents(element) {
  let city = element.getAttribute("data-string");

  let currentEvents = getEventData();

  // if the city = all, don't sort.
  //every other time, yes sort.

  if (city != "All") {
    currentEvents = currentEvents.filter(function (event) {
      if (event.city == city) {
        return event;
      }
    });
  }
  displayStats(currentEvents);
  displayData(currentEvents);
}

//need to filter out array by city name

function getEventData() {
  //this will return our event data
  let currentEvents = JSON.parse(localStorage.getItem("eventData"));

  if (currentEvents == null) {
    currentEvents = events;
    localStorage.setItem("eventData", JSON.stringify(currentEvents));
  }

  return currentEvents;
}

function displayData(currentEvents) {
  let eventTemplate = document.getElementById("eventData-template");
  let eventBody = document.getElementById("eventBody");
  eventBody.innerHTML = "";

  for (let index = 0; index < currentEvents.length; index++) {
    let eventNode = document.importNode(eventTemplate.content, true);

    let eventItems = eventNode.querySelectorAll("td");

    eventItems[0].textContent = currentEvents[index].event;
    eventItems[1].textContent = currentEvents[index].city;
    eventItems[2].textContent = currentEvents[index].state;
    eventItems[3].textContent =
      currentEvents[index].attendance.toLocaleString();
    eventItems[4].textContent = new Date(
      currentEvents[index].date
    ).toLocaleDateString();

    eventBody.appendChild(eventNode);
  }
}

//saves event data entered into the modal
function saveEventData() {
  let currentEvents = getEventData();

  let eventObj = {
    event: "",
    city: "",
    state: "",
    attendance: 0,
    date: "",
  };

  eventObj.event = document.getElementById("newEventName").value;
  eventObj.city = document.getElementById("newEventCity").value;

  let selectedState = document.getElementById("newEventState");
  eventObj.state = selectedState.options[selectedState.selectedIndex].text;

  let attendance = document.getElementById("newEventAttendance").value;
  attendance = parseInt(attendance);
  eventObj.attendance = attendance;

  let eventDate = document.getElementById("newEventDate").value;
  let formattedDate = `${eventDate} 00:00`;
  eventObj.date = new Date(formattedDate).toLocaleDateString();

  currentEvents.push(eventObj);

  localStorage.setItem("eventData", JSON.stringify(currentEvents));

  //reset our drop down, displaystats, displaydata.
  buildDD();
}
