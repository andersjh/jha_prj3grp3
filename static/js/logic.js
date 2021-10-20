// data sources
const paleoData = '/api/paleo';
const spiData = '/api/spi';
const fireData = "/api/texas_fires";
// const fbyData = '/api/acres_year'; // wrong api
const fbyData = '/api/years';
const causeList = 'api/causes'

let fby = [];
let yearList = [];

d3.json(fbyData).then(data => {
    console.log('fbyData', data)
    for (let z=0;z < data.length ;z++) {
        fby.push(data[z].TOTAL_COUNT / 200)
        yearList.push(data[z].FIRE_YEAR)
    }
    // must be within function
    console.log('fby & yearList', fby, yearList);
    
})


// get the list of years and causes for the dropdowns
let selYear = document.getElementById('selFireYear')
let selCause = document.getElementById('selFireCause')
// let yearList = [];
// let causeList = [];
d3.json(causeList).then(get => {
    console.log('get cause list', get);
    // for (let i=0;i<get.length;i++) {
    //     let year = parseInt(get[i].FIRE_YEAR);
    //     let cause = get[i].STAT_CAUSE_DESCR;
    //     if (yearList.indexOf(year) === -1) yearList.push(year);
    //     if (causeList.indexOf(cause) === -1) causeList.push(cause);
    // }
    let sortedYearList = yearList.sort();
    let sortedCauseList = get.sort();
    console.log('sorted year & cause', sortedYearList, sortedCauseList)

    for(let j = 0; j < sortedYearList.length; j++) {
        let opt = sortedYearList[j];
        let el = document.createElement('option');
        el.textContent = opt;
        el.value = opt;
        selYear.appendChild(el);
    }
    for(let k = 0; k < sortedCauseList.length; k++) {
        let opt = sortedCauseList[k];
        let el = document.createElement('option');
        el.textContent = opt;
        el.value = opt;
        selCause.appendChild(el);
    }
});


let selectM = d3.select('.mapContainer');

// function to update map based on dropdown selection
function optionChanged(sel) {
    let option = sel;
    console.log('optionChange arg', sel)
    // console.log(d3.select('#selFireYear').text());

    $('#map').remove();
    selectM.append('div').attr('id', 'map');

    let myMap = L.map('map', {
        center: [31.14, -100.27],
        zoom: 6,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = () => {
        let div = L.DomUtil.create("div", "info legend");
        let legendInfo = "<p>Class</p>" +
            "<div class=\"labels\">" +
            "</div>";
        div.innerHTML = legendInfo;
        let categories = ['A','B','C','D','E', 'F', 'G'];
        let colors = ['#a3f600','#dcf400','#f7db11','#fdb72a','#fca35d','#ff5f65', '#ff020c'];
        let labels = [];
        categories.forEach((a, index) => {
            labels.push("<li><div style=\"background-color: " + colors[index] + "\"></div>&nbsp;&nbsp;" + categories[index] + "</li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);

    selUrl = `${fireData}/${sel}`;
    console.log('selUrl', selUrl)
    d3.json(selUrl).then(data => {
        console.log('fire data',data);
        
    
        for (let i=0;i<data.length;i++) {
            let location = [data[i].LATITUDE, data[i].LONGITUDE];
            let year = data[i].FIRE_YEAR;
            let fireSize = data[i].FIRE_SIZE;
            let fireSizeClass = data[i].FIRE_SIZE_CLASS;
            let cause = data[i].STAT_CAUSE_DESCR;
            let color = '';
            if (fireSizeClass == 'A') {
              color = '#a3f600';
            } else if (fireSizeClass == 'B') {
                color = '#dcf400';
            } else if (fireSizeClass == 'C') {
                color = '#f7db11';
            } else if (fireSizeClass == 'D') {
                color = '#fdb72a';
            } else if (fireSizeClass == 'E') {
                color = '#fca35d';
            } else if (fireSizeClass == 'F') {
                color = '#ff5f65';
            } else {
              color = '#ff020c';
            }
            // we filtered with our url ( not needed)
            // if (year == sel) {
            //     L.circle(location, {
            //         fillOpacity: .5,
            //         color: color,
            //         fillColor: color,
            //         radius: fireSize / 640
            //     }).bindPopup(`<h3>${cause}</h3><hr><p>
            //     <b>Fire Size Class:</b> ${fireSizeClass}<br/><b>Fire Size:</b> ${fireSize} (Estimate of acres)<br/><b>Location:</b> ${location}</p>`).addTo(myMap);
            // }
            // if (cause == sel) {
                L.circle(location, {
                    fillOpacity: .5,
                    color: color,
                    fillColor: color,
                    radius: fireSize / 640
                }).bindPopup(`<h3>${cause}</h3><hr><p>
                <b>Fire Size Class:</b> ${fireSizeClass}<br/><b>Fire Size:</b> ${fireSize} (Estimate of acres)<br/><b>Location:</b> ${location}</p> ${year}`).addTo(myMap);
            // }
        }
    });

}
// optionChanged takes and arg so you have to pass one
optionChanged(1992);

// plot drought and moisture data from The Living Blended Drought Product (LBDP)
d3.json(paleoData).then(data => {
    console.log('paleo', data);
    let newData = [];
    let labels = [];
    let d0 = [];
    let d1 = [];
    let d2 = [];
    let d3 = [];
    let d4 = [];
    let w0 = [];
    let w1 = [];
    let w2 = [];
    let w3 = [];
    let w4 = [];
    for (let a=0;a<data.length;a++) {
        curData = data[a];
        newData.push(curData);
        labels.push(curData['DATE']);
        d0.push(curData['D0']);
        d1.push(curData['D1']);
        d2.push(curData['D2']);
        d3.push(curData['D3']);
        d4.push(curData['D4']);
        w0.push(-curData['W0']);
        w1.push(-curData['W1']);
        w2.push(-curData['W2']);
        w3.push(-curData['W3']);
        w4.push(-curData['W4']);
    }
    console.log('d0', d0);

    const mapData0 = {
        labels: labels,
        datasets: [
    {
          label: 'Abnormally Dry',
          backgroundColor: 'rgb(253, 255, 0)',
          data: d0,
    },
    {
        label: 'Moderate Drought',
        backgroundColor: 'rgb(255, 204, 153)',
        data: d1,
    },
    {
        label: 'Severe Drought',
        backgroundColor: 'rgb(255, 102, 0)',
        data: d2,
    },
    {
        label: 'Extreme Drought',
        backgroundColor: 'rgb(255, 0, 0)',
        data: d3,
    },
    {
        label: 'Exceptional Drought',
        backgroundColor: 'rgb(102, 0, 0)',
        data: d4,
    },
    {
          label: 'Abnormally Wet',
          backgroundColor: 'rgb(170, 255, 85)',
          data: w0,
    },
    {
        label: 'Moderate Wet',
        backgroundColor: 'rgb(1, 255, 255)',
        data: w1,
    },
    {
        label: 'Severe Wet',
        backgroundColor: 'rgb(0, 170, 255)',
        data: w2,
    },
    {
        label: 'Extreme Wet',
        backgroundColor: 'rgb(0, 0, 255)',
        data: w3,
    },
    {
        label: 'Exceptional Wet',
        backgroundColor: 'rgb(0, 0, 170)',
        data: w4,
    },
    {
        type: 'line',
        pointStyle: 'dash',
        label: 'Fires per Year',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        data: fby
    }
    ]
    };
    const config0 = {
        type: 'bar',
        data: mapData0,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Drought in Texas from 1992-2015'
            },
            legend: {
                position:'right'
            },
          },
          responsive: true,
        }
    };
    let myChart0 = new Chart(
          document.getElementById('myChart0'),
          config0
    );
});

// plot drought and moisture data from The Standardized Precipitation Index (SPI)
d3.json(spiData).then(data => {
    // console.log(data);
    let newData = [];
    let labels = [];
    let d0 = [];
    let d1 = [];
    let d2 = [];
    let d3 = [];
    let d4 = [];
    let w0 = [];
    let w1 = [];
    let w2 = [];
    let w3 = [];
    let w4 = [];
    for (let a=0;a<data.length;a++) {
        curData = data[a];
        newData.push(curData);
        labels.push(curData['DATE']);
        d0.push(curData['D0']);
        d1.push(curData['D1']);
        d2.push(curData['D2']);
        d3.push(curData['D3']);
        d4.push(curData['D4']);
        w0.push(-curData['W0']);
        w1.push(-curData['W1']);
        w2.push(-curData['W2']);
        w3.push(-curData['W3']);
        w4.push(-curData['W4']);
    }
    console.log('spiData d0', d0);

    const mapData = {
        labels: labels,
        datasets: [
    {
          label: 'Abnormally Dry',
          backgroundColor: 'rgb(253, 255, 0)',
          data: d0,
    },
    {
        label: 'Moderate Drought',
        backgroundColor: 'rgb(255, 204, 153)',
        data: d1,
    },
    {
        label: 'Severe Drought',
        backgroundColor: 'rgb(255, 102, 0)',
        data: d2,
    },
    {
        label: 'Extreme Drought',
        backgroundColor: 'rgb(255, 0, 0)',
        data: d3,
    },
    {
        label: 'Exceptional Drought',
        backgroundColor: 'rgb(102, 0, 0)',
        data: d4,
    },
    {
          label: 'Abnormally Wet',
          backgroundColor: 'rgb(170, 255, 85)',
          data: w0,
    },
    {
        label: 'Moderate Wet',
        backgroundColor: 'rgb(1, 255, 255)',
        data: w1,
    },
    {
        label: 'Severe Wet',
        backgroundColor: 'rgb(0, 170, 255)',
        data: w2,
    },
    {
        label: 'Extreme Wet',
        backgroundColor: 'rgb(0, 0, 255)',
        data: w3,
    },
    {
        label: 'Exceptional Wet',
        backgroundColor: 'rgb(0, 0, 170)',
        data: w4,
    },
    // {
    //     type: 'line',
    //     label: 'Fires per Year',
    //     backgroundColor: 'rgba(75, 192, 192, 0.5)',
    //     fill: true,
    //     borderColor: 'rgb(75, 192, 192)',
    //     tension: 0.1,
    //     data: fby
    // }
    ]
    };
    const config = {
        type: 'bar',
        data: mapData,
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Drought in Texas from 1992-2015'
            },
            legend: {
                position:'right'
            },
          },
          responsive: true,
        }
    };
    let myChart = new Chart(
          document.getElementById('myChart'),
          config
    );
});