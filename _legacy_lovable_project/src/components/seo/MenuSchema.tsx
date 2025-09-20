import { JsonLd } from './JsonLd';

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  allergens?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

interface MenuSchemaProps {
  menuItems: MenuItem[];
  restaurantName?: string;
}

export const MenuSchema = ({
  menuItems = [],
  restaurantName = 'ODE Food Hall',
}: MenuSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${restaurantName} Menu`,
    description:
      'Полное меню ресторана ODE Food Hall с блюдами от лучших шефов мира',
    inLanguage: 'ru',
    hasMenuSection: menuItems.reduce((sections: any[], item) => {
      let section = sections.find((s) => s.name === item.category);
      if (!section) {
        section = {
          '@type': 'MenuSection',
          name: item.category,
          hasMenuItem: [],
        };
        sections.push(section);
      }

      section.hasMenuItem.push({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        image: item.image,
        suitableForDiet: item.allergens
          ?.map((allergen) => {
            switch (allergen.toLowerCase()) {
              case 'vegan':
                return 'https://schema.org/VeganDiet';
              case 'vegetarian':
                return 'https://schema.org/VegetarianDiet';
              case 'gluten-free':
                return 'https://schema.org/GlutenFreeDiet';
              case 'dairy-free':
                return 'https://schema.org/DiabeticDiet';
              default:
                return null;
            }
          })
          .filter(Boolean),
        nutrition: item.nutrition
          ? {
              '@type': 'NutritionInformation',
              calories: item.nutrition.calories,
              proteinContent: item.nutrition.protein,
              carbohydrateContent: item.nutrition.carbs,
              fatContent: item.nutrition.fat,
            }
          : undefined,
      });

      return sections;
    }, []),
  };

  return <JsonLd data={schema} />;
};
