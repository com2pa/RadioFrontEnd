// Validaciones con regex para el formulario de registro

export const validationRules = {
  name: {
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    message: 'El nombre debe tener entre 2 y 50 caracteres, solo letras'
  },
  lastname: {
    regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    message: 'El apellido debe tener entre 2 y 50 caracteres, solo letras'
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresa un email válido'
  },
  password: {
    regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,15}$/,
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
  },
  address: {
    regex: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s#.,-]{10,100}$/,
    message: 'La dirección debe tener entre 10 y 100 caracteres'
  },
  phone: {
    regex: /^[0](212|412|414|424|416|426)[0-9]{7}$/,
    message: 'Ingresa un número de teléfono válido (10 dígitos)'
  },
  age: {
    regex: /^(1[8-9]|[2-9][0-9]|1[0-2][0-9])$/,
    message: 'Debes ser mayor de 18 años y menor de 130 años'
  }
}

// Función para validar un campo
export const validateField = (fieldName, value) => {
  const rule = validationRules[fieldName]
  if (!rule) return { isValid: true, message: '' }
  
  const isValid = rule.regex.test(value)
  return {
    isValid,
    message: isValid ? '' : rule.message
  }
}

// Función para validar todo el formulario
export const validateForm = (formData) => {
  const errors = {}
  let isValid = true

  Object.keys(validationRules).forEach(field => {
    const validation = validateField(field, formData[field] || '')
    if (!validation.isValid) {
      errors[field] = validation.message
      isValid = false
    }
  })

  return { isValid, errors }
}
