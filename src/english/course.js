// Public learning content only. Answers remain on the server.
export const levels=[
  {
    "id": "A1",
    "name": "Primeras palabras",
    "subtitle": "Construye tu base",
    "description": "Preséntate, habla de tu rutina y empieza a conectar.",
    "color": "#c9edbc",
    "topics": [
      "Presentaciones",
      "Vida cotidiana",
      "Preguntas básicas"
    ]
  },
  {
    "id": "A2",
    "name": "Un poco más lejos",
    "subtitle": "Gana confianza",
    "description": "Cuenta lo que pasó y prepara tu próxima aventura.",
    "color": "#f4e5ab",
    "topics": [
      "Pasado simple",
      "Planes",
      "En la ciudad"
    ]
  },
  {
    "id": "B1",
    "name": "Tu propia voz",
    "subtitle": "Conversa con autonomía",
    "description": "Comparte experiencias, opiniones y posibilidades.",
    "color": "#c6dbf9",
    "topics": [
      "Experiencias",
      "Condicionales",
      "Opiniones"
    ]
  },
  {
    "id": "B2",
    "name": "Sin perder el hilo",
    "subtitle": "Expresa ideas complejas",
    "description": "Argumenta con claridad y descubre nuevos matices.",
    "color": "#dcccf4",
    "topics": [
      "Argumentación",
      "Voz pasiva",
      "Estilo indirecto"
    ]
  },
  {
    "id": "C1",
    "name": "Más allá de las palabras",
    "subtitle": "Encuentra el matiz",
    "description": "Adapta tu registro y comunica ideas con precisión.",
    "color": "#f4cdbc",
    "topics": [
      "Inversión",
      "Registro",
      "Cohesión"
    ]
  },
  {
    "id": "C2",
    "name": "Cada matiz cuenta",
    "subtitle": "Afina tu expresión",
    "description": "Explora inferencias, énfasis y lenguaje idiomático.",
    "color": "#c7e6df",
    "topics": [
      "Inferencias",
      "Énfasis",
      "Expresiones idiomáticas"
    ]
  }
];
export const units=[
  {
    "id": "a1-meet",
    "number": 1,
    "title": "Hello, world!",
    "goal": "Presentarte, deletrear y pedir ayuda.",
    "emoji": "👋",
    "color": "#7957e8",
    "tint": "#f1ebff",
    "level": "A1"
  },
  {
    "id": "a1-numbers",
    "number": 2,
    "title": "Números que conectan",
    "goal": "Dar tu edad, teléfono, fecha y hora.",
    "emoji": "🔢",
    "color": "#df7930",
    "tint": "#fff0df",
    "level": "A1"
  },
  {
    "id": "a1-people",
    "number": 3,
    "title": "Mi gente y yo",
    "goal": "Hablar de tu familia y describir personas.",
    "emoji": "🧑‍🤝‍🧑",
    "color": "#df548e",
    "tint": "#ffebf3",
    "level": "A1"
  },
  {
    "id": "a1-home",
    "number": 4,
    "title": "Un lugar para llamar hogar",
    "goal": "Describir habitaciones y ubicar tus cosas.",
    "emoji": "🏡",
    "color": "#159e91",
    "tint": "#e0f7f2",
    "level": "A1"
  },
  {
    "id": "a1-routine",
    "number": 5,
    "title": "Así es mi día",
    "goal": "Contar tu rutina y hacer preguntas.",
    "emoji": "☀️",
    "color": "#b68208",
    "tint": "#fff5d3",
    "level": "A1"
  },
  {
    "id": "a1-life",
    "number": 6,
    "title": "Lo que me mueve",
    "goal": "Hablar de gustos, habilidades y actividades.",
    "emoji": "🎨",
    "color": "#7760d7",
    "tint": "#eeeaff",
    "level": "A1"
  },
  {
    "id": "a1-food",
    "number": 7,
    "title": "A la mesa",
    "goal": "Pedir comida, expresar cantidades y comprar.",
    "emoji": "🍋",
    "color": "#7c9c18",
    "tint": "#f0f6d9",
    "level": "A1"
  },
  {
    "id": "a1-city",
    "number": 8,
    "title": "Un mundo ahí fuera",
    "goal": "Pedir direcciones y moverte por la ciudad.",
    "emoji": "🗺️",
    "color": "#3687d2",
    "tint": "#e6f2ff",
    "level": "A1"
  },
  {
    "id": "a1-shopping",
    "number": 9,
    "title": "Pequeñas decisiones",
    "goal": "Elegir ropa, preguntar precios y comparar opciones básicas.",
    "emoji": "🛍️",
    "color": "#cf5e42",
    "tint": "#fff0e8",
    "level": "A1"
  },
  {
    "id": "a1-everyday",
    "number": 10,
    "title": "Ya puedo comunicarme",
    "goal": "Resolver necesidades y conectar lo aprendido.",
    "emoji": "🚀",
    "color": "#435fcb",
    "tint": "#ebefff",
    "level": "A1"
  }
];
export const lessons=[
  {
    "unit": 0,
    "title": "Hello! Nice to meet you",
    "goal": "Saludar, despedirte y decir tu nombre.",
    "explanation": "Hello y hi sirven para saludar. Good morning se usa por la mañana y good evening al llegar por la noche. Para presentarte usa I am o I’m + nombre; responde Nice to meet you cuando conoces a alguien.",
    "words": [
      {
        "word": "hello",
        "meaning": "hola"
      },
      {
        "word": "goodbye",
        "meaning": "adiós"
      },
      {
        "word": "morning",
        "meaning": "mañana, parte del día"
      },
      {
        "word": "name",
        "meaning": "nombre"
      }
    ],
    "task": "Di tu nombre y saluda de dos maneras. Después escribe una presentación de dos frases.",
    "id": "a1-u01-l1",
    "level": "A1",
    "unitId": "a1-meet",
    "unitNumber": 1,
    "number": 1,
    "duration": 20,
    "example": "Hello! My name is Sara. I am a student. This is my friend Ben.",
    "translation": "¡Hola! Me llamo Sara. Soy estudiante. Este es mi amigo Ben.",
    "word": "hello",
    "meaning": "hola",
    "audio": "/audio/a1-u01-l1.wav"
  },
  {
    "unit": 0,
    "title": "The alphabet",
    "goal": "Deletrear tu nombre y reconocer letras.",
    "explanation": "Para pedir que alguien deletree usa How do you spell…? Puedes responder letra por letra. Para confirmar lo oído, repite las letras y pregunta Is that right? En inglés E se pronuncia /iː/ e I se pronuncia /aɪ/.",
    "words": [
      {
        "word": "spell",
        "meaning": "deletrear"
      },
      {
        "word": "letter",
        "meaning": "letra"
      },
      {
        "word": "surname",
        "meaning": "apellido"
      },
      {
        "word": "repeat",
        "meaning": "repetir"
      }
    ],
    "task": "Deletrea tu nombre y apellido en voz alta. Escribe una pregunta para pedir un deletreo.",
    "id": "a1-u01-l2",
    "level": "A1",
    "unitId": "a1-meet",
    "unitNumber": 1,
    "number": 2,
    "duration": 20,
    "example": "First name: Eva. Surname: Green. Eva is spelled E–V–A.",
    "translation": "Nombre: Eva. Apellido: Green. Eva se deletrea E–V–A.",
    "word": "spell",
    "meaning": "deletrear",
    "audio": "/audio/a1-u01-l2.wav"
  },
  {
    "unit": 0,
    "title": "Where are you from?",
    "goal": "Decir tu país y preguntar de dónde es alguien.",
    "explanation": "Usa I’m from + país para tu origen y I live in + ciudad para tu residencia. Para preguntar invierte be: Where are you from? Con he o she usa is. País y nacionalidad son palabras diferentes: Spain / Spanish.",
    "words": [
      {
        "word": "country",
        "meaning": "país"
      },
      {
        "word": "city",
        "meaning": "ciudad"
      },
      {
        "word": "from",
        "meaning": "de, indicando origen"
      },
      {
        "word": "live",
        "meaning": "vivir"
      }
    ],
    "task": "Escribe tu país y ciudad. Pregunta a una persona imaginaria de dónde es.",
    "id": "a1-u01-l3",
    "level": "A1",
    "unitId": "a1-meet",
    "unitNumber": 1,
    "number": 3,
    "duration": 20,
    "example": "My name is Nina. I am from Italy. I live in Bogotá now.",
    "translation": "Me llamo Nina. Soy de Italia. Ahora vivo en Bogotá.",
    "word": "country",
    "meaning": "país",
    "audio": "/audio/a1-u01-l3.wav"
  },
  {
    "unit": 0,
    "title": "Can you say that again?",
    "goal": "Pedir repetición y decir que no entiendes.",
    "explanation": "Please hace una petición más cortés. Usa Can you repeat that, please? o Can you speak slowly? Para expresar dificultad di I don’t understand. No necesitas entender todo para pedir ayuda y mantener una conversación.",
    "words": [
      {
        "word": "please",
        "meaning": "por favor"
      },
      {
        "word": "slowly",
        "meaning": "despacio"
      },
      {
        "word": "understand",
        "meaning": "entender"
      },
      {
        "word": "help",
        "meaning": "ayudar"
      }
    ],
    "task": "Simula una conversación: saluda, di tu nombre, deletrea y pide una repetición.",
    "id": "a1-u01-l4",
    "level": "A1",
    "unitId": "a1-meet",
    "unitNumber": 1,
    "number": 4,
    "duration": 20,
    "example": "Teacher: Open your book. Student: Sorry, I don’t understand. Can you repeat that, please?",
    "translation": "Profesor: Abre el libro. Estudiante: Perdón, no entiendo. ¿Puedes repetirlo, por favor?",
    "word": "please",
    "meaning": "por favor",
    "audio": "/audio/a1-u01-l4.wav"
  },
  {
    "unit": 1,
    "title": "Numbers and ages",
    "goal": "Entender números y decir tu edad.",
    "explanation": "La edad en inglés se expresa con be: I am twenty, no I have twenty. Pregunta How old are you? Fifteen es 15 y fifty es 50: escucha el final -teen y el acento para distinguirlos.",
    "words": [
      {
        "word": "fifteen",
        "meaning": "quince"
      },
      {
        "word": "fifty",
        "meaning": "cincuenta"
      },
      {
        "word": "twenty",
        "meaning": "veinte"
      },
      {
        "word": "age",
        "meaning": "edad"
      }
    ],
    "task": "Di tu edad. Practica 13/30, 14/40 y 15/50 sin mirar los números.",
    "id": "a1-u02-l1",
    "level": "A1",
    "unitId": "a1-numbers",
    "unitNumber": 2,
    "number": 5,
    "duration": 20,
    "example": "Tom is 19. His sister Beth is 16. Their father is 50.",
    "translation": "Tom tiene 19 años. Su hermana Beth tiene 16. Su padre tiene 50.",
    "word": "fifteen",
    "meaning": "quince",
    "audio": "/audio/a1-u02-l1.wav"
  },
  {
    "unit": 1,
    "title": "My phone number",
    "goal": "Compartir un teléfono y datos de contacto.",
    "explanation": "Los números de teléfono se suelen decir dígito a dígito. Zero puede oírse como oh. Para pedir un contacto usa What’s your phone number? Para confirmar: Is that…? Escucha y repite antes de anotar.",
    "words": [
      {
        "word": "phone",
        "meaning": "teléfono"
      },
      {
        "word": "number",
        "meaning": "número"
      },
      {
        "word": "zero",
        "meaning": "cero"
      },
      {
        "word": "email address",
        "meaning": "dirección de correo electrónico"
      }
    ],
    "task": "Dicta seis dígitos y compruébalos. Escribe un mensaje sencillo con un contacto ficticio.",
    "id": "a1-u02-l2",
    "level": "A1",
    "unitId": "a1-numbers",
    "unitNumber": 2,
    "number": 6,
    "duration": 20,
    "example": "Contact: Alex Park. Phone: 472 609. Email: alex@example.com.",
    "translation": "Contacto: Alex Park. Teléfono: 472 609. Correo: alex@example.com.",
    "word": "phone",
    "meaning": "teléfono",
    "audio": "/audio/a1-u02-l2.wav"
  },
  {
    "unit": 1,
    "title": "Days and dates",
    "goal": "Identificar días, meses y fechas.",
    "explanation": "Los días y meses se escriben con mayúscula: Monday, June. Usa on para días y fechas (on Friday), in para meses (in April). Para cumpleaños pregunta When is your birthday? Primero identifica qué tipo de fecha necesitas.",
    "words": [
      {
        "word": "Monday",
        "meaning": "lunes"
      },
      {
        "word": "Friday",
        "meaning": "viernes"
      },
      {
        "word": "birthday",
        "meaning": "cumpleaños"
      },
      {
        "word": "month",
        "meaning": "mes"
      }
    ],
    "task": "Escribe tu calendario con tres días y un mes. Di cuándo es tu cumpleaños.",
    "id": "a1-u02-l3",
    "level": "A1",
    "unitId": "a1-numbers",
    "unitNumber": 2,
    "number": 7,
    "duration": 20,
    "example": "The English class is on Tuesday. The next holiday is in August. Eva’s birthday is in March.",
    "translation": "La clase de inglés es el martes. Las próximas vacaciones son en agosto. El cumpleaños de Eva es en marzo.",
    "word": "Monday",
    "meaning": "lunes",
    "audio": "/audio/a1-u02-l3.wav"
  },
  {
    "unit": 1,
    "title": "What time is it?",
    "goal": "Preguntar la hora y comprender horarios.",
    "explanation": "Usa What time is it? y responde It’s + hora. Half past seven es 7:30; a quarter past seven es 7:15. Para una actividad usa at: The class starts at nine. También puedes decir seven thirty.",
    "words": [
      {
        "word": "half past",
        "meaning": "y media"
      },
      {
        "word": "quarter past",
        "meaning": "y cuarto"
      },
      {
        "word": "early",
        "meaning": "temprano"
      },
      {
        "word": "late",
        "meaning": "tarde, con retraso"
      }
    ],
    "task": "Di la hora de tres actividades de tu día. Lee un horario y explica cuándo empieza una clase.",
    "id": "a1-u02-l4",
    "level": "A1",
    "unitId": "a1-numbers",
    "unitNumber": 2,
    "number": 8,
    "duration": 20,
    "example": "The café opens at 8:00. The English lesson starts at 9:30 and finishes at 10:30.",
    "translation": "El café abre a las ocho. La clase de inglés empieza a las nueve y media y termina a las diez y media.",
    "word": "half past",
    "meaning": "y media",
    "audio": "/audio/a1-u02-l4.wav"
  },
  {
    "unit": 2,
    "title": "My family",
    "goal": "Nombrar familiares y expresar relaciones.",
    "explanation": "Usa my, your, his o her antes de un sustantivo: my mother, her brother. His se refiere a algo de él y her a algo de ella. Para presentar a alguien usa This is my… y para varias personas These are my….",
    "words": [
      {
        "word": "mother",
        "meaning": "madre"
      },
      {
        "word": "brother",
        "meaning": "hermano"
      },
      {
        "word": "parents",
        "meaning": "padres, madre y padre"
      },
      {
        "word": "daughter",
        "meaning": "hija"
      }
    ],
    "task": "Dibuja un árbol familiar pequeño. Presenta a tres personas con my, his o her.",
    "id": "a1-u03-l1",
    "level": "A1",
    "unitId": "a1-people",
    "unitNumber": 3,
    "number": 9,
    "duration": 20,
    "example": "I am Emma. My brother is Max. Our mother is Laura. Laura’s sister is my aunt.",
    "translation": "Soy Emma. Mi hermano es Max. Nuestra madre es Laura. La hermana de Laura es mi tía.",
    "word": "mother",
    "meaning": "madre",
    "audio": "/audio/a1-u03-l1.wav"
  },
  {
    "unit": 2,
    "title": "People and jobs",
    "goal": "Hablar de ocupaciones y lugares de trabajo.",
    "explanation": "Usa a o an antes de una profesión singular: a teacher, an engineer. Elige an si la palabra empieza con sonido vocálico. Pregunta What do you do? para conocer el trabajo de alguien.",
    "words": [
      {
        "word": "teacher",
        "meaning": "profesor o profesora"
      },
      {
        "word": "doctor",
        "meaning": "médico o médica"
      },
      {
        "word": "driver",
        "meaning": "conductor o conductora"
      },
      {
        "word": "shop assistant",
        "meaning": "dependiente de tienda"
      }
    ],
    "task": "Describe tu trabajo o uno que te interese usando a/an. Pregunta a otra persona su ocupación.",
    "id": "a1-u03-l2",
    "level": "A1",
    "unitId": "a1-people",
    "unitNumber": 3,
    "number": 10,
    "duration": 20,
    "example": "Dan is a doctor. He works in a hospital. His wife is a teacher at a school.",
    "translation": "Dan es médico. Trabaja en un hospital. Su esposa es profesora en una escuela.",
    "word": "teacher",
    "meaning": "profesor o profesora",
    "audio": "/audio/a1-u03-l2.wav"
  },
  {
    "unit": 2,
    "title": "Who owns this?",
    "goal": "Expresar pertenencia y distinguir posesivos.",
    "explanation": "Para indicar de quién es algo usa ’s: Anna’s bag. My, your, his, her, our y their acompañan el objeto; no llevan artículo delante. Whose bag is this? pregunta por el dueño.",
    "words": [
      {
        "word": "bag",
        "meaning": "bolso o mochila"
      },
      {
        "word": "wallet",
        "meaning": "billetera"
      },
      {
        "word": "keys",
        "meaning": "llaves"
      },
      {
        "word": "whose",
        "meaning": "de quién"
      }
    ],
    "task": "Describe cinco objetos y sus dueños usando posesivos y ’s.",
    "id": "a1-u03-l3",
    "level": "A1",
    "unitId": "a1-people",
    "unitNumber": 3,
    "number": 11,
    "duration": 20,
    "example": "This is Tom’s bag. The blue phone is Maria’s. The keys are in Tom’s bag.",
    "translation": "Esta es la bolsa de Tom. El teléfono azul es de Maria. Las llaves están en la bolsa de Tom.",
    "word": "bag",
    "meaning": "bolso o mochila",
    "audio": "/audio/a1-u03-l3.wav"
  },
  {
    "unit": 2,
    "title": "Describe someone",
    "goal": "Describir rasgos físicos y características sencillas.",
    "explanation": "Usa be para cualidades: She is tall. Usa have/has para posesión o rasgos: She has brown hair. El adjetivo suele ir antes del nombre: a friendly person. No añadas -s al adjetivo en plural.",
    "words": [
      {
        "word": "tall",
        "meaning": "alto o alta"
      },
      {
        "word": "short hair",
        "meaning": "cabello corto"
      },
      {
        "word": "friendly",
        "meaning": "amable"
      },
      {
        "word": "brown eyes",
        "meaning": "ojos marrones"
      }
    ],
    "task": "Presenta a alguien: nombre, edad, relación, trabajo y dos rasgos.",
    "id": "a1-u03-l4",
    "level": "A1",
    "unitId": "a1-people",
    "unitNumber": 3,
    "number": 12,
    "duration": 20,
    "example": "My friend Jo is tall and friendly. She has short black hair and brown eyes.",
    "translation": "Mi amiga Jo es alta y amable. Tiene el pelo negro y corto y los ojos marrones.",
    "word": "tall",
    "meaning": "alto o alta",
    "audio": "/audio/a1-u03-l4.wav"
  },
  {
    "unit": 3,
    "title": "Rooms and furniture",
    "goal": "Nombrar habitaciones y describir tu hogar.",
    "explanation": "There is presenta una cosa; there are presenta varias. Usa a/an en singular y el plural para cantidades mayores: There is a sofa. There are two chairs. Para negar usa there isn’t o there aren’t.",
    "words": [
      {
        "word": "bedroom",
        "meaning": "dormitorio"
      },
      {
        "word": "kitchen",
        "meaning": "cocina"
      },
      {
        "word": "chair",
        "meaning": "silla"
      },
      {
        "word": "living room",
        "meaning": "sala de estar"
      }
    ],
    "task": "Describe tu hogar con dos frases con there is y dos con there are.",
    "id": "a1-u04-l1",
    "level": "A1",
    "unitId": "a1-home",
    "unitNumber": 4,
    "number": 13,
    "duration": 20,
    "example": "My flat has two bedrooms. There is a small kitchen and a sofa in the living room.",
    "translation": "Mi apartamento tiene dos dormitorios. Hay una cocina pequeña y un sofá en la sala.",
    "word": "bedroom",
    "meaning": "dormitorio",
    "audio": "/audio/a1-u04-l1.wav"
  },
  {
    "unit": 3,
    "title": "Where is my phone?",
    "goal": "Ubicar objetos con preposiciones de lugar.",
    "explanation": "In significa dentro, on encima con contacto y under debajo. Next to significa al lado y between, entre dos elementos. Pregunta Where is…? en singular y Where are…? en plural.",
    "words": [
      {
        "word": "under",
        "meaning": "debajo de"
      },
      {
        "word": "next to",
        "meaning": "al lado de"
      },
      {
        "word": "between",
        "meaning": "entre dos elementos"
      },
      {
        "word": "on",
        "meaning": "sobre, con contacto"
      }
    ],
    "task": "Esconde un objeto e indica su ubicación con dos preposiciones distintas.",
    "id": "a1-u04-l2",
    "level": "A1",
    "unitId": "a1-home",
    "unitNumber": 4,
    "number": 14,
    "duration": 20,
    "example": "The phone is on the desk. The bag is under the chair. The desk is next to the window.",
    "translation": "El teléfono está sobre el escritorio. La bolsa está debajo de la silla. El escritorio está al lado de la ventana.",
    "word": "under",
    "meaning": "debajo de",
    "audio": "/audio/a1-u04-l2.wav"
  },
  {
    "unit": 3,
    "title": "One box, two boxes",
    "goal": "Usar plurales y señalar objetos cercanos y lejanos.",
    "explanation": "El plural regular añade -s; después de sonidos como s, sh o ch suele añadir -es: box → boxes. This/that son singulares; these/those son plurales. This/these señalan cerca y that/those lejos.",
    "words": [
      {
        "word": "these",
        "meaning": "estos o estas"
      },
      {
        "word": "those",
        "meaning": "esos o aquellos, plural"
      },
      {
        "word": "box",
        "meaning": "caja"
      },
      {
        "word": "shelf",
        "meaning": "estante"
      }
    ],
    "task": "Señala objetos cercanos y lejanos. Di cuatro frases con this, that, these y those.",
    "id": "a1-u04-l3",
    "level": "A1",
    "unitId": "a1-home",
    "unitNumber": 4,
    "number": 15,
    "duration": 20,
    "example": "These are my three books. That is my bag over there. There are two boxes on the shelf.",
    "translation": "Estos son mis tres libros. Aquella es mi bolsa, allí. Hay dos cajas en la estantería.",
    "word": "these",
    "meaning": "estos o estas",
    "audio": "/audio/a1-u04-l3.wav"
  },
  {
    "unit": 3,
    "title": "A home for me",
    "goal": "Pedir información básica sobre una vivienda.",
    "explanation": "Is there…? pregunta si hay algo singular; Are there…? pregunta por plurales. Responde Yes, there is o No, there isn’t; en plural usa are/aren’t. Usa How many + plural para preguntar una cantidad.",
    "words": [
      {
        "word": "bathroom",
        "meaning": "baño"
      },
      {
        "word": "window",
        "meaning": "ventana"
      },
      {
        "word": "rent",
        "meaning": "alquilar o alquiler"
      },
      {
        "word": "garden",
        "meaning": "jardín"
      }
    ],
    "task": "Escribe un anuncio de tu casa e inventa tres preguntas de una persona interesada.",
    "id": "a1-u04-l4",
    "level": "A1",
    "unitId": "a1-home",
    "unitNumber": 4,
    "number": 16,
    "duration": 20,
    "example": "Small flat for rent: one bedroom, one bathroom and a kitchen. There is no garden.",
    "translation": "Apartamento pequeño en alquiler: un dormitorio, un baño y una cocina. No hay jardín.",
    "word": "bathroom",
    "meaning": "baño",
    "audio": "/audio/a1-u04-l4.wav"
  },
  {
    "unit": 4,
    "title": "My daily routine",
    "goal": "Contar qué haces normalmente.",
    "explanation": "El presente simple describe hábitos. Con I/you/we/they usa el verbo base. Con he/she/it añade -s o -es: work → works, go → goes. Usa first y then para ordenar acciones.",
    "words": [
      {
        "word": "get up",
        "meaning": "levantarse"
      },
      {
        "word": "breakfast",
        "meaning": "desayuno"
      },
      {
        "word": "go to bed",
        "meaning": "acostarse"
      },
      {
        "word": "go to work",
        "meaning": "ir al trabajo"
      }
    ],
    "task": "Describe tu día en cinco frases. Cambia después el sujeto a he o she.",
    "id": "a1-u05-l1",
    "level": "A1",
    "unitId": "a1-routine",
    "unitNumber": 5,
    "number": 17,
    "duration": 20,
    "example": "I get up at six. I have breakfast at seven. I go to work at eight and go to bed at ten.",
    "translation": "Me levanto a las seis. Desayuno a las siete. Voy al trabajo a las ocho y me acuesto a las diez.",
    "word": "get up",
    "meaning": "levantarse",
    "audio": "/audio/a1-u05-l1.wav"
  },
  {
    "unit": 4,
    "title": "Not every day",
    "goal": "Expresar lo que no haces habitualmente.",
    "explanation": "Para negar el presente simple usa don’t con I/you/we/they y doesn’t con he/she/it. Después de doesn’t el verbo vuelve a la forma base: She doesn’t work, no doesn’t works.",
    "words": [
      {
        "word": "weekday",
        "meaning": "día entre semana"
      },
      {
        "word": "weekend",
        "meaning": "fin de semana"
      },
      {
        "word": "drive",
        "meaning": "conducir"
      },
      {
        "word": "finish",
        "meaning": "terminar"
      }
    ],
    "task": "Escribe tres cosas que no haces y dos que no hace alguien de tu familia.",
    "id": "a1-u05-l2",
    "level": "A1",
    "unitId": "a1-routine",
    "unitNumber": 5,
    "number": 18,
    "duration": 20,
    "example": "Rosa works from Monday to Friday. She doesn’t work at the weekend. She doesn’t drive; she walks.",
    "translation": "Rosa trabaja de lunes a viernes. No trabaja los fines de semana. No conduce; camina.",
    "word": "weekday",
    "meaning": "día entre semana",
    "audio": "/audio/a1-u05-l2.wav"
  },
  {
    "unit": 4,
    "title": "Do you work here?",
    "goal": "Hacer preguntas sobre hábitos.",
    "explanation": "En preguntas usa Do + I/you/we/they + verbo base y Does + he/she/it + verbo base. Responde Yes, I do / No, I don’t. Con where o what time, coloca esa expresión antes de do/does.",
    "words": [
      {
        "word": "study",
        "meaning": "estudiar"
      },
      {
        "word": "speak",
        "meaning": "hablar"
      },
      {
        "word": "start",
        "meaning": "comenzar"
      },
      {
        "word": "walk",
        "meaning": "caminar"
      }
    ],
    "task": "Haz cinco preguntas sobre la rutina de alguien y escribe respuestas cortas.",
    "id": "a1-u05-l3",
    "level": "A1",
    "unitId": "a1-routine",
    "unitNumber": 5,
    "number": 19,
    "duration": 20,
    "example": "Luis lives in Cali. He studies English on Tuesdays. He starts his class at six in the evening.",
    "translation": "Luis vive en Cali. Estudia inglés los martes. Empieza su clase a las seis de la tarde.",
    "word": "study",
    "meaning": "estudiar",
    "audio": "/audio/a1-u05-l3.wav"
  },
  {
    "unit": 4,
    "title": "Always, sometimes, never",
    "goal": "Indicar con qué frecuencia haces algo.",
    "explanation": "Always, usually, sometimes y never van normalmente antes del verbo principal: I usually walk. Con be van después: She is always early. Never ya es negativo; evita don’t never en estas frases.",
    "words": [
      {
        "word": "always",
        "meaning": "siempre"
      },
      {
        "word": "usually",
        "meaning": "normalmente"
      },
      {
        "word": "sometimes",
        "meaning": "a veces"
      },
      {
        "word": "never",
        "meaning": "nunca"
      }
    ],
    "task": "Escribe tu semana usando cuatro adverbios de frecuencia. Comprueba la posición de cada uno.",
    "id": "a1-u05-l4",
    "level": "A1",
    "unitId": "a1-routine",
    "unitNumber": 5,
    "number": 20,
    "duration": 20,
    "example": "I always have breakfast. I usually take the bus. Sometimes I walk, but I never drive.",
    "translation": "Siempre desayuno. Normalmente tomo el autobús. A veces camino, pero nunca conduzco.",
    "word": "always",
    "meaning": "siempre",
    "audio": "/audio/a1-u05-l4.wav"
  },
  {
    "unit": 5,
    "title": "Things I love",
    "goal": "Expresar gustos y preferencias sencillas.",
    "explanation": "Like/love + sustantivo expresa gustos: I like music. También puedes usar verbo con -ing: I like swimming. Para negar usa don’t like o doesn’t like. Like no necesita be: I like, no I am like.",
    "words": [
      {
        "word": "read",
        "meaning": "leer"
      },
      {
        "word": "swim",
        "meaning": "nadar"
      },
      {
        "word": "music",
        "meaning": "música"
      },
      {
        "word": "free time",
        "meaning": "tiempo libre"
      }
    ],
    "task": "Escribe tres gustos y dos cosas que no te gustan. Formula una pregunta con Do you like…?",
    "id": "a1-u06-l1",
    "level": "A1",
    "unitId": "a1-life",
    "unitNumber": 6,
    "number": 21,
    "duration": 20,
    "example": "Lily likes music and reading. She doesn’t like football. On Sundays she reads in the park.",
    "translation": "A Lily le gustan la música y la lectura. No le gusta el fútbol. Los domingos lee en el parque.",
    "word": "read",
    "meaning": "leer",
    "audio": "/audio/a1-u06-l1.wav"
  },
  {
    "unit": 5,
    "title": "Yes, I can!",
    "goal": "Hablar de habilidades y límites.",
    "explanation": "Can + verbo base expresa habilidad: I can swim. La forma es igual con todos los sujetos; no añadas -s: she can swim. La negativa es can’t. Pregunta Can you…? y responde Yes, I can / No, I can’t.",
    "words": [
      {
        "word": "dance",
        "meaning": "bailar"
      },
      {
        "word": "sing",
        "meaning": "cantar"
      },
      {
        "word": "play the guitar",
        "meaning": "tocar la guitarra"
      },
      {
        "word": "ride a bike",
        "meaning": "montar bicicleta"
      }
    ],
    "task": "Describe tres habilidades tuyas y dos que quieras aprender. Pregunta a alguien por una habilidad.",
    "id": "a1-u06-l2",
    "level": "A1",
    "unitId": "a1-life",
    "unitNumber": 6,
    "number": 22,
    "duration": 20,
    "example": "Ali can swim and ride a bike. He can’t drive. His sister can drive, but she can’t swim.",
    "translation": "Ali sabe nadar y montar en bicicleta. No sabe conducir. Su hermana sabe conducir, pero no sabe nadar.",
    "word": "dance",
    "meaning": "bailar",
    "audio": "/audio/a1-u06-l2.wav"
  },
  {
    "unit": 5,
    "title": "Right now",
    "goal": "Describir acciones que ocurren ahora.",
    "explanation": "El presente continuo se forma con am/is/are + verbo en -ing: I am reading. Usa esta forma para acciones en curso. Para preguntar mueve be antes del sujeto: Are you working? Para negar coloca not después de be.",
    "words": [
      {
        "word": "now",
        "meaning": "ahora"
      },
      {
        "word": "listen",
        "meaning": "escuchar"
      },
      {
        "word": "cook",
        "meaning": "cocinar"
      },
      {
        "word": "watch",
        "meaning": "ver, mirar con atención"
      }
    ],
    "task": "Mira a tu alrededor e inventa cuatro frases sobre acciones que están ocurriendo ahora.",
    "id": "a1-u06-l3",
    "level": "A1",
    "unitId": "a1-life",
    "unitNumber": 6,
    "number": 23,
    "duration": 20,
    "example": "It is Saturday afternoon. Eva is reading. Tom is cooking. Their parents are watching TV.",
    "translation": "Es sábado por la tarde. Eva está leyendo. Tom está cocinando. Sus padres están viendo televisión.",
    "word": "now",
    "meaning": "ahora",
    "audio": "/audio/a1-u06-l3.wav"
  },
  {
    "unit": 5,
    "title": "Usually, but today…",
    "goal": "Distinguir una rutina de una acción actual.",
    "explanation": "El presente simple describe lo habitual; el continuo, lo que ocurre ahora. I work at home every day / I am working at a café today. Observa expresiones como usually, every day, now y at the moment antes de elegir.",
    "words": [
      {
        "word": "usually",
        "meaning": "habitualmente"
      },
      {
        "word": "today",
        "meaning": "hoy"
      },
      {
        "word": "every day",
        "meaning": "todos los días"
      },
      {
        "word": "at the moment",
        "meaning": "en este momento"
      }
    ],
    "task": "Contrasta tu rutina con el día de hoy en cuatro frases. Incluye una negativa y una pregunta.",
    "id": "a1-u06-l4",
    "level": "A1",
    "unitId": "a1-life",
    "unitNumber": 6,
    "number": 24,
    "duration": 20,
    "example": "Ben usually takes the bus to work. Today he is walking because the weather is nice.",
    "translation": "Ben normalmente va al trabajo en autobús. Hoy está caminando porque hace buen tiempo.",
    "word": "usually",
    "meaning": "habitualmente",
    "audio": "/audio/a1-u06-l4.wav"
  },
  {
    "unit": 6,
    "title": "Food I know",
    "goal": "Reconocer alimentos y distinguir contables e incontables.",
    "explanation": "Los sustantivos contables tienen singular y plural: an apple / two apples. Los incontables como water, rice y bread no suelen contar unidades directamente. Usa a bottle of water o a slice of bread para indicar porciones.",
    "words": [
      {
        "word": "bread",
        "meaning": "pan"
      },
      {
        "word": "rice",
        "meaning": "arroz"
      },
      {
        "word": "apple",
        "meaning": "manzana"
      },
      {
        "word": "water",
        "meaning": "agua"
      }
    ],
    "task": "Clasifica seis alimentos en contables e incontables. Describe tu desayuno.",
    "id": "a1-u07-l1",
    "level": "A1",
    "unitId": "a1-food",
    "unitNumber": 7,
    "number": 25,
    "duration": 20,
    "example": "In my bag there are two apples and a bottle of water. There is also a sandwich with cheese.",
    "translation": "En mi bolsa hay dos manzanas y una botella de agua. También hay un sándwich de queso.",
    "word": "bread",
    "meaning": "pan",
    "audio": "/audio/a1-u07-l1.wav"
  },
  {
    "unit": 6,
    "title": "Some or any?",
    "goal": "Expresar existencia y cantidades básicas.",
    "explanation": "Usa some en afirmaciones: There is some milk. En preguntas y negativas normalmente usa any: Is there any milk? There aren’t any eggs. En ofertas o peticiones puede usarse some: Would you like some tea?",
    "words": [
      {
        "word": "fridge",
        "meaning": "nevera"
      },
      {
        "word": "eggs",
        "meaning": "huevos"
      },
      {
        "word": "milk",
        "meaning": "leche"
      },
      {
        "word": "cheese",
        "meaning": "queso"
      }
    ],
    "task": "Haz una lista de compras y explica qué tienes y qué no tienes en casa.",
    "id": "a1-u07-l2",
    "level": "A1",
    "unitId": "a1-food",
    "unitNumber": 7,
    "number": 26,
    "duration": 20,
    "example": "There is some milk in the fridge. There are some eggs, but there isn’t any cheese.",
    "translation": "Hay leche en la nevera. Hay algunos huevos, pero no hay queso.",
    "word": "fridge",
    "meaning": "nevera",
    "audio": "/audio/a1-u07-l2.wav"
  },
  {
    "unit": 6,
    "title": "At the café",
    "goal": "Pedir comida y bebida con cortesía.",
    "explanation": "I’d like significa me gustaría y sirve para pedir: I’d like a coffee, please. Can I have…? también es cortés. For here or to take away? pregunta si consumes allí o para llevar. Can I have the bill? pide la cuenta.",
    "words": [
      {
        "word": "menu",
        "meaning": "menú"
      },
      {
        "word": "bill",
        "meaning": "cuenta a pagar"
      },
      {
        "word": "take away",
        "meaning": "para llevar"
      },
      {
        "word": "order",
        "meaning": "pedido o pedir comida"
      }
    ],
    "task": "Simula un pedido de dos productos. Pregunta el total y pide la cuenta.",
    "id": "a1-u07-l3",
    "level": "A1",
    "unitId": "a1-food",
    "unitNumber": 7,
    "number": 27,
    "duration": 20,
    "example": "Menu: tea £2, coffee £3, sandwich £5. Mia orders tea and a sandwich to eat at the café.",
    "translation": "Menú: té, dos libras; café, tres libras; sándwich, cinco libras. Mia pide té y un sándwich para comer en el café.",
    "word": "menu",
    "meaning": "menú",
    "audio": "/audio/a1-u07-l3.wav"
  },
  {
    "unit": 6,
    "title": "How much do we need?",
    "goal": "Preguntar por cantidades y completar una compra.",
    "explanation": "Usa how many con contables plurales: How many apples? Usa how much con incontables: How much rice? How much también pregunta precios. A lot of funciona con ambos tipos. A little acompaña incontables; a few, plurales contables.",
    "words": [
      {
        "word": "a few",
        "meaning": "unos pocos, contables"
      },
      {
        "word": "a little",
        "meaning": "un poco, incontables"
      },
      {
        "word": "kilo",
        "meaning": "kilo"
      },
      {
        "word": "price",
        "meaning": "precio"
      }
    ],
    "task": "Prepara una lista con porciones, cantidades y dos preguntas con how much/how many.",
    "id": "a1-u07-l4",
    "level": "A1",
    "unitId": "a1-food",
    "unitNumber": 7,
    "number": 28,
    "duration": 20,
    "example": "Shopping list: six eggs, one kilo of rice and two bottles of water. We already have some milk.",
    "translation": "Lista de compras: seis huevos, un kilo de arroz y dos botellas de agua. Ya tenemos leche.",
    "word": "a few",
    "meaning": "unos pocos, contables",
    "audio": "/audio/a1-u07-l4.wav"
  },
  {
    "unit": 7,
    "title": "Places in town",
    "goal": "Reconocer lugares y servicios de una ciudad.",
    "explanation": "Usa there is/are para describir una zona y near, opposite o next to para ubicar lugares. The identifica un lugar conocido: the bank. Is there a pharmacy near here? permite pedir un servicio que necesitas.",
    "words": [
      {
        "word": "pharmacy",
        "meaning": "farmacia"
      },
      {
        "word": "bank",
        "meaning": "banco"
      },
      {
        "word": "library",
        "meaning": "biblioteca"
      },
      {
        "word": "opposite",
        "meaning": "enfrente de"
      }
    ],
    "task": "Dibuja una calle con cuatro servicios y describe sus ubicaciones.",
    "id": "a1-u08-l1",
    "level": "A1",
    "unitId": "a1-city",
    "unitNumber": 8,
    "number": 29,
    "duration": 20,
    "example": "The bank is next to the café. The pharmacy is opposite the bank. The library is near the park.",
    "translation": "El banco está al lado del café. La farmacia está enfrente del banco. La biblioteca está cerca del parque.",
    "word": "pharmacy",
    "meaning": "farmacia",
    "audio": "/audio/a1-u08-l1.wav"
  },
  {
    "unit": 7,
    "title": "Turn left!",
    "goal": "Pedir y seguir indicaciones sencillas.",
    "explanation": "El imperativo usa el verbo base sin sujeto: Go straight. Turn left. Para una instrucción negativa usa don’t: Don’t cross here. Pregunta How do I get to…? y confirma el destino antes de empezar.",
    "words": [
      {
        "word": "turn left",
        "meaning": "girar a la izquierda"
      },
      {
        "word": "turn right",
        "meaning": "girar a la derecha"
      },
      {
        "word": "go straight",
        "meaning": "seguir recto"
      },
      {
        "word": "cross",
        "meaning": "cruzar"
      }
    ],
    "task": "Explica cómo llegar de tu casa a un lugar cercano con tres instrucciones.",
    "id": "a1-u08-l2",
    "level": "A1",
    "unitId": "a1-city",
    "unitNumber": 8,
    "number": 30,
    "duration": 20,
    "example": "To get to the library, go straight. Turn right at the café. The library is on your left.",
    "translation": "Para llegar a la biblioteca, sigue recto. Gira a la derecha en el café. La biblioteca está a tu izquierda.",
    "word": "turn left",
    "meaning": "girar a la izquierda",
    "audio": "/audio/a1-u08-l2.wav"
  },
  {
    "unit": 7,
    "title": "A ticket, please",
    "goal": "Comprar un boleto y entender un trayecto.",
    "explanation": "Usa by bus/train para el medio de transporte y on foot para caminar. A single ticket es de ida; a return ticket, ida y vuelta. What time does the train leave? pregunta la salida; from/to indican origen/destino.",
    "words": [
      {
        "word": "ticket",
        "meaning": "boleto"
      },
      {
        "word": "single ticket",
        "meaning": "boleto solo de ida"
      },
      {
        "word": "return ticket",
        "meaning": "boleto de ida y vuelta"
      },
      {
        "word": "station",
        "meaning": "estación"
      }
    ],
    "task": "Pide un boleto, pregunta la hora de salida y confirma el destino.",
    "id": "a1-u08-l3",
    "level": "A1",
    "unitId": "a1-city",
    "unitNumber": 8,
    "number": 31,
    "duration": 20,
    "example": "The train from York to Leeds leaves at 10:15. A single ticket is £8. The return ticket is £12.",
    "translation": "El tren de York a Leeds sale a las diez y cuarto. Un billete de ida cuesta ocho libras. El de ida y vuelta cuesta doce.",
    "word": "ticket",
    "meaning": "boleto",
    "audio": "/audio/a1-u08-l3.wav"
  },
  {
    "unit": 7,
    "title": "A day in the city",
    "goal": "Integrar lugares, horarios y desplazamientos.",
    "explanation": "Para conectar información usa and para sumar, but para contrastar y because para una razón. Combina frases cortas: I walk because the park is near. Una pregunta a la vez ayuda a confirmar instrucciones y horarios.",
    "words": [
      {
        "word": "near",
        "meaning": "cerca"
      },
      {
        "word": "far",
        "meaning": "lejos"
      },
      {
        "word": "open",
        "meaning": "abierto"
      },
      {
        "word": "closed",
        "meaning": "cerrado"
      }
    ],
    "task": "Planea una visita: elige dos lugares, explica el recorrido y confirma sus horarios.",
    "id": "a1-u08-l4",
    "level": "A1",
    "unitId": "a1-city",
    "unitNumber": 8,
    "number": 32,
    "duration": 20,
    "example": "The museum opens at nine. It is near the hotel, so we walk. The café next to it is closed today.",
    "translation": "El museo abre a las nueve. Está cerca del hotel, así que vamos caminando. El café que está al lado está cerrado hoy.",
    "word": "near",
    "meaning": "cerca",
    "audio": "/audio/a1-u08-l4.wav"
  },
  {
    "unit": 8,
    "title": "Colors and clothes",
    "goal": "Nombrar prendas, colores y tallas.",
    "explanation": "El color va antes de la prenda: a blue shirt. Los adjetivos no cambian en plural: two blue shirts. Para la ropa actual usa wearing: I’m wearing jeans. Trousers y jeans suelen tratarse como plural.",
    "words": [
      {
        "word": "shirt",
        "meaning": "camisa"
      },
      {
        "word": "shoes",
        "meaning": "zapatos"
      },
      {
        "word": "jacket",
        "meaning": "chaqueta"
      },
      {
        "word": "size",
        "meaning": "talla"
      }
    ],
    "task": "Describe tu ropa y prepara una petición de una prenda, color y talla.",
    "id": "a1-u09-l1",
    "level": "A1",
    "unitId": "a1-shopping",
    "unitNumber": 9,
    "number": 33,
    "duration": 20,
    "example": "Mia is wearing a yellow shirt and blue jeans. Her shoes are white. Her jacket is at home.",
    "translation": "Mia lleva una camisa amarilla y unos jeans azules. Sus zapatos son blancos. Su chaqueta está en casa.",
    "word": "shirt",
    "meaning": "camisa",
    "audio": "/audio/a1-u09-l1.wav"
  },
  {
    "unit": 8,
    "title": "How much is this?",
    "goal": "Consultar un precio y pagar una compra.",
    "explanation": "Pregunta How much is this…? para un objeto singular; How much are these…? para varios. Responde It’s… o They’re…. Cash significa efectivo; card, tarjeta. Can I pay by card? permite confirmar el medio de pago.",
    "words": [
      {
        "word": "cash",
        "meaning": "efectivo"
      },
      {
        "word": "card",
        "meaning": "tarjeta"
      },
      {
        "word": "pound",
        "meaning": "libra, moneda"
      },
      {
        "word": "change",
        "meaning": "cambio de dinero"
      }
    ],
    "task": "Simula una compra: pregunta dos precios y elige cómo pagar.",
    "id": "a1-u09-l2",
    "level": "A1",
    "unitId": "a1-shopping",
    "unitNumber": 9,
    "number": 34,
    "duration": 20,
    "example": "The shirt is £12. The shoes are £25. The shop accepts cash and cards.",
    "translation": "La camisa cuesta doce libras. Los zapatos cuestan veinticinco libras. La tienda acepta efectivo y tarjetas.",
    "word": "cash",
    "meaning": "efectivo",
    "audio": "/audio/a1-u09-l2.wav"
  },
  {
    "unit": 8,
    "title": "The right choice",
    "goal": "Expresar preferencias y elegir entre opciones.",
    "explanation": "Which…? pide elegir entre opciones concretas: Which color do you like? Usa this one/that one para no repetir un sustantivo singular conocido. Or ofrece alternativas: blue or green? Usa too + adjetivo para un exceso: too small.",
    "words": [
      {
        "word": "small",
        "meaning": "pequeño o pequeña"
      },
      {
        "word": "large",
        "meaning": "grande"
      },
      {
        "word": "cheap",
        "meaning": "barato o barata"
      },
      {
        "word": "expensive",
        "meaning": "caro o cara"
      }
    ],
    "task": "Elige entre dos productos. Explica tu decisión con precio, color o talla.",
    "id": "a1-u09-l3",
    "level": "A1",
    "unitId": "a1-shopping",
    "unitNumber": 9,
    "number": 35,
    "duration": 20,
    "example": "The green bag is small and costs £10. The blue bag is large and costs £30. Ana chooses the green one.",
    "translation": "La bolsa verde es pequeña y cuesta diez libras. La azul es grande y cuesta treinta. Ana elige la verde.",
    "word": "small",
    "meaning": "pequeño o pequeña",
    "audio": "/audio/a1-u09-l3.wav"
  },
  {
    "unit": 8,
    "title": "In the shop",
    "goal": "Pedir ayuda y resolver una compra sencilla.",
    "explanation": "Can I try it on? pide probarse una prenda. I’m looking for… explica lo que buscas. Usa Do you have…? para preguntar por disponibilidad. No, thank you rechaza cortésmente; I’ll take it expresa una decisión de compra.",
    "words": [
      {
        "word": "try on",
        "meaning": "probarse ropa"
      },
      {
        "word": "look for",
        "meaning": "buscar"
      },
      {
        "word": "receipt",
        "meaning": "recibo"
      },
      {
        "word": "shop",
        "meaning": "tienda"
      }
    ],
    "task": "Representa una conversación completa entre cliente y vendedor con seis intervenciones.",
    "id": "a1-u09-l4",
    "level": "A1",
    "unitId": "a1-shopping",
    "unitNumber": 9,
    "number": 36,
    "duration": 20,
    "example": "Customer: Do you have this jacket in blue? Assistant: Yes, in small and large. Customer: Large, please. Can I try it on?",
    "translation": "Cliente: ¿Tiene esta chaqueta en azul? Dependiente: Sí, en talla pequeña y grande. Cliente: Grande, por favor. ¿Puedo probármela?",
    "word": "try on",
    "meaning": "probarse ropa",
    "audio": "/audio/a1-u09-l4.wav"
  },
  {
    "unit": 9,
    "title": "Weather and plans",
    "goal": "Hablar del clima y hacer una sugerencia.",
    "explanation": "Para el clima usa It is: It’s sunny/cold. It’s raining describe lluvia actual. Let’s + verbo base propone una actividad compartida: Let’s go to the park. Combina clima y razón para elegir: It’s cold, so let’s stay home.",
    "words": [
      {
        "word": "sunny",
        "meaning": "soleado"
      },
      {
        "word": "cold",
        "meaning": "frío"
      },
      {
        "word": "raining",
        "meaning": "lloviendo"
      },
      {
        "word": "warm",
        "meaning": "cálido"
      }
    ],
    "task": "Describe el clima y propón dos actividades adecuadas usando let’s.",
    "id": "a1-u10-l1",
    "level": "A1",
    "unitId": "a1-everyday",
    "unitNumber": 10,
    "number": 37,
    "duration": 20,
    "example": "It is cold and raining today. Jo wants to stay at home and watch a film. Tomorrow looks sunny.",
    "translation": "Hoy hace frío y está lloviendo. Jo quiere quedarse en casa y ver una película. Mañana parece que hará sol.",
    "word": "sunny",
    "meaning": "soleado",
    "audio": "/audio/a1-u10-l1.wav"
  },
  {
    "unit": 9,
    "title": "I need help",
    "goal": "Expresar una necesidad básica y pedir asistencia.",
    "explanation": "Usa I need + objeto (I need water) o I need to + verbo (I need to sit down). Para malestar sencillo: I have a headache / I feel sick. Please call a doctor pide ayuda; no necesitas dar explicaciones complejas.",
    "words": [
      {
        "word": "headache",
        "meaning": "dolor de cabeza"
      },
      {
        "word": "sick",
        "meaning": "enfermo o con malestar"
      },
      {
        "word": "need",
        "meaning": "necesitar"
      },
      {
        "word": "sit down",
        "meaning": "sentarse"
      }
    ],
    "task": "Practica pedir ayuda, expresar una necesidad y dar un contacto. Este ejercicio es lingüístico, no consejo médico.",
    "id": "a1-u10-l2",
    "level": "A1",
    "unitId": "a1-everyday",
    "unitNumber": 10,
    "number": 38,
    "duration": 20,
    "example": "Tom feels sick. He has a headache. He needs some water and wants to sit down.",
    "translation": "Tom se siente enfermo. Le duele la cabeza. Necesita agua y quiere sentarse.",
    "word": "headache",
    "meaning": "dolor de cabeza",
    "audio": "/audio/a1-u10-l2.wav"
  },
  {
    "unit": 9,
    "title": "A message for you",
    "goal": "Comprender y escribir un mensaje breve.",
    "explanation": "Un mensaje sencillo incluye saludo, motivo, lugar/hora y despedida. Usa frases cortas y conectores and/but/because. Check who, where y when: quién participa, dónde y cuándo. No necesitas traducir palabra por palabra para entenderlo.",
    "words": [
      {
        "word": "meet",
        "meaning": "encontrarse con alguien"
      },
      {
        "word": "bring",
        "meaning": "traer"
      },
      {
        "word": "message",
        "meaning": "mensaje"
      },
      {
        "word": "see you",
        "meaning": "nos vemos"
      }
    ],
    "task": "Escribe un mensaje de 35–50 palabras con invitación, lugar, hora y una petición.",
    "id": "a1-u10-l3",
    "level": "A1",
    "unitId": "a1-everyday",
    "unitNumber": 10,
    "number": 39,
    "duration": 20,
    "example": "Hi Leo! Meet me at the library at four on Friday. Bring your English book. See you, Ana.",
    "translation": "¡Hola, Leo! Nos vemos en la biblioteca a las cuatro el viernes. Trae tu libro de inglés. Hasta luego, Ana.",
    "word": "meet",
    "meaning": "encontrarse con alguien",
    "audio": "/audio/a1-u10-l3.wav"
  },
  {
    "unit": 9,
    "title": "My first conversation",
    "goal": "Integrar presentaciones, hábitos y necesidades.",
    "explanation": "Mantén una conversación con turnos breves: pregunta, escucha, responde y añade un detalle. Usa be para identidad, do/does para hábitos y can para habilidades o peticiones. Pide repetición si algo no está claro.",
    "words": [
      {
        "word": "question",
        "meaning": "pregunta"
      },
      {
        "word": "answer",
        "meaning": "respuesta"
      },
      {
        "word": "again",
        "meaning": "otra vez"
      },
      {
        "word": "together",
        "meaning": "juntos"
      }
    ],
    "task": "Graba para ti una presentación de un minuto. Escribe ocho intervenciones: saludo, origen, rutina, gustos, una petición y despedida.",
    "id": "a1-u10-l4",
    "level": "A1",
    "unitId": "a1-everyday",
    "unitNumber": 10,
    "number": 40,
    "duration": 20,
    "example": "Nora is from Peru and lives in Madrid. She works in a café. She likes reading and can speak Spanish and a little English.",
    "translation": "Nora es de Perú y vive en Madrid. Trabaja en un café. Le gusta leer y sabe hablar español y un poco de inglés.",
    "word": "question",
    "meaning": "pregunta",
    "audio": "/audio/a1-u10-l4.wav"
  },
  {
    "id": "a2-1",
    "level": "A2",
    "title": "A weekend to remember",
    "goal": "Cuenta una experiencia terminada.",
    "explanation": "El pasado simple habla de acciones terminadas. Los verbos regulares añaden -ed; otros son irregulares: go → went. Con did y didn’t usamos el verbo base.",
    "example": "We went to the beach, but we didn’t swim.",
    "translation": "Fuimos a la playa, pero no nadamos.",
    "word": "beach",
    "meaning": "playa",
    "audio": "/audio/a2-1.wav"
  },
  {
    "id": "a2-2",
    "level": "A2",
    "title": "What’s the plan?",
    "goal": "Expresa tus planes e intenciones.",
    "explanation": "Be going to + verbo base expresa una intención o una predicción con evidencia. Cambia be según la persona: I am, she is, we are.",
    "example": "I’m going to study English tonight.",
    "translation": "Voy a estudiar inglés esta noche.",
    "word": "tonight",
    "meaning": "esta noche",
    "audio": "/audio/a2-2.wav"
  },
  {
    "id": "b1-1",
    "level": "B1",
    "title": "Have you ever…?",
    "goal": "Habla de experiencias sin una fecha concreta.",
    "explanation": "El present perfect se forma con have/has + participio. Ever pregunta por experiencias; never dice que no han ocurrido. Con una fecha terminada, usa pasado simple.",
    "example": "I have visited London. I went there last year.",
    "translation": "He visitado Londres. Fui allí el año pasado.",
    "word": "last year",
    "meaning": "el año pasado",
    "audio": "/audio/b1-1.wav"
  },
  {
    "id": "b1-2",
    "level": "B1",
    "title": "If I had more time",
    "goal": "Imagina situaciones diferentes.",
    "explanation": "El segundo condicional usa if + pasado simple, seguido de would + verbo base para situaciones hipotéticas del presente o futuro.",
    "example": "If I had more time, I would learn another language.",
    "translation": "Si tuviera más tiempo, aprendería otro idioma.",
    "word": "another language",
    "meaning": "otro idioma",
    "audio": "/audio/b1-2.wav"
  },
  {
    "id": "b2-1",
    "level": "B2",
    "title": "A different perspective",
    "goal": "Cambia el foco de una oración con la voz pasiva.",
    "explanation": "La pasiva se forma con be en el tiempo adecuado + participio. Se usa cuando el resultado o quien recibe la acción importa más que quien la realiza.",
    "example": "The report was written by the research team.",
    "translation": "El informe fue escrito por el equipo de investigación.",
    "word": "research team",
    "meaning": "equipo de investigación",
    "audio": "/audio/b2-1.wav"
  },
  {
    "id": "b2-2",
    "level": "B2",
    "title": "She said that…",
    "goal": "Transmite lo que dijo otra persona.",
    "explanation": "Al reportar palabras desde un momento posterior, normalmente desplazamos el tiempo verbal hacia el pasado: am → was; will → would. También adaptamos pronombres y referencias temporales.",
    "example": "“I am tired,” she said. → She said that she was tired.",
    "translation": "«Estoy cansada», dijo. → Dijo que estaba cansada.",
    "word": "tired",
    "meaning": "cansada o cansado",
    "audio": "/audio/b2-2.wav"
  },
  {
    "id": "c1-1",
    "level": "C1",
    "title": "Not only words",
    "goal": "Usa la inversión para dar énfasis.",
    "explanation": "Cuando una expresión negativa o restrictiva abre la oración, invertimos el auxiliar y el sujeto. Si no hay auxiliar, añadimos do, does o did.",
    "example": "Never have I seen such a remarkable performance.",
    "translation": "Nunca había visto una actuación tan extraordinaria.",
    "word": "remarkable",
    "meaning": "extraordinaria o extraordinario",
    "audio": "/audio/c1-1.wav"
  },
  {
    "id": "c1-2",
    "level": "C1",
    "title": "The art of nuance",
    "goal": "Modera afirmaciones en un registro académico.",
    "explanation": "Hedging permite ajustar el grado de certeza. Expresiones como appears to, may y suggests that evitan presentar evidencia limitada como una conclusión absoluta.",
    "example": "The findings suggest that the approach may be effective.",
    "translation": "Los hallazgos sugieren que el enfoque podría ser eficaz.",
    "word": "findings",
    "meaning": "hallazgos",
    "audio": "/audio/c1-2.wav"
  },
  {
    "id": "c2-1",
    "level": "C2",
    "title": "Reading between the lines",
    "goal": "Interpreta significados implícitos en contexto.",
    "explanation": "Una implicatura comunica más de lo que se dice literalmente. Para interpretarla, considera la situación, el tono y lo que el hablante evita afirmar. Puede haber más de una lectura posible.",
    "example": "Asked about the proposal, she replied: “Well, it’s certainly ambitious.”",
    "translation": "Al preguntarle por la propuesta, respondió: «Bueno, sin duda es ambiciosa».",
    "word": "ambitious",
    "meaning": "ambiciosa o ambicioso",
    "audio": "/audio/c2-1.wav"
  },
  {
    "id": "c2-2",
    "level": "C2",
    "title": "Precisely what I mean",
    "goal": "Da énfasis con estructuras hendidas.",
    "explanation": "Las cleft sentences dividen la información para destacar un elemento. It was X who/that… enfatiza X; What I need is… destaca lo que se necesita.",
    "example": "It was Maya who challenged the assumption, not Leo.",
    "translation": "Fue Maya quien cuestionó la suposición, no Leo.",
    "word": "assumption",
    "meaning": "suposición",
    "audio": "/audio/c2-2.wav"
  }
];
