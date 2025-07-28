<template>
  <div class="login-page">
    <div class="register-container">
      <div class="card">
        <div class="logo-section">
          <div class="logo-container">
            <img src="/logo.png" alt="ULEAM Logo" class="logo">
            <div class="logo-text">
              <h1>ULEAM Residencias</h1>
              <p>Registro de Nuevo Estudiante</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="form-section">
            <h4>👤 Información Personal</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Nombre Completo *</label>
                <input 
                  type="text" 
                  v-model="form.fullName" 
                  required 
                  placeholder="Jose Luis García Mendoza"
                  :class="{ error: errors.fullName }"
                  @blur="validateName"
                >
                <small v-if="errors.fullName" class="error-text">{{ errors.fullName }}</small>
              </div>
              <div class="form-group">
                <label>Cédula *</label>
                <input 
                  type="text" 
                  v-model="form.cedula" 
                  required 
                  placeholder="1234567890" 
                  maxlength="10"
                  :class="{ error: errors.cedula }"
                  @blur="validateCedula"
                >
                <small v-if="errors.cedula" class="error-text">{{ errors.cedula }}</small>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Email Institucional *</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  required 
                  placeholder="estudiante@uleam.edu.ec"
                  :class="{ error: errors.email }"
                  @blur="validateEmail"
                >
                <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
              </div>
              <div class="form-group">
                <label>Teléfono *</label>
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  required 
                  placeholder="0987654321"
                  :class="{ error: errors.phone }"
                  @blur="validatePhone"
                >
                <small v-if="errors.phone" class="error-text">{{ errors.phone }}</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>🎓 Información Académica</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Facultad *</label>
                <select v-model="form.faculty" required :class="{ error: errors.faculty }">
                <option value="">Selecciona tu facultad</option>
                <option value="ingenieria">Facultad de Ciencias de la Vida y Tecnologías</option>
                <option value="medicina">Facultad de Ciencias de la Salud</option>
                <option value="derecho">Facultad de Ciencias Sociales, Derecho y Bienestar</option>
                <option value="administracion">Facultad de Ciencias Administrativas, Contables y Comercio</option>
                <option value="educacion">Facultad de Educación, Turismo, Artes y Humanidades</option>
              </select>

              </div>
              <div class="form-group">
                <label>Carrera *</label>
                <input 
                  type="text" 
                  v-model="form.career" 
                  required 
                  placeholder="Ej:Tecnologias de la información"
                  :class="{ error: errors.career }"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Año de Estudio *</label>
                <select v-model="form.academicYear" required :class="{ error: errors.academicYear }">
                  <option value="">Selecciona</option>
                  <option v-for="i in 5" :key="i" :value="i">{{ i }}° Año</option>
                </select>
              </div>
              <div class="form-group">
                <label>Ciudad de Origen *</label>
                <input 
                  type="text" 
                  v-model="form.city" 
                  required 
                  placeholder="Ej: Manta"
                  :class="{ error: errors.city }"
                >
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4>🔐 Credenciales</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Contraseña *</label>
                <input 
                  type="password" 
                  v-model="form.password" 
                  required 
                  minlength="6" 
                  placeholder="Mínimo 6 caracteres"
                  :class="{ error: errors.password }"
                  @blur="validatePassword"
                >
                <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
              </div>
              <div class="form-group">
                <label>Confirmar Contraseña *</label>
                <input 
                  type="password" 
                  v-model="form.confirmPassword" 
                  required 
                  placeholder="Repite la contraseña"
                  :class="{ error: errors.confirmPassword }"
                  @blur="validateConfirmPassword"
                >
                <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="!canSubmit || loading">
            {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/">Inicia sesión aquí</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataService } from '../services/dataService.js'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        fullName: '',
        cedula: '',
        email: '',
        phone: '',
        faculty: '',
        career: '',
        academicYear: '',
        city: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      loading: false
    }
  },
  
  computed: {
    canSubmit() {
      const requiredFields = ['fullName', 'cedula', 'email', 'phone', 'faculty', 'career', 'academicYear', 'city', 'password', 'confirmPassword']
      const hasAllFields = requiredFields.every(field => this.form[field] && this.form[field].toString().trim())
      const passwordsMatch = this.form.password === this.form.confirmPassword
      const hasMinimumValidation = this.form.fullName.length >= 3 && this.form.password.length >= 6
      return hasAllFields && passwordsMatch && hasMinimumValidation
    }
  },
  
  methods: {
    // Validaciones simples
    validateName() {
      if (this.form.fullName.trim() && this.form.fullName.trim().length < 3) {
        this.errors.fullName = 'Mínimo 3 caracteres'
      } else if (this.form.fullName.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.form.fullName)) {
        this.errors.fullName = 'Solo letras y espacios'
      } else {
        delete this.errors.fullName
      }
    },

    validateCedula() {
      if (this.form.cedula && !/^\d{10}$/.test(this.form.cedula)) {
        this.errors.cedula = 'Debe tener 10 dígitos'
      } else {
        delete this.errors.cedula
      }
    },

    validateEmail() {
      if (this.form.email && !this.form.email.includes('@uleam.edu.ec')) {
        this.errors.email = 'Debe ser email institucional (@uleam.edu.ec)'
      } else {
        delete this.errors.email
      }
    },

    validatePhone() {
      if (this.form.phone && !/^0\d{8,9}$/.test(this.form.phone)) {
        this.errors.phone = 'Formato: 0987654321'
      } else {
        delete this.errors.phone
      }
    },

    validatePassword() {
      if (this.form.password && this.form.password.length < 6) {
        this.errors.password = 'Mínimo 6 caracteres'
      } else {
        delete this.errors.password
      }
    },

    validateConfirmPassword() {
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden'
      } else {
        delete this.errors.confirmPassword
      }
    },

    async handleRegister() {
      // Validar todo antes de enviar
      this.validateName()
      this.validateCedula()
      this.validateEmail()
      this.validatePhone()
      this.validatePassword()
      this.validateConfirmPassword()

      if (!this.canSubmit) {
        this.showNotification('Por favor corrige los errores', 'error')
        return
      }
      
      this.loading = true
      
      try {
        const users = DataService.getUsers()
        
        // Verificar duplicados
        if (users.find(u => u.email.toLowerCase() === this.form.email.toLowerCase())) {
          this.showNotification('Este email ya está registrado', 'error')
          return
        }
        
        if (users.find(u => u.cedula === this.form.cedula)) {
          this.showNotification('Esta cédula ya está registrada', 'error')
          return
        }
        
        // Crear usuario
        const newUser = {
          ...this.form,
          fullName: this.form.fullName.trim(),
          email: this.form.email.toLowerCase().trim(),
          city: this.form.city.trim(),
          type: 'student',
          registrationDate: new Date().toISOString(),
          assignedRoom: null
        }
        
        users.push(newUser)
        DataService.saveUsers(users)
        
        this.showNotification('¡Registro exitoso!', 'success')
        setTimeout(() => {
          this.$router.push('/')
        }, 1500)
        
      } catch (error) {
        this.showNotification('Error en el registro', 'error')
      } finally {
        this.loading = false
      }
    },

    showNotification(message, type) {
      // Crear notificación simple
      const notification = document.createElement('div')
      notification.className = `notification ${type}`
      notification.textContent = message
      
      // Estilos inline para simplicidad
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#059669' : '#dc2626'};
      `
      
      document.body.appendChild(notification)
      
      // Remover después de 3 segundos
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease'
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--background);
}

.register-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  border: 1px solid var(--border);
  margin: 0 auto;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.logo-text {
  text-align: left;
}

.logo-text h1 {
  font-size: 1.75rem;
  color: var(--primary);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.logo-text p {
  color: var(--text-muted);
  font-size: 1rem;
  margin: 0;
}

.form-section {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-section h4 {
  margin-bottom: 1.5rem;
  color: var(--primary);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: var(--card);
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-text {
  color: var(--danger);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
  font-weight: 500;
}

.btn {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0284c7;
  transform: translateY(-1px);
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #94a3b8;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.login-link p {
  margin: 0;
  color: var(--text-muted);
}

.login-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: #0284c7;
}

/* Responsive */
@media (max-width: 768px) {
  .login-page {
    padding: 0.5rem;
  }
  
  .card {
    padding: 1.5rem;
  }

  .logo-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .logo-text {
    text-align: center;
  }
  
  .logo-text h1 {
    font-size: 1.5rem;
  }
  
  .logo-text p {
    font-size: 0.875rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .register-container {
    max-width: 100%;
  }
}

/* Animaciones para notificaciones */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>