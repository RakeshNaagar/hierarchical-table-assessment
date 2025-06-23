import React, { useState, useEffect } from "react";

function calculateSubtotal(children) {
  return children.reduce((sum, child) => sum + (child.value || 0), 0);
}

function distributeValueToChildren(children, newTotal) {
  const currentTotal = calculateSubtotal(children);
  if (currentTotal === 0) {
    // Distribute equally if all children are zero
    const equalShare = newTotal / children.length;
    return children.map(child => ({ ...child, value: equalShare }));
  }
  return children.map(child => ({
    ...child,
    value: (child.value / currentTotal) * newTotal
  }));
}

const Row = ({
  row,
  originalRow,
  onValueChange,
  level = 0
}) => {
  const [input, setInput] = useState("");
  const [variance, setVariance] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (row.value !== originalRow.value) {
      const v = ((row.value - originalRow.value) / originalRow.value) * 100;
      setVariance(v.toFixed(2));
      setChanged(true);
    } else {
      setVariance(null);
      setChanged(false);
    }
  }, [row.value, originalRow.value]);

  const isInputValid = input.trim() !== "" && !isNaN(parseFloat(input));

  const handleAllocationPercent = () => {
    const percent = parseFloat(input);
    if (isNaN(percent)) return;
    const newValue = row.value + (row.value * percent) / 100;
    if (row.children) {
      // Distribute to children
      const newChildren = distributeValueToChildren(row.children, newValue);
      onValueChange(row.id, newValue, newChildren);
    } else {
      onValueChange(row.id, newValue);
    }
    setInput("");
  };

  const handleAllocationValue = () => {
    const val = parseFloat(input);
    if (isNaN(val)) return;
    if (row.children) {
      // Distribute to children
      const newChildren = distributeValueToChildren(row.children, val);
      onValueChange(row.id, val, newChildren);
    } else {
      onValueChange(row.id, val);
    }
    setInput("");
  };

  return (
    <>
      <tr className={changed ? "" : undefined}>
        <td className={`px-4 py-2 whitespace-nowrap ${level > 0 ? 'pl-8' : ''}`}>{level > 0 ? "-- " : ""}{row.label}</td>
        <td className="px-4 py-2 whitespace-nowrap">{row.value.toFixed(2)}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="% or value"
          />
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button
            onClick={handleAllocationPercent}
            disabled={!isInputValid}
            title="Increase value by percentage"
            className="text-blue-600 underline hover:text-blue-800 disabled:text-gray-400 px-0 py-0 bg-transparent border-none cursor-pointer"
          >
            Allocation %
          </button>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <button
            onClick={handleAllocationValue}
            disabled={!isInputValid}
            title="Set value directly"
            className="text-blue-600 underline hover:text-blue-800 disabled:text-gray-400 px-0 py-0 bg-transparent border-none cursor-pointer"
          >
            Allocation Val
          </button>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {variance !== null && (
            <span>
              {variance > 0 ? "+" : ""}
              {variance}%
            </span>
          )}
          {variance === null && "0%"}
        </td>
      </tr>
      {row.children &&
        row.children.map(child => (
          <Row
            key={child.id}
            row={child}
            originalRow={originalRow.children.find(c => c.id === child.id)}
            onValueChange={onValueChange}
            level={level + 1}
          />
        ))}
    </>
  );
};

export default Row;