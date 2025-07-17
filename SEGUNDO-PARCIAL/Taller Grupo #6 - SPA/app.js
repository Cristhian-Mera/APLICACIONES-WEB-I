const contenedor = document.getElementById('contenido');

const secciones = {
  inicio: `
    <h2>Bienvenido a la página de Inicio</h2>
    <p>Esta es una aplicación de una sola página sin recargas.</p>
  `,
  acerca: `
    <h2>Acerca de Nosotros</h2>
    <p>Somos un grupo de desarrollo web apasionado por las SPAs.</p>
  `,
  contacto: `
    <h2>Contacto</h2>
    <p>Puedes escribirnos a contacto@ejemplo.com.</p>
  `
};

function mostrarSeccion(seccion) {
  // Aplicar clase fade-out para iniciar la transición
  contenedor.classList.add('fade-out');
  
  // Esperar a que termine la transición de desvanecimiento
  setTimeout(() => {
    contenedor.innerHTML = secciones[seccion] || '<p>Sección no encontrada</p>';
    // Quitar la clase fade-out para mostrar el nuevo contenido
    contenedor.classList.remove('fade-out');
  }, 500); // 500ms = 0.5s (debe coincidir con la duración de la transición en CSS)
}

document.querySelectorAll('button[data-seccion]').forEach(boton => {
  boton.addEventListener('click', () => {
    const seccion = boton.getAttribute('data-seccion');
    mostrarSeccion(seccion);
  });
});

mostrarSeccion('inicio');