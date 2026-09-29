import { RESULTS } from '@/site/features/model/content';

const SERIES = [
  ['before', 'The model before court training'],
  ['after', 'Manu-S1'],
] as const;

/** The card's results as bars: three test sets, before and after, the number at the end. */
export function ResultsChart() {
  return (
    <div className="s1-chart">
      <ul className="s1-chart__key" aria-hidden="true">
        {SERIES.map(([key, label]) => (
          <li key={key} className={`is-${key}`}>
            <i /> {label}
          </li>
        ))}
      </ul>
      {RESULTS.map((row) => (
        <div key={row.test} className="s1-chart__group">
          <p className="s1-chart__test">
            {row.test} <span>{row.size}</span>
          </p>
          {SERIES.map(([key, label]) => (
            <div key={key} className={`s1-chart__row is-${key}`}>
              <span className="s1-chart__who">{label}</span>
              <span className="s1-chart__track">
                <i style={{ width: `${row[key]}%` }} />
              </span>
              <b>{row[key]}%</b>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
