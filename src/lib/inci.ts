export interface Ingredient {
  id: string;
  name: string;
  description: string;
  functions: string[];
  safetyProfile: "safe" | "caution" | "danger";
  allergen?: boolean;
  euAllergen?: boolean; // EU-listed fragrance allergen
  cas?: string;
  category?: string;
}

export const inciDatabase: Ingredient[] = [
  // ── Solvents / Bases ──
  {
    id: "aqua",
    name: "AQUA",
    description: "Water is the primary solvent in cosmetics, dissolving and carrying many active and functional ingredients.",
    functions: ["Solvent"],
    safetyProfile: "safe",
    cas: "7732-18-5",
    category: "Solvent",
  },
  {
    id: "alcohol_denat",
    name: "ALCOHOL DENAT.",
    description: "Ethyl alcohol made unfit for consumption. Used as a solvent and to improve product absorption. Can be drying.",
    functions: ["Solvent", "Antifoaming", "Antimicrobial"],
    safetyProfile: "caution",
    category: "Solvent",
  },
  // ── Humectants ──
  {
    id: "glycerin",
    name: "GLYCERIN",
    description: "A naturally occurring alcohol compound that draws moisture to the skin and helps maintain hydration.",
    functions: ["Humectant", "Skin conditioning", "Solvent"],
    safetyProfile: "safe",
    cas: "56-81-5",
    category: "Humectant",
  },
  {
    id: "propylene_glycol",
    name: "PROPYLENE GLYCOL",
    description: "A small organic alcohol used as a humectant and solvent. Can cause irritation in some individuals at high concentrations.",
    functions: ["Humectant", "Solvent", "Skin conditioning"],
    safetyProfile: "caution",
    category: "Humectant",
  },
  {
    id: "butylene_glycol",
    name: "BUTYLENE GLYCOL",
    description: "A small molecular weight diol that conditions skin and improves the feel of formulas.",
    functions: ["Humectant", "Solvent", "Viscosity controlling"],
    safetyProfile: "safe",
    category: "Humectant",
  },
  {
    id: "panthenol",
    name: "PANTHENOL",
    description: "Pro-vitamin B5. Acts as a humectant, soothing agent, and skin restorer.",
    functions: ["Humectant", "Skin conditioning", "Soothing"],
    safetyProfile: "safe",
    category: "Active",
  },
  // ── Emollients ──
  {
    id: "dimethicone",
    name: "DIMETHICONE",
    description: "A silicone-based polymer that gives a smooth, silky feel and forms a protective barrier on skin and hair.",
    functions: ["Emollient", "Skin protecting", "Antifoaming"],
    safetyProfile: "safe",
    category: "Emollient",
  },
  {
    id: "petrolatum",
    name: "PETROLATUM",
    description: "Also known as petroleum jelly; forms an occlusive barrier on skin to prevent moisture loss.",
    functions: ["Emollient", "Skin protecting", "Occlusive"],
    safetyProfile: "safe",
    category: "Emollient",
  },
  {
    id: "caprylic_capric_triglyceride",
    name: "CAPRYLIC/CAPRIC TRIGLYCERIDE",
    description: "Derived from coconut oil and glycerin. Excellent emollient and skin-replenishing ingredient.",
    functions: ["Emollient", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Emollient",
  },
  {
    id: "squalane",
    name: "SQUALANE",
    description: "A stable form of squalene, a natural component of human sebum. Excellent emollient and antioxidant.",
    functions: ["Emollient", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Emollient",
  },
  // ── Emulsifiers ──
  {
    id: "cetearyl_alcohol",
    name: "CETEARYL ALCOHOL",
    description: "A mixture of cetyl and stearyl alcohol used as an emulsifier and emollient. Despite the name, it is not drying.",
    functions: ["Emulsifying", "Emollient", "Viscosity controlling"],
    safetyProfile: "safe",
    category: "Emulsifier",
  },
  {
    id: "polysorbate_20",
    name: "POLYSORBATE 20",
    description: "A mild non-ionic surfactant and emulsifier derived from sorbitan and fatty acids, used to mix oil and water.",
    functions: ["Emulsifying", "Surfactant"],
    safetyProfile: "safe",
    category: "Emulsifier",
  },
  {
    id: "glyceryl_stearate",
    name: "GLYCERYL STEARATE",
    description: "An emulsifier that helps to stabilize formulas and gives a soft, smooth feel to the skin.",
    functions: ["Emulsifying", "Emollient"],
    safetyProfile: "safe",
    category: "Emulsifier",
  },
  // ── Actives / Vitamins ──
  {
    id: "niacinamide",
    name: "NIACINAMIDE",
    description: "Vitamin B3, a multifunctional active that brightens skin, minimizes pores, regulates sebum, and strengthens the moisture barrier.",
    functions: ["Skin conditioning", "Antioxidant", "Smoothing"],
    safetyProfile: "safe",
    category: "Active",
  },
  {
    id: "retinol",
    name: "RETINOL",
    description: "A vitamin A derivative that promotes cell turnover and collagen synthesis. Use with caution — can cause irritation.",
    functions: ["Skin conditioning", "Antioxidant"],
    safetyProfile: "caution",
    category: "Active",
  },
  {
    id: "ascorbic_acid",
    name: "ASCORBIC ACID",
    description: "Pure Vitamin C; a potent antioxidant that brightens skin and inhibits melanin production.",
    functions: ["Antioxidant", "pH adjusting", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Active",
  },
  {
    id: "tocopherol",
    name: "TOCOPHEROL",
    description: "Vitamin E; a powerful antioxidant that protects cell membranes from oxidative damage.",
    functions: ["Antioxidant", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Active",
  },
  {
    id: "hyaluronic_acid",
    name: "HYALURONIC ACID",
    description: "A naturally occurring polysaccharide that can hold up to 1000x its weight in water, providing intense hydration.",
    functions: ["Humectant", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Active",
  },
  {
    id: "sodium_hyaluronate",
    name: "SODIUM HYALURONATE",
    description: "The salt form of hyaluronic acid. It has a smaller molecular size, allowing it to penetrate deeper into the skin.",
    functions: ["Humectant", "Skin conditioning"],
    safetyProfile: "safe",
    category: "Active",
  },
  {
    id: "ceramide_np",
    name: "CERAMIDE NP",
    description: "A major component of the skin's barrier. Helps to improve skin hydration and barrier function.",
    functions: ["Skin conditioning", "Skin protecting"],
    safetyProfile: "safe",
    category: "Active",
  },
  // ── Acids / pH ──
  {
    id: "citric_acid",
    name: "CITRIC ACID",
    description: "An alpha hydroxy acid (AHA) used to adjust pH and promote gentle exfoliation and skin renewal.",
    functions: ["Buffering", "Chelating", "Exfoliant"],
    safetyProfile: "safe",
    cas: "77-92-9",
    category: "Acid",
  },
  {
    id: "salicylic_acid",
    name: "SALICYLIC ACID",
    description: "A beta hydroxy acid (BHA) that exfoliates inside pores, making it highly effective for acne-prone skin.",
    functions: ["Exfoliant", "Antimicrobial", "Keratolytic"],
    safetyProfile: "caution",
    category: "Acid",
  },
  {
    id: "lactic_acid",
    name: "LATIC ACID",
    description: "A gentle AHA that exfoliates, hydrates, and brightens the skin. Derived from milk or fermentation.",
    functions: ["Exfoliant", "Humectant", "pH adjusting"],
    safetyProfile: "safe",
    category: "Acid",
  },
  {
    id: "glycolic_acid",
    name: "GLYCOLIC ACID",
    description: "The smallest AHA. Penetrates deeply to exfoliate skin and improve texture and tone.",
    functions: ["Exfoliant", "pH adjusting"],
    safetyProfile: "caution",
    category: "Acid",
  },
  // ── Preservatives ──
  {
    id: "phenoxyethanol",
    name: "PHENOXYETHANOL",
    description: "A widely used preservative effective against bacteria and fungi. May cause irritation in sensitive individuals.",
    functions: ["Preservative"],
    safetyProfile: "caution",
    allergen: true,
    cas: "122-99-6",
    category: "Preservative",
  },
  {
    id: "methylparaben",
    name: "METHYLPARABEN",
    description: "A paraben-class preservative. Concerns about endocrine disruption have been raised, though regulatory bodies consider it safe at permitted concentrations.",
    functions: ["Preservative"],
    safetyProfile: "danger",
    allergen: true,
    cas: "99-76-3",
    category: "Preservative",
  },
  {
    id: "ethylparaben",
    name: "ETHYLPARABEN",
    description: "Similar to methylparaben, a paraben preservative with potential endocrine concerns.",
    functions: ["Preservative"],
    safetyProfile: "danger",
    allergen: true,
    category: "Preservative",
  },
  {
    id: "benzyl_alcohol",
    name: "BENZYL ALCOHOL",
    description: "A fragrance ingredient and preservative. Listed as an EU fragrance allergen above 0.001% in leave-on products.",
    functions: ["Preservative", "Solvent", "Perfuming"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    cas: "100-51-6",
    category: "Preservative",
  },
  {
    id: "potassium_sorbate",
    name: "POTASSIUM SORBATE",
    description: "A mild preservative used in many cosmetics and food products.",
    functions: ["Preservative"],
    safetyProfile: "safe",
    category: "Preservative",
  },
  {
    id: "sodium_benzoate",
    name: "SODIUM BENZOATE",
    description: "A preservative used to prevent the growth of fungi and bacteria.",
    functions: ["Preservative"],
    safetyProfile: "safe",
    category: "Preservative",
  },
  // ── Surfactants / Cleansers ──
  {
    id: "sodium_lauryl_sulfate",
    name: "SODIUM LAURYL SULFATE",
    description: "A strong surfactant and cleanser that can strip the skin's natural barrier and cause irritation with regular use.",
    functions: ["Surfactant", "Cleansing", "Emulsifying"],
    safetyProfile: "danger",
    cas: "151-21-3",
    category: "Surfactant",
  },
  {
    id: "sodium_laureth_sulfate",
    name: "SODIUM LAURETH SULFATE",
    description: "An ethoxylated version of SLS; milder but still potentially irritating, especially if it contains 1,4-dioxane impurities.",
    functions: ["Surfactant", "Cleansing", "Emulsifying"],
    safetyProfile: "caution",
    category: "Surfactant",
  },
  {
    id: "cocamidopropyl_betaine",
    name: "COCAMIDOPROPYL BETAINE",
    description: "A mild amphoteric surfactant derived from coconut oil; frequently used to reduce irritation in cleansing formulas.",
    functions: ["Surfactant", "Cleansing", "Conditioner"],
    safetyProfile: "safe",
    category: "Surfactant",
  },
  {
    id: "sodium_cocoyl_isethionate",
    name: "SODIUM COCOYL ISETHIONATE",
    description: "A very mild, coconut-derived surfactant used in 'soap-free' cleansing bars and sensitive skin products.",
    functions: ["Surfactant", "Cleansing"],
    safetyProfile: "safe",
    category: "Surfactant",
  },
  // ── Fragrances (EU Allergens) ──
  {
    id: "parfum",
    name: "PARFUM",
    description: "A trade-secret blend of fragrance materials. A common trigger for contact allergy and skin sensitization.",
    functions: ["Perfuming", "Masking"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    category: "Fragrance",
  },
  {
    id: "linalool",
    name: "LINALOOL",
    description: "A terpene alcohol found in lavender and other botanicals. An EU-listed fragrance allergen; may oxidize and become more sensitizing in air.",
    functions: ["Perfuming", "Deodorant"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    cas: "78-70-6",
    category: "Fragrance",
  },
  {
    id: "limonene",
    name: "LIMONENE",
    description: "A citrus-derived terpene used for fragrance. An EU-listed allergen; oxidized limonene is a potent skin sensitizer.",
    functions: ["Perfuming", "Solvent"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    cas: "5989-27-5",
    category: "Fragrance",
  },
  {
    id: "citronellol",
    name: "CITRONELLOL",
    description: "A naturally occurring rose-scented terpene; listed as an EU fragrance allergen.",
    functions: ["Perfuming"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    category: "Fragrance",
  },
  {
    id: "geraniol",
    name: "GERANIOL",
    description: "A floral fragrance ingredient found in rose oil; classified as an EU fragrance allergen.",
    functions: ["Perfuming"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    category: "Fragrance",
  },
  {
    id: "eugenol",
    name: "EUGENOL",
    description: "The main aromatic compound in clove oil. An EU-listed fragrance allergen that can cause contact dermatitis.",
    functions: ["Perfuming", "Denaturant"],
    safetyProfile: "danger",
    allergen: true,
    euAllergen: true,
    cas: "97-53-0",
    category: "Fragrance",
  },
  {
    id: "coumarin",
    name: "COUMARIN",
    description: "A sweet-smelling compound found in tonka beans and clover. An EU-listed fragrance allergen.",
    functions: ["Perfuming"],
    safetyProfile: "caution",
    allergen: true,
    euAllergen: true,
    category: "Fragrance",
  },
  // ── Sunscreens ──
  {
    id: "zinc_oxide",
    name: "ZINC OXIDE",
    description: "A mineral UV filter that provides broad-spectrum UVA/UVB protection. Generally well-tolerated by sensitive skin.",
    functions: ["UV filter", "Skin protecting"],
    safetyProfile: "safe",
    category: "Sunscreen",
  },
  {
    id: "titanium_dioxide",
    name: "TITANIUM DIOXIDE",
    description: "A mineral UV filter and opacifier providing broad-spectrum sun protection with a low irritation profile.",
    functions: ["UV filter", "Opacifying"],
    safetyProfile: "safe",
    category: "Sunscreen",
  },
  {
    id: "avobenzone",
    name: "AVOBENZONE",
    description: "A chemical UV-A filter. It can degrade in sunlight and may penetrate the skin; some studies note hormonal concerns.",
    functions: ["UV filter"],
    safetyProfile: "caution",
    cas: "70356-09-1",
    category: "Sunscreen",
  },
  {
    id: "ethylhexyl_methoxycinnamate",
    name: "ETHYLHEXYL METHOXYCINNAMATE",
    description: "A common chemical sunscreen agent. Concerns about stability and hormone disruption have been raised.",
    functions: ["UV filter"],
    safetyProfile: "caution",
    category: "Sunscreen",
  },
  // ── Colorants ──
  {
    id: "ci77891",
    name: "CI 77891",
    description: "Titanium dioxide used as a white pigment/colorant in cosmetics.",
    functions: ["Colorant", "Opacifying"],
    safetyProfile: "safe",
    category: "Colorant",
  },
  {
    id: "ci77491",
    name: "CI 77491",
    description: "Iron oxide (red). Used as a mineral colorant.",
    functions: ["Colorant"],
    safetyProfile: "safe",
    category: "Colorant",
  },
  {
    id: "ci77492",
    name: "CI 77492",
    description: "Iron oxide (yellow). Used as a mineral colorant.",
    functions: ["Colorant"],
    safetyProfile: "safe",
    category: "Colorant",
  },
  {
    id: "ci77499",
    name: "CI 77499",
    description: "Iron oxide (black). Used as a mineral colorant.",
    functions: ["Colorant"],
    safetyProfile: "safe",
    category: "Colorant",
  },
  // ── Polymers / Film Formers ──
  {
    id: "carbomer",
    name: "CARBOMER",
    description: "A synthetic polymer used to thicken and stabilize cosmetics. Well-tolerated by most skin types.",
    functions: ["Viscosity controlling", "Emulsifying", "Film forming"],
    safetyProfile: "safe",
    category: "Thickener",
  },
  {
    id: "xanthan_gum",
    name: "XANTHAN GUM",
    description: "A natural sugar-based thickener and stabilizer.",
    functions: ["Viscosity controlling", "Skin conditioning", "Emulsifying"],
    safetyProfile: "safe",
    category: "Thickener",
  },
];

export function analyzeIngredients(text: string, personalAllergens: string[] = []): (Ingredient & { isPersonalAllergen?: boolean })[] {
  const upperText = text.toUpperCase();
  
  // Create a regex-safe version of each ingredient name
  return inciDatabase
    .filter((ingredient) => {
      // Use word boundaries for more accurate matching
      const regex = new RegExp(`\\b${ingredient.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(upperText);
    })
    .map(ing => ({
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
