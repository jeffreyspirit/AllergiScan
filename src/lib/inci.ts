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
  regex: new RegExp(`\\b${ing.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
}));

export function analyzeIngredients(text: string, personalAllergens: string[] = []): (Ingredient & { isPersonalAllergen?: boolean })[] {
  const upperText = text.toUpperCase();
  
  return compiledDatabase
    .filter((ingredient) => {
      return ingredient.regex.test(upperText);
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
