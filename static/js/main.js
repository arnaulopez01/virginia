/* Main Logic - Project Virginia
   Style: Modern, Clean & Interactive
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el tablero de Sudoku al cargar
    initSudoku();

    // 2. Añadir soporte para tecla "Enter" en los inputs
    setupEnterKey('ans-1', checkLevel1);
    setupEnterKey('ans-2', checkLevel2);
    setupEnterKey('final-code', checkFinalCode);
});

/* =========================================
   FUNCIONES DE NAVEGACIÓN
   ========================================= */

function nextLevel(currentId, nextId) {
    const currentEl = document.getElementById(currentId);
    const nextEl = document.getElementById(nextId);

    // Ocultar nivel actual
    currentEl.style.display = 'none';
    currentEl.classList.remove('fade-in');
    
    // Mostrar siguiente nivel con animación
    nextEl.classList.remove('hidden');
    nextEl.style.display = 'block';
    
    // Pequeño timeout para asegurar que el navegador procese el cambio de display
    setTimeout(() => {
        nextEl.classList.add('fade-in');
    }, 10);
}

/* =========================================
   NIVEL 1: SUDOKU INTERACTIVO
   ========================================= */

function initSudoku() {
    const board = document.getElementById('sudoku-board');
    if (!board) return;

    // Datos del Sudoku (0 = Casilla vacía para rellenar)
    const initialData = [
        2, 3, 9, 8, 7, 5, 1, 0, 0,
        4, 5, 6, 0, 9, 2, 0, 0, 7,
        0, 7, 8, 6, 4, 0, 0, 0, 0,
        7, 0, 1, 0, 0, 0, 3, 0, 8,
        0, 4, 2, 5, 3, 0, 7, 0, 1,
        3, 0, 0, 7, 8, 0, 4, 2, 9,
        9, 8, 0, 3, 0, 6, 5, 1, 4,
        5, 0, 4, 9, 1, 0, 0, 8, 0,
        6, 0, 3, 4, 5, 0, 9, 0, 0
    ];

    // Índices de las celdas LILAS (Basado en la imagen original)
    const purpleIndices = [13, 20, 24, 37, 40, 43, 56, 60, 67];

    board.innerHTML = ''; // Limpiar tablero

    initialData.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.classList.add('sudoku-cell');

        // Calcular filas y columnas para los bordes gruesos
        const col = index % 9;
        const row = Math.floor(index / 9);

        // Añadir bordes gruesos cada 3 celdas para separar bloques
        if (col === 2 || col === 5) cell.classList.add('border-right-thick');
        if (row === 2 || row === 5) cell.classList.add('border-bottom-thick');

        // Colorear fondo si es casilla pista (lila)
        if (purpleIndices.includes(index)) {
            cell.classList.add('highlight-cell');
        }

        // Crear el input
        const input = document.createElement('input');
        input.type = 'tel'; // Mejor teclado en móviles
        input.maxLength = 1; // Solo un número

        if (num !== 0) {
            // Números fijos (Initial Data)
            input.value = num;
            input.readOnly = true;
            input.classList.add('fixed');
            input.tabIndex = -1; // Saltar al tabular
        } else {
            // Celdas editables por el usuario
            input.addEventListener('input', function() {
                // Validar que solo sean números del 1 al 9
                this.value = this.value.replace(/[^1-9]/g, '');
            });
        }

        cell.appendChild(input);
        board.appendChild(cell);
    });
}

function checkLevel1() {
    const input = document.getElementById('ans-1');
    const value = input.value.trim();

    // La suma correcta de los impares en celdas lilas es 25
    if (value === "18") {
        nextLevel('level-1', 'level-2');
    } else {
        alert("Ups, el cálculo no es correcto. Recuerda: suma solo los IMPARES de las casillas destacadas. ✨");
        input.value = ""; 
        input.focus();
    }
}

/* =========================================
   NIVEL 2: EL ACERTIJO
   ========================================= */

function checkLevel2() {
    const input = document.getElementById('ans-2');
    const value = input.value.toLowerCase().trim();

    // Aceptamos variaciones de la respuesta correcta
    if (value.includes("agujero")) {
        nextLevel('level-2', 'level-3');
    } else {
        alert("Frío, frío... Es algo físico, pero no puedes tocarlo. 🤔");
        input.focus();
    }
}

/* =========================================
   NIVEL 3: EL DETECTIVE
   ========================================= */

function checkLevel3(isCorrect) {
    const errorMsg = document.getElementById('error-3');

    if (isCorrect) {
        // La respuesta correcta es La Criada (no hay correo los domingos)
        nextLevel('level-3', 'level-4');
    } else {
        errorMsg.innerText = "Esa coartada parece sólida... Intenta con otro sospechoso.";
        
        // Efecto visual: borrar mensaje tras 3 segundos
        setTimeout(() => {
            if(errorMsg) errorMsg.innerText = "";
        }, 3000);
    }
}

/* =========================================
   NIVEL 4: CÓDIGO FINAL (BACKEND)
   ========================================= */

async function checkFinalCode() {
    const input = document.getElementById('final-code');
    const errorMsg = document.getElementById('final-error');
    const btn = document.querySelector('#level-4 button');

    const originalBtnText = btn.innerText;

    // Estado de carga
    btn.innerText = "Verificando...";
    btn.disabled = true;
    errorMsg.innerText = "";

    try {
        const response = await fetch('/check-final-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: input.value })
        });

        const data = await response.json();

        if (data.success) {
            nextLevel('level-4', 'reward');
            // Aquí podrías lanzar confeti si quisieras más adelante
        } else {
            errorMsg.innerText = "Código incorrecto. ¡Busca bien!";
            btn.innerText = originalBtnText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        errorMsg.innerText = "Hubo un error de conexión con el servidor.";
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
}

/* =========================================
   UTILIDADES
   ========================================= */

function setupEnterKey(inputId, actionFunction) {
    const el = document.getElementById(inputId);
    if (el) {
        el.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                actionFunction();
            }
        });
    }
}