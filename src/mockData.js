export const DEFAULT_MEMBERS = [
  {
    id: "LIB-2039",
    name: "Arthur Pendragon",
    email: "arthur.p@camelot.org",
    phone: "(555) 902-1244",
    joinedDate: "2025-01-15",
    avatarColor: "linear-gradient(135deg, #6366f1, #a855f7)"
  },
  {
    id: "LIB-7741",
    name: "Eleanor Vance",
    email: "eleanor.v@hillhouse.net",
    phone: "(555) 304-9812",
    joinedDate: "2025-02-10",
    avatarColor: "linear-gradient(135deg, #10b981, #059669)"
  },
  {
    id: "LIB-1102",
    name: "Harlan Ellison",
    email: "harlan@shatterday.com",
    phone: "(555) 671-3349",
    joinedDate: "2025-03-01",
    avatarColor: "linear-gradient(135deg, #f59e0b, #d97706)"
  },
  {
    id: "LIB-9481",
    name: "Naomi Nagata",
    email: "naomi@rocinante.co",
    phone: "(555) 881-2093",
    joinedDate: "2025-03-24",
    avatarColor: "linear-gradient(135deg, #ec4899, #db2777)"
  },
  {
    id: "LIB-5567",
    name: "Winston Smith",
    email: "winston@recorddep.gov",
    phone: "(555) 198-4000",
    joinedDate: "2025-04-12",
    avatarColor: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
  }
];

export const DEFAULT_BOOKS = [
  {
    id: "book-1",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "978-0261102217",
    year: "1937",
    language: "English",
    description: "A beautiful, adventurous fantasy classic following Bilbo Baggins as he is swept into a dangerous quest to reclaim a lost kingdom.",
    coverUrl: "linear-gradient(135deg, #312e81, #1e1b4b)",
    status: "Available",
    borrowedBy: null,
    borrowDate: null,
    dueDate: null,
    reservations: []
  },
  {
    id: "book-2",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    isbn: "978-0441172719",
    year: "1965",
    language: "English",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
    coverUrl: "linear-gradient(135deg, #78350f, #451a03)",
    status: "Borrowed",
    borrowedBy: "LIB-9481",
    borrowDate: "2026-05-10",
    dueDate: "2026-05-24", // Mocked as overdue (since local date is 2026-05-26)
    reservations: []
  },
  {
    id: "book-3",
    title: "Neuromancer",
    author: "William Gibson",
    genre: "Cyberpunk",
    isbn: "978-0441569595",
    year: "1984",
    language: "English",
    description: "The matrix is a world within a world, a consensus hallucination, the playground of elite computer hackers who crack security codes.",
    coverUrl: "linear-gradient(135deg, #064e3b, #022c22)",
    status: "Available",
    borrowedBy: null,
    borrowDate: null,
    dueDate: null,
    reservations: ["LIB-2039"]
  },
  {
    id: "book-4",
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    genre: "Dystopian",
    isbn: "978-0451524935",
    year: "1949",
    language: "English",
    description: "A terrifyingly prescient vision of a totalitarian society where thought crime is the ultimate transgression and Big Brother is always watching.",
    coverUrl: "linear-gradient(135deg, #7f1d1d, #450a0a)",
    status: "Borrowed",
    borrowedBy: "LIB-5567",
    borrowDate: "2026-05-20",
    dueDate: "2026-06-03", // Active borrow
    reservations: []
  },
  {
    id: "book-5",
    title: "Foundation",
    author: "Isaac Asimov",
    genre: "Science Fiction",
    isbn: "978-0553293357",
    year: "1951",
    language: "English",
    description: "The story of the Galactic Empire's collapse and the courageous effort of Hari Seldon and his band of scientists to preserve knowledge.",
    coverUrl: "linear-gradient(135deg, #1e3a8a, #172554)",
    status: "Available",
    borrowedBy: null,
    borrowDate: null,
    dueDate: null,
    reservations: []
  },
  {
    id: "book-6",
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    genre: "Science Fiction",
    isbn: "978-0441478125",
    year: "1969",
    language: "English",
    description: "A human envoy is sent to Gethen, a planet where inhabitants have no fixed gender, in order to convince them to join a galactic coalition.",
    coverUrl: "linear-gradient(135deg, #4c1d95, #2e1065)",
    status: "Available",
    borrowedBy: null,
    borrowDate: null,
    dueDate: null,
    reservations: []
  }
];

export const DEFAULT_TRANSACTIONS = [
  {
    id: "tx-1",
    bookTitle: "Dune",
    memberName: "Naomi Nagata",
    type: "borrow",
    date: "2026-05-10",
    status: "overdue"
  },
  {
    id: "tx-2",
    bookTitle: "Nineteen Eighty-Four",
    memberName: "Winston Smith",
    type: "borrow",
    date: "2026-05-20",
    status: "active"
  },
  {
    id: "tx-3",
    bookTitle: "The Hobbit",
    memberName: "Arthur Pendragon",
    type: "return",
    date: "2026-05-18",
    status: "completed"
  },
  {
    id: "tx-4",
    bookTitle: "Neuromancer",
    memberName: "Arthur Pendragon",
    type: "reserve",
    date: "2026-05-22",
    status: "completed"
  }
];
