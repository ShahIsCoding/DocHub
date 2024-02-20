import React from "react";

const InputLabel = ({ label, setValue, value, type = "text" }) => {
  return (
    <div className="sm:col-span-3 my-3">
      <label className="block text-sm font-medium  text-gray-900">
        {label}
      </label>
      <div>
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          type={type}
          className="block w-full rounded-md border-0 px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default InputLabel;
