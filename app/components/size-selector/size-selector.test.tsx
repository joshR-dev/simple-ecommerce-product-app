import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { SizeSelector } from "./index";

const options = [
  { id: 1, label: "S" },
  { id: 2, label: "M" },
  { id: 3, label: "L" },
];

describe("SizeSelector", () => {
  it("renders all size options", () => {
    render(
      <SizeSelector options={options} selectedSize={null} onSelect={() => {}} />,
    );
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("calls onSelect with correct label when clicked", () => {
    const onSelect = vi.fn();
    render(
      <SizeSelector options={options} selectedSize={null} onSelect={onSelect} />,
    );
    act(() => screen.getByText("M").click());
    expect(onSelect).toHaveBeenCalledWith("M");
  });

  it("applies selected class to the active size", () => {
    render(
      <SizeSelector options={options} selectedSize="L" onSelect={() => {}} />,
    );
    expect(screen.getByText("L")).toHaveClass("size-option-selected");
    expect(screen.getByText("S")).not.toHaveClass("size-option-selected");
    expect(screen.getByText("M")).not.toHaveClass("size-option-selected");
  });
});
