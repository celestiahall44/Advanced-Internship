import { createContext, useContext, useState } from "react";

export const FONT_SIZE_OPTIONS = [
  { label: "Aa", size: 14, name: "Small" },
  { label: "Aa", size: 16, name: "Normal" },
  { label: "Aa", size: 18, name: "Large" },
  { label: "Aa", size: 20, name: "XLarge" },
];

const FontSizeContext = createContext({ fontSize: 16, setFontSize: () => {} });

export function FontSizeProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);
  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  return useContext(FontSizeContext);
}
