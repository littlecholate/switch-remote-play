var keycashe = ""

const controlBox = document.getElementById("controlbox");
const controlKey = [
    'a', 's', 'w', 'd', 'i', 'j', 'k', 'l', 
    'g', 'v', 'b', 'n', '/', '6', '7', '1', '2', '8', '9',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
];

function checkArrow(key) {
    switch (key) {
        case('ArrowUp'):
            return 'up';
        case('ArrowDown'):
            return 'down';
        case('ArrowRight'):
            return 'right';
        case('ArrowLeft'):
            return 'left';
        default:
            return key;
    }
}

document.body.onkeydown = (event) => {
    if (controlBox.checked == false) return;
    if (controlKey.indexOf(event.key) < 0) return;

    let key = event.key;
    if (keycashe !== key) {
        keycashe = key;
        key = checkArrow(key);
        //console.log(key);
        fetch("/post-command-api", {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: key
        })
    }
}

document.body.onkeyup = (event) => {
    if (controlBox.checked == false) return;
    if (controlKey.indexOf(event.key) < 0) return;

    keycashe = "";
    
    let key = event.key
    key = checkArrow(key);
    //console.log("stop " + key);
    fetch("/post-command-api", {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: "0" + key
    })
}