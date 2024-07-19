import Course from './Courses.jsx'

const App = () => {
  // courses array
  const courses = [
    {
      id: 1,
      name: "Half stack application development",
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  const totalExercises = courses.reduce((acc, course) => {
    return (
      acc +
      course.parts.reduce((courseAcc, part) => courseAcc + part.exercises, 0)
    );
  }, 0);

  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
      <h3> {totalExercises}</h3>
    </div>
  );
};

export default App;
