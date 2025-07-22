// Variables globales
const form = document.getElementById("todo-form")
const taskInput = document.getElementById("new-task")
const taskList = document.getElementById("task-list")
const emptyState = document.getElementById("empty-state")

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch((err) => console.log("❌ Error en SW:", err))
}

// Detectar cuando se instala la PWA
window.addEventListener("appinstalled", () => {
  console.log("🎉 ¡PWA instalada exitosamente!")
  alert("¡App instalada correctamente!")
})

// Funciones de la lista de tareas
function cargarTareas() {
  const tareas = JSON.parse(localStorage.getItem("tareas")) || []
  taskList.innerHTML = ""

  if (tareas.length === 0) {
    emptyState.style.display = "block"
  } else {
    emptyState.style.display = "none"
    tareas.forEach((tarea) => {
      const li = document.createElement("li")
      li.innerHTML = `
        <span>${tarea}</span>
        <button class="delete-btn" onclick="eliminarTarea('${tarea}')">🗑️</button>
      `
      taskList.appendChild(li)
    })
  }
}

function eliminarTarea(tarea) {
  let tareas = JSON.parse(localStorage.getItem("tareas")) || []
  tareas = tareas.filter((t) => t !== tarea)
  localStorage.setItem("tareas", JSON.stringify(tareas))
  cargarTareas()
}

// Manejar envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault()
  const tarea = taskInput.value.trim()

  if (tarea) {
    const tareas = JSON.parse(localStorage.getItem("tareas")) || []
    tareas.push(tarea)
    localStorage.setItem("tareas", JSON.stringify(tareas))
    taskInput.value = ""
    cargarTareas()
  }
})

// Cargar tareas al iniciar
cargarTareas()
