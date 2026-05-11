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

// Utility: Calculate Levenshtein Distance (Similarity)
function getSimilarity(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }

  const distance = d[m][n];
  const maxLength = Math.max(m, n);
  return 1 - distance / maxLength;
}

export function analyzeIngredients(text: string, personalAllergens: string[] = []): (Ingredient & { isPersonalAllergen?: boolean })[] {
  // 1. Clean and tokenize text into words and phrases
  const cleanText = text.toUpperCase().replace(/[^\w\s]/g, ' '); 
  const words = cleanText.split(/\s+/).filter(w => w.length >= 3);
  
  // 2. Exact match check (fast path)
  const results = new Map<string, Ingredient>();
  
  compiledDatabase.forEach(ing => {
    if (ing.regex.test(text)) {
      results.set(ing.id, ing);
    }
  });

  // 3. Fuzzy match check for misspelled words (85% similarity threshold)
  if (words.length > 0) {
    compiledDatabase.forEach(ing => {
      if (results.has(ing.id)) return; // Already found

      const ingName = ing.name.toUpperCase();
      // Check each word in OCR for similarity to this ingredient
      for (const word of words) {
        // Only check words of similar length
        if (Math.abs(word.length - ingName.length) > 2) continue;
        
        if (getSimilarity(word, ingName) > 0.85) {
          results.set(ing.id, ing);
          break;
        }
      }
    });
  }

  return Array.from(results.values()).map(ing => ({
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
