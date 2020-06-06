let coordinateMap = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    // { x: 2, y: 3 },
];
let gridSize = [];
let panelElement;
let holePos;

export function gameInit(panelElement, gridSize) {
    panelElement.innerHTML = '';
    setPanelElement(panelElement);
    setGridSize(gridSize);
    setHolePosition();
    setCoordinateMap();

    addPieces();
    shuffleTiles();
    tileClickEventBinding();
    keydownEventBinding();
}

function setHolePosition() {
    const pos = {
        x: gridSize[0] - 1,
        y: gridSize[1] - 1,
        translate: `translate(calc(var(--tile-w-size)*${
            gridSize[0] - 1
        }),calc(var(--tile-h-size)*${gridSize[1] - 1}))`,
    };
    holePos = pos;
}

function setPanelElement(el) {
    panelElement = el;
}

function setGridSize(size) {
    gridSize = size;
}

function setCoordinateMap() {
    coordinateMap = [];
    for (let i = 0; i < gridSize[0]; i++) {
        for (let j = 0; j < gridSize[1]; j++) {
            coordinateMap.push({
                x: i,
                y: j,
                translate: `translate(calc(var(--tile-w-size)*${i}),calc(var(--tile-h-size)*${j}))`,
            });
        }
    }
    coordinateMap.pop();
}

function addPieces() {
    const percentageX = 100 / (gridSize[0] - 1);
    const percentageY = 100 / (gridSize[1] - 1);
    for (let index = 0; index < gridSize[0] * gridSize[1]; index++) {
        const div = document.createElement('div');
        const { y, x } = fromTileIndexToPosition(index);
        const pos = coordinateMap.find((c) => (c.x === x) & (c.y === y));
        console.log(y, x);

        div.id = index;
        if (gridSize[0] * gridSize[1] - 1 !== index) {
            const xPos = percentageX * (index % gridSize[0]);
            const yPos = percentageY * Math.floor(index / gridSize[0]);
            div.style.backgroundImage = 'url("penguins_300x400.jpg")';
            div.style.backgroundPosition = `${xPos}% ${yPos}%`;
            div.style.backgroundSize = `${gridSize[0]}00%`;
            div.setAttribute('data-xIndex', x);
            div.setAttribute('data-yIndex', y);
            div.style.transform = pos.translate;
            // div.className = `tile x${x} y${y}`;
            div.className = `tile`;
            panelElement.appendChild(div);
        }
    }
}

function shuffleTiles() {
    let mapCor = [...coordinateMap];

    for (let i = panelElement.children.length - 1; i >= 0; i--) {
        const rand = Math.floor(Math.random() * i - 1) | 0;
        const pos = mapCor.splice(rand, 1)[0];
        moveTileToXY(panelElement.children[i], pos);
    }
}

// pos: {x,y}
// element: HTMLElement
function moveTileToXY(element, pos) {
    if (pos) {
        // element.className = `tile x${pos.x} y${pos.y}`;
        element.style.transform = pos.translate;
        element.setAttribute('data-xIndex', pos.x);
        element.setAttribute('data-yIndex', pos.y);
    }
}

/**
 *
 * @param {HTMLElement} element
 */
function moveTileToHole(element) {
    debugger;
    const elPos = getPositionfromElement(element);
    if (validateMove(elPos)) {
        moveTileToXY(element, holePos);
        holePos = elPos;
    }
}
/**
 * Find positive destination position with directions respect
 * @param {*} tilePos - tile position
 * @return {positivePos: {left, right, up, down}}
 */
function findPositiveMove(tilePos) {
    return {
        left: {
            ...tilePos,
            x: tilePos.x - 1 >= 0 ? tilePos.x - 1 : null,
            translate: `translate(calc(var(--tile-w-size)*${
                tilePos.x - 1
            }),calc(var(--tile-h-size)*${tilePos.y}))`,
        },
        right: {
            ...tilePos,
            x: tilePos.x + 1 < gridSize[0] ? tilePos.x + 1 : null,
            translate: `translate(calc(var(--tile-w-size)*${
                tilePos.x + 1
            }),calc(var(--tile-h-size)*${tilePos.y}))`,
        },
        up: {
            ...tilePos,
            y: tilePos.y - 1 >= 0 ? tilePos.y - 1 : null,
            translate: `translate(calc(var(--tile-w-size)*${
                tilePos.x
            }),calc(var(--tile-h-size)*${tilePos.y - 1}))`,
        },
        down: {
            ...tilePos,
            y: tilePos.y + 1 < gridSize[1] ? tilePos.y + 1 : null,
            translate: `translate(calc(var(--tile-w-size)*${
                tilePos.x
            }),calc(var(--tile-h-size)*${tilePos.y + 1}))`,
        },
    };
}

function validateMove(targetPos) {
    const positiveMove = findPositiveMove(targetPos);
    return Object.values(positiveMove).find(
        (v) => JSON.stringify(v) === JSON.stringify(holePos)
    );
}

function fromTileIndexToPosition(tileIndex) {
    const rowIdx = Math.ceil((tileIndex + 1) / gridSize[0]) - 1;
    const colIdx = tileIndex % gridSize[0];
    return {
        y: rowIdx,
        x: colIdx,
    };
}

function swapElements(idx1, idx2) {
    const obj1 = panelElement.children[idx1];
    const obj2 = panelElement.children[idx2];
    const temp = obj2.id;
    obj2.id = obj1.id;
    obj1.id = temp;
    // save the location of obj2
    let parent2 = obj2.parentNode;
    let next2 = obj2.nextSibling;
    // special case for obj1 is the next sibling of obj2
    if (next2 === obj1) {
        // just put obj1 before obj2
        parent2.insertBefore(obj1, obj2);
    } else {
        // insert obj2 right before obj1
        obj1.parentNode.insertBefore(obj2, obj1);

        // now insert obj1 where obj2 was
        if (next2) {
            // if there was an element after obj2, then insert obj1 right before that
            parent2.insertBefore(obj1, next2);
        } else {
            // otherwise, just append as last child
            parent2.appendChild(obj1);
        }
    }
}

function tileClickHandler(ev) {
    moveTileToHole(ev.target);
}

function getPositionfromElement(element) {
    return {
        x: parseInt(element.getAttribute('data-xIndex')),
        y: parseInt(element.getAttribute('data-yIndex')),
        translate: `translate(calc(var(--tile-w-size)*${element.getAttribute(
            'data-xIndex'
        )}),calc(var(--tile-h-size)*${element.getAttribute('data-yIndex')}))`,
    };
}

function tileClickEventBinding() {
    document.querySelectorAll('.tile').forEach((tile) => {
        const tilePos = getPositionfromElement(tile);
        if (JSON.stringify(tilePos) !== JSON.stringify(holePos)) {
            console.log(tilePos, holePos);

            tile.addEventListener('click', tileClickHandler);
        }
    });
}

function keydownEventBinding() {
    document.addEventListener('keydown', arrowKeyPressHandler);
}

function arrowKeyPressHandler(ev) {
    const positiveTargetPos = findPositiveMove(holePos);
    let targetPos;
    switch (ev.keyCode) {
        case 38: // up
            targetPos = positiveTargetPos.down;
            break;
        case 37: // left
            targetPos = positiveTargetPos.right;
            break;
        case 39: // right
            targetPos = positiveTargetPos.left;
            break;
        case 40: // down
            targetPos = positiveTargetPos.up;
            break;
        default:
            return;
    }

    if (targetPos) {
        const targetElement = document.querySelector(
            `[data-xindex="${targetPos.x}"][data-yindex="${targetPos.y}"]`
        );
        if (targetElement) {
            moveTileToHole(targetElement);
        }
    }
}
