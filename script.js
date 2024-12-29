let visibleNumber = "";
let formattedVisibleNumber = "";
let formattedNumber = [];
let globalCount = "";
let equalPressed = false;
let operationPressed = false;

//Funcion para borrar operaciones total o parcialmente
function resetDelete() {
    const resultText = document.querySelector("#result");

    //Si el texto mostrado es "AC" se restablece todo; es decir, un reinicio
    if  (document.querySelector("#AC").innerText === "AC") {
        screenPrint("0");
        formattedNumber = [];
        setVisibleNumber("");
        globalCount = "";
        resetOrangeButtons();
        formattedVisibleNumber = "";
    }
    
    /*Si el texto mostrado es "C" se elimina el ultimo numero ingresado despues del operador
    sin alterar el contador global siempre y cuando la tecla presionada anteriormente sea 
    diferente de la tecla "=", caso contrario el boton "C" actua como el boton "AC"*/
    else {
        if (equalPressed) {
            globalCount = "";
        }

        else {
            globalCount = globalCount.slice(0, globalCount.length - visibleNumber.length);
        }
        screenPrint("0");
        formattedNumber = [];
        setVisibleNumber("");
        ACorC("AC")
        formattedVisibleNumber = "";
    }

    transitionGrayButtons("var(--light-gray)", "var(--light-gray-click)")

    //Restablecer el tamaño inicial despues de presionar la tecla AC/C
    resultText.style.fontSize = "53px";
}

//Funcion para actualizar la operación global y mostrar el numero ingresado en pantalla
function addNumbers(event) {
    const addNumber = event.target.value;

    //Prevencion de ceros antes de otro 0 y de un numero de mas de 9 digitos
    if ((visibleNumber !== "" || addNumber !== "0") && visibleNumber.length < 9) {

        //Reinicio del numero visible en caso de que el boton previo sea un operador
        if (operationPressed) {
            setVisibleNumber("");
            operationPressed = false;
        }

        visibleNumber += addNumber;
        globalCount += addNumber;
        formattedNumber = [] ;
        numbersFormat();
        adjustTextSize(visibleNumber);
        ACorC("C")
        equalPressed = false;
        operationPressed = false;
    }
    transitionGrayButtons("var(--dark-gray)", "var(--dark-gray-click)")
}

//Funcion para agregar puntos decimales
function addDecimals() {
    if (visibleNumber.length < 9 && !visibleNumber.includes(".")) {
        //Si se presiona el boton de punto decimal sin ingresar un numero se agrega "0."
        if (visibleNumber === "") {
            visibleNumber += "0.";
            globalCount += visibleNumber;
        }

        //Si el numero no tiene un punto decimal, se le agrega al final
        else if (!visibleNumber.includes(".")){
            visibleNumber += ".";
            globalCount += ".";
        }
    }
    screenPrint(visibleNumber);
    adjustTextSize(visibleNumber)
    equalPressed = false;
    operationPressed = false;
}

//Funcion para agregar una operación
function doOperation(event) {
    const addOperation = event.target.value;
    formattedVisibleNumber = visibleNumber;

    /*En caso de presionar una operacion sin haber ingresado un numero previo este toma 
    un valor de 0*/
    if (globalCount === "") {
        setVisibleNumber ("0");
    }

    /*En caso de que el ultimo caracter no sea un numero (operador), este se tiene que 
    remplazar por el operando del boton presionado*/
    if (!isNaN(visibleNumber[visibleNumber.length - 1])) {
        globalCount = visibleNumber + addOperation;
    }

    else {
        globalCount = globalCount.slice(0, -1) + addOperation;
    }

    screenPrint(formattedVisibleNumber);
    adjustTextSize(formattedVisibleNumber)
    resetOrangeButtons();
    transitionOrangeButtons();
    operationPressed = true;
    equalPressed = false;
}

function doPercentage() {
    let currentNumber = parseFloat(globalCount);
    
    if (!isNaN(currentNumber)) {
        currentNumber /= 100;

        // Actualizar el valor global y el número visible
        globalCount = currentNumber.toString();
        visibleNumber = currentNumber.toString();
        screenPrint(visibleNumber);
        adjustTextSize(visibleNumber)
    }
    equalPressed = false;
    operationPressed = false;
}

function doInvertSign() {
    let currentNumber = parseFloat(globalCount);
    
    if (!isNaN(currentNumber)) {
        currentNumber *= -1;

        // Actualizar el valor global y el número visible
        globalCount = currentNumber.toString();
        visibleNumber = currentNumber.toString();
        screenPrint(visibleNumber);
        adjustTextSize(visibleNumber)
    }
    equalPressed = false;
    operationPressed = false;
}

//Funcion para calcular el resultado
function calculateResult() {
    resetOrangeButtons();

    /*Si se presiona la tecla "=" sin haber agregado un numero despues de una operacion 
    se considera ese numero como el numero antes del operador, ejemplo: 5/, si en este
    punto se presiona la tecla "=" la operacion a realizar sera: 5/5 */
    if (isNaN(globalCount[globalCount.length - 1] && !equalPressed)) {
        globalCount += globalCount.slice(0, globalCount.length - 1);
        equalPressed = true;
    }

    else {
        equalPressed = true;
    }

    let result = eval(globalCount).toFixed(8).toString();
    let [integerPart, decimalPart] = result.split(".")
    result = integerPart + result.slice(integerPart.length, 9 - integerPart.length);
    result = Number(result)
    screenPrint(result);
    adjustTextSize(result)
    visibleNumber = `${result}`
    operationPressed = false;
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
                formattedNumber.push("," + visibleNumber.slice(i - 2, i + 1));
                iterations ++;
            }
        }

        //Concatenación del grupo de numeros a la izquierda, sea de 3, 2 o 1 digito
        formattedNumber.push(visibleNumber.slice(0, visibleNumber.length - 3 * iterations));

        //Texto visible formateado del numero ingresado
        formattedVisibleNumber = formattedNumber.reverse().join("")
        screenPrint(formattedVisibleNumber);
        adjustTextSize(formattedVisibleNumber);
    }
    else {
        screenPrint(visibleNumber);
        adjustTextSize(visibleNumber);
    }
}

function setVisibleNumber (value) {
    visibleNumber = value;
}

function ACorC(str) {
    document.querySelector("#AC").innerText = str;
}

function screenPrint(str) {
    document.querySelector("#result").innerText = str;
}

//Apartado de funciones destinadas a reglas CSS (diseño)

function transitionOrangeButtons() {
    /*Se aplica una transicion de color de fondo a blanco y texto a naranja del boton que
    se presiona*/
    const selectedButtonId = "#" + event.target.id;
    const selectedButton = document.querySelector(selectedButtonId);
    selectedButton.style.backgroundColor = "var(--white)";
    selectedButton.style.color = "var(--orange)";
}

function resetOrangeButtons() {
    /*Se aplica una transicion de color de fondo a naranja y texto a blanco a todos los
    botones con las clases .button y .orange; es decir a los botones naranjas*/
    const orangeButtons = document.querySelectorAll(".button.orange")
        orangeButtons.forEach(button => {
        button.style.backgroundColor = "var(--orange)";
        button.style.color = "var(--white)";
    });
} 

function transitionGrayButtons(mainColor, transitionColor) {
    const selectedButtonId = "#" + event.target.id;
    const selectedButton = document.querySelector(selectedButtonId);
    selectedButton.style.backgroundColor = transitionColor;
    //tiempo de espera para darle tiempo al navegador de hacer la transicion
    setTimeout(() => {
        selectedButton.style.backgroundColor = mainColor;
    }, 200);
}

function adjustTextSize(value) {
    const resultText = document.querySelector("#result");
    let initialSize = 53;
    if (value.length > 6) {
        resultText.style.fontSize = `${initialSize - 5.5 * (value.length - 6)}px`;
    }
}