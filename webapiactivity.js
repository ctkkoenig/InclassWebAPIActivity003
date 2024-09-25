console.log("Script is loading");

import { Play, Act, Scene } from './play-module.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");

    const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

    let play = null;

    // Event listener for selecting a play
    document.querySelector('#playList').addEventListener('change', async function () {
        const selectedPlay = this.value;
        console.log(`Play selected: ${selectedPlay}`);

        if (selectedPlay !== '0') {
            try {
                const response = await fetch(`${url}?name=${selectedPlay}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const playData = await response.json();
                play = new Play(playData);
                displayPlayTitle(play.title);  // Display the play title
                displayPlayData(play);         // Populate acts and scenes
            } catch (error) {
                console.error('Error fetching play data:', error);
            }
        }
    });

    // Function to display the play title
    function displayPlayTitle(title) {
        const titleElement = document.querySelector('#playTitle');
        titleElement.textContent = title;
    }

    // Event listener for selecting an act
    document.querySelector('#actList').addEventListener('change', function () {
        const selectedActIndex = this.value;
        if (play && play.acts[selectedActIndex]) {
            const selectedAct = play.acts[selectedActIndex];
            displayActScene(selectedAct);     // Display the selected act's first scene
            populateSceneDropdown(selectedAct);  // Populate scenes for the selected act
        }
    });

    // Event listener for selecting a scene
    document.querySelector('#sceneList').addEventListener('change', function () {
        const selectedActIndex = document.querySelector('#actList').value;
        const selectedSceneIndex = this.value;
        if (play && play.acts[selectedActIndex] && play.acts[selectedActIndex].scenes[selectedSceneIndex]) {
            const selectedScene = play.acts[selectedActIndex].scenes[selectedSceneIndex];
            displayScene(selectedScene);        // Display the selected scene
            populatePlayerDropdown(selectedScene);  // Populate players in the selected scene
        }
    });

    // Event listener for the filter button (highlighting search terms)
    document.querySelector('#btnHighlight').addEventListener('click', function () {
        const selectedActIndex = document.querySelector('#actList').value;
        const selectedSceneIndex = document.querySelector('#sceneList').value;
        const searchTerm = document.querySelector('#txtHighlight').value.trim().toLowerCase();
        const selectedPlayer = document.querySelector('#playerList').value;

        if (play && play.acts[selectedActIndex] && play.acts[selectedActIndex].scenes[selectedSceneIndex]) {
            const selectedScene = play.acts[selectedActIndex].scenes[selectedSceneIndex];
            highlightSpeeches(selectedScene, searchTerm, selectedPlayer);  // Highlight speeches based on player and search term
        }
    });

    // Function to display the list of acts in a play
    function displayPlayData(play) {
        const actList = document.querySelector('#actList');
        actList.innerHTML = '';
        play.acts.forEach((act, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = act.name;
            actList.appendChild(option);
        });

        if (play.acts[0]) {
            displayActScene(play.acts[0]);     // Display the first act by default
            populateSceneDropdown(play.acts[0]);  // Populate the scenes for the first act
        }
    }

    // Function to populate the scene dropdown for a selected act
    function populateSceneDropdown(act) {
        const sceneList = document.querySelector('#sceneList');
        sceneList.innerHTML = '';
        act.scenes.forEach((scene, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = scene.name;
            sceneList.appendChild(option);
        });

        if (act.scenes[0]) {
            displayScene(act.scenes[0]);        // Display the first scene by default
            populatePlayerDropdown(act.scenes[0]);  // Populate the players for the first scene
        }
    }

    // Function to populate the player dropdown for a selected scene
    function populatePlayerDropdown(scene) {
        const playerList = document.querySelector('#playerList');
        playerList.innerHTML = '';
        const uniquePlayers = new Set(scene.speeches.map(speech => speech.speaker));

        const allPlayersOption = document.createElement('option');
        allPlayersOption.value = '0';
        allPlayersOption.textContent = 'All Players';
        playerList.appendChild(allPlayersOption);

        uniquePlayers.forEach(player => {
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            playerList.appendChild(option);
        });
    }

    // Function to display the first scene in the selected act
    function displayActScene(act) {
        const actHere = document.querySelector('#actHere');
        const sceneHere = document.querySelector('#sceneHere');

        actHere.innerHTML = `<h3>${act.name}</h3>`;
        sceneHere.innerHTML = '';

        if (act.scenes && act.scenes[0]) {
            const scene = act.scenes[0];
            sceneHere.innerHTML = `
                <h4>${scene.name}</h4>
                <p class="title">${scene.title}</p>
                <p class="direction">${scene.stageDirection}</p>
            `;

            scene.speeches.forEach(speech => {
                const speechDiv = document.createElement('div');
                speechDiv.classList.add('speech');
                speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speech.lines.join(' ')}</p>`;
                sceneHere.appendChild(speechDiv);
            });
        }
    }

    // Function to display the selected scene
    function displayScene(scene) {
        const sceneHere = document.querySelector('#sceneHere');
        sceneHere.innerHTML = '';

        sceneHere.innerHTML = `
            <h4>${scene.name}</h4>
            <p class="title">${scene.title}</p>
            <p class="direction">${scene.stageDirection}</p>
        `;

        scene.speeches.forEach(speech => {
            const speechDiv = document.createElement('div');
            speechDiv.classList.add('speech');
            speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speech.lines.join(' ')}</p>`;
            sceneHere.appendChild(speechDiv);
        });
    }

    // Function to highlight speeches in a scene based on search term and player
    function highlightSpeeches(scene, searchTerm, selectedPlayer) {
        const sceneHere = document.querySelector('#sceneHere');
        sceneHere.innerHTML = '';

        scene.speeches.forEach(speech => {
            let speechText = speech.lines.join(' ');

            if (searchTerm) {
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                speechText = speechText.replace(regex, '<b>$1</b>');
            }

            const speechDiv = document.createElement('div');
            speechDiv.classList.add('speech');

            if (selectedPlayer === '0' || speech.speaker === selectedPlayer) {
                speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speechText}</p>`;
            } else {
                speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speech.lines.join(' ')}</p>`;
            }

            sceneHere.appendChild(speechDiv);
        });
    }
});
