// data/knowledgeQuestionBankV2.ts
// Comprehensive question bank for the Adaptive Knowledge Test
// FREE-TEXT ANSWER FORMAT - user types the answer
// Difficulty = estimated percentage of general population that would answer correctly
// Properly calibrated so 70% = things most people know, 10% = expert-level

export interface KnowledgeQuestionV2 {
    questionText: string;
    acceptedAnswers: string[]; // All valid answers (case-insensitive matching)
    hints?: string; // Optional hint shown after wrong attempt
    domain: string;
    difficulty: number; // 0-100, higher = easier (more people would know)
    tags?: string[];
}

// Normalize answer for comparison
export const normalizeAnswer = (answer: string): string => {
    return answer
        .toLowerCase()
        .trim()
        .replace(/[.,!?'"]/g, '') // Remove punctuation
        .replace(/^the\s+/i, '') // Remove leading "the"
        .replace(/^a\s+/i, '') // Remove leading "a"
        .replace(/^an\s+/i, ''); // Remove leading "an"
};

// Check if user's answer matches any accepted answer
export const checkAnswer = (userAnswer: string, acceptedAnswers: string[]): boolean => {
    const normalized = normalizeAnswer(userAnswer);
    return acceptedAnswers.some(accepted => {
        const normalizedAccepted = normalizeAnswer(accepted);
        // Exact match or close enough (allows minor typos for longer words)
        return normalized === normalizedAccepted || 
               (normalizedAccepted.length > 5 && normalized.includes(normalizedAccepted)) ||
               (normalizedAccepted.length > 5 && normalizedAccepted.includes(normalized));
    });
};

export const KNOWLEDGE_QUESTIONS_V2: KnowledgeQuestionV2[] = [
    // ============================================
    // DIFFICULTY 90-100% (Almost everyone knows)
    // ============================================
    
    // Geography - Super Easy
    { questionText: "What country is Paris the capital of?", acceptedAnswers: ["France", "French Republic"], domain: "Geography", difficulty: 98 },
    { questionText: "What is the largest continent?", acceptedAnswers: ["Asia"], domain: "Geography", difficulty: 95 },
    { questionText: "What ocean is between America and Europe?", acceptedAnswers: ["Atlantic", "Atlantic Ocean"], domain: "Geography", difficulty: 94 },
    { questionText: "What country is the Great Wall located in?", acceptedAnswers: ["China", "People's Republic of China", "PRC"], domain: "Geography", difficulty: 96 },
    { questionText: "What is the capital of the United States?", acceptedAnswers: ["Washington", "Washington DC", "Washington D.C.", "DC"], domain: "Geography", difficulty: 95 },
    { questionText: "What country has the Eiffel Tower?", acceptedAnswers: ["France"], domain: "Geography", difficulty: 97 },
    { questionText: "What is the capital of England?", acceptedAnswers: ["London"], domain: "Geography", difficulty: 96 },
    { questionText: "What continent is Egypt in?", acceptedAnswers: ["Africa"], domain: "Geography", difficulty: 92 },
    
    // Science - Super Easy
    { questionText: "What planet do we live on?", acceptedAnswers: ["Earth"], domain: "Science", difficulty: 99 },
    { questionText: "What do you call frozen water?", acceptedAnswers: ["Ice"], domain: "Science", difficulty: 99 },
    { questionText: "What is H2O commonly called?", acceptedAnswers: ["Water"], domain: "Science", difficulty: 97 },
    { questionText: "What star is closest to Earth?", acceptedAnswers: ["Sun", "The Sun", "Sol"], domain: "Science", difficulty: 95 },
    { questionText: "How many days are in a year?", acceptedAnswers: ["365", "365 days", "three hundred sixty five"], domain: "Science", difficulty: 94 },
    { questionText: "What force keeps us on the ground?", acceptedAnswers: ["Gravity"], domain: "Science", difficulty: 93 },
    { questionText: "What is the boiling point of water in Celsius?", acceptedAnswers: ["100", "100 degrees", "100C", "100°C"], domain: "Science", difficulty: 90 },
    
    // History - Super Easy
    { questionText: "What was the first name of President Lincoln?", acceptedAnswers: ["Abraham", "Abe"], domain: "History", difficulty: 92 },
    { questionText: "In what country did the ancient pyramids get built?", acceptedAnswers: ["Egypt"], domain: "History", difficulty: 95 },
    { questionText: "What year did World War II end?", acceptedAnswers: ["1945", "nineteen forty five"], domain: "History", difficulty: 85 },
    { questionText: "Who was the first man to walk on the moon?", acceptedAnswers: ["Neil Armstrong", "Armstrong"], domain: "History", difficulty: 90 },
    
    // Pop Culture - Super Easy  
    { questionText: "What fruit did Snow White eat that put her to sleep?", acceptedAnswers: ["Apple", "Poisoned apple", "Poison apple"], domain: "Culture", difficulty: 95 },
    { questionText: "What color are Smurfs?", acceptedAnswers: ["Blue"], domain: "Culture", difficulty: 97 },
    { questionText: "What superhero is also called the Dark Knight?", acceptedAnswers: ["Batman", "Bruce Wayne"], domain: "Culture", difficulty: 92 },
    
    // ============================================
    // DIFFICULTY 80-89% (Most people know)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Japan?", acceptedAnswers: ["Tokyo"], domain: "Geography", difficulty: 88 },
    { questionText: "What is the largest ocean?", acceptedAnswers: ["Pacific", "Pacific Ocean"], domain: "Geography", difficulty: 85 },
    { questionText: "What country is the Amazon rainforest mostly in?", acceptedAnswers: ["Brazil"], domain: "Geography", difficulty: 82 },
    { questionText: "What is the capital of Italy?", acceptedAnswers: ["Rome", "Roma"], domain: "Geography", difficulty: 87 },
    { questionText: "What country is famous for kangaroos?", acceptedAnswers: ["Australia"], domain: "Geography", difficulty: 95 },
    { questionText: "What is the longest river in Africa?", acceptedAnswers: ["Nile", "Nile River", "River Nile"], domain: "Geography", difficulty: 80 },
    { questionText: "What is the capital of Germany?", acceptedAnswers: ["Berlin"], domain: "Geography", difficulty: 85 },
    { questionText: "What ocean is on the west coast of the United States?", acceptedAnswers: ["Pacific", "Pacific Ocean"], domain: "Geography", difficulty: 88 },
    
    // Science
    { questionText: "What is the largest organ in the human body?", acceptedAnswers: ["Skin"], domain: "Science", difficulty: 80 },
    { questionText: "What gas do plants absorb from the air?", acceptedAnswers: ["Carbon dioxide", "CO2", "Carbon"], domain: "Science", difficulty: 82 },
    { questionText: "How many planets are in our solar system?", acceptedAnswers: ["8", "Eight"], domain: "Science", difficulty: 85 },
    { questionText: "What do caterpillars turn into?", acceptedAnswers: ["Butterfly", "Butterflies", "Moth", "Moths"], domain: "Science", difficulty: 90 },
    { questionText: "What is the chemical symbol for gold?", acceptedAnswers: ["Au"], domain: "Science", difficulty: 75 },
    { questionText: "What planet is known as the Red Planet?", acceptedAnswers: ["Mars"], domain: "Science", difficulty: 88 },
    { questionText: "What type of animal is a whale?", acceptedAnswers: ["Mammal"], domain: "Science", difficulty: 82 },
    
    // History
    { questionText: "What ship sank after hitting an iceberg in 1912?", acceptedAnswers: ["Titanic", "RMS Titanic", "The Titanic"], domain: "History", difficulty: 88 },
    { questionText: "Who painted the Mona Lisa?", acceptedAnswers: ["Leonardo da Vinci", "Da Vinci", "Leonardo"], domain: "History", difficulty: 82 },
    { questionText: "What empire built the Colosseum in Rome?", acceptedAnswers: ["Roman", "Roman Empire", "Romans", "Rome"], domain: "History", difficulty: 85 },
    { questionText: "What did Thomas Edison invent that lights up?", acceptedAnswers: ["Light bulb", "Lightbulb", "Electric light", "Bulb"], domain: "History", difficulty: 85 },
    
    // Culture
    { questionText: "What instrument has 88 keys?", acceptedAnswers: ["Piano"], domain: "Culture", difficulty: 85 },
    { questionText: "What is the name of Harry Potter's best friend (male)?", acceptedAnswers: ["Ron", "Ron Weasley", "Ronald Weasley", "Ronald"], domain: "Culture", difficulty: 85 },
    { questionText: "Who wrote Romeo and Juliet?", acceptedAnswers: ["Shakespeare", "William Shakespeare"], domain: "Culture", difficulty: 88 },
    
    // ============================================
    // DIFFICULTY 70-79% (B-Rank - Average educated person)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Canada?", acceptedAnswers: ["Ottawa"], domain: "Geography", difficulty: 72 },
    { questionText: "What is the largest country by area?", acceptedAnswers: ["Russia", "Russian Federation"], domain: "Geography", difficulty: 78 },
    { questionText: "What is the capital of Spain?", acceptedAnswers: ["Madrid"], domain: "Geography", difficulty: 78 },
    { questionText: "What river runs through London?", acceptedAnswers: ["Thames", "River Thames"], domain: "Geography", difficulty: 75 },
    { questionText: "What country is shaped like a boot?", acceptedAnswers: ["Italy"], domain: "Geography", difficulty: 80 },
    { questionText: "What is the smallest continent?", acceptedAnswers: ["Australia", "Oceania"], domain: "Geography", difficulty: 75 },
    { questionText: "What mountain is the tallest in the world?", acceptedAnswers: ["Everest", "Mount Everest", "Mt Everest", "Mt. Everest"], domain: "Geography", difficulty: 85 },
    { questionText: "What is the capital of China?", acceptedAnswers: ["Beijing", "Peking"], domain: "Geography", difficulty: 78 },
    
    // Science
    { questionText: "What is the center of an atom called?", acceptedAnswers: ["Nucleus"], domain: "Science", difficulty: 75 },
    { questionText: "What organ pumps blood through the body?", acceptedAnswers: ["Heart"], domain: "Science", difficulty: 92 },
    { questionText: "What is the hardest natural substance?", acceptedAnswers: ["Diamond"], domain: "Science", difficulty: 78 },
    { questionText: "What gas do humans breathe out?", acceptedAnswers: ["Carbon dioxide", "CO2"], domain: "Science", difficulty: 75 },
    { questionText: "How many bones are in the adult human body?", acceptedAnswers: ["206", "two hundred six", "two hundred and six"], domain: "Science", difficulty: 55 },
    { questionText: "What planet has rings around it?", acceptedAnswers: ["Saturn"], domain: "Science", difficulty: 85 },
    { questionText: "What is the powerhouse of the cell?", acceptedAnswers: ["Mitochondria", "Mitochondrion"], domain: "Science", difficulty: 70 },
    
    // History
    { questionText: "What ancient wonder was in Egypt?", acceptedAnswers: ["Pyramids", "Great Pyramid", "Pyramid", "Pyramids of Giza", "Great Pyramids"], domain: "History", difficulty: 85 },
    { questionText: "Who discovered America in 1492?", acceptedAnswers: ["Columbus", "Christopher Columbus", "Cristobal Colon"], domain: "History", difficulty: 80 },
    { questionText: "What country did the United States declare independence from?", acceptedAnswers: ["Britain", "England", "Great Britain", "UK", "United Kingdom", "British"], domain: "History", difficulty: 85 },
    { questionText: "Who was the first President of the United States?", acceptedAnswers: ["Washington", "George Washington"], domain: "History", difficulty: 88 },
    { questionText: "What war was fought between the North and South in America?", acceptedAnswers: ["Civil War", "American Civil War", "The Civil War"], domain: "History", difficulty: 82 },
    
    // Culture & Arts
    { questionText: "Who wrote 'Harry Potter'?", acceptedAnswers: ["JK Rowling", "J.K. Rowling", "J K Rowling", "Rowling", "Joanne Rowling"], domain: "Culture", difficulty: 85 },
    { questionText: "What instrument does a violinist play?", acceptedAnswers: ["Violin"], domain: "Culture", difficulty: 95 },
    { questionText: "What color do you get when you mix red and blue?", acceptedAnswers: ["Purple", "Violet"], domain: "Culture", difficulty: 92 },
    { questionText: "How many strings does a standard guitar have?", acceptedAnswers: ["6", "Six"], domain: "Culture", difficulty: 78 },
    
    // Math
    { questionText: "What is the square root of 100?", acceptedAnswers: ["10", "Ten"], domain: "Mathematics", difficulty: 85 },
    { questionText: "What is 15% of 100?", acceptedAnswers: ["15", "Fifteen"], domain: "Mathematics", difficulty: 80 },
    { questionText: "How many sides does a hexagon have?", acceptedAnswers: ["6", "Six"], domain: "Mathematics", difficulty: 75 },
    { questionText: "What is the value of Pi to two decimal places?", acceptedAnswers: ["3.14", "three point one four"], domain: "Mathematics", difficulty: 78 },
    
    // ============================================
    // DIFFICULTY 60-69% (Above average knowledge)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Australia?", acceptedAnswers: ["Canberra"], domain: "Geography", difficulty: 55 },
    { questionText: "What strait separates Europe from Africa?", acceptedAnswers: ["Gibraltar", "Strait of Gibraltar"], domain: "Geography", difficulty: 60 },
    { questionText: "What is the capital of Brazil?", acceptedAnswers: ["Brasilia", "Brasília"], domain: "Geography", difficulty: 55 },
    { questionText: "What two countries share the longest border?", acceptedAnswers: ["Canada and USA", "USA and Canada", "US and Canada", "Canada and US", "Canada and United States", "United States and Canada"], domain: "Geography", difficulty: 60 },
    { questionText: "What is the capital of South Korea?", acceptedAnswers: ["Seoul"], domain: "Geography", difficulty: 68 },
    
    // Science
    { questionText: "What is the chemical symbol for iron?", acceptedAnswers: ["Fe"], domain: "Science", difficulty: 62 },
    { questionText: "What is the most abundant gas in Earth's atmosphere?", acceptedAnswers: ["Nitrogen", "N2"], domain: "Science", difficulty: 58 },
    { questionText: "What element has the atomic number 1?", acceptedAnswers: ["Hydrogen", "H"], domain: "Science", difficulty: 65 },
    { questionText: "What is the largest planet in our solar system?", acceptedAnswers: ["Jupiter"], domain: "Science", difficulty: 75 },
    { questionText: "What is the speed of light approximately in km/s?", acceptedAnswers: ["300000", "300,000", "three hundred thousand", "299792"], domain: "Science", difficulty: 50 },
    
    // History
    { questionText: "What year did the Berlin Wall fall?", acceptedAnswers: ["1989", "nineteen eighty nine"], domain: "History", difficulty: 62 },
    { questionText: "Who was the leader of Nazi Germany?", acceptedAnswers: ["Hitler", "Adolf Hitler"], domain: "History", difficulty: 88 },
    { questionText: "What country did Napoleon rule?", acceptedAnswers: ["France"], domain: "History", difficulty: 75 },
    { questionText: "Who wrote the Declaration of Independence (primary author)?", acceptedAnswers: ["Jefferson", "Thomas Jefferson"], domain: "History", difficulty: 60 },
    { questionText: "What year did the United States declare independence?", acceptedAnswers: ["1776", "seventeen seventy six"], domain: "History", difficulty: 70 },
    
    // Culture
    { questionText: "Who painted the ceiling of the Sistine Chapel?", acceptedAnswers: ["Michelangelo"], domain: "Culture", difficulty: 65 },
    { questionText: "What is the name of Sherlock Holmes' assistant?", acceptedAnswers: ["Watson", "Dr Watson", "Dr. Watson", "John Watson"], domain: "Culture", difficulty: 75 },
    { questionText: "Who composed the 'Moonlight Sonata'?", acceptedAnswers: ["Beethoven", "Ludwig van Beethoven"], domain: "Culture", difficulty: 58 },
    { questionText: "Who painted 'Starry Night'?", acceptedAnswers: ["Van Gogh", "Vincent van Gogh", "Vincent Van Gogh"], domain: "Culture", difficulty: 65 },
    
    // ============================================
    // DIFFICULTY 50-59% (Good general knowledge)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Egypt?", acceptedAnswers: ["Cairo"], domain: "Geography", difficulty: 68 },
    { questionText: "What is the deepest ocean trench?", acceptedAnswers: ["Mariana Trench", "Mariana", "Marianas Trench"], domain: "Geography", difficulty: 55 },
    { questionText: "What is the capital of India?", acceptedAnswers: ["New Delhi", "Delhi"], domain: "Geography", difficulty: 65 },
    { questionText: "What desert is the largest hot desert?", acceptedAnswers: ["Sahara", "Sahara Desert"], domain: "Geography", difficulty: 72 },
    
    // Science
    { questionText: "What vitamin is produced when skin is exposed to sunlight?", acceptedAnswers: ["Vitamin D", "D"], domain: "Science", difficulty: 55 },
    { questionText: "What organ produces insulin?", acceptedAnswers: ["Pancreas"], domain: "Science", difficulty: 52 },
    { questionText: "What is the chemical formula for table salt?", acceptedAnswers: ["NaCl", "Sodium Chloride"], domain: "Science", difficulty: 55 },
    { questionText: "What is absolute zero in Celsius (approximately)?", acceptedAnswers: ["-273", "-273.15", "minus 273", "negative 273"], domain: "Science", difficulty: 45 },
    
    // History
    { questionText: "Who was the Egyptian queen who allied with Julius Caesar and Mark Antony?", acceptedAnswers: ["Cleopatra", "Cleopatra VII"], domain: "History", difficulty: 72 },
    { questionText: "What was the first man-made satellite launched into space?", acceptedAnswers: ["Sputnik", "Sputnik 1"], domain: "History", difficulty: 55 },
    { questionText: "Who invented the telephone?", acceptedAnswers: ["Alexander Graham Bell", "Bell", "Graham Bell"], domain: "History", difficulty: 60 },
    { questionText: "What event started World War I?", acceptedAnswers: ["Assassination of Franz Ferdinand", "Franz Ferdinand assassination", "Archduke assassination", "Assassination of Archduke"], domain: "History", difficulty: 50 },
    
    // Culture
    { questionText: "Who wrote '1984'?", acceptedAnswers: ["George Orwell", "Orwell", "Eric Blair"], domain: "Culture", difficulty: 58 },
    { questionText: "Who wrote 'Pride and Prejudice'?", acceptedAnswers: ["Jane Austen", "Austen"], domain: "Culture", difficulty: 60 },
    { questionText: "What Greek philosopher was the teacher of Alexander the Great?", acceptedAnswers: ["Aristotle"], domain: "Culture", difficulty: 45 },
    
    // ============================================
    // DIFFICULTY 40-49% (Strong knowledge)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Turkey?", acceptedAnswers: ["Ankara"], domain: "Geography", difficulty: 45 },
    { questionText: "What is the longest river in South America?", acceptedAnswers: ["Amazon", "Amazon River"], domain: "Geography", difficulty: 65 },
    { questionText: "What mountain range separates Europe from Asia?", acceptedAnswers: ["Urals", "Ural Mountains", "Ural"], domain: "Geography", difficulty: 42 },
    { questionText: "What is the capital of Poland?", acceptedAnswers: ["Warsaw", "Warszawa"], domain: "Geography", difficulty: 48 },
    
    // Science
    { questionText: "What is the half-life of Carbon-14 approximately (in years)?", acceptedAnswers: ["5730", "5,730", "5700", "5730 years"], domain: "Science", difficulty: 25 },
    { questionText: "What is the pH of pure water?", acceptedAnswers: ["7", "Seven"], domain: "Science", difficulty: 55 },
    { questionText: "What does DNA stand for?", acceptedAnswers: ["Deoxyribonucleic acid", "Deoxyribonucleic"], domain: "Science", difficulty: 48 },
    { questionText: "What is the unit of electrical resistance?", acceptedAnswers: ["Ohm", "Ohms"], domain: "Science", difficulty: 50 },
    
    // History
    { questionText: "In what year did the French Revolution begin?", acceptedAnswers: ["1789", "seventeen eighty nine"], domain: "History", difficulty: 48 },
    { questionText: "What was the last dynasty to rule China?", acceptedAnswers: ["Qing", "Qing Dynasty", "Manchu"], domain: "History", difficulty: 35 },
    { questionText: "What city was divided by a wall from 1961 to 1989?", acceptedAnswers: ["Berlin"], domain: "History", difficulty: 68 },
    { questionText: "Who led the Soviet Union during most of World War II?", acceptedAnswers: ["Stalin", "Joseph Stalin"], domain: "History", difficulty: 58 },
    
    // Culture
    { questionText: "Who wrote 'The Divine Comedy'?", acceptedAnswers: ["Dante", "Dante Alighieri"], domain: "Culture", difficulty: 45 },
    { questionText: "What is the name of the art movement Salvador Dalí was part of?", acceptedAnswers: ["Surrealism", "Surrealist"], domain: "Culture", difficulty: 48 },
    { questionText: "Who composed 'The Four Seasons'?", acceptedAnswers: ["Vivaldi", "Antonio Vivaldi"], domain: "Culture", difficulty: 42 },
    
    // ============================================
    // DIFFICULTY 30-39% (Very good knowledge)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Pakistan?", acceptedAnswers: ["Islamabad"], domain: "Geography", difficulty: 35 },
    { questionText: "What African country was formerly called Abyssinia?", acceptedAnswers: ["Ethiopia"], domain: "Geography", difficulty: 32 },
    { questionText: "What is the capital of Morocco?", acceptedAnswers: ["Rabat"], domain: "Geography", difficulty: 30 },
    { questionText: "Through how many countries does the Danube River flow?", acceptedAnswers: ["10", "Ten"], domain: "Geography", difficulty: 25 },
    
    // Science
    { questionText: "What is the name of the particle that mediates the electromagnetic force?", acceptedAnswers: ["Photon"], domain: "Science", difficulty: 35 },
    { questionText: "What is the SI unit of force?", acceptedAnswers: ["Newton", "Newtons", "N"], domain: "Science", difficulty: 48 },
    { questionText: "What is an atom with a different number of neutrons called?", acceptedAnswers: ["Isotope"], domain: "Science", difficulty: 38 },
    { questionText: "What is the event horizon of a black hole?", acceptedAnswers: ["Point of no return", "Boundary", "The boundary from which nothing can escape"], domain: "Science", difficulty: 32 },
    
    // History
    { questionText: "What treaty ended the Thirty Years' War?", acceptedAnswers: ["Peace of Westphalia", "Westphalia", "Treaty of Westphalia"], domain: "History", difficulty: 22 },
    { questionText: "Who was the first Mughal Emperor of India?", acceptedAnswers: ["Babur"], domain: "History", difficulty: 25 },
    { questionText: "What year was the Magna Carta signed?", acceptedAnswers: ["1215", "twelve fifteen"], domain: "History", difficulty: 35 },
    { questionText: "Who was known as the 'Sun King' of France?", acceptedAnswers: ["Louis XIV", "Louis the 14th", "Louis 14"], domain: "History", difficulty: 32 },
    
    // Philosophy
    { questionText: "Who said 'I think, therefore I am'?", acceptedAnswers: ["Descartes", "René Descartes", "Rene Descartes"], domain: "Philosophy", difficulty: 48 },
    { questionText: "Who wrote 'The Republic'?", acceptedAnswers: ["Plato"], domain: "Philosophy", difficulty: 42 },
    { questionText: "What is the study of knowledge called?", acceptedAnswers: ["Epistemology"], domain: "Philosophy", difficulty: 30 },
    
    // ============================================
    // DIFFICULTY 20-29% (Excellent knowledge)
    // ============================================
    
    // Geography
    { questionText: "What is the capital of Myanmar?", acceptedAnswers: ["Naypyidaw", "Nay Pyi Taw"], domain: "Geography", difficulty: 18 },
    { questionText: "Which country has the most time zones?", acceptedAnswers: ["France"], domain: "Geography", difficulty: 15 },
    { questionText: "What is the capital of Kazakhstan?", acceptedAnswers: ["Astana", "Nur-Sultan"], domain: "Geography", difficulty: 22 },
    
    // Science
    { questionText: "What is the Chandrasekhar limit the maximum mass of?", acceptedAnswers: ["White dwarf", "A white dwarf star", "White dwarf star"], domain: "Science", difficulty: 18 },
    { questionText: "What is Heisenberg's Uncertainty Principle about?", acceptedAnswers: ["Position and momentum", "Cannot know position and momentum simultaneously", "Uncertainty in position and momentum"], domain: "Science", difficulty: 28 },
    { questionText: "What is the name of the hypothetical particle that mediates gravity?", acceptedAnswers: ["Graviton"], domain: "Science", difficulty: 22 },
    
    // History
    { questionText: "In what year did the Byzantine Empire finally fall?", acceptedAnswers: ["1453", "fourteen fifty three"], domain: "History", difficulty: 25 },
    { questionText: "What Chinese dynasty built most of the Great Wall as we know it today?", acceptedAnswers: ["Ming", "Ming Dynasty"], domain: "History", difficulty: 20 },
    { questionText: "Who was the first Holy Roman Emperor?", acceptedAnswers: ["Charlemagne", "Charles the Great", "Karl der Große"], domain: "History", difficulty: 22 },
    
    // Philosophy
    { questionText: "Who developed the concept of 'falsifiability' in scientific theory?", acceptedAnswers: ["Popper", "Karl Popper"], domain: "Philosophy", difficulty: 20 },
    { questionText: "What is the philosophical position that only the self can be known to exist?", acceptedAnswers: ["Solipsism"], domain: "Philosophy", difficulty: 22 },
    { questionText: "What is Occam's Razor?", acceptedAnswers: ["Simplest explanation is best", "Simplest solution", "Prefer simpler theories", "Entities should not be multiplied unnecessarily"], domain: "Philosophy", difficulty: 35 },
    
    // ============================================
    // DIFFICULTY 10-19% (Expert knowledge)
    // ============================================
    
    // Geography
    { questionText: "Which country has the highest average elevation?", acceptedAnswers: ["Bhutan"], domain: "Geography", difficulty: 8 },
    { questionText: "What is the only sea without any coastline?", acceptedAnswers: ["Sargasso Sea", "Sargasso"], domain: "Geography", difficulty: 12 },
    { questionText: "The Skeleton Coast is in which country?", acceptedAnswers: ["Namibia"], domain: "Geography", difficulty: 10 },
    
    // Science
    { questionText: "What is the Mpemba effect?", acceptedAnswers: ["Hot water freezing faster than cold", "Hot water can freeze faster than cold water"], domain: "Science", difficulty: 10 },
    { questionText: "What is a prion?", acceptedAnswers: ["Misfolded protein", "Infectious protein", "Protein that causes disease"], domain: "Science", difficulty: 18 },
    { questionText: "What is the Drake Equation used to estimate?", acceptedAnswers: ["Alien civilizations", "Extraterrestrial civilizations", "Number of civilizations in the galaxy"], domain: "Science", difficulty: 15 },
    
    // History
    { questionText: "Who was the first known author in history?", acceptedAnswers: ["Enheduanna"], domain: "History", difficulty: 5 },
    { questionText: "What was the Defenestration of Prague a trigger for?", acceptedAnswers: ["Thirty Years War", "Thirty Years' War", "30 Years War"], domain: "History", difficulty: 12 },
    { questionText: "What was the Zimmermann Telegram sent to which country?", acceptedAnswers: ["Mexico"], domain: "History", difficulty: 18 },
    
    // Philosophy
    { questionText: "What is Wittgenstein's 'Beetle in a Box' argument about?", acceptedAnswers: ["Private language", "Private language problem"], domain: "Philosophy", difficulty: 8 },
    { questionText: "What does the Gettier Problem challenge the definition of?", acceptedAnswers: ["Knowledge"], domain: "Philosophy", difficulty: 10 },
    { questionText: "Who wrote 'Being and Time'?", acceptedAnswers: ["Heidegger", "Martin Heidegger"], domain: "Philosophy", difficulty: 15 },
    
    // Computer Science
    { questionText: "What is the Kolmogorov complexity of a string?", acceptedAnswers: ["Length of shortest program", "Shortest program that outputs it", "Minimum description length"], domain: "Computer Science", difficulty: 8 },
    { questionText: "What does the CAP theorem stand for in distributed systems?", acceptedAnswers: ["Consistency Availability Partition tolerance", "Consistency, Availability, Partition tolerance"], domain: "Computer Science", difficulty: 12 },
    { questionText: "What problem does the Byzantine Generals Problem describe?", acceptedAnswers: ["Consensus", "Agreement in distributed systems", "Reaching consensus with faulty nodes"], domain: "Computer Science", difficulty: 10 },
    
    // ============================================
    // DIFFICULTY 1-9% (Genius/Specialist knowledge)
    // ============================================
    
    { questionText: "What is the Birch and Swinnerton-Dyer conjecture about?", acceptedAnswers: ["Elliptic curves", "Rational points on elliptic curves"], domain: "Mathematics", difficulty: 3 },
    { questionText: "What is a Banach space?", acceptedAnswers: ["Complete normed vector space", "Complete normed space"], domain: "Mathematics", difficulty: 5 },
    { questionText: "What is ergativity in linguistics?", acceptedAnswers: ["Grammatical pattern", "Treatment of transitive subjects", "Marking subjects differently"], domain: "Linguistics", difficulty: 5 },
    { questionText: "What is homomorphic encryption?", acceptedAnswers: ["Computing on encrypted data", "Encryption that allows computation"], domain: "Computer Science", difficulty: 8 },
    { questionText: "What is jus cogens in international law?", acceptedAnswers: ["Peremptory norms", "Non-derogable norms", "Fundamental principles"], domain: "Law", difficulty: 6 },

    // ============================================
    // ADDITIONAL QUESTIONS - MORE VARIETY
    // ============================================
    
    // Sports - Easy
    { questionText: "How many players are on a soccer team on the field?", acceptedAnswers: ["11", "Eleven"], domain: "Sports", difficulty: 85 },
    { questionText: "What sport uses a shuttlecock?", acceptedAnswers: ["Badminton"], domain: "Sports", difficulty: 75 },
    { questionText: "What is the national sport of the United States?", acceptedAnswers: ["Baseball", "American football", "Football"], domain: "Sports", difficulty: 70 },
    { questionText: "How many holes are in a standard round of golf?", acceptedAnswers: ["18", "Eighteen"], domain: "Sports", difficulty: 75 },
    { questionText: "What country hosted the first modern Olympic Games?", acceptedAnswers: ["Greece"], domain: "Sports", difficulty: 70 },
    
    // Food & Cooking - Easy
    { questionText: "What country is sushi from?", acceptedAnswers: ["Japan"], domain: "Food", difficulty: 90 },
    { questionText: "What is the main ingredient in guacamole?", acceptedAnswers: ["Avocado", "Avocados"], domain: "Food", difficulty: 85 },
    { questionText: "What Italian dish is made of layers of pasta, meat, and cheese?", acceptedAnswers: ["Lasagna", "Lasagne"], domain: "Food", difficulty: 88 },
    { questionText: "What country is pizza originally from?", acceptedAnswers: ["Italy"], domain: "Food", difficulty: 92 },
    { questionText: "What fruit is wine typically made from?", acceptedAnswers: ["Grapes", "Grape"], domain: "Food", difficulty: 90 },
    
    // Technology - Easy to Medium
    { questionText: "What does 'www' stand for in a web address?", acceptedAnswers: ["World Wide Web"], domain: "Technology", difficulty: 80 },
    { questionText: "What company makes the iPhone?", acceptedAnswers: ["Apple"], domain: "Technology", difficulty: 95 },
    { questionText: "What does CPU stand for?", acceptedAnswers: ["Central Processing Unit"], domain: "Technology", difficulty: 70 },
    { questionText: "Who founded Microsoft?", acceptedAnswers: ["Bill Gates", "Bill Gates and Paul Allen", "Gates"], domain: "Technology", difficulty: 75 },
    { questionText: "What year was the first iPhone released?", acceptedAnswers: ["2007"], domain: "Technology", difficulty: 55 },
    { questionText: "What does HTML stand for?", acceptedAnswers: ["HyperText Markup Language", "Hypertext Markup Language"], domain: "Technology", difficulty: 55 },
    
    // Animals - Easy
    { questionText: "What is the largest land animal?", acceptedAnswers: ["Elephant", "African Elephant"], domain: "Science", difficulty: 88 },
    { questionText: "What is the fastest land animal?", acceptedAnswers: ["Cheetah"], domain: "Science", difficulty: 85 },
    { questionText: "How many legs does a spider have?", acceptedAnswers: ["8", "Eight"], domain: "Science", difficulty: 90 },
    { questionText: "What animal is known as the 'King of the Jungle'?", acceptedAnswers: ["Lion"], domain: "Science", difficulty: 92 },
    { questionText: "What is a baby dog called?", acceptedAnswers: ["Puppy"], domain: "Science", difficulty: 95 },
    
    // Music - Medium
    { questionText: "What instrument does a drummer play?", acceptedAnswers: ["Drums", "Drum kit", "Drum set"], domain: "Music", difficulty: 95 },
    { questionText: "Who is known as the King of Pop?", acceptedAnswers: ["Michael Jackson"], domain: "Music", difficulty: 85 },
    { questionText: "What instrument family does the flute belong to?", acceptedAnswers: ["Woodwind", "Woodwinds"], domain: "Music", difficulty: 70 },
    { questionText: "How many strings does a standard violin have?", acceptedAnswers: ["4", "Four"], domain: "Music", difficulty: 65 },
    { questionText: "Who composed the opera 'The Magic Flute'?", acceptedAnswers: ["Mozart", "Wolfgang Amadeus Mozart"], domain: "Music", difficulty: 50 },
    { questionText: "How many keys does a standard piano have?", acceptedAnswers: ["88", "Eighty eight", "Eighty-eight"], domain: "Music", difficulty: 60 },
    
    // Language & Literature - Medium
    { questionText: "What language has the most native speakers?", acceptedAnswers: ["Mandarin", "Chinese", "Mandarin Chinese"], domain: "Language", difficulty: 60 },
    { questionText: "Who wrote 'The Lord of the Rings'?", acceptedAnswers: ["Tolkien", "J.R.R. Tolkien", "JRR Tolkien"], domain: "Literature", difficulty: 75 },
    { questionText: "What is the most widely spoken language in South America?", acceptedAnswers: ["Spanish", "Portuguese"], domain: "Language", difficulty: 70 },
    { questionText: "Who wrote 'To Kill a Mockingbird'?", acceptedAnswers: ["Harper Lee", "Lee"], domain: "Literature", difficulty: 60 },
    { questionText: "What language is 'Bonjour' from?", acceptedAnswers: ["French"], domain: "Language", difficulty: 90 },
    
    // World Capitals - Various difficulties
    { questionText: "What is the capital of Russia?", acceptedAnswers: ["Moscow"], domain: "Geography", difficulty: 82 },
    { questionText: "What is the capital of Mexico?", acceptedAnswers: ["Mexico City"], domain: "Geography", difficulty: 78 },
    { questionText: "What is the capital of Thailand?", acceptedAnswers: ["Bangkok"], domain: "Geography", difficulty: 65 },
    { questionText: "What is the capital of Argentina?", acceptedAnswers: ["Buenos Aires"], domain: "Geography", difficulty: 62 },
    { questionText: "What is the capital of Sweden?", acceptedAnswers: ["Stockholm"], domain: "Geography", difficulty: 58 },
    { questionText: "What is the capital of Greece?", acceptedAnswers: ["Athens"], domain: "Geography", difficulty: 72 },
    { questionText: "What is the capital of Vietnam?", acceptedAnswers: ["Hanoi"], domain: "Geography", difficulty: 45 },
    { questionText: "What is the capital of Peru?", acceptedAnswers: ["Lima"], domain: "Geography", difficulty: 52 },
    { questionText: "What is the capital of Ireland?", acceptedAnswers: ["Dublin"], domain: "Geography", difficulty: 72 },
    { questionText: "What is the capital of Switzerland?", acceptedAnswers: ["Bern", "Berne"], domain: "Geography", difficulty: 48 },
    
    // More Science - Various
    { questionText: "What is the chemical symbol for sodium?", acceptedAnswers: ["Na"], domain: "Science", difficulty: 58 },
    { questionText: "What is the smallest planet in our solar system?", acceptedAnswers: ["Mercury"], domain: "Science", difficulty: 72 },
    { questionText: "What is the study of weather called?", acceptedAnswers: ["Meteorology"], domain: "Science", difficulty: 55 },
    { questionText: "What element is represented by 'O' on the periodic table?", acceptedAnswers: ["Oxygen"], domain: "Science", difficulty: 85 },
    { questionText: "What is the freezing point of water in Fahrenheit?", acceptedAnswers: ["32", "32 degrees", "32°F"], domain: "Science", difficulty: 72 },
    { questionText: "What blood type is the universal donor?", acceptedAnswers: ["O negative", "O-", "O neg"], domain: "Science", difficulty: 55 },
    { questionText: "What is the study of living things called?", acceptedAnswers: ["Biology"], domain: "Science", difficulty: 85 },
    { questionText: "How many teeth does an adult human normally have?", acceptedAnswers: ["32", "Thirty two", "Thirty-two"], domain: "Science", difficulty: 62 },
    
    // More History - Various
    { questionText: "Who was the first woman to fly solo across the Atlantic?", acceptedAnswers: ["Amelia Earhart", "Earhart"], domain: "History", difficulty: 55 },
    { questionText: "What famous document starts with 'When in the Course of human events'?", acceptedAnswers: ["Declaration of Independence", "The Declaration of Independence"], domain: "History", difficulty: 50 },
    { questionText: "What ancient empire was ruled from Constantinople?", acceptedAnswers: ["Byzantine", "Byzantine Empire", "Eastern Roman", "Eastern Roman Empire"], domain: "History", difficulty: 42 },
    { questionText: "Who was the British Prime Minister during most of World War II?", acceptedAnswers: ["Churchill", "Winston Churchill"], domain: "History", difficulty: 65 },
    { questionText: "What civilization built Machu Picchu?", acceptedAnswers: ["Inca", "Incas", "Incan"], domain: "History", difficulty: 60 },
    { questionText: "What year did man first land on the moon?", acceptedAnswers: ["1969", "nineteen sixty nine"], domain: "History", difficulty: 75 },
    { questionText: "What famous wall was built to keep out northern invaders in China?", acceptedAnswers: ["Great Wall", "Great Wall of China", "The Great Wall"], domain: "History", difficulty: 90 },
    
    // Art & Culture - Medium
    { questionText: "What famous sculpture shows a man thinking with his chin on his hand?", acceptedAnswers: ["The Thinker", "Thinker"], domain: "Art", difficulty: 65 },
    { questionText: "What artist is famous for cutting off his own ear?", acceptedAnswers: ["Van Gogh", "Vincent van Gogh"], domain: "Art", difficulty: 72 },
    { questionText: "What museum is home to the Mona Lisa?", acceptedAnswers: ["Louvre", "The Louvre", "Louvre Museum"], domain: "Art", difficulty: 58 },
    { questionText: "What Japanese art form involves folding paper?", acceptedAnswers: ["Origami"], domain: "Culture", difficulty: 82 },
    { questionText: "What color are the stars on the American flag?", acceptedAnswers: ["White"], domain: "Culture", difficulty: 90 },
    
    // Math - Medium to Hard
    { questionText: "What is 7 times 8?", acceptedAnswers: ["56", "Fifty six", "Fifty-six"], domain: "Mathematics", difficulty: 92 },
    { questionText: "What is the square root of 81?", acceptedAnswers: ["9", "Nine"], domain: "Mathematics", difficulty: 80 },
    { questionText: "How many sides does a pentagon have?", acceptedAnswers: ["5", "Five"], domain: "Mathematics", difficulty: 78 },
    { questionText: "What is 25% of 200?", acceptedAnswers: ["50", "Fifty"], domain: "Mathematics", difficulty: 75 },
    { questionText: "What is the mathematical constant approximately equal to 3.14159?", acceptedAnswers: ["Pi", "π"], domain: "Mathematics", difficulty: 82 },
    { questionText: "What is the sum of the angles in a triangle?", acceptedAnswers: ["180", "180 degrees", "One hundred eighty"], domain: "Mathematics", difficulty: 72 },
    { questionText: "What is the derivative of x squared?", acceptedAnswers: ["2x", "Two x"], domain: "Mathematics", difficulty: 45 },
    { questionText: "What shape has exactly 4 equal sides and 4 right angles?", acceptedAnswers: ["Square"], domain: "Mathematics", difficulty: 90 },
    
    // Religion & Mythology - Various
    { questionText: "In Greek mythology, who is the king of the gods?", acceptedAnswers: ["Zeus"], domain: "Mythology", difficulty: 80 },
    { questionText: "What is the holy book of Islam?", acceptedAnswers: ["Quran", "Koran", "Qur'an"], domain: "Religion", difficulty: 78 },
    { questionText: "In Norse mythology, what is the name of Thor's hammer?", acceptedAnswers: ["Mjolnir", "Mjölnir"], domain: "Mythology", difficulty: 60 },
    { questionText: "What religion follows the teachings of the Buddha?", acceptedAnswers: ["Buddhism", "Buddhist"], domain: "Religion", difficulty: 85 },
    { questionText: "In Greek mythology, who flew too close to the sun?", acceptedAnswers: ["Icarus"], domain: "Mythology", difficulty: 65 },
    { questionText: "What is the Hindu festival of lights called?", acceptedAnswers: ["Diwali", "Divali"], domain: "Religion", difficulty: 55 },
    
    // Economics & Business - Medium to Hard
    { questionText: "What does GDP stand for?", acceptedAnswers: ["Gross Domestic Product"], domain: "Economics", difficulty: 65 },
    { questionText: "What stock exchange is located on Wall Street?", acceptedAnswers: ["NYSE", "New York Stock Exchange"], domain: "Economics", difficulty: 65 },
    { questionText: "What is it called when prices rise over time?", acceptedAnswers: ["Inflation"], domain: "Economics", difficulty: 72 },
    { questionText: "What currency is used in Japan?", acceptedAnswers: ["Yen", "Japanese Yen"], domain: "Economics", difficulty: 72 },
    { questionText: "What currency is used in the UK?", acceptedAnswers: ["Pound", "British Pound", "Pound Sterling", "GBP"], domain: "Economics", difficulty: 80 },

    // ============================================
    // EXPANDED QUESTION BANK - 100+ NEW QUESTIONS
    // ============================================

    // MOVIES & ENTERTAINMENT - Easy to Medium
    { questionText: "What movie franchise features a character named Darth Vader?", acceptedAnswers: ["Star Wars"], domain: "Entertainment", difficulty: 92 },
    { questionText: "What wizard attends Hogwarts School of Witchcraft and Wizardry?", acceptedAnswers: ["Harry Potter", "Harry"], domain: "Entertainment", difficulty: 95 },
    { questionText: "What color is Shrek?", acceptedAnswers: ["Green"], domain: "Entertainment", difficulty: 97 },
    { questionText: "What animated movie features a clownfish named Nemo?", acceptedAnswers: ["Finding Nemo"], domain: "Entertainment", difficulty: 92 },
    { questionText: "Who directed the movie 'Titanic' (1997)?", acceptedAnswers: ["James Cameron", "Cameron"], domain: "Entertainment", difficulty: 58 },
    { questionText: "What film won the first ever Academy Award for Best Picture?", acceptedAnswers: ["Wings"], domain: "Entertainment", difficulty: 12 },
    { questionText: "Who played Iron Man in the Marvel films?", acceptedAnswers: ["Robert Downey Jr", "Robert Downey Junior", "RDJ"], domain: "Entertainment", difficulty: 80 },
    { questionText: "What is the highest-grossing film of all time (adjusted)?", acceptedAnswers: ["Gone with the Wind", "Avatar"], domain: "Entertainment", difficulty: 25 },
    { questionText: "What film features the song 'My Heart Will Go On'?", acceptedAnswers: ["Titanic"], domain: "Entertainment", difficulty: 75 },
    { questionText: "What country produces Bollywood films?", acceptedAnswers: ["India"], domain: "Entertainment", difficulty: 85 },

    // BIOLOGY & MEDICINE - Various
    { questionText: "What is the powerhouse of the cell?", acceptedAnswers: ["Mitochondria", "Mitochondrion"], domain: "Biology", difficulty: 82 },
    { questionText: "What organ produces insulin?", acceptedAnswers: ["Pancreas"], domain: "Biology", difficulty: 65 },
    { questionText: "How many chromosomes do humans have?", acceptedAnswers: ["46", "Forty six", "Forty-six"], domain: "Biology", difficulty: 62 },
    { questionText: "What is the largest bone in the human body?", acceptedAnswers: ["Femur", "Thigh bone"], domain: "Biology", difficulty: 58 },
    { questionText: "What part of the brain controls balance?", acceptedAnswers: ["Cerebellum"], domain: "Biology", difficulty: 42 },
    { questionText: "What type of blood cell fights infection?", acceptedAnswers: ["White blood cells", "White blood cell", "Leukocytes", "WBC"], domain: "Biology", difficulty: 72 },
    { questionText: "What vitamin is produced when skin is exposed to sunlight?", acceptedAnswers: ["Vitamin D", "D"], domain: "Biology", difficulty: 65 },
    { questionText: "What is the medical term for high blood pressure?", acceptedAnswers: ["Hypertension"], domain: "Biology", difficulty: 55 },
    { questionText: "What is the hardest substance in the human body?", acceptedAnswers: ["Enamel", "Tooth enamel"], domain: "Biology", difficulty: 48 },
    { questionText: "What is the name of the protein that carries oxygen in blood?", acceptedAnswers: ["Hemoglobin", "Haemoglobin"], domain: "Biology", difficulty: 52 },
    { questionText: "What is the medical term for the voice box?", acceptedAnswers: ["Larynx"], domain: "Biology", difficulty: 45 },
    { questionText: "What disease is caused by a lack of insulin?", acceptedAnswers: ["Diabetes", "Diabetes mellitus"], domain: "Biology", difficulty: 72 },
    { questionText: "What is the term for programmed cell death?", acceptedAnswers: ["Apoptosis"], domain: "Biology", difficulty: 25 },
    { questionText: "What part of a neuron receives signals?", acceptedAnswers: ["Dendrite", "Dendrites"], domain: "Biology", difficulty: 35 },
    { questionText: "What is CRISPR used for?", acceptedAnswers: ["Gene editing", "Genetic editing", "Editing genes", "Editing DNA"], domain: "Biology", difficulty: 38 },

    // PHYSICS & ASTRONOMY - Various
    { questionText: "What is the speed of light in a vacuum (km/s)?", acceptedAnswers: ["300000", "300,000", "299792"], domain: "Physics", difficulty: 45 },
    { questionText: "Who developed the theory of general relativity?", acceptedAnswers: ["Einstein", "Albert Einstein"], domain: "Physics", difficulty: 75 },
    { questionText: "What particle has a negative charge?", acceptedAnswers: ["Electron"], domain: "Physics", difficulty: 78 },
    { questionText: "What is the second law of thermodynamics about?", acceptedAnswers: ["Entropy", "Entropy increases", "Disorder increases"], domain: "Physics", difficulty: 35 },
    { questionText: "What is Schrödinger famous for?", acceptedAnswers: ["Cat", "Schrödinger's cat", "Schrodinger's cat", "Wave equation"], domain: "Physics", difficulty: 60 },
    { questionText: "What type of star will our Sun become at the end of its life?", acceptedAnswers: ["White dwarf", "Red giant then white dwarf"], domain: "Physics", difficulty: 42 },
    { questionText: "What is the name of the force that holds atomic nuclei together?", acceptedAnswers: ["Strong force", "Strong nuclear force"], domain: "Physics", difficulty: 32 },
    { questionText: "What is a light year a measure of?", acceptedAnswers: ["Distance", "Length"], domain: "Physics", difficulty: 72 },
    { questionText: "What is dark matter?", acceptedAnswers: ["Unknown matter", "Matter we can't see", "Invisible matter", "Matter that doesn't emit light"], domain: "Physics", difficulty: 50 },
    { questionText: "What is the name of Saturn's largest moon?", acceptedAnswers: ["Titan"], domain: "Physics", difficulty: 45 },
    { questionText: "What is a supernova?", acceptedAnswers: ["Exploding star", "Star explosion", "Stellar explosion"], domain: "Physics", difficulty: 65 },
    { questionText: "What is the observable universe's estimated age (in billions of years)?", acceptedAnswers: ["13.8", "14", "13.7"], domain: "Physics", difficulty: 38 },
    { questionText: "What is Hawking radiation?", acceptedAnswers: ["Radiation from black holes", "Black hole radiation"], domain: "Physics", difficulty: 22 },
    { questionText: "What does E=mc² relate?", acceptedAnswers: ["Energy and mass", "Mass and energy", "Mass energy equivalence"], domain: "Physics", difficulty: 55 },
    { questionText: "What is the name of Jupiter's largest moon?", acceptedAnswers: ["Ganymede"], domain: "Physics", difficulty: 35 },

    // CHEMISTRY - Various
    { questionText: "What is the most abundant element in the universe?", acceptedAnswers: ["Hydrogen", "H"], domain: "Chemistry", difficulty: 68 },
    { questionText: "What is table salt's chemical formula?", acceptedAnswers: ["NaCl", "Sodium chloride"], domain: "Chemistry", difficulty: 65 },
    { questionText: "What element has the atomic number 1?", acceptedAnswers: ["Hydrogen", "H"], domain: "Chemistry", difficulty: 75 },
    { questionText: "What is the noble gas with atomic number 2?", acceptedAnswers: ["Helium", "He"], domain: "Chemistry", difficulty: 72 },
    { questionText: "What is the process of a solid turning directly into a gas?", acceptedAnswers: ["Sublimation"], domain: "Chemistry", difficulty: 52 },
    { questionText: "What is the chemical symbol for iron?", acceptedAnswers: ["Fe"], domain: "Chemistry", difficulty: 62 },
    { questionText: "What is the chemical symbol for potassium?", acceptedAnswers: ["K"], domain: "Chemistry", difficulty: 55 },
    { questionText: "What is the chemical formula for glucose?", acceptedAnswers: ["C6H12O6"], domain: "Chemistry", difficulty: 35 },
    { questionText: "What element is essential for organic chemistry?", acceptedAnswers: ["Carbon", "C"], domain: "Chemistry", difficulty: 68 },
    { questionText: "What is the pH of a strong acid like HCl?", acceptedAnswers: ["0", "1", "Less than 7", "Very low"], domain: "Chemistry", difficulty: 50 },
    { questionText: "What is the process of breaking down complex molecules using water?", acceptedAnswers: ["Hydrolysis"], domain: "Chemistry", difficulty: 38 },
    { questionText: "What bond involves sharing electrons?", acceptedAnswers: ["Covalent", "Covalent bond"], domain: "Chemistry", difficulty: 55 },
    { questionText: "What is the name of the reaction between an acid and a base?", acceptedAnswers: ["Neutralization", "Neutralisation"], domain: "Chemistry", difficulty: 60 },

    // WORLD HISTORY - Various
    { questionText: "What empire was ruled by Genghis Khan?", acceptedAnswers: ["Mongol", "Mongol Empire", "Mongolian Empire"], domain: "History", difficulty: 70 },
    { questionText: "What city was the capital of the Eastern Roman Empire?", acceptedAnswers: ["Constantinople", "Byzantium", "Istanbul"], domain: "History", difficulty: 55 },
    { questionText: "What year did Columbus reach the Americas?", acceptedAnswers: ["1492", "fourteen ninety two"], domain: "History", difficulty: 75 },
    { questionText: "Who was the first President of the United States?", acceptedAnswers: ["George Washington", "Washington"], domain: "History", difficulty: 90 },
    { questionText: "What ancient wonder was located in Alexandria?", acceptedAnswers: ["Lighthouse", "Lighthouse of Alexandria", "Pharos"], domain: "History", difficulty: 42 },
    { questionText: "What was the name of the atomic bomb dropped on Hiroshima?", acceptedAnswers: ["Little Boy"], domain: "History", difficulty: 35 },
    { questionText: "What country did Napoleon invade in 1812, leading to his downfall?", acceptedAnswers: ["Russia"], domain: "History", difficulty: 58 },
    { questionText: "What war was fought between the North and South of the United States?", acceptedAnswers: ["Civil War", "American Civil War"], domain: "History", difficulty: 82 },
    { questionText: "Who was the leader of Nazi Germany?", acceptedAnswers: ["Hitler", "Adolf Hitler"], domain: "History", difficulty: 92 },
    { questionText: "What ancient civilization built the Parthenon?", acceptedAnswers: ["Greek", "Greeks", "Ancient Greece", "Athenians"], domain: "History", difficulty: 68 },
    { questionText: "What was the code name for the Allied invasion of Normandy?", acceptedAnswers: ["D-Day", "Operation Overlord", "Overlord"], domain: "History", difficulty: 52 },
    { questionText: "Who was the first female Prime Minister of the UK?", acceptedAnswers: ["Margaret Thatcher", "Thatcher"], domain: "History", difficulty: 62 },
    { questionText: "What revolution began in 1917 in Russia?", acceptedAnswers: ["Russian Revolution", "Bolshevik Revolution", "October Revolution"], domain: "History", difficulty: 65 },
    { questionText: "What treaty ended World War I?", acceptedAnswers: ["Treaty of Versailles", "Versailles"], domain: "History", difficulty: 48 },
    { questionText: "Who was assassinated in 1963 in Dallas?", acceptedAnswers: ["JFK", "John F Kennedy", "Kennedy", "John Kennedy"], domain: "History", difficulty: 72 },

    // LITERATURE - Various
    { questionText: "Who wrote 'Hamlet'?", acceptedAnswers: ["Shakespeare", "William Shakespeare"], domain: "Literature", difficulty: 85 },
    { questionText: "What novel begins with 'Call me Ishmael'?", acceptedAnswers: ["Moby Dick", "Moby-Dick"], domain: "Literature", difficulty: 45 },
    { questionText: "Who wrote 'War and Peace'?", acceptedAnswers: ["Tolstoy", "Leo Tolstoy"], domain: "Literature", difficulty: 52 },
    { questionText: "What is the first book of the Bible?", acceptedAnswers: ["Genesis"], domain: "Literature", difficulty: 82 },
    { questionText: "Who wrote 'The Great Gatsby'?", acceptedAnswers: ["F. Scott Fitzgerald", "Fitzgerald", "F Scott Fitzgerald"], domain: "Literature", difficulty: 58 },
    { questionText: "What dystopian novel features Big Brother?", acceptedAnswers: ["1984", "Nineteen Eighty-Four"], domain: "Literature", difficulty: 68 },
    { questionText: "Who created Sherlock Holmes?", acceptedAnswers: ["Arthur Conan Doyle", "Conan Doyle", "Doyle"], domain: "Literature", difficulty: 62 },
    { questionText: "What is the name of the hobbit in 'The Hobbit'?", acceptedAnswers: ["Bilbo", "Bilbo Baggins"], domain: "Literature", difficulty: 75 },
    { questionText: "Who wrote 'The Odyssey'?", acceptedAnswers: ["Homer"], domain: "Literature", difficulty: 55 },
    { questionText: "What Gabriel García Márquez novel features the Buendía family?", acceptedAnswers: ["One Hundred Years of Solitude", "100 Years of Solitude"], domain: "Literature", difficulty: 28 },
    { questionText: "Who wrote 'Crime and Punishment'?", acceptedAnswers: ["Dostoevsky", "Fyodor Dostoevsky", "Dostoyevsky"], domain: "Literature", difficulty: 42 },
    { questionText: "What Shakespeare play features the character Othello?", acceptedAnswers: ["Othello"], domain: "Literature", difficulty: 62 },
    { questionText: "Who wrote 'Don Quixote'?", acceptedAnswers: ["Cervantes", "Miguel de Cervantes"], domain: "Literature", difficulty: 38 },

    // MUSIC - Various
    { questionText: "Who wrote the 'Moonlight Sonata'?", acceptedAnswers: ["Beethoven", "Ludwig van Beethoven"], domain: "Music", difficulty: 58 },
    { questionText: "What band did Paul McCartney belong to?", acceptedAnswers: ["The Beatles", "Beatles"], domain: "Music", difficulty: 85 },
    { questionText: "What is the highest female singing voice?", acceptedAnswers: ["Soprano"], domain: "Music", difficulty: 62 },
    { questionText: "Who is known as the 'Queen of Soul'?", acceptedAnswers: ["Aretha Franklin", "Aretha"], domain: "Music", difficulty: 58 },
    { questionText: "What rock band performed 'Stairway to Heaven'?", acceptedAnswers: ["Led Zeppelin"], domain: "Music", difficulty: 65 },
    { questionText: "How many symphonies did Beethoven complete?", acceptedAnswers: ["9", "Nine"], domain: "Music", difficulty: 42 },
    { questionText: "What instrument has 88 keys?", acceptedAnswers: ["Piano"], domain: "Music", difficulty: 78 },
    { questionText: "Who composed 'The Nutcracker'?", acceptedAnswers: ["Tchaikovsky", "Pyotr Ilyich Tchaikovsky"], domain: "Music", difficulty: 52 },
    { questionText: "What is the Italian term for playing softly?", acceptedAnswers: ["Piano", "Pianissimo"], domain: "Music", difficulty: 45 },
    { questionText: "Who composed the opera 'Carmen'?", acceptedAnswers: ["Bizet", "Georges Bizet"], domain: "Music", difficulty: 32 },
    { questionText: "What country is reggae music originally from?", acceptedAnswers: ["Jamaica"], domain: "Music", difficulty: 75 },
    { questionText: "Who wrote 'Bohemian Rhapsody'?", acceptedAnswers: ["Freddie Mercury", "Queen"], domain: "Music", difficulty: 68 },

    // GEOGRAPHY - More variety
    { questionText: "What is the smallest country in the world?", acceptedAnswers: ["Vatican City", "Vatican"], domain: "Geography", difficulty: 72 },
    { questionText: "What is the largest desert in the world?", acceptedAnswers: ["Antarctica", "Antarctic", "Sahara"], domain: "Geography", difficulty: 48 },
    { questionText: "What river runs through London?", acceptedAnswers: ["Thames", "River Thames"], domain: "Geography", difficulty: 75 },
    { questionText: "What is the highest waterfall in the world?", acceptedAnswers: ["Angel Falls", "Salto Angel"], domain: "Geography", difficulty: 42 },
    { questionText: "What is the capital of New Zealand?", acceptedAnswers: ["Wellington"], domain: "Geography", difficulty: 52 },
    { questionText: "What strait separates Europe from Africa?", acceptedAnswers: ["Strait of Gibraltar", "Gibraltar"], domain: "Geography", difficulty: 58 },
    { questionText: "What is the largest lake in Africa?", acceptedAnswers: ["Lake Victoria", "Victoria"], domain: "Geography", difficulty: 48 },
    { questionText: "What country has the most islands?", acceptedAnswers: ["Sweden"], domain: "Geography", difficulty: 18 },
    { questionText: "What is the capital of South Korea?", acceptedAnswers: ["Seoul"], domain: "Geography", difficulty: 72 },
    { questionText: "What is the largest country by land area?", acceptedAnswers: ["Russia"], domain: "Geography", difficulty: 82 },
    { questionText: "What is the deepest point in the ocean?", acceptedAnswers: ["Mariana Trench", "Challenger Deep"], domain: "Geography", difficulty: 55 },
    { questionText: "What river flows through Paris?", acceptedAnswers: ["Seine", "River Seine"], domain: "Geography", difficulty: 62 },
    { questionText: "What is the capital of Portugal?", acceptedAnswers: ["Lisbon", "Lisboa"], domain: "Geography", difficulty: 62 },
    { questionText: "What African country has the largest population?", acceptedAnswers: ["Nigeria"], domain: "Geography", difficulty: 45 },
    { questionText: "What is the only country to border both France and Spain?", acceptedAnswers: ["Andorra"], domain: "Geography", difficulty: 25 },

    // PSYCHOLOGY & SOCIOLOGY - Various
    { questionText: "Who developed psychoanalysis?", acceptedAnswers: ["Freud", "Sigmund Freud"], domain: "Psychology", difficulty: 72 },
    { questionText: "What is Maslow's hierarchy of needs?", acceptedAnswers: ["Pyramid of needs", "Human needs theory", "Motivation theory"], domain: "Psychology", difficulty: 48 },
    { questionText: "What is cognitive dissonance?", acceptedAnswers: ["Mental discomfort from conflicting beliefs", "Conflicting beliefs", "Psychological tension"], domain: "Psychology", difficulty: 38 },
    { questionText: "Who conducted the Stanford Prison Experiment?", acceptedAnswers: ["Zimbardo", "Philip Zimbardo"], domain: "Psychology", difficulty: 32 },
    { questionText: "What is the placebo effect?", acceptedAnswers: ["Fake treatment works", "Improvement from fake treatment", "Mind over matter"], domain: "Psychology", difficulty: 62 },
    { questionText: "Who developed classical conditioning?", acceptedAnswers: ["Pavlov", "Ivan Pavlov"], domain: "Psychology", difficulty: 55 },
    { questionText: "What is the Dunning-Kruger effect?", acceptedAnswers: ["Overconfidence of incompetent people", "Incompetent overestimate ability", "Cognitive bias"], domain: "Psychology", difficulty: 35 },
    { questionText: "What is the bystander effect?", acceptedAnswers: ["Less likely to help when others present", "Diffusion of responsibility"], domain: "Psychology", difficulty: 42 },

    // LAW & POLITICS - Various
    { questionText: "What does 'habeas corpus' protect against?", acceptedAnswers: ["Unlawful detention", "Illegal imprisonment", "Detention without trial"], domain: "Law", difficulty: 38 },
    { questionText: "How many justices are on the US Supreme Court?", acceptedAnswers: ["9", "Nine"], domain: "Law", difficulty: 55 },
    { questionText: "What is the separation of powers?", acceptedAnswers: ["Division of government branches", "Executive legislative judicial", "Three branches"], domain: "Law", difficulty: 52 },
    { questionText: "What document begins with 'We the People'?", acceptedAnswers: ["US Constitution", "Constitution", "American Constitution"], domain: "Law", difficulty: 68 },
    { questionText: "What is the United Nations headquarters city?", acceptedAnswers: ["New York", "New York City", "NYC"], domain: "Politics", difficulty: 72 },
    { questionText: "What is NATO?", acceptedAnswers: ["North Atlantic Treaty Organization", "Military alliance"], domain: "Politics", difficulty: 62 },
    { questionText: "What is the European Union's headquarters city?", acceptedAnswers: ["Brussels"], domain: "Politics", difficulty: 52 },
    { questionText: "What is the principle of 'innocent until proven guilty' called?", acceptedAnswers: ["Presumption of innocence"], domain: "Law", difficulty: 48 },

    // COMPUTER SCIENCE & TECHNOLOGY - Various
    { questionText: "Who invented the World Wide Web?", acceptedAnswers: ["Tim Berners-Lee", "Berners-Lee", "Tim Berners Lee"], domain: "Technology", difficulty: 52 },
    { questionText: "What does RAM stand for?", acceptedAnswers: ["Random Access Memory"], domain: "Technology", difficulty: 68 },
    { questionText: "What programming language is known for its use in web browsers?", acceptedAnswers: ["JavaScript", "JS"], domain: "Technology", difficulty: 55 },
    { questionText: "What company created the Android operating system?", acceptedAnswers: ["Google", "Android Inc"], domain: "Technology", difficulty: 72 },
    { questionText: "What does API stand for?", acceptedAnswers: ["Application Programming Interface"], domain: "Technology", difficulty: 45 },
    { questionText: "Who is considered the father of computer science?", acceptedAnswers: ["Alan Turing", "Turing"], domain: "Technology", difficulty: 48 },
    { questionText: "What is the binary representation of the number 5?", acceptedAnswers: ["101"], domain: "Technology", difficulty: 52 },
    { questionText: "What is machine learning?", acceptedAnswers: ["AI that learns from data", "Computers learning from data", "Algorithm improvement through experience"], domain: "Technology", difficulty: 55 },
    { questionText: "What company developed ChatGPT?", acceptedAnswers: ["OpenAI", "Open AI"], domain: "Technology", difficulty: 72 },
    { questionText: "What is blockchain technology primarily used for?", acceptedAnswers: ["Cryptocurrency", "Decentralized records", "Digital ledger"], domain: "Technology", difficulty: 55 },
    { questionText: "What does SQL stand for?", acceptedAnswers: ["Structured Query Language"], domain: "Technology", difficulty: 48 },
    { questionText: "What is the time complexity of binary search?", acceptedAnswers: ["O(log n)", "Log n", "Logarithmic"], domain: "Computer Science", difficulty: 32 },

    // ADVANCED MATHEMATICS - Various
    { questionText: "What is Euler's identity?", acceptedAnswers: ["e^(i*pi) + 1 = 0", "e to the i pi plus 1 equals 0"], domain: "Mathematics", difficulty: 25 },
    { questionText: "What is the integral of 1/x?", acceptedAnswers: ["ln(x)", "Natural log of x", "ln x + C"], domain: "Mathematics", difficulty: 38 },
    { questionText: "What is a prime number?", acceptedAnswers: ["Divisible only by 1 and itself", "Only two factors"], domain: "Mathematics", difficulty: 78 },
    { questionText: "What is the Fibonacci sequence?", acceptedAnswers: ["Each number is sum of previous two", "1 1 2 3 5 8", "Sum of two preceding"], domain: "Mathematics", difficulty: 55 },
    { questionText: "What is the Pythagorean theorem?", acceptedAnswers: ["a² + b² = c²", "a squared plus b squared equals c squared"], domain: "Mathematics", difficulty: 75 },
    { questionText: "What is a complex number?", acceptedAnswers: ["Real plus imaginary", "Has imaginary part", "a + bi"], domain: "Mathematics", difficulty: 45 },
    { questionText: "What is the value of pi to 4 decimal places?", acceptedAnswers: ["3.1416", "3.1415"], domain: "Mathematics", difficulty: 58 },
    { questionText: "What is a differential equation?", acceptedAnswers: ["Equation with derivatives", "Contains derivatives"], domain: "Mathematics", difficulty: 38 },
    { questionText: "What is the quadratic formula?", acceptedAnswers: ["(-b ± √(b²-4ac))/2a", "Negative b plus or minus square root"], domain: "Mathematics", difficulty: 52 },
    { questionText: "What is a vector?", acceptedAnswers: ["Quantity with magnitude and direction", "Has magnitude and direction"], domain: "Mathematics", difficulty: 62 },

    // WORLD RELIGIONS - Various
    { questionText: "What is the oldest of the major world religions?", acceptedAnswers: ["Hinduism", "Judaism"], domain: "Religion", difficulty: 42 },
    { questionText: "What are the Five Pillars of Islam?", acceptedAnswers: ["Faith prayer fasting pilgrimage charity", "Shahada Salat Zakat Sawm Hajj", "Core practices"], domain: "Religion", difficulty: 35 },
    { questionText: "What is the Tao Te Ching about?", acceptedAnswers: ["Taoism", "The Way", "Philosophy of the Tao"], domain: "Religion", difficulty: 32 },
    { questionText: "What is karma?", acceptedAnswers: ["Actions have consequences", "Cause and effect", "What goes around comes around"], domain: "Religion", difficulty: 72 },
    { questionText: "What is nirvana in Buddhism?", acceptedAnswers: ["Enlightenment", "Liberation from suffering", "End of rebirth"], domain: "Religion", difficulty: 52 },
    { questionText: "What is the main Christian holy day?", acceptedAnswers: ["Easter", "Christmas", "Sunday"], domain: "Religion", difficulty: 82 },
    { questionText: "What is the Jewish sabbath day?", acceptedAnswers: ["Saturday", "Shabbat"], domain: "Religion", difficulty: 55 },
    { questionText: "What is Ramadan?", acceptedAnswers: ["Islamic month of fasting", "Fasting month", "Holy month of fasting"], domain: "Religion", difficulty: 68 },
];

// Get adaptive question based on current difficulty level
export const getAdaptiveQuestionV2 = (targetDifficulty: number, usedQuestions: string[]): KnowledgeQuestionV2 | null => {
    const available = KNOWLEDGE_QUESTIONS_V2.filter(q => !usedQuestions.includes(q.questionText));
    if (available.length === 0) return null;
    
    // Sort by how close to target difficulty
    const sorted = available.sort((a, b) => 
        Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
    );
    
    // Pick from top 5 closest for variety
    const topCandidates = sorted.slice(0, Math.min(5, sorted.length));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)];
};

// Get domain distribution
export const getDomainDistributionV2 = (): Record<string, number> => {
    const distribution: Record<string, number> = {};
    KNOWLEDGE_QUESTIONS_V2.forEach(q => {
        distribution[q.domain] = (distribution[q.domain] || 0) + 1;
    });
    return distribution;
};
