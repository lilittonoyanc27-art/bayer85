export interface VocabularyItem {
  word: string;
  translation: string;
  type: string;
}

export interface SentenceItem {
  id: number;
  spanish: string;
  armenian: string;
  highlightedWords: string[]; // Spanish words to highlight
  vocabulary: VocabularyItem[];
}

export interface QuizOption {
  id: string; // 'A', 'B', 'C', 'D'
  textEs: string;
  textHy: string;
}

export interface QuizQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  options: QuizOption[];
  correctOptionId: string; // 'A', 'B', 'C', 'D'
  explanationEs: string;
  explanationHy: string;
}

export const READING_TITLE_ES = "Una visita por la ciudad";
export const READING_TITLE_HY = "Այցելություն քաղաքում";

export const READING_SENTENCES: SentenceItem[] = [
  {
    id: 1,
    spanish: "¡Bienvenidos a nuestra visita por la ciudad!",
    armenian: "Բարի գալուստ մեր քաղաքային այցելությանը։",
    highlightedWords: ["visita", "ciudad"],
    vocabulary: [
      { word: "la visita", translation: "այցելություն (visit)", type: "sustantivo" },
      { word: "la ciudad", translation: "քաղաք (city)", type: "sustantivo" },
      { word: "¡Bienvenidos!", translation: "Բարի գալո՛ւստ (Welcome!)", type: "interjección" }
    ]
  },
  {
    id: 2,
    spanish: "Hoy vamos a hacer un paseo muy interesante.",
    armenian: "Այսօր մենք անելու ենք շատ հետաքրքիր զբոսանք։",
    highlightedWords: ["un paseo"],
    vocabulary: [
      { word: "un paseo", translation: "զբոսանք (a walk, stroll)", type: "sustantivo" },
      { word: "hoy", translation: "այսօր (today)", type: "adverbio" },
      { word: "hacer", translation: "անել (to do / to make)", type: "verbo" },
      { word: "interesante", translation: "հետաքրքիր (interesting)", type: "adjetivo" }
    ]
  },
  {
    id: 3,
    spanish: "Primero vamos a subir por esta calle y después vamos a bajar hacia la plaza.",
    armenian: "Սկզբում մենք բարձրանալու ենք այս փողոցով, իսկ հետո իջնելու ենք դեպի հրապարակ։",
    highlightedWords: ["subir", "bajar"],
    vocabulary: [
      { word: "subir", translation: "բարձրանալ (to go up, climb)", type: "verbo" },
      { word: "bajar", translation: "իջնել (to go down, descend)", type: "verbo" },
      { word: "la calle", translation: "փողոց (the street)", type: "sustantivo" },
      { word: "la plaza", translation: "հրապարակ (the square)", type: "sustantivo" },
      { word: "hacia", translation: "դեպի (towards)", type: "preposición" }
    ]
  },
  {
    id: 4,
    spanish: "En la esquina vamos a girar a la derecha.",
    armenian: "Անկյունում մենք թեքվելու ենք աջ։",
    highlightedWords: ["girar"],
    vocabulary: [
      { word: "girar", translation: "թեքվել (to turn)", type: "verbo" },
      { word: "la esquina", translation: "անկյուն (the corner)", type: "sustantivo" },
      { word: "a la derecha", translation: "աջ (to the right)", type: "adverbio" }
    ]
  },
  {
    id: 5,
    spanish: "Después vamos a cruzar la calle con cuidado.",
    armenian: "Հետո մենք զգուշությամբ անցնելու ենք փողոցը։",
    highlightedWords: ["cruzar"],
    vocabulary: [
      { word: "cruzar", translation: "անցնել (to cross)", type: "verbo" },
      { word: "con cuidado", translation: "զգուշությամբ (with care / carefully)", type: "adverbio" },
      { word: "después", translation: "հետո (afterward / then)", type: "adverbio" }
    ]
  },
  {
    id: 6,
    spanish: "Vamos a seguir todo recto hasta el parque.",
    armenian: "Մենք շարունակելու ենք ուղիղ մինչև այգի։",
    highlightedWords: ["seguir"],
    vocabulary: [
      { word: "seguir", translation: "շարունակել (to follow / to continue)", type: "verbo" },
      { word: "todo recto", translation: "ուղիղ (straight ahead)", type: "adverbio" },
      { word: "hasta", translation: "մինչև (until / up to)", type: "preposición" },
      { word: "el parque", translation: "այգի (the park)", type: "sustantivo" }
    ]
  },
  {
    id: 7,
    spanish: "Allí vamos a parar un momento para descansar y mirar el paisaje.",
    armenian: "Այնտեղ մենք մի պահ կանգնելու ենք՝ հանգստանալու և տեսարանը նայելու համար։",
    highlightedWords: ["parar", "mirar"],
    vocabulary: [
      { word: "parar", translation: "կանգնել / կանգնեցնել (to stop)", type: "verbo" },
      { word: "mirar", translation: "նայել (to look at)", type: "verbo" },
      { word: "descansar", translation: "հանգստանալ (to rest)", type: "verbo" },
      { word: "el paisaje", translation: "տեսարան (the landscape / view)", type: "sustantivo" },
      { word: "un momento", translation: "մի պահ (a moment)", type: "sustantivo" }
    ]
  },
  {
    id: 8,
    spanish: "Desde el parque podemos ver un monumento muy famoso.",
    armenian: "Այգուց մենք կարող ենք տեսնել շատ հայտնի հուշարձան։",
    highlightedWords: ["ver"],
    vocabulary: [
      { word: "ver", translation: "տեսնել (to see)", type: "verbo" },
      { word: "un monumento", translation: "հուշարձան (a monument)", type: "sustantivo" },
      { word: "famoso", translation: "հայտնի (famous)", type: "adjetivo" },
      { word: "desde", translation: "միջից / -ից (from)", type: "preposición" }
    ]
  },
  {
    id: 9,
    spanish: "Yo les voy a mostrar el monumento y voy a contar una pequeña historia sobre él.",
    armenian: "Ես ձեզ ցույց կտամ հուշարձանը և մի փոքր պատմություն կպատմեմ դրա մասին։",
    highlightedWords: ["mostrar"],
    vocabulary: [
      { word: "mostrar", translation: "ցույց տալ (to show)", type: "verbo" },
      { word: "contar", translation: "պատմել (to tell / count)", type: "verbo" },
      { word: "pequeña", translation: "փոքր (small)", type: "adjetivo" },
      { word: "sobre él", translation: "դրա մասին (about it)", type: "frase" }
    ]
  },
  {
    id: 10,
    spanish: "Después vamos a llegar al museo.",
    armenian: "Հետո մենք հասնելու ենք թանգարան։",
    highlightedWords: ["llegar"],
    vocabulary: [
      { word: "llegar", translation: "հասնել (to arrive / reach)", type: "verbo" },
      { word: "el museo", translation: "թանգարան (the museum)", type: "sustantivo" }
    ]
  },
  {
    id: 11,
    spanish: "Para entrar al museo necesitamos comprar un billete.",
    armenian: "Թանգարան մտնելու համար մեզ պետք է գնել տոմս։",
    highlightedWords: ["un billete"],
    vocabulary: [
      { word: "un billete", translation: "տոմս (a ticket)", type: "sustantivo" },
      { word: "entrar", translation: "մտնել (to enter)", type: "verbo" },
      { word: "comprar", translation: "գնել (to buy)", type: "verbo" },
      { word: "necesitar", translation: "կարիք ունենալ (to need)", type: "verbo" }
    ]
  },
  {
    id: 12,
    spanish: "El precio del billete no es muy alto.",
    armenian: "Տոմսի գինը շատ բարձր չէ։",
    highlightedWords: ["El precio"],
    vocabulary: [
      { word: "el precio", translation: "գինը (the price)", type: "sustantivo" },
      { word: "alto", translation: "բարձր (high / tall)", type: "adjetivo" }
    ]
  },
  {
    id: 13,
    spanish: "Pero la entrada al jardín es gratis.",
    armenian: "Բայց այգի մուտքը անվճար է։",
    highlightedWords: ["gratis"],
    vocabulary: [
      { word: "gratis", translation: "անվճար (free of charge)", type: "adjetivo" },
      { word: "la entrada", translation: "մուտք (entrance / ticket)", type: "sustantivo" },
      { word: "el jardín", translation: "այգի / պարտեզ (the garden)", type: "sustantivo" }
    ]
  },
  {
    id: 14,
    spanish: "La entrada al museo es pagada.",
    armenian: "Թանգարան մուտքը վճարովի է։",
    highlightedWords: ["pagada"],
    vocabulary: [
      { word: "pagada", translation: "վճարովի (paid)", type: "adjetivo" }
    ]
  },
  {
    id: 15,
    spanish: "También les quiero recomendar una cafetería cerca del museo.",
    armenian: "Ես նաև ուզում եմ ձեզ խորհուրդ տալ մի սրճարան թանգարանի մոտ։",
    highlightedWords: ["recomendar"],
    vocabulary: [
      { word: "recomendar", translation: "խորհուրդ տալ (to recommend)", type: "verbo" },
      { word: "una cafetería", translation: "սրճարան (a café)", type: "sustantivo" },
      { word: "cerca de", translation: "մոտ (near / close to)", type: "preposición" }
    ]
  },
  {
    id: 16,
    spanish: "Después del museo vamos a volver al centro de la ciudad.",
    armenian: "Թանգարանից հետո մենք վերադառնալու ենք քաղաքի կենտրոն։",
    highlightedWords: ["volver"],
    vocabulary: [
      { word: "volver", translation: "վերադառնալ (to return)", type: "verbo" },
      { word: "el centro", translation: "կենտրոն (the center)", type: "sustantivo" }
    ]
  },
  {
    id: 17,
    spanish: "¡Espero que la visita les guste mucho!",
    armenian: "Հուսով եմ՝ այցելությունը ձեզ շատ դուր կգա։",
    highlightedWords: [],
    vocabulary: [
      { word: "esperar", translation: "հուսալ / սպասել (to hope / to wait)", type: "verbo" },
      { word: "gustar mucho", translation: "շատ դուր գալ (to like very much)", type: "verbo" }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionEs: "¿Qué van a hacer hoy?",
    questionHy: "Ի՞նչ են անելու նրանք այսօր։",
    options: [
      { id: "A", textEs: "Van a hacer un paseo muy interesante por la ciudad.", textHy: "Անելու են շատ հետաքրքիր զբոսանք քաղաքում:" },
      { id: "B", textEs: "Van a quedarse en casa a descansar y ver televisión.", textHy: "Մնալու են տանը՝ հանգստանալու և հեռուստացույց դիտելու:" },
      { id: "C", textEs: "Van a viajar a otra ciudad en tren rápido.", textHy: "Մեկնելու են այլ քաղաք արագընթաց գնացքով:" },
      { id: "D", textEs: "Van a comprar un coche nuevo en el centro.", textHy: "Գնելու են նոր մեքենա կենտրոնում:" }
    ],
    correctOptionId: "A",
    explanationEs: "El texto dice: 'Hoy vamos a hacer un paseo muy interesante'.",
    explanationHy: "Տեքստում ասվում է՝ «Այսօր մենք անելու ենք շատ հետաքրքիր զբոսանք»։"
  },
  {
    id: 2,
    questionEs: "¿A dónde van a llegar después del parque?",
    questionHy: "Այգուց հետո որտե՞ղ են հասնելու։",
    options: [
      { id: "A", textEs: "Van a llegar a una cafetería antigua.", textHy: "Հասնելու են մի հին սրճարան:" },
      { id: "B", textEs: "Van a llegar al museo.", textHy: "Հասնելու են թանգարան:" },
      { id: "C", textEs: "Van a llegar al centro comercial.", textHy: "Հասնելու են առևտրի կենտրոն:" },
      { id: "D", textEs: "Van a volver a su hotel.", textHy: "Վերադառնալու են իրենց հյուրանոց:" }
    ],
    correctOptionId: "B",
    explanationEs: "El texto dice: 'Allí vamos a parar... Después vamos a llegar al museo'.",
    explanationHy: "Տեքստում ասվում է՝ «Այնտեղ մենք մի պահ կանգնելու ենք... Հետո մենք հասնելու ենք թանգարան»։"
  },
  {
    id: 3,
    questionEs: "¿La entrada al jardín es gratis o pagada?",
    questionHy: "Այգի մուտքը անվճա՞ր է, թե՞ վճարովի։",
    options: [
      { id: "A", textEs: "La entrada al jardín es pagada.", textHy: "Այգի մուտքը վճարովի է:" },
      { id: "B", textEs: "El jardín está cerrado hoy.", textHy: "Այգին փակ է այսօր:" },
      { id: "C", textEs: "La entrada al jardín es gratis.", textHy: "Այգի մուտքը անվճար է:" },
      { id: "D", textEs: "Es gratis solo para los estudiantes.", textHy: "Անվճար է միայն ուսանողների համար:" }
    ],
    correctOptionId: "C",
    explanationEs: "El texto dice explícitamente: 'Pero la entrada al jardín es gratis'.",
    explanationHy: "Տեքստում հստակ նշված է՝ «Բայց այգի մուտքը անվճար է»։"
  },
  {
    id: 4,
    questionEs: "¿Qué va a mostrar la guía?",
    questionHy: "Ի՞նչ է ցույց տալու ուղեկցորդը։",
    options: [
      { id: "A", textEs: "Va a mostrar un monumento muy famoso y contar su historia.", textHy: "Ցույց է տալու մի շատ հայտնի հուշարձան և պատմելու է դրա պատմությունը:" },
      { id: "B", textEs: "Va a mostrar la pintura más antigua del museo.", textHy: "Ցույց է տալու թանգարանի ամենահին նկարը:" },
      { id: "C", textEs: "Va a mostrar el mapa secreto de la ciudad.", textHy: "Ցույց է տալու քաղաքի գաղտնի քարտեզը:" },
      { id: "D", textEs: "Va a mostrar el jardín de flores exóticas.", textHy: "Ցույց է տալու էկզոտիկ ծաղիկների այգին:" }
    ],
    correctOptionId: "A",
    explanationEs: "El texto dice: 'Yo les voy a mostrar el monumento y voy a contar una pequeña historia sobre él'.",
    explanationHy: "Տեքստում ասվում է՝ «Ես ձեզ ցույց կտամ հուշարձանը և մի փոքր պատմություն կպատմեմ դրա մասին»։"
  },
  {
    id: 5,
    questionEs: "¿Van a volver al centro de la ciudad?",
    questionHy: "Նրանք վերադառնալո՞ւ են քաղաքի կենտրոն։",
    options: [
      { id: "A", textEs: "No, van a viajar a otra ciudad.", textHy: "Ոչ, նրանք մեկնելու են այլ քաղաք:" },
      { id: "B", textEs: "Sí, van a volver al centro de la ciudad después del museo.", textHy: "Այո, թանգարանից հետո նրանք վերադառնալու են քաղաքի կենտրոն:" },
      { id: "C", textEs: "Se van a quedar en la cafetería para siempre.", textHy: "Նրանք ընդմիշտ մնալու են սրճարանում:" },
      { id: "D", textEs: "No, van a visitar otra playa lejana.", textHy: "Ոչ, նրանք այցելելու են մեկ այլ հեռավոր լողափ:" }
    ],
    correctOptionId: "B",
    explanationEs: "El texto dice al final: 'Después del museo vamos a volver al centro de la ciudad'.",
    explanationHy: "Տեքստի վերջում ասվում է՝ «Թանգարանից հետո մենք վերադառնալու ենք քաղաքի կենտրոն»։"
  }
];

export interface FunFact {
  titleEs: string;
  titleHy: string;
  descriptionEs: string;
  descriptionHy: string;
}

export const FUN_FACTS: FunFact[] = [
  {
    titleEs: "Girar & Cruzar",
    titleHy: "Շրջադարձ և Անցում",
    descriptionEs: "En España, las señales de tráfico usan 'Gire a la derecha/izquierda' y los pasos de peatones son para 'cruzar'.",
    descriptionHy: "Իսպանիայում ճանապարհային նշանները օգտագործում են «Gire...» (Թեքվե՛ք), իսկ հետիոտնային անցումները՝ «cruzar» (անցնել) բայը։"
  },
  {
    titleEs: "Gratis vs. Libre",
    titleHy: "Gratis թե՞ Libre",
    descriptionEs: "'Gratis' significa que no cuesta dinero (como la entrada al jardín), mientras que 'libre' significa libertad o estar desocupado.",
    descriptionHy: "«Gratis» նշանակում է անվճար (ինչպես այգու մուտքը), մինչդեռ «libre» նշանակում է ազատություն կամ զբաղված չլինելը:"
  },
  {
    titleEs: "Pasear en España",
    titleHy: "Զբոսանքը Իսպանիայում",
    descriptionEs: "Dar un paseo es una de las actividades sociales más importantes de la cultura española, especialmente por las tardes.",
    descriptionHy: "«Dar un paseo» (զբոսնելը) իսպանական մշակույթի ամենակարևոր սոցիալական գործողություններից է, հատկապես երեկոյան ժամերին։"
  }
];
