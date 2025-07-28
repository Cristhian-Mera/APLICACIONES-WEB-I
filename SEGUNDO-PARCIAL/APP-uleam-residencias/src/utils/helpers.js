// Utilidades centralizadas simplificadas
export const helpers = {
  // Validaciones
  validateEmail: (email, type = "student") => {
    if (!email) return "Email requerido"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido"
    if (type === "student" && !email.includes("@uleam.edu.ec")) return "Usar email institucional"
    if (type === "admin" && email !== "admin@uleam.edu.ec") return "Email de admin inválido"
    return ""
  },

  validateRequired: (value, name) => (value?.trim() ? "" : `${name} es requerido`),

  validateCedula: (cedula) => {
    if (!cedula) return "Cédula requerida"
    if (!/^\d{10}$/.test(cedula)) return "Cédula debe tener 10 dígitos"
    return ""
  },

  validatePhone: (phone) => {
    if (!phone) return "Teléfono requerido"
    if (!/^0\d{8,9}$/.test(phone)) return "Formato: 0987654321"
    return ""
  },

  // Formateo simple
  formatDate: (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("es-ES")
  },

  getResidenceName: (type) => {
    const names = {
      norte: "Complejo Norte",
      sur: "Complejo Sur",
      premium: "Complejo Premium",
    }
    return names[type] || type
  },

  getStatusText: (status) => {
    const texts = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
    }
    return texts[status] || status
  },

  getFacultyName: (faculty) => {
    const names = {
      ingenieria: "Ingeniería",
      medicina: "Medicina",
      derecho: "Derecho",
      administracion: "Administración",
      educacion: "Educación",
    }
    return names[faculty] || faculty
  },

  // Notificación simple
  showNotification: (message, type = "info") => {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Estilos
    const colors = {
      success: "#059669",
      error: "#dc2626",
      warning: "#d97706",
      info: "#0369a1",
    }

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
      background: ${colors[type] || colors.info};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `

    // Agregar estilos de animación si no existen
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style")
      style.id = "notification-styles"
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(notification)

    // Auto-remover
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  },
}