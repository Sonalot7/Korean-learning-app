import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const words = [
  { korean: "안녕하세요", romanization: "annyeonghaseyo", meaning: "Hello" },
  { korean: "사랑", romanization: "sarang", meaning: "Love" },
  { korean: "감사합니다", romanization: "gamsahamnida", meaning: "Thank you" },
  { korean: "친구", romanization: "chingu", meaning: "Friend" },
];

export default function KoreanLearningApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const speakWord = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    speechSynthesis.speak(utterance);
  };

  const startQuiz = () => {
    setQuizMode(true);
    setScore(0);
  };

  const checkAnswer = (selected) => {
    setSelectedOption(selected);
    if (selected === words[currentIndex].meaning) {
      setScore(score + 1);
      setStreak(streak + 1);
      localStorage.setItem('streak', streak + 1);
    } else {
      setStreak(0);
      localStorage.setItem('streak', 0);
    }
    setTimeout(() => {
      setSelectedOption(null);
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-4xl font-bold text-pink-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Korean Learning App 🌸
      </motion.h1>

      {!quizMode ? (
        <Card className="w-full max-w-md bg-pink-200 shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold text-pink-800">{words[currentIndex].korean}</h2>
            <p className="text-lg text-pink-700 mt-2 italic">{words[currentIndex].romanization}</p>
            <p className="text-md text-pink-600">{words[currentIndex].meaning}</p>

            <div className="flex justify-center gap-3 mt-6">
              <Button className="bg-pink-400 hover:bg-pink-500" onClick={() => speakWord(words[currentIndex].korean)}>🔊 Speak</Button>
              <Button className="bg-pink-400 hover:bg-pink-500" onClick={nextWord}>➡️ Next</Button>
              <Button className="bg-pink-400 hover:bg-pink-500" onClick={startQuiz}>🎯 Quiz</Button>
            </div>

            <p className="mt-4 text-pink-700">🔥 Daily Streak: {streak} days</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md bg-pink-200 shadow-lg rounded-2xl">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl text-pink-700 mb-4">What does this mean?</h2>
            <h3 className="text-3xl font-bold text-pink-800 mb-4">{words[currentIndex].korean}</h3>
            <div className="grid grid-cols-2 gap-3">
              {words.map((word, index) => (
                <Button
                  key={index}
                  className={`$ {
                    selectedOption === word.meaning
                      ? word.meaning === words[currentIndex].meaning
                        ? 'bg-green-400'
                        : 'bg-red-400'
                      : 'bg-pink-300 hover:bg-pink-400'
                  }`}
                  onClick={() => checkAnswer(word.meaning)}
                >
                  {word.meaning}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-pink-700">Score: {score}</p>
            <Button className="mt-4 bg-pink-500 hover:bg-pink-600" onClick={() => setQuizMode(false)}>Back</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
