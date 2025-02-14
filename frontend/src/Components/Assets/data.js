// Import UI assets
import logo from './logo.png';
import logoBig from './logo_big.png';
import navLogo from './nav-logo.png';
import cartIcon from './cart_icon.png';
import cartCrossIcon from './cart_cross_icon.png';
import crossIcon from './cross_icon.png';
import dropdownIcon from './dropdown_icon.png';
import starIcon from './star_icon.png';
import starDullIcon from './star_dull_icon.png';
import arrowIcon from './arrow.png';

// Import existing product data
import all_product from './all_product';
import new_collections from './new_collections';

// UI Assets export
export const uiAssets = {
  logos: {
    default: logo,
    large: logoBig,
    nav: navLogo
  },
  icons: {
    cart: cartIcon,
    cartCross: cartCrossIcon,
    cross: crossIcon,
    dropdown: dropdownIcon,
    star: starIcon,
    starDull: starDullIcon,
    arrow: arrowIcon
  }
};

// School Uniforms Data - using existing product images
export const schoolUniforms = {
    primary: [
        {
            id: 1,
            name: "Primary School Complete Set",
            description: "Complete primary school uniform set including 2 shirts, trousers/skirt, and tie",
            image: all_product[0].image,
            category: "primary",
            type: "COMBO",
            new_price: 299000,
            old_price: 350000,
            stock: 0, // Out of stock
            sizes: ["4", "6", "8", "10", "12"],
            combo_items: [
                { name: "White Shirt", quantity: 2 },
                { name: "Navy Trousers/Skirt", quantity: 1 },
                { name: "School Tie", quantity: 1 }
            ]
        },
        {
            id: 2,
            name: "Primary School White Shirt",
            description: "Short-sleeve white shirt with school logo",
            image: all_product[1].image,
            category: "primary",
            type: "SINGLE",
            new_price: 89000,
            old_price: 99000,
            stock: 100,
            sizes: ["4", "6", "8", "10", "12"]
        },
        {
            id: 3,
            name: "Primary School Trousers",
            description: "Navy blue school trousers",
            image: all_product[2].image,
            category: "primary",
            type: "SINGLE",
            new_price: 129000,
            old_price: 149000,
            stock: 75,
            sizes: ["4", "6", "8", "10", "12"]
        },
        {
            id: 4,
            name: "Primary School Skirt",
            description: "Navy blue pleated skirt",
            image: all_product[3].image,
            category: "primary",
            type: "SINGLE",
            new_price: 129000,
            old_price: 149000,
            stock: 75,
            sizes: ["4", "6", "8", "10", "12"]
        }
    ],
    secondary: [
        {
            id: 5,
            name: "Secondary School Complete Set",
            description: "Complete secondary school uniform set with blazer",
            image: all_product[12].image,
            category: "secondary",
            type: "COMBO",
            new_price: 599000,
            old_price: 699000,
            stock: 30,
            sizes: ["XS", "S", "M", "L", "XL"],
            combo_items: [
                { name: "Blazer", quantity: 1 },
                { name: "White Shirts", quantity: 2 },
                { name: "Trousers/Skirt", quantity: 2 },
                { name: "School Tie", quantity: 1 }
            ]
        },
        {
            id: 6,
            name: "Secondary School Blazer",
            description: "Navy blue blazer with school emblem",
            image: all_product[13].image,
            category: "secondary",
            type: "SINGLE",
            new_price: 180000,
            old_price: 200000,
            stock: 0, // Out of stock
            sizes: ["XS", "S", "M", "L", "XL"]
        },
        {
            id: 7,
            name: "Secondary School Shirt",
            description: "White long-sleeve shirt with school logo",
            image: all_product[14].image,
            category: "secondary",
            type: "SINGLE",
            new_price: 99000,
            old_price: 119000,
            stock: 100,
            sizes: ["XS", "S", "M", "L", "XL"]
        }
    ],
    sixth: [
        {
            id: 8,
            name: "Sixth Form Complete Set",
            description: "Premium sixth form uniform set with blazer",
            image: all_product[25].image,
            category: "sixth",
            type: "COMBO",
            new_price: 450000,
            old_price: 500000,
            stock: 0, // Out of stock
            sizes: ["XS", "S", "M", "L", "XL"],
            combo_items: [
                { name: "Premium Blazer", quantity: 1 },
                { name: "White Shirts", quantity: 3 },
                { name: "Trousers/Skirt", quantity: 2 },
                { name: "Sixth Form Tie", quantity: 1 }
            ]
        },
        {
            id: 9,
            name: "Sixth Form Blazer",
            description: "Premium black blazer with sixth form emblem",
            image: all_product[25].image,
            category: "sixth",
            type: "SINGLE",
            new_price: 399000,
            old_price: 449000,
            stock: 30,
            sizes: ["XS", "S", "M", "L", "XL"]
        },
        {
            id: 10,
            name: "Sixth Form Shirt Pack",
            description: "Pack of 3 premium white shirts",
            image: all_product[26].image,
            category: "sixth",
            type: "SINGLE",
            new_price: 249000,
            old_price: 299000,
            stock: 50,
            sizes: ["XS", "S", "M", "L", "XL"]
        }
    ]
};

// Popular products across all categories
export const popularProducts = [
    schoolUniforms.primary[0],    // Primary Complete Set
    schoolUniforms.secondary[0],  // Secondary Blazer
    schoolUniforms.sixth[0],      // Sixth Form Complete Set
    schoolUniforms.primary[1],     // Primary Shirt
];

// Use existing new collections
export const newCollection = new_collections;

// Create a named export object
const dataExports = {
  schoolUniforms,
  uiAssets,
  popularProducts,
  newCollection
};

// Export the named object as default
export default dataExports;
