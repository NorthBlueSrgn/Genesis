// data/knowledgeQuestionBank.ts
// Comprehensive question bank for the Adaptive Knowledge Test
// Difficulty = estimated percentage of general population that would answer correctly
// 500+ questions across 20+ domains with graduated difficulty levels

export interface KnowledgeQuestion {
    questionText: string;
    options: string[];
    correct: number;
    domain: string;
    difficulty: number; // 0-100, higher = easier (more people would know)
    tags?: string[]; // Optional tags for more granular filtering
}

export const KNOWLEDGE_QUESTION_BANK: KnowledgeQuestion[] = [
    // ============================================
    // GEOGRAPHY (50 questions)
    // ============================================
    
    // Very Easy (85-95%)
    { questionText: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid", "Rome"], correct: 1, domain: "Geography", difficulty: 95 },
    { questionText: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], correct: 2, domain: "Geography", difficulty: 90 },
    { questionText: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2, domain: "Geography", difficulty: 88 },
    { questionText: "What country has the largest population?", options: ["India", "USA", "China", "Indonesia"], correct: 2, domain: "Geography", difficulty: 85 },
    { questionText: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Shanghai"], correct: 2, domain: "Geography", difficulty: 92 },
    { questionText: "Which continent is Brazil located in?", options: ["Africa", "Europe", "South America", "Asia"], correct: 2, domain: "Geography", difficulty: 90 },
    { questionText: "What is the longest river in the world?", options: ["Amazon", "Nile", "Mississippi", "Yangtze"], correct: 1, domain: "Geography", difficulty: 70 },
    { questionText: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "Vietnam"], correct: 1, domain: "Geography", difficulty: 85 },
    
    // Easy (70-84%)
    { questionText: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2, domain: "Geography", difficulty: 50 },
    { questionText: "What is the smallest country in the world by area?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], correct: 2, domain: "Geography", difficulty: 70 },
    { questionText: "Which country has the longest coastline?", options: ["Russia", "Canada", "Indonesia", "Australia"], correct: 1, domain: "Geography", difficulty: 40 },
    { questionText: "Mount Kilimanjaro is located in which country?", options: ["Kenya", "Tanzania", "Uganda", "Ethiopia"], correct: 1, domain: "Geography", difficulty: 55 },
    { questionText: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], correct: 2, domain: "Geography", difficulty: 60 },
    { questionText: "Which country has the most islands?", options: ["Indonesia", "Philippines", "Sweden", "Finland"], correct: 2, domain: "Geography", difficulty: 25 },
    { questionText: "What is the largest country by land area?", options: ["Canada", "USA", "China", "Russia"], correct: 3, domain: "Geography", difficulty: 75 },
    { questionText: "The Amazon Rainforest is primarily in which country?", options: ["Peru", "Colombia", "Brazil", "Venezuela"], correct: 2, domain: "Geography", difficulty: 75 },
    { questionText: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Luxor", "Giza"], correct: 1, domain: "Geography", difficulty: 70 },
    { questionText: "Which sea is the saltiest in the world?", options: ["Mediterranean", "Dead Sea", "Red Sea", "Black Sea"], correct: 1, domain: "Geography", difficulty: 65 },
    
    // Medium (40-69%)
    { questionText: "What is the capital of Myanmar?", options: ["Yangon", "Mandalay", "Naypyidaw", "Bagan"], correct: 2, domain: "Geography", difficulty: 25 },
    { questionText: "Which strait separates Europe from Africa?", options: ["Bosphorus", "Gibraltar", "Hormuz", "Malacca"], correct: 1, domain: "Geography", difficulty: 55 },
    { questionText: "The Gobi Desert spans which two countries?", options: ["China and Mongolia", "India and Pakistan", "Iran and Iraq", "Egypt and Libya"], correct: 0, domain: "Geography", difficulty: 45 },
    { questionText: "Which river forms part of the border between the US and Mexico?", options: ["Colorado", "Rio Grande", "Pecos", "Brazos"], correct: 1, domain: "Geography", difficulty: 60 },
    { questionText: "What is the capital of South Korea?", options: ["Busan", "Incheon", "Seoul", "Daegu"], correct: 2, domain: "Geography", difficulty: 65 },
    { questionText: "Which mountain range separates Europe from Asia?", options: ["Alps", "Himalayas", "Urals", "Caucasus"], correct: 2, domain: "Geography", difficulty: 45 },
    { questionText: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Antarctic", "Arabian"], correct: 2, domain: "Geography", difficulty: 35 },
    { questionText: "Which country has the most UNESCO World Heritage Sites?", options: ["China", "Italy", "Spain", "France"], correct: 1, domain: "Geography", difficulty: 30 },
    { questionText: "What is the capital of Nigeria?", options: ["Lagos", "Abuja", "Kano", "Ibadan"], correct: 1, domain: "Geography", difficulty: 40 },
    { questionText: "Which African country has the largest economy?", options: ["South Africa", "Nigeria", "Egypt", "Kenya"], correct: 1, domain: "Geography", difficulty: 35 },
    { questionText: "The Galápagos Islands belong to which country?", options: ["Peru", "Colombia", "Ecuador", "Chile"], correct: 2, domain: "Geography", difficulty: 45 },
    
    // Hard (20-39%)
    { questionText: "What is the deepest point in the ocean?", options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Philippine Trench"], correct: 0, domain: "Geography", difficulty: 65 },
    { questionText: "Which country has the most time zones?", options: ["Russia", "USA", "France", "China"], correct: 2, domain: "Geography", difficulty: 20 },
    { questionText: "The Khyber Pass connects which two countries?", options: ["India and China", "Afghanistan and Pakistan", "Iran and Turkey", "Nepal and Tibet"], correct: 1, domain: "Geography", difficulty: 30 },
    { questionText: "What is the capital of Kazakhstan?", options: ["Almaty", "Astana", "Bishkek", "Tashkent"], correct: 1, domain: "Geography", difficulty: 25 },
    { questionText: "Which African country was formerly known as Abyssinia?", options: ["Kenya", "Ethiopia", "Sudan", "Egypt"], correct: 1, domain: "Geography", difficulty: 35 },
    { questionText: "The Danube River flows through how many countries?", options: ["5", "7", "10", "12"], correct: 2, domain: "Geography", difficulty: 25 },
    { questionText: "What is the capital of Morocco?", options: ["Casablanca", "Marrakech", "Rabat", "Fez"], correct: 2, domain: "Geography", difficulty: 35 },
    { questionText: "Which country is completely surrounded by South Africa?", options: ["Swaziland", "Lesotho", "Botswana", "Namibia"], correct: 1, domain: "Geography", difficulty: 30 },
    { questionText: "What is the longest mountain range in the world?", options: ["Himalayas", "Rockies", "Andes", "Alps"], correct: 2, domain: "Geography", difficulty: 40 },
    { questionText: "Which two countries share the longest border?", options: ["USA-Mexico", "Russia-China", "Canada-USA", "Argentina-Chile"], correct: 2, domain: "Geography", difficulty: 35 },
    
    // Very Hard (5-19%)
    { questionText: "Which country has the highest average elevation?", options: ["Nepal", "Bhutan", "Bolivia", "Lesotho"], correct: 1, domain: "Geography", difficulty: 10 },
    { questionText: "The Vredefort crater, one of the largest impact craters, is in which country?", options: ["Australia", "Canada", "South Africa", "Russia"], correct: 2, domain: "Geography", difficulty: 8 },
    { questionText: "What is the largest lake entirely within one country?", options: ["Lake Baikal", "Lake Michigan", "Lake Victoria", "Great Bear Lake"], correct: 1, domain: "Geography", difficulty: 15 },
    { questionText: "Which island nation has the highest population density?", options: ["Malta", "Singapore", "Bahrain", "Maldives"], correct: 1, domain: "Geography", difficulty: 12 },
    { questionText: "What is the only country to border both the Caspian Sea and Persian Gulf?", options: ["Russia", "Iran", "Turkmenistan", "Azerbaijan"], correct: 1, domain: "Geography", difficulty: 18 },
    { questionText: "Which country has the most active volcanoes?", options: ["Japan", "Indonesia", "Iceland", "Philippines"], correct: 1, domain: "Geography", difficulty: 20 },
    { questionText: "The Skeleton Coast is in which country?", options: ["Somalia", "Namibia", "Chile", "Australia"], correct: 1, domain: "Geography", difficulty: 12 },
    { questionText: "What is the only sea without any coastline?", options: ["Caspian Sea", "Dead Sea", "Sargasso Sea", "Aral Sea"], correct: 2, domain: "Geography", difficulty: 15 },
    { questionText: "Which country has the most neighbors (bordering countries)?", options: ["Russia", "China", "Brazil", "Germany"], correct: 1, domain: "Geography", difficulty: 18 },
    { questionText: "The McMurdo Dry Valleys are on which continent?", options: ["Asia", "South America", "Antarctica", "Australia"], correct: 2, domain: "Geography", difficulty: 15 },

    // ============================================
    // HISTORY (60 questions)
    // ============================================
    
    // Very Easy (85-95%)
    { questionText: "What year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2, domain: "History", difficulty: 85 },
    { questionText: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: 2, domain: "History", difficulty: 92 },
    { questionText: "The Great Wall of China was primarily built to defend against whom?", options: ["Japanese", "Mongols", "Koreans", "Russians"], correct: 1, domain: "History", difficulty: 75 },
    { questionText: "In what year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], correct: 1, domain: "History", difficulty: 70 },
    { questionText: "Who discovered America in 1492?", options: ["Amerigo Vespucci", "Christopher Columbus", "Ferdinand Magellan", "John Cabot"], correct: 1, domain: "History", difficulty: 88 },
    { questionText: "What ancient civilization built the pyramids of Giza?", options: ["Greeks", "Romans", "Egyptians", "Babylonians"], correct: 2, domain: "History", difficulty: 92 },
    { questionText: "In which city was President John F. Kennedy assassinated?", options: ["Washington D.C.", "Dallas", "Los Angeles", "Chicago"], correct: 1, domain: "History", difficulty: 75 },
    { questionText: "What was the name of the ship that brought the Pilgrims to America?", options: ["Santa Maria", "Mayflower", "Endeavour", "Beagle"], correct: 1, domain: "History", difficulty: 80 },
    
    // Easy (70-84%)
    { questionText: "The Renaissance began in which country?", options: ["France", "England", "Italy", "Spain"], correct: 2, domain: "History", difficulty: 70 },
    { questionText: "Who discovered penicillin?", options: ["Louis Pasteur", "Alexander Fleming", "Joseph Lister", "Robert Koch"], correct: 1, domain: "History", difficulty: 65 },
    { questionText: "The French Revolution began in which year?", options: ["1776", "1789", "1799", "1804"], correct: 1, domain: "History", difficulty: 55 },
    { questionText: "Who was the Egyptian queen famous for her relationship with Julius Caesar and Mark Antony?", options: ["Nefertiti", "Hatshepsut", "Cleopatra", "Ankhesenamun"], correct: 2, domain: "History", difficulty: 80 },
    { questionText: "What empire was ruled by Julius Caesar?", options: ["Greek", "Roman", "Persian", "Byzantine"], correct: 1, domain: "History", difficulty: 82 },
    { questionText: "Who was the first man to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Yuri Gagarin"], correct: 1, domain: "History", difficulty: 85 },
    { questionText: "The Cold War was primarily between which two countries?", options: ["USA and China", "USA and USSR", "UK and Germany", "France and USSR"], correct: 1, domain: "History", difficulty: 75 },
    { questionText: "Who painted the ceiling of the Sistine Chapel?", options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"], correct: 2, domain: "History", difficulty: 70 },
    { questionText: "What was the name of the first artificial satellite launched into space?", options: ["Explorer 1", "Sputnik 1", "Vanguard 1", "Luna 1"], correct: 1, domain: "History", difficulty: 60 },
    { questionText: "Which war was fought between the North and South in the United States?", options: ["Revolutionary War", "Civil War", "War of 1812", "Mexican-American War"], correct: 1, domain: "History", difficulty: 85 },
    
    // Medium (40-69%)
    { questionText: "The Hundred Years' War was fought between which countries?", options: ["Spain and Portugal", "England and France", "Germany and Austria", "Italy and Greece"], correct: 1, domain: "History", difficulty: 50 },
    { questionText: "Who was the first Emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Caligula"], correct: 1, domain: "History", difficulty: 45 },
    { questionText: "The Magna Carta was signed in which year?", options: ["1066", "1215", "1314", "1492"], correct: 1, domain: "History", difficulty: 40 },
    { questionText: "Which empire was ruled by Suleiman the Magnificent?", options: ["Persian", "Mongol", "Ottoman", "Byzantine"], correct: 2, domain: "History", difficulty: 45 },
    { questionText: "The Berlin Wall fell in which year?", options: ["1987", "1989", "1991", "1993"], correct: 1, domain: "History", difficulty: 60 },
    { questionText: "Who led the Soviet Union during most of World War II?", options: ["Lenin", "Stalin", "Khrushchev", "Trotsky"], correct: 1, domain: "History", difficulty: 65 },
    { questionText: "Which ancient wonder was located in Alexandria?", options: ["Hanging Gardens", "Colossus", "Lighthouse", "Mausoleum"], correct: 2, domain: "History", difficulty: 45 },
    { questionText: "What was the Manhattan Project?", options: ["Skyscraper construction", "Atomic bomb development", "Moon landing program", "Highway system"], correct: 1, domain: "History", difficulty: 55 },
    { questionText: "Who was the leader of Nazi Germany?", options: ["Mussolini", "Stalin", "Hitler", "Franco"], correct: 2, domain: "History", difficulty: 90 },
    { questionText: "The Industrial Revolution began in which country?", options: ["USA", "Germany", "France", "Britain"], correct: 3, domain: "History", difficulty: 60 },
    { questionText: "Who was the famous queen of the United Kingdom for 63 years in the 19th-20th century?", options: ["Elizabeth I", "Victoria", "Mary", "Anne"], correct: 1, domain: "History", difficulty: 55 },
    { questionText: "What event started World War I?", options: ["Invasion of Poland", "Assassination of Archduke Franz Ferdinand", "Sinking of Lusitania", "Treaty violation"], correct: 1, domain: "History", difficulty: 55 },
    { questionText: "Who was Genghis Khan?", options: ["Chinese emperor", "Mongol conqueror", "Indian ruler", "Persian king"], correct: 1, domain: "History", difficulty: 65 },
    { questionText: "What year did the United States declare independence?", options: ["1774", "1775", "1776", "1777"], correct: 2, domain: "History", difficulty: 75 },
    
    // Hard (20-39%)
    { questionText: "Which treaty ended the Thirty Years' War?", options: ["Treaty of Versailles", "Peace of Westphalia", "Treaty of Utrecht", "Congress of Vienna"], correct: 1, domain: "History", difficulty: 25 },
    { questionText: "In which year was the Byzantine Empire finally conquered?", options: ["1453", "1204", "1071", "1389"], correct: 0, domain: "History", difficulty: 30 },
    { questionText: "The Battle of Hastings took place in which year?", options: ["1066", "1042", "1087", "1100"], correct: 0, domain: "History", difficulty: 45 },
    { questionText: "Who was the first Mughal Emperor of India?", options: ["Akbar", "Babur", "Humayun", "Shah Jahan"], correct: 1, domain: "History", difficulty: 25 },
    { questionText: "The Opium Wars were fought between China and which country?", options: ["France", "Portugal", "Britain", "Netherlands"], correct: 2, domain: "History", difficulty: 35 },
    { questionText: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Rosalind Franklin", "Irène Joliot-Curie", "Dorothy Hodgkin"], correct: 0, domain: "History", difficulty: 55 },
    { questionText: "The Meiji Restoration occurred in which country?", options: ["China", "Korea", "Japan", "Vietnam"], correct: 2, domain: "History", difficulty: 35 },
    { questionText: "Who was the Carthaginian general who crossed the Alps with elephants?", options: ["Scipio", "Hannibal", "Hamilcar", "Hasdrubal"], correct: 1, domain: "History", difficulty: 45 },
    { questionText: "What was the last dynasty to rule China?", options: ["Ming", "Qing", "Han", "Tang"], correct: 1, domain: "History", difficulty: 35 },
    { questionText: "The Partition of India occurred in which year?", options: ["1945", "1947", "1949", "1951"], correct: 1, domain: "History", difficulty: 40 },
    { questionText: "Who wrote the Declaration of Independence?", options: ["Benjamin Franklin", "Thomas Jefferson", "John Adams", "George Washington"], correct: 1, domain: "History", difficulty: 55 },
    { questionText: "The Bolshevik Revolution took place in which year?", options: ["1905", "1914", "1917", "1922"], correct: 2, domain: "History", difficulty: 40 },
    { questionText: "Who was known as the 'Sun King' of France?", options: ["Louis XIII", "Louis XIV", "Louis XV", "Louis XVI"], correct: 1, domain: "History", difficulty: 35 },
    { questionText: "The Rosetta Stone helped decode which ancient writing?", options: ["Cuneiform", "Hieroglyphics", "Sanskrit", "Linear A"], correct: 1, domain: "History", difficulty: 50 },
    
    // Very Hard (5-19%)
    { questionText: "The Treaty of Tordesillas divided the New World between which powers?", options: ["England and France", "Spain and Portugal", "Netherlands and Spain", "France and Spain"], correct: 1, domain: "History", difficulty: 20 },
    { questionText: "Who was the last Pharaoh of ancient Egypt?", options: ["Cleopatra VII", "Ptolemy XV", "Nectanebo II", "Ramesses XI"], correct: 0, domain: "History", difficulty: 35 },
    { questionText: "The Defenestration of Prague helped trigger which war?", options: ["Seven Years' War", "Thirty Years' War", "War of Spanish Succession", "Napoleonic Wars"], correct: 1, domain: "History", difficulty: 15 },
    { questionText: "Which Chinese dynasty built most of the Great Wall as we know it today?", options: ["Han", "Tang", "Ming", "Qin"], correct: 2, domain: "History", difficulty: 18 },
    { questionText: "The Congress of Berlin in 1878 primarily dealt with which region?", options: ["Africa", "Balkans", "Middle East", "Asia"], correct: 1, domain: "History", difficulty: 12 },
    { questionText: "Who was the first known author in history?", options: ["Homer", "Enheduanna", "Confucius", "Plato"], correct: 1, domain: "History", difficulty: 8 },
    { questionText: "The Edict of Nantes granted religious tolerance to whom?", options: ["Jews", "Huguenots", "Catholics", "Muslims"], correct: 1, domain: "History", difficulty: 18 },
    { questionText: "Who founded the Maurya Empire in India?", options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Samudragupta"], correct: 1, domain: "History", difficulty: 15 },
    { questionText: "The War of the Roses was a conflict between which two houses?", options: ["Tudor and Stuart", "Lancaster and York", "Plantagenet and Tudor", "Windsor and Hanover"], correct: 1, domain: "History", difficulty: 30 },
    { questionText: "Who was the first Holy Roman Emperor?", options: ["Charlemagne", "Otto I", "Frederick Barbarossa", "Charles V"], correct: 0, domain: "History", difficulty: 20 },
    { questionText: "The Zimmermann Telegram was sent to which country?", options: ["Japan", "Russia", "Mexico", "Brazil"], correct: 2, domain: "History", difficulty: 22 },
    { questionText: "What was the capital of the Byzantine Empire?", options: ["Rome", "Athens", "Constantinople", "Alexandria"], correct: 2, domain: "History", difficulty: 40 },
    { questionText: "The Taiping Rebellion occurred in which country?", options: ["Japan", "India", "China", "Vietnam"], correct: 2, domain: "History", difficulty: 18 },
    { questionText: "Who was Cyrus the Great?", options: ["Greek king", "Roman emperor", "Persian emperor", "Egyptian pharaoh"], correct: 2, domain: "History", difficulty: 25 },

    // ============================================
    // SCIENCE - BIOLOGY, CHEMISTRY, PHYSICS, ASTRONOMY (70 questions)
    // ============================================
    
    // Very Easy (85-95%)
    { questionText: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], correct: 0, domain: "Chemistry", difficulty: 95 },
    { questionText: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1, domain: "Astronomy", difficulty: 90 },
    { questionText: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Brain", "Skin"], correct: 3, domain: "Biology", difficulty: 75 },
    { questionText: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2, domain: "Biology", difficulty: 85 },
    { questionText: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correct: 1, domain: "Astronomy", difficulty: 85 },
    { questionText: "What is the center of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], correct: 2, domain: "Chemistry", difficulty: 80 },
    { questionText: "What force keeps us on the ground?", options: ["Magnetism", "Electricity", "Gravity", "Friction"], correct: 2, domain: "Physics", difficulty: 92 },
    { questionText: "What do we call animals that eat only plants?", options: ["Carnivores", "Omnivores", "Herbivores", "Insectivores"], correct: 2, domain: "Biology", difficulty: 85 },
    
    // Easy (70-84%)
    { questionText: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2, domain: "Chemistry", difficulty: 70 },
    { questionText: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1, domain: "Astronomy", difficulty: 75 },
    { questionText: "What is the hardest natural substance on Earth?", options: ["Titanium", "Diamond", "Tungsten", "Graphene"], correct: 1, domain: "Chemistry", difficulty: 80 },
    { questionText: "How many bones are in the adult human body?", options: ["186", "206", "226", "246"], correct: 1, domain: "Biology", difficulty: 55 },
    { questionText: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correct: 0, domain: "Physics", difficulty: 60 },
    { questionText: "What is the chemical formula for table salt?", options: ["NaCl", "KCl", "CaCl2", "MgCl2"], correct: 0, domain: "Chemistry", difficulty: 65 },
    { questionText: "What organ pumps blood through the body?", options: ["Lungs", "Brain", "Heart", "Liver"], correct: 2, domain: "Biology", difficulty: 95 },
    { questionText: "What is the nearest planet to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: 2, domain: "Astronomy", difficulty: 75 },
    { questionText: "What type of animal is a whale?", options: ["Fish", "Reptile", "Mammal", "Amphibian"], correct: 2, domain: "Biology", difficulty: 80 },
    { questionText: "What is the boiling point of water in Celsius?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1, domain: "Physics", difficulty: 85 },
    
    // Medium (40-69%)
    { questionText: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2, domain: "Chemistry", difficulty: 55 },
    { questionText: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2, domain: "Biology", difficulty: 70 },
    { questionText: "What is absolute zero in Celsius?", options: ["-273.15°C", "-459.67°C", "-100°C", "0°C"], correct: 0, domain: "Physics", difficulty: 45 },
    { questionText: "Which element has the atomic number 1?", options: ["Helium", "Hydrogen", "Lithium", "Carbon"], correct: 1, domain: "Chemistry", difficulty: 65 },
    { questionText: "What is the closest star to Earth?", options: ["Proxima Centauri", "Alpha Centauri A", "The Sun", "Sirius"], correct: 2, domain: "Astronomy", difficulty: 60 },
    { questionText: "DNA stands for what?", options: ["Deoxyribonucleic Acid", "Dinitrogen Acid", "Deoxyribose Nucleus Acid", "Dynamic Nucleic Acid"], correct: 0, domain: "Biology", difficulty: 55 },
    { questionText: "What is the atomic number of carbon?", options: ["4", "6", "8", "12"], correct: 1, domain: "Chemistry", difficulty: 50 },
    { questionText: "What force holds atoms together in a molecule?", options: ["Gravity", "Chemical bonds", "Magnetism", "Nuclear force"], correct: 1, domain: "Chemistry", difficulty: 55 },
    { questionText: "What is the name of Earth's natural satellite?", options: ["Luna", "The Moon", "Titan", "Europa"], correct: 1, domain: "Astronomy", difficulty: 90 },
    { questionText: "What is photosynthesis?", options: ["Energy from food", "Plants making food from light", "Animal respiration", "Cell division"], correct: 1, domain: "Biology", difficulty: 70 },
    { questionText: "What is the unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correct: 2, domain: "Physics", difficulty: 55 },
    { questionText: "What planet is famous for its rings?", options: ["Jupiter", "Uranus", "Neptune", "Saturn"], correct: 3, domain: "Astronomy", difficulty: 85 },
    { questionText: "How many chromosomes do humans have?", options: ["23", "46", "48", "44"], correct: 1, domain: "Biology", difficulty: 50 },
    { questionText: "What is the chemical symbol for iron?", options: ["Ir", "Fe", "In", "I"], correct: 1, domain: "Chemistry", difficulty: 55 },
    { questionText: "What is the study of earthquakes called?", options: ["Geology", "Seismology", "Volcanology", "Meteorology"], correct: 1, domain: "Science", difficulty: 50 },
    { questionText: "What is the main component of the Sun?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correct: 2, domain: "Astronomy", difficulty: 55 },
    { questionText: "What organ filters blood and produces urine?", options: ["Liver", "Kidney", "Bladder", "Spleen"], correct: 1, domain: "Biology", difficulty: 70 },
    
    // Hard (20-39%)
    { questionText: "What is the Chandrasekhar limit?", options: ["Maximum mass of a white dwarf", "Speed of light in vacuum", "Smallest unit of time", "Distance light travels in a year"], correct: 0, domain: "Astrophysics", difficulty: 20 },
    { questionText: "What is the name of the hypothetical particle that mediates gravity?", options: ["Gravitino", "Graviton", "Higgs boson", "Gluon"], correct: 1, domain: "Physics", difficulty: 25 },
    { questionText: "What is the pH of pure water at 25°C?", options: ["0", "7", "14", "1"], correct: 1, domain: "Chemistry", difficulty: 60 },
    { questionText: "What is the Heisenberg Uncertainty Principle about?", options: ["Energy conservation", "Position and momentum", "Wave-particle duality", "Quantum entanglement"], correct: 1, domain: "Physics", difficulty: 35 },
    { questionText: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correct: 1, domain: "Astronomy", difficulty: 30 },
    { questionText: "What is the half-life of Carbon-14?", options: ["5,730 years", "1,000 years", "50,000 years", "100 years"], correct: 0, domain: "Physics", difficulty: 25 },
    { questionText: "What is entropy?", options: ["Energy conservation", "Measure of disorder", "Atomic mass", "Chemical reaction rate"], correct: 1, domain: "Physics", difficulty: 40 },
    { questionText: "What type of bond shares electrons?", options: ["Ionic", "Covalent", "Hydrogen", "Metallic"], correct: 1, domain: "Chemistry", difficulty: 45 },
    { questionText: "What is the event horizon of a black hole?", options: ["Its center", "Point of no return", "Outer atmosphere", "Accretion disk"], correct: 1, domain: "Astrophysics", difficulty: 35 },
    { questionText: "What is the function of ribosomes?", options: ["Energy production", "Protein synthesis", "Cell division", "Waste removal"], correct: 1, domain: "Biology", difficulty: 40 },
    { questionText: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2, domain: "Physics", difficulty: 50 },
    { questionText: "What is an isotope?", options: ["Same element, different protons", "Same element, different neutrons", "Different element, same mass", "Charged atom"], correct: 1, domain: "Chemistry", difficulty: 40 },
    { questionText: "What is the Doppler effect?", options: ["Light bending", "Frequency change due to motion", "Sound reflection", "Wave interference"], correct: 1, domain: "Physics", difficulty: 40 },
    { questionText: "What are stem cells?", options: ["Mature specialized cells", "Undifferentiated cells", "Dead cells", "Cancer cells"], correct: 1, domain: "Biology", difficulty: 45 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Mpemba effect?", options: ["Hot water freezing faster than cold", "Light bending around massive objects", "Quantum entanglement at distance", "Superconductivity at room temperature"], correct: 0, domain: "Physics", difficulty: 12 },
    { questionText: "What is the most common isotope of hydrogen?", options: ["Protium", "Deuterium", "Tritium", "Hydrogen-4"], correct: 0, domain: "Chemistry", difficulty: 15 },
    { questionText: "The Drake Equation estimates what?", options: ["Black hole mass", "Number of alien civilizations", "Universe expansion rate", "Star formation rate"], correct: 1, domain: "Astronomy", difficulty: 18 },
    { questionText: "What is a prion?", options: ["A type of virus", "A misfolded protein", "A bacterial toxin", "A parasitic organism"], correct: 1, domain: "Biology", difficulty: 20 },
    { questionText: "What is the Planck length?", options: ["Smallest meaningful length", "Distance to nearest star", "Wavelength of visible light", "Diameter of an atom"], correct: 0, domain: "Physics", difficulty: 15 },
    { questionText: "CRISPR-Cas9 is used for what purpose?", options: ["Protein synthesis", "Gene editing", "Cell division", "DNA replication"], correct: 1, domain: "Biology", difficulty: 35 },
    { questionText: "What is the Fermi Paradox about?", options: ["Antimatter existence", "Apparent absence of aliens", "Black hole information", "Quantum measurement"], correct: 1, domain: "Astronomy", difficulty: 25 },
    { questionText: "What is chirality in chemistry?", options: ["Acidity", "Mirror image molecules", "Radioactivity", "Conductivity"], correct: 1, domain: "Chemistry", difficulty: 18 },
    { questionText: "What is dark matter?", options: ["Black holes", "Invisible mass affecting gravity", "Antimatter", "Neutron stars"], correct: 1, domain: "Astrophysics", difficulty: 35 },
    { questionText: "What is epigenetics?", options: ["Gene mutation", "Heritable changes without DNA change", "Protein folding", "Cell death"], correct: 1, domain: "Biology", difficulty: 20 },
    { questionText: "What is the Pauli exclusion principle?", options: ["Energy conservation", "No two fermions same state", "Wave function collapse", "Uncertainty in measurement"], correct: 1, domain: "Physics", difficulty: 15 },
    { questionText: "What is a quasar?", options: ["Type of star", "Extremely luminous galactic nucleus", "Black hole remnant", "Neutron star"], correct: 1, domain: "Astrophysics", difficulty: 25 },
    { questionText: "What is a telomere?", options: ["Cell membrane", "Protective chromosome cap", "Protein", "Enzyme"], correct: 1, domain: "Biology", difficulty: 22 },
    { questionText: "What is quantum tunneling?", options: ["Information transfer", "Particles passing through barriers", "Teleportation", "Wave collapse"], correct: 1, domain: "Physics", difficulty: 18 },
    { questionText: "What is the Krebs cycle?", options: ["Cell division", "Energy production in cells", "DNA replication", "Protein synthesis"], correct: 1, domain: "Biology", difficulty: 30 },
    { questionText: "What is the Schwarzschild radius?", options: ["Star size", "Black hole event horizon", "Galaxy diameter", "Orbital distance"], correct: 1, domain: "Astrophysics", difficulty: 12 },

    // ============================================
    // PHILOSOPHY & LOGIC (35 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "Who wrote 'The Republic'?", options: ["Aristotle", "Plato", "Socrates", "Homer"], correct: 1, domain: "Philosophy", difficulty: 60 },
    { questionText: "'I think, therefore I am' was said by whom?", options: ["Kant", "Descartes", "Locke", "Hume"], correct: 1, domain: "Philosophy", difficulty: 55 },
    { questionText: "What is the study of knowledge called?", options: ["Ontology", "Epistemology", "Ethics", "Aesthetics"], correct: 1, domain: "Philosophy", difficulty: 40 },
    { questionText: "Who is considered the father of Western philosophy?", options: ["Plato", "Aristotle", "Socrates", "Thales"], correct: 2, domain: "Philosophy", difficulty: 50 },
    { questionText: "What is the study of right and wrong called?", options: ["Logic", "Metaphysics", "Ethics", "Aesthetics"], correct: 2, domain: "Philosophy", difficulty: 65 },
    
    // Medium (40-69%)
    { questionText: "Which philosopher wrote 'Thus Spoke Zarathustra'?", options: ["Kant", "Hegel", "Nietzsche", "Schopenhauer"], correct: 2, domain: "Philosophy", difficulty: 45 },
    { questionText: "What is the philosophical position that only the self can be known to exist?", options: ["Nihilism", "Solipsism", "Existentialism", "Relativism"], correct: 1, domain: "Philosophy", difficulty: 30 },
    { questionText: "The Trolley Problem is an example of what type of ethical dilemma?", options: ["Virtue ethics", "Deontological", "Utilitarian vs Deontological", "Nihilistic"], correct: 2, domain: "Philosophy", difficulty: 40 },
    { questionText: "Who is considered the father of modern philosophy?", options: ["Plato", "Aristotle", "Descartes", "Kant"], correct: 2, domain: "Philosophy", difficulty: 35 },
    { questionText: "What is utilitarianism?", options: ["Divine command theory", "Greatest good for greatest number", "Duty-based ethics", "Virtue ethics"], correct: 1, domain: "Philosophy", difficulty: 40 },
    { questionText: "Who wrote 'The Prince'?", options: ["Machiavelli", "Hobbes", "Locke", "Rousseau"], correct: 0, domain: "Philosophy", difficulty: 45 },
    { questionText: "What is nihilism?", options: ["Belief in everything", "Rejection of meaning/values", "Nature worship", "Logical reasoning"], correct: 1, domain: "Philosophy", difficulty: 40 },
    { questionText: "Who wrote 'Leviathan'?", options: ["Locke", "Hobbes", "Rousseau", "Montesquieu"], correct: 1, domain: "Philosophy", difficulty: 35 },
    { questionText: "What is the Allegory of the Cave about?", options: ["Death", "Reality and perception", "Government", "Love"], correct: 1, domain: "Philosophy", difficulty: 40 },
    { questionText: "What is existentialism primarily concerned with?", options: ["Logic", "Individual existence and freedom", "Scientific method", "Political systems"], correct: 1, domain: "Philosophy", difficulty: 45 },
    
    // Hard (20-39%)
    { questionText: "Who developed the concept of 'falsifiability' in scientific theory?", options: ["Thomas Kuhn", "Karl Popper", "Bertrand Russell", "Ludwig Wittgenstein"], correct: 1, domain: "Philosophy", difficulty: 25 },
    { questionText: "What is the name of the logical paradox involving a barber who shaves all those who don't shave themselves?", options: ["Zeno's Paradox", "Russell's Paradox", "Liar's Paradox", "Sorites Paradox"], correct: 1, domain: "Logic", difficulty: 20 },
    { questionText: "What philosophical concept did John Rawls develop using the 'veil of ignorance'?", options: ["Categorical Imperative", "Original Position", "Social Contract", "Utilitarianism"], correct: 1, domain: "Philosophy", difficulty: 20 },
    { questionText: "The Ship of Theseus is a thought experiment about what?", options: ["Time travel", "Personal identity", "Free will", "Consciousness"], correct: 1, domain: "Philosophy", difficulty: 35 },
    { questionText: "What is Occam's Razor?", options: ["A weapon", "Simplest explanation is usually correct", "A logical fallacy", "A type of argument"], correct: 1, domain: "Logic", difficulty: 40 },
    { questionText: "What is the categorical imperative?", options: ["A logical fallacy", "Kant's moral law", "A type of syllogism", "A religious doctrine"], correct: 1, domain: "Philosophy", difficulty: 30 },
    { questionText: "What is determinism?", options: ["Free will exists", "All events are caused by prior events", "Random chance rules", "God controls everything"], correct: 1, domain: "Philosophy", difficulty: 35 },
    { questionText: "What is the mind-body problem?", options: ["Mental illness", "Relationship between mind and physical body", "Exercise science", "Brain anatomy"], correct: 1, domain: "Philosophy", difficulty: 30 },
    { questionText: "What is modus ponens?", options: ["A fallacy", "If P then Q; P; therefore Q", "Proof by contradiction", "Circular reasoning"], correct: 1, domain: "Logic", difficulty: 25 },
    { questionText: "What is the Socratic method?", options: ["Lecturing", "Questioning to stimulate thinking", "Memorization", "Debate"], correct: 1, domain: "Philosophy", difficulty: 45 },
    
    // Very Hard (5-19%)
    { questionText: "What is Wittgenstein's 'Beetle in a Box' argument about?", options: ["Private language", "Existence of God", "Nature of reality", "Free will"], correct: 0, domain: "Philosophy", difficulty: 10 },
    { questionText: "Who wrote 'Being and Time'?", options: ["Sartre", "Heidegger", "Husserl", "Kierkegaard"], correct: 1, domain: "Philosophy", difficulty: 18 },
    { questionText: "The Gettier Problem challenges the traditional definition of what?", options: ["Truth", "Knowledge", "Belief", "Reality"], correct: 1, domain: "Philosophy", difficulty: 12 },
    { questionText: "What is the principle of double effect primarily associated with?", options: ["Kantian ethics", "Thomistic ethics", "Virtue ethics", "Consequentialism"], correct: 1, domain: "Philosophy", difficulty: 8 },
    { questionText: "What is phenomenology?", options: ["Study of physical phenomena", "Study of conscious experience", "Study of language", "Study of logic"], correct: 1, domain: "Philosophy", difficulty: 15 },
    { questionText: "What is the Chinese Room argument about?", options: ["Language learning", "Whether AI can truly understand", "Chinese philosophy", "Quantum mechanics"], correct: 1, domain: "Philosophy", difficulty: 18 },
    { questionText: "What is Zeno's dichotomy paradox about?", options: ["Time travel", "Infinite divisibility of motion", "Ethics", "Language"], correct: 1, domain: "Logic", difficulty: 15 },
    { questionText: "Who developed pragmatism?", options: ["Nietzsche", "William James", "Hegel", "Spinoza"], correct: 1, domain: "Philosophy", difficulty: 18 },
    { questionText: "What is the veil of perception?", options: ["A clothing", "We perceive mental representations, not things themselves", "A logical fallacy", "A religious concept"], correct: 1, domain: "Philosophy", difficulty: 12 },
    { questionText: "What is qualia?", options: ["A logical system", "Subjective conscious experiences", "A type of argument", "An ethical theory"], correct: 1, domain: "Philosophy", difficulty: 15 },

    // ============================================
    // TECHNOLOGY & COMPUTING (45 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "In what year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], correct: 2, domain: "Technology", difficulty: 55 },
    { questionText: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0, domain: "Technology", difficulty: 60 },
    { questionText: "Who founded Microsoft?", options: ["Steve Jobs", "Bill Gates and Paul Allen", "Mark Zuckerberg", "Larry Page"], correct: 1, domain: "Technology", difficulty: 75 },
    { questionText: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correct: 0, domain: "Technology", difficulty: 70 },
    { questionText: "What company created the Android operating system?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2, domain: "Technology", difficulty: 65 },
    { questionText: "What does URL stand for?", options: ["Universal Resource Link", "Uniform Resource Locator", "United Resource Location", "Universal Routing Language"], correct: 1, domain: "Technology", difficulty: 55 },
    { questionText: "Who founded Apple Computer?", options: ["Bill Gates", "Steve Jobs and Steve Wozniak", "Mark Zuckerberg", "Elon Musk"], correct: 1, domain: "Technology", difficulty: 75 },
    { questionText: "What is the most popular programming language in 2023?", options: ["Java", "Python", "JavaScript", "C++"], correct: 2, domain: "Technology", difficulty: 45 },
    { questionText: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Rapid Action Memory", "Remote Access Memory"], correct: 0, domain: "Technology", difficulty: 65 },
    { questionText: "What is the name of Microsoft's search engine?", options: ["Google", "Yahoo", "Bing", "DuckDuckGo"], correct: 2, domain: "Technology", difficulty: 70 },
    
    // Medium (40-69%)
    { questionText: "What programming language was created by James Gosling?", options: ["Python", "C++", "Java", "Ruby"], correct: 2, domain: "Technology", difficulty: 40 },
    { questionText: "What year was the World Wide Web invented?", options: ["1985", "1989", "1993", "1997"], correct: 1, domain: "Technology", difficulty: 35 },
    { questionText: "What does GPU stand for?", options: ["General Processing Unit", "Graphics Processing Unit", "Game Processing Unit", "Graphical Program Unit"], correct: 1, domain: "Technology", difficulty: 55 },
    { questionText: "Who is known as the father of computer science?", options: ["Charles Babbage", "Alan Turing", "John von Neumann", "Ada Lovelace"], correct: 1, domain: "Technology", difficulty: 45 },
    { questionText: "What is the primary function of DNS?", options: ["Security", "Domain name to IP translation", "Data compression", "Email routing"], correct: 1, domain: "Technology", difficulty: 40 },
    { questionText: "What does SSL stand for?", options: ["Secure Sockets Layer", "System Security Link", "Safe Socket Lock", "Secure System Layer"], correct: 0, domain: "Technology", difficulty: 45 },
    { questionText: "Who invented the World Wide Web?", options: ["Vint Cerf", "Tim Berners-Lee", "Marc Andreessen", "Larry Page"], correct: 1, domain: "Technology", difficulty: 40 },
    { questionText: "What is the name of Apple's virtual assistant?", options: ["Alexa", "Cortana", "Siri", "Google Assistant"], correct: 2, domain: "Technology", difficulty: 80 },
    { questionText: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Interface", "Application Process Integration"], correct: 0, domain: "Technology", difficulty: 45 },
    { questionText: "What is open source software?", options: ["Free trial software", "Software with accessible source code", "Online software", "Pirated software"], correct: 1, domain: "Technology", difficulty: 50 },
    { questionText: "What is the programming language used for iOS development?", options: ["Java", "Kotlin", "Swift", "C#"], correct: 2, domain: "Technology", difficulty: 45 },
    { questionText: "What is blockchain primarily used for?", options: ["Gaming", "Decentralized record-keeping", "Photo editing", "Video streaming"], correct: 1, domain: "Technology", difficulty: 50 },
    { questionText: "What does IoT stand for?", options: ["Internet of Things", "Input/Output Technology", "Integrated Online Tools", "Interactive Object Technology"], correct: 0, domain: "Technology", difficulty: 55 },
    { questionText: "What is machine learning?", options: ["Computer maintenance", "AI systems that improve from experience", "Online learning", "Hardware upgrades"], correct: 1, domain: "Technology", difficulty: 55 },
    
    // Hard (20-39%)
    { questionText: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1, domain: "Computer Science", difficulty: 30 },
    { questionText: "What does RAID stand for in computing?", options: ["Redundant Array of Independent Disks", "Random Access Internal Drive", "Rapid Access Integrated Data", "Reliable Array of Inexpensive Drives"], correct: 0, domain: "Technology", difficulty: 25 },
    { questionText: "What is a hash table's average-case time complexity for lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 2, domain: "Computer Science", difficulty: 25 },
    { questionText: "Who developed the Linux kernel?", options: ["Richard Stallman", "Linus Torvalds", "Dennis Ritchie", "Ken Thompson"], correct: 1, domain: "Technology", difficulty: 40 },
    { questionText: "What is recursion in programming?", options: ["Loop type", "Function calling itself", "Error type", "Data type"], correct: 1, domain: "Computer Science", difficulty: 35 },
    { questionText: "What is a neural network?", options: ["Brain surgery", "Computer network", "AI system modeled on brain", "Social network"], correct: 2, domain: "Technology", difficulty: 40 },
    { questionText: "What is the difference between TCP and UDP?", options: ["Speed vs size", "Reliability vs speed", "Color vs size", "Sound vs video"], correct: 1, domain: "Computer Science", difficulty: 30 },
    { questionText: "What is Docker used for?", options: ["Image editing", "Containerization", "Web browsing", "Email"], correct: 1, domain: "Technology", difficulty: 30 },
    { questionText: "What is Git?", options: ["Programming language", "Version control system", "Operating system", "Database"], correct: 1, domain: "Technology", difficulty: 45 },
    { questionText: "What is the halting problem?", options: ["Computer crash", "Undecidable problem about program termination", "Power issue", "Memory leak"], correct: 1, domain: "Computer Science", difficulty: 20 },
    { questionText: "What is a compiler?", options: ["Hardware", "Translates code to machine language", "Web browser", "Database"], correct: 1, domain: "Computer Science", difficulty: 40 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Kolmogorov complexity of a string?", options: ["Its entropy", "Length of shortest program that outputs it", "Number of unique characters", "Its hash value"], correct: 1, domain: "Computer Science", difficulty: 8 },
    { questionText: "What is the CAP theorem about in distributed systems?", options: ["Security tradeoffs", "Consistency, Availability, Partition tolerance", "CPU, RAM, Power", "Caching, Archiving, Processing"], correct: 1, domain: "Computer Science", difficulty: 15 },
    { questionText: "What is a Turing machine?", options: ["First electronic computer", "Theoretical computation model", "Encryption device", "AI system"], correct: 1, domain: "Computer Science", difficulty: 30 },
    { questionText: "What problem does the Byzantine Generals Problem describe?", options: ["Deadlock", "Consensus in distributed systems", "Memory allocation", "Sorting efficiency"], correct: 1, domain: "Computer Science", difficulty: 12 },
    { questionText: "What is the P vs NP problem asking?", options: ["If parallel computing is faster", "If verifiable problems are solvable quickly", "If quantum computers exist", "If AI can think"], correct: 1, domain: "Computer Science", difficulty: 18 },
    { questionText: "What is a lambda calculus?", options: ["Statistical method", "Formal system for computation", "Physics formula", "Chemical process"], correct: 1, domain: "Computer Science", difficulty: 15 },
    { questionText: "What is the traveling salesman problem?", options: ["Logistics optimization", "Finding shortest route visiting all cities", "Sales prediction", "Customer service"], correct: 1, domain: "Computer Science", difficulty: 25 },
    { questionText: "What is a memory leak?", options: ["Hardware failure", "Unreleased memory allocation", "Data theft", "Power loss"], correct: 1, domain: "Computer Science", difficulty: 30 },
    { questionText: "What is homomorphic encryption?", options: ["Basic encryption", "Computing on encrypted data", "Password hashing", "Key exchange"], correct: 1, domain: "Computer Science", difficulty: 10 },
    { questionText: "What is MapReduce?", options: ["A GPS system", "Programming model for large-scale data processing", "A graphics library", "A compression algorithm"], correct: 1, domain: "Computer Science", difficulty: 18 },

    // ============================================
    // ART & LITERATURE (45 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"], correct: 1, domain: "Art", difficulty: 85 },
    { questionText: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correct: 1, domain: "Literature", difficulty: 90 },
    { questionText: "What is the name of the famous painting by Edvard Munch depicting a figure with an agonized expression?", options: ["The Cry", "The Scream", "The Shout", "The Wail"], correct: 1, domain: "Art", difficulty: 70 },
    { questionText: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], correct: 1, domain: "Literature", difficulty: 65 },
    { questionText: "Who painted 'Starry Night'?", options: ["Monet", "Picasso", "Van Gogh", "Rembrandt"], correct: 2, domain: "Art", difficulty: 75 },
    { questionText: "Who wrote 'Pride and Prejudice'?", options: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "Virginia Woolf"], correct: 0, domain: "Literature", difficulty: 70 },
    { questionText: "What is the title of J.K. Rowling's first Harry Potter book?", options: ["Chamber of Secrets", "Prisoner of Azkaban", "Philosopher's Stone", "Goblet of Fire"], correct: 2, domain: "Literature", difficulty: 80 },
    { questionText: "Who painted 'The Last Supper'?", options: ["Raphael", "Leonardo da Vinci", "Michelangelo", "Caravaggio"], correct: 1, domain: "Art", difficulty: 70 },
    { questionText: "Who wrote 'The Great Gatsby'?", options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"], correct: 1, domain: "Literature", difficulty: 65 },
    { questionText: "What art technique creates the illusion of three dimensions?", options: ["Perspective", "Abstract", "Impressionism", "Minimalism"], correct: 0, domain: "Art", difficulty: 60 },
    
    // Medium (40-69%)
    { questionText: "What art movement was Salvador Dalí associated with?", options: ["Impressionism", "Cubism", "Surrealism", "Expressionism"], correct: 2, domain: "Art", difficulty: 55 },
    { questionText: "Who wrote 'The Divine Comedy'?", options: ["Virgil", "Homer", "Dante", "Petrarch"], correct: 2, domain: "Literature", difficulty: 50 },
    { questionText: "Which artist cut off part of his own ear?", options: ["Picasso", "Van Gogh", "Monet", "Rembrandt"], correct: 1, domain: "Art", difficulty: 75 },
    { questionText: "Who wrote 'War and Peace'?", options: ["Dostoevsky", "Tolstoy", "Chekhov", "Pushkin"], correct: 1, domain: "Literature", difficulty: 55 },
    { questionText: "The Sistine Chapel ceiling was painted by whom?", options: ["Raphael", "Da Vinci", "Michelangelo", "Botticelli"], correct: 2, domain: "Art", difficulty: 65 },
    { questionText: "Who wrote 'One Hundred Years of Solitude'?", options: ["Pablo Neruda", "Gabriel García Márquez", "Jorge Luis Borges", "Mario Vargas Llosa"], correct: 1, domain: "Literature", difficulty: 40 },
    { questionText: "Who created the sculpture 'David'?", options: ["Donatello", "Bernini", "Michelangelo", "Rodin"], correct: 2, domain: "Art", difficulty: 55 },
    { questionText: "Who wrote 'The Odyssey'?", options: ["Sophocles", "Euripides", "Homer", "Virgil"], correct: 2, domain: "Literature", difficulty: 60 },
    { questionText: "What art movement did Claude Monet belong to?", options: ["Surrealism", "Impressionism", "Cubism", "Realism"], correct: 1, domain: "Art", difficulty: 55 },
    { questionText: "Who wrote 'Crime and Punishment'?", options: ["Tolstoy", "Dostoevsky", "Gogol", "Turgenev"], correct: 1, domain: "Literature", difficulty: 50 },
    { questionText: "Who painted 'The Birth of Venus'?", options: ["Leonardo", "Raphael", "Botticelli", "Titian"], correct: 2, domain: "Art", difficulty: 45 },
    { questionText: "Who wrote 'Moby-Dick'?", options: ["Mark Twain", "Herman Melville", "Nathaniel Hawthorne", "Edgar Allan Poe"], correct: 1, domain: "Literature", difficulty: 55 },
    { questionText: "What art movement was Pablo Picasso a founder of?", options: ["Impressionism", "Surrealism", "Cubism", "Expressionism"], correct: 2, domain: "Art", difficulty: 55 },
    { questionText: "Who wrote 'Don Quixote'?", options: ["Lope de Vega", "Miguel de Cervantes", "Federico García Lorca", "Pablo Neruda"], correct: 1, domain: "Literature", difficulty: 50 },
    { questionText: "What is the name of Sherlock Holmes' assistant?", options: ["Dr. Watson", "Inspector Lestrade", "Mycroft", "Moriarty"], correct: 0, domain: "Literature", difficulty: 80 },
    { questionText: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Truman Capote", "John Steinbeck", "Ernest Hemingway"], correct: 0, domain: "Literature", difficulty: 65 },
    
    // Hard (20-39%)
    { questionText: "What painting technique uses tiny dots of color?", options: ["Impressionism", "Pointillism", "Fauvism", "Cubism"], correct: 1, domain: "Art", difficulty: 35 },
    { questionText: "Who wrote 'The Metamorphosis' about a man turning into an insect?", options: ["Camus", "Kafka", "Sartre", "Dostoevsky"], correct: 1, domain: "Literature", difficulty: 40 },
    { questionText: "What is chiaroscuro in art?", options: ["Color blending", "Light and shadow contrast", "Perspective technique", "Brushstroke style"], correct: 1, domain: "Art", difficulty: 25 },
    { questionText: "Who wrote the epic poem 'Paradise Lost'?", options: ["John Milton", "John Donne", "Geoffrey Chaucer", "Edmund Spenser"], correct: 0, domain: "Literature", difficulty: 35 },
    { questionText: "Who painted 'Girl with a Pearl Earring'?", options: ["Rembrandt", "Vermeer", "Van Eyck", "Rubens"], correct: 1, domain: "Art", difficulty: 40 },
    { questionText: "Who wrote 'Brave New World'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"], correct: 1, domain: "Literature", difficulty: 50 },
    { questionText: "What is trompe-l'œil?", options: ["Dance style", "Art that creates optical illusion", "Musical term", "Sculpture technique"], correct: 1, domain: "Art", difficulty: 25 },
    { questionText: "Who wrote 'The Canterbury Tales'?", options: ["Shakespeare", "Chaucer", "Milton", "Spenser"], correct: 1, domain: "Literature", difficulty: 45 },
    { questionText: "Who sculpted 'The Thinker'?", options: ["Michelangelo", "Donatello", "Rodin", "Bernini"], correct: 2, domain: "Art", difficulty: 45 },
    { questionText: "Who wrote 'Ulysses'?", options: ["Homer", "James Joyce", "Virginia Woolf", "Samuel Beckett"], correct: 1, domain: "Literature", difficulty: 40 },
    
    // Very Hard (5-19%)
    { questionText: "What is sfumato in Renaissance painting?", options: ["Gold leaf application", "Soft blending of colors", "Egg tempera technique", "Fresco preparation"], correct: 1, domain: "Art", difficulty: 15 },
    { questionText: "Who wrote 'Finnegans Wake'?", options: ["Virginia Woolf", "James Joyce", "Samuel Beckett", "T.S. Eliot"], correct: 1, domain: "Literature", difficulty: 20 },
    { questionText: "The Arnolfini Portrait was painted by which artist?", options: ["Vermeer", "Jan van Eyck", "Rembrandt", "Dürer"], correct: 1, domain: "Art", difficulty: 18 },
    { questionText: "Who wrote 'The Master and Margarita'?", options: ["Nabokov", "Bulgakov", "Solzhenitsyn", "Pasternak"], correct: 1, domain: "Literature", difficulty: 22 },
    { questionText: "What is grisaille?", options: ["A type of stone", "Monochrome gray painting", "Italian cheese", "Musical instrument"], correct: 1, domain: "Art", difficulty: 10 },
    { questionText: "Who wrote 'In Search of Lost Time'?", options: ["Flaubert", "Proust", "Balzac", "Zola"], correct: 1, domain: "Literature", difficulty: 25 },
    { questionText: "What is impasto in painting?", options: ["A food", "Thick textured paint application", "Thin wash", "Sculpture technique"], correct: 1, domain: "Art", difficulty: 18 },
    { questionText: "Who wrote 'The Sound and the Fury'?", options: ["Hemingway", "Fitzgerald", "Faulkner", "Steinbeck"], correct: 2, domain: "Literature", difficulty: 30 },
    { questionText: "What is contrapposto in sculpture?", options: ["Material type", "Asymmetrical stance", "Size measurement", "Carving technique"], correct: 1, domain: "Art", difficulty: 15 },

    // ============================================
    // MUSIC (30 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "Who composed the 'Moonlight Sonata'?", options: ["Mozart", "Beethoven", "Bach", "Chopin"], correct: 1, domain: "Music", difficulty: 60 },
    { questionText: "What is the highest female singing voice?", options: ["Alto", "Mezzo-soprano", "Soprano", "Contralto"], correct: 2, domain: "Music", difficulty: 55 },
    { questionText: "Which band recorded 'Abbey Road'?", options: ["The Rolling Stones", "The Beatles", "The Who", "Led Zeppelin"], correct: 1, domain: "Music", difficulty: 70 },
    { questionText: "What instrument has 88 keys?", options: ["Organ", "Piano", "Accordion", "Harpsichord"], correct: 1, domain: "Music", difficulty: 75 },
    { questionText: "Who is known as the 'King of Pop'?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], correct: 1, domain: "Music", difficulty: 85 },
    { questionText: "What is the lowest male singing voice?", options: ["Tenor", "Baritone", "Bass", "Countertenor"], correct: 2, domain: "Music", difficulty: 55 },
    { questionText: "Who wrote 'Für Elise'?", options: ["Mozart", "Beethoven", "Bach", "Chopin"], correct: 1, domain: "Music", difficulty: 55 },
    { questionText: "What instrument family does the violin belong to?", options: ["Woodwind", "Brass", "String", "Percussion"], correct: 2, domain: "Music", difficulty: 80 },
    
    // Medium (40-69%)
    { questionText: "How many symphonies did Beethoven compose?", options: ["5", "7", "9", "12"], correct: 2, domain: "Music", difficulty: 40 },
    { questionText: "What is the musical term for gradually getting louder?", options: ["Diminuendo", "Crescendo", "Fortissimo", "Pianissimo"], correct: 1, domain: "Music", difficulty: 50 },
    { questionText: "Who composed 'The Four Seasons'?", options: ["Bach", "Vivaldi", "Handel", "Mozart"], correct: 1, domain: "Music", difficulty: 45 },
    { questionText: "What does 'allegro' mean in music?", options: ["Slow", "Fast", "Loud", "Soft"], correct: 1, domain: "Music", difficulty: 45 },
    { questionText: "Who composed 'The Nutcracker'?", options: ["Mozart", "Beethoven", "Tchaikovsky", "Bach"], correct: 2, domain: "Music", difficulty: 55 },
    { questionText: "What is a musical scale with 12 notes called?", options: ["Diatonic", "Chromatic", "Pentatonic", "Blues"], correct: 1, domain: "Music", difficulty: 35 },
    { questionText: "Who composed 'The Magic Flute'?", options: ["Beethoven", "Mozart", "Handel", "Haydn"], correct: 1, domain: "Music", difficulty: 45 },
    { questionText: "What is syncopation?", options: ["Loud playing", "Off-beat accent", "Slow tempo", "Harmonic technique"], correct: 1, domain: "Music", difficulty: 35 },
    { questionText: "Who is considered the 'Father of the Symphony'?", options: ["Mozart", "Beethoven", "Haydn", "Bach"], correct: 2, domain: "Music", difficulty: 30 },
    { questionText: "What key has no sharps or flats?", options: ["D major", "C major", "G major", "F major"], correct: 1, domain: "Music", difficulty: 40 },
    
    // Hard (20-39%)
    { questionText: "What is the lowest brass instrument?", options: ["Trombone", "French horn", "Tuba", "Baritone"], correct: 2, domain: "Music", difficulty: 45 },
    { questionText: "Which composer wrote the opera 'The Ring Cycle'?", options: ["Verdi", "Wagner", "Puccini", "Mozart"], correct: 1, domain: "Music", difficulty: 30 },
    { questionText: "What is a tritone in music?", options: ["Three tones", "Augmented fourth interval", "Major third", "Perfect fifth"], correct: 1, domain: "Music", difficulty: 20 },
    { questionText: "What is counterpoint?", options: ["Musical opposition", "Two or more independent melodies", "Rhythmic pattern", "Dynamic change"], correct: 1, domain: "Music", difficulty: 25 },
    { questionText: "Who composed 'Rhapsody in Blue'?", options: ["Copland", "Gershwin", "Bernstein", "Ives"], correct: 1, domain: "Music", difficulty: 35 },
    { questionText: "What is a fugue?", options: ["Dance form", "Contrapuntal composition", "Song form", "Instrumental solo"], correct: 1, domain: "Music", difficulty: 25 },
    { questionText: "What is rubato in music?", options: ["Fast tempo", "Flexible tempo", "Loud dynamics", "Rhythmic pattern"], correct: 1, domain: "Music", difficulty: 25 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Köchel catalogue used for?", options: ["Bach's works", "Mozart's works", "Beethoven's works", "Haydn's works"], correct: 1, domain: "Music", difficulty: 12 },
    { questionText: "What is a Neapolitan sixth chord?", options: ["Minor chord", "Major chord on flattened second", "Diminished seventh", "Augmented triad"], correct: 1, domain: "Music", difficulty: 8 },
    { questionText: "What is the Schenkerian analysis?", options: ["Rhythmic analysis", "Method of deep harmonic structure", "Melodic analysis", "Form analysis"], correct: 1, domain: "Music", difficulty: 8 },
    { questionText: "What is a hemiola?", options: ["Half note", "Rhythmic ratio of 3:2", "Key signature", "Chord type"], correct: 1, domain: "Music", difficulty: 10 },
    { questionText: "What is a Picardy third?", options: ["Third movement", "Major third ending a minor piece", "Type of chord", "Tempo marking"], correct: 1, domain: "Music", difficulty: 12 },

    // ============================================
    // MATHEMATICS (20 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What is the value of Pi to two decimal places?", options: ["3.14", "3.16", "3.12", "3.18"], correct: 0, domain: "Mathematics", difficulty: 80 },
    { questionText: "What is the square root of 144?", options: ["10", "11", "12", "13"], correct: 2, domain: "Mathematics", difficulty: 75 },
    { questionText: "What is a polygon with 8 sides called?", options: ["Hexagon", "Heptagon", "Octagon", "Nonagon"], correct: 2, domain: "Mathematics", difficulty: 70 },
    { questionText: "What is 7 × 8?", options: ["54", "56", "58", "64"], correct: 1, domain: "Mathematics", difficulty: 90 },
    { questionText: "What is the perimeter of a square with sides of 5?", options: ["15", "20", "25", "10"], correct: 1, domain: "Mathematics", difficulty: 85 },
    { questionText: "What is 25% of 200?", options: ["25", "50", "75", "100"], correct: 1, domain: "Mathematics", difficulty: 80 },
    { questionText: "What is the area of a rectangle with length 6 and width 4?", options: ["10", "20", "24", "28"], correct: 2, domain: "Mathematics", difficulty: 80 },
    
    // Medium (40-69%)
    { questionText: "What is the derivative of x²?", options: ["x", "2x", "x²", "2x²"], correct: 1, domain: "Mathematics", difficulty: 50 },
    { questionText: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correct: 1, domain: "Mathematics", difficulty: 75 },
    { questionText: "What is the Fibonacci sequence's next number after 1, 1, 2, 3, 5, 8?", options: ["11", "12", "13", "15"], correct: 2, domain: "Mathematics", difficulty: 55 },
    { questionText: "What is i² in complex numbers?", options: ["1", "-1", "i", "0"], correct: 1, domain: "Mathematics", difficulty: 45 },
    { questionText: "What is the quadratic formula used for?", options: ["Finding derivatives", "Solving ax² + bx + c = 0", "Calculating area", "Finding integrals"], correct: 1, domain: "Mathematics", difficulty: 50 },
    { questionText: "What is a prime number?", options: ["Divisible by 2", "Divisible only by 1 and itself", "An even number", "A negative number"], correct: 1, domain: "Mathematics", difficulty: 70 },
    { questionText: "What is the hypotenuse of a right triangle with legs 3 and 4?", options: ["5", "6", "7", "8"], correct: 0, domain: "Mathematics", difficulty: 55 },
    { questionText: "What is the factorial of 5 (5!)?", options: ["25", "60", "120", "720"], correct: 2, domain: "Mathematics", difficulty: 50 },
    { questionText: "What is the formula for the circumference of a circle?", options: ["πr²", "2πr", "πd²", "4πr"], correct: 1, domain: "Mathematics", difficulty: 55 },
    { questionText: "What is log₁₀(100)?", options: ["1", "2", "10", "100"], correct: 1, domain: "Mathematics", difficulty: 45 },
    
    // Hard (20-39%)
    { questionText: "What is Euler's number (e) approximately?", options: ["2.718", "3.141", "1.618", "2.236"], correct: 0, domain: "Mathematics", difficulty: 35 },
    { questionText: "What is the integral of 1/x?", options: ["x", "ln|x|", "1/x²", "e^x"], correct: 1, domain: "Mathematics", difficulty: 30 },
    { questionText: "What is the Golden Ratio approximately?", options: ["1.414", "1.618", "1.732", "2.236"], correct: 1, domain: "Mathematics", difficulty: 35 },
    { questionText: "How many edges does a dodecahedron have?", options: ["20", "30", "40", "50"], correct: 1, domain: "Mathematics", difficulty: 20 },
    { questionText: "What is the sum of an infinite geometric series with first term 1 and ratio 1/2?", options: ["1", "2", "∞", "0.5"], correct: 1, domain: "Mathematics", difficulty: 30 },
    { questionText: "What is the determinant of a 2x2 identity matrix?", options: ["0", "1", "2", "4"], correct: 1, domain: "Mathematics", difficulty: 35 },
    { questionText: "What is a vector space?", options: ["Three-dimensional space", "Collection with addition and scalar multiplication", "Coordinate system", "Graph theory concept"], correct: 1, domain: "Mathematics", difficulty: 25 },
    { questionText: "What is the Pythagorean theorem?", options: ["a + b = c", "a² + b² = c²", "a × b = c", "a² - b² = c²"], correct: 1, domain: "Mathematics", difficulty: 65 },
    { questionText: "What is a matrix transpose?", options: ["Inverse matrix", "Rows and columns switched", "Determinant", "Eigenvalue"], correct: 1, domain: "Mathematics", difficulty: 30 },
    { questionText: "What does the limit as x approaches infinity of 1/x equal?", options: ["1", "0", "∞", "undefined"], correct: 1, domain: "Mathematics", difficulty: 40 },
    
    // Very Hard (5-19%)
    { questionText: "Which ancient text contains the first known reference to the number zero as a placeholder?", options: ["Rhind Papyrus", "Bakhshali manuscript", "Elements by Euclid", "Almagest"], correct: 1, domain: "Mathematics", difficulty: 8 },
    { questionText: "What is Gödel's incompleteness theorem about?", options: ["Limits of provability in formal systems", "Infinite sets", "Prime numbers", "Calculus foundations"], correct: 0, domain: "Mathematics", difficulty: 15 },
    { questionText: "What is the Riemann Hypothesis about?", options: ["Prime number distribution", "Fermat's theorem", "Pi calculation", "Complex analysis"], correct: 0, domain: "Mathematics", difficulty: 18 },
    { questionText: "What is a Hilbert space?", options: ["Finite vector space", "Infinite-dimensional complete inner product space", "Euclidean geometry", "Topology concept"], correct: 1, domain: "Mathematics", difficulty: 10 },
    { questionText: "What is a Galois field?", options: ["Magnetic field", "Finite field in algebra", "Complex number set", "Topological space"], correct: 1, domain: "Mathematics", difficulty: 8 },
    { questionText: "What is the Collatz conjecture about?", options: ["Prime numbers", "Sequence eventually reaching 1", "Infinite series", "Matrix algebra"], correct: 1, domain: "Mathematics", difficulty: 12 },
    { questionText: "What is a Banach space?", options: ["Vector space", "Complete normed vector space", "Metric space", "Hilbert space subset"], correct: 1, domain: "Mathematics", difficulty: 8 },
    { questionText: "What is the Birch and Swinnerton-Dyer conjecture about?", options: ["Prime numbers", "Elliptic curves", "Graph theory", "Number theory"], correct: 1, domain: "Mathematics", difficulty: 5 },

    // ============================================
    // ECONOMICS & BUSINESS (30 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What does GDP stand for?", options: ["Gross Domestic Product", "General Domestic Profit", "Global Development Progress", "Gross Development Plan"], correct: 0, domain: "Economics", difficulty: 70 },
    { questionText: "What is inflation?", options: ["Decrease in prices", "Increase in general price level", "Stock market crash", "Currency devaluation"], correct: 1, domain: "Economics", difficulty: 65 },
    { questionText: "What is a stock?", options: ["A type of bond", "Ownership share in a company", "Government debt", "Savings account"], correct: 1, domain: "Economics", difficulty: 75 },
    { questionText: "What is a budget?", options: ["Total wealth", "Plan for income and spending", "Investment portfolio", "Tax return"], correct: 1, domain: "Economics", difficulty: 85 },
    { questionText: "What does IPO stand for?", options: ["Initial Public Offering", "International Purchase Order", "Internal Profit Outlook", "Investor Portfolio Option"], correct: 0, domain: "Economics", difficulty: 55 },
    
    // Medium (40-69%)
    { questionText: "What is a monopoly?", options: ["Many sellers", "Single seller dominance", "Two main competitors", "Perfect competition"], correct: 1, domain: "Economics", difficulty: 60 },
    { questionText: "What is the law of supply and demand?", options: ["Government regulation", "Price determined by supply/demand relationship", "Fixed pricing system", "Import/export balance"], correct: 1, domain: "Economics", difficulty: 55 },
    { questionText: "What is quantitative easing?", options: ["Tax reduction", "Central bank buying securities", "Trade sanctions", "Currency exchange"], correct: 1, domain: "Economics", difficulty: 35 },
    { questionText: "What is a recession?", options: ["Economic growth", "Sustained economic decline", "Stock market boom", "Low unemployment"], correct: 1, domain: "Economics", difficulty: 55 },
    { questionText: "What is the Federal Reserve?", options: ["Military reserve", "US central bank", "Government savings", "Private bank"], correct: 1, domain: "Economics", difficulty: 50 },
    { questionText: "What is opportunity cost?", options: ["Business expense", "Value of next best alternative forgone", "Loan interest", "Tax payment"], correct: 1, domain: "Economics", difficulty: 45 },
    { questionText: "What is a tariff?", options: ["Trade agreement", "Tax on imports", "Export subsidy", "Currency exchange rate"], correct: 1, domain: "Economics", difficulty: 50 },
    { questionText: "What is the difference between micro and macroeconomics?", options: ["Size of companies studied", "Individual vs aggregate economy", "Domestic vs international", "Short-term vs long-term"], correct: 1, domain: "Economics", difficulty: 45 },
    { questionText: "What is a bear market?", options: ["Rising market", "Declining market", "Stable market", "Volatile market"], correct: 1, domain: "Economics", difficulty: 50 },
    { questionText: "What is compound interest?", options: ["Simple interest", "Interest on interest", "Fixed rate", "Variable rate"], correct: 1, domain: "Economics", difficulty: 55 },
    { questionText: "What is diversification in investing?", options: ["Focusing on one stock", "Spreading investments across assets", "Short selling", "Day trading"], correct: 1, domain: "Economics", difficulty: 50 },
    
    // Hard (20-39%)
    { questionText: "What is the Phillips Curve?", options: ["Growth vs debt", "Inflation vs unemployment relationship", "Interest vs exchange rates", "Supply vs demand"], correct: 1, domain: "Economics", difficulty: 25 },
    { questionText: "What is moral hazard in economics?", options: ["Unethical business practices", "Risk-taking due to protection from consequences", "Market manipulation", "Insider trading"], correct: 1, domain: "Economics", difficulty: 30 },
    { questionText: "What is the Nash Equilibrium?", options: ["Market balance", "Game theory optimal strategy state", "Trade equilibrium", "Supply-demand intersection"], correct: 1, domain: "Economics", difficulty: 25 },
    { questionText: "What is stagflation?", options: ["Rapid growth", "High inflation with high unemployment", "Deflation", "Economic boom"], correct: 1, domain: "Economics", difficulty: 30 },
    { questionText: "What is the Laffer Curve?", options: ["Demand curve", "Tax revenue vs tax rate relationship", "Supply curve", "Phillips curve variant"], correct: 1, domain: "Economics", difficulty: 20 },
    { questionText: "What is arbitrage?", options: ["Long-term investing", "Exploiting price differences in markets", "Dividend investing", "Value investing"], correct: 1, domain: "Economics", difficulty: 30 },
    { questionText: "What is a credit default swap?", options: ["Currency exchange", "Insurance-like financial derivative", "Stock option", "Bond type"], correct: 1, domain: "Economics", difficulty: 20 },
    { questionText: "What is the velocity of money?", options: ["Printing speed", "Rate at which money circulates", "Exchange rate", "Interest rate"], correct: 1, domain: "Economics", difficulty: 25 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Mundell-Fleming model about?", options: ["Labor markets", "Open economy macroeconomics", "Stock valuation", "Consumer behavior"], correct: 1, domain: "Economics", difficulty: 10 },
    { questionText: "What is Goodhart's Law?", options: ["Supply and demand", "When a measure becomes a target, it ceases to be useful", "Diminishing returns", "Comparative advantage"], correct: 1, domain: "Economics", difficulty: 12 },
    { questionText: "What is the Tobin Tax?", options: ["Income tax", "Tax on currency transactions", "Property tax", "Sales tax"], correct: 1, domain: "Economics", difficulty: 15 },
    { questionText: "What is the efficient market hypothesis?", options: ["Markets always crash", "Prices reflect all available information", "Markets are always inefficient", "Government controls prices"], correct: 1, domain: "Economics", difficulty: 18 },
    { questionText: "What is Pareto efficiency?", options: ["Perfect competition", "No one can be made better off without making someone worse off", "Maximum profit", "Minimum cost"], correct: 1, domain: "Economics", difficulty: 15 },
    { questionText: "What is the Keynesian multiplier?", options: ["Tax rate", "Spending increase effect on GDP", "Interest rate", "Inflation rate"], correct: 1, domain: "Economics", difficulty: 18 },

    // ============================================
    // MYTHOLOGY & RELIGION (30 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "In Greek mythology, who is the king of the gods?", options: ["Poseidon", "Hades", "Zeus", "Apollo"], correct: 2, domain: "Mythology", difficulty: 85 },
    { questionText: "What is the holy book of Islam called?", options: ["Torah", "Bible", "Quran", "Vedas"], correct: 2, domain: "Religion", difficulty: 80 },
    { questionText: "In Norse mythology, what is the name of Thor's hammer?", options: ["Gungnir", "Mjolnir", "Excalibur", "Gram"], correct: 1, domain: "Mythology", difficulty: 65 },
    { questionText: "What is the name of the Hindu festival of lights?", options: ["Holi", "Diwali", "Navratri", "Durga Puja"], correct: 1, domain: "Religion", difficulty: 65 },
    { questionText: "Who is the Greek goddess of wisdom?", options: ["Hera", "Aphrodite", "Athena", "Artemis"], correct: 2, domain: "Mythology", difficulty: 70 },
    { questionText: "What are the Ten Commandments associated with?", options: ["Christianity and Judaism", "Islam", "Hinduism", "Buddhism"], correct: 0, domain: "Religion", difficulty: 80 },
    { questionText: "Who is the Greek god of the sea?", options: ["Zeus", "Hades", "Poseidon", "Apollo"], correct: 2, domain: "Mythology", difficulty: 75 },
    
    // Medium (40-69%)
    { questionText: "Who is the Hindu god of wisdom and new beginnings?", options: ["Vishnu", "Shiva", "Ganesha", "Brahma"], correct: 2, domain: "Religion", difficulty: 50 },
    { questionText: "In Greek mythology, who flew too close to the sun?", options: ["Perseus", "Icarus", "Theseus", "Orpheus"], correct: 1, domain: "Mythology", difficulty: 60 },
    { questionText: "What are the Four Noble Truths associated with?", options: ["Christianity", "Judaism", "Buddhism", "Hinduism"], correct: 2, domain: "Religion", difficulty: 45 },
    { questionText: "Who is the Greek goddess of love?", options: ["Athena", "Hera", "Artemis", "Aphrodite"], correct: 3, domain: "Mythology", difficulty: 65 },
    { questionText: "What is the Tao in Taoism?", options: ["A god", "The fundamental way of the universe", "A temple", "A ritual"], correct: 1, domain: "Religion", difficulty: 40 },
    { questionText: "Who killed Medusa in Greek mythology?", options: ["Hercules", "Theseus", "Perseus", "Achilles"], correct: 2, domain: "Mythology", difficulty: 55 },
    { questionText: "What is the Bhagavad Gita?", options: ["Buddhist text", "Hindu scripture", "Jain text", "Sikh text"], correct: 1, domain: "Religion", difficulty: 45 },
    { questionText: "In Norse mythology, what is Valhalla?", options: ["Underworld", "Hall of slain warriors", "Mountain", "Ocean"], correct: 1, domain: "Mythology", difficulty: 55 },
    { questionText: "Who are the Muses in Greek mythology?", options: ["Warriors", "Goddesses of arts and sciences", "Sea nymphs", "Titans"], correct: 1, domain: "Mythology", difficulty: 50 },
    { questionText: "What is the Shinto religion native to?", options: ["China", "Japan", "Korea", "India"], correct: 1, domain: "Religion", difficulty: 50 },
    { questionText: "Who is the trickster god in Norse mythology?", options: ["Thor", "Odin", "Loki", "Baldur"], correct: 2, domain: "Mythology", difficulty: 60 },
    
    // Hard (20-39%)
    { questionText: "In Egyptian mythology, who is the god of the underworld?", options: ["Ra", "Osiris", "Anubis", "Horus"], correct: 1, domain: "Mythology", difficulty: 40 },
    { questionText: "What is the Eightfold Path in Buddhism?", options: ["Reincarnation stages", "Path to enlightenment", "Temple rituals", "Meditation levels"], correct: 1, domain: "Religion", difficulty: 35 },
    { questionText: "Who is Loki's father in Norse mythology?", options: ["Odin", "Fárbauti", "Thor", "Baldur"], correct: 1, domain: "Mythology", difficulty: 20 },
    { questionText: "What is the Trimurti in Hinduism?", options: ["Three paths", "Three supreme gods (Brahma, Vishnu, Shiva)", "Three temples", "Three scriptures"], correct: 1, domain: "Religion", difficulty: 30 },
    { questionText: "Who is the ferryman of the dead in Greek mythology?", options: ["Hades", "Thanatos", "Charon", "Cerberus"], correct: 2, domain: "Mythology", difficulty: 35 },
    { questionText: "What is the concept of karma?", options: ["Fate", "Cause and effect of actions", "Luck", "Divine will"], correct: 1, domain: "Religion", difficulty: 45 },
    { questionText: "Who is Gilgamesh?", options: ["Greek hero", "Mesopotamian legendary king", "Egyptian pharaoh", "Norse god"], correct: 1, domain: "Mythology", difficulty: 30 },
    { questionText: "What is the Tree of Life in Norse mythology called?", options: ["Yggdrasil", "Bifrost", "Midgard", "Asgard"], correct: 0, domain: "Mythology", difficulty: 35 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Enuma Elish?", options: ["Egyptian book of dead", "Babylonian creation myth", "Greek epic", "Hindu scripture"], correct: 1, domain: "Mythology", difficulty: 12 },
    { questionText: "In Zoroastrianism, who is the supreme deity?", options: ["Marduk", "Ahura Mazda", "Mithra", "Angra Mainyu"], correct: 1, domain: "Religion", difficulty: 15 },
    { questionText: "What is the Popol Vuh?", options: ["Aztec calendar", "Mayan creation narrative", "Inca temple", "Olmec artifact"], correct: 1, domain: "Mythology", difficulty: 10 },
    { questionText: "What is the Bardo Thodol?", options: ["Hindu text", "Tibetan Book of the Dead", "Buddhist monastery", "Japanese shrine"], correct: 1, domain: "Religion", difficulty: 12 },
    { questionText: "Who is Quetzalcoatl?", options: ["Mayan god", "Aztec feathered serpent deity", "Inca emperor", "Olmec king"], correct: 1, domain: "Mythology", difficulty: 25 },
    { questionText: "What is the Rigveda?", options: ["Buddhist text", "Ancient Hindu hymn collection", "Jain scripture", "Sikh text"], correct: 1, domain: "Religion", difficulty: 18 },

    // ============================================
    // PSYCHOLOGY (25 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What is psychology the study of?", options: ["Physics", "Mind and behavior", "Animals", "Plants"], correct: 1, domain: "Psychology", difficulty: 85 },
    { questionText: "What is an IQ test designed to measure?", options: ["Personality", "Intelligence", "Creativity", "Memory only"], correct: 1, domain: "Psychology", difficulty: 80 },
    
    // Medium (40-69%)
    { questionText: "Who is known as the father of psychoanalysis?", options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Ivan Pavlov"], correct: 1, domain: "Psychology", difficulty: 65 },
    { questionText: "What is the placebo effect?", options: ["Drug addiction", "Improvement from belief in treatment", "Memory loss", "Sleep disorder"], correct: 1, domain: "Psychology", difficulty: 55 },
    { questionText: "What did Pavlov's dog experiments demonstrate?", options: ["Operant conditioning", "Classical conditioning", "Social learning", "Cognitive development"], correct: 1, domain: "Psychology", difficulty: 50 },
    { questionText: "What is REM sleep?", options: ["Deep sleep", "Rapid eye movement dream sleep", "Light sleep", "Sleepwalking"], correct: 1, domain: "Psychology", difficulty: 55 },
    { questionText: "What is an extrovert?", options: ["Shy person", "Outgoing person who gains energy from others", "Anxious person", "Depressed person"], correct: 1, domain: "Psychology", difficulty: 65 },
    { questionText: "What is short-term memory also called?", options: ["Long-term memory", "Working memory", "Sensory memory", "Episodic memory"], correct: 1, domain: "Psychology", difficulty: 45 },
    { questionText: "What is the fight-or-flight response?", options: ["Learning process", "Stress response to threat", "Sleep pattern", "Memory formation"], correct: 1, domain: "Psychology", difficulty: 55 },
    { questionText: "What is the id, ego, and superego model from?", options: ["Jung", "Freud", "Skinner", "Piaget"], correct: 1, domain: "Psychology", difficulty: 50 },
    
    // Hard (20-39%)
    { questionText: "What is cognitive dissonance?", options: ["Memory disorder", "Mental discomfort from conflicting beliefs", "Learning disability", "Attention deficit"], correct: 1, domain: "Psychology", difficulty: 35 },
    { questionText: "What is the Dunning-Kruger effect?", options: ["Memory bias", "Incompetent overestimating ability", "Group conformity", "Learned helplessness"], correct: 1, domain: "Psychology", difficulty: 30 },
    { questionText: "What is the Milgram experiment known for studying?", options: ["Memory", "Obedience to authority", "Learning", "Perception"], correct: 1, domain: "Psychology", difficulty: 35 },
    { questionText: "What is confirmation bias?", options: ["Memory loss", "Favoring information confirming beliefs", "Learning disability", "Attention disorder"], correct: 1, domain: "Psychology", difficulty: 40 },
    { questionText: "What is the Stanford Prison Experiment known for?", options: ["Memory research", "Role behavior and authority", "Learning studies", "Child development"], correct: 1, domain: "Psychology", difficulty: 35 },
    { questionText: "What is the bystander effect?", options: ["Memory phenomenon", "Less likely to help when others present", "Learning curve", "Sleep disorder"], correct: 1, domain: "Psychology", difficulty: 35 },
    { questionText: "What is operant conditioning?", options: ["Memory technique", "Learning through rewards and punishments", "Sleep training", "Anxiety treatment"], correct: 1, domain: "Psychology", difficulty: 40 },
    { questionText: "What is the Stroop effect?", options: ["Memory loss", "Interference in reaction time", "Learning curve", "Sleep pattern"], correct: 1, domain: "Psychology", difficulty: 30 },
    { questionText: "What is hindsight bias?", options: ["Future prediction", "Believing you knew outcome all along", "Memory enhancement", "Learning acceleration"], correct: 1, domain: "Psychology", difficulty: 35 },
    
    // Very Hard (5-19%)
    { questionText: "What is the 'cocktail party effect'?", options: ["Social anxiety", "Selective auditory attention", "Group dynamics", "Memory encoding"], correct: 1, domain: "Psychology", difficulty: 20 },
    { questionText: "What is anosognosia?", options: ["Fear of crowds", "Unawareness of own disability", "Memory loss", "Language disorder"], correct: 1, domain: "Psychology", difficulty: 10 },
    { questionText: "What is priming in psychology?", options: ["Memory storage", "Exposure influencing subsequent response", "Learning technique", "Sleep preparation"], correct: 1, domain: "Psychology", difficulty: 18 },
    { questionText: "What is the availability heuristic?", options: ["Memory technique", "Judging probability by ease of recall", "Learning method", "Problem-solving approach"], correct: 1, domain: "Psychology", difficulty: 15 },
    { questionText: "What is the mere exposure effect?", options: ["Overexposure", "Preference for familiar things", "Memory loss", "Learning curve"], correct: 1, domain: "Psychology", difficulty: 18 },
    { questionText: "What is the cocktail party problem in cognitive science?", options: ["Party planning", "Focusing on one voice among many", "Social anxiety", "Memory test"], correct: 1, domain: "Psychology", difficulty: 15 },

    // ============================================
    // SPORTS (25 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "How many players are on a soccer team on the field?", options: ["9", "10", "11", "12"], correct: 2, domain: "Sports", difficulty: 80 },
    { questionText: "What sport is played at Wimbledon?", options: ["Golf", "Cricket", "Tennis", "Rugby"], correct: 2, domain: "Sports", difficulty: 85 },
    { questionText: "How many rings are on the Olympic flag?", options: ["4", "5", "6", "7"], correct: 1, domain: "Sports", difficulty: 85 },
    { questionText: "What sport does Tiger Woods play?", options: ["Tennis", "Golf", "Basketball", "Baseball"], correct: 1, domain: "Sports", difficulty: 85 },
    { questionText: "How many players are on a basketball team on court?", options: ["4", "5", "6", "7"], correct: 1, domain: "Sports", difficulty: 75 },
    { questionText: "What sport is the Super Bowl associated with?", options: ["Baseball", "Basketball", "American Football", "Hockey"], correct: 2, domain: "Sports", difficulty: 80 },
    
    // Medium (40-69%)
    { questionText: "How many points is a touchdown worth in American football?", options: ["3", "6", "7", "4"], correct: 1, domain: "Sports", difficulty: 60 },
    { questionText: "In which country did the Olympic Games originate?", options: ["Italy", "Greece", "Egypt", "Turkey"], correct: 1, domain: "Sports", difficulty: 75 },
    { questionText: "What is the diameter of a basketball hoop in inches?", options: ["16", "18", "20", "22"], correct: 1, domain: "Sports", difficulty: 35 },
    { questionText: "How many Grand Slam tennis tournaments are there per year?", options: ["3", "4", "5", "6"], correct: 1, domain: "Sports", difficulty: 50 },
    { questionText: "What is the national sport of Japan?", options: ["Judo", "Sumo", "Karate", "Baseball"], correct: 1, domain: "Sports", difficulty: 45 },
    { questionText: "How many holes are in a standard round of golf?", options: ["9", "12", "18", "21"], correct: 2, domain: "Sports", difficulty: 70 },
    { questionText: "What is the Tour de France?", options: ["Car race", "Cycling race", "Running race", "Boat race"], correct: 1, domain: "Sports", difficulty: 65 },
    { questionText: "How many sets to win a men's tennis Grand Slam match?", options: ["2", "3", "4", "5"], correct: 1, domain: "Sports", difficulty: 50 },
    { questionText: "What is the penalty in soccer for a foul inside the box?", options: ["Free kick", "Penalty kick", "Corner kick", "Goal kick"], correct: 1, domain: "Sports", difficulty: 60 },
    
    // Hard (20-39%)
    { questionText: "How long is a marathon in miles?", options: ["24.2", "26.2", "28.2", "30.2"], correct: 1, domain: "Sports", difficulty: 50 },
    { questionText: "In golf, what is an albatross?", options: ["One under par", "Two under par", "Three under par", "Four under par"], correct: 2, domain: "Sports", difficulty: 30 },
    { questionText: "What is the only country to have played in every FIFA World Cup?", options: ["Germany", "Argentina", "Brazil", "Italy"], correct: 2, domain: "Sports", difficulty: 40 },
    { questionText: "How many players are on a rugby union team?", options: ["11", "13", "15", "17"], correct: 2, domain: "Sports", difficulty: 35 },
    { questionText: "What is the Ironman Triathlon order of events?", options: ["Run, Bike, Swim", "Swim, Bike, Run", "Bike, Swim, Run", "Swim, Run, Bike"], correct: 1, domain: "Sports", difficulty: 30 },
    { questionText: "What is the Fosbury Flop?", options: ["Swimming stroke", "High jump technique", "Gymnastics move", "Diving position"], correct: 1, domain: "Sports", difficulty: 35 },
    { questionText: "How long is an Olympic swimming pool in meters?", options: ["25", "50", "75", "100"], correct: 1, domain: "Sports", difficulty: 45 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Duckworth-Lewis method used for?", options: ["Tennis scoring", "Cricket rain-affected matches", "Golf handicapping", "Soccer offside"], correct: 1, domain: "Sports", difficulty: 20 },
    { questionText: "What is a shuttlecock used in?", options: ["Tennis", "Badminton", "Squash", "Racquetball"], correct: 1, domain: "Sports", difficulty: 60 },
    { questionText: "What is the yips in sports?", options: ["Celebration", "Anxiety-related loss of motor skills", "Injury type", "Training method"], correct: 1, domain: "Sports", difficulty: 15 },

    // ============================================
    // MEDICINE & HEALTH (25 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What is the largest bone in the human body?", options: ["Tibia", "Femur", "Humerus", "Pelvis"], correct: 1, domain: "Medicine", difficulty: 65 },
    { questionText: "How many chambers does the human heart have?", options: ["2", "3", "4", "5"], correct: 2, domain: "Medicine", difficulty: 70 },
    { questionText: "What vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"], correct: 2, domain: "Medicine", difficulty: 60 },
    { questionText: "What organ produces insulin?", options: ["Liver", "Kidney", "Pancreas", "Stomach"], correct: 2, domain: "Medicine", difficulty: 55 },
    { questionText: "How many teeth does an adult human have?", options: ["28", "30", "32", "34"], correct: 2, domain: "Medicine", difficulty: 60 },
    
    // Medium (40-69%)
    { questionText: "What type of blood cells fight infection?", options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], correct: 1, domain: "Medicine", difficulty: 65 },
    { questionText: "What is the medical term for high blood pressure?", options: ["Hypotension", "Hypertension", "Tachycardia", "Bradycardia"], correct: 1, domain: "Medicine", difficulty: 50 },
    { questionText: "What are the smallest blood vessels called?", options: ["Arteries", "Veins", "Capillaries", "Arterioles"], correct: 2, domain: "Medicine", difficulty: 55 },
    { questionText: "What is the main function of red blood cells?", options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce hormones"], correct: 1, domain: "Medicine", difficulty: 60 },
    { questionText: "What is the medical term for a heart attack?", options: ["Stroke", "Myocardial infarction", "Aneurysm", "Arrhythmia"], correct: 1, domain: "Medicine", difficulty: 40 },
    { questionText: "What does the liver primarily do?", options: ["Pump blood", "Process nutrients and filter blood", "Produce hormones", "Store fat"], correct: 1, domain: "Medicine", difficulty: 55 },
    { questionText: "What is the largest internal organ?", options: ["Heart", "Liver", "Lungs", "Kidney"], correct: 1, domain: "Medicine", difficulty: 55 },
    { questionText: "What is anemia?", options: ["High blood pressure", "Low red blood cell count", "High cholesterol", "Low blood sugar"], correct: 1, domain: "Medicine", difficulty: 50 },
    { questionText: "What part of the brain controls balance?", options: ["Cerebrum", "Cerebellum", "Brainstem", "Hippocampus"], correct: 1, domain: "Medicine", difficulty: 45 },
    
    // Hard (20-39%)
    { questionText: "What is the hippocampus responsible for?", options: ["Vision", "Memory formation", "Motor control", "Breathing"], correct: 1, domain: "Medicine", difficulty: 35 },
    { questionText: "What does an electroencephalogram (EEG) measure?", options: ["Heart activity", "Brain activity", "Muscle activity", "Lung function"], correct: 1, domain: "Medicine", difficulty: 40 },
    { questionText: "What is the function of insulin?", options: ["Digest proteins", "Regulate blood sugar", "Fight infection", "Clot blood"], correct: 1, domain: "Medicine", difficulty: 55 },
    { questionText: "What is sepsis?", options: ["Allergic reaction", "Body's extreme response to infection", "Vitamin deficiency", "Hormone imbalance"], correct: 1, domain: "Medicine", difficulty: 35 },
    { questionText: "What are antibiotics ineffective against?", options: ["Bacteria", "Viruses", "Fungi", "Parasites"], correct: 1, domain: "Medicine", difficulty: 50 },
    { questionText: "What is the thyroid gland responsible for?", options: ["Blood sugar", "Metabolism regulation", "Digestion", "Immune response"], correct: 1, domain: "Medicine", difficulty: 40 },
    { questionText: "What is the cornea?", options: ["Eye muscle", "Transparent front part of eye", "Retina", "Optic nerve"], correct: 1, domain: "Medicine", difficulty: 40 },
    
    // Very Hard (5-19%)
    { questionText: "What is the blood-brain barrier?", options: ["Skull protection", "Selective membrane protecting brain", "Pain receptor", "Memory storage"], correct: 1, domain: "Medicine", difficulty: 25 },
    { questionText: "What is apoptosis?", options: ["Cell division", "Programmed cell death", "Protein synthesis", "DNA replication"], correct: 1, domain: "Medicine", difficulty: 20 },
    { questionText: "What is the glymphatic system?", options: ["Lymph nodes", "Brain waste clearance system", "Blood type", "Immune cells"], correct: 1, domain: "Medicine", difficulty: 10 },
    { questionText: "What is the vagus nerve?", options: ["Leg nerve", "Cranial nerve controlling many organs", "Arm nerve", "Spinal nerve"], correct: 1, domain: "Medicine", difficulty: 20 },
    { questionText: "What is a cytokine storm?", options: ["Allergic reaction", "Overactive immune response", "Blood disorder", "Nerve damage"], correct: 1, domain: "Medicine", difficulty: 18 },

    // ============================================
    // LAW & POLITICS (25 questions)  
    // ============================================
    
    // Easy (70-84%)
    { questionText: "How many justices are on the US Supreme Court?", options: ["7", "9", "11", "13"], correct: 1, domain: "Politics", difficulty: 55 },
    { questionText: "What is the United Nations headquarters located?", options: ["Geneva", "New York", "London", "Paris"], correct: 1, domain: "Politics", difficulty: 60 },
    { questionText: "What is the right to vote called?", options: ["Habeas corpus", "Suffrage", "Amendment", "Veto"], correct: 1, domain: "Politics", difficulty: 55 },
    { questionText: "What is the term for the head of state in the United States?", options: ["Prime Minister", "President", "Chancellor", "King"], correct: 1, domain: "Politics", difficulty: 90 },
    { questionText: "What is NATO?", options: ["Trade agreement", "Military alliance", "Space agency", "Economic union"], correct: 1, domain: "Politics", difficulty: 60 },
    
    // Medium (40-69%)
    { questionText: "What document begins with 'We the People'?", options: ["Declaration of Independence", "US Constitution", "Bill of Rights", "Magna Carta"], correct: 1, domain: "Politics", difficulty: 65 },
    { questionText: "What is the European Union's currency?", options: ["Pound", "Euro", "Franc", "Mark"], correct: 1, domain: "Politics", difficulty: 75 },
    { questionText: "What is a filibuster?", options: ["A type of vote", "Delaying tactic in legislature", "Court ruling", "Executive order"], correct: 1, domain: "Politics", difficulty: 45 },
    { questionText: "What is separation of powers?", options: ["Federal vs state", "Division of government into branches", "International relations", "Electoral system"], correct: 1, domain: "Politics", difficulty: 55 },
    { questionText: "What is impeachment?", options: ["Removal from office", "Formal accusation against official", "Election fraud", "Court trial"], correct: 1, domain: "Politics", difficulty: 50 },
    { questionText: "What is the Bill of Rights?", options: ["Tax law", "First ten amendments to US Constitution", "Declaration of Independence", "Court ruling"], correct: 1, domain: "Politics", difficulty: 55 },
    { questionText: "What is a constitutional monarchy?", options: ["Absolute rule", "Monarch with limited powers by constitution", "Republic", "Dictatorship"], correct: 1, domain: "Politics", difficulty: 50 },
    { questionText: "What is gerrymandering?", options: ["Voting fraud", "Manipulating electoral boundaries", "Campaign financing", "Lobbying"], correct: 1, domain: "Politics", difficulty: 40 },
    { questionText: "What is the Geneva Convention about?", options: ["Trade agreements", "Treatment of war prisoners", "Climate change", "Nuclear weapons"], correct: 1, domain: "Law", difficulty: 45 },
    
    // Hard (20-39%)
    { questionText: "What is habeas corpus?", options: ["Property rights", "Right to fair trial", "Protection against unlawful detention", "Freedom of speech"], correct: 2, domain: "Law", difficulty: 35 },
    { questionText: "What is the principle of 'stare decisis'?", options: ["Jury selection", "Following precedent", "Burden of proof", "Double jeopardy"], correct: 1, domain: "Law", difficulty: 20 },
    { questionText: "What is mens rea?", options: ["Physical act", "Guilty mind/criminal intent", "Evidence", "Verdict"], correct: 1, domain: "Law", difficulty: 25 },
    { questionText: "What is the difference between civil and criminal law?", options: ["Same thing", "Individual disputes vs state prosecution", "Federal vs state", "Written vs oral"], correct: 1, domain: "Law", difficulty: 40 },
    { questionText: "What is judicial review?", options: ["Jury selection", "Court power to review laws for constitutionality", "Appeal process", "Sentencing guidelines"], correct: 1, domain: "Law", difficulty: 35 },
    { questionText: "What is the principle of sovereignty?", options: ["King's rule", "State's supreme authority within its territory", "International law", "Human rights"], correct: 1, domain: "Politics", difficulty: 30 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Westphalian system in international relations?", options: ["Trade agreement", "Sovereign nation-states system", "Military alliance", "Human rights framework"], correct: 1, domain: "Politics", difficulty: 15 },
    { questionText: "What is 'jus cogens' in international law?", options: ["Treaty law", "Peremptory norms", "Customary law", "Diplomatic immunity"], correct: 1, domain: "Law", difficulty: 8 },
    { questionText: "What is the doctrine of parliamentary sovereignty?", options: ["Judicial review", "Parliament can make any law", "Executive power", "Federalism"], correct: 1, domain: "Politics", difficulty: 15 },
    { questionText: "What is the Responsibility to Protect (R2P)?", options: ["Trade policy", "International norm for humanitarian intervention", "Environmental law", "Economic sanction"], correct: 1, domain: "Politics", difficulty: 12 },
    { questionText: "What is the Marbury v. Madison case famous for?", options: ["Free speech", "Establishing judicial review in US", "Civil rights", "Gun rights"], correct: 1, domain: "Law", difficulty: 20 },

    // ============================================
    // LINGUISTICS & LANGUAGE (20 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What is the most spoken language in the world by total speakers?", options: ["Spanish", "English", "Mandarin", "Hindi"], correct: 1, domain: "Linguistics", difficulty: 60 },
    { questionText: "What language family does English belong to?", options: ["Romance", "Germanic", "Slavic", "Celtic"], correct: 1, domain: "Linguistics", difficulty: 50 },
    { questionText: "What is the study of meaning in language called?", options: ["Syntax", "Phonology", "Semantics", "Morphology"], correct: 2, domain: "Linguistics", difficulty: 40 },
    
    // Medium (40-69%)
    { questionText: "What is a palindrome?", options: ["Long word", "Word/phrase same forwards and backwards", "Silent letter", "Compound word"], correct: 1, domain: "Linguistics", difficulty: 55 },
    { questionText: "What is the International Phonetic Alphabet (IPA) used for?", options: ["Coding", "Representing speech sounds", "Music notation", "Sign language"], correct: 1, domain: "Linguistics", difficulty: 40 },
    { questionText: "What is an onomatopoeia?", options: ["Metaphor", "Word that imitates a sound", "Rhyme", "Alliteration"], correct: 1, domain: "Linguistics", difficulty: 50 },
    { questionText: "What is the difference between syntax and grammar?", options: ["Same thing", "Syntax is sentence structure within grammar", "Grammar is older", "Syntax is newer"], correct: 1, domain: "Linguistics", difficulty: 35 },
    { questionText: "What is etymology?", options: ["Insect study", "Study of word origins", "Grammar rules", "Pronunciation"], correct: 1, domain: "Linguistics", difficulty: 45 },
    { questionText: "What is a cognate?", options: ["Brain part", "Words with common origin in different languages", "Grammar rule", "Sentence type"], correct: 1, domain: "Linguistics", difficulty: 35 },
    { questionText: "What is the subject-verb-object word order called?", options: ["SVO", "SOV", "VSO", "OVS"], correct: 0, domain: "Linguistics", difficulty: 40 },
    
    // Hard (20-39%)
    { questionText: "What is the Sapir-Whorf hypothesis?", options: ["Grammar theory", "Language influences thought", "Sound patterns", "Writing systems"], correct: 1, domain: "Linguistics", difficulty: 20 },
    { questionText: "What is a phoneme?", options: ["Letter", "Smallest distinctive sound unit", "Word", "Sentence"], correct: 1, domain: "Linguistics", difficulty: 30 },
    { questionText: "What is a morpheme?", options: ["Sound unit", "Smallest meaningful unit", "Sentence structure", "Writing system"], correct: 1, domain: "Linguistics", difficulty: 30 },
    { questionText: "What is code-switching?", options: ["Computer programming", "Alternating between languages/dialects", "Writing code", "Encryption"], correct: 1, domain: "Linguistics", difficulty: 30 },
    { questionText: "What is a creole language?", options: ["French dialect", "Stable language developed from pidgin", "Ancient language", "Sign language"], correct: 1, domain: "Linguistics", difficulty: 25 },
    
    // Very Hard (5-19%)
    { questionText: "What is the Great Vowel Shift?", options: ["Singing technique", "Major sound change in English pronunciation", "Dialect variation", "Modern slang"], correct: 1, domain: "Linguistics", difficulty: 15 },
    { questionText: "What is ergativity?", options: ["Verb tense", "Grammatical pattern treating transitive subjects differently", "Word order", "Pronoun system"], correct: 1, domain: "Linguistics", difficulty: 8 },
    { questionText: "What is a phonological process?", options: ["Writing system", "Systematic sound change", "Grammar rule", "Vocabulary"], correct: 1, domain: "Linguistics", difficulty: 18 },
    { questionText: "What is polysynthesis?", options: ["Chemical process", "Complex word formation in some languages", "Simple grammar", "Writing system"], correct: 1, domain: "Linguistics", difficulty: 10 },
    { questionText: "What is Grimm's Law about?", options: ["Fairy tales", "Systematic sound changes in Germanic languages", "Grammar rules", "Writing systems"], correct: 1, domain: "Linguistics", difficulty: 12 },

    // ============================================
    // FOOD & CUISINE (20 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What country is pizza originally from?", options: ["France", "Spain", "Italy", "Greece"], correct: 2, domain: "Food", difficulty: 90 },
    { questionText: "What is sushi typically made with?", options: ["Rice and fish", "Noodles", "Bread", "Potatoes"], correct: 0, domain: "Food", difficulty: 85 },
    { questionText: "What is the main ingredient in guacamole?", options: ["Tomato", "Avocado", "Pepper", "Onion"], correct: 1, domain: "Food", difficulty: 85 },
    { questionText: "What country is curry most associated with?", options: ["China", "Japan", "India", "Thailand"], correct: 2, domain: "Food", difficulty: 75 },
    
    // Medium (40-69%)
    { questionText: "What is the French term for a chef's tall white hat?", options: ["Beret", "Toque", "Chapeau", "Bonnet"], correct: 1, domain: "Food", difficulty: 35 },
    { questionText: "What gives bread its rise?", options: ["Salt", "Sugar", "Yeast", "Flour"], correct: 2, domain: "Food", difficulty: 65 },
    { questionText: "What is umami?", options: ["Spicy taste", "Fifth basic taste (savory)", "Sweet taste", "Sour taste"], correct: 1, domain: "Food", difficulty: 45 },
    { questionText: "What is paella named after?", options: ["Chef", "The pan it's cooked in", "Region", "Main ingredient"], correct: 1, domain: "Food", difficulty: 35 },
    { questionText: "What is the main ingredient in hummus?", options: ["Lentils", "Chickpeas", "Beans", "Peas"], correct: 1, domain: "Food", difficulty: 60 },
    { questionText: "What is tempering in chocolate making?", options: ["Melting", "Controlled heating and cooling", "Adding sugar", "Mixing"], correct: 1, domain: "Food", difficulty: 35 },
    { questionText: "What is the Maillard reaction?", options: ["Fermentation", "Browning reaction when cooking", "Freezing process", "Dehydration"], correct: 1, domain: "Food", difficulty: 30 },
    { questionText: "What is a roux used for?", options: ["Flavoring", "Thickening sauces", "Coloring", "Preserving"], correct: 1, domain: "Food", difficulty: 40 },
    
    // Hard (20-39%)
    { questionText: "What is dashi?", options: ["Chinese soup", "Japanese stock made from kelp and fish", "Korean sauce", "Thai curry"], correct: 1, domain: "Food", difficulty: 30 },
    { questionText: "What is the mother sauce from which many others derive?", options: ["Ketchup", "Béchamel", "Soy sauce", "Gravy"], correct: 1, domain: "Food", difficulty: 25 },
    { questionText: "What is sous vide cooking?", options: ["High heat", "Vacuum-sealed slow cooking in water", "Open flame", "Pressure cooking"], correct: 1, domain: "Food", difficulty: 35 },
    { questionText: "What is the Scoville scale used to measure?", options: ["Sweetness", "Spiciness/heat of peppers", "Acidity", "Saltiness"], correct: 1, domain: "Food", difficulty: 40 },
    
    // Very Hard (5-19%)
    { questionText: "What is 'mise en place'?", options: ["Table setting", "Having all ingredients prepared before cooking", "Menu planning", "Restaurant layout"], correct: 1, domain: "Food", difficulty: 30 },
    { questionText: "What is spherification in molecular gastronomy?", options: ["Freezing", "Forming liquid into sphere", "Dehydration", "Fermentation"], correct: 1, domain: "Food", difficulty: 15 },
    { questionText: "What is the French laundry technique?", options: ["Washing vegetables", "Slow poaching method", "Thomas Keller's restaurant and its techniques", "Drying herbs"], correct: 2, domain: "Food", difficulty: 12 },
    { questionText: "What is kokumi?", options: ["Japanese knife", "Taste enhancing compounds", "Rice variety", "Cooking technique"], correct: 1, domain: "Food", difficulty: 8 },

    // ============================================
    // WORLD CULTURE & ANTHROPOLOGY (20 questions)
    // ============================================
    
    // Easy (70-84%)
    { questionText: "What is the traditional Japanese art of paper folding called?", options: ["Ikebana", "Origami", "Bonsai", "Kabuki"], correct: 1, domain: "Culture", difficulty: 80 },
    { questionText: "What is the traditional greeting in Japan?", options: ["Handshake", "Bow", "Hug", "Wave"], correct: 1, domain: "Culture", difficulty: 75 },
    { questionText: "What is Día de los Muertos?", options: ["Christmas", "Day of the Dead celebration", "New Year", "Independence Day"], correct: 1, domain: "Culture", difficulty: 65 },
    
    // Medium (40-69%)
    { questionText: "What is a kimono?", options: ["Chinese food", "Traditional Japanese garment", "Martial art", "Musical instrument"], correct: 1, domain: "Culture", difficulty: 70 },
    { questionText: "What is the traditional Maori greeting?", options: ["Handshake", "Hongi (pressing noses)", "Bow", "Wave"], correct: 1, domain: "Culture", difficulty: 40 },
    { questionText: "What is Carnival most famously celebrated in?", options: ["New York", "Rio de Janeiro", "London", "Tokyo"], correct: 1, domain: "Culture", difficulty: 65 },
    { questionText: "What is a pagoda?", options: ["Clothing", "Multi-tiered Asian tower", "Food", "Dance"], correct: 1, domain: "Culture", difficulty: 55 },
    { questionText: "What is the significance of the lotus flower in Eastern cultures?", options: ["Good luck", "Purity and enlightenment", "Wealth", "Power"], correct: 1, domain: "Culture", difficulty: 45 },
    { questionText: "What is a haiku?", options: ["Martial art", "Japanese three-line poem", "Food", "Clothing"], correct: 1, domain: "Culture", difficulty: 60 },
    { questionText: "What is Holi?", options: ["Jewish holiday", "Hindu festival of colors", "Chinese New Year", "Muslim celebration"], correct: 1, domain: "Culture", difficulty: 50 },
    { questionText: "What is the significance of dreamcatchers?", options: ["African tradition", "Native American filter for dreams", "Asian art", "European craft"], correct: 1, domain: "Culture", difficulty: 55 },
    
    // Hard (20-39%)
    { questionText: "What is ubuntu in African philosophy?", options: ["Software", "I am because we are (humanity)", "Dance", "Food"], correct: 1, domain: "Culture", difficulty: 30 },
    { questionText: "What is wabi-sabi?", options: ["Japanese food", "Japanese aesthetic of imperfection", "Martial art", "Garden style"], correct: 1, domain: "Culture", difficulty: 25 },
    { questionText: "What is a potlatch?", options: ["Cooking pot", "Pacific Northwest gift-giving ceremony", "African dance", "Asian festival"], correct: 1, domain: "Culture", difficulty: 20 },
    { questionText: "What is the concept of 'face' in Asian cultures?", options: ["Beauty", "Social standing and respect", "Mask", "Makeup"], correct: 1, domain: "Culture", difficulty: 35 },
    
    // Very Hard (5-19%)
    { questionText: "What is the anthropological concept of liminality?", options: ["Language study", "Transitional state between phases", "Marriage customs", "Food preparation"], correct: 1, domain: "Culture", difficulty: 12 },
    { questionText: "What is kintsugi?", options: ["Sword fighting", "Japanese art of repairing with gold", "Tea ceremony", "Calligraphy"], correct: 1, domain: "Culture", difficulty: 25 },
    { questionText: "What is cultural relativism?", options: ["Everything is relative", "Understanding cultures in their own context", "Cultural superiority", "Language study"], correct: 1, domain: "Culture", difficulty: 20 },
    { questionText: "What is the moka exchange in Papua New Guinea?", options: ["Currency", "Competitive gift-giving system", "Dance", "Food sharing"], correct: 1, domain: "Culture", difficulty: 8 },
    { questionText: "What is hygge?", options: ["Danish word for cozy contentment", "Swedish dance", "Norwegian food", "Finnish sauna"], correct: 0, domain: "Culture", difficulty: 35 },
];

// Helper function to get questions by difficulty range
export const getQuestionsByDifficulty = (minDiff: number, maxDiff: number): KnowledgeQuestion[] => {
    return KNOWLEDGE_QUESTION_BANK.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
};

// Helper function to get questions by domain
export const getQuestionsByDomain = (domain: string): KnowledgeQuestion[] => {
    return KNOWLEDGE_QUESTION_BANK.filter(q => q.domain.toLowerCase() === domain.toLowerCase());
};

// Get a random subset of questions avoiding duplicates
export const getRandomQuestions = (count: number, excludeQuestions: string[] = []): KnowledgeQuestion[] => {
    const available = KNOWLEDGE_QUESTION_BANK.filter(q => !excludeQuestions.includes(q.questionText));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Get adaptive question based on current difficulty level
export const getAdaptiveQuestion = (targetDifficulty: number, usedQuestions: string[]): KnowledgeQuestion | null => {
    const available = KNOWLEDGE_QUESTION_BANK.filter(q => !usedQuestions.includes(q.questionText));
    if (available.length === 0) return null;
    
    // Sort by how close to target difficulty
    const sorted = available.sort((a, b) => 
        Math.abs(a.difficulty - targetDifficulty) - Math.abs(b.difficulty - targetDifficulty)
    );
    
    // Pick from top 5 closest for variety
    const topCandidates = sorted.slice(0, Math.min(5, sorted.length));
    return topCandidates[Math.floor(Math.random() * topCandidates.length)];
};

// Get domain distribution for balanced testing
export const getDomainDistribution = (): Record<string, number> => {
    const distribution: Record<string, number> = {};
    KNOWLEDGE_QUESTION_BANK.forEach(q => {
        distribution[q.domain] = (distribution[q.domain] || 0) + 1;
    });
    return distribution;
};
