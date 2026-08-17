import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, 'data.json');
const adapter = new JSONFile(file);

const defaultData = {
  users: [],
  admins: [
    // default admin: username "admin" / password "eyecare123" (CHANGE THIS after first login)
    { id: 1, username: 'admin', email: 'admin@eyecare.com', passwordHash: bcrypt.hashSync('eyecare123', 10) }
  ],
  doctors: [
    { id: 1, name: 'Dr. Ahmed Hassan', specialty: 'Ophthalmologist', exp: '15+ Years', img: '/A slim, cheerful young male doctor in a 3D Pixar_Disney animation style_ He has big expressive eyes, smooth skin, and a friendly confident smile. He.jpg', patients: '2500+', education: 'MD from Cairo University', about: 'Dr. Hassan specializes in advanced cataract surgery and refractive procedures.' },
    { id: 2, name: 'Dr. Menna Adel', specialty: 'Retina Specialist', exp: '12+ Years', img: '/animado 3d.jpg', patients: '2100+', education: 'MD from Ain Shams University', about: 'Expert in retinal diseases and diabetic eye care.' },
    { id: 3, name: 'Dr. Omar Khalil', specialty: 'Cornea Specialist', exp: '18+ Years', img: '/images.jpg', patients: '3000+', education: 'MD from Alexandria University', about: 'Leading specialist in corneal transplants and LASIK surgery.' },
    { id: 4, name: 'Dr. Nour Ibrahim', specialty: 'Pediatric Ophthalmologist', exp: '10+ Years', img: '/images1.jpg', patients: '1800+', education: 'MD from Mansoura University', about: "Specialized in children's eye health and vision development." }
  ],
  services: [
    { id: 1, title: 'Surgical Procedures', desc: 'Advanced surgical solutions with state-of-the-art technology', img: '/images1.jpg', fullDesc: 'Wide range of procedures including cataract surgery, LASIK, and corneal transplants.', benefits: ['Minimally invasive', 'Quick recovery', 'High success rate', 'Experienced surgeons'] },
    { id: 2, title: 'Vision Consultation', desc: 'Comprehensive eye examinations and personalized care plans', img: '/images.jpg', fullDesc: 'Complete eye health assessment with digital imaging.', benefits: ['Detailed examination', 'Digital imaging', 'Personalized care', 'Early detection'] },
    { id: 3, title: 'Optical Experience', desc: 'Premium eyewear selection with expert fitting', img: '/images1.jpg', fullDesc: 'Extensive collection of quality frames and lenses.', benefits: ['Quality frames', 'Custom lenses', 'Professional fitting', 'Latest technology'] },
    { id: 4, title: 'Emergency Care', desc: '24/7 emergency eye care for urgent issues', img: '/images.jpg', fullDesc: 'Immediate care for eye injuries and urgent conditions.', benefits: ['24/7 availability', 'Rapid response', 'Expert care', 'Advanced treatment'] },
    { id: 5, title: 'Diagnostics & Testing', desc: 'Advanced diagnostic equipment for accurate assessment', img: '/images1.jpg', fullDesc: 'State-of-the-art diagnostic technology including OCT scans.', benefits: ['Latest technology', 'Accurate diagnosis', 'Comprehensive testing', 'Detailed reports'] },
    { id: 6, title: 'Retina Surgery', desc: 'Specialized retinal procedures by experienced surgeons', img: '/images.jpg', fullDesc: 'Expert treatment for retinal conditions with advanced techniques.', benefits: ['Experienced specialists', 'Advanced procedures', 'High success rate', 'Comprehensive aftercare'] }
  ],
  products: [
    { id: 1, name: 'Eye Check Up', price: '50EGP', oldPrice: '75EGP', img: '/images1.jpg', reviews: 128, description: 'Comprehensive eye examination with vision testing.', features: ['Visual acuity test', 'Eye pressure check', 'Retinal exam', 'Prescription update'] },
    { id: 2, name: 'Eye Testing', price: '75EGP', oldPrice: '100EGP', img: '/images.jpg', reviews: 95, description: 'Advanced diagnostic testing for early detection.', features: ['Digital imaging', 'OCT scanning', 'Visual field test', 'Detailed report'] },
    { id: 3, name: 'Eye Lens', price: '120EGP', oldPrice: '150EGP', img: '/images1.jpg', reviews: 210, description: 'Premium contact lenses with professional fitting.', features: ['Professional fitting', 'Multiple brands', 'Care kit included', 'Follow-up visit'] },
    { id: 4, name: 'RGP Lens Fit', price: '150EGP', oldPrice: '200EGP', img: '/images.jpg', reviews: 156, description: 'Rigid gas permeable lens fitting for better vision.', features: ['Custom fitting', 'Better oxygen flow', 'Sharper vision', 'Durable materials'] }
  ],
  appointments: [],
  orders: [],
  messages: [],
  nextId: { users: 1, doctors: 5, services: 7, products: 5, appointments: 1, orders: 1, messages: 1 }
};

export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  } else {
    db.data.users ??= [];
    db.data.nextId ??= {};
    db.data.nextId.users ??= 1;
    db.data.admins?.forEach(admin => {
      admin.email ??= `${admin.username}@eyecare.com`;
    });
    await db.write();
  }
  return db;
}



export function nextId(collection) {
  const id = db.data.nextId[collection]++;
  return id;
}
