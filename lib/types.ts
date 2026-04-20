export interface Child {
  id: string
  name: string
  dateOfBirth: string
  gender: "male" | "female"
  avatarColor: string
}

export interface Vaccine {
  id: string
  name: string
  description: string
  ageMonths: number
  ageLabel: string
  diseases: string[]
}

export interface VaccinationRecord {
  id: string
  childId: string
  vaccineId: string
  scheduledDate: string
  administeredDate?: string
  status: "completed" | "upcoming" | "overdue" | "missed"
  notes?: string
  administeredBy?: string
  location?: string
}

export interface Reminder {
  id: string
  childId: string
  vaccinationRecordId: string
  reminderDate: string
  type: "email" | "sms" | "push"
  status: "pending" | "sent" | "dismissed"
}

export interface Clinic {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  website?: string
  email?: string
  type: "hospital" | "pediatric" | "pharmacy" | "health_department" | "urgent_care"
  services: string[]
  acceptsInsurance: boolean
  insuranceAccepted?: string[]
  hours: {
    day: string
    open: string
    close: string
  }[]
  rating: number
  reviewCount: number
  distance?: number
  coordinates: {
    lat: number
    lng: number
  }
}

export const VACCINATION_SCHEDULE: Vaccine[] = [
  {
    id: "hepb-1",
    name: "Hepatitis B (1st dose)",
    description: "Protects against Hepatitis B virus infection",
    ageMonths: 0,
    ageLabel: "At birth",
    diseases: ["Hepatitis B"],
  },
  {
    id: "dtap-1",
    name: "DTaP (1st dose)",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
    ageMonths: 2,
    ageLabel: "2 months",
    diseases: ["Diphtheria", "Tetanus", "Pertussis"],
  },
  {
    id: "ipv-1",
    name: "IPV (1st dose)",
    description: "Inactivated Poliovirus Vaccine",
    ageMonths: 2,
    ageLabel: "2 months",
    diseases: ["Polio"],
  },
  {
    id: "hib-1",
    name: "Hib (1st dose)",
    description: "Haemophilus influenzae type b vaccine",
    ageMonths: 2,
    ageLabel: "2 months",
    diseases: ["Haemophilus influenzae type b"],
  },
  {
    id: "pcv-1",
    name: "PCV13 (1st dose)",
    description: "Pneumococcal conjugate vaccine",
    ageMonths: 2,
    ageLabel: "2 months",
    diseases: ["Pneumococcal disease"],
  },
  {
    id: "rv-1",
    name: "Rotavirus (1st dose)",
    description: "Rotavirus vaccine",
    ageMonths: 2,
    ageLabel: "2 months",
    diseases: ["Rotavirus"],
  },
  {
    id: "dtap-2",
    name: "DTaP (2nd dose)",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
    ageMonths: 4,
    ageLabel: "4 months",
    diseases: ["Diphtheria", "Tetanus", "Pertussis"],
  },
  {
    id: "ipv-2",
    name: "IPV (2nd dose)",
    description: "Inactivated Poliovirus Vaccine",
    ageMonths: 4,
    ageLabel: "4 months",
    diseases: ["Polio"],
  },
  {
    id: "hib-2",
    name: "Hib (2nd dose)",
    description: "Haemophilus influenzae type b vaccine",
    ageMonths: 4,
    ageLabel: "4 months",
    diseases: ["Haemophilus influenzae type b"],
  },
  {
    id: "pcv-2",
    name: "PCV13 (2nd dose)",
    description: "Pneumococcal conjugate vaccine",
    ageMonths: 4,
    ageLabel: "4 months",
    diseases: ["Pneumococcal disease"],
  },
  {
    id: "rv-2",
    name: "Rotavirus (2nd dose)",
    description: "Rotavirus vaccine",
    ageMonths: 4,
    ageLabel: "4 months",
    diseases: ["Rotavirus"],
  },
  {
    id: "hepb-2",
    name: "Hepatitis B (2nd dose)",
    description: "Protects against Hepatitis B virus infection",
    ageMonths: 4,
    ageLabel: "1-4 months",
    diseases: ["Hepatitis B"],
  },
  {
    id: "dtap-3",
    name: "DTaP (3rd dose)",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
    ageMonths: 6,
    ageLabel: "6 months",
    diseases: ["Diphtheria", "Tetanus", "Pertussis"],
  },
  {
    id: "ipv-3",
    name: "IPV (3rd dose)",
    description: "Inactivated Poliovirus Vaccine",
    ageMonths: 6,
    ageLabel: "6-18 months",
    diseases: ["Polio"],
  },
  {
    id: "hib-3",
    name: "Hib (3rd dose)",
    description: "Haemophilus influenzae type b vaccine",
    ageMonths: 6,
    ageLabel: "6 months",
    diseases: ["Haemophilus influenzae type b"],
  },
  {
    id: "pcv-3",
    name: "PCV13 (3rd dose)",
    description: "Pneumococcal conjugate vaccine",
    ageMonths: 6,
    ageLabel: "6 months",
    diseases: ["Pneumococcal disease"],
  },
  {
    id: "rv-3",
    name: "Rotavirus (3rd dose)",
    description: "Rotavirus vaccine",
    ageMonths: 6,
    ageLabel: "6 months",
    diseases: ["Rotavirus"],
  },
  {
    id: "hepb-3",
    name: "Hepatitis B (3rd dose)",
    description: "Protects against Hepatitis B virus infection",
    ageMonths: 6,
    ageLabel: "6-18 months",
    diseases: ["Hepatitis B"],
  },
  {
    id: "flu-1",
    name: "Influenza (annual)",
    description: "Seasonal flu vaccine",
    ageMonths: 6,
    ageLabel: "6 months+",
    diseases: ["Influenza"],
  },
  {
    id: "mmr-1",
    name: "MMR (1st dose)",
    description: "Measles, Mumps, and Rubella vaccine",
    ageMonths: 12,
    ageLabel: "12-15 months",
    diseases: ["Measles", "Mumps", "Rubella"],
  },
  {
    id: "var-1",
    name: "Varicella (1st dose)",
    description: "Chickenpox vaccine",
    ageMonths: 12,
    ageLabel: "12-15 months",
    diseases: ["Chickenpox"],
  },
  {
    id: "hepa-1",
    name: "Hepatitis A (1st dose)",
    description: "Protects against Hepatitis A virus infection",
    ageMonths: 12,
    ageLabel: "12-23 months",
    diseases: ["Hepatitis A"],
  },
  {
    id: "pcv-4",
    name: "PCV13 (4th dose)",
    description: "Pneumococcal conjugate vaccine",
    ageMonths: 12,
    ageLabel: "12-15 months",
    diseases: ["Pneumococcal disease"],
  },
  {
    id: "hib-4",
    name: "Hib (4th dose)",
    description: "Haemophilus influenzae type b vaccine",
    ageMonths: 12,
    ageLabel: "12-15 months",
    diseases: ["Haemophilus influenzae type b"],
  },
  {
    id: "hepa-2",
    name: "Hepatitis A (2nd dose)",
    description: "Protects against Hepatitis A virus infection",
    ageMonths: 18,
    ageLabel: "18 months+",
    diseases: ["Hepatitis A"],
  },
  {
    id: "dtap-4",
    name: "DTaP (4th dose)",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
    ageMonths: 15,
    ageLabel: "15-18 months",
    diseases: ["Diphtheria", "Tetanus", "Pertussis"],
  },
  {
    id: "dtap-5",
    name: "DTaP (5th dose)",
    description: "Diphtheria, Tetanus, and Pertussis vaccine",
    ageMonths: 48,
    ageLabel: "4-6 years",
    diseases: ["Diphtheria", "Tetanus", "Pertussis"],
  },
  {
    id: "ipv-4",
    name: "IPV (4th dose)",
    description: "Inactivated Poliovirus Vaccine",
    ageMonths: 48,
    ageLabel: "4-6 years",
    diseases: ["Polio"],
  },
  {
    id: "mmr-2",
    name: "MMR (2nd dose)",
    description: "Measles, Mumps, and Rubella vaccine",
    ageMonths: 48,
    ageLabel: "4-6 years",
    diseases: ["Measles", "Mumps", "Rubella"],
  },
  {
    id: "var-2",
    name: "Varicella (2nd dose)",
    description: "Chickenpox vaccine",
    ageMonths: 48,
    ageLabel: "4-6 years",
    diseases: ["Chickenpox"],
  },
]
