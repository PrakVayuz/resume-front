import React from "react";

const MatchingWords = ({ matchingWords }) => {

  console.log("matchingWords",matchingWords);
  return (
    <div
      style={{ minHeight: "120px", maxHeight: "150px" }}
      className="bg-gray-100 p-4 rounded-md overflow-auto"
    >
      {/* <h2 className="text-lg font-bold mb-2">Matching Words:</h2> */}
      <ul className="flex m-4 gap-4 flex-wrap">
        {matchingWords &&
          matchingWords?.map((word, index) => (
            <li key={index} className="text-blue-600  ">
              {word}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MatchingWords;
