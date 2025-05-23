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


// reCAPTCHA------------------------------------------------
function showFormLink() {
  var response = grecaptcha.getResponse();
  if (response.length === 0) {
      alert("Please complete the CAPTCHA.");
      return false;
  } else {
      document.getElementById("form-link").style.display = "block";
      return false; // Prevent form submission
  }
}



// Card collapsed on load on mobile devices------------------
// Function to toggle the collapsed class based on screen width
function toggleCollapsedClass() {
  const cardCollapsible = document.getElementById('card-collapsible');
  const cardToggle = document.getElementById('card-toggle');

  if (window.innerWidth < 900) {
      cardCollapsible.classList.add('collapsed');
      cardToggle.textContent = "expand"; // Change text to "expand"
  } else {
      cardCollapsible.classList.remove('collapsed');
      cardToggle.textContent = "collapse"; // You can change this text as needed
  }
}
// Call the function when the page loads
window.addEventListener('load', toggleCollapsedClass);
// Call the function when the window is resized
window.addEventListener('resize', toggleCollapsedClass);





// Bio card toggle-------------------------------------------
document.getElementById("card-toggle").addEventListener("click", function() {
  const cardContainer = document.getElementById("card-collapsible");
  const toggleButton = document.getElementById("card-toggle");

  if (cardContainer.classList.contains("collapsed")) {
      cardContainer.classList.remove("collapsed");
      toggleButton.textContent = "collapse";
  } else {
      cardContainer.classList.add("collapsed");
      toggleButton.textContent = "expand";
  }
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
  const panelContent = document.getElementById("panelContentColumbia");
  panelContent.classList.toggle("hidden");
  this.innerText = panelContent.classList.contains("hidden") ? "+" : "-";
});

document.getElementById("panelToggleAI").addEventListener("click", function () {
  const panelContent = document.getElementById("panelContentAI");
  panelContent.classList.toggle("hidden");
  this.innerText = panelContent.classList.contains("hidden") ? "+" : "-";
});

document.getElementById("panelToggleContact").addEventListener("click", function () {
  const panelContent = document.getElementById("panelContentContact");
  panelContent.classList.toggle("hidden");
  this.innerText = panelContent.classList.contains("hidden") ? "+" : "-";
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
fetch('csvs/20250429-main.csv') // Replace with the actual path to your CSV file
    .then(response => response.text())
    .then(data => {
        csvData = Papa.parse(data, { header: true }).data;
    })
    .catch(error => console.error('Error loading CSV:', error));

// Perform search
function performSearch() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    
    // List the columns we want to search
    const searchColumns = ['First Name', 'Last Name', 'Your Title', 'School', 'Organization', 'AI-Related Projects'];

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
  d3.csv("csvs/20250429-main.csv"),        // Node data
  d3.csv("csvs/20250429-connections.csv") // Link data
]).then(([nodesData, linksData]) => {
  // Map nodesData to the required format
  const nodes = nodesData.map(d => ({
    id: d.ID,
    name: `${d["First Name"]} ${d["Last Name"]}`,
    role: d["Your Role"],
    title: d["Your Title"],
    school: d.School,
    org: d["Organization/Company/Lab"],
    aiorg: d["AI Affiliations/Organizations"],
    website: d.Website,
    email: d["Email Address"],
    office: d["Office Address"],
    event: d.Event,
    linkedin: d.LinkedIn,
    bluesky: d.Bluesky,
    orcid: d.ORCID,
    researchgate: d["Research Gate"],
    googlescholar: d["Google Scholar"],
    github: d.GitHub,
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

  const linkedNodeIds = new Set(links.flatMap(l => [l.source, l.target]));
  const isIsolated = d => !linkedNodeIds.has(d.id);

  

  // Create force simulation
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(175))
    .force("charge", d3.forceManyBody().strength(-350))
    .force("center", d3.forceCenter(width / 2, height / 2));

    simulation.force("radial", d3.forceRadial(250, width / 2, height / 2)
    .strength(d => isIsolated(d) ? 0.9 : 0)); // tweak strength as needed
// Draw links
const link = g.selectAll(".link")
  .data(links)
  .enter().append("line")
  .attr("class", "link")
  .style("stroke", "#01206a")
  .style("stroke-width", 2)
  .style("opacity", 0.2)
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
    const nameParts = d.name.split(" ");
    const totalParts = nameParts.length;

    return nameParts.map((part, index) => {
      // Adjust the first tspan's dy based on how many parts there are
      let dy = "1em"; // default line spacing
      if (index === 0) {
        dy = totalParts === 3 ? "-0.6em" :
             totalParts === 2 ? "-0.05em" : "0";
      }
      return `<tspan x="0" dy="${dy}">${part}</tspan>`;
    }).join("");
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
    .style("z-index", "999999"); 

  // Add hover interaction with tooltip events
  node.on("mouseover", function(event, d) {
    // Tooltip functionality - only show it when mouseover
    tooltip.style("visibility", "visible")
      .html(`
        <strong>${d.title}</strong><br>
        <em>${d.school}</em>
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
                  .style("opacity", activeLinks.has(d) ? 1 : 0.2); // Preserve active links
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
      .style("opacity", 0.2); // Reset link opacity

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

    let nodeEvents = []; // Store event names of the selected node
    let connectedNodeNames = []; // Store names of connected nodes

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
        highlightedNodes.push(this); // Store highlighted nodes
        connectedNodeNames.push(nodeData.name); // Store connected node names

        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .style("fill", "#f4a261"); // Change color of connected nodes
      });

    // Update HTML div with node's info
    document.getElementById("node-name").innerText = d.name;
    document.getElementById("node-role").innerText = d.role;
    document.getElementById("node-title").innerHTML = d.title.replace(/;/g, ";<br>");
    document.getElementById("node-school").innerText = d.school;
    document.getElementById("node-org").innerText = d.org;
    document.getElementById("node-aiorg").innerText = d.aiorg;
    // document.getElementById("node-phone").innerText = d.phone;
    // document.getElementById("node-office").innerText = d.office;

    // Dynamically create and insert website link
    const websiteLink = document.createElement('a');
    websiteLink.href = d.website;
    websiteLink.target = '_blank';
    websiteLink.innerText = d.website;
    document.getElementById("node-website").innerHTML = ''; // Clear existing content
    document.getElementById("node-website").appendChild(websiteLink);


    // Dynamically create and insert LinkedIn link
    if (d.linkedin) {
      const linkedinLink = document.createElement('a');
      linkedinLink.href = d.linkedin;
      linkedinLink.target = '_blank';
      const linkedinIcon = document.createElement('img');
      linkedinIcon.classList.add('node-icon');
      linkedinIcon.src = 'svgs/icon_linkedin.svg';
      linkedinIcon.alt = 'LinkedIn';
      linkedinLink.appendChild(linkedinIcon);
      const linkedinText = document.createElement('span');
      linkedinText.innerText = 'LinkedIn';
      linkedinLink.appendChild(linkedinText);
      document.getElementById("node-linkedin").innerHTML = ''; // Clear existing content
      document.getElementById("node-linkedin").appendChild(linkedinLink);
    } else {
      document.getElementById("node-linkedin").innerHTML = ''; // Clear LinkedIn if no value
    }

    // Dynamically create and insert Bluesky link
    if (d.bluesky) {
      const blueskyLink = document.createElement('a');
      blueskyLink.href = d.bluesky;
      blueskyLink.target = '_blank';
      const blueskyIcon = document.createElement('img');
      blueskyIcon.classList.add('node-icon');
      blueskyIcon.src = 'svgs/icon_bluesky.svg';
      blueskyIcon.alt = 'Bluesky';
      blueskyLink.appendChild(blueskyIcon);
      const blueskyText = document.createElement('span');
      blueskyText.innerText = 'Bluesky';
      blueskyLink.appendChild(blueskyText);
      document.getElementById("node-bluesky").innerHTML = ''; // Clear existing content
      document.getElementById("node-bluesky").appendChild(blueskyLink);
    } else {
      document.getElementById("node-bluesky").innerHTML = ''; // Clear Bluesky if no value
    }


    if (d.orcid) {
      const orcidLink = document.createElement('a');
      orcidLink.href = `https://orcid.org/${d.orcid}`;
      orcidLink.target = '_blank';
    
      const orcidIcon = document.createElement('img');
      orcidIcon.classList.add('node-icon');
      orcidIcon.src = 'svgs/icon_orcid.svg';
      orcidIcon.alt = 'ORCID';
      orcidLink.appendChild(orcidIcon);
    
      const orcidText = document.createElement('span');
      orcidText.innerText = 'ORCID';
      orcidLink.appendChild(orcidText);
    
      const orcidContainer = document.getElementById("node-orcid");
      orcidContainer.innerHTML = ''; // Clear existing content
      orcidContainer.appendChild(orcidLink);
    } else {
      document.getElementById("node-orcid").innerHTML = '';
    }
    

    if (d.researchgate) {
      const researchgateLink = document.createElement('a');
      researchgateLink.href = d.researchgate;
      researchgateLink.target = '_blank';
      const researchgateIcon = document.createElement('img');
      researchgateIcon.classList.add('node-icon');
      researchgateIcon.src = 'svgs/icon_researchgate.svg';
      researchgateIcon.alt = 'ResearchGate';
      researchgateLink.appendChild(researchgateIcon);
      const researchgateText = document.createElement('span');
      researchgateText.innerText = 'ResearchGate';
      researchgateLink.appendChild(researchgateText);
      document.getElementById("node-researchgate").innerHTML = ''; // Clear existing content
      document.getElementById("node-researchgate").appendChild(researchgateLink);
    } else {
      document.getElementById("node-researchgate").innerHTML = '';
    }

    if (d.googlescholar) {
      const googlescholarLink = document.createElement('a');
      googlescholarLink.href = d.googlescholar;
      googlescholarLink.target = '_blank';
      const googlescholarIcon = document.createElement('img');
      googlescholarIcon.classList.add('node-icon');
      googlescholarIcon.src = 'svgs/icon_googlescholar.svg';
      googlescholarIcon.alt = 'Google Scholar';
      googlescholarLink.appendChild(googlescholarIcon);
      const googlescholarText = document.createElement('span');
      googlescholarText.innerText = 'Google Scholar';
      googlescholarLink.appendChild(googlescholarText);
      document.getElementById("node-googlescholar").innerHTML = ''; // Clear existing content
      document.getElementById("node-googlescholar").appendChild(googlescholarLink);
    } else {
      document.getElementById("node-googlescholar").innerHTML = '';
    }

    if (d.github) {
      const githubLink = document.createElement('a');
      githubLink.href = d.github;
      githubLink.target = '_blank';
      const githubIcon = document.createElement('img');
      githubIcon.classList.add('node-icon');
      githubIcon.src = 'svgs/icon_github.svg';
      githubIcon.alt = 'GitHub';
      githubLink.appendChild(githubIcon);
      const githubText = document.createElement('span');
      githubText.innerText = 'GitHub';
      githubLink.appendChild(githubText);
      document.getElementById("node-github").innerHTML = ''; // Clear existing content
      document.getElementById("node-github").appendChild(githubLink);
    } else {
      document.getElementById("node-github").innerHTML = '';
    }

    // Update event content with fallback if empty
    document.getElementById("panelContentEvents").innerHTML = 
      [d.event, ...nodeEvents].filter(event => event).join("<br>") || 
      '<a href="https://ai.columbia.edu/events" target="_blank"><u>Explore more AI events!</u></a>';

    // Update connections content with fallback if empty
    document.getElementById("panelContentConnections").innerHTML = 
      connectedNodeNames.length > 0 ? connectedNodeNames.join("<br>") : "No direct connections";






    // Count the number of connections for the clicked node
    const nodeConnections = links.filter(link => link.source.id === d.id || link.target.id === d.id).length;

    // Display the count in the HTML element
    document.getElementById("node-connections").innerText = `${nodeConnections} Connection${nodeConnections !== 1 ? 's' : ''}`;

    // Activate badges based on node connections
    updateBadges(nodeConnections);

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

    // Function to activate badges based on nodeConnections
  function updateBadges(numLinks) {
    // Reset all badges to inactive
    document.querySelectorAll('.badge').forEach(badge => badge.classList.remove('active'));

    // Activate badges based on the number of links
    if (numLinks >= 1) {
      document.getElementById('badge-connections-01').classList.add('active');
    }
    if (numLinks >= 5) {
      document.getElementById('badge-connections-02').classList.add('active');
    }
    if (numLinks >= 10) {
      document.getElementById('badge-connections-03').classList.add('active');
    }
    if (numLinks >= 20) {
      document.getElementById('badge-connections-04').classList.add('active');
    }
    if (numLinks >= 35) {
      document.getElementById('badge-connections-05').classList.add('active');
    }}

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




// Badge info------------------------------------------
// Select all badges and attach event listeners for tooltip
const badges = document.querySelectorAll('.badge');

badges.forEach(badge => {
    const tooltipText = badge.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = tooltipText;

    // Append the tooltip to the body
    document.body.appendChild(tooltip);

    badge.addEventListener('mouseenter', () => {
        // Show tooltip and position it
        tooltip.classList.add('tooltip-visible');
        const badgeRect = badge.getBoundingClientRect();
        tooltip.style.left = `${badgeRect.left + window.scrollX}px`;
        tooltip.style.top = `${badgeRect.top + window.scrollY - tooltip.offsetHeight}px`;
    });

    badge.addEventListener('mouseleave', () => {
        // Hide tooltip
        tooltip.classList.remove('tooltip-visible');
    });
});


