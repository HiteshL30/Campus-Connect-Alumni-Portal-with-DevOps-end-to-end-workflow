import { useState, useEffect, useRef } from 'react';

/**
 * TypingText - Typewriter cycling animation between strings
 * @param {string[]} texts - Array of strings to cycle through
 * @param {number} typeSpeed - ms per character typed
 * @param {number} deleteSpeed - ms per character deleted
 * @param {number} pauseDelay - ms to pause at full string
 * @param {string} className - additional class names
 * @param {boolean} showCursor - show blinking cursor
 */
export default function TypingText({
    texts = ['Hello!'],
    typeSpeed = 60,
    deleteSpeed = 35,
    pauseDelay = 2000,
    className = '',
    showCursor = true,
    staticPrefix = '',
}) {
    const [displayed, setDisplayed] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPausing, setIsPausing] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const currentText = texts[textIndex];

        if (isPausing) {
            timeoutRef.current = setTimeout(() => {
                setIsPausing(false);
                setIsDeleting(true);
            }, pauseDelay);
            return () => clearTimeout(timeoutRef.current);
        }

        if (isDeleting) {
            if (displayed.length === 0) {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
                return;
            }
            timeoutRef.current = setTimeout(() => {
                setDisplayed((prev) => prev.slice(0, -1));
            }, deleteSpeed);
        } else {
            if (displayed.length === currentText.length) {
                setIsPausing(true);
                return;
            }
            timeoutRef.current = setTimeout(() => {
                setDisplayed(currentText.slice(0, displayed.length + 1));
            }, typeSpeed);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [displayed, textIndex, isDeleting, isPausing, texts, typeSpeed, deleteSpeed, pauseDelay]);

    return (
        <span className={className}>
            {staticPrefix && <span>{staticPrefix}</span>}
            <span>{displayed}</span>
            {showCursor && <span className="typing-cursor" aria-hidden="true" />}
        </span>
    );
}
