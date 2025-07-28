// Servicio centralizado para manejo de datos - Solo datos reales
export class DataService {
  static get(key) {
    return JSON.parse(localStorage.getItem(`uleam_${key}`) || "[]")
  }

  static save(key, data) {
    localStorage.setItem(`uleam_${key}`, JSON.stringify(data))
  }

  static getUsers() {
    return this.get("users")
  }
  static saveUsers(users) {
    this.save("users", users)
  }
  static getRooms() {
    return this.get("rooms")
  }
  static saveRooms(rooms) {
    this.save("rooms", rooms)
  }
  static getApplications() {
    return this.get("applications")
  }
  static saveApplications(apps) {
    this.save("applications", apps)
  }

  static getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("currentUser") || "null")
  }

  static setCurrentUser(user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user))
  }

  static clearCurrentUser() {
    sessionStorage.removeItem("currentUser")
  }

  // Notificaciones temporales mejoradas
  static getNotifications() {
    const notifications = JSON.parse(localStorage.getItem("uleam_notifications") || "[]")
    // Limpiar notificaciones expiradas
    const now = new Date().getTime()
    const validNotifications = notifications.filter((n) => {
      const notificationTime = new Date(n.timestamp).getTime()
      const expirationTime = notificationTime + n.duration
      return now < expirationTime && !n.read
    })

    if (validNotifications.length !== notifications.length) {
      this.saveNotifications(validNotifications)
    }

    return validNotifications
  }

  static saveNotifications(notifications) {
    localStorage.setItem("uleam_notifications", JSON.stringify(notifications))
  }

  static addNotification(userId, message, type = "info", duration = 8000, priority = "normal") {
    const notifications = this.getNotifications()

    // Evitar notificaciones duplicadas
    const existingNotification = notifications.find(
      (n) => n.userId === userId && n.message === message && n.type === type && !n.read,
    )

    if (existingNotification) {
      return existingNotification
    }

    const notification = {
      id: Date.now() + Math.random(),
      userId,
      message,
      type, // 'success', 'error', 'warning', 'info'
      priority, // 'high', 'normal', 'low'
      timestamp: new Date().toISOString(),
      duration,
      read: false,
      autoRemove: true,
      actions: [], // Para futuras acciones en notificaciones
    }

    notifications.push(notification)

    // Limitar número de notificaciones por usuario
    const userNotifications = notifications.filter((n) => n.userId === userId && !n.read)
    if (userNotifications.length > 5) {
      // Eliminar las más antiguas
      const oldestNotifications = userNotifications
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(0, userNotifications.length - 5)

      oldestNotifications.forEach((oldNotif) => {
        this.removeNotification(oldNotif.id)
      })
    }

    this.saveNotifications(notifications)
    return notification
  }

  static addNotificationWithAction(userId, message, type, duration, actionText, actionCallback) {
    const notification = this.addNotification(userId, message, type, duration)
    notification.actions = [
      {
        text: actionText,
        callback: actionCallback,
      },
    ]
    this.saveNotifications(this.getNotifications())
    return notification
  }

  static removeNotification(notificationId) {
    const notifications = this.getNotifications()
    const filtered = notifications.filter((n) => n.id !== notificationId)
    this.saveNotifications(filtered)
  }

  static getUserNotifications(userId) {
    const notifications = this.getNotifications()
    return notifications
      .filter((n) => n.userId === userId && !n.read)
      .sort((a, b) => {
        // Ordenar por prioridad y luego por fecha
        const priorityOrder = { high: 3, normal: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.timestamp) - new Date(a.timestamp)
      })
  }

  static markNotificationAsRead(notificationId) {
    const notifications = this.getNotifications()
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications(notifications)
    }
  }

  static clearAllNotifications(userId) {
    const notifications = this.getNotifications()
    const filtered = notifications.filter((n) => n.userId !== userId)
    this.saveNotifications(filtered)
  }

  static getNotificationStats(userId) {
    const notifications = this.getNotifications()
    const userNotifications = notifications.filter((n) => n.userId === userId)

    return {
      total: userNotifications.length,
      unread: userNotifications.filter((n) => !n.read).length,
      byType: {
        success: userNotifications.filter((n) => n.type === "success").length,
        error: userNotifications.filter((n) => n.type === "error").length,
        warning: userNotifications.filter((n) => n.type === "warning").length,
        info: userNotifications.filter((n) => n.type === "info").length,
      },
    }
  }

  // Funciones específicas para eliminar datos
  static clearAllStudents() {
    const users = this.getUsers()
    const nonStudents = users.filter((u) => u.type !== "student")
    this.saveUsers(nonStudents)

    // También limpiar solicitudes relacionadas
    this.saveApplications([])

    // Liberar habitaciones ocupadas por estudiantes
    const rooms = this.getRooms()
    const updatedRooms = rooms.map((room) => ({
      ...room,
      occupant: null,
    }))
    this.saveRooms(updatedRooms)

    // Limpiar notificaciones de estudiantes
    this.saveNotifications([])
  }

  static clearAllRooms() {
    this.saveRooms([])

    // Quitar habitaciones asignadas de usuarios
    const users = this.getUsers()
    const updatedUsers = users.map((user) => ({
      ...user,
      assignedRoom: null,
    }))
    this.saveUsers(updatedUsers)
  }

  static clearAllApplications() {
    this.saveApplications([])
  }

  // Inicializar datos por defecto
  static initializeDefaultData() {
    this.init()

    // Inicializar arrays vacíos si no existen
    if (!localStorage.getItem("uleam_rooms")) {
      this.saveRooms([])
    }
    if (!localStorage.getItem("uleam_applications")) {
      this.saveApplications([])
    }
    if (!localStorage.getItem("uleam_notifications")) {
      this.saveNotifications([])
    }
  }

  static init() {
    const users = this.getUsers()
    if (!users.find((u) => u.email === "admin@uleam.edu.ec")) {
      users.push({
        email: "admin@uleam.edu.ec",
        password: "admin123",
        fullName: "Administrador ULEAM",
        type: "admin",
        registrationDate: new Date().toISOString(),
      })
      this.saveUsers(users)
    }
  }
}