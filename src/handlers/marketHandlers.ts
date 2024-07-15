import { productInfosOnly } from '../assets/Examples/backEnd';
import { Product } from '../stores/marketStore';


export const categories = [
    { value: "", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Clothing", label: "Clothing" },
    { value: "Books", label: "Books" },
    { value: "Toys", label: "Toys" },
    { value: "Groceries", label: "Groceries" },
    { value: "Health & Beauty", label: "Health & Beauty" },
    { value: "Sports & Outdoors", label: "Sports & Outdoors" },
    { value: "Home & Kitchen", label: "Home & Kitchen" },
    { value: "Automotive", label: "Automotive" },
    { value: "Jewelry", label: "Jewelry" },
    { value: "Musical Instruments", label: "Musical Instruments" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Pet Supplies", label: "Pet Supplies" },
    { value: "Video Games", label: "Video Games" },
];

// Simulated data fetching function with setTimeout
export const fetchProductsData = async (searchTerm: string, category: string, minPrice: string, maxPrice: string, latest: boolean): Promise<Product[]> => {
    return new Promise<Product[]>((resolve, reject) => {
        setTimeout(() => {
            try {
                let data = productInfosOnly;

                // Apply filters based on search criteria
                if (searchTerm) {
                    data = data.filter(product => product.title.toLowerCase().includes(searchTerm.toLowerCase()));
                }
                if (category) {
                    data = data.filter(product => product.category === category);
                }
                if (minPrice) {
                    data = data.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
                }
                if (maxPrice) {
                    data = data.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
                }
                if (latest) {
                    data = data.sort((a, b) => b.id - a.id);
                }

                resolve(data);
            } catch (error) {
                reject(error);
            }
        }, 1500); 
    });
};

