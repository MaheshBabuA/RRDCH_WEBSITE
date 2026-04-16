// Seed data mimicking the structure in mockApi.js

const departments = [
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
  }
];

const events = [
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
  }
];

let complaints = [
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
  }
];

let appointments = [
  {
    id: 'APT-44201',
    phone: '9876543210',
    name: 'Abhishek Kumar',
    department: 'Orthodontics',
    date: '2026-04-16',
    time: '11:00 AM',
    status: 'confirmed',
    confirmationNumber: 'ORD-99212'
  }
];

let feedback = [];

const academics = {
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

module.exports = {
  departments,
  events,
  complaints,
  appointments,
  feedback,
  academics
};
