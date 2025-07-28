<template>
  <div class="modal active" @click="closeOnBackdrop">
    <div class="modal-content application-modal" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h3>📝 Solicitud de Residencia Estudiantil</h3>
          <p>Complete todos los campos para procesar su solicitud</p>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <span class="progress-text">{{ Math.round(progressPercentage) }}% completado</span>
        </div>

        <form @submit.prevent="submitApplication" class="application-form">
          
          <!-- Información Personal -->
          <div class="form-section">
            <div class="section-header">
              <h4>👤 Información Personal</h4>
              <span class="section-status" :class="{ completed: personalInfoComplete }">
                {{ personalInfoComplete ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre Completo *</label>
                <input 
                  type="text" 
                  :value="user.fullName" 
                  disabled
                  class="form-input disabled"
                >
              </div>
              
              <div class="form-group">
                <label>Email Institucional *</label>
                <input 
                  type="email" 
                  :value="user.email" 
                  disabled
                  class="form-input disabled"
                >
              </div>
              
              <div class="form-group">
                <label>Teléfono de Contacto *</label>
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  required
                  placeholder="0987654321"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>Ciudad de Origen *</label>
                <input 
                  type="text" 
                  v-model="form.city" 
                  required
                  placeholder="Portoviejo"
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- Información Académica -->
          <div class="form-section">
            <div class="section-header">
              <h4>🎓 Información Académica</h4>
              <span class="section-status" :class="{ completed: academicInfoComplete }">
                {{ academicInfoComplete ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Promedio General *</label>
                <input 
                  type="number" 
                  v-model.number="form.gpa" 
                  min="6.0" 
                  max="10" 
                  step="0.01" 
                  required
                  placeholder="8.50"
                  class="form-input"
                >
                <small class="help-text">Mínimo 6.0 para aplicar</small>
              </div>

              <div class="form-group">
                <label>Semestre Actual *</label>
                <select v-model="form.currentSemester" required class="form-input">
                  <option value="">Selecciona</option>
                  <option v-for="i in 10" :key="i" :value="i">{{ i }}° Semestre</option>
                </select>
              </div>

              <div class="form-group full-width">
                <label>Carrera *</label>
                <input 
                  type="text" 
                  :value="user.career" 
                  disabled
                  class="form-input disabled"
                >
              </div>
            </div>
          </div>

          <!-- Selección de Residencia -->
          <div class="form-section">
            <div class="section-header">
              <h4>🏠 Tipo de Residencia</h4>
              <span class="section-status" :class="{ completed: form.residenceType }">
                {{ form.residenceType ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="residence-options">
              <div 
                v-for="(residence, key) in residenceTypes" 
                :key="key"
                class="residence-card"
                :class="{ selected: form.residenceType === key, unavailable: getAvailableRooms(key) === 0 }"
                @click="selectResidence(key)"
              >
                <div class="residence-header">
                  <span class="residence-icon">{{ residence.icon }}</span>
                  <div class="residence-info">
                    <h5>{{ residence.name }}</h5>
                    <p class="price">${{ residence.price }}/mes</p>
                  </div>
                  <div class="availability">
                    <span class="availability-count">{{ getAvailableRooms(key) }}</span>
                    <span class="availability-label">disponibles</span>
                  </div>
                </div>
                <div class="residence-features">
                  <span class="feature">{{ getResidenceFeatures(key) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información Socioeconómica -->
          <div class="form-section">
            <div class="section-header">
              <h4>💰 Situación Socioeconómica</h4>
              <span class="section-status" :class="{ completed: socioeconomicComplete }">
                {{ socioeconomicComplete ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Ingresos Familiares Mensuales *</label>
                <select v-model="form.familyIncome" required class="form-input">
                  <option value="">Selecciona el rango</option>
                  <option value="menos-400">Menos de $400</option>
                  <option value="400-600">$400 - $600</option>
                  <option value="600-800">$600 - $800</option>
                  <option value="800-1200">$800 - $1,200</option>
                  <option value="mas-1200">Más de $1,200</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Distancia a la Universidad (km) *</label>
                <input 
                  type="number" 
                  v-model.number="form.distanceKm" 
                  min="0" 
                  max="500"
                  required
                  placeholder="45"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>Número de Dependientes *</label>
                <input 
                  type="number" 
                  v-model.number="form.dependents" 
                  min="1" 
                  max="15"
                  required
                  placeholder="4"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label>Costo Mensual de Transporte *</label>
                <input 
                  type="number" 
                  v-model.number="form.transportCost" 
                  min="0"
                  required
                  placeholder="120"
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- Justificación -->
          <div class="form-section">
            <div class="section-header">
              <h4>📝 Justificación</h4>
              <span class="section-status" :class="{ completed: justificationComplete }">
                {{ justificationComplete ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="form-group">
              <label>¿Por qué necesitas la residencia estudiantil? *</label>
              <textarea 
                v-model="form.justification" 
                rows="4" 
                required 
                placeholder="Describe tu situación actual, motivos por los cuales necesitas la residencia, y cómo esto beneficiaría tu rendimiento académico..."
                maxlength="500"
                class="form-textarea"
              ></textarea>
              <div class="textarea-footer">
                <small class="char-count">{{ form.justification.length }}/500 caracteres</small>
                <small class="help-text">Mínimo 50 caracteres</small>
              </div>
            </div>
          </div>

          <!-- Compromisos -->
          <div class="form-section">
            <div class="section-header">
              <h4>📋 Compromisos y Declaraciones</h4>
              <span class="section-status" :class="{ completed: commitmentsComplete }">
                {{ commitmentsComplete ? '✓' : '○' }}
              </span>
            </div>
            
            <div class="commitments-list">
              <label class="commitment-item">
                <input type="checkbox" v-model="form.commitments.rules" required>
                <span class="checkmark"></span>
                <span class="commitment-text">Me comprometo a cumplir el reglamento interno de las residencias</span>
              </label>
              
              <label class="commitment-item">
                <input type="checkbox" v-model="form.commitments.payments" required>
                <span class="checkmark"></span>
                <span class="commitment-text">Me comprometo a realizar los pagos mensuales puntualmente</span>
              </label>
              
              <label class="commitment-item">
                <input type="checkbox" v-model="form.commitments.truthful" required>
                <span class="checkmark"></span>
                <span class="commitment-text">Declaro que toda la información proporcionada es veraz y exacta</span>
              </label>
              
              <label class="commitment-item">
                <input type="checkbox" v-model="form.commitments.maintenance" required>
                <span class="checkmark"></span>
                <span class="commitment-text">Me comprometo a mantener en buen estado las instalaciones asignadas</span>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="!canSubmit || isSubmitting">
              <span v-if="isSubmitting">⏳ Enviando Solicitud...</span>
              <span v-else>✅ {{ existingApplication ? 'Actualizar Solicitud' : 'Enviar Solicitud' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { DataService } from '../services/dataService.js'

export default {
  name: 'ApplicationModal',
  props: {
    user: {
      type: Object,
      required: true
    },
    existingApplication: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        phone: this.user?.phone || '',
        city: this.user?.city || '',
        gpa: '',
        currentSemester: '',
        residenceType: '',
        familyIncome: '',
        distanceKm: '',
        dependents: '',
        transportCost: '',
        justification: '',
        commitments: {
          rules: false,
          payments: false,
          truthful: false,
          maintenance: false
        }
      },
      residenceTypes: {
        norte: {
          name: 'Complejo Norte',
          price: 150,
          icon: '🏢'
        },
        sur: {
          name: 'Complejo Sur',
          price: 120,
          icon: '🏠'
        },
        premium: {
          name: 'Complejo Premium',
          price: 200,
          icon: '🏨'
        }
      },
      isSubmitting: false
    }
  },
  
  computed: {
    personalInfoComplete() {
      return this.form.phone && this.form.city
    },
    
    academicInfoComplete() {
      return this.form.gpa && this.form.currentSemester && this.form.gpa >= 6.0
    },
    
    socioeconomicComplete() {
      return this.form.familyIncome && this.form.distanceKm && 
             this.form.dependents && this.form.transportCost
    },
    
    justificationComplete() {
      return this.form.justification && this.form.justification.trim().length >= 50
    },
    
    commitmentsComplete() {
      return Object.values(this.form.commitments).every(c => c === true)
    },
    
    progressPercentage() {
      const sections = [
        this.personalInfoComplete,
        this.academicInfoComplete,
        this.form.residenceType,
        this.socioeconomicComplete,
        this.justificationComplete,
        this.commitmentsComplete
      ]
      const completed = sections.filter(Boolean).length
      return (completed / sections.length) * 100
    },
    
    canSubmit() {
      return this.personalInfoComplete && this.academicInfoComplete && 
             this.form.residenceType && this.socioeconomicComplete && 
             this.justificationComplete && this.commitmentsComplete
    }
  },
  
  mounted() {
    if (this.existingApplication) {
      Object.keys(this.form).forEach(key => {
        if (this.existingApplication[key] !== undefined) {
          this.form[key] = this.existingApplication[key]
        }
      })
    }
  },
  
  methods: {
    closeOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.$emit('close')
      }
    },

    selectResidence(residenceType) {
      const available = this.getAvailableRooms(residenceType)
      if (available === 0) {
        if (confirm('No hay habitaciones disponibles en este momento. ¿Deseas continuar con la solicitud?')) {
          this.form.residenceType = residenceType
        }
        return
      }
      this.form.residenceType = residenceType
    },
    
    getAvailableRooms(residenceType) {
      const rooms = DataService.getRooms()
      return rooms.filter(r => r.residenceType === residenceType && !r.occupant).length
    },

    getResidenceFeatures(type) {
      const features = {
        norte: 'Habitaciones individuales con baño privado',
        sur: 'Habitaciones compartidas con áreas comunes',
        premium: 'Suites ejecutivas con servicios premium'
      }
      return features[type] || ''
    },

    async submitApplication() {
      if (!this.canSubmit) {
        alert('Por favor completa todos los campos requeridos.')
        return
      }

      this.isSubmitting = true

      try {
        await new Promise(resolve => setTimeout(resolve, 1500))

        const application = {
          ...this.form,
          studentEmail: this.user.email,
          studentName: this.user.fullName,
          submissionDate: new Date().toISOString(),
          status: 'pending'
        }

        this.$emit('submit', application)
      } catch (error) {
        alert('Error al enviar la solicitud. Inténtalo de nuevo.')
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.application-modal {
  max-width: 900px;
  max-height: 90vh;
  width: 95%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%);
  color: white;
}

.header-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-container {
  padding: 1.5rem 2rem;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.progress-bar {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0369a1, #059669);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.modal-body {
  padding: 0;
  max-height: calc(90vh - 200px);
  overflow-y: auto;
}

.application-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.section-header h4 {
  margin: 0;
  color: var(--text);
  font-size: 1.125rem;
  font-weight: 600;
}

.section-status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--border);
  color: var(--text-muted);
}

.section-status.completed {
  background: var(--success);
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: var(--text);
  font-size: 0.875rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.form-input.disabled {
  background: var(--background);
  color: var(--text-muted);
  cursor: not-allowed;
}

.help-text {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.residence-options {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.residence-card {
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.residence-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.residence-card.selected {
  border-color: var(--primary);
  background: rgba(3, 105, 161, 0.05);
}

.residence-card.unavailable {
  opacity: 0.6;
  cursor: not-allowed;
}

.residence-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.residence-icon {
  font-size: 2rem;
}

.residence-info {
  flex: 1;
}

.residence-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.price {
  color: var(--primary);
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.availability {
  text-align: center;
}

.availability-count {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.availability-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.residence-features {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.feature {
  background: var(--background);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.char-count {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.commitments-list {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.commitment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.commitment-item:hover {
  background: var(--background);
}

.commitment-item input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.commitment-text {
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.4;
}

.form-actions {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--background);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0369a1 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .application-modal {
    width: 98%;
    margin: 1%;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .modal-header,
  .progress-container,
  .application-form {
    padding: 1rem;
  }
  
  .residence-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
