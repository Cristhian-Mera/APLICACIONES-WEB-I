// Script para el dashboard(panel) de estudiante
const applications = JSON.parse(localStorage.getItem("applications")) || []
const rooms = JSON.parse(localStorage.getItem("rooms")) || [
  { id: "N101", type: "norte", student: null, status: "available" },
  { id: "N102", type: "norte", student: null, status: "available" },
  { id: "S201", type: "sur", student: "Carlos Pérez", status: "occupied" },
  { id: "S202", type: "sur", student: null, status: "available" },
  { id: "P301", type: "premium", student: null, status: "available" },
]

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.type !== "student") {
    window.location.href = "index.html"
    return
  }
  document.getElementById("welcomeMessage").textContent = `Bienvenido, ${currentUser.name}`
  loadStudentInfo(currentUser)
})

// Cargar información del estudiante
function loadStudentInfo(user) {
  const existingApplication = applications.find((app) => app.studentEmail === user.email && app.status === "pending")
  if (existingApplication) document.getElementById("applyBtn").style.display = "none"

  // Información de habitación
  const userRoom = rooms.find((room) => room.student === user.name)
  const roomInfo = document.getElementById("roomInfo")

  if (userRoom) {
    roomInfo.innerHTML = `
      <div class="info-item"><strong>Habitación:</strong> <span>${userRoom.id}</span></div>
      <div class="info-item"><strong>Tipo:</strong> <span>${getRoomTypeName(userRoom.type)}</span></div>
      <div class="info-item"><strong>Estado:</strong> <span class="status status-approved">Asignada</span></div>
    `
    document.getElementById("applyBtn").style.display = "none"
  } else {
    roomInfo.innerHTML = `
      <div class="info-item"><strong>Estado:</strong> <span class="status status-pending">Sin habitación asignada</span></div>
      <div class="info-item" style="border: none;"><em style="color: var(--text-muted);">Solicita una residencia para obtener tu habitación</em></div>
    `
  }

  // Información de solicitud
  const userApplication = applications.find((app) => app.studentEmail === user.email)
  const applicationInfo = document.getElementById("applicationInfo")

  if (userApplication) {
    applicationInfo.innerHTML = `
      <div class="info-item"><strong>Residencia:</strong> <span>${getRoomTypeName(userApplication.residenceType)}</span></div>
      <div class="info-item"><strong>Promedio:</strong> <span>${userApplication.gpa}</span></div>
      <div class="info-item"><strong>Estado:</strong> <span class="status status-${userApplication.status}">${getStatusText(userApplication.status)}</span></div>
      <div class="info-item"><strong>Fecha:</strong> <span>${userApplication.date}</span></div>
    `
  } else {
    applicationInfo.innerHTML =
      '<div class="info-item" style="border: none;"><em style="color: var(--text-muted);">No tienes solicitudes activas</em></div>'
  }
}

// Modales
function applyForResidence() {
  document.getElementById("applicationModal").classList.add("active")
}
function closeApplicationModal() {
  document.getElementById("applicationModal").classList.remove("active")
  document.getElementById("applicationForm").reset()
}

// Contactar soporte
function contactSupport() {
  alert(
    `Contacta con soporte:\n\n📧 Email: residencias@uleam.edu.ec\n📞 Teléfono: (05) 2623-740\n🕒 Horario: Lunes a Viernes 8:00 - 17:00`,
  )
}

// Formulario de solicitud
document.getElementById("applicationForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  const career = document.getElementById("career").value
  const semester = document.getElementById("semester").value
  const gpa = Number.parseFloat(document.getElementById("gpa").value)
  const residenceType = document.getElementById("residenceType").value
  const phone = document.getElementById("phone").value
  const emergencyContact = document.getElementById("emergencyContact").value
  const motivation = document.getElementById("motivation").value
  const terms = document.getElementById("terms").checked

  if (!terms) return alert("Debes aceptar los términos y condiciones")
  if (motivation.length < 20) return alert("La motivación debe tener al menos 20 caracteres")

  const requirements = { norte: 8.5, sur: 7.5, premium: 9.0 }
  if (gpa < requirements[residenceType]) {
    return alert(
      `Tu promedio (${gpa}) no cumple el requisito mínimo (${requirements[residenceType]}) para esta residencia`,
    )
  }

  const application = {
    id: Date.now(),
    studentName: currentUser.name,
    studentEmail: currentUser.email,
    career,
    semester,
    gpa,
    residenceType,
    phone,
    emergencyContact,
    motivation,
    date: new Date().toLocaleDateString(),
    status: "pending",
  }

  applications.push(application)
  localStorage.setItem("applications", JSON.stringify(applications))
  alert("¡Solicitud enviada correctamente!")
  closeApplicationModal()
  loadStudentInfo(currentUser)
})

// Utilidades
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (e.target === modal) modal.classList.remove("active")
  })
})

function getRoomTypeName(type) {
  const names = { norte: "Complejo Norte", sur: "Complejo Sur", premium: "Complejo Premium" }
  return names[type] || type
}

function getStatusText(status) {
  const texts = { pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada" }
  return texts[status] || status
}