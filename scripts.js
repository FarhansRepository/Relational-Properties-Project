 $(document).ready(function() {
        $('.hidden').waypoint({
            handler: function(direction) {
                if (direction === 'down') {
                    $(this.element).slideDown();
                } else {
                    $(this.element).slideUp();
                }
            },
            offset: '50%',
        });
    });

    function clearInput(inputId, outputId) {
        document.getElementById(inputId).value = '';
        document.getElementById(outputId).innerHTML = '';
    }

    function redirectToSection(sectionId) {
        const element = document.getElementById(sectionId);
        element.scrollIntoView();
    }
    document.getElementById('vbtn-radio1').addEventListener('change', function() {
        redirectToSection('Learn');
    });
    document.getElementById('vbtn-radio2').addEventListener('change', function() {
        redirectToSection('Practice');
    });

    function searchDefinition(word) {
        const searchUrl = `https://www.google.com/search?q=define+${word}`;
        window.open(searchUrl, '_blank');
    }

    function is_symmetric(pairs) {
        for (let [x, y] of pairs) {
            if (!pairs.some(([a, b]) => a === y && b === x)) {
                return false;
            }
        }
        return true;
    }

    function is_transitive(pairs) {
        for (let [x, y] of pairs) {
            for (let [z, w] of pairs) {
                if (y === z && !pairs.some(([a, b]) => a === x && b === w)) {
                    return false;
                }
            }
        }
        return true;
    }

    function is_reflexive(pairs) {
        for (let [x, y] of pairs) {
            if (!pairs.some(([a, b]) => a === x && b === x)) {
                return false;
            }
        }
        return true;
    }

    function createClosureDiv(title, value) {
        const div = document.createElement("div");
        div.classList.add("closure-container");
        const titleElement = document.createElement("h3");
        titleElement.textContent = title;
        titleElement.classList.add("closure-title");
        div.appendChild(titleElement);
        const resultString = value ? 'Yes' : 'No';
        const resultElement = document.createElement("p");
        resultElement.textContent = resultString;
        resultElement.classList.add("closure-content");
        div.appendChild(resultElement);
        return div;
    }

    function parsePairsInput(input) {
        const regex = /\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]\s*/g;
        const pairs = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            const x = parseInt(match[1]);
            const y = parseInt(match[2]);
            pairs.push([x, y]);
        }
        return pairs;
    }

    function displayResults(t, r, s) {
        const outputDiv = document.getElementById("output");
        outputDiv.innerHTML = "";
        outputDiv.appendChild(createClosureDiv("Is it transitive?", t));
        outputDiv.appendChild(createClosureDiv("Is it reflexive?", r));
        outputDiv.appendChild(createClosureDiv("Is it symmetric?", s));
    }

    function calculateProperties() {
        const pairsInput = document.getElementById("pair").value;
        const pairsArray = parsePairsInput(pairsInput);
        const transitive = is_transitive(pairsArray);
        const reflexive = is_reflexive(pairsArray);
        const symmetric = is_symmetric(pairsArray);
        displayResults(transitive, reflexive, symmetric);
    }

    function addPair(newPairs, x, y) {
        newPairs.push([x, y]);
    }

    function sortPairsAscending(pairs) {
        return pairs.slice().sort((pair1, pair2) => {
            if (pair1[0] !== pair2[0]) {
                return pair1[0] - pair2[0];
            }
            return pair1[1] - pair2[1];
        });
    }

    function areArrayOfPairsEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            const pair1 = arr1[i];
            const pair2 = arr2[i];
            if (pair1.length !== pair2.length) {
                return false;
            }
            for (let j = 0; j < pair1.length; j++) {
                if (pair1[j] !== pair2[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function transitiveClosure(pairs) {
        let newPairs = pairs.slice();
        let referencePairs = pairs.slice();
        let escapeCondition = false;
        while (!escapeCondition) {
            referencePairs = newPairs.slice();
            for (let [x, y] of referencePairs) {
                for (let [z, w] of referencePairs) {
                    if (y === z && !newPairs.some(([a, b]) => a === x && b === w)) {
                        addPair(newPairs, x, w);
                    }
                }
            }
            escapeCondition = JSON.stringify(newPairs) === JSON.stringify(referencePairs);
        }
        newPairs = sortPairsAscending(newPairs);
        return newPairs;
    }

    function reflexiveClosure(pairs) {
        let newPairs = pairs.slice();
        const domain = new Set(pairs.flatMap(([x, y]) => [x, y]));
        for (let x of domain) {
            if (!pairs.some(([a, b]) => a === x && b === x)) {
                addPair(newPairs, x, x);
            }
        }
        newPairs = sortPairsAscending(newPairs);
        return newPairs;
    }

    function symmetricClosure(pairs) {
        let newPairs = pairs.slice();
        for (let [x, y] of pairs) {
            if (!pairs.some(([a, b]) => a === y && b === x)) {
                addPair(newPairs, y, x);
            }
        }
        newPairs = sortPairsAscending(newPairs);
        return newPairs;
    }

    function displayResults_forClosure(transitiveClosureResult, reflexiveClosureResult, symmetricClosureResult) {
        const outputDiv = document.getElementById("output2");
        outputDiv.innerHTML = "";
        const createClosureDiv = (title, closure) => {
            const div = document.createElement("div");
            div.classList.add("closure-container");
            const titleElement = document.createElement("h3");
            titleElement.textContent = title;
            titleElement.classList.add("closure-title");
            div.appendChild(titleElement);
            const closureString = closure.map(pair => `[${pair.join(", ")}]`).join(", ");
            const closureElement = document.createElement("p");
            closureElement.classList.add("closure-content");
            closureElement.textContent = closureString;
            div.appendChild(closureElement);
            outputDiv.appendChild(div);
        };
        createClosureDiv("Transitive Closure:", transitiveClosureResult);
        createClosureDiv("Reflexive Closure:", reflexiveClosureResult);
        createClosureDiv("Symmetric Closure:", symmetricClosureResult);
    }

    function calculateClosures2() {
        const pairsInput = document.getElementById("pairsInput").value;
        const pairsArray = parsePairsInput(pairsInput);
        const transitiveClosureResult = transitiveClosure(pairsArray);
        const reflexiveClosureResult = reflexiveClosure(pairsArray);
        const symmetricClosureResult = symmetricClosure(pairsArray);
        displayResults_forClosure(transitiveClosureResult, reflexiveClosureResult, symmetricClosureResult);
    }
