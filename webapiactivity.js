console.log("Script is loading");

import { Play, Act, Scene } from './play-module.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");

    const url = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

    let play = null;

    // Add change event listener to play dropdown
    document.querySelector('#playList').addEventListener('change', async function () {
        const selectedPlay = this.value;
        console.log(`Play selected: ${selectedPlay}`);

        if (selectedPlay !== '0') {
            try {
                console.log(`Fetching data for play: ${selectedPlay}`);
                const response = await fetch(`${url}?name=${selectedPlay}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const playData = await response.json();
                console.log('Data fetched successfully:', playData);

                play = new Play(playData);  // Create Play object using Play class from play-module.js
                displayPlayData(play);
            } catch (error) {
                console.error('Error fetching play data:', error);
            }
        }
    });

    // Add change event listener to act dropdown
    document.querySelector('#actList').addEventListener('change', function () {
        const selectedActIndex = this.value;
        if (play && play.acts[selectedActIndex]) {
            const selectedAct = play.acts[selectedActIndex];
            displayActScene(selectedAct); // Display first scene of selected act
            populateSceneDropdown(selectedAct); // Populate scene dropdown based on selected act
        } else {
            console.warn('Selected act is undefined or invalid.');
        }
    });

    // Add change event listener to scene dropdown
    document.querySelector('#sceneList').addEventListener('change', function () {
        const selectedActIndex = document.querySelector('#actList').value;
        const selectedSceneIndex = this.value;
        if (play && play.acts[selectedActIndex] && play.acts[selectedActIndex].scenes[selectedSceneIndex]) {
            const selectedScene = play.acts[selectedActIndex].scenes[selectedSceneIndex];
            displayScene(selectedScene);  // Display the selected scene
        } else {
            console.warn('Selected scene is undefined or invalid.');
        }
    });

    // Function to process and display play data
    function displayPlayData(play) {
        const actList = document.querySelector('#actList');
        actList.innerHTML = '';  // Clear previous options
        play.acts.forEach((act, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = act.name;  // Use act.name (e.g., 'ACT I')
            actList.appendChild(option);
        });

        if (play.acts[0]) {
            displayActScene(play.acts[0]);  // Display the first act by default
            populateSceneDropdown(play.acts[0]); // Populate the scene dropdown with the first act's scenes
        }
    }

    // Function to populate scene dropdown
    function populateSceneDropdown(act) {
        const sceneList = document.querySelector('#sceneList');
        sceneList.innerHTML = ''; // Clear previous options
        act.scenes.forEach((scene, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = scene.name;  // Use scene.name (e.g., 'SCENE I')
            sceneList.appendChild(option);
        });

        if (act.scenes[0]) {
            displayScene(act.scenes[0]);  // Display the first scene by default
        }
    }

    // Function to display the first scene of the selected act
    function displayActScene(act) {
        const actHere = document.querySelector('#actHere');
        const sceneHere = document.querySelector('#sceneHere');

        actHere.innerHTML = `<h3>${act.name}</h3>`;
        sceneHere.innerHTML = '';

        if (act.scenes && act.scenes[0]) {
            const scene = act.scenes[0];
            sceneHere.innerHTML = `
                <h4>${scene.name}</h4>  <!-- 'SCENE I' -->
                <p class="title">${scene.title}</p>  <!-- Scene title -->
                <p class="direction">${scene.stageDirection}</p>  <!-- Stage directions -->
            `;

            scene.speeches.forEach(speech => {
                const speechDiv = document.createElement('div');
                speechDiv.classList.add('speech');
                speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speech.lines.join(' ')}</p>`;
                sceneHere.appendChild(speechDiv);
            });
        } else {
            console.warn('No scenes found for the selected act.');
        }
    }

    // Function to display a selected scene
    function displayScene(scene) {
        const sceneHere = document.querySelector('#sceneHere');
        sceneHere.innerHTML = '';

        sceneHere.innerHTML = `
            <h4>${scene.name}</h4>  <!-- 'SCENE I' -->
            <p class="title">${scene.title}</p>  <!-- Scene title -->
            <p class="direction">${scene.stageDirection}</p>  <!-- Stage directions -->
        `;

        scene.speeches.forEach(speech => {
            const speechDiv = document.createElement('div');
            speechDiv.classList.add('speech');
            speechDiv.innerHTML = `<span>${speech.speaker}</span><p>${speech.lines.join(' ')}</p>`;
            sceneHere.appendChild(speechDiv);
        });
    }
});
