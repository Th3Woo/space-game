// Planet types and features
const planetTypes = ['rocky', 'gas', 'volcanic', 'oceanic', 'lush'];
const planetFeatures = ['ruins', 'wildlife', 'crystals', 'rare materials'];
let explorationLog = [];
let currentPlanet;

// Function to generate a random planet
function generatePlanet() {
    const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
    const features = [];
    for (let feature of planetFeatures) {
        if (Math.random() < 0.5) {
            features.push(feature);
        }
    }
    return { type, features };
}

// Function to display planet info
function displayPlanetInfo(planet) {
    const planetInfoDiv = document.getElementById('planet-info');
    planetInfoDiv.innerHTML = `
        <h2>Planet Type: ${planet.type}</h2>
        <h3>Features:</h3>
        <ul>
            ${planet.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <input type="checkbox" id="keep-planet"> Keep Planet
    `;
}

// Function to update exploration log
function updateExplorationLog() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';
    explorationLog.forEach((planet, index) => {
        logList.innerHTML += `
            <li>
                <input type="checkbox" id="log-${index}" ${planet.kept ? 'checked' : ''}>
                ${planet.type} - ${planet.features.join(', ')}
            </li>
        `;
    });
}

// Add cooldown bar HTML
const cooldownBar = document.createElement('div');
cooldownBar.id = 'cooldown-bar';
cooldownBar.style.width = '100%';
cooldownBar.style.height = '10px';
cooldownBar.style.background = '#ccc';
cooldownBar.style.display = 'none';
document.querySelector('.main-content').appendChild(cooldownBar);

// Event listener for keep planet checkbox
document.getElementById('planet-info').addEventListener('change', (e) => {
    if (e.target.id === 'keep-planet') {
        const keepPlanet = document.getElementById('keep-planet');
        const existingPlanetIndex = explorationLog.findIndex(planet => planet.id === currentPlanetId);
        if (existingPlanetIndex !== -1) {
            explorationLog[existingPlanetIndex].kept = keepPlanet.checked;
        } else {
            explorationLog.push({ id: currentPlanetId, type: currentPlanet.type, features: currentPlanet.features, kept: keepPlanet.checked });
        }
        updateExplorationLog();
    }
});

// Event listener for explore button
let cooldown = false;
let currentPlanetId = null;
document.getElementById('explore-button').addEventListener('click', () => {
    if (cooldown) return;
    cooldown = true;
    const exploreButton = document.getElementById('explore-button');
    exploreButton.classList.add('loading');
    const planet = generatePlanet();
    currentPlanet = planet;
    currentPlanetId = Math.random().toString(36).substr(2, 9);
    displayPlanetInfo(planet);
    const radarRange = document.getElementById('radar-range').value;
    const numShips = document.getElementById('num-ships').value;
    console.log(`Radar Range: ${radarRange}, Number of Ships: ${numShips}`);
    exploreButton.classList.remove('loading');

    // Start cooldown
    let cooldownTime = 10;
    cooldownBar.style.display = 'block';
    cooldownBar.style.background = '#66d9ef';
    const interval = setInterval(() => {
        cooldownTime--;
        const percentage = (cooldownTime / 10) * 100;
        cooldownBar.style.width = `${percentage}%`;
        if (cooldownTime <= 0) {
            clearInterval(interval);
            cooldown = false;
            cooldownBar.style.display = 'none';
        }
    }, 1000);
});

// Event listener for log link
document.getElementById('log-link').addEventListener('click', () => {
    document.getElementById('planet-info').style.display = 'none';
    document.getElementById('exploration-log').style.display = 'block';
    document.getElementById('explore-button').style.display = 'none';
    cooldownBar.style.display = 'none';
});

// Event listener for explore link
document.getElementById('explore-link').addEventListener('click', () => {
    document.getElementById('planet-info').style.display = 'block';
    document.getElementById('exploration-log').style.display = 'none';
    document.getElementById('explore-button').style.display = 'block';
    if (cooldown) {
        cooldownBar.style.display = 'block';
    }
});

// Event listener for forget button
document.getElementById('forget-button').addEventListener('click', () => {
    explorationLog = explorationLog.filter(planet => planet.kept);
    updateExplorationLog();
});