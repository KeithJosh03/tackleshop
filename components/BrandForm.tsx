// components/BrandForm.tsx
import React, { useState } from 'react';
import { BrandProps } from '@/types/dataprops'; // Adjusted path based on your setup

interface BrandFormProps {
    brand?: BrandProps | null;
    onSave: (brand: Omit<BrandProps, 'brandId'>) => void;
    onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSave, onCancel }) => {
    // Adjusted the state to match the BrandProps interface
    const [formData, setFormData] = useState<Omit<BrandProps, 'brandId'>>({
        brandName: brand?.brandName || '',  // Corrected property name to match 'brandName'
        imageUrl: brand?.imageUrl || '' // Corrected property name to match 'imageUrl'
    });

    // Handling form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handling form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData); // Pass formData back to the onSave handler
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Brand Name</label>
                <input
                    type="text"
                    name="brandName" // Updated name to match 'brandName' in BrandProps
                    value={formData.brandName}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                    type="text"
                    name="imageUrl" // Updated name to match 'imageUrl' in BrandProps
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-md"
                />
            </div>
            <div className="flex space-x-4">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save</button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded-md">Cancel</button>
            </div>
        </form>
    );
};

export default BrandForm;
