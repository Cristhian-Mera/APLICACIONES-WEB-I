// OBJETO CON USUARIOS DEL SISTEMA
const users = {
  "estudiante@uleam.edu.ec": { type: "student", name: "Cristhian Mera", password: "123456" },
  "admin@uleam.edu.ec": { type: "admin", name: "Admin ULEAM", password: "123456" },
}

// FUNCIÓN PARA CAMBIAR TIPO DE USUARIO
function selectUserType(type) {
  // Remover clase 'active' de todos los botones
  document.querySelectorAll(".user-type-btn").forEach((btn) => btn.classList.remove("active"))
  // Activar el botón seleccionado
  document.querySelector(`[data-type="${type}"]`).classList.add("active")
  // Cambiar el email automáticamente según el tipo
  document.getElementById("email").value = type === "student" ? "estudiante@uleam.edu.ec" : "admin@uleam.edu.ec"
}

// INICIALIZACIÓN CUANDO LA PÁGINA CARGA
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar "estudiante" por defecto
  selectUserType("student")

  // MANEJAR ENVÍO DEL FORMULARIO DE LOGIN
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault() // Prevenir envío normal

    // Obtener valores de los campos
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    // BUSCAR USUARIO EN EL OBJETO 'users'
    const user = users[email]

    // VALIDAR CREDENCIALES
    if (user && user.password === password) {
      // GUARDAR SESIÓN en localStorage
      localStorage.setItem("currentUser", JSON.stringify({ email, name: user.name, type: user.type }))
      // REDIRECCIONAR según tipo de usuario
      window.location.href = user.type === "admin" ? "admin-dashboard.html" : "student-dashboard.html"
    } else {
      // MOSTRAR ERROR
      alert("Credenciales incorrectas")
    }
  })
})