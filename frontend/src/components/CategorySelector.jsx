import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Home, 
  Heart, 
  DollarSign,
  MoreHorizontal,
  Check
} from 'lucide-react';

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Housing",
  "Health",
  "Other"
];

const CATEGORY_ICONS = {
  "Food": Utensils,
  "Transportation": Car,
  "Shopping": ShoppingBag,
  "Housing": Home,
  "Health": Heart,
  "Income": DollarSign,
  "Other": MoreHorizontal
};

const CategorySelector = ({ formData, setFormData }) => {
  const handleCategoryClick = (category) => {
    setFormData({
      ...formData,
      category: category,
      subCategory: ""
    });
  };

  return (
    <div className="animate-fadeIn">
      <label className="block text-sm font-medium text-neutral-700 mb-3">
        Category
      </label>
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category];
          const isActive = formData.category === category;
          
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:border-primary hover:bg-primary/5 ${
                isActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-neutral-200'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-neutral-600'}`} />
              {isActive && (
                <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
              )}
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-neutral-700'}`}>
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
