const A = {
  logo: asset("001-MAKI-logo-inverse-strap_500pxSQ.png"),
  homeHero: asset("002-9eed36_26a2379589984313a9661febe7f206f0-mv2_d_2272_1704_s_2.jpg"),
  servicesHero: asset("003-9eed36_f467e09faacf40c3ba50dd1e88024e3d-mv2.jpg"),
  solutionsHero: asset("004-9eed36_37870ee51cab4eed9ee932530be5c81c-mv2.jpg"),
  productsHero: asset("005-9eed36_bd24eae781b24ae7a991a747fca618ff-mv2.jpg"),
  blogHero: asset("006-9eed36_7e3b5af7da9a4395aeab81c5d8fc17eb-mv2.jpg"),
  software: asset("007-a6a664_b867b7e8d250481283ddb8c3e135bd19f000.jpg"),
  hardware: asset("008-a6a664_9663e34ac0bc4560bc2d485562f83f78f000.jpg"),
  bathy: asset("009-a6a664_40315ed43de3453099edcabfbd178585-mv2.png"),
  iconSmart: asset("010-MAKI_icons_smart500x500.png"),
  iconGps: asset("011-MAKI_icons_gps500x500.png"),
  iconEasy: asset("012-MAKI_icons_easy500x500.png"),
  environmental: asset("013-Boat-2.png"),
  bathymetry: asset("014-Bathy.png"),
  topography: asset("015-Topo.png"),
  topobathy: asset("016-Topobathy.png"),
  asset: asset("017-274665825_10166045523610397_5592847351339957270_n.jpg"),
  usv: asset("018-9eed36_d2f107fff03f4806b443158385bda388-mv2.jpg"),
  rov: asset("019-a6a664_94c6b408047342fca4ccd2647486fd8e-mv2.png"),
  iot: asset("020-a6a664_35afe8f80799498f8b5bc13895a96d27-mv2.webp"),
  kayak: asset("021-9eed36_d4811b70593a474fa2683cab753e0fde-mv2.jpg"),
  ai: asset("022-a6a664_9d035b2a6dcb4a6e889622ae7a2930b0-mv2-original.jpeg"),
  waves: asset("023-Aerial-View-of-Waves.jpg")
};

function asset(file){return pathPrefix() + "/assets/media/" + file}

const services = [
  ["environmental", "Environmental Monitoring & Water Sampling", "Data you can trust for better decisions", A.environmental, "We collect real-time spatial water quality data and targeted samples using autonomous systems fitted with sensors and sampling equipment for lakes, rivers, ponds and coastal environments."],
  ["bathymetry", "Bathymetry", "Accurate underwater depth mapping", A.bathymetry, "USV-based sonar surveying creates reliable depth models for lakes, ponds, reservoirs, treatment plants, harbours and waterways while reducing safety risks and field effort."],
  ["topography", "Topography", "High-resolution land and shoreline mapping", A.topography, "Drone and survey workflows capture landform, shoreline, vegetation and terrain information for planning, monitoring and environmental management."],
  ["topobathy", "Bathymetry & Topography", "Integrated land and water surveys", A.topobathy, "Combined topo-bathymetric mapping gives clients a single joined picture across water and land, simplifying coastal, lake, wetland and infrastructure projects."],
  ["asset", "Asset Management (Inspection)", "Smarter infrastructure monitoring", A.asset, "ROVs, USVs, drones and imaging systems inspect hard-to-reach assets including submerged structures, bridges, dams, pipes and monitoring equipment."]
];

const solutions = [
  ["usvs", "Customised USV Boats", "Autonomous surveys and sampling", A.environmental, "Our customised unmanned surface vessels perform surveys and monitoring in lakes, rivers and coastal areas. Each platform can integrate sonar, water quality sensors, telemetry, RTK GNSS and sampling equipment."],
  ["rovs", "Customised ROVs", "Safe and efficient underwater inspection", A.rov, "ROVs can be equipped with high-definition cameras, sonar, manipulators and specialised sensors for underwater inspection, monitoring and asset management."],
  ["auvs", "Customised AUVs", "Autonomous underwater exploration", A.bathy, "For larger-scale and deeper-water projects, customised autonomous underwater vehicles can map seabeds, monitor marine ecosystems and inspect submerged infrastructure."],
  ["drones", "Customised Drones", "Mapping and client-specific integrations", A.topography, "Drone solutions provide aerial data capture, photogrammetry and environmental monitoring using RGB, multispectral or thermal imaging payloads."],
  ["iot", "IoT Solutions", "Connected monitoring systems", A.iot, "IoT monitoring solutions collect, transmit and analyse environmental data in real time, supporting remote insight without constant manual intervention."],
  ["ai", "Software & AI Camera", "Autonomous detection and monitoring", A.ai, "MĀKI develops software and AI camera systems that automate environmental and ecological monitoring, including remote detection and cloud-based reporting."],
  ["satellite", "Satellite Imagery", "Wide-area monitoring and analysis", A.blogHero, "Satellite imagery and analysis help monitor change over time, detect environmental risks and support regional planning when paired with on-the-ground surveys."]
];

const products = [
  ["recreational", "Recreational Products", "Smart, sustainable solutions for everyday adventures on the water.", A.kayak, "Inflatable kayaks, motors and battery systems designed to make time on the water easier, safer and more enjoyable."],
  ["technical", "Technical Products", "Tools to support your work on the water.", A.rov, "Uncrewed surface and underwater vehicles, sensors and monitoring solutions that make fieldwork easier, safer and more effective."]
];

const videos = [
  ["ussr6TPOOxU", "Autonomous Bathymetry & Sediment Volume Analysis | MAKI USV Survey Systems"],
  ["9WVC_UHBu2U", "MAKI MK-III USV Platform - Integrated RTK, 4G & Multibeam Survey System"],
  ["hRby6IODy0k", "Autonomous Boat Mapping Water Quality | Chlorophyll-a, Phycocyanin, Turbidity & Water Sampling"],
  ["MJqyc7YjCjc", "MAKI - Autonomous remote water monitoring and sampling"],
  ["_jXocdaFBa0", "2019 - 2023 Deforestation detection in Kawhia, Ngutunui and Pouakani"],
  ["GH2vQ21odaQ", "MAKI's Topography and Bathymetry Services"],
  ["12vvZ3Ndte8", "MAKI - Photogrammetry service demo"],
  ["VHSSBvO95oQ", "MĀKI WATER TESTING & SAMPLING USV PROTOTYPE (MAKI - MKII)"],
  ["hJysEh7TXTQ", "MAKI drop-stitch e-kayak with remote steering"]
];

const posts = [
  {
    slug: "building-smart-monitoring-for-remote-environments-maki-s-iot-ai-camera-solution",
    title: "Building Smart Monitoring for Remote Environments: MAKI's IoT AI Camera Solution",
    image: asset("024-a6a664_984e0ed462174363ad7f8404e7e218ba-mv2.png"),
    category: "Environmental Services",
    date: "Apr 7",
    readTime: "3 min read",
    excerpt: "A custom IoT AI camera solution for remote monitoring where power, connectivity, access and environmental conditions make standard systems unsuitable.",
    content: [
      { tag: "p", text: "Monitoring specific objects or species such as pests in the field is becoming increasingly important for environmental management, biosecurity, and infrastructure protection." },
      { tag: "p", text: "However, many of these monitoring needs exist in remote and challenging environments, where traditional solutions simply do not perform well." },
      { tag: "h3", text: "The Challenge of Remote Monitoring" },
      { tag: "p", text: "In theory, deploying a camera with AI detection sounds straightforward. In reality, the challenge is far more complex when systems need to operate in the field." },
      { tag: "p", text: "Remote environments often come with:" },
      { tag: "ul", items: ["Limited or no reliable power supply", "Weak, intermittent, or non-existent internet connectivity", "Harsh weather and environmental conditions", "Difficult access for maintenance and servicing"] },
      { tag: "p", text: "Most off-the-shelf camera systems are designed for urban or well-connected environments. They rely heavily on cloud processing, constant connectivity, and stable power - making them unsuitable for remote deployment." },
      { tag: "h3", text: "Where Standard Solutions Fall Short" },
      { tag: "p", text: "Traditional AI camera systems typically:" },
      { tag: "ul", items: ["Stream large volumes of data to the cloud for processing", "Require consistent internet connectivity", "Consume relatively high power", "Lack flexibility for integration with other sensors or systems"] },
      { tag: "p", text: "In remote scenarios, these limitations quickly become critical issues. High data transmission is not practical, and reliance on cloud processing introduces delays and failure points." },
      { tag: "h3", text: "MAKI's Approach: Intelligence at the Edge" },
      { tag: "p", text: "To address these challenges, MAKI has developed a custom IoT AI camera system designed specifically for remote environments." },
      { tag: "p", text: "While the camera may appear simple externally, the internal design is purpose-built to operate efficiently under constraints." },
      { tag: "p", text: "Key features include:" },
      { tag: "ul", items: ["Edge AI processing - detection and classification are performed directly on the device, reducing reliance on cloud services", "Low-power system design - optimised for operation with limited energy sources such as batteries or solar", "Efficient data communication - only relevant data is transmitted, minimising bandwidth usage", "Robust hardware integration - designed to operate reliably in harsh field conditions"] },
      { tag: "p", text: "This approach ensures the system can continue to function even with limited connectivity, while maintaining high detection capability." },
      { tag: "image", src: A.ai, alt: "IoT AI camera solution", width: "147px", height: "66px" },
      { tag: "h3", text: "A Practical Solution for Real-World Applications" },
      { tag: "p", text: "The IoT AI camera can be trained to detect specific targets, such as:" },
      { tag: "ul", items: ["Pest species", "Wildlife activity", "Objects of interest in environmental or infrastructure settings"] },
      { tag: "p", text: "By processing data locally and only transmitting key information, the system enables:" },
      { tag: "ul", items: ["Faster decision-making", "Reduced operational costs", "Improved reliability in remote deployments"] },
      { tag: "h3", text: "Beyond Cameras: A Broader Monitoring Ecosystem" },
      { tag: "p", text: "This project is part of a wider capability at MAKI to design and build custom environmental monitoring systems." },
      { tag: "p", text: "In addition to AI cameras, MAKI develops:" },
      { tag: "ul", items: ["Autonomous water monitoring and sampling buoys", "Remote sensing stations for environmental data collection", "Custom USVs (Unmanned Surface Vehicles) and ROVs (Remotely Operated Vehicles)", "Integrated IoT platforms combining sensors, communication, and data processing"] },
      { tag: "p", text: "Each system is tailored to the specific requirements of the project, rather than relying on off-the-shelf configurations." },
      { tag: "h3", text: "Designed for the Environment, Not Just the Specification" },
      { tag: "p", text: "At MAKI, the focus is on delivering solutions that work in real-world conditions." },
      { tag: "p", text: "Remote environments impose constraints that cannot be ignored. Power, connectivity, and durability are not secondary considerations - they define the system design from the outset." },
      { tag: "p", text: "By combining in-house hardware development with software and AI capability, MAKI delivers systems that are:" },
      { tag: "ul", items: ["Practical", "Reliable", "Scalable", "Fit for purpose"] },
      { tag: "h3", text: "Get in Touch" },
      { tag: "p", text: "If you are working on a monitoring challenge in a remote or constrained environment, MAKI can help design a solution that meets your specific requirements." },
      { tag: "p", text: "Feel free to get in touch to discuss your project." }
    ]
  },
  {
    slug: "final-testing-completed-integrated-marine-iot-monitoring-system",
    title: "Final Testing Completed: Integrated Marine IoT Monitoring System",
    image: asset("025-a6a664_35afe8f80799498f8b5bc13895a96d27-mv2.png"),
    category: "Environmental Services",
    date: "Jan 10",
    readTime: "2 min read",
    excerpt: "Final testing is complete for an in-house marine IoT platform integrating water-quality sensors, underwater camera footage and onboard lighting.",
    content: [
      { tag: "p", text: "Updated: Jan 11" },
      { tag: "p", text: "Today marks the completion of final testing for one of our latest in-house IoT developments - a fully integrated marine monitoring system designed for real-world environmental deployment." },
      { tag: "p", text: "This device brings together multiple water-quality sensors, an underwater camera, and onboard lighting into a single, robust platform suitable for long-term use in marine and freshwater environments." },
      { tag: "h3", text: "What the System Measures" },
      { tag: "p", text: "The system is capable of simultaneously capturing both quantitative sensor data and visual context, providing a much more complete understanding of underwater conditions." },
      { tag: "p", text: "The current configuration includes:" },
      { tag: "ul", items: ["Chlorophyll-a measurement", "Phycocyanin measurement (Cyanobacteria)", "Turbidity", "Dissolved Oxygen (DO)", "Water temperature", "Underwater camera footage, supported by integrated LED lighting"] },
      { tag: "p", text: "This combination allows users to correlate sensor readings directly with visual observations - for example, algal blooms, sediment disturbance, or biofouling." },
      { tag: "h3", text: "Designed for Marine Environments" },
      { tag: "p", text: "The system has been purpose-built for harsh marine conditions. This includes:" },
      { tag: "ul", items: ["Waterproof and pressure-resistant housing", "Corrosion-resistant materials", "Stable mounting and cable management", "Low-power electronics suitable for extended deployments"] },
      { tag: "p", text: "Final testing focused on system reliability, sensor performance, data integrity, and camera operation under realistic conditions." },
      { tag: "h3", text: "End-to-End Development Capability" },
      { tag: "p", text: "As shown in the setup, this project was delivered entirely in-house." },
      { tag: "p", text: "MAKI handled:" },
      { tag: "ul", items: ["Mechanical and enclosure design", "Electronics design and integration", "Sensor interfacing and power management", "Firmware and software development", "Data handling and system validation"] },
      { tag: "p", text: "Having full control over hardware, electronics, and software allows rapid iteration, tighter integration, and solutions that are tailored to the specific needs of each project - rather than relying on off-the-shelf compromises." },
      { tag: "h3", text: "Built for Customisation and Deployment" },
      { tag: "p", text: "This platform is modular by design. Sensors, cameras, communications, and power systems can be adapted depending on deployment requirements, whether for:" },
      { tag: "ul", items: ["Environmental monitoring", "Scientific research", "Compliance and consent monitoring", "Infrastructure inspection", "Long-term autonomous deployments"] },
      { tag: "h3", text: "Moving Forward" },
      { tag: "p", text: "With final testing completed, this system is now ready for field deployment and project-specific customisation. It represents another step forward in MAKI's focus on delivering practical, reliable, and locally engineered monitoring solutions for New Zealand's water environments." }
    ]
  },
  {
    slug: "maki-at-freshwater-conference-2025-connections-innovation-and-new-possibilities",
    title: "MAKI at Freshwater Conference 2025 - Connections, Innovation, and New Possibilities",
    image: asset("026-a6a664_151a6b9ef05d48969b0bd3d9bdc40aee-mv2.jpg"),
    category: "Environmental Services",
    date: "Dec 4, 2025",
    readTime: "2 min read",
    excerpt: "MĀKI exhibited at Freshwater Conference 2025, sharing autonomous boat, ROV, mapping and monitoring capabilities with councils, researchers and environmental scientists.",
    content: [
      { tag: "p", text: "MAKI has just wrapped up an exciting few days exhibiting at the Freshwater Conference 2025, and the experience has been both energising and valuable. The event brought together scientists, councils, innovators, and solution-builders working towards better environmental outcomes across Aotearoa - a space we feel proud to be contributing to." },
      { tag: "h3", text: "Showcasing MAKI's Technology" },
      { tag: "p", text: "As an exhibitor, we had the opportunity to share our autonomous boat and ROV capabilities with a wide range of delegates. Many were particularly interested in our:" },
      { tag: "ul", items: ["Water-quality sampling system", "Multi-beam and sonar mapping workflows", "Underwater inspection tools", "AI-assisted data processing"] },
      { tag: "p", text: "The feedback was positive, and it was great to discuss practical applications across lakes, stormwater ponds, reservoirs, canals, and coastal environments." },
      { tag: "h3", text: "Conversations With Councils & Scientists" },
      { tag: "p", text: "A key part of the conference for us was engaging with people who are actively working on New Zealand's freshwater challenges. We had meaningful discussions with several regional councils, researchers, and environmental scientists about:" },
      { tag: "ul", items: ["Monitoring and mapping needs", "Data quality and sampling repeatability", "Opportunities for more efficient and safer field operations", "Future collaboration to trial new approaches"] },
      { tag: "p", text: "These conversations are invaluable as we continue to develop and scale MAKI's capabilities for use throughout Aotearoa's waterways." },
      { tag: "h3", text: "A Highlight - Meeting Sequench Ltd" },
      { tag: "p", text: "Among the many great connections made, one in particular stood out. We had the pleasure of meeting Anastasija, the co-founder of Sequench Ltd, a Nelson-based company operating in a similar space with strong alignment in purpose and innovation." },
      { tag: "p", text: "We connected immediately through our shared passion for technology in freshwater environments, and we are already planning a visit to Nelson to learn more about what they do. There is also an exciting possibility that we may travel to Norway together next year - a conversation that left us both inspired for what's possible." },
      { tag: "p", text: "We are grateful for everyone who took the time to speak with us, share knowledge, and explore collaboration ideas. The conference has reinforced that Aotearoa is full of talented people working toward a healthier freshwater future - and MAKI is proud to be a part of that." },
      { tag: "p", text: "Next steps: keep the conversations going, continue building partnerships, and keep pushing innovation forward." }
    ]
  },
  {
    slug: "topo-bathymetric-mapping-at-aotea-harbour",
    title: "Topo-Bathymetric Mapping at Aotea Harbour",
    image: asset("027-a6a664_6f6ae67d840e4dd4a4868313a39876f7-mv2.webp"),
    category: "Environmental Services",
    date: "Aug 20, 2025",
    readTime: "1 min read",
    excerpt: "MĀKI completed a topo-bathymetry survey at Aotea Harbour for Ōtorohanga District Council using RTK bathymetry and drone photogrammetry.",
    content: [
      { tag: "p", text: "Updated: Nov 5, 2025" },
      { tag: "p", text: "Earlier this year, MĀKI completed a topo-bathymetry survey at Aotea Harbour for the Ōtorohanga District Council. The objective was to assess the condition of the harbour's stone wall structure and capture detailed information on the channel's shape and depth profile." },
      { tag: "p", text: "To achieve this, our team used a combination of surface and aerial mapping technologies. The MĀKI autonomous vessel conducted a high-resolution bathymetric survey using RTK-enabled positioning for centimetre-level accuracy. At the same time, a DJI drone was deployed to capture photogrammetry imagery of the surrounding terrain and wall structures." },
      { tag: "p", text: "The resulting bathymetric and topographic point clouds were integrated into a unified dataset, providing a complete 3D representation of both the underwater channel and the above-water features. This combined model allowed engineers to visualise the full system, assess erosion patterns, and identify areas of concern with precision." },
      { tag: "p", text: "By merging RTK bathymetry and drone photogrammetry, MĀKI delivered a comprehensive, high-accuracy dataset that supports informed decision-making and long-term asset management for the council's coastal infrastructure." },
      { tag: "p", text: "At MĀKI, we specialise in integrating autonomous marine and aerial systems to produce seamless, data-driven insights for engineers and environmental professionals across New Zealand." }
    ]
  },
  {
    slug: "autonomous-water-monitoring-and-sampling-during-algae-bloom-events",
    title: "Autonomous Water Monitoring and Sampling During Algae Bloom Events",
    image: asset("028-a6a664_c6e8747ce27f44a1b1876266520cac30-mv2.png"),
    category: "Environmental Services",
    date: "Jul 20, 2025",
    readTime: "2 min read",
    excerpt: "MĀKI collaborated with Waikato Regional Council to deploy MĀKI Boat V2 for autonomous water-quality monitoring and sampling during algae bloom events.",
    content: [
      { tag: "p", text: "During the summer of 2024-2025, MĀKI collaborated with the Waikato Regional Council to deploy our MĀKI Boat V2 for environmental monitoring and water sampling across several freshwater locations. This initiative supported the council's efforts to collect reliable data during algae bloom events, when accurate and timely information is essential for effective water quality management." },
      { tag: "p", text: "The MĀKI Boat V2 is a compact, fully autonomous surface vessel designed for scientific-grade data acquisition and automated water sampling. Measuring approximately 1.5 m x 1 m and weighing 15-20 kg, it can be transported and launched by a single operator. Its wide, stable hull allows for precise profiling and sensor deployment, even under moderate field conditions." },
      { tag: "p", text: "Equipped with a Trilux 2000 sensor (chlorophyll-a, phycocyanin, turbidity), a dissolved oxygen probe with pH and temperature sensing, and a single-beam sonar (with optional multi-beam upgrade), the system provides a comprehensive view of aquatic environments. The integrated 15 m winch collects discrete-depth water samples of up to 3 litres, enabling high-fidelity analysis for nutrient and biological studies." },
      { tag: "p", text: "All readings are georeferenced, with GPS position-holding and RTK-enabled precision providing centimetre-level accuracy for repeat surveys. The system's IP67-rated design and rapid decontamination process ensure safe deployment across multiple sites while maintaining biosecurity compliance." },
      { tag: "p", text: "The MĀKI Boat V2 operates up to 2.5 km from the controller or indefinitely via cellular connectivity, with real-time data streaming and flexible data-output formats for seamless integration with analytical platforms." },
      { tag: "p", text: "Following the success of last summer's collaboration, MĀKI expects to extend its monitoring operations to additional lakes across the Waikato and beyond during the 2025-2026 season. With increasing attention on cyanobacteria (blue-green algae) and its impacts on freshwater ecosystems, this autonomous vessel is proving to be an effective platform for scientific study, research, and long-term environmental monitoring." },
      { tag: "p", text: "At MĀKI, we remain committed to advancing autonomous technologies that help researchers and regional authorities better understand, protect, and manage New Zealand's freshwater environments." }
    ]
  }
];

function currentPage(){const pages=['services','solutions','products','about','enquire','blog','post'];const parts=location.pathname.split('/').filter(Boolean).map(p=>decodeURIComponent(p).replace('.html',''));return pages.find(p=>parts.includes(p))||''}
function pathPrefix(){return currentPage()==='post'?'../..':(currentPage()?'..':'.')}
function localPath(path){const p=pathPrefix();return path==='/'?p+'/index.html':p+path+'/index.html'}
function nav(){const page=currentPage();const item=(h,l)=>`<a class="nav-link ${page===h.split('/')[1]?'active':''}" href="${localPath(h)}">${l}</a>`;const drop=(h,l,rows)=>`<div class="nav-item">${item(h,l)}<div class="dropdown">${rows.map(r=>`<a href="${localPath(h)}?tab=${r[0]}">${r[1]}</a>`).join('')}</div></div>`;return `<header class="site-header"><nav class="nav"><a class="brand" href="${localPath('/')}"><img src="${A.logo}" alt="MAKI-logo"><span class="tagline">Together, we'll make waves</span></a><button class="menu-toggle" type="button" aria-label="Open navigation">☰</button><div class="nav-links">${drop('/services','Services',services.map(s=>[s[0],s[1]]))}${drop('/solutions','Solutions',solutions.map(s=>[s[0],s[1]]))}${drop('/products','Products',products.map(p=>[p[0],p[1]]))}${item('/about','About MĀKI')}${item('/blog','News')}${item('/enquire','Enquiry')}</div></nav></header>`}
function hero(t,b,img,e='Versatile in application. Fluid in approach. Unwavering in spirit.',a=''){return `<section class="hero" style="background-image:url('${img}')"><div class="inner"><div class="eyebrow">${e}</div><h1>${t}</h1><p>${b}</p>${a}</div></section>`}
function sectionTitle(t,l=''){return `<div class="center"><h2 class="section-title">${t}</h2>${l?`<p class="lead">${l}</p>`:''}</div>`}
function detailSection(t,l,rows){const sel=new URLSearchParams(location.search).get('tab');return `<section class="band"><div class="container">${sectionTitle(t,l)}<div class="tabbar">${rows.map(r=>`<a href="?tab=${r[0]}" class="${sel===r[0]?'active':''}">${r[1].replace('Customised ','')}</a>`).join('')}</div><div class="detail-list">${rows.map(r=>`<article class="detail" id="${r[0]}"><img src="${r[3]}" alt="${r[1]}"><div><h3>${r[1]}</h3><p><strong>${r[2]}</strong></p><p>${r[4]}</p></div></article>`).join('')}</div></div></section>`}
function quickSubscribe(){return `<form class="form js-form"><h3>Quick Subscribe:</h3><label>Email<input type="email" required placeholder="Email"></label><button class="button" type="submit">Submit</button><div class="status" aria-live="polite"></div></form>`}
function contactBlock(t="We'd love to hear from you"){return `<section id="contact"><div class="container contact-panel"><div>${sectionTitle('- GET IN TOUCH -',t)}<p>Email <a href="mailto:info@maki.nz">info@maki.nz</a> or call <a href="tel:+642041941275">+64 20 4194 1275</a>.</p><p>Send us an <a href="${localPath('/enquire')}">Enquiry</a> instead.</p><div class="actions"><a class="button" href="${localPath('/enquire')}">Send Enquiry</a><a class="button secondary" href="https://www.facebook.com/FB.MAKI.NZ">Find us on Facebook</a></div></div>${quickSubscribe()}</div></section>`}
function feature(img,t,b,bul){return `<article class="feature"><img class="feature-icon" src="${img}" alt=""><h3>${t}</h3><p>${b}</p><ul>${bul.map(x=>`<li>${x}</li>`).join('')}</ul></article>`}
function cards(t,rows){return `<section><div class="container">${sectionTitle(t)}<div class="card-grid">${rows.map(r=>`<article class="card"><img src="${r[1]}" alt="${r[0]}"><div class="card-body"><h3>${r[0]}</h3><a class="button" href="${localPath('/services')}">Read More</a></div></article>`).join('')}</div></div></section>`}
function clients(){const logos=[asset('029-9eed36_758e8cbfd8b64f24a24e1b1d165e3024-mv2.png'),asset('030-9eed36_687da80316a245d7988a12f5619ca8ca-mv2.png'),asset('031-9eed36_c027a5046b514314b1db9e5d81f29416-mv2.png'),asset('032-9eed36_68c1b2ef54f842ccaaa42972a159de45-mv2.png'),asset('019-a6a664_94c6b408047342fca4ccd2647486fd8e-mv2.png')];return `<section class="band"><div class="container">${sectionTitle('- OUR CLIENTS -')}<div class="logo-strip">${logos.map((l,i)=>`<img src="${l}" alt="Client logo ${i+1}">`).join('')}</div></div></section>`}
function getVideos(){try{const v=JSON.parse(localStorage.getItem('makiVideos')||'null');return Array.isArray(v)&&v.length?v:videos}catch{return videos}}
function videoThumb(id){const thumbs={
  "ussr6TPOOxU": asset("039-hqdefault.jpg"),
  "9WVC_UHBu2U": asset("040-hqdefault.jpg"),
  "hRby6IODy0k": asset("041-hqdefault.jpg"),
  "MJqyc7YjCjc": asset("042-hqdefault.jpg"),
  "_jXocdaFBa0": asset("043-hqdefault.jpg"),
  "GH2vQ21odaQ": asset("044-hqdefault.jpg"),
  "12vvZ3Ndte8": asset("045-hqdefault.jpg"),
  "VHSSBvO95oQ": asset("046-hqdefault.jpg"),
  "hJysEh7TXTQ": asset("047-hqdefault.jpg")
};return thumbs[id]||`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
function videoSection(){return `<section class="dark"><div class="container">${sectionTitle('- SEE OUR VIDEOS -','All Videos')}<div class="video-grid">${getVideos().map(v=>`<a class="video-card" href="https://www.youtube.com/watch?v=${v[0]}"><div class="video-thumb"><img src="${videoThumb(v[0])}" alt="${v[1]}"><span class="play">▶</span></div><h3>${v[1]}</h3></a>`).join('')}</div></div></section>`}
function home(){return hero('GOT A CHALLENGE IN LAND, AIR OR WATER?','Discover MĀKI. Together, we challenge the limits of unmanned vehicles with inventive solutions for industrial and environmental challenges.',A.homeHero,'Get ready to make waves.',`<div class="actions"><a class="button" href="${localPath('/services')}">Explore Services</a><a class="button secondary" href="${localPath('/enquire')}">Enquire</a></div>`)+`<section><div class="container">${sectionTitle('- WHAT WE DO -','At MĀKI, we redefine accessible measuring and monitoring with customised systems that blend hardware, software and emerging technologies.')}<div class="actions center"><a class="button" href="https://www.maki.nz/_files/ugd/a6a664_6674fd93ca5a4a928835c2ec4b007c06.pdf">Download our Company Profile</a><a class="button" href="${localPath('/blog')}">See our projects</a></div></div></section><section class="band"><div class="container feature-grid">${feature(A.software,'CUSTOMISED SOFTWARE','In-house software development for emerging technology solutions.',['AI and machine learning','IoT connectivity','Data analytics','Autonomous control systems'])}${feature(A.hardware,'UNIQUE HARDWARE','Mechanical, electrical, aeronautical and communications engineering.',['Robust structures','Efficient power systems','Secure long-range communication'])}${feature(A.bathy,'SERVICE & MAINTENANCE','Operational support beyond delivery.',['Trained operators','Ongoing maintenance','Mission planning and data support'])}</div></section>`+cards('- APPLICATIONS -',[['ENVIRONMENTAL SERVICES',A.environmental],['LAKE MAPPING',A.bathymetry],['Topography with Bathymetry',A.topobathy],['WATER SAMPLING & MONITORING',A.bathy],['INTERNET OF THINGS (IoT)',A.iot],['PHOTOGRAMMETRY & MAPPING',A.topography]])+clients()+videoSection()+contactBlock('To find out what we can do for you')}
function servicesPage(){return hero('- Services -','At MĀKI, we provide advanced surveying and monitoring services that are accurate, reliable, and tailored to real-world needs. We specialise in cost-effective, agile, and adaptive solutions.',A.servicesHero)+`<section><div class="container center"><div class="actions"><a class="button" href="${localPath('/blog')}">See our projects</a><a class="button" href="${localPath('/solutions')}">See our vehicles</a></div></div></section>`+detailSection('- Our services -','',services)+contactBlock()}
function solutionsPage(){return hero('- Solutions -','MĀKI creates end-to-end solutions for water monitoring, surveying and asset management, from one-off prototypes to integrated technology deployments.',A.solutionsHero)+detailSection('- Our customised solutions -','',solutions)+contactBlock()}
function productsPage(){return hero('- Products -','MĀKI designs and supplies recreational and technical products that combine practicality, durability and innovation.',A.productsHero)+detailSection('- Our products -','',products)+contactBlock()}
function aboutPage(){const team=[['Jeffrey To','Founder & Managing Director','B.Eng(Hons), PhD (Engineering), PGDip(Bus), PRINCE2. Jeff has leadership experience across mining, manufacturing, aeronautical and IT software.',asset('033-254162655_601953684381806_43247231588873.jpg')],['Rod Agno','Senior Aeronautical Engineer','BSAE. Rod brings advanced aeronautical engineering knowledge, CAA regulations, electronics, radio communications and CAD.',asset('034-Rod_edited.jpg')],['Jase Cook','USV Pilot/Operator','Jase brings mechanical, electrical and electronic experience and supports client missions on site.',asset('035-313363583_879974989838252_478181683793312833_n_edited.jpg')],['Tamehana Hohepa','Technical Operation Support','Tamehana is an automation enthusiast and plays a major role in MĀKI research, development and continuous improvement.',asset('036-314457456_644868070554777_8031568088638580470_n_edited.jpg')],['Ryan Ranby','UAV Pilot/Operator','Ryan supports aerial imaging, photogrammetry, plant health mapping, terrain models, orthophoto mapping and 3D mapping.',asset('037-Ryan_edited.png')],['Jacky Lam','Agile Coach, Project Manager & Delivery Specialist','Jacky brings technical acumen, strategic insight, Agile delivery and risk mitigation experience.',asset('038-WhatsApp-Image-2023-10-28-at-23_edited_p.png')]];return hero('- About Us -','At MĀKI, we are Kiwis passionate about applying new technologies to solve real-world challenges and make technology more accessible.',A.homeHero,'About MĀKI')+`<section><div class="container split"><div><h2 class="section-title">- Our Story -</h2><p>MĀKI was originally founded by Jeffrey from his passion for fishing, starting as a GPS controlled vessel for recreational use.</p><p>Over the years, Jeff recognised the potential for MĀKI to go beyond recreation and support environmental monitoring, industry and education.</p></div><img src="${A.bathy}" alt="MĀKI team"></div></section><section class="band"><div class="container">${sectionTitle('- Meet The Team -')}<div class="team-grid">${team.map(t=>`<article class="team-member"><img src="${t[3]}" alt="${t[0]}"><div><h3>${t[0]}</h3><p><strong>${t[1]}</strong></p><p>${t[2]}</p></div></article>`).join('')}</div></div></section>`+contactBlock()}
function enquirePage(){return hero('ENQUIRE & MEET THE MAKI TEAM','Tell us about your challenge and we will come back to you with a practical next step.',A.productsHero,"Let's Get Started")+`<section><div class="container contact-panel"><img src="${A.waves}" alt="Aerial view of waves"><form class="form js-form"><h2>Let's Get Started</h2><div class="form-row"><label>First name<input name="first-name" required></label><label>Last name<input name="last-name" required></label></div><label>Company<input name="company" placeholder="Company"></label><label>Email<input type="email" name="email" required placeholder="Email"></label><label>Message<textarea required></textarea></label><label><span><input type="checkbox" required> I agree to be contacted by MĀKI.</span></label><button class="button" type="submit">Send Enquiry</button><div class="status" aria-live="polite"></div></form></div></section>`}
function blogPage(){return hero('Articles','News, project updates and field notes from MĀKI environmental services and technology work.',A.blogHero,'MAKI News')+`<section><div class="container"><div class="card-grid">${posts.map(p=>`<article class="post"><img src="${p.image}" alt="${p.title}"><div class="post-body"><p class="section-kicker">${p.category}</p><h2>${p.title}</h2><p>${p.excerpt}</p><a class="button" href="${localPath('/post/'+p.slug)}">Read more</a></div></article>`).join('')}</div></div></section>`}
function renderArticleBlock(block){if(block.tag==='h3')return `<h3>${block.text}</h3>`;if(block.tag==='ul')return `<ul>${block.items.map(item=>`<li>${item}</li>`).join('')}</ul>`;if(block.tag==='image'){const style=`${block.width?`width:${block.width};`:''}${block.height?`height:${block.height};`:''}`;return `<figure class="article-inline-image"><img src="${block.src}" alt="${block.alt||''}"${style?` style="${style}"`:''}></figure>`}return `<p>${block.text}</p>`}
function currentPost(){const parts=location.pathname.split('/').filter(Boolean).map(p=>decodeURIComponent(p).replace('.html',''));const idx=parts.indexOf('post');return idx>=0?posts.find(p=>p.slug===parts[idx+1]):null}
function postPage(){const post=currentPost()||posts[0];return `<main class="blog-post-page"><section class="article-shell"><a class="article-back" href="${localPath('/blog')}">All Posts</a><p class="article-category">${post.category}</p><h1>${post.title}</h1><div class="article-meta"><span>${post.date}</span><span>${post.readTime}</span></div><img class="article-image" src="${post.image}" alt="${post.title}"><div class="article-body">${post.content.map(renderArticleBlock).join('')}</div><div class="article-actions"><a class="button" href="${localPath('/blog')}">Back to Articles</a><a class="button" href="${localPath('/enquire')}">Enquire</a></div></section></main>`}
function footer(){return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div><h3>MĀKI</h3><p>Together, we'll make waves.</p><p>Autonomous boats, ROVs, drones, IoT, AI and environmental monitoring solutions.</p></div><div><h3>Explore</h3><a href="${localPath('/services')}">Services</a><a href="${localPath('/solutions')}">Solutions</a><a href="${localPath('/products')}">Products</a><a href="${localPath('/about')}">About MĀKI</a><a href="${localPath('/blog')}">News</a><a href="${localPath('/enquire')}">Enquiry</a></div><div><h3>Contact Us:</h3><a href="mailto:info@maki.nz">info@maki.nz</a><a href="tel:+642041941275">+64 20 4194 1275</a><a href="https://www.facebook.com/FB.MAKI.NZ/">Facebook</a></div></div><div class="fineprint">© 2025 by MĀKI</div></div></footer>`}
function render(){const page=currentPage(),map={services:servicesPage,solutions:solutionsPage,products:productsPage,about:aboutPage,enquire:enquirePage,blog:blogPage,post:postPage};document.getElementById('app').innerHTML=nav()+(map[page]?map[page]():home())+footer();bind();initEditor();const tab=new URLSearchParams(location.search).get('tab');if(tab&&document.getElementById(tab))document.getElementById(tab).scrollIntoView({block:'center'})}
function bind(){document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));document.querySelectorAll('.js-form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const s=f.querySelector('.status');s.textContent=f.querySelector('textarea')?'Thank you. Your enquiry is ready to send by email.':'Thank You for Subscribing!';if(f.querySelector('textarea'))location.href='mailto:info@maki.nz?subject='+encodeURIComponent('MĀKI website enquiry')}))}
const OWNER_EDITOR_KEY='maki-owner-2026';
function ownerUnlocked(){const q=new URLSearchParams(location.search);if(q.get('owner')===OWNER_EDITOR_KEY){localStorage.setItem('makiOwner','yes');return true}return localStorage.getItem('makiOwner')==='yes'}
function editorEnabled(){return ownerUnlocked()&&(new URLSearchParams(location.search).get('edit')==='1'||localStorage.getItem('makiEditor')==='on')}
function initEditor(){addEditorLauncher();applySavedEdits();if(!editorEnabled())return;document.body.classList.add('editor-on');buildEditorPanel();markEditableElements()}
function addEditorLauncher(){if(!ownerUnlocked())return;if(document.querySelector('.editor-launcher'))return;const b=document.createElement('button');b.type='button';b.className='editor-launcher';b.textContent=editorEnabled()?'Exit editor':'Edit site';b.onclick=()=>{if(editorEnabled()){localStorage.removeItem('makiEditor');const u=new URL(location.href);u.searchParams.delete('edit');u.searchParams.delete('owner');location.href=u}else{localStorage.setItem('makiEditor','on');const u=new URL(location.href);u.searchParams.set('edit','1');u.searchParams.delete('owner');location.href=u}};document.body.appendChild(b)}
function editables(){return document.querySelectorAll('h1,h2,h3,h4,p,li,.button,.eyebrow,img,.hero,.custom-block,.custom-video')}
function keyFor(el,i){return (currentPage()||'home')+':'+el.tagName.toLowerCase()+':'+i}
function edits(){try{return JSON.parse(localStorage.getItem('makiEdits')||'{}')}catch{return {}}}
function saveEdits(e){localStorage.setItem('makiEdits',JSON.stringify(e))}
function blockStore(){try{return JSON.parse(localStorage.getItem('makiBlocks')||'{}')}catch{return {}}}
function saveBlocks(b){localStorage.setItem('makiBlocks',JSON.stringify(b))}
function pageBlocks(){const b=blockStore();return b[currentPage()||'home']||[]}
function savePageBlocks(rows){const b=blockStore();b[currentPage()||'home']=rows;saveBlocks(b)}
function customBlockHtml(block){if(block.type==='image')return `<figure class="custom-block custom-image" data-custom-id="${block.id}"><img src="${block.src}" alt="${block.alt||''}" style="${block.width?`width:${block.width};`:''}${block.height?`height:${block.height};`:''}"></figure>`;if(block.type==='video')return `<div class="custom-block custom-video" data-custom-id="${block.id}"><iframe src="https://www.youtube.com/embed/${parseYouTubeId(block.src)}" title="${block.text||'MĀKI video'}" allowfullscreen></iframe></div>`;return `<div class="custom-block custom-text" data-custom-id="${block.id}" style="${block.style||''}">${block.text||'New text block'}</div>`}
function applyCustomBlocks(){document.querySelectorAll('[data-custom-id]').forEach(el=>el.remove());const anchors=[...editables()].filter(el=>!el.closest('.editor-panel')&&!el.classList.contains('editor-launcher'));const anchorMap={};anchors.forEach((el,i)=>anchorMap[keyFor(el,i)]=el);pageBlocks().forEach(block=>{const anchor=anchorMap[block.afterKey]||document.querySelector('main, #app section:last-of-type, #app');if(!anchor)return;const wrap=document.createElement('div');wrap.innerHTML=customBlockHtml(block);const node=wrap.firstElementChild;anchor.insertAdjacentElement(block.afterKey?'afterend':'beforeend',node)})}
function applySavedEdits(){const e=edits();document.querySelectorAll('h1,h2,h3,h4,p,li,.button,.eyebrow,img,.hero,.custom-block,.custom-video').forEach((el,i)=>{const v=e[keyFor(el,i)];if(!v)return;if(v.html&&el.tagName!=='IMG'&&!el.classList.contains('hero'))el.innerHTML=v.html;if(v.src&&el.tagName==='IMG')el.src=v.src;if(v.bg&&el.classList.contains('hero'))el.style.backgroundImage="url('"+v.bg+"')";if(v.style)Object.assign(el.style,v.style)});applyCustomBlocks()}
function markEditableElements(){let selected=null;const mark=()=>{editables().forEach((el,i)=>{if(el.closest('.editor-panel')||el.classList.contains('editor-launcher')||el.dataset.editorReady)return;const k=keyFor(el,i);el.dataset.editKey=k;el.dataset.editorReady='1';if(el.tagName!=='IMG'&&!el.classList.contains('hero')&&el.tagName!=='IFRAME'){el.contentEditable='true';el.addEventListener('input',()=>{const e=edits();e[k]={...(e[k]||{}),html:el.innerHTML};saveEdits(e);saveCustomBlockHtml(el)})}el.addEventListener('click',ev=>{if(!document.body.classList.contains('editor-on'))return;ev.preventDefault();ev.stopPropagation();selected?.classList.remove('editor-selected');selected=el;el.classList.add('editor-selected');syncEditorPanel(el)})})};mark();window.__makiSelected=()=>selected;window.__makiRemark=mark}
function saveCustomBlockHtml(el){const id=el.dataset.customId;if(!id)return;const rows=pageBlocks();const row=rows.find(b=>b.id===id);if(row&&row.type==='text'){row.text=el.innerHTML;savePageBlocks(rows)}}
function buildEditorPanel(){if(document.querySelector('.editor-panel'))return;const p=document.createElement('aside');p.className='editor-panel';p.innerHTML='<h3>Website editor</h3><p>Click text, images, videos, or a hero section, then adjust it here. Add new content after the selected item.</p><label>Text colour <input data-editor="color" type="color"></label><label>Font size <input data-editor="fontSize" type="number" min="10" max="120" placeholder="px"></label><label>Font family <select data-editor="fontFamily"><option value="">Default</option><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Tahoma</option></select></label><label>Alignment <select data-editor="textAlign"><option value="">Default</option><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label><label>Width <input data-editor="width" type="text" placeholder="147px or 50%"></label><label>Height <input data-editor="height" type="text" placeholder="auto or 66px"></label><label>Image / hero URL <input data-editor="imageUrl" type="url" placeholder="https://... or assets/media/..."></label><button type="button" data-action="image">Apply image</button><button type="button" data-action="fitImageText">Match text width</button><hr><h3>Add content</h3><label>Type <select data-add="type"><option value="text">Text</option><option value="image">Image</option><option value="video">Video</option></select></label><label>Content / URL <textarea data-add="content" placeholder="Text, image URL, or YouTube URL"></textarea></label><label>Alt text / title <input data-add="title" placeholder="Optional"></label><button type="button" data-action="addBlock">Add after selected</button><button type="button" data-action="deleteBlock">Delete selected custom block</button><hr><h3>Video library</h3><label>YouTube URL or ID <input data-video="id" placeholder="https://youtu.be/..."></label><label>Video title <input data-video="title" placeholder="New video title"></label><button type="button" data-action="addVideo">Add video card</button><button type="button" data-action="resetVideos">Reset video cards</button><hr><button type="button" data-action="saveFile">Save changes</button><button type="button" data-action="export">Export changes</button><button type="button" data-action="reset">Reset all local edits</button>';document.body.appendChild(p);p.querySelectorAll('[data-editor]').forEach(i=>i.addEventListener('input',()=>applyControl(i)));p.querySelector('[data-action=image]').onclick=applyImage;p.querySelector('[data-action=fitImageText]').onclick=fitImageToText;p.querySelector('[data-action=addBlock]').onclick=addCustomBlock;p.querySelector('[data-action=deleteBlock]').onclick=deleteCustomBlock;p.querySelector('[data-action=addVideo]').onclick=addVideo;p.querySelector('[data-action=resetVideos]').onclick=()=>{localStorage.removeItem('makiVideos');render()};p.querySelector('[data-action=saveFile]').onclick=saveChangesFile;p.querySelector('[data-action=export]').onclick=exportChanges;p.querySelector('[data-action=reset]').onclick=()=>{localStorage.removeItem('makiEdits');localStorage.removeItem('makiVideos');localStorage.removeItem('makiBlocks');render()}}
function syncEditorPanel(el){const p=document.querySelector('.editor-panel');if(!p)return;const cs=getComputedStyle(el);p.querySelector('[data-editor=color]').value=rgbToHex(cs.color);p.querySelector('[data-editor=fontSize]').value=parseInt(cs.fontSize,10)||'';p.querySelector('[data-editor=fontFamily]').value='';p.querySelector('[data-editor=textAlign]').value=cs.textAlign||'';p.querySelector('[data-editor=width]').value=el.style.width||'';p.querySelector('[data-editor=height]').value=el.style.height||'';const f=p.querySelector('[data-editor=imageUrl]');f.value=el.tagName==='IMG'?el.src:(el.classList.contains('hero')?(el.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)||[])[1]||'':'')}
function applyControl(input){const el=window.__makiSelected?.();if(!el)return;const prop=input.dataset.editor;let val=prop==='fontSize'&&input.value?input.value+'px':input.value;if(prop==='height'&&val.toLowerCase()==='auto')val='';if(!['color','fontSize','fontFamily','textAlign','width','height'].includes(prop))return;el.style[prop]=val;if(prop==='width'||prop==='height')el.style.maxWidth=prop==='width'?'100%':el.style.maxWidth;const e=edits();e[el.dataset.editKey]={...(e[el.dataset.editKey]||{}),style:{...((e[el.dataset.editKey]||{}).style||{}),[prop]:val}};saveEdits(e);saveCustomBlockSize(el)}
function saveCustomBlockSize(el){const id=el.closest('[data-custom-id]')?.dataset.customId;if(!id)return;const target=el.tagName==='IMG'?el:el.querySelector('img');const rows=pageBlocks();const row=rows.find(b=>b.id===id);if(row&&target){row.width=target.style.width;row.height=target.style.height;savePageBlocks(rows)}}
function applyImage(){const el=window.__makiSelected?.(),url=document.querySelector('[data-editor=imageUrl]')?.value.trim();if(!el||!url)return;const e=edits();if(el.tagName==='IMG'){el.src=url;e[el.dataset.editKey]={...(e[el.dataset.editKey]||{}),src:url}}else if(el.classList.contains('hero')){el.style.backgroundImage="url('"+url+"')";e[el.dataset.editKey]={...(e[el.dataset.editKey]||{}),bg:url}}saveEdits(e)}
function selectedImageElement(){const el=window.__makiSelected?.();if(!el)return null;return el.tagName==='IMG'?el:el.querySelector?.('img')||null}
function fitImageToText(){const img=selectedImageElement();if(!img)return;img.style.width='100%';img.style.height='auto';img.style.maxWidth='100%';img.style.display='block';const box=img.closest('figure,.custom-image');if(box){box.style.textAlign='left';box.style.width='100%'}const e=edits();e[img.dataset.editKey]={...(e[img.dataset.editKey]||{}),style:{...((e[img.dataset.editKey]||{}).style||{}),width:'100%',height:'auto',maxWidth:'100%',display:'block'}};saveEdits(e);saveCustomBlockSize(img);syncEditorPanel(img)}
function addCustomBlock(){const selected=window.__makiSelected?.();const p=document.querySelector('.editor-panel');const type=p.querySelector('[data-add=type]').value;const content=p.querySelector('[data-add=content]').value.trim();const title=p.querySelector('[data-add=title]').value.trim();if(!content)return;const rows=pageBlocks();rows.push({id:'block-'+Date.now(),afterKey:selected?.dataset.editKey||'',type,src:content,text:type==='text'?content:title,alt:title,width:type==='image'?'60%':'',height:''});savePageBlocks(rows);applyCustomBlocks();window.__makiRemark?.()}
function deleteCustomBlock(){const selected=window.__makiSelected?.();const id=selected?.closest('[data-custom-id]')?.dataset.customId;if(!id)return;savePageBlocks(pageBlocks().filter(b=>b.id!==id));selected.closest('[data-custom-id]')?.remove()}
function parseYouTubeId(x){const m=x.trim().match(/(?:v=|youtu\.be\/|embed\/)?([A-Za-z0-9_-]{11})/);return m?m[1]:x.trim()}
function addVideo(){const id=parseYouTubeId(document.querySelector('[data-video=id]')?.value||''),title=document.querySelector('[data-video=title]')?.value||'New MĀKI video';if(!id)return;localStorage.setItem('makiVideos',JSON.stringify([...getVideos(),[id,title]]));render()}
function editorPayload(){return {savedAt:new Date().toISOString(),page:currentPage()||'home',edits:edits(),videos:getVideos(),blocks:blockStore()}}
function exportChanges(){navigator.clipboard?.writeText(JSON.stringify(editorPayload(),null,2));alert('Changes copied to clipboard as JSON.')}
function saveChangesFile(){const data=JSON.stringify(editorPayload(),null,2);const blob=new Blob([data],{type:'application/json'});const a=document.createElement('a');const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');a.href=URL.createObjectURL(blob);a.download='maki-edits-'+stamp+'.json';document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);a.remove()}
function rgbToHex(rgb){const n=rgb.match(/\d+/g)?.slice(0,3).map(Number);return !n||n.length<3?'#000000':'#'+n.map(v=>v.toString(16).padStart(2,'0')).join('')}
render();



