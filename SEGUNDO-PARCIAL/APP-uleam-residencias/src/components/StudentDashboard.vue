<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="container">
        <div class="header-left">
          <div class="header-logo">
            <img src="/logo.png" alt="ULEAM Logo" class="dashboard-logo">
            <h1>Panel de Estudiante</h1>
          </div>
        </div>
        <div class="header-right">
          <span class="user-info">👨‍🎓 {{ user?.fullName }}</span>
          <button class="btn btn-outline" @click="logout">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="container">
        <div class="welcome">
          <h2>Bienvenido, {{ user?.fullName || 'Usuario' }}</h2>
          <p>Gestiona tu residencia estudiantil</p>
        </div>

        <div class="dashboard-grid">
          <!-- Mi Habitación -->
          <div class="card">
            <div class="card-header">
              <h3>🏠 Mi Habitación</h3>
            </div>
            <div class="card-content">
              <div v-if="user?.assignedRoom" class="room-info">
                <div class="info-item">
                  <strong>Habitación:</strong>
                  <span>{{ user.assignedRoom }}</span>
                </div>
                <div class="info-item">
                  <strong>Estado:</strong>
                  <span class="status status-approved">Asignada</span>
                </div>
              </div>
              <div v-else class="no-room-info">
                <div class="info-item">
                  <strong>Estado:</strong>
                  <span class="status status-pending">Sin habitación asignada</span>
                </div>
                <p class="help-text">
                  {{ application ? 'Tu solicitud está siendo procesada' : 'Solicita una residencia para obtener tu habitación' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Mi Solicitud -->
          <div class="card">
            <div class="card-header">
              <h3>📋 Mi Solicitud</h3>
            </div>
            <div class="card-content">
              <div v-if="application" class="application-info">
                <div class="info-item">
                  <strong>Residencia:</strong>
                  <span>{{ helpers.getResidenceName(application.residenceType) }}</span>
                </div>
                <div class="info-item">
                  <strong>Estado:</strong>
                  <span :class="`status status-${application.status}`">
                    {{ helpers.getStatusText(application.status) }}
                  </span>
                </div>
                <div class="info-item">
                  <strong>Fecha:</strong>
                  <span>{{ helpers.formatDate(application.submissionDate) }}</span>
                </div>
              </div>
              <div v-else class="no-application-info">
                <p class="help-text">No has enviado ninguna solicitud</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Académica -->
        <div class="card">
          <div class="card-header">
            <h3>🎓 Mi Información Académica</h3>
          </div>
          <div class="card-content">
            <div class="academic-grid">
              <div class="info-item">
                <strong>Carrera:</strong>
                <span>{{ user?.career || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <strong>Año de Estudio:</strong>
                <span>{{ user?.academicYear || 'N/A' }}°</span>
              </div>
              <div class="info-item">
                <strong>Facultad:</strong>
                <span>{{ helpers.getFacultyName(user?.faculty) }}</span>
              </div>
              <div class="info-item">
                <strong>Ciudad de Origen:</strong>
                <span>{{ user?.city || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="card">
          <div class="card-header">
            <h3>⚡ Acciones Rápidas</h3>
          </div>
          <div class="card-content">
            <div class="actions-grid">
              <button class="btn btn-primary" @click="showModal = true">
                📝 {{ application ? 'Ver Solicitud' : 'Solicitar Residencia' }}
              </button>
              <button class="btn btn-outline" @click="contactSupport">
                📞 Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal solicitud - Reemplazar todo el modal existente -->
    <ApplicationModal 
      v-if="showModal" 
      :user="user" 
      :existingApplication="application"
      @close="closeModal"
      @submit="handleApplicationSubmit"
    />
  </div>
</template>

<script>
import { DataService } from '../services/dataService.js'
import { helpers } from '../utils/helpers.js'
import ApplicationModal from './ApplicationModal.vue'

export default {
  name: 'StudentDashboard',
  components: {
    ApplicationModal
  },
  data: () => ({
    user: null,
    showModal: false,
    applications: [],
    form: { residenceType: '', justification: '' },
    loading: false,
    helpers
  }),
  
  computed: {
    application() {
      return this.applications.find(app => app.studentEmail === this.user?.email)
    }
  },
  
  mounted() {
    this.checkAuth()
    this.loadData()
  },
  
  methods: {
    checkAuth() {
      const user = DataService.getCurrentUser()
      if (!user || user.type !== 'student') return this.$router.push('/')
      this.user = user
    },
    
    loadData() {
      this.applications = DataService.getApplications()
    },
    
    closeModal() {
      this.showModal = false
    },
    
    async handleApplicationSubmit(applicationData) {
      this.loading = true
      
      try {
        const apps = DataService.getApplications()
        
        if (this.application) {
          // Actualizar solicitud existente
          const index = apps.findIndex(app => app.id === this.application.id)
          if (index !== -1) {
            apps[index] = { 
              ...apps[index], 
              ...applicationData,
              id: this.application.id,
              submissionDate: new Date().toISOString()
            }
          }
        } else {
          // Nueva solicitud
          apps.push({
            id: Date.now(),
            ...applicationData,
            submissionDate: new Date().toISOString(),
            status: 'pending'
          })
        }
        
        DataService.saveApplications(apps)
        this.loadData()
        this.closeModal()
        helpers.showNotification('Solicitud enviada exitosamente', 'success')
      } catch (error) {
        helpers.showNotification('Error al enviar la solicitud', 'error')
      } finally {
        this.loading = false
      }
    },
    
    contactSupport() {
      helpers.showNotification('Contacta: residencias@uleam.edu.ec | (05) 2623-740', 'info')
    },
    
    logout() {
      DataService.clearCurrentUser()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
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

.welcome {
  margin-bottom: 2rem;
}

.welcome h2 {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.welcome p {
  color: var(--text-muted);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card-content {
  padding: 0;
}

.room-info,
.application-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-room-info,
.no-application-info {
  text-align: center;
  padding: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.info-item:last-child {
  border-bottom: none;
}

.academic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .academic-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }

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
</style>