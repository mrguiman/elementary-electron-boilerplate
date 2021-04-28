import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the boilerplate page components", () => {
  render(<App />);
  const makeNoiseButton = screen.getByText(/Noise me !/i);
  const toneIndicator = screen.getByText(/No Tone Playing/i);
  expect(toneIndicator).toBeInTheDocument();
  expect(makeNoiseButton).toBeInTheDocument();
});
