import { useState, useEffect, useRef } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';

export default function VoiceRecorder({ transcript, setTranscript, onSubmit, isLoading }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech Recognition is not supported in this browser. Please use Google Chrome or type your answer.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      // Assuming we just append new results to our externally managed state
      setTranscript(prev => {
        // Simple logic to avoid duplicating interim results too strictly, 
        // normally we'd manage interim/final separately, but this is a simplified approach
        return prev + (prev.endsWith(' ') ? '' : ' ') + currentTranscript.trim();
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
      setError(`Audio Error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Note: setTranscript dependency might cause rapid re-renders, better to handle inside component or pass event up.

  // A refined approach to handle live transcription locally before lifting it up
  const [localTranscript, setLocalTranscript] = useState(transcript);
  
  // Sync back to parent when typing or recording changes
  useEffect(() => {
    setTranscript(localTranscript);
  }, [localTranscript, setTranscript]);

  useEffect(() => {
    // Check Speech Recognition Again for refined behavior
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript;
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }
      if (finalStr) {
        setLocalTranscript(prev => prev + ' ' + finalStr);
      }
    };

    recognition.onerror = (e) => {
      setIsRecording(false);
      setError(e.error === 'not-allowed' ? 'Microphone access denied.' : `Error: ${e.error}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    setError('');
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setLocalTranscript(''); // Clear on new recording start
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        setError('Could not start recording hook. Make sure mic permissions are granted.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-secondary-200 mt-6">
      <h3 className="text-lg font-semibold text-secondary-900 mb-3 flex items-center justify-between">
        Voice Answer
        {isRecording && (
          <span className="flex items-center gap-2 text-red-500 text-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Recording
          </span>
        )}
      </h3>

      {!isSupported && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isSupported && error && (
        <div className="mb-4 text-red-600 text-sm flex items-center gap-1">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="space-y-4">
        <textarea
          value={localTranscript}
          onChange={(e) => setLocalTranscript(e.target.value)}
          rows={5}
          disabled={isLoading || isRecording}
          placeholder="Your spoken answer will appear here. You can also edit it before submitting."
          className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-secondary-50"
        ></textarea>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={toggleRecording}
            disabled={!isSupported || isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200'
            } disabled:opacity-50`}
          >
            {isRecording ? (
              <>
                 <Square size={18} fill="currentColor" /> Stop Recording
              </>
            ) : (
              <>
                <Mic size={18} /> Start Recording
              </>
            )}
          </button>

          <button
            onClick={onSubmit}
            disabled={!localTranscript.trim() || isLoading || isRecording}
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Evaluating...' : 'Submit Verbal Answer'}
          </button>
        </div>
      </div>
    </div>
  );
}
