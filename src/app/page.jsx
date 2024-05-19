'use client';

import useSpeechRecognition from "../hooks/useSpeechRecognitionHook";
import styles from './page.module.css';
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';  
import { useCompletion } from 'ai/react'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Page() {
  const [inputVal, setInputVal] = useState("");
  const [questions, setQuestions] = useState(['When is one time you worked well in a team?']);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const router = useRouter();
  const responsePrompt = 'Give me feedback to the interview question: ';
  // const [questionPrompt, setQuestionPrompt] = useState(null);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setQuestions(prevQuestions => [...prevQuestions, inputVal]);
      setInputVal('');
    }
  };

  const handleCardClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  const {complete, completion, setInput, input, stop, isLoading} = useCompletion({api: '/api/completion'});
  const {text, startListening, stopListening, isListening, hasRecognitionSupport} = useSpeechRecognition();

  // useEffect(() => {
  //   if (completion) {
  //     setInputVal(completion);
  //   }
  // }, [completion]);

  useEffect(() => {
    if (text) {
      setInput(text);
      let textWithPrompt = responsePrompt + questions[selectedQuestionIndex]+'to this answer (be very specific, keep under 250 words):'+text;
      complete(textWithPrompt);
    }
  }, [text, complete]);

  return (
    <div className={styles.main}>
      <form onSubmit={(e) => { e.preventDefault();

            let textWithPrompt = responsePrompt + questions[selectedQuestionIndex] + 'to this answer (be very specific, keep under 250 words):'+input;

            console.log(textWithPrompt)
            complete(textWithPrompt); 
        
        }} className={styles.chatForm}>
        <div className={styles.chat}>
          <input
            className={styles.chatbox}
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)} 
            placeholder='Submit response'
          />
          {/* <button className={styles.stopbutton} onClick={stop}>
            Stop
          </button> */}
          <button className={styles.submitbutton} disabled={isLoading} type='submit'>
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
      <output className={styles.output}>
        <span>{completion}</span>
      </output>
      <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
        <input
          id="question-input"
          type="text"
          placeholder="Type your question..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
        />
      </form>
      <div className={styles.questionList}>
        <h3>Interview Questions</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {questions.map((question, index) => (
            <Card
              key={index}
              style={{
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: selectedQuestionIndex === index ? '#798FF3' : 'white'
              }}
              onClick={() => handleCardClick(index)}
            >
              <CardContent>
                <Typography variant="body1">{question}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className={styles.center}>
        <img
          className={styles.logo}
          src="/PrepSmartLogo.png"
          alt="PrepSmart Logo"
          width={200}
          height={100}
        />
      </div>
      
      {hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>Start Recording</button>
            <button onClick={stopListening}>Stop Recording</button>
          </div>
          {isListening ? <div>Your browser is currently listening</div> : null}
        </>
      ) : (
        <Typography variant="h5">Your browser has no speech recognition support</Typography>
      )}
    </div>
  );
}
