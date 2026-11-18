const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

const Part = ({ part }) => {
  return <>
    <p>{part.name} {part.exercises}</p>
  </>
}

const Content = ({ course }) => {
  return <>
    {course.parts.map(part => <Part key={part.id} part={part}/>)}
    <b>Total of {course.parts.reduce((acc, currentPart) => acc + currentPart.exercises, 0)} exercises</b>
  </>
}

const Course = ({ courses }) => {
  return courses.map(course => {
    return <>
      <Header key={course.id} course={course} />
      <Content key={course.id} course={course} />
    </>
  })
}

export default Course