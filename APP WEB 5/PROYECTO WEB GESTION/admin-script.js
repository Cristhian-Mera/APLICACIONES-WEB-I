// Script para el dashboard(panel) de administrador
const students = [
  {
    id: 1,
    name: "Cristhian Mera",
    email: "estudiante@uleam.edu.ec",
    career: "Psicología",
    room: null,
    status: "pending",
  },
  { id: 2, name: "Carlos Pérez", email: "carlos@uleam.edu.ec", career: "Medicina", room: "S201", status: "active" },
]

const rooms = JSON.parse(localStorage.getItem("rooms")) || [
  { id: "N101", type: "Individual", student: null, status: "available" },
  { id: "N102", type: "Individual", student: null, status: "available" },
  { id: "S201", type: "Compartida", student: "Carlos Pérez", status: "occupied" },
  { id: "S202", type: "Compartida", student: null, status: "available" },
  { id: "P301", type: "Suite", student: null, status: "available" },
]

const applications = JSON.parse(localStorage.getItem("applications")) || []

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.type !== "admin") {
    window.location.href = "index.html"
    return
  }
  updateStats()
  loadApplications()
  loadStudents()
  loadRooms()
})

// Actualizar estadísticas
function updateStats() {
  document.getElementById("totalRooms").textContent = rooms.length
  document.getElementById("totalStudents").textContent = students.length
  document.getElementById("pendingApplications").textContent = applications.filter(
    (app) => app.status === "pending",
  ).length
}

// Cambiar pestañas
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
  document.getElementById(tabName).classList.add("active")
  event.target.classList.add("active")
}

// Cargar solicitudes
function loadApplications() {
  const tbody = document.getElementById("applicationsTable")
  tbody.innerHTML =
    applications.length === 0
      ? '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay solicitudes registradas</td></tr>'
      : applications
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
            app.status === "pending"
              ? `<button class="btn btn-success btn-small" onclick="approveApplication(${app.id})" style="margin-right: 0.5rem;">Aprobar</button>
             <button class="btn btn-danger btn-small" onclick="rejectApplication(${app.id})">Rechazar</button>`
              : `<button class="btn btn-outline btn-small" onclick="viewApplication(${app.id})">Ver</button>`
          }
        </td>
      </tr>
    `,
          )
          .join("")
}

// Ver solicitud
function viewApplication(appId) {
  const app = applications.find((a) => a.id === appId)
  if (!app) return
  alert(
    `Detalles de la Solicitud:\n\nEstudiante: ${app.studentName}\nEmail: ${app.studentEmail}\nCarrera: ${app.career}\nSemestre: ${app.semester}°\nPromedio: ${app.gpa}\nResidencia: ${getRoomTypeName(app.residenceType)}\nTeléfono: ${app.phone}\nContacto de Emergencia: ${app.emergencyContact}\nFecha: ${app.date}\nEstado: ${getStatusText(app.status)}\n\nMotivación:\n${app.motivation}`,
  )
}

// Cargar estudiantes
function loadStudents() {
  const tbody = document.getElementById("studentsTable")
  tbody.innerHTML =
    students.length === 0
      ? '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay estudiantes registrados</td></tr>'
      : students
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

// Cargar habitaciones
function loadRooms() {
  const tbody = document.getElementById("roomsTable")
  tbody.innerHTML =
    rooms.length === 0
      ? '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No hay habitaciones registradas</td></tr>'
      : rooms
          .map(
            (room) => `
      <tr>
        <td>${room.id}</td>
        <td>${room.type}</td>
        <td>${room.student || "Disponible"}</td>
        <td><span class="status status-${room.status === "available" ? "available" : "occupied"}">${room.status === "available" ? "Disponible" : "Ocupada"}</span></td>
        <td>
          ${
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

// Aprobar solicitud
function approveApplication(appId) {
  const app = applications.find((a) => a.id === appId)
  if (!app || !confirm(`¿Aprobar solicitud de ${app.studentName}?`)) return

  app.status = "approved"
  localStorage.setItem("applications", JSON.stringify(applications))

  let student = students.find((s) => s.email === app.studentEmail)
  if (!student) {
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

  showAssignRoomModal(student.id)
  updateStats()
  loadApplications()
  loadStudents()
}

// Rechazar solicitud
function rejectApplication(appId) {
  const app = applications.find((a) => a.id === appId)
  if (!app || !confirm(`¿Rechazar solicitud de ${app.studentName}?`)) return

  app.status = "rejected"
  localStorage.setItem("applications", JSON.stringify(applications))
  alert("Solicitud rechazada")
  updateStats()
  loadApplications()
}

// Modal asignar habitación
function showAssignRoomModal(studentId) {
  const student = students.find((s) => s.id === studentId)
  if (!student) return

  document.getElementById("assignStudentId").value = student.id
  document.getElementById("assignStudentName").value = student.name

  const roomSelect = document.getElementById("assignRoomSelect")
  roomSelect.innerHTML =
    '<option value="">Selecciona una habitación</option>' +
    rooms
      .filter((room) => room.status === "available")
      .map((room) => `<option value="${room.id}">${room.id} - ${room.type}</option>`)
      .join("")

  document.getElementById("assignRoomModal").classList.add("active")
}

function closeAssignRoomModal() {
  document.getElementById("assignRoomModal").classList.remove("active")
  document.getElementById("assignRoomForm").reset()
}

// Modales
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

// CRUD Estudiantes
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

  if (student.room) {
    const room = rooms.find((r) => r.id === student.room)
    if (room) {
      room.student = null
      room.status = "available"
      localStorage.setItem("rooms", JSON.stringify(rooms))
    }
  }

  students.splice(
    students.findIndex((s) => s.id === studentId),
    1,
  )
  loadStudents()
  loadRooms()
  updateStats()
  alert("Estudiante eliminado")
}

// CRUD Habitaciones
function liberateRoom(roomId) {
  const room = rooms.find((r) => r.id === roomId)
  if (!room || !confirm(`¿Liberar habitación ${roomId}?`)) return

  const student = students.find((s) => s.room === roomId)
  if (student) {
    student.room = null
    student.status = "pending"
  }

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
  rooms.splice(
    rooms.findIndex((r) => r.id === roomId),
    1,
  )
  localStorage.setItem("rooms", JSON.stringify(rooms))
  loadRooms()
  updateStats()
  alert("Habitación eliminada")
}

// Formularios
document.getElementById("assignRoomForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const studentId = Number.parseInt(document.getElementById("assignStudentId").value)
  const roomId = document.getElementById("assignRoomSelect").value

  if (!roomId) return alert("Selecciona una habitación")

  const student = students.find((s) => s.id === studentId)
  const room = rooms.find((r) => r.id === roomId)

  if (!student || !room) return alert("Error al asignar habitación")

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

document.getElementById("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const name = document.getElementById("studentName").value.trim()
  const email = document.getElementById("studentEmail").value.trim()
  const career = document.getElementById("studentCareer").value

  if (!name || !email || !career) return alert("Completa todos los campos")
  if (students.find((s) => s.email === email)) return alert("Ya existe un estudiante con ese email")

  students.push({ id: Date.now(), name, email, career, room: null, status: "pending" })
  loadStudents()
  updateStats()
  closeAddStudentModal()
  alert("Estudiante agregado correctamente")
})

document.getElementById("addRoomForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const number = document.getElementById("roomNumber").value.trim().toUpperCase()
  const type = document.getElementById("roomType").value

  if (!number || !type) return alert("Completa todos los campos")
  if (rooms.find((r) => r.id === number)) return alert("Ya existe una habitación con ese número")

  rooms.push({ id: number, type, student: null, status: "available" })
  localStorage.setItem("rooms", JSON.stringify(rooms))
  loadRooms()
  updateStats()
  closeAddRoomModal()
  alert("Habitación agregada correctamente")
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