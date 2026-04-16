/**
 * Temporary mock API service to simulate backend fetch requests.
 */

const mockDepartments = [
  {
    id: 'oral-medicine',
    name: 'Oral Medicine and Radiology',
    headName: 'Dr. Sarah Smith',
    phone: '+91-80-28437401',
    email: 'oralmed@rrdch.org',
    icon: '🦷',
    shortDesc: 'Comprehensive diagnosis and medical management of oro-facial diseases and dental radiology.',
    fullDesc: 'The Department of Oral Medicine and Radiology specializes in the clinical diagnosis and medical management of mucosal diseases, salivary gland disorders, and oro-facial pain. It also provides advanced radio-diagnostic facilities for precise treatment planning.',
    facilities: [
      'Digital Radiography (RVG)',
      'Cone Beam Computed Tomography (CBCT)',
      'Orthopantomogram (OPG)',
      'Intraoral Cameras'
    ],
    postgrad: 'MDS in Oral Medicine and Radiology (3 Years)',
    schedule: 'Monday - Saturday: 9:00 AM - 4:00 PM'
  },
  {
    id: 'prosthodontics',
    name: 'Prosthodontics',
    headName: 'Dr. Rajesh Kumar',
    phone: '+91-80-28437402',
    email: 'prostho@rrdch.org',
    icon: '😁',
    shortDesc: 'Restoration and replacement of missing teeth and oral structures for optimal function and aesthetics.',
    fullDesc: 'Prosthodontics focuses on dental prostheses. We provide crowns, bridges, dentures, and highly advanced implant-supported restorations. Our state-of-the-art lab integrates CAD/CAM technology to deliver precision fittings for our patients.',
    facilities: [
      'CAD/CAM Milling Machine',
      'Ceramic Furnace',
      'Implant Surgical Kits',
      'Maxillofacial Prosthetics Lab'
    ],
    postgrad: 'MDS in Prosthodontics (3 Years)',
    schedule: 'Monday - Saturday: 9:00 AM - 4:00 PM'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    headName: 'Dr. Priya Sharma',
    phone: '+91-80-28437403',
    email: 'ortho@rrdch.org',
    icon: '😬',
    shortDesc: 'Prevention, interception, and correction of malpositioned teeth and jaws.',
    fullDesc: 'Our Orthodontics department uses the latest techniques including clear aligners, self-ligating brackets, and lingual orthodontics to give patients the perfect smile. We treat children, teens, and adults.',
    facilities: [
      'Clear Aligner Fabrication',
      '3D Dental Scanning',
      'Cephalometric Analysis Software'
    ],
    postgrad: 'MDS in Orthodontics (3 Years)',
    schedule: 'Monday - Saturday: 9:00 AM - 4:00 PM'
  },
  {
    id: 'oral-surgery',
    name: 'Oral and Maxillofacial Surgery',
    headName: 'Dr. Arun Patel',
    phone: '+91-80-28437404',
    email: 'surgery@rrdch.org',
    icon: '🏥',
    shortDesc: 'Surgical treatment of diseases, injuries and defects in the head, neck, face, and jaws.',
    fullDesc: 'We handle complex extractions, impacted wisdom teeth, dental implants, jaw surgeries, and facial trauma. The department operates with full general anesthesia capabilities in a dedicated OT setup.',
    facilities: [
      'Major Operation Theatre',
      'Minor Surgical Units',
      'In-patient Ward',
      'Advanced Trauma Care'
    ],
    postgrad: 'MDS in Oral Surgery (3 Years)',
    schedule: 'Emergency: 24/7 | OPD: Mon-Sat 9 AM - 4 PM'
  },
  { id: 'periodontics', name: 'Periodontics', headName: 'Dr. Ritu Verma', phone: '+91-80-28437405', email: 'perio@rrdch.org', icon: '🩸', shortDesc: 'Prevention, diagnosis, and treatment of diseases of the supporting tissues of teeth.', fullDesc: 'Expert care in gum diseases, scaling, root planing, and periodontal surgeries.', facilities: ['Laser Therapy', 'Ultrasonic Scalers'], postgrad: 'MDS in Periodontics', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'conservative', name: 'Conservative Dentistry & Endodontics', headName: 'Dr. Anil Gupta', phone: '+91-80-28437406', email: 'endo@rrdch.org', icon: '🔬', shortDesc: 'Root canal treatments and esthetic restorations of saving natural teeth.', fullDesc: 'Dedicated to saving natural teeth through advanced endodontic therapy and microscopic root canals.', facilities: ['Surgical Microscopes', 'Rotary Endodontics'], postgrad: 'MDS in Conservative Dentistry', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'pedodontics', name: 'Pediatric Dentistry', headName: 'Dr. Sneha Reddy', phone: '+91-80-28437407', email: 'pedo@rrdch.org', icon: '🧸', shortDesc: 'Specialized comprehensive preventive and therapeutic oral health care for infants and children.', fullDesc: 'Child-friendly atmosphere providing early interceptive care and treatments under conscious sedation.', facilities: ['Conscious Sedation Unit', 'Play Therapy Area'], postgrad: 'MDS in Pediatric Dentistry', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'public-health', name: 'Public Health Dentistry', headName: 'Dr. Vikram Singh', phone: '+91-80-28437408', email: 'phd@rrdch.org', icon: '🌍', shortDesc: 'Community oral health promotion and disease prevention.', fullDesc: 'Organizes frequent dental camps and outreach programs focusing on community oral health.', facilities: ['Mobile Dental Van', 'Community Clinic'], postgrad: 'MDS in Public Health', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'oral-pathology', name: 'Oral Pathology and Microbiology', headName: 'Dr. Meena Iyer', phone: '+91-80-28437409', email: 'path@rrdch.org', icon: '🧬', shortDesc: 'Investigation and diagnosis of diseases altering the oral and maxillofacial region.', fullDesc: 'Our pathology lab handles biopsies, cytology, and advanced microbiological assays.', facilities: ['Histopathology Lab', 'Research Microscopes'], postgrad: 'MDS in Oral Pathology', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'implantology', name: 'Implantology', headName: 'Dr. Rajendra Das', phone: '+91-80-28437410', email: 'implants@rrdch.org', icon: '🔩', shortDesc: 'Dedicated unit for advanced dental implant placements.', fullDesc: 'Providing full-mouth rehabilitations using internationally recognized implant systems.', facilities: ['Physiodispensers', 'Piezoelectric surgery kits'], postgrad: 'Fellowship in Implantology', schedule: 'Mon-Sat: 9 AM - 4 PM' },
  { id: 'aesthetics', name: 'Aesthetic Dentistry', headName: 'Dr. Kavitha Rao', phone: '+91-80-28437411', email: 'aesthetic@rrdch.org', icon: '✨', shortDesc: 'Enhancing smiles through veneers, bleaching, and minimally invasive procedures.', fullDesc: 'Focusing on the art of smile design to boost patient confidence.', facilities: ['Bleaching Units', 'Smile Design Software'], postgrad: 'Certificate courses available', schedule: 'Mon-Sat: 9 AM - 4 PM' }
];

const mockEvents = [
  {
    id: 1,
    title: 'Annual Dental Conference 2026',
    date: '2026-10-15',
    time: '09:00 AM',
    location: 'Main Auditorium',
    description: 'A gathering of dental professionals to discuss the latest advancements in technology and patient care.',
    category: 'academic'
  },
  {
    id: 2,
    title: 'Rural Free Checkup Camp',
    date: '2026-11-02',
    time: '10:00 AM',
    location: 'Kumbalgodu Village',
    description: 'Providing free dental screenings and basic treatments to the local rural community.',
    category: 'workshop'
  },
  {
    id: 3,
    title: 'Alumni Meet & Greet',
    date: '2026-12-10',
    time: '06:00 PM',
    location: 'Campus Grounds',
    description: 'Reconnect with old friends and mentors during our annual alumni gathering.',
    category: 'cultural'
  },
  {
    id: 4,
    title: 'Inter-College Sports Meet',
    date: '2026-10-20',
    time: '08:00 AM',
    location: 'Sports Complex',
    description: 'Students from various dental colleges compete in various sporting events.',
    category: 'sports'
  },
  {
    id: 5,
    title: 'Career Guidance Seminar',
    date: '2026-10-25',
    time: '11:00 AM',
    location: 'Seminar Hall 1',
    description: 'Insights into global career opportunities and higher studies for budding dentists.',
    category: 'career'
  },
  { id: 6, title: 'Implants Hands-on Workshop', date: '2026-10-12', time: '09:30 AM', location: 'Implantology Dept', description: 'Practical session on advanced dental implant placement techniques.', category: 'workshop' }
];

let mockComplaints = [
  {
    id: 'CMP-102934',
    name: 'Abhishek Kumar',
    phone: '9876543210',
    email: 'abhishek@gmail.com',
    category: 'maintenance',
    description: 'The bathroom tap in block B room 402 is leaking continuously.',
    status: 'resolved',
    date: '2026-04-10',
    resolutionNotes: 'Tap washer replaced and leak sealed.',
    resolvedDate: '2026-04-12'
  },
  {
    id: 'CMP-102935',
    name: 'Abhishek Kumar',
    phone: '9876543210',
    email: 'abhishek@gmail.com',
    category: 'food',
    description: 'The quality of dinner served on Tuesday was below standards.',
    status: 'open',
    date: '2026-04-14'
  }
];

let mockAppointments = [
  {
    id: 'APT-44201',
    phone: '9876543210',
    name: 'Abhishek Kumar',
    department: 'Orthodontics',
    date: '2026-04-16',
    time: '11:00 AM',
    status: 'confirmed',
    confirmationNumber: 'ORD-99212'
  },
  {
    id: 'APT-44202',
    phone: '9876543210',
    name: 'Abhishek Kumar',
    department: 'Oral Surgery',
    date: '2026-04-10',
    time: '02:30 PM',
    status: 'completed',
    confirmationNumber: 'SRG-88103'
  },
  {
    id: 'APT-44203',
    phone: '9900112233',
    name: 'Suresh Raina',
    department: 'Prosthodontics',
    date: '2026-04-17',
    time: '09:30 AM',
    status: 'scheduled',
    confirmationNumber: 'PRS-11022'
  }
];

const mockAcademics = {
  bds: {
    duration: '5 Years (4 Academic + 1 Internship)',
    intake: '100 Students',
    description: 'Bachelor of Dental Surgery is the primary undergraduate program designed to create skilled dental surgeons.',
    syllabusLink: '/files/bds-syllabus.pdf'
  },
  mds: {
    duration: '3 Years',
    intake: '3-6 Students Per Dept',
    description: 'Master of Dental Surgery offers advanced specialization in various branches of dental medicine.',
    syllabusLink: '/files/mds-syllabus.pdf'
  },
  fellowship: {
    duration: '1 Year',
    intake: '5-10 Students',
    description: 'Advanced clinical fellowships in specialties like Implantology and Aesthetic Dentistry.',
    syllabusLink: '/files/fellowship.pdf'
  }
};

export const getDepartments = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDepartments;
};

export const getDepartmentById = async (id) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const department = mockDepartments.find(d => d.id === id);
  if (!department) throw new Error('Department not found');

  // Get 3 random/related departments (excluding current)
  const related = mockDepartments
    .filter(d => d.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return { department, related };
};

export const getEvents = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockEvents;
};

export const submitComplaint = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const newComplaint = {
    ...formData,
    id: `CMP-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'open',
    date: new Date().toISOString().split('T')[0]
  };
  mockComplaints = [newComplaint, ...mockComplaints];
  return { success: true, complaintId: newComplaint.id };
};

export const getComplaintsByPhone = async (phone) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockComplaints.filter(c => c.phone === phone);
};

export const submitFeedback = async (formData) => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  console.log('Feedback received:', formData);
  return { success: true };
};

export const getAppointmentsByPhone = async (phone) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAppointments.filter(a => a.phone === phone);
};

export const getAcademicsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockAcademics;
};

export const updateAppointmentStatus = async (id, newStatus) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const apt = mockAppointments.find(a => a.id === id);
  if (apt) apt.status = newStatus;
  return { success: true };
};
