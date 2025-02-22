const navLinks = document.querySelectorAll('nav a');
const main = document.querySelector('main');

// Set the default active link and position to the second panel
document.querySelector('nav a[href="#network"]').classList.add('active');
main.style.transform = 'translateX(-33.33%)';  // Moves to the second panel

// Add click event listeners to all navigation links
navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1); 
        const targetIndex = Array.from(navLinks).indexOf(link); 
        main.style.transform = `translateX(-${targetIndex * (100 / 3)}%)`;

        // Update active link
        navLinks.forEach((nav) => nav.classList.remove('active'));
        link.classList.add('active');
    });
});


// Bio text link
fetch('txts/bio_cluett.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('bio-cluett').textContent = text;
    })
    .catch(error => console.error('Error loading the file:', error));
fetch('txts/bio_laura.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('bio-laura').textContent = text;
    })
    .catch(error => console.error('Error loading the file:', error));
fetch('txts/bio_wiggins.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('bio-wiggins').textContent = text;
    })
    .catch(error => console.error('Error loading the file:', error));
fetch('txts/bio_hansen.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('bio-hansen').textContent = text;
    })
    .catch(error => console.error('Error loading the file:', error));
fetch('txts/bio_misra.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('bio-misra').textContent = text;
    })
    .catch(error => console.error('Error loading the file:', error));



// Panel collapse
document.getElementById("panelToggleColumbia").addEventListener("click", function () {
    // Toggle the visibility of the content
    const panelContent = document.getElementById("panelContentColumbia");
    panelContent.classList.toggle("hidden");
});
document.getElementById("panelToggleAI").addEventListener("click", function () {
    // Toggle the visibility of the content
    const panelContent = document.getElementById("panelContentAI");
    panelContent.classList.toggle("hidden");
});
document.getElementById("panelToggleContact").addEventListener("click", function () {
    // Toggle the visibility of the content
    const panelContent = document.getElementById("panelContentContact");
    panelContent.classList.toggle("hidden");
});






// Card tab switching
const tabs = document.querySelectorAll('.tab'); // All tabs
const panelContents = document.querySelectorAll('.info-container'); // All info containers

// Set default active tab
document.getElementById('tabBio').classList.add('active');
document.getElementById('containerBio').classList.add('active');

// Add event listener to tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and info containers
        tabs.forEach(t => t.classList.remove('active'));
        panelContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding info container
        tab.classList.add('active');
        const targetId = `container${tab.id.replace('tab', '')}`;
        document.getElementById(targetId).classList.add('active');
    });
});





// Search function
let csvData = [];

// Load the CSV file
fetch('csvs/20250111-main.csv') // Replace with the actual path to your CSV file
    .then(response => response.text())
    .then(data => {
        csvData = Papa.parse(data, { header: true }).data;
    })
    .catch(error => console.error('Error loading CSV:', error));

// Perform search
function performSearch() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    
    // List the columns we want to search
    const searchColumns = ['Name', 'Title', 'School', 'Org', 'Project', 'Tool', 'Award'];

    const results = csvData.filter(row =>
        searchColumns.some(column =>
            row[column] && row[column].toLowerCase().includes(query)
        )
    );
    displayResults(results);
}

// Display search results
function displayResults(results) {
  const resultContainer = document.getElementById('searchResults');
  resultContainer.innerHTML = ''; // Clear previous results

  if (results.length === 0) {
      resultContainer.innerHTML = '<p>No results found.</p>';
      return;
  }

  results.forEach(row => {
      const resultDiv = document.createElement('div');
      
      // Extract relevant columns
      const name = row.Name || 'N/A';
      const title = row.Title || 'N/A';

      // Display extracted info
      resultDiv.innerHTML = `<b>${name}</b>, ${title}`;
      resultDiv.classList.add('search-result');
      resultDiv.dataset.nodeId = row.ID; // Use "ID" column from CSV

      // Hover effect on search result
      resultDiv.addEventListener("mouseover", function () {
          const node = d3.select(`[data-id='${row.ID}']`); // Select corresponding D3 node
          if (!node.empty()) {
              node.select("circle")
                  .transition()
                  .duration(200)
                  .attr("r", 80);
              node.select("text")
                  .transition()
                  .duration(200)
                  .style("font-size", "30px");
          }
      });

      resultDiv.addEventListener("mouseout", function () {
          const node = d3.select(`[data-id='${row.ID}']`);
          if (!node.empty() && node.node() !== activeNode) {
              node.select("circle")
                  .transition()
                  .duration(200)
                  .attr("r", 45);
              node.select("text")
                  .transition()
                  .duration(200)
                  .style("font-size", "18px");
          }
      });

      // Click event to center camera on node
      resultDiv.addEventListener("click", function () {
          const node = d3.select(`[data-id='${row.ID}']`).datum(); // Get node data from D3
          if (node) {
              centerOnNode(node);
          }
      });

      resultContainer.appendChild(resultDiv);
  });
}

// Function to center the canvas on a node
function centerOnNode(node) {
  const x = node.x;
  const y = node.y;

  svg.transition()
      .duration(500)
      .call(
          zoom.transform,
          d3.zoomIdentity.translate(width / 2 - x, height / 2 - y).scale(1.5)
      );
}









// Guide
const guide = document.getElementById('guide');
const guideContainer = document.getElementById('guide-container');

guide.addEventListener('mouseenter', () => {
    guideContainer.style.opacity = '1';
    guideContainer.style.visibility = 'visible';
});

guide.addEventListener('mouseleave', () => {
    guideContainer.style.opacity = '0';
    guideContainer.style.visibility = 'hidden';
});







// Nodes--------------------------------------------------------


// Load CSV data and render the graph
Promise.all([
  d3.csv("csvs/20250111-main.csv"),        // Node data
  d3.csv("csvs/20250111-connections.csv") // Link data
]).then(([nodesData, linksData]) => {
  // Map nodesData to the required format
  const nodes = nodesData.map(d => ({
    id: d.ID,
    name: d.Name,
    role: d.Role,
    title: d.Title,
    school: d.School,
    org: d.Org,
    aiorg: d.AiOrg,
    email: d.Email,
  }));

  // Map linksData to the required format
  const links = linksData.map(d => ({
    source: d.ID1,
    target: d.ID2,
    type: d.Type
  }));

  // Define the initial zoom level and scale
  let zoomLevel = 1; // Initial zoom level
  const zoomStep = 1; // How much to zoom in/out per click
  const minZoom = 0.3; // Minimum zoom level
  const maxZoom = 4;   // Maximum zoom level

  // Define the zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom]) // Set zoom limits
    .on("zoom", (event) => {
      g.attr("transform", event.transform); // Apply the zoom transformation to the canvas group
      zoomLevel = event.transform.k; // Sync zoomLevel with the current scale
    });

  // Apply the zoom behavior to the SVG
  const svg = d3.select("svg")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .call(zoom)
    .on("wheel.zoom", null); // Disable zoom via mouse wheel, but keep drag/pan

  // Zoom in button handler
  document.getElementById("zoomIn").addEventListener("click", () => {
    zoomLevel = Math.min(zoomLevel + zoomStep, maxZoom); // Increment zoom level
    svg.transition().duration(200) // Smooth transition
      .call(zoom.scaleTo, zoomLevel); // Programmatically update zoom level
  });

  // Zoom out button handler
  document.getElementById("zoomOut").addEventListener("click", () => {
    zoomLevel = Math.max(zoomLevel - zoomStep, minZoom); // Decrement zoom level
    svg.transition().duration(200) // Smooth transition
      .call(zoom.scaleTo, zoomLevel); // Programmatically update zoom level
  });


  const width = +svg.attr("width");
  const height = +svg.attr("height");


  // Function to resize and update the SVG and simulation
  function resizeSVG() {
    // Get new dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update the SVG dimensions
    svg.attr("width", width)
      .attr("height", height);

    // Update the force simulation center
    simulation.force("center", d3.forceCenter(width / 2, height / 2));

    // Restart the simulation (important for re-adjusting node positions)
    simulation.alpha(1).restart();
  }


  // Create a group to hold all elements
  const g = svg.append("g");

  // Create force simulation
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(175))
    .force("charge", d3.forceManyBody().strength(-1500))
    .force("center", d3.forceCenter(width / 2, height / 2));


// Draw links
const link = g.selectAll(".link")
  .data(links)
  .enter().append("line")
  .attr("class", "link")
  .style("stroke", "#01206a")
  .style("stroke-width", 2)
  .style("opacity", 0.5)
  .style("stroke-dasharray", d => {
    if (d.type === "Mentorship") {
      return "5,5"; // Dotted line for Mentorship
    } else if (d.type === "Collaboration") {
      return "18,6"; // Dotted line for Collaboration
    } else {
      return "none"; // Solid line for other types
    }
  });

// Draw nodes
const node = g.selectAll(".node-group")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", "node-group")
  .attr("data-id", d => d.ID)
  .call(drag(simulation));

// Append circle and text to each node
node.append("circle")
  .attr("class", "node")
  .attr("r", 45)
  .style("fill", d => {
    if (d.role === "Faculty") return "#c83662"; // Red for Faculty
    if (d.role === "Student") return "#059292"; // Teal for Student
    if (d.role === "Alumnus") return "#782483"; // Purple for Alumnus
  });

node.append("text")
  .attr("text-anchor", "middle")
  .style("fill", "#fff")
  .style("font-size", "18px")
  .style("cursor", "default")
  .style("font-family", "'Roboto Condensed', sans-serif")
  .style("font-weight", "bold")
  .html(d => {
    // Split the name by spaces into an array of name parts
    const nameParts = d.name.split(" ");

    // Map over the name parts and create a <tspan> for each part
    return nameParts.map((part, index) => {
      // For each name part, set dy for line spacing
      return `<tspan x="0" dy="${index === 0 ? 0 : 1.0}em">${part}</tspan>`;
    }).join("");  // Join all <tspan> elements into a single string
  });



  // Create a tooltip div and style it
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("color", "#01206a")
    .style("background-color", "#f6d887")
    .style("padding", "10px")
    .style("border-radius", "3px")
    .style("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
    .style("z-index", "10000");  // Ensure it's on top

  // Add hover interaction with tooltip events
  node.on("mouseover", function(event, d) {

    // Tooltip functionality - only show it when mouseover
    tooltip.style("visibility", "visible")
      .html(`
        <strong>${d.title}</strong><br>
        <em>Other info here</em>
      `);

    // Hover effect
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", 80);

    d3.select(this).select("text")
      .transition()
      .duration(200)
      .style("font-size", "30px");

  }).on("mousemove", function(event) {
    // Update tooltip position smoothly during mouse movement
    tooltip.style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY + 10) + "px");
  }).on("mouseout", function(event, d) {

    // Hide tooltip
    tooltip.style("visibility", "hidden");

    // Reset size for non-active nodes
    if (this !== activeNode) { // Only reset size for non-active nodes
      d3.select(this).select("circle")
        .transition()
        .duration(200)
        .attr("r", 45);

      d3.select(this).select("text")
        .transition()
        .duration(200)
        .style("font-size", "18px");
    };
    // Call the resize function on window resize
    window.addEventListener('resize', resizeSVG);
  });







  


  // Toggle Functionality
  const transitionTime = 300;
  const activeLinks = new Map(); // Store manually activated links
  
  function updateVisibility() {
      const showFaculty = d3.select("#toggle-faculty").property("checked");
      const showStudent = d3.select("#toggle-student").property("checked");
      const showAlumnus = d3.select("#toggle-alumnus").property("checked");
  
      const showAdmin = d3.select("#toggle-admin").property("checked");
      const showCollab = d3.select("#toggle-collab").property("checked");
      const showMentor = d3.select("#toggle-mentor").property("checked");
  
      node.transition().duration(transitionTime)
          .style("opacity", d => {
              if (d.role === "Faculty" && !showFaculty) return 0;
              if (d.role === "Student" && !showStudent) return 0;
              if (d.role === "Alumnus" && !showAlumnus) return 0;
              return 1;
          });
  
      link.each(function (d) {
          const linkElement = d3.select(this);
          const shouldShow = !(
              (!showFaculty && (d.source.role === "Faculty" || d.target.role === "Faculty")) ||
              (!showStudent && (d.source.role === "Student" || d.target.role === "Student")) ||
              (!showAlumnus && (d.source.role === "Alumnus" || d.target.role === "Alumnus")) ||
              (!showAdmin && d.type === "Administration") ||
              (!showCollab && d.type === "Collaboration") ||
              (!showMentor && d.type === "Mentorship")
          );
  
          if (shouldShow) {
              linkElement.style("display", "block")
                  .transition().duration(transitionTime)
                  .style("opacity", activeLinks.has(d) ? 1 : 0.5); // Preserve active links
          } else {
              linkElement.transition().duration(transitionTime)
                  .style("opacity", 0)
                  .on("end", function () {
                      linkElement.style("display", "none");
                  });
          }
      });
  }
  
  // **Click handler to activate links**
  node.on("click", function (event, d) {
      // Reset previous active links
      activeLinks.clear();
  
      // Highlight directly connected links and store them as active
      g.selectAll(".link")
          .filter(link => link.source === d || link.target === d)
          .each(function (link) {
              activeLinks.set(link, true);
          })
          .style("display", "block")
          .transition().duration(200)
          .style("stroke-width", 7)
          .style("opacity", 1);
  });
  
  // Attach Event Listeners
  d3.select("#toggle-faculty").on("change", updateVisibility);
  d3.select("#toggle-student").on("change", updateVisibility);
  d3.select("#toggle-alumnus").on("change", updateVisibility);
  d3.select("#toggle-admin").on("change", updateVisibility);
  d3.select("#toggle-collab").on("change", updateVisibility);
  d3.select("#toggle-mentor").on("change", updateVisibility);
  






  




  // Active state and display info
  let activeNode = null; // To track the currently active node
  let highlightedNodes = []; // Track connected nodes

  node.on("click", function (event, d) {
    // Reset the previously active node
    if (activeNode) {
      d3.select(activeNode).select("circle")
        .transition()
        .duration(200)
        .attr("r", 45) // Reset size
        .style("stroke", prevD => {
          if (prevD.role === "Faculty") return "#c83662"; // Red for Faculty
          if (prevD.role === "Student") return "#059292"; // Teal for Student
          if (prevD.role === "Alumnus") return "#782483"; // Purple for Alumnus
        })
        .style("stroke-width", 2);

      d3.select(activeNode).select("text")
        .transition()
        .duration(200)
        .style("font-size", "18px"); // Reset font size
    }

    // Reset previously highlighted nodes
    highlightedNodes.forEach(nodeData => {
      d3.select(nodeData).select("circle")
        .transition()
        .duration(200)
        .style("fill", prevD => {
          if (prevD.role === "Faculty") return "#c83662"; // Red for Faculty
          if (prevD.role === "Student") return "#059292"; // Teal for Student
          if (prevD.role === "Alumnus") return "#782483"; // Purple for Alumnus
        });
    });

    highlightedNodes = []; // Clear highlighted nodes list

    // Reset all links
    g.selectAll(".link")
      .transition()
      .duration(200)
      .style("stroke", "#01206a")
      .style("stroke-width", 2)
      .style("opacity", 0.5); // Reset link thickness

    // Reset all node sizes and colors
    g.selectAll(".node").select("circle")
      .transition()
      .duration(200)
      .attr("r", 45) // Reset size

    // Set the clicked node as active
    activeNode = this;

    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", 80) 
      .style("stroke", "#01206a")
      .style("stroke-width", 6);

    d3.select(this).select("text")
      .transition()
      .duration(200)
      .style("font-size", "30px");

    // Highlight directly connected nodes and make links thicker
    g.selectAll(".link")
      .filter(link => link.source === d || link.target === d)
      .transition()
      .duration(200)
      .style("stroke-width", 7)
      .style("opacity", 1);

    g.selectAll(".node")
      .filter(nodeData => links.some(link => 
        (link.source === d && link.target === nodeData) || 
        (link.target === d && link.source === nodeData)
      ))
      .each(function(nodeData) {
        highlightedNodes.push(this); // Store highlighted nodes

        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .style("fill", "#f4a261"); // Change color of connected nodes
      });

    // Update HTML div with node's info
    document.getElementById("node-name").innerText = d.name;
    document.getElementById("node-role").innerText = d.role;
    document.getElementById("node-title").innerText = d.title;
    document.getElementById("node-school").innerText = d.school;
    document.getElementById("node-org").innerText = d.org;
    document.getElementById("node-aiorg").innerText = d.aiorg;
    document.getElementById("node-email").innerText = d.email;







    // Count the number of connections for the clicked node
    const nodeConnections = links.filter(link => link.source.id === d.id || link.target.id === d.id).length;

    // Display the count in the HTML element
    document.getElementById("node-connections").innerText = `${nodeConnections} Connection${nodeConnections !== 1 ? 's' : ''}`;

      // Change the background color of the role div based on the role
    const roleDiv = document.getElementById("node-role");
    
    if (d.role === "Faculty") {
      roleDiv.style.backgroundColor = "#c83662"; // Red for Faculty
    } else if (d.role === "Student") {
      roleDiv.style.backgroundColor = "#059292"; // Green for Student
    } else if (d.role === "Alumnus") {
      roleDiv.style.backgroundColor = "#782483"; // Purple for Alumnus
    } else {
      roleDiv.style.backgroundColor = "#000000"; // Default fallback
    }

    g.selectAll(".link")
      .filter(link => link.source.id === d.id || link.target.id === d.id)
      .style("stroke", "#01206a")
      .style("stroke-width", 6);
  });

  // Apply forces
  simulation.on("tick", () => {
    link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // Drag behavior
  function drag(simulation) {
    return d3.drag()
      .on("start", function (event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function (event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", function (event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }
});
