import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState({})
  const [highestVoted, setHighestVoted] = useState(0)

  const handleRandomAnecdote = () => {
    const randomAnecdote =  Math.floor(Math.random() * anecdotes.length)
    setSelected(randomAnecdote)
  }

  const handleVote = () => {
    const newVotes = {...votes, [selected]: (!isNaN(votes[selected])) ? votes[selected] + 1 : 1}

    if (highestVoted == 0 && !votes[highestVoted]) {
      setHighestVoted(selected)
    }

    if (newVotes[selected] > newVotes[highestVoted]) {
      setHighestVoted(selected)
    }  
    setVotes(newVotes)
    console.log(newVotes[highestVoted])
    console.log(newVotes)
  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>Has {votes[selected] ?? 0} votes</p>
      <button onClick={handleRandomAnecdote}>next anecdote</button>
      <button onClick={handleVote}>Vote</button>
      {votes[highestVoted] ? <><h1>Anecote with the most votes</h1>
      <p>{anecdotes[highestVoted]}</p>
      <p>has {votes[highestVoted]} votes</p> </> : <></>}
    </div>
  )
}

export default App