import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  HelpCircle, 
  Volume2, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Languages, 
  Compass, 
  MapPin, 
  Ticket, 
  Heart, 
  Info, 
  List, 
  ArrowRightLeft, 
  Award, 
  BookOpenCheck,
  Search,
  VolumeX,
  Sparkle,
  GraduationCap,
  Play,
  Shuffle,
  Volume1,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  READING_TITLE_ES, 
  READING_TITLE_HY, 
  READING_SENTENCES, 
  QUIZ_QUESTIONS, 
  FUN_FACTS,
  SentenceItem,
  QuizQuestion,
  VocabularyItem
} from "./data";

export default function App() {
  // Navigation & General state
  const [activeTab, setActiveTab] = useState<"reader" | "quiz" | "vocabulary" | "game">("reader");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [expandedSentenceId, setExpandedSentenceId] = useState<number | null>(1);
  
  // Audio Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // slightly slower for learners

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<{questionId: number, isCorrect: boolean, selected: string}[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizTranslation, setShowQuizTranslation] = useState(false);

  // Vocabulary Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [vocabFilter, setVocabFilter] = useState<string>("todos");

  // Vocabulary Match Game state
  const [gameWords, setGameWords] = useState<{ id: string; text: string; lang: "es" | "hy"; matchKey: string }[]>([]);
  const [selectedGameCard, setSelectedGameCard] = useState<string | null>(null);
  const [matchedGameKeys, setMatchedGameKeys] = useState<string[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameMoves, setGameMoves] = useState(0);
  const [wrongMatchFlash, setWrongMatchFlash] = useState<{ card1: string; card2: string } | null>(null);

  // Text highlighting utility
  const highlightSpanishText = (sentence: SentenceItem) => {
    let text = sentence.spanish;
    // We want to highlight the specific phrases defined in highlightedWords
    if (!sentence.highlightedWords || sentence.highlightedWords.length === 0) {
      return <span>{text}</span>;
    }

    // Sort highlighted words by length descending to avoid partial matches on nested words
    const sortedHighlights = [...sentence.highlightedWords].sort((a, b) => b.length - a.length);
    
    // Create a regular expression to split by highlights
    const escapedWords = sortedHighlights.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, index) => {
          const isHighlighted = sortedHighlights.some(
            highlight => highlight.toLowerCase() === part.toLowerCase()
          );
          
          if (isHighlighted) {
            // Find vocabulary item for this highlighted word/phrase
            const vocabInfo = sentence.vocabulary.find(
              v => v.word.toLowerCase().includes(part.toLowerCase()) || part.toLowerCase().includes(v.word.toLowerCase())
            );

            return (
              <span
                key={index}
                className="relative inline-block px-1.5 py-0.5 rounded-md font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border-b-2 border-amber-400 cursor-help transition-all duration-200 group/word"
                title={vocabInfo ? vocabInfo.translation : "Մանրամասն"}
              >
                {part}
                {vocabInfo && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover/word:block bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl z-30 font-sans leading-relaxed pointer-events-none">
                    <span className="block font-bold text-amber-300 font-display mb-0.5">{vocabInfo.word}</span>
                    <span className="block text-slate-300 italic text-[10px] mb-1">{vocabInfo.type}</span>
                    <span className="block border-t border-slate-700 pt-1 text-slate-100">{vocabInfo.translation}</span>
                  </span>
                )}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  // Text to Speech
  const speakSpanish = (text: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!("speechSynthesis" in window)) {
      alert("К сожалению, ваш браузер не поддерживает синтез речи. / Ցավոք, ձեր բրաուզերը չի աջակցում ձայնի սինթեզ։");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    if (isSpeaking === text) {
      setIsSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = speechRate;

    utterance.onend = () => {
      setIsSpeaking(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    setIsSpeaking(text);
    window.speechSynthesis.speak(utterance);
  };

  // Handle active speech cancellation on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter sentences based on search
  const filteredSentences = READING_SENTENCES.filter(sentence => {
    const query = searchQuery.toLowerCase();
    return (
      sentence.spanish.toLowerCase().includes(query) ||
      sentence.armenian.toLowerCase().includes(query) ||
      sentence.vocabulary.some(v => v.word.toLowerCase().includes(query) || v.translation.toLowerCase().includes(query))
    );
  });

  // Extract all unique vocabulary words for the Vocabulary tab
  const allVocabList: { spanish: string; armenian: string; type: string; sentenceContext: string }[] = [];
  READING_SENTENCES.forEach(s => {
    s.vocabulary.forEach(v => {
      // Avoid exact duplicate spanish entries
      if (!allVocabList.some(item => item.spanish.toLowerCase() === v.word.toLowerCase())) {
        allVocabList.push({
          spanish: v.word,
          armenian: v.translation,
          type: v.type,
          sentenceContext: s.spanish
        });
      }
    });
  });

  // Initialize Word Match Game
  const startMatchGame = () => {
    // Select 6 random vocabulary items
    const shuffledVocab = [...allVocabList].sort(() => 0.5 - Math.random());
    const selectedVocab = shuffledVocab.slice(0, 6);

    const cards: { id: string; text: string; lang: "es" | "hy"; matchKey: string }[] = [];
    selectedVocab.forEach((vocab, i) => {
      // Clean up armenian text for game display (extract only the armenian translation, removing the english helper in parentheses)
      const cleanArmenian = vocab.armenian.split("(")[0].trim();
      const matchKey = `pair-${i}`;
      
      cards.push({
        id: `es-${i}`,
        text: vocab.spanish,
        lang: "es",
        matchKey
      });
      cards.push({
        id: `hy-${i}`,
        text: cleanArmenian,
        lang: "hy",
        matchKey
      });
    });

    // Shuffle the 12 cards
    setGameWords(cards.sort(() => 0.5 - Math.random()));
    setMatchedGameKeys([]);
    setSelectedGameCard(null);
    setGameMoves(0);
    setGameCompleted(false);
    setWrongMatchFlash(null);
  };

  // Start game on tab switch
  useEffect(() => {
    if (activeTab === "game") {
      startMatchGame();
    }
  }, [activeTab]);

  // Handle Game Card Click
  const handleGameCardClick = (cardId: string, matchKey: string) => {
    if (matchedGameKeys.includes(matchKey) || wrongMatchFlash) return;

    if (selectedGameCard === null) {
      setSelectedGameCard(cardId);
    } else {
      // Second card clicked
      if (selectedGameCard === cardId) {
        // clicked the same card, deselect
        setSelectedGameCard(null);
        return;
      }

      const firstCard = gameWords.find(w => w.id === selectedGameCard);
      const secondCard = gameWords.find(w => w.id === cardId);

      if (!firstCard || !secondCard) return;

      setGameMoves(prev => prev + 1);

      // Check if they are a pair and different languages
      if (firstCard.matchKey === secondCard.matchKey && firstCard.lang !== secondCard.lang) {
        // Correct pair!
        setMatchedGameKeys(prev => [...prev, firstCard.matchKey]);
        setSelectedGameCard(null);
        
        // Check if game is completed
        if (matchedGameKeys.length + 1 === 6) {
          setGameCompleted(true);
        }
      } else {
        // Wrong Match! Trigger flash red then reset
        setWrongMatchFlash({ card1: firstCard.id, card2: secondCard.id });
        setTimeout(() => {
          setWrongMatchFlash(null);
          setSelectedGameCard(null);
        }, 1000);
      }
    }
  };

  // Handle Quiz selection
  const handleOptionSelect = (optionId: string) => {
    if (quizSubmitted) return;
    setSelectedOptionId(optionId);
  };

  // Submit quiz answer
  const handleQuizSubmit = () => {
    if (!selectedOptionId || quizSubmitted) return;

    const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setQuizHistory(prev => [
      ...prev,
      { questionId: currentQuestion.id, isCorrect, selected: selectedOptionId }
    ]);

    setQuizSubmitted(true);
  };

  // Go to next question or complete
  const handleNextQuiz = () => {
    setSelectedOptionId(null);
    setQuizSubmitted(false);
    setShowQuizTranslation(false);

    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Restart Quiz
  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOptionId(null);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizHistory([]);
    setQuizCompleted(false);
    setShowQuizTranslation(false);
  };

  // Toggle single card flip
  const toggleCardFlip = (spanishWord: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [spanishWord]: !prev[spanishWord]
    }));
  };

  return (
    <div className="min-h-screen bg-vibrant-bg flex flex-col justify-between p-3 sm:p-5 lg:p-8">
      
      {/* HEADER SECTION */}
      <header className="max-w-7xl w-full mx-auto mb-6">
        <div className="bg-gradient-to-br from-vibrant-primary to-vibrant-primary-light text-white p-6 sm:p-8 rounded-[32px] shadow-lg shadow-indigo-600/15 border border-indigo-400/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Title / Logo */}
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-vibrant-secondary text-slate-950 rounded-2xl shadow-lg shadow-amber-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white flex flex-wrap items-center gap-2.5">
                <span>Una visita por la ciudad</span>
                <span className="text-xs font-mono font-extrabold px-3 py-1 bg-vibrant-secondary text-slate-950 rounded-full">ES ⇄ AM</span>
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">
                Այցելություն քաղաքում — Ինտերակտիվ ուսումնական ուղեցույց
              </p>
            </div>
          </div>

          {/* Quick Status Pill / Stats */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl text-white text-xs font-bold">
              <BookOpenCheck className="w-4 h-4 text-vibrant-secondary" />
              <span>17 նախադասություն</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl text-white text-xs font-bold">
              <HelpCircle className="w-4 h-4 text-indigo-300" />
              <span>{quizHistory.length}/5 Վիկտորինա</span>
            </div>
            {quizScore > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-vibrant-accent border border-emerald-400 text-white rounded-xl text-xs font-bold shadow-sm animate-pulse">
                <Award className="w-4 h-4" />
                <span>Ճիշտ՝ {quizScore}</span>
              </div>
            )}
          </div>

        </div>
        
        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 mt-5 bg-white/70 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
          <button
            onClick={() => setActiveTab("reader")}
            className={`flex-1 min-w-[125px] py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "reader"
                ? "bg-vibrant-primary text-white shadow-md shadow-indigo-600/15"
                : "text-slate-600 hover:text-vibrant-primary hover:bg-white/80"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Տեքստ և Թարգմանություն</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 min-w-[125px] py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "quiz"
                ? "bg-vibrant-primary text-white shadow-md shadow-indigo-600/15"
                : "text-slate-600 hover:text-vibrant-primary hover:bg-white/80"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Վիկտորինա (Quiz)</span>
          </button>
          <button
            onClick={() => setActiveTab("vocabulary")}
            className={`flex-1 min-w-[125px] py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "vocabulary"
                ? "bg-vibrant-primary text-white shadow-md shadow-indigo-600/15"
                : "text-slate-600 hover:text-vibrant-primary hover:bg-white/80"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Բառարան (Cards)</span>
          </button>
          <button
            onClick={() => setActiveTab("game")}
            className={`flex-1 min-w-[125px] py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "game"
                ? "bg-vibrant-primary text-white shadow-md shadow-indigo-600/15"
                : "text-slate-600 hover:text-vibrant-primary hover:bg-white/80"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Խաղալ (Match Game)</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-4">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE READER */}
          {activeTab === "reader" && (
            <motion.div
              key="reader-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* Left Column: Reader controls and Sentences list */}
              <div className="lg:col-span-8 bg-white rounded-[32px] p-5 sm:p-6 shadow-md border-4 border-slate-200 space-y-4">
                
                {/* Control bar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Փնտրել բառ կամ նախադասություն..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-vibrant-primary focus:border-vibrant-primary transition-all duration-200"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        Ջնջել
                      </button>
                    )}
                  </div>

                  {/* Toggle view controls */}
                  <div className="flex items-center gap-2">
                    {/* Audio Speed Selector */}
                    <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl text-xs">
                      <span className="text-slate-500 px-1 font-bold">Արագություն:</span>
                      <button
                        onClick={() => setSpeechRate(0.65)}
                        className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${speechRate === 0.65 ? "bg-white font-bold text-vibrant-primary shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                        title="Մեղմ / Դանդաղ"
                      >
                        Դանդաղ
                      </button>
                      <button
                        onClick={() => setSpeechRate(0.85)}
                        className={`px-2.5 py-1 rounded-lg transition-all font-semibold ${speechRate === 0.85 ? "bg-white font-bold text-vibrant-primary shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                        title="Սովորական"
                      >
                        Նորմալ
                      </button>
                    </div>

                    <button
                      onClick={() => setShowAllTranslations(!showAllTranslations)}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-vibrant-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{showAllTranslations ? "Թաքցնել" : "Ցույց տալ բոլորը"}</span>
                    </button>
                  </div>

                </div>

                {/* Sentences Cards container */}
                <div className="space-y-3.5">
                  {filteredSentences.length === 0 ? (
                    <div className="bg-slate-50 p-12 text-center rounded-2xl border border-slate-100 text-slate-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">Ոչինչ չի գտնվել ձեր որոնմամբ։</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-xs text-vibrant-primary font-bold hover:underline"
                      >
                        Մաքրել որոնումը
                      </button>
                    </div>
                  ) : (
                    filteredSentences.map((sentence) => {
                      const isExpanded = expandedSentenceId === sentence.id || showAllTranslations;
                      return (
                        <div
                          key={sentence.id}
                          id={`sentence-${sentence.id}`}
                          onClick={() => setExpandedSentenceId(expandedSentenceId === sentence.id ? null : sentence.id)}
                          className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                            isExpanded 
                              ? "border-vibrant-primary shadow-md translate-y-[-2px] border-l-8" 
                              : "border-slate-100/80 hover:bg-[#EEF2FF] hover:border-vibrant-primary hover:translate-y-[-2px]"
                          }`}
                        >
                          <div className="p-4 sm:p-5">
                            
                            {/* Card Top: Number and Speak Button */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-400">
                                Նախադասություն {sentence.id} / 17
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => speakSpanish(sentence.spanish, e)}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    isSpeaking === sentence.spanish
                                      ? "bg-rose-100 text-rose-600 animate-pulse"
                                      : "bg-slate-100 hover:bg-vibrant-primary/10 text-slate-500 hover:text-vibrant-primary"
                                  }`}
                                  title="Լսել իսպաներեն արտասանությունը"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Spanish Text (Main) */}
                            <div className="text-base sm:text-lg text-slate-900 leading-relaxed font-semibold font-display">
                              {highlightSpanishText(sentence)}
                            </div>

                            {/* Clicking invitation helper (if collapsed) */}
                            {!isExpanded && (
                              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium italic">
                                <Languages className="w-3 h-3 text-vibrant-primary" />
                                <span>Սեղմեք՝ թարգմանությունը և բառապաշարը տեսնելու համար</span>
                              </div>
                            )}

                            {/* Expandable section */}
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 pt-3.5 border-t border-slate-100 space-y-4"
                                >
                                  {/* Armenian Translation */}
                                  <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border-l-4 border-vibrant-secondary">
                                    <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed italic">
                                      {sentence.armenian}
                                    </p>
                                  </div>

                                  {/* Sentence Vocabulary highlights */}
                                  {sentence.vocabulary && sentence.vocabulary.length > 0 && (
                                    <div>
                                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                                        <List className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Բառարան այս նախադասությունից:</span>
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {sentence.vocabulary.map((vocab, idx) => (
                                          <div 
                                            key={idx} 
                                            className="p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/50 rounded-xl flex flex-col justify-center transition-all"
                                          >
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="font-semibold text-xs text-slate-950 font-display">
                                                {vocab.word}
                                              </span>
                                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold">
                                                {vocab.type}
                                              </span>
                                            </div>
                                            <span className="text-xs text-slate-600 mt-0.5 font-medium">
                                              {vocab.translation}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

              {/* Right Column: Mini-Map and Cultural Fun Facts */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Visual Guide Card */}
                <div className="bg-white p-6 rounded-[32px] border-4 border-slate-200 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-vibrant-secondary" />
                    <h3 className="font-extrabold font-display text-slate-900 text-base">Մեր Երթուղին</h3>
                  </div>

                  <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
                    Հետևեք պատմության հերթականությանը։ Զբոսանքը սկսվում է փողոցով, բարձրանում, անցնում հրապարակ, այգի, հայտնի հուշարձան, թանգարան և վերադառնում կենտրոն։
                  </p>

                  {/* Route progress visual */}
                  <div className="space-y-4 relative pl-3.5 border-l-2 border-dashed border-indigo-200">
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-vibrant-secondary ring-4 ring-amber-100" />
                      <span className="text-xs font-bold text-slate-900 block font-display">1. Calle y Plaza (Փողոց և Հրապարակ)</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Նախադասություններ 1-5</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-vibrant-secondary ring-4 ring-amber-100" />
                      <span className="text-xs font-bold text-slate-900 block font-display">2. El Parque y Monumento (Այգի և Հուշարձան)</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Նախադասություններ 6-9</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-vibrant-secondary ring-4 ring-amber-100" />
                      <span className="text-xs font-bold text-slate-900 block font-display">3. El Museo (Թանգարան)</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Նախադասություններ 10-14</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-vibrant-accent ring-4 ring-emerald-100" />
                      <span className="text-xs font-bold text-slate-900 block font-display">4. Cafetería y Retorno (Սրճարան և Վերադարձ)</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Նախադասություններ 15-17</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Բարձր արտասանություն:</span>
                    <span className="font-bold text-vibrant-primary bg-indigo-50 px-2 py-0.5 rounded-md">Speech Synthesis</span>
                  </div>
                </div>

                {/* Fun Facts Accordion */}
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden border border-slate-800">
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-vibrant-secondary" />
                    <h3 className="font-extrabold font-display text-white text-base">Մշակութային Փաստեր</h3>
                  </div>

                  <div className="space-y-4">
                    {FUN_FACTS.map((fact, idx) => (
                      <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-vibrant-secondary block font-display">
                          {fact.titleEs} / {fact.titleHy}
                        </span>
                        <p className="text-[11px] text-slate-200 mt-1 leading-relaxed font-medium">
                          {fact.descriptionHy}
                        </p>
                        <p className="text-[10px] text-indigo-200/80 italic mt-0.5 leading-relaxed">
                          {fact.descriptionEs}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Start Quiz callout */}
                <div className="bg-white border-4 border-slate-200 p-6 rounded-[32px] flex items-start gap-3.5 shadow-md">
                  <div className="p-2.5 bg-indigo-50 text-vibrant-primary rounded-2xl">
                    <GraduationCap className="w-6 h-6 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 font-display">Պատրա՞ստ եք վիկտորինային։</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                      Կարդացե՞լ եք ամբողջ տեքստը և սովորել բառերը։ Ստուգեք ձեր գիտելիքները ինտերակտիվ վիկտորինայով:
                    </p>
                    <button
                      onClick={() => setActiveTab("quiz")}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-vibrant-primary hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <span>Սկսել վիկտորինան</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE QUIZ */}
          {activeTab === "quiz" && (
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              {!quizCompleted ? (
                <div className="bg-white rounded-[32px] border-4 border-slate-200 shadow-lg overflow-hidden">
                  
                  {/* Quiz Header & Progress */}
                  <div className="bg-vibrant-primary text-white p-5 sm:p-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold tracking-widest text-vibrant-secondary uppercase">
                        ՀԱՐՑԱՇԱՐ / CUESTIONARIO
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5">Ստուգեք Ձեր Գիտելիքները</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-md text-vibrant-secondary font-bold">
                        Հարց {currentQuizIndex + 1} / 5
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-2">
                    <div 
                      className="bg-vibrant-secondary h-full transition-all duration-300"
                      style={{ width: `${((currentQuizIndex + 1) / 5) * 100}%` }}
                    />
                  </div>

                  {/* Question Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    
                    {/* Question Card - Yellow Vibrant 3D Panel */}
                    <div 
                      onClick={() => setShowQuizTranslation(!showQuizTranslation)}
                      className="p-6 bg-vibrant-secondary text-slate-950 rounded-2xl cursor-pointer hover:bg-amber-400 transition-all group shadow-md border border-amber-600/30 vibrant-shadow-3d select-none"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="text-xs uppercase tracking-wider font-extrabold text-amber-900 font-mono">Հարց {currentQuizIndex + 1}:</span>
                          <h3 className="text-base sm:text-lg font-black font-display text-slate-950 group-hover:text-black transition-colors">
                            {QUIZ_QUESTIONS[currentQuizIndex].questionEs}
                          </h3>
                        </div>
                        <button 
                          className="shrink-0 p-2 rounded-xl bg-amber-600/25 text-amber-950 hover:bg-amber-600/40 text-xs font-bold transition-all"
                          title="Անցնել թարգմանությանը"
                        >
                          <Languages className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Click invitation */}
                      {!showQuizTranslation && (
                        <p className="text-[11px] text-amber-900/80 mt-3.5 font-bold italic">
                          Սեղմեք հարցի վրա՝ հայերեն թարգմանությունը տեսնելու համար:
                        </p>
                      )}

                      {/* Question Armenian Translation */}
                      <AnimatePresence initial={false}>
                        {showQuizTranslation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 pt-3 border-t border-amber-600/20"
                          >
                            <p className="text-sm text-amber-950 font-bold font-sans">
                              {QUIZ_QUESTIONS[currentQuizIndex].questionHy}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Spacer to balance 3D shadow depth of question card */}
                    <div className="h-2"></div>

                    {/* Options Grid */}
                    <div className="space-y-3">
                      {QUIZ_QUESTIONS[currentQuizIndex].options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrectOption = option.id === QUIZ_QUESTIONS[currentQuizIndex].correctOptionId;
                        
                        let optionStyle = "border-slate-200 bg-white hover:border-vibrant-primary hover:bg-[#FFFBEB] hover:scale-[1.01] active:scale-[0.99]";
                        if (isSelected && !quizSubmitted) {
                          optionStyle = "border-vibrant-primary bg-indigo-50/50 ring-4 ring-indigo-500/10 scale-[1.01]";
                        }
                        if (quizSubmitted) {
                          if (isCorrectOption) {
                            optionStyle = "border-vibrant-accent bg-emerald-50 text-emerald-950 scale-[1.01] font-semibold";
                          } else if (isSelected) {
                            optionStyle = "border-rose-500 bg-rose-50 text-rose-950";
                          } else {
                            optionStyle = "border-slate-100 opacity-60 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={option.id}
                            disabled={quizSubmitted}
                            onClick={() => handleOptionSelect(option.id)}
                            className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer ${optionStyle}`}
                          >
                            <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border transition-all ${
                              isSelected 
                                ? "bg-vibrant-primary text-white border-vibrant-primary" 
                                : isCorrectOption && quizSubmitted
                                ? "bg-vibrant-accent text-white border-vibrant-accent"
                                : quizSubmitted && isSelected
                                ? "bg-rose-500 text-white border-rose-500"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>
                              {option.id}
                            </span>
                            
                            <div className="flex-1">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 block font-display">
                                {option.textEs}
                              </span>
                              <span className="text-[11px] text-slate-500 block mt-0.5 font-semibold">
                                {option.textHy}
                              </span>
                            </div>

                            {quizSubmitted && isCorrectOption && (
                              <CheckCircle2 className="w-5 h-5 text-vibrant-accent shrink-0 self-center" />
                            )}
                            {quizSubmitted && isSelected && !isCorrectOption && (
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0 self-center" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations & Next Button */}
                    {quizSubmitted && (
                      <div className="space-y-4">
                        
                        {/* Explanation Box */}
                        <div className="bg-[#FFFBEB] border-2 border-vibrant-secondary rounded-2xl p-4 space-y-3 shadow-xs">
                          <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs">
                            <Info className="w-4 h-4 text-vibrant-secondary" />
                            <span>Բացատրություն / Explicación:</span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <p className="text-xs sm:text-sm text-slate-800 font-bold italic">
                              {QUIZ_QUESTIONS[currentQuizIndex].explanationEs}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-700 font-semibold">
                              {QUIZ_QUESTIONS[currentQuizIndex].explanationHy}
                            </p>
                          </div>
                        </div>

                        {/* Navigation / Action */}
                        <div className="flex justify-end">
                          <button
                            onClick={handleNextQuiz}
                            className="px-6 py-3 bg-vibrant-primary hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                          >
                            <span>
                              {currentQuizIndex + 1 === QUIZ_QUESTIONS.length ? "Ավարտել վիկտորինան" : "Հաջորդ հարցը"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    )}

                    {/* Submit Answer (if not submitted) */}
                    {!quizSubmitted && (
                      <div className="flex justify-end pt-2">
                        <button
                          disabled={!selectedOptionId}
                          onClick={handleQuizSubmit}
                          className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedOptionId 
                              ? "bg-vibrant-primary hover:bg-indigo-700 text-white" 
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ստուգել պատասխանը</span>
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                
                /* QUIZ COMPLETION SUMMARY */
                <div className="bg-white rounded-[32px] border-4 border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-6">
                  
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="inline-flex p-4 bg-vibrant-secondary/20 text-vibrant-secondary rounded-full mb-2">
                      <Award className="w-14 h-14 animate-bounce" />
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                      Վիկտորինան Ավարտվեց!
                    </h2>
                    <p className="text-sm text-slate-500 font-semibold">
                      Դուք հաջողությամբ պատասխանեցիք բոլոր հարցերին։ Տեսնենք ձեր արդյունքը։
                    </p>
                  </div>

                  {/* SCORE DISPLAY - Yellow Vibrant 3D Panel */}
                  <div className="max-w-xs mx-auto bg-vibrant-secondary border border-amber-600 p-6 rounded-3xl vibrant-shadow-3d select-none">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-950">
                      Ձեր Միավորը
                    </span>
                    <div className="text-5xl font-black font-display text-slate-950 mt-1">
                      {quizScore} <span className="text-2xl text-amber-900">/ 5</span>
                    </div>
                    <div className="mt-2 text-xs font-extrabold text-amber-950 bg-white/40 px-2 py-0.5 rounded-full inline-block">
                      {quizScore === 5 
                        ? "Գերազանց! ¡Excelente! 🌟" 
                        : quizScore >= 3 
                        ? "Շատ լավ! ¡Muy bien! 👍" 
                        : "Փորձեք ևս մեկ անգամ! ¡Sigue practicando! 💪"}
                    </div>
                  </div>

                  {/* Spacer for 3D shadow */}
                  <div className="h-2"></div>

                  {/* History Review list */}
                  <div className="max-w-md mx-auto text-left space-y-2.5">
                    <h3 className="text-xs uppercase tracking-widest font-mono font-extrabold text-slate-400">
                      Պատասխանների տեսություն:
                    </h3>
                    {QUIZ_QUESTIONS.map((q, idx) => {
                      const userAns = quizHistory.find(h => h.questionId === q.id);
                      return (
                        <div key={q.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                          <div className="flex-1 pr-3">
                            <span className="text-xs font-bold text-slate-900 block font-display line-clamp-1">
                              {idx + 1}. {q.questionEs}
                            </span>
                            <span className="text-[10px] text-slate-400 block line-clamp-1 font-semibold">
                              {q.questionHy}
                            </span>
                          </div>
                          <div className="shrink-0 flex items-center gap-1.5">
                            <span className="text-[10px] font-mono uppercase bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                              Պատասխան՝ {userAns?.selected || "-"}
                            </span>
                            {userAns?.isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-vibrant-accent" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 max-w-xs mx-auto flex gap-3">
                    <button
                      onClick={restartQuiz}
                      className="flex-1 py-3 bg-vibrant-primary hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Կրկին անցնել</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("reader")}
                      className="flex-1 py-3 bg-[#FFFBEB] hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Տեքստին</span>
                    </button>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: COMPLETE VOCABULARY DECK */}
          {activeTab === "vocabulary" && (
            <motion.div
              key="vocab-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* Filter and introduction */}
              <div className="bg-white p-6 rounded-[32px] border-4 border-slate-200 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold font-display text-slate-900 flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-vibrant-secondary" />
                    <span>Բառային Քարտեր (Tarjetas de Vocabulario)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Սեղմեք յուրաքանչյուր քարտի վրա՝ թարգմանությունը տեսնելու համար։ Կարող եք լսել իսպաներեն արտասանությունը:
                  </p>
                </div>

                {/* Grammar filter buttons */}
                <div className="flex flex-wrap gap-1.5 bg-slate-150 p-1.5 rounded-2xl border border-slate-200">
                  {["todos", "verbo", "sustantivo", "adjetivo", "adverbio"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setVocabFilter(filter)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        vocabFilter === filter
                          ? "bg-vibrant-primary text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      {filter === "todos" ? "Բոլորը" : filter === "verbo" ? "Բայեր" : filter === "sustantivo" ? "Գոյականներ" : filter === "adjetivo" ? "Ածականներ" : "Մակբայներ"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Flashcards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {allVocabList
                  .filter(v => vocabFilter === "todos" || v.type === vocabFilter)
                  .map((vocab, index) => {
                    const isFlipped = !!flippedCards[vocab.spanish];
                    return (
                      <div
                        key={index}
                        onClick={() => toggleCardFlip(vocab.spanish)}
                        className={`h-40 relative rounded-2xl border-2 cursor-pointer select-none transition-all duration-300 transform preserve-3d ${
                          isFlipped 
                            ? "border-vibrant-accent bg-emerald-50/20 rotate-y-180 shadow-md" 
                            : "border-slate-250 bg-white hover:border-vibrant-primary hover:scale-[1.03] hover:shadow-md"
                        }`}
                      >
                        {/* Front Side: Spanish Word */}
                        <div className={`absolute inset-0 p-4.5 flex flex-col justify-between backface-hidden ${isFlipped ? "opacity-0" : "opacity-100"}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                              {vocab.type}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakSpanish(vocab.spanish);
                              }}
                              className="p-1.5 rounded-lg bg-indigo-50 text-vibrant-primary hover:bg-indigo-100"
                              title="Լսել արտասանությունը"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="text-center py-2">
                            <h3 className="text-lg sm:text-xl font-black text-slate-950 font-display">
                              {vocab.spanish}
                            </h3>
                          </div>

                          <span className="text-[10px] text-slate-400 text-center font-bold italic flex items-center justify-center gap-1">
                            <ArrowRightLeft className="w-3 h-3 text-vibrant-secondary" />
                            Սեղմեք թեքելու համար
                          </span>
                        </div>

                        {/* Back Side: Armenian Translation */}
                        <div className={`absolute inset-0 p-4.5 flex flex-col justify-between backface-hidden rotate-y-180 transform ${isFlipped ? "opacity-100" : "opacity-0"}`}>
                          <span className="text-[10px] font-mono uppercase bg-emerald-100 px-2 py-0.5 rounded text-emerald-850 font-bold self-start">
                            Հայերեն
                          </span>
                          
                          <div className="text-center py-2">
                            <p className="text-sm sm:text-base font-extrabold text-emerald-950 font-sans leading-tight">
                              {vocab.armenian}
                            </p>
                          </div>

                          <span className="text-[10px] text-emerald-600 text-center font-bold">
                            Իսպաներեն՝ {vocab.spanish}
                          </span>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </motion.div>
          )}

          {/* TAB 4: WORD MATCHING GAME */}
          {activeTab === "game" && (
            <motion.div
              key="game-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              
              {/* Game Scoreboard */}
              <div className="bg-white p-6 rounded-[32px] border-4 border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold font-display text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-vibrant-secondary" />
                    <span>Բառերի Համապատասխանեցման Խաղ</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Միացրեք իսպաներեն բառը իր ճիշտ հայերեն թարգմանության հետ։
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-indigo-50 rounded-xl text-vibrant-primary text-xs font-bold font-mono">
                    Քայլեր՝ {gameMoves}
                  </div>
                  <button
                    onClick={startMatchGame}
                    className="p-2.5 bg-vibrant-primary hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Խաղալ նոր բառերով"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!gameCompleted ? (
                /* Card Layout */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gameWords.map((card) => {
                    const isSelected = selectedGameCard === card.id;
                    const isMatched = matchedGameKeys.includes(card.matchKey);
                    const isFlashingWrong = wrongMatchFlash?.card1 === card.id || wrongMatchFlash?.card2 === card.id;

                    let cardStyle = "border-slate-200 bg-white hover:border-vibrant-primary hover:scale-[1.02] text-slate-950 hover:shadow-sm";
                    if (isSelected) {
                      cardStyle = "border-vibrant-primary bg-indigo-50/50 text-vibrant-primary ring-4 ring-indigo-500/10 scale-[1.02]";
                    }
                    if (isMatched) {
                      cardStyle = "border-vibrant-accent/40 bg-emerald-50 text-emerald-950 opacity-60 cursor-not-allowed";
                    }
                    if (isFlashingWrong) {
                      cardStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-4 ring-rose-500/10 animate-shake";
                    }

                    return (
                      <button
                        key={card.id}
                        disabled={isMatched || isFlashingWrong}
                        onClick={() => handleGameCardClick(card.id, card.matchKey)}
                        className={`p-6 rounded-2xl border-2 text-center flex flex-col items-center justify-center min-h-[100px] transition-all duration-200 cursor-pointer ${cardStyle}`}
                      >
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 mb-1">
                          {card.lang === "es" ? "Spanish" : "Armenian"}
                        </span>
                        <span className="text-sm font-extrabold font-display leading-tight">
                          {card.text}
                        </span>
                        {isMatched && (
                          <span className="text-[9px] font-mono text-vibrant-accent font-bold mt-2 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Գտնված է
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Completion screen */
                <div className="bg-white rounded-[32px] border-4 border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-6">
                  <div className="inline-flex p-4 bg-vibrant-accent/20 text-vibrant-accent rounded-full mb-2">
                    <Award className="w-14 h-14 animate-bounce" />
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                    Շնորհավորո՛ւմ ենք: ¡Excelente!
                  </h2>
                  <p className="text-sm text-slate-500 max-w-md mx-auto font-semibold">
                    Դուք համապատասխանեցրիք բոլոր բառերը ընդամենը <span className="font-extrabold text-slate-950">{gameMoves} քայլով</span>!
                  </p>

                  <div className="max-w-xs mx-auto pt-2">
                    <button
                      onClick={startMatchGame}
                      className="w-full py-3 bg-vibrant-primary hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Խաղալ կրկին</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER AREA */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-vibrant-secondary" />
            <span className="text-slate-500">Visita por la Ciudad — Իսպաներենի Ուսումնական Խաղ</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span>React + Vite + Tailwind 4</span>
            <span>•</span>
            <span>Created with Google AI Studio</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
