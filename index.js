function centerElementInView(divId) {
    const div = document.getElementById(divId);
    const divRect = div.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    window.scrollTo(divRect.left + window.pageXOffset - centerX, divRect.top + window.pageYOffset - centerY);
}
const field = document.getElementById("field");
let bars = 20;
let tiles = 20;
for (let i = 0; i < bars; i++) {
    let bar = document.createElement('div');
    bar.setAttribute('id', `row:${i}`);
    bar.classList.add("row");
    field.appendChild(bar);
}
let barDivs = document.querySelectorAll(".row");
barDivs.forEach((b, index) => {
    for (let i = 0; i < tiles; i++) {
        let tile = document.createElement('div');
        tile.setAttribute('id', `${index}:${i}`);
        tile.classList.add("tile");
        b.appendChild(tile);
    }
})
const modal = document.getElementById('modal');
let popup = document.getElementById("popup");
let inputSection = document.getElementById("inputSection");
let questionSpan = document.getElementById("question");
let submitBtn = document.getElementById("submit");
let questionType;
let anwserType;
let selectedItem;
let selectedTile;
let selectedCoords;
function askInputQuestion(question) {
    modal.style.display = 'flex';
    questionSpan.innerText = question;
    let inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', 'textInput');
    inputElement.setAttribute('placeholder', 'Enter awnser');
    inputSection.appendChild(inputElement)
}
function askMenuQuestion() {
    modal.style.display = 'flex';
    questionSpan.innerText = "select what form the line should be";
    let selectElement = document.createElement('select');
    selectElement.setAttribute('id', 'dropdown');
    let options = [
        { value: 'lr', text: 'left right' },
        { value: 'tb', text: 'top bottom' },
        { value: 'tl', text: 'top left' },
        { value: 'bl', text: 'bottom left' },
        { value: 'tr', text: 'top right' },
        { value: 'br', text: 'bottom right' },
        { value: 'ht', text: 'horizontal top' },
        { value: 'hb', text: 'horizontal bottom' },
        { value: 'vl', text: 'vertical left' },
        { value: 'vr', text: 'vertical right' },
        { value: 'hv', text: 'horizontal vertical' },
    ];
    options.forEach((optionData) => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', optionData.value);
        optionElement.textContent = optionData.text;
        selectElement.appendChild(optionElement);
    });
    inputSection.appendChild(selectElement);
    let nums = document.createElement('div');
    nums.setAttribute('id', `numsQuestions`);
    for (let i = 1; i < 5; i++) {
        let num = document.createElement('input');
        num.classList.add("numQuestion")
        num.setAttribute('type', 'text');
        num.setAttribute('id', `textInput${i}`);
        if (i == 1) num.setAttribute('placeholder', 'Top');
        if (i == 2) num.setAttribute('placeholder', 'Right');
        if (i == 3) num.setAttribute('placeholder', 'Bottom');
        if (i == 4) num.setAttribute('placeholder', 'Left');
        nums.appendChild(num);
    }
    inputSection.appendChild(nums);
}
submitBtn.addEventListener('click', () => {
    let textInput = document.getElementById("textInput");
    let dropdown = document.getElementById("dropdown");
    let numsQuestions = document.getElementById("numsQuestions");
    if (textInput) {
        let textValue = textInput.value.trim();
        modal.style.display = 'none';
        inputSection.replaceChildren();
        if (anwserType == "update") document.getElementById(selectedCoords).replaceChildren();
        if (questionType == "entity") createEntity(textValue.toUpperCase(), [], [], selectedCoords);
        else if (questionType == "attribute") createAttribute(textValue, [], [], selectedCoords);
        else if (questionType == "relation") createRelation(textValue, [], [], selectedCoords);
    }
    if (dropdown) {
        let selectedOption = dropdown.value;
        modal.style.display = 'none';
        inputSection.replaceChildren();
        let map = [];
        for (var i = 0; i < numsQuestions.children.length; i++) {
            var child = numsQuestions.children[i];
            map.push(child.value.trim() == "" ? null : child.value.trim())
        }
        if (selectedOption == 'lr') createLine(selectedCoords, "horizontal-line", null, map);
        else if (selectedOption == 'tb') createLine(selectedCoords, "vertical-line", null, map);
        else if (selectedOption == 'tl') createLine(selectedCoords, "top-line", "left-line", map);
        else if (selectedOption == 'bl') createLine(selectedCoords, "bottom-line", "left-line", map);
        else if (selectedOption == 'tr') createLine(selectedCoords, "top-line", "right-line", map);
        else if (selectedOption == 'br') createLine(selectedCoords, "bottom-line", "right-line", map);
        else if (selectedOption == 'ht') createLine(selectedCoords, "horizontal-line", "top-line", map);
        else if (selectedOption == 'hb') createLine(selectedCoords, "horizontal-line", "bottom-line", map);
        else if (selectedOption == 'vl') createLine(selectedCoords, "vertical-line", "left-line", map);
        else if (selectedOption == 'vr') createLine(selectedCoords, "vertical-line", "right-line", map);
        else if (selectedOption == 'hv') createLine(selectedCoords, "horizontal-line", "vertical-line", map);

    }
});
field.addEventListener("contextmenu", e => {
    e.preventDefault();
    popup.replaceChildren();
    const item = e.target.closest(".item");
    if (item) {
        selectedItem = item;
        selectedCoords = e.target.closest(".tile").id;
        popup.style.display = 'flex';
        popup.style.top = item.offsetTop + 'px';
        popup.style.left = item.offsetLeft + ((20 / 100) * window.innerHeight) + 'px';
        let options;
        if (item.classList.contains("rectangle")) options = ["rename entity", "delete"];
        else if (item.classList.contains("diamond")) options = ["rename relation", "delete"];
        else if (item.classList.contains("oval")) options = ["rename attribute", "delete"];
        else if (item.classList.contains("line")) options = [/*"update line", */"delete"];
        options.forEach(o => {
            let option = document.createElement('button');
            option.setAttribute('id', `${o}`);
            option.classList.add("popupOption");
            option.innerText = o;
            popup.appendChild(option);
        })
    } else {
        const tile = e.target.closest(".tile");
        selectedTile = tile;
        selectedCoords = tile.id;
        const tileId = tile.id;
        popup.style.display = 'flex';
        popup.style.top = tile.offsetTop + 'px';
        popup.style.left = tile.offsetLeft + ((20 / 100) * window.innerHeight) + 'px';
        let options = ["create entity", "create attribute", "create relation", "create line"];
        options.forEach(o => {
            let option = document.createElement('button');
            option.setAttribute('id', `${o}`);
            option.classList.add("popupOption");
            option.innerText = o;
            popup.appendChild(option);
        })
    }
});
document.addEventListener('keydown', e => {
    if (e.target !== popup || !popup?.children?.includes(e.target) || e.target.classList.includes("item")) {
        popup.style.display = 'none';
        popup.replaceChildren();
    }
});
document.addEventListener('mousedown', e => {
    console.log(e.target)
    if (e.target !== popup || !popup?.children?.includes(e.target) || e.target.classList.includes("item")) {
        popup.style.display = 'none';
        popup.replaceChildren();
    }
    if (e.target.id == "create entity") {
        questionType = "entity";
        anwserType = "new";
        askInputQuestion("name for the entity:");
    } else if (e.target.id == "create attribute") {
        questionType = "attribute";
        anwserType = "new";
        askInputQuestion("name for the agttribute:");
    } else if (e.target.id == "create relation") {
        questionType = "relation";
        anwserType = "new";
        askInputQuestion("name for the relation:");
    } else if (e.target.id == "create line") {
        askMenuQuestion();
        anwserType = "new";
    } else if (e.target.id == "rename entity") {
        questionType = "entity";
        anwserType = "update";
        askInputQuestion("new name for the entity:");
    } else if (e.target.id == "rename relation") {
        questionType = "relation";
        anwserType = "update";
        askInputQuestion("new name for the relation:");
    } else if (e.target.id == "rename attribute") {
        questionType = "attribute";
        anwserType = "update";
        askInputQuestion("new name for the attribute:");
    } else if (e.target.id == "delete") {
        document.getElementById(selectedCoords).replaceChildren();
    }
});
let database = {
    entities: {},
    relations: {},
    attributes: {},
};
function createEntity(label, attributes, relations, coords) {
    let token = generateRandomToken();
    database.entities[token] = {
        label,
        attributes,
        relations,
    };
    let entity = document.createElement('span');
    entity.setAttribute('id', `${token}`);
    entity.classList.add("item");
    entity.classList.add("rectangle");
    entity.innerText = label;
    if (coords) { document.getElementById(coords).appendChild(entity); }
    else { field.children[2].appendChild(entity); }
}
function createRelation(label, relations, attributes, coords) {
    let token = generateRandomToken();
    database.relations[token] = {
        label,
        relations,
        attributes
    };
    let relation = document.createElement('span');
    relation.setAttribute('id', `${token}`);
    relation.classList.add("item");
    relation.classList.add("diamond");
    relation.innerText = label;
    if (coords) { document.getElementById(coords).appendChild(relation); }
    else { field.children[2].appendChild(relation); }
}
function createAttribute(label, entities, relations, coords) {
    let token = generateRandomToken();
    database.relations[token] = {
        label,
        entities,
        relations,
    };
    let attribute = document.createElement('span');
    attribute.setAttribute('id', `${token}`);
    attribute.classList.add("item");
    attribute.classList.add("oval");
    attribute.innerText = label;
    if (coords) { document.getElementById(coords).appendChild(attribute); }
    else { field.children[2].appendChild(attribute); }
}
function createLine(coords, one, two, nums) {
    let line = document.createElement('span');
    line.classList.add("line");
    line.classList.add("item");
    line.classList.add(one);
    if (two != null) line.classList.add(two);
    if (nums[0] != null) {
        let num = document.createElement('span');
        num.classList.add("num");
        num.classList.add("num1");
        num.innerText = nums[0];
        line.appendChild(num);
    }
    if (nums[1] != null) {
        let num = document.createElement('span');
        num.classList.add("num");
        num.classList.add("num2");
        num.innerText = nums[1];
        line.appendChild(num);
    }
    if (nums[2] != null) {
        let num = document.createElement('span');
        num.classList.add("num");
        num.classList.add("num3");
        num.innerText = nums[2];
        line.appendChild(num);
    }
    if (nums[3] != null) {
        let num = document.createElement('span');
        num.classList.add("num");
        num.classList.add("num4");
        num.innerText = nums[3];
        line.appendChild(num);
    }
    let parent = document.getElementById(coords);
    parent.replaceChildren();
    parent.appendChild(line);
}
function generateRandomToken() {
    const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let token = '';
    for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    Object.keys(database).forEach((a) => {
        let list = Object.keys(a);
        if (list.length != 0) {
            list.forEach((b) => {
                if (b == token) return generateRandomToken();
            })
        }
    })
    return token;
}
// lightMode
const root = document.documentElement;
let lightMode = document.getElementById("lightMode");
let title = document.getElementById("title");
lightMode.addEventListener('click', () => {
    console.log(lightMode.classList)
    if (lightMode.classList.contains("moon")) {
        // switch to sun:
        lightMode.classList.add("sun");
        lightMode.classList.remove("moon");
        title.style.color = "#ffffff";
        field.style.backgroundColor = "#181818";
    }
    else {
        // switch to moon:
        lightMode.classList.add("moon");
        lightMode.classList.remove("sun");
        title.style.color = "#000000";
        field.style.backgroundColor = "#ffffff";
    }
});
// borderMode
let borderMode = document.getElementById("borderMode");
borderMode.addEventListener('click', () => {
    console.log(borderMode.classList)
    if (borderMode.classList.contains("light")) {
        borderMode.classList.add("dark");
        borderMode.classList.remove("light");
        root.style.setProperty('--border', '#eae7e3');
    } else if (borderMode.classList.contains("dark")) {
        borderMode.classList.add("transparent");
        borderMode.classList.remove("dark");
        root.style.setProperty('--border', 'black');
    }
    else {
        borderMode.classList.add("light");
        borderMode.classList.remove("transparent");
        root.style.setProperty('--border', '#00000000');
    }
});
// colorMode
let colorMode = document.getElementById("colorMode");
colorMode.addEventListener('click', () => {
    if (colorMode.classList.contains("plain")) {
        colorMode.classList.add("color");
        colorMode.classList.remove("plain");
        root.style.setProperty('--entity', '#00000000');
        root.style.setProperty('--relation', '#00000000');
        root.style.setProperty('--attribute', '#00000000');
    } else {
        colorMode.classList.add("plain");
        colorMode.classList.remove("color");
        root.style.setProperty('--entity', '#5cec96');
        root.style.setProperty('--relation', '#CAD388');
        root.style.setProperty('--attribute', '#6dc5de');
    }
});
// reset
let resetButton = document.getElementById("reset");
resetButton.addEventListener('click', () => {
    let confirmed = window.confirm('Do you want to reset everything?');
    if (confirmed) {
        field.replaceChildren();
        for (let i = 0; i < bars; i++) {
            let bar = document.createElement('div');
            bar.setAttribute('id', `row:${i}`);
            bar.classList.add("row");
            field.appendChild(bar);
        }
        let barDivs = document.querySelectorAll(".row");
        barDivs.forEach((b, index) => {
            for (let i = 0; i < tiles; i++) {
                let tile = document.createElement('div');
                tile.setAttribute('id', `${index}:${i}`);
                tile.classList.add("tile");
                b.appendChild(tile);
            }
        })
    }

});
// export
let exportButton = document.getElementById("export");
exportButton.addEventListener('click', () => {
    let data = {
        entities: [], //{coords:"",label: ""}
        attributes: [], //{coords:"",label: ""}
        relations: [], //{coords:"",label: ""}
        lines: [], //{coords:"",form: "",nums:[]}
    }

    let entities = document.querySelectorAll(".rectangle");
    entities.forEach(entity => {
        data.entities.push({ coords: entity.closest(".tile").id, label: `${entity.innerText}` })
    });
    let attributes = document.querySelectorAll(".oval");
    attributes.forEach(attribute => {
        data.attributes.push({ coords: attribute.closest(".tile").id, label: `${attribute.innerText}` })
    });
    let relations = document.querySelectorAll(".diamond");
    relations.forEach(relation => {
        data.relations.push({ coords: relation.closest(".tile").id, label: `${relation.innerText}` })
    });
    let lines = document.querySelectorAll(".line");
    lines.forEach(line => {
        let classList = Array.from(line.classList);
        let form;
        if (classList.includes("horizontal-line")) form = 'lr';
        else if (classList.includes("vertical-line")) form = 'tb';
        else if (classList.includes("top-line") && classList.includes("left-line")) form = 'tl';
        else if (classList.includes("bottom-line") && classList.includes("left-line")) form = 'bl';
        else if (classList.includes("top-line") && classList.includes("right-line")) form = 'tr';
        else if (classList.includes("bottom-line") && classList.includes("right-line")) form = 'br';
        else if (classList.includes("horizontal-line") && classList.includes("top-line")) form = 'ht';
        else if (classList.includes("horizontal-line") && classList.includes("bottom-line")) form = 'hb';
        else if (classList.includes("vertical-line") && classList.includes("left-line")) form = 'vl';
        else if (classList.includes("vertical-line") && classList.includes("right-line")) form = 'vr';
        else if (classList.includes("horizontal-line") && classList.includes("vertical-line")) form = 'hv';

        let nums;
        if (line.children.length != 0) {
            let numm = {
                num1: null,
                num2: null,
                num3: null,
                num4: null,
            }
            let childElements = line.querySelectorAll('.num');
            childElements.forEach(n => {
                if (n.classList.contains("num1")) numm.num1 = n.innerText;
                if (n.classList.contains("num2")) numm.num2 = n.innerText;
                if (n.classList.contains("num3")) numm.num3 = n.innerText;
                if (n.classList.contains("num4")) numm.num4 = n.innerText;
            });
            nums = Object.values(numm);
        }
        else nums = []
        data.lines.push({ coords: line.closest(".tile").id, form: `${form}`, nums: nums })
    });
    let jsonString = JSON.stringify(data, null, 2);
    let blob = new Blob([jsonString], { type: 'application/javascript' });
    let blobUrl = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = 'ERD-template.json';
    downloadLink.click();
    URL.revokeObjectURL(blobUrl);
    downloadLink.remove();
});
let fileInput = document.getElementById('fileInput');
let chooseFileButton = document.getElementById('import');
chooseFileButton.addEventListener('click', function () {
    let confirmed = window.confirm('importing will reset all your current work, are you sure?');
    if (confirmed) {
        fileInput.click();
    }
});
fileInput.addEventListener('change', function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                // reset field
                field.replaceChildren();
                for (let i = 0; i < bars; i++) {
                    let bar = document.createElement('div');
                    bar.setAttribute('id', `row:${i}`);
                    bar.classList.add("row");
                    field.appendChild(bar);
                }
                let barDivs = document.querySelectorAll(".row");
                barDivs.forEach((b, index) => {
                    for (let i = 0; i < tiles; i++) {
                        let tile = document.createElement('div');
                        tile.setAttribute('id', `${index}:${i}`);
                        tile.classList.add("tile");
                        b.appendChild(tile);
                    }
                })
                //
                let data = JSON.parse(event.target.result);
                data.entities.forEach((entity) => {
                    createEntity(entity.label, [], [], entity.coords)
                })
                data.attributes.forEach((attribute) => {
                    createAttribute(attribute.label, [], [], attribute.coords)
                })
                data.relations.forEach((relation) => {
                    createRelation(relation.label, [], [], relation.coords)
                })
                data.lines.forEach((line) => {
                    let one; let two;
                    if (line.form == 'lr') one = "horizontal-line", two = null;
                    else if (line.form == 'tb') one = "vertical-line", two = null;
                    else if (line.form == 'tl') one = "top-line", two = "left-line";
                    else if (line.form == 'bl') one = "bottom-line", two = "left-line";
                    else if (line.form == 'tr') one = "top-line", two = "right-line";
                    else if (line.form == 'br') one = "bottom-line", two = "right-line";
                    else if (line.form == 'ht') one = "horizontal-line", two = "top-line";
                    else if (line.form == 'hb') one = "horizontal-line", two = "bottom-line";
                    else if (line.form == 'vl') one = "vertical-line", two = "left-line";
                    else if (line.form == 'vr') one = "vertical-line", two = "right-line";
                    else if (line.form == 'hv') one = "horizontal-line", two = "vertical-line";
                    createLine(line.coords, one, two, line.nums)
                })
            } catch (error) {
                // Handle JSON parsing errors
                console.log('Error parsing JSON: ' + error.message);
            }
        };
        // Read the file as text
        reader.readAsText(selectedFile);
    }
});