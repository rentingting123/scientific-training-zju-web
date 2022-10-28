export function isEmpty(obj) {
  for (const el in obj) {
    return false
  }
  return true
}

export function getTokenHeader() {
  let Authorization
  let token = localStorage.getItem('login')
  if (token) {
    Authorization = `Bearer ${token}`
  } else {
    Authorization = 'Basic bGFudGluLXdlYjpsYW50aW4td2ViLXNlY3VyaXR5'
  }
  return { Authorization }
}
