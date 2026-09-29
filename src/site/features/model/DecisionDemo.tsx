import { useEffect, useState } from 'react';
import { FileText, Zap } from 'lucide-react';

import { EXAMPLES } from '@/site/features/model/content';

const TURN_MS = 6500;

/**
 * Four kinds of court work and Manu-S1's own answers to each, from its live run. It turns to the
 * next on its own, and stops once someone picks one.
 */
export function DecisionDemo() {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [shown, setShown] = useState(false);
  const example = EXAMPLES[index];

  useEffect(() => {
    setShown(false);
    const reveal = window.setTimeout(() => setShown(true), 320);
    return () => window.clearTimeout(reveal);
  }, [index]);

  useEffect(() => {
    if (held || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const turn = window.setTimeout(() => setIndex((i) => (i + 1) % EXAMPLES.length), TURN_MS);
    return () => window.clearTimeout(turn);
  }, [index, held]);

  return (
    <figure className="s1-demo" aria-label={`Manu-S1 on ${example.story.toLowerCase()}`}>
      <div className="s1-demo__tabs" role="tablist">
        {EXAMPLES.map((e, i) => (
          <button
            key={e.story}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={i === index ? 'is-on' : ''}
            onClick={() => {
              setHeld(true);
              setIndex(i);
            }}
          >
            {e.story}
          </button>
        ))}
      </div>

      <div className="s1-demo__record">
        <span className="s1-demo__label">
          <FileText size={13} aria-hidden="true" /> {example.source}
        </span>
        {example.record.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <ul className={`s1-demo__answers ${example.answers.length > 4 ? 'is-dense' : ''}`}>
        {example.answers.map(([question, answer, confidence, ms, tone]) => (
          <li key={question} className={`is-${tone}`}>
            <span className="s1-demo__q">{question}</span>
            <span className="s1-demo__a">{answer}</span>
            <span className="s1-demo__bar">
              <i style={{ width: shown ? `${confidence}%` : '0%' }} />
            </span>
            <b>
              {confidence}%{ms !== null ? <small>{ms} ms</small> : null}
            </b>
          </li>
        ))}
      </ul>

      <figcaption className="s1-demo__foot">
        <span>
          <Zap size={13} aria-hidden="true" /> {example.foot}
        </span>
      </figcaption>
    </figure>
  );
}
