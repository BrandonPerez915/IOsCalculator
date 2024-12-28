let visibleNumber = "";
let showNumber = [];
let globalCount = "";

//Funcion para borrar operaciones total o parcialmente
function resetDelete() {
    const resultText = document.querySelector("#result");

    if  (document.querySelector("#AC").innerText === "AC") {
        document.querySelector("#result").innerText = "0";
        showNumber = [];
        visibleNumber = "";
        globalCount = "";
    }
    else {
        document.querySelector("#result").innerText = "0"; 
        globalCount = globalCount.slice(0, globalCount.length - visibleNumber.length);
        showNumber = [];
        visibleNumber = "";
        document.querySelector("#AC").innerText = "AC";
    }

    resultText.style.fontSize = "53px";
}

//Funcion para actualizar la operación global y mostrar el numero ingresado en pantalla
function addNumbers(event) {
    const addNumber = event.target.value;

    //Prevencion de ceros antes de otro 0 y de un numero de mas de 9 digitos
    if ((visibleNumber !== "" || addNumber !== "0") && visibleNumber.length < 9) {
        visibleNumber += addNumber;
        globalCount += addNumber;
        showNumber = [] ;
        numbersFormat();
        adjustTextSize();
        ACToC()
    }
}

//Funcion para agregar una operación
function doOperation(event) {
    const addOperation = event.target.value;

    /*En caso de presionar una operacion sin haber ingresado un numero previo este toma 
    un valor de 0*/
    if (globalCount === "") {
        visibleNumber = "0";
    }

    /*En caso de que el ultimo caracter no sea un numero (operador), este se tiene que 
    remplazar por el operando del boton presionado*/
    if (!isNaN(visibleNumber[visibleNumber.length - 1])) {
        globalCount = visibleNumber + addOperation;
    }
    else {
        globalCount = globalCount.slice(0, -1) + addOperation;
    }

    //Texto reiniciado y inicializacion de un nuevo numero despues del operador
    document.querySelector("#result").innerText = "0";
    visibleNumber = "";

    const orangeButtons = document.querySelectorAll(".button.orange")
    orangeButtons.forEach(button => {
        button.style.backgroundColor = "var(--orange)";
        button.style.color = "var(--white)";
      });
    const selectedButtonId = "#" + event.target.id;
    const selectedButton = document.querySelector(selectedButtonId);
    selectedButton.style.backgroundColor = "var(--white)";
    selectedButton.style.color = "var(--orange)";
}

function addDecimals() {
    if (visibleNumber.length < 9 && !visibleNumber.includes(".")) {
        if (visibleNumber === "") {
            visibleNumber += "0.";
            globalCount += visibleNumber;
        }
        else if (!visibleNumber.includes(".")){
            visibleNumber += ".";
            globalCount += ".";
        }
    }
    document.querySelector("#result").innerText = visibleNumber;
}

function numbersFormat () {
    //Algoritmo para formatear los numeros con comas cada 3 digitos
    if (visibleNumber.length > 3) {

        //Separación de cada 3 digitos comenzando por la derecha
        let iterations = 0;
        for (let i = visibleNumber.length - 1; i >= 3; i -= 3) {
            if (visibleNumber.includes(".")){
                break;
            }
            else {
                showNumber.push("," + visibleNumber.slice(i - 2, i + 1));
                iterations ++;
            }
        }

        //Concatenación del grupo de numeros a la izquierda, sea de 3, 2 o 1 digito
        showNumber.push(visibleNumber.slice(0, visibleNumber.length - 3 * iterations));

        //Texto visible formateado del numero ingresado
        document.querySelector("#result").innerText = showNumber.reverse().join("");
    }
    else {
        document.querySelector("#result").innerText = visibleNumber;
    }
}

function adjustTextSize() {
    const resultText = document.querySelector("#result");
    if (visibleNumber.length < 6) {
        resultText.style.fontSize = "53px";
    }
    else if (visibleNumber.length === 6) {
        resultText.style.fontSize = "50px";
    }
    else if (visibleNumber.length === 7) {
        resultText.style.fontSize = "43px";
    }
    else if (visibleNumber.length === 8) {
        resultText.style.fontSize = "38px";
    }
    else if (visibleNumber.length === 9){
        resultText.style.fontSize = "35px";
    }
}

function ACToC() {
    document.querySelector("#AC").innerText = "C"
}

function prueba() {
    document.querySelector("#result").innerText = globalCount;
}