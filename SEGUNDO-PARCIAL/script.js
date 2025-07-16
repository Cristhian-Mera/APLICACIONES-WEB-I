// 1. Usuarios (JSONPlaceholder)
fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    const lista = document.getElementById("usuarios")
    data.forEach((user) => {
      const item = document.createElement("li")
      item.textContent = `${user.name} (${user.email})`
      lista.appendChild(item)
    })
  })

// 2. Clima en Quito (Open-Meteo)
fetch("https://api.open-meteo.com/v1/forecast?latitude=-0.23&longitude=-78.52&current_weather=true")
  .then((res) => res.json())
  .then((data) => {
    const clima = document.getElementById("clima")
    clima.textContent = `Temperatura: ${data.current_weather.temperature}°C - Viento: ${data.current_weather.windspeed} km/h`
  })

// 3. Razas de gatos (catfact.ninja)
fetch("https://catfact.ninja/breeds")
  .then((res) => res.json())
  .then((data) => {
    const lista = document.getElementById("gatos")
    data.data.slice(0, 5).forEach((breed) => {
      const item = document.createElement("li")
      item.textContent = `${breed.breed} - Tamaño: ${breed.size}`
      lista.appendChild(item)
    })
  })

// 4. Universidades en Ecuador (Hipolabs API)
fetch("http://universities.hipolabs.com/search?country=Ecuador")
  .then((res) => res.json())
  .then((data) => {
    const lista = document.getElementById("universidades")
    data.slice(0, 5).forEach((universidad) => {
      const item = document.createElement("li")
      item.innerHTML = `<strong>${universidad.name}</strong> - <a href="${universidad.web_pages[0]}" target="_blank">Sitio web</a>`
      lista.appendChild(item)
    })
  })

// 5. Criptomonedas (CoinGecko API)
fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true",
)
  .then((res) => res.json())
  .then((data) => {
    const lista = document.getElementById("criptomonedas")
    Object.keys(data).forEach((crypto) => {
      const item = document.createElement("li")
      const precio = data[crypto].usd
      const cambio = data[crypto].usd_24h_change.toFixed(2)
      const color = cambio >= 0 ? "green" : "red"
      item.innerHTML = `<strong>${crypto.toUpperCase()}</strong>: $${precio} <span style="color: ${color}">(${cambio >= 0 ? "+" : ""}${cambio}%)</span>`
      lista.appendChild(item)
    })
  })
  .catch((error) => {
    document.getElementById("criptomonedas").innerHTML = "<li>Error al cargar datos de criptomonedas</li>"
  })

// 6. Países de América del Sur (REST Countries API)
fetch("https://restcountries.com/v3.1/region/south%20america?fields=name,capital,population,flag")
  .then((res) => res.json())
  .then((data) => {
    const lista = document.getElementById("paises")
    data.forEach((pais) => {
      const item = document.createElement("li")
      const poblacion = pais.population.toLocaleString()
      item.innerHTML = `${pais.flag} <strong>${pais.name.common}</strong> - Capital: ${pais.capital ? pais.capital[0] : "N/A"} - Población: ${poblacion}`
      lista.appendChild(item)
    })
  })
  .catch((error) => {
    document.getElementById("paises").innerHTML = "<li>Error al cargar datos de países</li>"
  })

// 7. Datos curiosos sobre números (Numbers API)
function obtenerDatoCurioso() {
  const numeroAleatorio = Math.floor(Math.random() * 100) + 1
  fetch(`http://numbersapi.com/${numeroAleatorio}`)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("numero-curioso").textContent = data
    })
    .catch((error) => {
      document.getElementById("numero-curioso").textContent = "Error al cargar dato curioso"
    })
}

// Función para el botón
function obtenerNuevoDato() {
  obtenerDatoCurioso()
}

// Cargar dato inicial
obtenerDatoCurioso()
