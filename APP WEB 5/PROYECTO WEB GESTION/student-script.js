// ARRAY DE SOLICITUDES (datos compartidos con admin)
// Almacena todas las solicitudes de residencia del sistema
const applications = JSON.parse(localStorage.getItem("applications")) || []

// ARRAY DE HABITACIONES DISPONIBLES
// Lista de todas las habitaciones del sistema con su información
const rooms = JSON.parse(localStorage.getItem("rooms")) || [
  { id: "N101", type: "norte", student: null, status: "available" },
  { id: "N102", type: "norte", student: null, status: "available" },
  { id: "S201", type: "sur", student: "Carlos Pérez", status: "occupied" },
  { id: "S202", type: "sur", student: null, status: "available" },
  { id: "P301", type: "premium", student: null, status: "available" },
]

// Requisitos mínimos por residencia
const residenceRequirements = {
  norte: 8.5,
  sur: 7.5,
  premium: 9.0,
}

// Nombres de residencias
const residenceNames = {
  norte: "Complejo Norte",
  sur: "Complejo Sur",
  premium: "Complejo Premium",
}

// INICIALIZACIÓN DEL DASHBOARD DE ESTUDIANTE
document.addEventListener("DOMContentLoaded", () => {
  // Obtener información del usuario actual desde localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // VERIFICAR AUTENTICACIÓN
  // Si no hay usuario o no es estudiante, redirigir al login
  if (!currentUser || currentUser.type !== "student") {
    window.location.href = "index.html"
    return
  }

  // Mostrar mensaje de bienvenida personalizado
  document.getElementById("welcomeMessage").textContent = `Bienvenido, ${currentUser.name}`

  // Cargar información específica del estudiante
  loadStudentInfo(currentUser)
})

// FUNCIÓN PARA CARGAR INFORMACIÓN DEL ESTUDIANTE
// Muestra el estado de habitación y solicitudes del estudiante actual
function loadStudentInfo(user) {
  // BUSCAR SOLICITUD PENDIENTE DEL USUARIO
  // Usar find() para buscar si el estudiante tiene una solicitud pendiente
  const existingApplication = applications.find((app) => app.studentEmail === user.email && app.status === "pending")

  // Si tiene solicitud pendiente, ocultar botón de "Solicitar"
  if (existingApplication) document.getElementById("applyBtn").style.display = "none"

  // INFORMACIÓN DE HABITACIÓN
  // Buscar si el estudiante tiene habitación asignada
  const userRoom = rooms.find((room) => room.student === user.name)
  const roomInfo = document.getElementById("roomInfo")

  if (userRoom) {
    // ESTUDIANTE TIENE HABITACIÓN ASIGNADA
    roomInfo.innerHTML = `
      <div class="info-item"><strong>Habitación:</strong> <span>${userRoom.id}</span></div>
      <div class="info-item"><strong>Tipo:</strong> <span>${getRoomTypeName(userRoom.type)}</span></div>
      <div class="info-item"><strong>Estado:</strong> <span class="status status-approved">Asignada</span></div>
    `
    // Ocultar botón de solicitar si ya tiene habitación
    document.getElementById("applyBtn").style.display = "none"
  } else {
    // ESTUDIANTE SIN HABITACIÓN
    roomInfo.innerHTML = `
      <div class="info-item"><strong>Estado:</strong> <span class="status status-pending">Sin habitación asignada</span></div>
      <div class="info-item" style="border: none;"><em style="color: var(--text-muted);">Solicita una residencia para obtener tu habitación</em></div>
    `
  }

  // INFORMACIÓN DE SOLICITUD
  // Buscar cualquier solicitud del usuario (pendiente, aprobada o rechazada)
  const userApplication = applications.find((app) => app.studentEmail === user.email)
  const applicationInfo = document.getElementById("applicationInfo")

  if (userApplication) {
    // USUARIO TIENE SOLICITUD
    applicationInfo.innerHTML = `
      <div class="info-item"><strong>Residencia:</strong> <span>${getRoomTypeName(userApplication.residenceType)}</span></div>
      <div class="info-item"><strong>Promedio:</strong> <span>${userApplication.gpa}</span></div>
      <div class="info-item"><strong>Estado:</strong> <span class="status status-${userApplication.status}">${getStatusText(userApplication.status)}</span></div>
      <div class="info-item"><strong>Fecha:</strong> <span>${userApplication.date}</span></div>
    `
  } else {
    // USUARIO SIN SOLICITUDES
    applicationInfo.innerHTML =
      '<div class="info-item" style="border: none;"><em style="color: var(--text-muted);">No tienes solicitudes activas</em></div>'
  }
}

// Validaciones del formulario
function validateApplicationForm(formData) {
  const errors = []

  // Validar campos requeridos
  if (!formData.career) errors.push("Selecciona una carrera")
  if (!formData.semester) errors.push("Selecciona un semestre")
  if (!formData.gpa || formData.gpa < 0 || formData.gpa > 10) {
    errors.push("El promedio debe estar entre 0 y 10")
  }
  if (!formData.residenceType) errors.push("Selecciona una residencia")
  if (!formData.phone) errors.push("Ingresa tu teléfono")
  if (!formData.emergencyContact) errors.push("Ingresa un contacto de emergencia")
  if (!formData.motivation || formData.motivation.length < 20) {
    errors.push("La motivación debe tener al menos 20 caracteres")
  }

  // Validar requisitos de promedio
  if (formData.residenceType && formData.gpa < residenceRequirements[formData.residenceType]) {
    errors.push(
      `Tu promedio (${formData.gpa}) no cumple el requisito mínimo (${residenceRequirements[formData.residenceType]}) para esta residencia`,
    )
  }

  // Validar teléfono (formato básico)
  const phoneRegex = /^[0-9]{10}$/
  if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
    errors.push("El teléfono debe tener 10 dígitos")
  }

  return errors
}

// FUNCIONES PARA MANEJAR MODALES
// Abrir modal de solicitud de residencia
function applyForResidence() {
  document.getElementById("applicationModal").classList.add("active")
}

// Cerrar modal y limpiar formulario
function closeApplicationModal() {
  document.getElementById("applicationModal").classList.remove("active")
  document.getElementById("applicationForm").reset()
}

// FUNCIÓN DE CONTACTO CON SOPORTE
// Muestra información de contacto en un alert
function contactSupport() {
  alert(
    `Contacta con soporte:\n\n📧 Email: residencias@uleam.edu.ec\n📞 Teléfono: (05) 2623-740\n🕒 Horario: Lunes a Viernes 8:00 - 17:00`,
  )
}

// MANEJAR ENVÍO DEL FORMULARIO DE SOLICITUD
document.getElementById("applicationForm").addEventListener("submit", (e) => {
  e.preventDefault() // Prevenir envío normal del formulario

  // Obtener información del usuario actual
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // RECOPILAR DATOS DEL FORMULARIO
  const career = document.getElementById("career").value
  const semester = Number.parseInt(document.getElementById("semester").value)
  const gpa = Number.parseFloat(document.getElementById("gpa").value)
  const residenceType = document.getElementById("residenceType").value
  const phone = document.getElementById("phone").value
  const emergencyContact = document.getElementById("emergencyContact").value
  const motivation = document.getElementById("motivation").value
  const terms = document.getElementById("terms").checked

  // VALIDACIONES DEL FORMULARIO

  // Verificar términos y condiciones
  if (!terms) return alert("Debes aceptar los términos y condiciones")

  // Validar longitud mínima de motivación
  if (motivation.length < 20) return alert("La motivación debe tener al menos 20 caracteres")

  // VALIDAR REQUISITOS DE PROMEDIO POR RESIDENCIA
  const requirements = { norte: 8.5, sur: 7.5, premium: 9.0 }
  if (gpa < requirements[residenceType]) {
    return alert(
      `Tu promedio (${gpa}) no cumple el requisito mínimo (${requirements[residenceType]}) para esta residencia`,
    )
  }

  // CREAR NUEVA SOLICITUD
  const application = {
    id: Date.now(), // ID único basado en timestamp
    studentName: currentUser.name, // Nombre del estudiante
    studentEmail: currentUser.email, // Email del estudiante
    career, // Carrera seleccionada
    semester, // Semestre actual
    gpa, // Promedio académico
    residenceType, // Tipo de residencia solicitada
    phone, // Teléfono de contacto
    emergencyContact, // Contacto de emergencia
    motivation, // Motivación escrita
    date: new Date().toLocaleDateString(), // Fecha de solicitud
    status: "pending", // Estado inicial: pendiente
  }

  // GUARDAR SOLICITUD
  // Agregar al array usando push()
  applications.push(application)
  // Guardar en localStorage para persistencia
  localStorage.setItem("applications", JSON.stringify(applications))

  //CONFIRMAR Y ACTUALIZAR VISTA
  alert("¡Solicitud enviada correctamente!")
  closeApplicationModal()
  loadStudentInfo(currentUser) // Recargar información del estudiante
})

//FUNCIÓN PARA CERRAR SESIÓN
function logout() {
  localStorage.removeItem("currentUser") // Eliminar datos de sesión
  window.location.href = "index.html" // Redirigir al login
}

//CERRAR MODALES AL HACER CLIC FUERA
document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (e.target === modal) modal.classList.remove("active")
  })
})

// FUNCIONES UTILITARIAS
// Convertir códigos de residencia a nombres legibles
function getRoomTypeName(type) {
  const names = { norte: "Complejo Norte", sur: "Complejo Sur", premium: "Complejo Premium" }
  return names[type] || type
}

// Convertir códigos de estado a texto legible
function getStatusText(status) {
  const texts = { pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada" }
  return texts[status] || status
}