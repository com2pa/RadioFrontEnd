import { 
  FiHome, 
  FiRadio, 
  FiBookOpen, 
  FiUsers, 
  FiMail, 
  FiInfo,
  FiMusic,
  FiMic,
  FiCalendar,
  FiHeadphones
} from 'react-icons/fi'

export const publicMenuItems = [
  {
    id: 'home',
    label: 'Inicio',
    href: '/',
    icon: FiHome,
    description: 'Página principal'
  },
  {
    id: 'about',
    label: 'Quiénes Somos',
    href: '/about',
    icon: FiInfo,
    description: 'Conoce más sobre OXÍ Radio'
  },
  {
    id: 'programs',
    label: 'Programas',
    href: '/programs',
    icon: FiRadio,
    description: 'Nuestra programación'
  },
  {
    id: 'podcasts',
    label: 'Podcasts',
    href: '/podcasts',
    icon: FiHeadphones,
    description: 'Escucha nuestros podcasts'
  },
  {
    id: 'news',
    label: 'Noticias',
    href: '/news',
    icon: FiBookOpen,
    description: 'Últimas noticias'
  },
  {
    id: 'events',
    label: 'Eventos',
    href: '/events',
    icon: FiCalendar,
    description: 'Próximos eventos'
  },
  {
    id: 'contact',
    label: 'Contacto',
    href: '/contact',
    icon: FiMail,
    description: 'Ponte en contacto'
  }
]

export const getPublicMenuItems = () => {
  return publicMenuItems
}

export const addPublicMenuItem = (newItem) => {
  publicMenuItems.push(newItem)
}

export const updatePublicMenuItem = (id, updatedItem) => {
  const index = publicMenuItems.findIndex(item => item.id === id)
  if (index !== -1) {
    publicMenuItems[index] = { ...publicMenuItems[index], ...updatedItem }
  }
}

export const deletePublicMenuItem = (id) => {
  const index = publicMenuItems.findIndex(item => item.id === id)
  if (index !== -1) {
    publicMenuItems.splice(index, 1)
  }
}
