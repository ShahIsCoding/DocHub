import {
  WhiteboardMenuConstants,
  WhiteboardOptionsConstants,
} from "../constants/WhiteboardOptions";

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
const WhiteboardMenuOptions = (
  color,
  setColor,
  size,
  setSize,
  selectedMenu,
  setSelectedMenu
) => {
  return WhiteboardOptionsConstants.map((option, index) => {
    return (
      <div
        key={option.key}
        className={`h-10 w-28 px-2 py-2 m-2 text-center rounded cursor-pointer ${
          selectedMenu === option.Name ? "bg-orange-300" : "bg-blue-300"
        }`}
      >
        <div
          className="flex flex-row"
          onClick={() => setSelectedMenu(option.Name)}
        >
          <div className="">{option.Name}</div>
          <div className="ml-2">{option.icon}</div>
          {handleInputChoice(option.key, color, setColor, size, setSize)}
        </div>
      </div>
    );
  });
};
export const WhiteboardMenuDisplay = (
  color,
  setColor,
  size,
  setSize,
  selectedMenu,
  setSelectedMenu
) => {
  return (
    <div className="w-fit h-fit ">
      {WhiteboardMenuOptions(
        color,
        setColor,
        size,
        setSize,
        selectedMenu,
        setSelectedMenu
      )}
      <div
        className={`h-10 w-28 px-2 py-2 m-2 text-center rounded cursor-pointer bg-blue-300`}
      ></div>
    </div>
  );
};
