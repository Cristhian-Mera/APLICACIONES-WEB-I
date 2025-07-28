<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div class="container">
        <div class="header-left">
          <div class="header-logo">
            <img src="/logo.png" alt="ULEAM Logo" class="dashboard-logo">
            <h1>Panel de Administración</h1>
          </div>
        </div>
        <div class="header-right">
          <span class="user-info">👨‍💼 {{ user?.fullName }}</span>
          <button class="btn btn-outline" @click="logout">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="container">
        <!-- Estadísticas -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>{{ students.length }}</h3>
              <p>Estudiantes Registrados</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>{{ applications.length }}</h3>
              <p>Solicitudes Totales</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3>{{ applications.filter(a => a.status === 'pending').length }}</h3>
              <p>Solicitudes Pendientes</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-content">
              <h3>{{ rooms.filter(r => r.occupant).length }}/{{ rooms.length }}</h3>
              <p>Habitaciones Ocupadas</p>
            </div>
          </div>
        </div>

        <!-- Pestañas -->
        <div class="tabs-container">
          <div class="tabs-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.icon }} {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- Contenido -->
        <div class="tab-content">
          <!-- Solicitudes -->
          <div v-if="activeTab === 'applications'" class="tab-panel">
            <div class="panel-header">
              <h2>📋 Gestión de Solicitudes</h2>
              <div class="panel-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchApplications" 
                    placeholder="🔍 Buscar por nombre o email..."
                    class="search-input"
                  >
                </div>
                <select v-model="filterApplicationStatus" class="filter-select">
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobadas</option>
                  <option value="rejected">Rechazadas</option>
                </select>
              </div>
            </div>

            <div v-if="filteredApplications.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>No hay solicitudes</h3>
              <p>{{ searchApplications || filterApplicationStatus ? 'No se encontraron resultados' : 'Cuando los estudiantes envíen solicitudes aparecerán aquí.' }}</p>
            </div>

            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Información Académica</th>
                    <th>Residencia</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="app in filteredApplications" :key="app.id">
                    <td>
                      <div class="student-info">
                        <strong>{{ app.studentName }}</strong>
                        <small>{{ app.studentEmail }}</small>
                        <small v-if="app.phone">📞 {{ app.phone }}</small>
                        <small v-if="app.city">📍 {{ app.city }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="academic-info">
                        <div><strong>Carrera:</strong> {{ getStudentCareer(app.studentEmail) }}</div>
                        <div v-if="app.gpa"><strong>Promedio:</strong> {{ app.gpa }}</div>
                        <div v-if="app.currentSemester"><strong>Semestre:</strong> {{ app.currentSemester }}°</div>
                      </div>
                    </td>
                    <td>
                      <div class="residence-info">
                        <div><strong>{{ helpers.getResidenceName(app.residenceType) }}</strong></div>
                        <small v-if="app.familyIncome">Ingresos: {{ formatIncome(app.familyIncome) }}</small>
                        <small v-if="app.distanceKm">Distancia: {{ app.distanceKm }}km</small>
                      </div>
                    </td>
                    <td>
                      <span :class="`status status-${app.status}`">
                        {{ helpers.getStatusText(app.status) }}
                      </span>
                    </td>
                    <td>{{ helpers.formatDate(app.submissionDate) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button 
                          class="btn btn-small btn-info" 
                          @click="viewApplicationDetails(app)"
                        >
                          👁️ Ver
                        </button>
                        <button 
                          v-if="app.status === 'pending'"
                          class="btn btn-small btn-success" 
                          @click="approveApplication(app)"
                        >
                          ✅ Aprobar
                        </button>
                        <button 
                          v-if="app.status === 'pending'"
                          class="btn btn-small btn-danger" 
                          @click="rejectApplication(app)"
                        >
                          ❌ Rechazar
                        </button>
                        <button 
                          class="btn btn-small btn-outline btn-danger" 
                          @click="deleteApplication(app)"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- Habitaciones -->
          <div v-if="activeTab === 'rooms'" class="tab-panel">
            <div class="panel-header">
              <h2>🏠 Gestión de Habitaciones</h2>
              <div class="panel-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchRooms" 
                    placeholder="🔍 Buscar habitación..."
                    class="search-input"
                  >
                </div>
                <select v-model="filterRoomType" class="filter-select">
                  <option value="">Todos los tipos</option>
                  <option value="norte">Complejo Norte</option>
                  <option value="sur">Complejo Sur</option>
                  <option value="premium">Complejo Premium</option>
                </select>
                <button class="btn btn-primary" @click="showAddRoomModal = true">
                  ➕ Nueva Habitación
                </button>
              </div>
            </div>

            <div v-if="filteredRooms.length === 0" class="empty-state">
              <div class="empty-icon">🏠</div>
              <h3>No hay habitaciones</h3>
              <p>{{ searchRooms || filterRoomType ? 'No se encontraron resultados' : 'Agrega habitaciones para comenzar a gestionar las residencias.' }}</p>
              <button v-if="!searchRooms && !filterRoomType" class="btn btn-primary" @click="showAddRoomModal = true">
                ➕ Agregar Primera Habitación
              </button>
            </div>

            <div v-else class="rooms-grid">
              <div 
                v-for="room in filteredRooms" 
                :key="room.number"
                class="room-card"
                :class="{ occupied: room.occupant }"
              >
                <div class="room-header">
                  <h4>{{ room.number }}</h4>
                  <span :class="`residence-badge ${room.residenceType}`">
                    {{ helpers.getResidenceName(room.residenceType) }}
                  </span>
                </div>
                <div class="room-details">
                  <p><strong>Tipo:</strong> {{ room.type }}</p>
                  <p><strong>Estado:</strong> 
                    <span :class="room.occupant ? 'status-occupied' : 'status-available'">
                      {{ room.occupant ? 'Ocupada' : 'Disponible' }}
                    </span>
                  </p>
                  <div v-if="room.occupant" class="occupant-info">
                    <strong>Ocupante:</strong> {{ room.occupant }}
                  </div>
                </div>
                <div class="room-actions">
                  <button 
                    v-if="room.occupant"
                    class="btn btn-small btn-outline" 
                    @click="releaseRoom(room)"
                  >
                    🚪 Liberar
                  </button>
                  <button 
                    class="btn btn-small btn-outline btn-danger" 
                    @click="deleteRoom(room)"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Estudiantes -->
          <div v-if="activeTab === 'students'" class="tab-panel">
            <div class="panel-header">
              <h2>👥 Gestión de Estudiantes</h2>
              <div class="panel-actions">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="searchStudents" 
                    placeholder="🔍 Buscar por nombre, email o cédula..."
                    class="search-input"
                  >
                </div>
                <select v-model="filterStudentFaculty" class="filter-select">
                  <option value="">Todas las facultades</option>
                  <option value="ingenieria">Ingeniería</option>
                  <option value="medicina">Medicina</option>
                  <option value="derecho">Derecho</option>
                  <option value="administracion">Administración</option>
                  <option value="educacion">Educación</option>
                </select>
              </div>
            </div>

            <div v-if="filteredStudents.length === 0" class="empty-state">
              <div class="empty-icon">👥</div>
              <h3>No hay estudiantes</h3>
              <p>{{ searchStudents || filterStudentFaculty ? 'No se encontraron resultados' : 'Los estudiantes aparecerán aquí cuando se registren en el sistema.' }}</p>
            </div>

            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Carrera</th>
                    <th>Año</th>
                    <th>Habitación</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="student in filteredStudents" :key="student.email">
                    <td>
                      <div class="student-info">
                        <strong>{{ student.fullName }}</strong>
                        <small>{{ student.cedula }}</small>
                      </div>
                    </td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.career }}</td>
                    <td>{{ student.academicYear }}°</td>
                    <td>
                      <span v-if="student.assignedRoom" class="room-badge">
                        {{ student.assignedRoom }}
                      </span>
                      <span v-else class="no-room">Sin asignar</span>
                    </td>
                    <td>{{ helpers.formatDate(student.registrationDate) }}</td>
                    <td>
                      <div class="action-buttons">
                        <button 
                          class="btn btn-small btn-outline btn-danger" 
                          @click="deleteStudent(student)"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal habitación -->
    <div v-if="showAddRoomModal" class="modal active" @click="closeAddRoomModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>➕ Nueva Habitación</h3>
          <button class="close-btn" @click="closeAddRoomModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addRoom">
            <div class="form-group">
              <label>Número de Habitación *</label>
              <input type="text" v-model="newRoom.number" required placeholder="Ej: N101, S201, P301">
            </div>
            
            <div class="form-group">
              <label>Tipo de Residencia *</label>
              <select v-model="newRoom.residenceType" required>
                <option value="">Selecciona el complejo</option>
                <option value="norte">Complejo Norte</option>
                <option value="sur">Complejo Sur</option>
                <option value="premium">Complejo Premium</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Tipo de Habitación *</label>
              <select v-model="newRoom.type" required>
                <option value="">Selecciona el tipo</option>
                <option value="Individual">Individual</option>
                <option value="Compartida">Compartida</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full">
              ➕ Agregar Habitación
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de detalles de solicitud -->
    <div v-if="showApplicationModal" class="modal active" @click="closeApplicationModal">
      <div class="modal-content application-details-modal" @click.stop>
        <div class="modal-header">
          <h3>📋 Detalles de la Solicitud</h3>
          <button class="close-btn" @click="closeApplicationModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedApplication">
          <div class="details-grid">
            <!-- Información Personal -->
            <div class="detail-section">
              <h4>👤 Información Personal</h4>
              <div class="detail-item">
                <strong>Nombre:</strong> {{ selectedApplication.studentName }}
              </div>
              <div class="detail-item">
                <strong>Email:</strong> {{ selectedApplication.studentEmail }}
              </div>
              <div class="detail-item" v-if="selectedApplication.phone">
                <strong>Teléfono:</strong> {{ selectedApplication.phone }}
              </div>
              <div class="detail-item" v-if="selectedApplication.city">
                <strong>Ciudad:</strong> {{ selectedApplication.city }}
              </div>
            </div>

            <!-- Información Académica -->
            <div class="detail-section">
              <h4>🎓 Información Académica</h4>
              <div class="detail-item" v-if="selectedApplication.gpa">
                <strong>Promedio:</strong> {{ selectedApplication.gpa }}
              </div>
              <div class="detail-item" v-if="selectedApplication.currentSemester">
                <strong>Semestre:</strong> {{ selectedApplication.currentSemester }}°
              </div>
              <div class="detail-item">
                <strong>Carrera:</strong> {{ getStudentCareer(selectedApplication.studentEmail) }}
              </div>
            </div>

            <!-- Información Socioeconómica -->
            <div class="detail-section">
              <h4>💰 Situación Socioeconómica</h4>
              <div class="detail-item" v-if="selectedApplication.familyIncome">
                <strong>Ingresos Familiares:</strong> {{ formatIncome(selectedApplication.familyIncome) }}
              </div>
              <div class="detail-item" v-if="selectedApplication.distanceKm">
                <strong>Distancia a la Universidad:</strong> {{ selectedApplication.distanceKm }} km
              </div>
              <div class="detail-item" v-if="selectedApplication.dependents">
                <strong>Dependientes:</strong> {{ selectedApplication.dependents }}
              </div>
              <div class="detail-item" v-if="selectedApplication.transportCost">
                <strong>Costo de Transporte:</strong> ${{ selectedApplication.transportCost }}
              </div>
            </div>

            <!-- Residencia -->
            <div class="detail-section">
              <h4>🏠 Residencia Solicitada</h4>
              <div class="detail-item">
                <strong>Tipo:</strong> {{ helpers.getResidenceName(selectedApplication.residenceType) }}
              </div>
              <div class="detail-item">
                <strong>Estado:</strong> 
                <span :class="`status status-${selectedApplication.status}`">
                  {{ helpers.getStatusText(selectedApplication.status) }}
                </span>
              </div>
              <div class="detail-item">
                <strong>Fecha de Solicitud:</strong> {{ helpers.formatDate(selectedApplication.submissionDate) }}
              </div>
            </div>
          </div>

          <!-- Justificación -->
          <div class="detail-section full-width" v-if="selectedApplication.justification">
            <h4>📝 Justificación</h4>
            <div class="justification-text">
              {{ selectedApplication.justification }}
            </div>
          </div>

          <!-- Compromisos -->
          <div class="detail-section full-width" v-if="selectedApplication.commitments">
            <h4>📋 Compromisos Aceptados</h4>
            <div class="commitments-list">
              <div v-if="selectedApplication.commitments.rules" class="commitment-accepted">
                ✅ Cumplir el reglamento interno
              </div>
              <div v-if="selectedApplication.commitments.payments" class="commitment-accepted">
                ✅ Realizar pagos puntualmente
              </div>
              <div v-if="selectedApplication.commitments.truthful" class="commitment-accepted">
                ✅ Información veraz y exacta
              </div>
              <div v-if="selectedApplication.commitments.maintenance" class="commitment-accepted">
                ✅ Mantener instalaciones en buen estado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataService } from '../services/dataService.js'
import { helpers } from '../utils/helpers.js'

export default {
  name: 'AdminDashboard',
  data: () => ({
    user: null,
    activeTab: 'applications',
    applications: [],
    students: [],
    rooms: [],
    showAddRoomModal: false,
    newRoom: { number: '', residenceType: '', type: '', occupant: null },
    
    // Filtros y búsquedas
    searchApplications: '',
    filterApplicationStatus: '',
    searchRooms: '',
    filterRoomType: '',
    searchStudents: '',
    filterStudentFaculty: '',

    selectedApplication: null,
    showApplicationModal: false,
    
    tabs: [
      { id: 'applications', name: 'Solicitudes', icon: '📋' },
      { id: 'rooms', name: 'Habitaciones', icon: '🏠' },
      { id: 'students', name: 'Estudiantes', icon: '👥' }
    ],
    helpers
  }),

  computed: {
    filteredApplications() {
      let filtered = this.applications
      
      if (this.searchApplications) {
        const search = this.searchApplications.toLowerCase()
        filtered = filtered.filter(app => 
          app.studentName.toLowerCase().includes(search) ||
          app.studentEmail.toLowerCase().includes(search)
        )
      }
      
      if (this.filterApplicationStatus) {
        filtered = filtered.filter(app => app.status === this.filterApplicationStatus)
      }
      
      return filtered
    },
    
    filteredRooms() {
      let filtered = this.rooms
      
      if (this.searchRooms) {
        const search = this.searchRooms.toLowerCase()
        filtered = filtered.filter(room => 
          room.number.toLowerCase().includes(search) ||
          (room.occupant && room.occupant.toLowerCase().includes(search))
        )
      }
      
      if (this.filterRoomType) {
        filtered = filtered.filter(room => room.residenceType === this.filterRoomType)
      }
      
      return filtered
    },
    
    filteredStudents() {
      let filtered = this.students
      
      if (this.searchStudents) {
        const search = this.searchStudents.toLowerCase()
        filtered = filtered.filter(student => 
          student.fullName.toLowerCase().includes(search) ||
          student.email.toLowerCase().includes(search) ||
          student.cedula.includes(search)
        )
      }
      
      if (this.filterStudentFaculty) {
        filtered = filtered.filter(student => student.faculty === this.filterStudentFaculty)
      }
      
      return filtered
    }
  },

  mounted() {
    this.checkAuth()
    this.loadData()
  },

  methods: {
    checkAuth() {
      const user = DataService.getCurrentUser()
      if (!user || user.type !== 'admin') return this.$router.push('/')
      this.user = user
    },

    loadData() {
      this.applications = DataService.getApplications()
      this.students = DataService.getUsers().filter(u => u.type === 'student')
      this.rooms = DataService.getRooms()
    },

    async approveApplication(application) {
      if (!confirm(`¿Aprobar la solicitud de ${application.studentName}?`)) return

      const apps = DataService.getApplications()
      const appIndex = apps.findIndex(app => app.id === application.id)
      if (appIndex !== -1) {
        apps[appIndex].status = 'approved'
        DataService.saveApplications(apps)
      }

      const availableRoom = this.rooms.find(room => 
        room.residenceType === application.residenceType && !room.occupant
      )

      if (availableRoom) {
        const rooms = DataService.getRooms()
        const roomIndex = rooms.findIndex(r => r.number === availableRoom.number)
        if (roomIndex !== -1) {
          rooms[roomIndex].occupant = application.studentName
          DataService.saveRooms(rooms)
        }

        const users = DataService.getUsers()
        const userIndex = users.findIndex(u => u.email === application.studentEmail)
        if (userIndex !== -1) {
          users[userIndex].assignedRoom = availableRoom.number
          DataService.saveUsers(users)
        }

        helpers.showNotification(`Solicitud aprobada y habitación ${availableRoom.number} asignada`, 'success')
      } else {
        helpers.showNotification(`Solicitud aprobada, pero no hay habitaciones disponibles`, 'warning')
      }

      this.loadData()
    },

    async rejectApplication(application) {
      if (!confirm(`¿Rechazar la solicitud de ${application.studentName}?`)) return

      const apps = DataService.getApplications()
      const appIndex = apps.findIndex(app => app.id === application.id)
      if (appIndex !== -1) {
        apps[appIndex].status = 'rejected'
        DataService.saveApplications(apps)
      }

      helpers.showNotification(`Solicitud de ${application.studentName} rechazada`, 'success')
      this.loadData()
    },

    deleteApplication(application) {
      if (!confirm(`¿Eliminar permanentemente la solicitud de ${application.studentName}?`)) return

      const apps = DataService.getApplications()
      const filtered = apps.filter(app => app.id !== application.id)
      DataService.saveApplications(filtered)

      helpers.showNotification('Solicitud eliminada', 'success')
      this.loadData()
    },

    deleteStudent(student) {
      if (!confirm(`¿Eliminar permanentemente al estudiante ${student.fullName}?`)) return

      // Eliminar usuario
      const users = DataService.getUsers()
      const filtered = users.filter(u => u.email !== student.email)
      DataService.saveUsers(filtered)

      // Liberar habitación si tenía una asignada
      if (student.assignedRoom) {
        const rooms = DataService.getRooms()
        const roomIndex = rooms.findIndex(r => r.number === student.assignedRoom)
        if (roomIndex !== -1) {
          rooms[roomIndex].occupant = null
          DataService.saveRooms(rooms)
        }
      }

      // Eliminar solicitudes del estudiante
      const apps = DataService.getApplications()
      const filteredApps = apps.filter(app => app.studentEmail !== student.email)
      DataService.saveApplications(filteredApps)

      helpers.showNotification(`Estudiante ${student.fullName} eliminado`, 'success')
      this.loadData()
    },

    deleteRoom(room) {
      if (!confirm(`¿Eliminar permanentemente la habitación ${room.number}?`)) return

      if (room.occupant) {
        // Quitar habitación del usuario
        const users = DataService.getUsers()
        const userIndex = users.findIndex(u => u.assignedRoom === room.number)
        if (userIndex !== -1) {
          users[userIndex].assignedRoom = null
          DataService.saveUsers(users)
        }
      }

      const rooms = DataService.getRooms()
      const filtered = rooms.filter(r => r.number !== room.number)
      DataService.saveRooms(filtered)

      helpers.showNotification(`Habitación ${room.number} eliminada`, 'success')
      this.loadData()
    },

    closeAddRoomModal() {
      this.showAddRoomModal = false
      this.newRoom = { number: '', residenceType: '', type: '', occupant: null }
    },

    addRoom() {
      const rooms = DataService.getRooms()
      
      if (rooms.find(r => r.number === this.newRoom.number)) {
        helpers.showNotification('Ya existe una habitación con ese número', 'error')
        return
      }

      rooms.push({ ...this.newRoom })
      DataService.saveRooms(rooms)
      
      helpers.showNotification(`Habitación ${this.newRoom.number} agregada exitosamente`, 'success')
      this.loadData()
      this.closeAddRoomModal()
    },

    releaseRoom(room) {
      if (!confirm(`¿Liberar la habitación ${room.number}?`)) return

      const rooms = DataService.getRooms()
      const roomIndex = rooms.findIndex(r => r.number === room.number)
      if (roomIndex !== -1) {
        rooms[roomIndex].occupant = null
        DataService.saveRooms(rooms)
      }

      const users = DataService.getUsers()
      const userIndex = users.findIndex(u => u.assignedRoom === room.number)
      if (userIndex !== -1) {
        users[userIndex].assignedRoom = null
        DataService.saveUsers(users)
      }

      helpers.showNotification(`Habitación ${room.number} liberada`, 'success')
      this.loadData()
    },

    getStudentCareer(email) {
      const student = this.students.find(s => s.email === email)
      return student?.career || 'N/A'
    },

    logout() {
      DataService.clearCurrentUser()
      this.$router.push('/')
    },

    formatIncome(income) {
      const incomeMap = {
        'menos-400': 'Menos de $400',
        '400-600': '$400 - $600',
        '600-800': '$600 - $800',
        '800-1200': '$800 - $1,200',
        'mas-1200': 'Más de $1,200'
      }
      return incomeMap[income] || income
    },

    viewApplicationDetails(application) {
      this.selectedApplication = application
      this.showApplicationModal = true
    },

    closeApplicationModal() {
      this.showApplicationModal = false
      this.selectedApplication = null
    },
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--background);
}

.dashboard-header {
  background: var(--card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashboard-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dashboard-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.header-left h1 {
  font-size: 1.25rem;
  color: var(--primary);
  margin: 0;
}

@media (max-width: 768px) {
  .header-logo {
    gap: 0.5rem;
  }
  
  .dashboard-logo {
    width: 28px;
    height: 28px;
  }
  
  .header-left h1 {
    font-size: 1.125rem;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.dashboard-main {
  padding: 2rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.stat-content p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.875rem;
}

.tabs-container {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  margin-bottom: 2rem;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: var(--background);
  color: var(--text);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  background: var(--background);
}

.tab-content {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.tab-panel {
  padding: 2rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-header h2 {
  color: var(--text);
  margin: 0;
  font-size: 1.5rem;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  min-width: 250px;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  background: var(--card);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--text);
  margin-bottom: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

.student-info strong {
  display: block;
  color: var(--text);
}

.student-info small {
  display: block;
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-top: 0.125rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-outline.btn-danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.room-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.room-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.room-card.occupied {
  border-left: 4px solid var(--danger);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.room-header h4 {
  margin: 0;
  color: var(--text);
  font-size: 1.25rem;
}

.residence-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.residence-badge.norte {
  background: var(--primary);
}

.residence-badge.sur {
  background: var(--success);
}

.residence-badge.premium {
  background: var(--warning);
}

.room-details {
  margin-bottom: 1rem;
}

.room-details p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.status-available {
  color: var(--success);
  font-weight: 600;
}

.status-occupied {
  color: var(--danger);
  font-weight: 600;
}

.occupant-info {
  background: rgba(220, 38, 38, 0.1);
  padding: 0.5rem;
  border-radius: var(--radius);
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.room-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.room-badge {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.no-room {
  color: var(--text-muted);
  font-style: italic;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-nav {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1;
    min-width: 120px;
  }
  
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .panel-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .search-input {
    min-width: 200px;
  }
  
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

.academic-info,
.residence-info {
  font-size: 0.875rem;
}

.academic-info div,
.residence-info div {
  margin-bottom: 0.25rem;
}

.academic-info small,
.residence-info small {
  display: block;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.btn-info {
  background: var(--primary);
  color: white;
}

.btn-info:hover {
  background: #0284c7;
}

.application-details-modal {
  max-width: 800px;
  width: 95%;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-section {
  background: var(--background);
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.detail-section h4 {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.detail-item:last-child {
  border-bottom: none;
}

.justification-text {
  background: var(--card);
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  line-height: 1.6;
  font-size: 0.875rem;
}

.commitments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.commitment-accepted {
  background: var(--card);
  padding: 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-size: 0.875rem;
  color: var(--success);
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>