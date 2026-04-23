export function ButtonForSearch({ handleMethod, heading, className }) {
  return (
    <button onClick={handleMethod} className={className}>
      {heading}
    </button>
  );
}
