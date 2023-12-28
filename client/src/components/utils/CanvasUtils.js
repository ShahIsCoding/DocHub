export const handleInputChoice = (key, color, setColor, size, setSize) => {
  switch (key) {
    case 1:
      return (
        <input
          type="color"
          className="input-color w-1/5"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      );
      break;
    case 2:
      return (
        <input
          type="number"
          className="w-4/5"
          min={1}
          max={50}
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      );
    default:
      break;
  }
};

export function handleDrag(e) {}
