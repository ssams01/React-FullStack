// import Course from './Course'

const App = () => {
  const courses = [
    {
      id: 1,
      name: 'Half stack application development',
      parts: [
        { 
          name: 'Fundamentals of React',
          exercises: 10, 
          id: 1 
        },
        { 
          name: 'Using props to pass data', 
          exercises: 7, 
          id: 2 
        },
        { 
          name: 'State of a component', 
          exercises: 14, 
          id: 3 
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ];

  const totalExercises = courses.reduce((acc, course) => {
    return acc + course.parts.reduce((courseAcc, part) => courseAcc + part.exercises, 0);
  }, 0);

  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
      
    </div>
  );
};

const Course = ({course}) => {
  // const { course } = props;
  const totalExercises = course.parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <div>
      <h2>{course.name}</h2>
      <Content parts={course.parts} />
      <CourseTotal totalExercises = {totalExercises} />
    </div>
  );
};


const Content = (props) => {
  const { parts } = props;
  return (
    <div>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </div>
  );
};

const CourseTotal = (props) => {
  const { totalExercises } = props;
  return (
    <h4>total of {totalExercises} exercises</h4>
  );
};

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  );
};



export default App;
