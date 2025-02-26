# Visión General del Proyecto: Sistema de Partículas Interactivo

# Características Principales

- **Visualización en tiempo real**: Las partículas se mueven en la pantalla con animaciones basadas en física.
- **Elementos Interactivos**: Los usuarios pueden pasar el cursor sobre las partículas y hacer clic en ellas para obtener información.
- **Ajustes Personalizables**: Permite modificar la cantidad de partículas, el radio de conexión, la velocidad y los temas de color.
- **Métricas de Rendimiento**: Incluye un contador de FPS y seguimiento de conexiones.
- **Diseño Responsivo**: Funciona en cualquier tamaño de pantalla, con soporte táctil en dispositivos móviles.
- **Interfaz Accesible**: Soporte para navegación con teclado y opciones de rendimiento.

# Estructura de Archivos y Responsabilidades

## `index.html` - Estructura Principal
- Contiene el elemento canvas principal donde se dibujan las partículas.
- Incluye controles de UI para ajustar los parámetros del sistema de partículas.
- Dispone de diálogos modales y paneles de información.

## `styles.css` - Estilos y Diseño
- Define la apariencia visual de todos los elementos de la interfaz.
- Configura el diseño responsivo para diferentes tamaños de pantalla.
- Contiene variables de color para los temas.
- Maneja animaciones y transiciones.

## `particle.js` - Definición de la Clase `Particle`
- Encapsula toda la lógica específica de las partículas.
- Maneja el movimiento, dibujo e interacción de las partículas.
- Contiene métodos para definir el comportamiento de las partículas.
- Gestiona la visualización de metadatos y la información de cada partícula.

## `app.js` - Controlador Principal de la Aplicación
- Configura el canvas y el bucle de animación.
- Crea y administra las partículas.
- Maneja la entrada del usuario (ratón, tacto, teclado).
- Actualiza las estadísticas y gestiona el estado de la interfaz de usuario.
- Dibuja conexiones entre partículas.

# Cómo Usar el Proyecto

1. **Abrir el archivo HTML** en un navegador web para ejecutar la aplicación.
2. **Usar los controles deslizantes** para ajustar:
   - Número de partículas.
   - Radio de conexión (distancia a la que se conectan las partículas).
   - Velocidad de las partículas.
3. **Seleccionar diferentes temas de color** en el menú desplegable.
4. **Interactuar con las partículas**:
   - Pasar el cursor sobre las partículas para ver información.
   - Hacer clic en una partícula para seleccionarla permanentemente.
   - Hacer doble clic en cualquier parte para crear una nueva partícula.
5. **Activar el modo de rendimiento** en dispositivos más lentos si es necesario.
6. **Hacer clic en el botón "?"** para ver más información sobre el proyecto.

# Aspectos Técnicos Destacados

- **Renderizado basado en canvas** para gráficos eficientes.
- **Enfoque orientado a objetos** con una clase `Particle` dedicada.
- **Detección de colisiones optimizada** mediante particionamiento espacial.
- **Diseño responsivo** que funciona en todos los dispositivos.
- **Soporte para entrada táctil y teclado** para accesibilidad.
- **Simulación de física de partículas** con movimiento realista.
- **Sistema dinámico de conexión** entre partículas cercanas.
- **Monitoreo de rendimiento en tiempo real**.
- **Código detallado con comentarios** para facilitar el aprendizaje.

# ¡Si necesitas más detalles sobre el código, estaré encantado de explicarlo más a fondo!

