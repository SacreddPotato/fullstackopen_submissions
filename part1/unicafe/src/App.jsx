import { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
  const all = good + bad + neutral;
  const avg = all != 0 ? ((good + bad * -1) / all > 0 ? (good + bad * -1) / all : 0) : 0;
  const positive = all != 0 ? good / all : 0;

  return (
    <>
        <StatisticLine text={"All"} value={all} />
        <StatisticLine text={"Average"} value={avg} />
        <StatisticLine text={"Positive"} value={positive * 100} isPercentage={true} />
    </>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const StatisticLine = ({ text, value, isPercentage = false }) => {
  return <tr>
    <td>{text}</td>
    <td>{value} {isPercentage ? '%' : ''}</td>
  </tr>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
  };

  const handleBad = () => {
    setBad(bad + 1);
  };

  const handleNeutral = () => {
    setNeutral(neutral + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGood} text={"Good"} />
      <Button onClick={handleNeutral} text={"Neutral"} />
      <Button onClick={handleBad} text={"Bad"} />
      <h1>statistics</h1>
      {good + bad + neutral == 0 ? (<p>No Feedback Given</p>) : (
        <table>
          <tbody>
            <tr>
              <td>Good</td>
              <td>{good}</td>
            </tr>
            <tr>
              <td>Neutral</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>Bad</td>
              <td>{bad}</td>
            </tr>
            <Statistics good={good} neutral={neutral} bad={bad} />
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
