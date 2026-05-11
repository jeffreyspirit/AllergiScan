import inciData from "./inci.json";

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  functions: string[];
  safetyProfile: "safe" | "caution" | "danger";
  allergen?: boolean;
  euAllergen?: boolean;
  cas?: string;
  category?: string;
}

export const inciDatabase = inciData as Ingredient[];

// Pre-compile regexes for performance
const compiledDatabase = inciDatabase.map(ing => ({
  ...ing,
  // Use a more relaxed regex that handles potential punctuation or spaces within/around names
  regex: new RegExp(`${ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s\\-\\_]+')}`, 'i')
}));

export function analyzeIngredients(text: string, personalAllergens: string[] = []): (Ingredient & { isPersonalAllergen?: boolean })[] {
  // Pre-process text to remove common OCR noise but keep structure
  const cleanText = text.toUpperCase()
    .replace(/[\|\[\]\(\)\{\}]/g, ' ') // Remove common OCR garbage characters
    .replace(/\s+/g, ' ');           // Normalize spaces
  
  return compiledDatabase
    .filter((ingredient) => {
      // Test the regex against the cleaned text
      return ingredient.regex.test(cleanText);
    })
    .map(({ regex, ...ing }) => ({
      ...ing,
      isPersonalAllergen: personalAllergens.some(a => a.toUpperCase() === ing.name.toUpperCase())
    }));
}

export function getIngredientByName(name: string): Ingredient | undefined {
  return inciDatabase.find(ing => ing.name.toUpperCase() === name.toUpperCase());
}

export function searchIngredients(query: string): Ingredient[] {
  const q = query.toUpperCase();
  return inciDatabase.filter(ing => 
    ing.name.toUpperCase().includes(q) || 
    ing.description.toUpperCase().includes(q) ||
    ing.functions.some(f => f.toUpperCase().includes(q))
  );
}
