# Vue 3 Template con Atomic Design y Feature Structure

Este proyecto utiliza Vue 3 y organiza los componentes siguiendo los principios de Atomic Design y la estructura modular de Feature Structure. Este enfoque busca mantener un código organizado, escalable y fácil de mantener.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas antes de comenzar:

- Node.js v22.14.0

- npm

## Instalación y ejecución

1. **Instalar las dependencias:** Ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias necesarias:

```bash
npm install
```

2. **Variables de entorno:** El proyecto utiliza Vite para la gestión de variables de entorno y almacena las configuraciones personalizadas en un archivo .env.local. Este archivo no se incluye en el control de versiones por seguridad, por lo que cada desarrollador debe crearlo manualmente.

<br>

Para configurar las variables de entorno, copia las variables de .env.example a .env.local. Por ejemplo:

```bash
VITE_ADMIN_API = http://localhost:3000/api
VITE_AUTH_API = http://localhost:3000/auth
```

3. **Ejecución del Proyecto:** Para iniciar el servidor de desarrollo (por defecto en el puerto 5173):

```bash
npm run dev
```

Para construir la aplicación:

```bash
npm run build
```

Con esta configuración, el proyecto estará listo para ejecutarse.

## Estructura del Proyecto

El proyecto está dividido en dos principales enfoques:

### Atomic Design

El patrón de diseño Atomic Design proporciona un enfoque estructurado para la organización de los componentes de UI, dividiéndolos según su nivel de abstracción. Esto asegura que los elementos reutilizables y genéricos se mantengan correctamente separados, promoviendo la coherencia en el desarrollo de la interfaz de usuario.

#### Niveles de Abstracción:

- Átomos: Son los elementos más básicos de la interfaz de usuario. Incluyen botones, etiquetas, iconos, inputs, colores, tipografías y normativas de diseño.
- Moléculas: Son combinaciones de átomos que conforman una unidad funcional reutilizable. Ejemplo: un campo de búsqueda compuesto por un input y un botón.
- Organismos: Son estructuras más complejas que combinan múltiples moléculas para formar secciones funcionales dentro de una página. Ejemplo: una barra de navegación o un formulario de inicio de sesión.
- Templates: Son estructuras que organizan organismos dentro de un wireframe, definiendo la disposición de los elementos en la vista sin incluir datos específicos.
- Páginas: Representan el diseño final con datos reales, combinando templates con información dinámica de la aplicación.

Esta metodología mejora la mantenibilidad del código y la escalabilidad del diseño, permitiendo una fácil modificación y reutilización de componentes en diferentes partes del proyecto.

### Feature Structure

El enfoque Feature Structure organiza el proyecto en función de funcionalidades específicas, agrupando todos los archivos relacionados dentro de una misma carpeta. Esto permite un desarrollo modular, donde cada feature es independiente y contiene todos los elementos necesarios para su funcionamiento.

#### Estructura por Feature

Cada feature está compuesta por los siguientes elementos:

- Componentes: Estructurados siguiendo el patrón Atomic Design (átomos, moléculas, organismos, templates y páginas).
- Rutas: Definidas en un archivo de rutas específico para la feature.
- Servicios: Archivo encargado de las llamadas a la API y gestión de datos.
- Store (opcional): Si la feature requiere manejo de estado, se define un store de Pinia dentro de su módulo correspondiente.
- Assets: Contiene imágenes, archivos estáticos o estilos específicos de la feature.

### Estructura actual

```
|-- App.vue
|-- assets
|   `-- css
|       `-- global.css
|-- features
|   |-- admin
|   |   |-- api
|   |   |   `-- UserService.js
|   |   |-- assets
|   |   |   |-- css
|   |   |   |   |-- SidePanel.css
|   |   |   |   |-- UserForm.css
|   |   |   |   `-- UsersTable.css
|   |   |   `-- images
|   |   |-- components
|   |   |   |-- atoms
|   |   |   |   |-- BaseAlert.vue
|   |   |   |   |-- BaseButton.vue
|   |   |   |   `-- BaseInput.vue
|   |   |   |-- molecules
|   |   |   |   `-- SearchBar.vue
|   |   |   |-- organisms
|   |   |   |   |-- SidePanel.vue
|   |   |   |   |-- UserFormModal.vue
|   |   |   |   `-- UsersTable.vue
|   |   |   |-- templates
|   |   |   |   `-- UserTemplate.vue
|   |   |   `-- views
|   |   |       `-- UserPage.vue
|   |   `-- routes
|   |       `-- AdminRoute.js
|   `-- auth
|       |-- api
|       |   `-- AuthService.js
|       |-- assets
|       |   `-- images
|       |-- components
|       |   |-- atoms
|       |   |   |-- BaseButton.vue
|       |   |   `-- BaseInput.vue
|       |   |-- molecules
|       |   |   |-- LoginForm.vue
|       |   |   `-- RegisterForm.vue
|       |   |-- organisms
|       |   |   |-- LoginCard.vue
|       |   |   `-- RegisterCard.vue
|       |   `-- templates
|       |       `-- AuthTemplate.vue
|       |-- routes
|       |   `-- AuthRoute.js
|       `-- views
|           |-- LoginPage.vue
|           `-- RegisterPage.vue
|-- main.js
|-- router
|   `-- index.js
|-- stores
|   |-- AuthStore.js
|   `-- index.js
`-- utils
    `-- validations
        `-- UserValidation.js

```

### Manejo de estados

Para la gestión del estado global, se utiliza Vuex como biblioteca principal. Su implementación se centra en la administración de tokens JWT, en combinación con localStorage, para garantizar un acceso eficiente y evitar la duplicación de código.

<br>

El estado global está centralizado en el archivo store/index.js, desde donde se definen los módulos de Vuex para facilitar la organización y escalabilidad del proyecto.

<br>

La modularización del estado se maneja de la siguiente manera:

- Estado Global: Se define en store/index.js cuando se requiere acceso a la información en toda la aplicación.
- Estado por Feature: Se define dentro de módulos específicos dentro de feature/{feature}/store, si solo es necesario para una funcionalidad particular.

### Manejo de routers

Cada feature gestiona sus propias rutas y permisos de acceso. Para mantener una estructura organizada:

- Existe un archivo de configuración global (router/index.js) donde se centralizan todas las rutas de la aplicación.
- Dentro del archivo principal (main.js), se realiza la carga de estas rutas para su integración en el proyecto.
- El archivo global de rutas también es responsable de la validación de permisos mediante atributos meta, garantizando el acceso adecuado según las reglas de negocio.

### Manejo de recursos

Los archivos estáticos (imágenes, hojas de estilo, fuentes, etc.) se organizan en el directorio assets:

- Globales: Se almacenan en src/assets cuando se comparten entre múltiples features.
- Específicos de una feature: Se almacenan en src/features/{feature}/assets cuando solo son utilizados por una funcionalidad específica.

#### Estilos y Tailwind CSS

El proyecto utiliza Tailwind CSS como framework principal, combinado con archivos CSS personalizados para estilos globales y específicos.

### Autorización de recursos

El control de acceso a las rutas se implementa a través de permisos definidos en los atributos meta de cada ruta dentro de su respectivo módulo.
<br>

Para garantizar la seguridad:

1. Cada ruta debe incluir un atributo meta con información sobre los permisos requeridos.
2. En el archivo router/index.js, se implementa un navigation guard que verifica los permisos antes de permitir el acceso.
3. Se consulta el estado de autenticación desde AuthStore, validando el token y los permisos del usuario.

Ejemplo de configuración de ruta con permisos:

```js
import UserPage from '../components/views/UserPage.vue'

const adminRoutes = [{ path: '/users', component: UserPage, meta: { requiresAuth: true } }]

export default adminRoutes
```

Y en el router/index.js:

```js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import authRoutes from '@/features/auth/routes/AuthRoute'
import adminRoutes from '@/features/admin/routes/AdminRoute'

const routes = [...authRoutes, ...adminRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const AuthStore = useAuthStore()
  if (to.meta.requiresAuth && !AuthStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

### Sesiones de usuario

La sesión de usuario se gestiona combinando Pinia con localStorage.

- El token JWT se almacena en localStorage y se accede desde AuthStore para validar la autenticación en toda la aplicación.
- Al iniciar sesión, se almacena el token y la información del usuario.
- Al cerrar sesión, se eliminan los datos del almacenamiento.

### API

#### Endpoints

Los endpoints de la API se definen dentro de las variables de entorno. El archivo .env.example proporciona un modelo de cómo deben declararse:

```
VITE_API_BASE_URL=https://api.ejemplo.com
```

#### Servicios

Para las solicitudes a la API, se utiliza Axios con una configuración centralizada:

- Se define un cliente Axios con los encabezados necesarios.
- Se implementa un manejador de errores con try/catch.
- En caso de error, se utiliza SweetAlert2 para mostrar mensajes al usuario.

Ejemplo de configuración del cliente API:

```js
import axios from 'axios'
import Swal from 'sweetalert2'

const ADMIN_API = import.meta.env.VITE_ADMIN_API

const apiClient = axios.create({
  baseURL: ADMIN_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function getUsers() {
  try {
    const users = await apiClient.get('/users')
    return users.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    })
  }
}
```

### Diseño

Se deben de seguir los lineamientos definidos dentro de la pag [Guía de estilos](https://cajamorelia.atlassian.net/wiki/spaces/CZT/pages/3277291522/Gu+a+de+Estilos+de+Dise+o+Gr+fico)

### Nombramiento de componentes

Para mantener una estructura uniforme en la nomenclatura de los componentes, se siguen las siguientes reglas:

- Uso de CamelCase: Los nombres deben escribirse en CamelCase, con la primera letra en mayúscula.
- Mínimo dos palabras: Para evitar colisiones con etiquetas HTML nativas, cada componente debe tener al menos dos palabras.
- Estructura descriptiva: El nombre del componente debe reflejar claramente su propósito y función.

Ejemplos de nombres correctos:

- ✅ UserProfile.vue
- ✅ AdminDashboard.vue
- ✅ LoginForm.vue

Ejemplos incorrectos:

- ❌ profile.vue (No usa CamelCase y es demasiado genérico)
- ❌ Form.vue (No es descriptivo ni tiene dos palabras)

### Manejo de datos

Para la gestión de datos en el proyecto, se utiliza TanStack Query (Vue Query), optimizando el almacenamiento en caché y la sincronización automática con la API. Esto permite reducir solicitudes innecesarias y mejorar la eficiencia en la carga de datos, especialmente en tablas y listados dinámicos.

### Testing

El proyecto utiliza Cypress para la automatización de pruebas E2E, asegurando la estabilidad y funcionalidad de la aplicación en entornos reales. Se implementa el patrón de diseño Page Object Model (POM) para mantener un código modular y reutilizable, mejorando la mantenibilidad de las pruebas.

<br>

Cada página o componente clave tiene una clase POM dedicada dentro de cypress/pages/, encapsulando selectores y métodos de interacción. Las pruebas E2E se organizan dentro de cypress/e2e/, donde los archivos de prueba importan las clases POM correspondientes para ejecutar escenarios de usuario de forma estructurada.

### Formularios

El proyecto utiliza FormKit para la gestión de formularios, proporcionando validaciones, manejo de estados y estructuras reutilizables. Se han definido custom inputs integrando Vuetify para aprovechar sus componentes y estilos, asegurando una experiencia de usuario consistente.

<br>

Los inputs personalizados se registran globalmente dentro de src/components/atoms/{FieldForm} y pueden ser reutilizados en cualquier formulario dentro del proyecto. Se recomienda definir validaciones en el esquema de FormKit y utilizar validation-messages para estandarizar los mensajes de error.

#### Ejemplo de input personalizado:

```js
<script setup>
const props = defineProps({
  context: Object,
})

function handleInput(e) {
  props.context.node.input(e.target.value)
}
</script>

<template>
  <v-text-field
    :model-value="context.value"
    :id="context.id"
    :label="context.attrs['vuetify-label']"
    @input="handleInput"
    v-bind="context.attrs"
    clearable
    hide-details
    type="password"
  />
</template>
```

#### Ejemplo de implementación del input:

```js
<FormKit
  type="PasswordFieldForm"
  name="password"
  vuetify-label="Password"
  placeholder="Enter your password"
  outer-class="mb-4"
/>
```

Cabe resaltar que estos inputs personalizados se deben de registrar dentro del proyecto en el archivo main.

### Manejo de Modos de Desarrollo y Variables de Entorno con Vite

En el package.json se añadieron scripts específicos para compilar en cada modo, por ejemplo, npm run build:staging ejecuta vite build --mode staging, asegurando que se carguen las variables correctas. Todas las variables deben llevar el prefijo VITE\_ para que sean accesibles dentro del código con import.meta.env.VITE_NOMBRE_VARIABLE.

<br>

Para mantener claridad y evitar configuraciones incorrectas, se usa un archivo .env.example con la estructura de las variables necesarias..
