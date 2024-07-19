const Course = ({ course }) => {
    const totalExercises = course.parts.reduce(
        (acc, part) => acc + part.exercises,
        0
      );
      return (
        <div>
          <h2>{course.name}</h2>
          <Content parts={course.parts} />
          <CourseTotal totalExercises={totalExercises} />
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
    return <h4>total of {totalExercises} exercises</h4>;
  };

  export default Course;