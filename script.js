const plugin = {
  id: "corsair",
  defaults: {
    width: 1,
    color: "#DEDEDE",
    dash: [1000, 1000],
  },
  afterInit: (chart, args, opts) => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (chart, args) => {
    const { inChartArea } = args;
    const { type, x, y } = args.event;

    chart.corsair = { x, y, draw: inChartArea };
    chart.draw();
  },
  beforeDatasetsDraw: (chart, args, opts) => {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;
    const { x, y, draw } = chart.corsair;
    if (!draw) return;

    ctx.save();

    ctx.beginPath();
    ctx.lineWidth = opts.width;
    ctx.strokeStyle = opts.color;
    ctx.setLineDash(opts.dash);
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    // ctx.moveTo(left, y)
    // ctx.lineTo(right, y)
    ctx.stroke();

    ctx.restore();
  },
};

// script.js
document.addEventListener("DOMContentLoaded", () => {
  let ghgBlue = "#092A65";
  let chart = null;
  const baseFileName = "surface-pfp_1_ccgg_event";

  const chartContainer = document.getElementById("chart");

  const mapC = document.getElementById("map");
  const mapContainer = document.getElementById("map-container");
  const chartContainerB = document.getElementById("chart-container");

  // Replace 'MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA";

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const stationCode = queryParams.get("station_code");
  const ghg = queryParams.get("ghg");
  const selectedGhg = ghg || "ch4";

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [-98.5795, 39.8283], // Centered on the US
    zoom: 3,
  });
  // Sample station data (replace with your data)
  const stations = [
    {
      site_code: "LAC",
      site_name: "LA Megacities",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/",
      site_latitude: "34.0",
      site_longitude: "-118.2",
      site_elevation: "100.0",
      csvFiles: ["ch4_lac_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "SPF",
      site_name: "Antarctic Firn Air",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "-73.8658",
      site_longitude: "163.687",
      site_elevation: "1623.0",
      csvFiles: ["ch4_spf_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "NWR",
      site_name: "Niwot Ridge, Colorado",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "40.0531",
      site_longitude: "-105.5864",
      site_elevation: "3523.0",
      csvFiles: ["ch4_nwr_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "WBI",
      site_name: "West Branch, Iowa",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "41.7248",
      site_longitude: "-91.3529",
      site_elevation: "241.7",
      csvFiles: ["ch4_wbi_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MKO",
      site_name: "Mauna Kea, Hawaii",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "19.8228",
      site_longitude: "-155.4693",
      site_elevation: "4199.0",
      csvFiles: ["ch4_mko_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MWO",
      site_name: "Mt. Wilson Observatory",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "34.2246",
      site_longitude: "-118.0586",
      site_elevation: "1729.33",
      csvFiles: ["ch4_mwo_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "WGC",
      site_name: "Walnut Grove, California",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "38.2645",
      site_longitude: "-121.4904",
      site_elevation: "2.0",
      csvFiles: ["ch4_wgc_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "SCT",
      site_name: "Beech Island, South Carolina",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "33.4057",
      site_longitude: "-81.8334",
      site_elevation: "115.2",
      csvFiles: ["ch4_sct_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MLO",
      site_name: "Mauna Loa, Hawaii",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "19.5362",
      site_longitude: "-155.5763",
      site_elevation: "3397.0",
      csvFiles: ["ch4_mlo_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "INX",
      site_name: "INFLUX (Indianapolis Flux Experiment)",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/",
      site_latitude: "39.5805",
      site_longitude: "-86.4207",
      site_elevation: "-1e+34",
      csvFiles: ["ch4_inx_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "SGP",
      site_name: "Southern Great Plains, Oklahoma",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "36.607",
      site_longitude: "-97.489",
      site_elevation: "314.0",
      csvFiles: ["ch4_sgp_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "BAO",
      site_name: "Boulder Atmospheric Observatory, Colorado",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "40.05",
      site_longitude: "-105.004",
      site_elevation: "1578.7",
      csvFiles: ["ch4_bao_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "NWF",
      site_name: "Niwot Ridge Forest, Colorado",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "40.03",
      site_longitude: "-105.55",
      site_elevation: "3050.0",
      csvFiles: ["ch4_nwf_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MBO",
      site_name: "Mt. Bachelor Observatory",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "43.9775",
      site_longitude: "-121.6861",
      site_elevation: "2731.0",
      csvFiles: ["ch4_mbo_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MSH",
      site_name: "Mashpee, Massachusetts",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "41.6567",
      site_longitude: "-70.4975",
      site_elevation: "32.0",
      csvFiles: ["ch4_msh_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "CRV",
      site_name: "Carbon in Arctic Reservoirs Vulnerability Experiment (CARVE)",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "64.9863",
      site_longitude: "-147.598",
      site_elevation: "611.43",
      csvFiles: ["ch4_crv_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MRC",
      site_name: "Marcellus Pennsylvania",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "41.4662",
      site_longitude: "-76.4188",
      site_elevation: "592.0",
      csvFiles: ["ch4_mrc_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "WKT",
      site_name: "Moody, Texas",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "31.3149",
      site_longitude: "-97.3269",
      site_elevation: "251.0",
      csvFiles: ["ch4_wkt_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "LEF",
      site_name: "Park Falls, Wisconsin",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "45.9451",
      site_longitude: "-90.2732",
      site_elevation: "472.0",
      csvFiles: ["ch4_lef_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "STR",
      site_name: "Sutro Tower, San Francisco, California",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "37.7553",
      site_longitude: "-122.4528",
      site_elevation: "254.0",
      csvFiles: ["ch4_str_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "BWD",
      site_name: "Brentwood, Maryland",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "38.9343",
      site_longitude: "-76.9556",
      site_elevation: "16.8",
      csvFiles: ["ch4_bwd_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "LEW",
      site_name: "Lewisburg, Pennsylvania",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "40.9446",
      site_longitude: "-76.8789",
      site_elevation: "166.0",
      csvFiles: ["ch4_lew_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "HFM",
      site_name: "Harvard Forest, Massachusetts",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "42.5378",
      site_longitude: "-72.1714",
      site_elevation: "340.0",
      csvFiles: ["ch4_hfm_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "NEB",
      site_name: "NE Baltimore, Maryland",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "39.3154",
      site_longitude: "-76.583",
      site_elevation: "44.0",
      csvFiles: ["ch4_neb_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "MVY",
      site_name: "Marthas Vineyard, Massachusetts",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "41.325",
      site_longitude: "-70.5667",
      site_elevation: "0.0",
      csvFiles: ["ch4_mvy_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "NWB",
      site_name: "NW Baltimore",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "39.3445",
      site_longitude: "-76.6851",
      site_elevation: "135.0",
      csvFiles: ["ch4_nwb_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "TMD",
      site_name: "Thurmont, Maryland",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "39.5768",
      site_longitude: "-77.4881",
      site_elevation: "561.0",
      csvFiles: ["ch4_tmd_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "KLM",
      site_name: "Kohler Mesa, Boulder, Colorado",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "39.99",
      site_longitude: "-105.27",
      site_elevation: "1725.0",
      csvFiles: ["ch4_klm_surface-pfp_1_ccgg_event.txt"],
    },
    {
      site_code: "AMT",
      site_name: "Argyle, Maine",
      site_country: "United States",
      site_country_flag:
        "https://gml.noaa.gov/webdata/ccgg/ObsPack/images/flags/UNST0001.GIF",
      site_latitude: "45.0345",
      site_longitude: "-68.6821",
      site_elevation: "52.4",
      csvFiles: ["ch4_amt_surface-pfp_1_ccgg_event.txt"],
    },
  ];

  if (stationCode) {
    // Find the station based on the query parameter
    const selectedStation = stations.find(
      (station) => station.site_code === stationCode
    );
    // If a station with the specified code is found, zoom in and display the chart
    if (selectedStation) {
      const { site_latitude: lat, site_longitude: lon } = selectedStation;
      map.setView([lat, lon], 10); // Adjust the zoom level as needed
      renderStation(selectedStation);
    }
  }

  // Function to toggle map height and show/hide chart
  function openChart() {
    // Show chart and make map half-height
    mapContainer.style.height = "50%";
    chartContainerB.style.height = "50%";
    setTimeout(function () {
      map.resize();
    }, 400);
  }

  const resizeObserver = new ResizeObserver(() => {
    map.resize();
  });

  resizeObserver.observe(mapContainer);

  function renderStation(station) {
    openChart();
    const selectedCSVFile = `${selectedGhg}/${selectedGhg}_${station.site_code.toLowerCase()}_${baseFileName}.txt`;
    // Fetch CSV data and render chart
    fetch(selectedCSVFile)
      .then((response) => response.text())
      .then(async (data) => {
        // Parse CSV data (you may need to adjust this based on your CSV format)
        const parsedData = await parseCSVData(data);
        // Render chart
        renderChart(chartContainer, station.site_name, parsedData);
      })
      .catch((error) => console.error(error));
  }

  // Loop through stations and add markers
  stations.forEach((station) => {
    const markerEl = document.createElement("div");
    markerEl.className = "marker";
    const marker = new mapboxgl.Marker(markerEl)
      .setLngLat([station.site_longitude, station.site_latitude])
      .addTo(map);

    // Create a tooltip or popup content for the marker
    const tooltipContent = `
        <strong>${station.site_code} : ${station.site_name}</strong><br>
        Lat: ${station.site_latitude}<br>
        Lon: ${station.site_longitude}<br>
        Elev: ${station.site_elevation} masl
        `;

    const popup = new mapboxgl.Popup().setHTML(tooltipContent);

    marker.setPopup(popup);

    marker.getElement().addEventListener("mouseenter", () => {
      popup.addTo(map);
    });

    marker.getElement().addEventListener("mouseleave", () => {
      popup.remove();
    });

    marker.getElement().addEventListener("click", () => {
      renderStation(station);
    });

    // Add an event listener to the dropdown to update the chart when the selection changes
    // dropdown.addEventListener('change', () => {
    //     const selectedCSVFile = dropdown.value;
    //     fetch(selectedCSVFile)
    //         .then(response => response.text())
    //         .then(data => {
    //             // Parse CSV data (you may need to adjust this based on your CSV format)
    //             const parsedData = parseCSVData(data);

    //             // Render the chart inside the popup content
    //             renderChart(`chart-${station.name}`, station.name, parsedData);
    //         })
    //         .catch(error => console.error(error));
    // });
  });

  // Function to parse CSV data (customize based on your CSV format)
  async function parseCSVData(data) {
    // Parse your CSV data here and return it as an array of objects
    data = data.split("\n");
    let header_lines = data[0]
      .split(":")
      .slice(-1)[0]
      .trim()
      .replace("\n#\n#", "");
    header_lines = parseInt(header_lines);
    data = data.slice(header_lines - 1);
    const lines = data
      .slice(1)
      .map((line) => line.replace("\n", "").split(" "));
    const filtered = lines
      .filter((line) => line[21] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");
    let return_value = filtered.map((line) => {
      return {
        date: line[7],
        value: line[10],
      };
    });
    return return_value;
    // return [{ date: "2023-01-01", value: 10 }, { date: "2023-01-02", value: 20 }, { date: "2023-01-03", value: 15 }]
  }

  // Function to create a dropdown menu with CSV file options
  function createDropdown(csvFiles) {
    const dropdown = document.createElement("select");
    csvFiles.forEach((csvFile) => {
      const option = document.createElement("option");
      option.value = csvFile;
      option.textContent = csvFile;
      dropdown.appendChild(option);
    });
    return dropdown;
  }

  // Function to render the time series chart
  function renderChart(chartContainer, stationName, data) {
    // const chartContainer = document.getElementById(containerId);

    const zoomInstructions = document.getElementById("zoom-instructions");
    if (zoomInstructions) {
      zoomInstructions.style.display = "block"; // Show instructions when not zoomed
    }

    if (!!chart) {
      chart.destroy();
    }

    // Define a red color for the hovered point
    const redColor = "rgb(255, 0, 0)";

    // Limit the number of x-axis labels to a maximum of 10
    const maxLabelsToShow = 10;
    const stepSize = Math.ceil(data.length / maxLabelsToShow);

    // Create a Chart.js chart here using 'data'
    // Example:
    chart = new Chart(chartContainer, {
      type: "line",
      data: {
        // labels: data.map((item, index) => (index % stepSize === 0) ? item.date : ''), // Show label every stepSize data points
        labels: data.map((item) => item.date), // Show label every stepSize data points
        datasets: [
          {
            label: `${selectedGhg == "ch4" ? "Methane" : "Carbondioxide"} Surface PFP, nmol/mol`,
            data: data.map((item) => item.value),
            borderColor: "#440154",
            borderWidth: 2,
            fill: false,
            pointRadius: 0, // Remove the points
            hoverBorderWidth: 3,
            pointHoverBackgroundColor: "#440154", // Set hover background color to red
            pointHoverBorderColor: "#FFFFFF", // Set hover border color to red
            // tension: 0.4
          },
        ],
      },
      options: {
        // onHover: (event, chartElement) => {
        //     // Handle hover event here
        //     const activePoints = chart.getElementsAtEventForMode(event, 'index', chart.options);
        //     if (activePoints.length > 0) {
        //         const index = activePoints[0].index;
        //         const value = data[index].value;
        //         console.log(`Hovered Value: ${value}`);
        //         // You can display the value wherever you like, e.g., in a tooltip
        //     }
        // },
        hover: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawOnChartArea: false,
            },
            // border: {
            //   display: false
            // },
            ticks: {
              autoSkip: true, // Enable automatic skip
              maxTicksLimit: 10, // Maximum number of ticks to display
            },
          },
        },
        plugins: {
          corsair: {
            // color: 'black',
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              drag: {
                enabled: true,
              },
              mode: "x",
              onZoom: (zoom) => {
                // Handle zoom event here
                // isChartZoomed = zoom.scales.x > 1; // Check if x-scale zoomed
                updateZoomInstructions(); // Call a function to update instructions
              },
            },
          },
          title: {
            display: true,
            text: `${stationName}`, // Add your chart title here
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: true,
            position: "bottom", // You can change the position to 'bottom', 'left', or 'right'
          },
        },
      },
      plugins: [plugin],
    });

    // Function to update zoom instructions
    function updateZoomInstructions() {
      const zoomInstructions = document.getElementById("zoom-instructions");
      if (zoomInstructions) {
        zoomInstructions.style.display = "none"; // Show instructions when not zoomed
      }
    }
  }
});
