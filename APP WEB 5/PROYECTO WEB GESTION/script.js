// Script para la página de login
const users = {
  "estudiante@uleam.edu.ec": { type: "student", name: "Cristhian Mera", password: "123456" },
  "admin@uleam.edu.ec": { type: "admin", name: "Admin ULEAM", password: "123456" },
}

// Cambiar tipo de usuario
function selectUserType(type) {
  document.querySelectorAll(".user-type-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[data-type="${type}"]`).classList.add("active")
  document.getElementById("email").value = type === "student" ? "estudiante@uleam.edu.ec" : "admin@uleam.edu.ec"
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  selectUserType("student")

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const user = users[email]

    if (user && user.password === password) {
      localStorage.setItem("currentUser", JSON.stringify({ email, name: user.name, type: user.type }))
      window.location.href = user.type === "admin" ? "admin-dashboard.html" : "student-dashboard.html"
    } else {
      alert("Credenciales incorrectas")
    }
  })
})
