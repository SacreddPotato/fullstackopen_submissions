const Header = (course) => {
  return (
    <>
      <h1>{course.name}</h1>
    </>
  );
};

const Part = (props) => {
  return (
    <>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </>
  );
};

const Content = (props) => {
  console.log(props);
  const content = [];

  props.parts.forEach((part) => {
    content.push(<Part part={part} />);
  });

  return <>{content}</>;
};

const Total = (props) => {
  const total = props.parts.reduce((t, part) => {
    return t + part.exercises;
  }, 0);
  console.log(total);
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  );
};

// Probably could be done better :P

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      { name: "Fundamentals of React", exercises: 10 },
      { name: "Using props to pass data", exercises: 7 },
      { name: "State of a component", exercises: 14 },
    ],
  }

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      
      <Total parts={course.parts} />
      {/* <p>Number of exercises {exercises1 + exercises2 + exercises3}</p> */}
    </div>
  );
};

export default App;
