// Array de estudiantes registrados en el sistema
const students = [
  {
    id: 1,
    name: "Cristhian Mera",
    email: "estudiante@uleam.edu.ec",
    career: "Psicología",
    room: null, // Habitación asignada (null = sin asignar)
    status: "pending", // Estado del estudiante
  },
  { id: 2, name: "Carlos Pérez", email: "carlos@uleam.edu.ec", career: "Medicina", room: "S201", status: "active" },
]

// Array de habitaciones disponibles en el sistema
const rooms = JSON.parse(localStorage.getItem("rooms")) || [
  { id: "N101", type: "Individual", student: null, status: "available" },
  { id: "N102", type: "Individual", student: null, status: "available" },
  { id: "S201", type: "Compartida", student: "Carlos Pérez", status: "occupied" },
  { id: "S202", type: "Compartida", student: null, status: "available" },
  { id: "P301", type: "Suite", student: null, status: "available" },
]

// Array de solicitudes de residencia
const applications = JSON.parse(localStorage.getItem("applications")) || []

//INICIALIZACIÓN DEL DASHBOARD DE ADMINISTRADOR
document.addEventListener("DOMContentLoaded", () => {
  // Obtener usuario actual desde localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))

  // VERIFICAR AUTENTICACIÓN DE ADMINISTRADOR
  if (!currentUser || currentUser.type !== "admin") {
    window.location.href = "index.html"
    return
  }

  // Cargar todos los datos iniciales
  updateStats() // Actualizar estadísticas
  loadApplications() // Cargar tabla de solicitudes
  loadStudents() // Cargar tabla de estudiantes
  loadRooms() // Cargar tabla de habitaciones
})

// FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS
// Calcula y muestra estadísticas generales del sistema
function updateStats() {
  // Contar total de habitaciones
  document.getElementById("totalRooms").textContent = rooms.length

  // Contar total de estudiantes
  document.getElementById("totalStudents").textContent = students.length

  // Contar solicitudes pendientes usando filter()
  document.getElementById("pendingApplications").textContent = applications.filter(
    (app) => app.status === "pending",
  ).length
}

// FUNCIÓN PARA CAMBIAR PESTAÑAS
// Maneja la navegación entre diferentes secciones del dashboard
function showTab(tabName) {
  // Remover clase 'active' de todas las pestañas
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))

  // Activar pestaña seleccionada
  document.getElementById(tabName).classList.add("active")
  event.target.classList.add("active")
}

// FUNCIÓN PARA CARGAR SOLICITUDES
// Muestra todas las solicitudes en una tabla con opciones de gestión
function loadApplications() {
  const tbody = document.getElementById("applicationsTable")

  // Si no hay solicitudes, mostrar mensaje
  tbody.innerHTML =
    applications.length === 0
      ? '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay solicitudes registradas</td></tr>'
      : // Usar map() para transformar cada solicitud en una fila de tabla
        applications
          .map(
            (app) => `
      <tr>
        <td>${app.studentName}</td>
        <td>${app.career}</td>
        <td>${app.gpa}</td>
        <td>${getRoomTypeName(app.residenceType)}</td>
        <td><span class="status status-${app.status}">${getStatusText(app.status)}</span></td>
        <td>
          ${
            // Mostrar botones diferentes según el estado de la solicitud
            app.status === "pending"
              ? `<button class="btn btn-success btn-small" onclick="approveApplication(${app.id})" style="margin-right: 0.5rem;">Aprobar</button>
             <button class="btn btn-danger btn-small" onclick="rejectApplication(${app.id})">Rechazar</button>`
              : `<button class="btn btn-outline btn-small" onclick="viewApplication(${app.id})">Ver</button>`
          }
        </td>
      </tr>
    `,
          )
          .join("") // Unir todas las filas en un string
}

// FUNCIÓN PARA VER DETALLES DE SOLICITUD
// Muestra información completa de una solicitud específica
function viewApplication(appId) {
  // Usar find() para buscar la solicitud por ID
  const app = applications.find((a) => a.id === appId)
  if (!app) return

  // Mostrar todos los detalles en un alert
  alert(
    `Detalles de la Solicitud:\n\nEstudiante: ${app.studentName}\nEmail: ${app.studentEmail}\nCarrera: ${app.career}\nSemestre: ${app.semester}°\nPromedio: ${app.gpa}\nResidencia: ${getRoomTypeName(app.residenceType)}\nTeléfono: ${app.phone}\nContacto de Emergencia: ${app.emergencyContact}\nFecha: ${app.date}\nEstado: ${getStatusText(app.status)}\n\nMotivación:\n${app.motivation}`,
  )
}

// FUNCIÓN PARA CARGAR ESTUDIANTES
// Muestra tabla de estudiantes registrados con opciones de gestión
function loadStudents() {
  const tbody = document.getElementById("studentsTable")

  tbody.innerHTML =
    students.length === 0
      ? '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay estudiantes registrados</td></tr>'
      : // Usar map() para crear filas de la tabla
        students
          .map(
            (student) => `
      <tr>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.room || "Sin asignar"}</td>
        <td><span class="status status-${student.status === "active" ? "approved" : "pending"}">${student.status === "active" ? "Activo" : "Pendiente"}</span></td>
        <td>
          <button class="btn btn-outline btn-small" onclick="editStudent(${student.id})" style="margin-right: 0.5rem;">Editar</button>
          ${!student.room ? `<button class="btn btn-success btn-small" onclick="showAssignRoomModal(${student.id})" style="margin-right: 0.5rem;">Asignar Habitación</button>` : ""}
          <button class="btn btn-danger btn-small" onclick="deleteStudent(${student.id})">Eliminar</button>
        </td>
      </tr>
    `,
          )
          .join("")
}

// FUNCIÓN PARA CARGAR HABITACIONES
// Muestra tabla de habitaciones con su estado actual
function loadRooms() {
  const tbody = document.getElementById("roomsTable")

  tbody.innerHTML =
    rooms.length === 0
      ? '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay habitaciones registradas</td></tr>'
      : // Usar map() para crear filas de habitaciones
        rooms
          .map(
            (room) => `
      <tr>
        <td>${room.id}</td>
        <td>${room.type}</td>
        <td>${room.student || "Disponible"}</td>
        <td><span class="status status-${room.status === "available" ? "available" : "occupied"}">${room.status === "available" ? "Disponible" : "Ocupada"}</span></td>
        <td>
          ${
            // Botones diferentes según el estado de la habitación
            room.status === "occupied"
              ? `<button class="btn btn-outline btn-small" onclick="liberateRoom('${room.id}')">Liberar</button>`
              : `<button class="btn btn-danger btn-small" onclick="deleteRoom('${room.id}')">Eliminar</button>`
          }
        </td>
      </tr>
    `,
          )
          .join("")
}

// FUNCIÓN PARA APROBAR SOLICITUD
// Aprueba una solicitud y permite asignar habitación
function approveApplication(appId) {
  // Buscar la solicitud usando find()
  const app = applications.find((a) => a.id === appId)
  if (!app || !confirm(`¿Aprobar solicitud de ${app.studentName}?`)) return

  // Cambiar estado a aprobado
  app.status = "approved"
  localStorage.setItem("applications", JSON.stringify(applications))

  // Buscar o crear estudiante
  let student = students.find((s) => s.email === app.studentEmail)
  if (!student) {
    // Si no existe, crear nuevo estudiante usando push()
    student = {
      id: Date.now(),
      name: app.studentName,
      email: app.studentEmail,
      career: app.career,
      room: null,
      status: "pending",
    }
    students.push(student)
  }

  // Mostrar modal para asignar habitación
  showAssignRoomModal(student.id)
  updateStats()
  loadApplications()
  loadStudents()
}

// FUNCIÓN PARA RECHAZAR SOLICITUD
function rejectApplication(appId) {
  const app = applications.find((a) => a.id === appId)
  if (!app || !confirm(`¿Rechazar solicitud de ${app.studentName}?`)) return

  app.status = "rejected"
  localStorage.setItem("applications", JSON.stringify(applications))
  alert("Solicitud rechazada")
  updateStats()
  loadApplications()
}

// FUNCIÓN PARA MOSTRAR MODAL DE ASIGNACIÓN DE HABITACIÓN
function showAssignRoomModal(studentId) {
  // Buscar estudiante usando find()
  const student = students.find((s) => s.id === studentId)
  if (!student) return

  // Llenar datos del estudiante en el modal
  document.getElementById("assignStudentId").value = student.id
  document.getElementById("assignStudentName").value = student.name

  // Llenar select con habitaciones disponibles usando filter() y map()
  const roomSelect = document.getElementById("assignRoomSelect")
  roomSelect.innerHTML =
    '<option value="">Selecciona una habitación</option>' +
    rooms
      .filter((room) => room.status === "available") // Filtrar solo disponibles
      .map((room) => `<option value="${room.id}">${room.id} - ${room.type}</option>`) // Mapear a opciones
      .join("")

  // Mostrar modal
  document.getElementById("assignRoomModal").classList.add("active")
}

// Cerrar modal de asignación
function closeAssignRoomModal() {
  document.getElementById("assignRoomModal").classList.remove("active")
  document.getElementById("assignRoomForm").reset()
}

// FUNCIONES PARA MANEJAR MODALES
function addStudent() {
  document.getElementById("addStudentModal").classList.add("active")
}
function closeAddStudentModal() {
  document.getElementById("addStudentModal").classList.remove("active")
  document.getElementById("addStudentForm").reset()
}
function addRoom() {
  document.getElementById("addRoomModal").classList.add("active")
}
function closeAddRoomModal() {
  document.getElementById("addRoomModal").classList.remove("active")
  document.getElementById("addRoomForm").reset()
}

// FUNCIONES CRUD PARA ESTUDIANTES
function editStudent(studentId) {
  const student = students.find((s) => s.id === studentId)
  if (!student) return

  const newName = prompt("Nuevo nombre:", student.name)
  if (newName && newName.trim()) {
    student.name = newName.trim()
    loadStudents()
    alert("Estudiante actualizado")
  }
}

function deleteStudent(studentId) {
  const student = students.find((s) => s.id === studentId)
  if (!student || !confirm(`¿Eliminar estudiante ${student.name}?`)) return

  // Si tiene habitación asignada, liberarla
  if (student.room) {
    const room = rooms.find((r) => r.id === student.room)
    if (room) {
      room.student = null
      room.status = "available"
      localStorage.setItem("rooms", JSON.stringify(rooms))
    }
  }

  // Eliminar estudiante usando splice() y findIndex()
  students.splice(
    students.findIndex((s) => s.id === studentId),
    1,
  )
  loadStudents()
  loadRooms()
  updateStats()
  alert("Estudiante eliminado")
}

// FUNCIONES CRUD PARA HABITACIONES
function liberateRoom(roomId) {
  const room = rooms.find((r) => r.id === roomId)
  if (!room || !confirm(`¿Liberar habitación ${roomId}?`)) return

  // Encontrar estudiante asignado y actualizar su estado
  const student = students.find((s) => s.room === roomId)
  if (student) {
    student.room = null
    student.status = "pending"
  }

  // Liberar habitación
  room.student = null
  room.status = "available"
  localStorage.setItem("rooms", JSON.stringify(rooms))

  loadRooms()
  loadStudents()
  updateStats()
  alert("Habitación liberada")
}

function deleteRoom(roomId) {
  if (!confirm(`¿Eliminar habitación ${roomId}?`)) return

  // Eliminar usando splice() y findIndex()
  rooms.splice(
    rooms.findIndex((r) => r.id === roomId),
    1,
  )
  localStorage.setItem("rooms", JSON.stringify(rooms))
  loadRooms()
  updateStats()
  alert("Habitación eliminada")
}

// EVENT LISTENERS PARA FORMULARIOS

// Formulario de asignación de habitación
document.getElementById("assignRoomForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const studentId = Number.parseInt(document.getElementById("assignStudentId").value)
  const roomId = document.getElementById("assignRoomSelect").value

  if (!roomId) return alert("Selecciona una habitación")

  // Buscar estudiante y habitación usando find()
  const student = students.find((s) => s.id === studentId)
  const room = rooms.find((r) => r.id === roomId)

  if (!student || !room) return alert("Error al asignar habitación")

  // Realizar asignación
  room.student = student.name
  room.status = "occupied"
  student.room = roomId
  student.status = "active"

  localStorage.setItem("rooms", JSON.stringify(rooms))
  closeAssignRoomModal()
  loadStudents()
  loadRooms()
  updateStats()
  alert(`Habitación ${roomId} asignada a ${student.name}`)
})

// Formulario para agregar estudiante
document.getElementById("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("studentName").value.trim()
  const email = document.getElementById("studentEmail").value.trim()
  const career = document.getElementById("studentCareer").value

  // Validaciones
  if (!name || !email || !career) return alert("Completa todos los campos")

  // Verificar email duplicado usando find()
  if (students.find((s) => s.email === email)) return alert("Ya existe un estudiante con ese email")

  // Agregar nuevo estudiante usando push()
  students.push({ id: Date.now(), name, email, career, room: null, status: "pending" })
  loadStudents()
  updateStats()
  closeAddStudentModal()
  alert("Estudiante agregado correctamente")
})

// Formulario para agregar habitación
document.getElementById("addRoomForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const number = document.getElementById("roomNumber").value.trim().toUpperCase()
  const type = document.getElementById("roomType").value

  // Validaciones
  if (!number || !type) return alert("Completa todos los campos")

  // Verificar habitación duplicada usando find()
  if (rooms.find((r) => r.id === number)) return alert("Ya existe una habitación con ese número")

  // Agregar nueva habitación usando push()
  rooms.push({ id: number, type, student: null, status: "available" })
  localStorage.setItem("rooms", JSON.stringify(rooms))
  loadRooms()
  updateStats()
  closeAddRoomModal()
  alert("Habitación agregada correctamente")
})

// FUNCIÓN PARA CERRAR SESIÓN
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// CERRAR MODALES AL HACER CLIC FUERA
document.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach((modal) => {
    if (e.target === modal) modal.classList.remove("active")
  })
})

// FUNCIONES UTILITARIAS
function getRoomTypeName(type) {
  const names = { norte: "Complejo Norte", sur: "Complejo Sur", premium: "Complejo Premium" }
  return names[type] || type
}

function getStatusText(status) {
  const texts = { pending: "Pendiente", approved: "Aprobada", rejected: "Rechazada" }
  return texts[status] || status
}
