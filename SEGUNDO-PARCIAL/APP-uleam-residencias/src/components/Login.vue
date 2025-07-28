<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Header simple -->
        <div class="header-section">
          <div class="logo-container">
            <img src="/logo.png" alt="ULEAM Logo" class="logo">
            <div class="logo-text">
              <h1>ULEAM Residencias</h1>
              <p>Sistema de Gestión Estudiantil</p>
            </div>
          </div>
        </div>

        <!-- Formulario de login -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- User Type Toggle -->
          <div class="user-type-toggle">
            <button 
              type="button" 
              class="toggle-btn" 
              :class="{ active: userType === 'student' }"
              @click="setUserType('student')"
            >
              👨‍🎓 Estudiante
            </button>
            <button 
              type="button" 
              class="toggle-btn" 
              :class="{ active: userType === 'admin' }"
              @click="setUserType('admin')"
            >
              👨‍💼 Administrador
            </button>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="email" 
              :placeholder="userType === 'student' ? 'juan@uleam.edu.ec' : 'admin@uleam.edu.ec'"
              required
              class="form-input"
            >
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••"
              required
              class="form-input"
            >
          </div>

          <!-- Login Button -->
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar al Sistema' }}
          </button>
        </form>

        <!-- Register Link -->
        <div class="register-section">
          <p>¿No tienes cuenta? <router-link to="/register" class="register-link">Regístrate aquí</router-link></p>
        </div>

        <!-- Admin Info -->
        <div class="admin-info">
          <p><strong>🔑 Admin:</strong> admin@uleam.edu.ec / admin123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataService } from '../services/dataService.js'

export default {
  name: 'Login',
  data: () => ({
    userType: 'student',
    email: '',
    password: '',
    loading: false
  }),

  methods: {
    setUserType(type) {
      this.userType = type
      this.email = ''
      this.password = ''
    },

    async handleLogin() {
      this.loading = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const users = DataService.getUsers()
        const user = users.find(u => 
          u.email.toLowerCase().trim() === this.email.toLowerCase().trim() && 
          u.password === this.password &&
          u.type === this.userType
        )

        if (user) {
          DataService.setCurrentUser(user)
          this.$router.push(user.type === 'admin' ? '/admin-dashboard' : '/student-dashboard')
        } else {
          alert('Credenciales incorrectas. Verifica tu email, contraseña y tipo de usuario.')
        }
      } catch (error) {
        alert('Error de conexión')
      } finally {
        this.loading = false
      }
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
  background: #f8fafc;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
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
  font-size: 1.5rem;
  color: #0369a1;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.logo-text p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.header-section h1 {
  font-size: 1.5rem;
  color: #0369a1;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-section p {
  color: #64748b;
  font-size: 0.875rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 8px;
}

.toggle-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: #0369a1;
  color: white;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #0369a1;
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
}

.login-btn {
  padding: 0.875rem;
  background: #0369a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  background: #0284c7;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.register-section p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.register-link {
  color: #0369a1;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.admin-info {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.admin-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .residences-section {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .login-card {
    margin: 0.5rem;
  }
  
  .header-section,
  .residences-section,
  .login-section {
    padding: 1.5rem;
  }

  .logo-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .logo-text {
    text-align: center;
  }
}
</style>