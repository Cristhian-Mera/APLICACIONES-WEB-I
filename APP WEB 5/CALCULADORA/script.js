// Función que se ejecuta al hacer clic en el botón Calcular
function calcular() {
    // Obtener los valores ingresados
    var num1 = parseFloat(document.getElementById("numero1").value);
    var num2 = parseFloat(document.getElementById("numero2").value);
    
    // Verificar si los valores son números válidos
    if (isNaN(num1) || isNaN(num2)) {
        alert("Por favor ingresa números válidos");
        return;
    }
    
    // Limpiar el área de resultados
    var resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";
    
    // Nombres de las operaciones
    var operaciones = ["SUMA", "RESTA", "MULTIPLICACIÓN", "DIVISIÓN", "MÓDULO"];
    
    // Clases CSS para cada operación
    var clases = ["suma", "resta", "multiplicacion", "division", "modulo"];
    
    // Símbolos para cada operación
    var simbolos = ["+", "-", "×", "÷", "%"];
    
    // Bucle de 5 iteraciones
    for (var i = 0; i < 5; i++) {
        // Calcular el resultado según la operación
        var resultado;
        
        if (i === 0) {
            resultado = num1 + num2; // Suma
        } else if (i === 1) {
            resultado = num1 - num2; // Resta
        } else if (i === 2) {
            resultado = num1 * num2; // Multiplicación
        } else if (i === 3) {
            resultado = num1 / num2; // División
        } else {
            resultado = num1 % num2; // Módulo
        }
        
        // Crear un elemento para mostrar el resultado
        var resultadoElement = document.createElement("div");
        resultadoElement.className = "resultado " + clases[i];
        
        // Agregar el contenido al elemento
        resultadoElement.innerHTML = 
            "Iteración " + (i + 1) + ": " + operaciones[i] + "<br>" +
            num1 + " " + simbolos[i] + " " + num2 + " = " + resultado;
        
        // Agregar el elemento al área de resultados
        resultadosDiv.appendChild(resultadoElement);
    }
}