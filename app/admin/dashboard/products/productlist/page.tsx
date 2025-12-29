'use client';

import { useEffect, useState } from 'react';

import DropDownText from '@/components/DropDownText';
import SearchTextTest from '@/components/InputTextTest';





export default function page() {
    const [searchProduct, setSearchProduct] = useState<string>('')


    const clearSearch = () => {
        setSearchProduct('')
    }    




    return (
    <div className='flex flex-col border border-greyColor p-2 gap-y-4 font-extrabold rounded bg-blackgroundColor'>
        <div className="flex-1 flex flex-col">
            <h1 className="text-primaryColor text-xl">PRODUCT LISTS</h1>
                <div className="flex-1 flex flex-col">
                <h1 className="text-primaryColor text-xl">SELECT BRAND</h1>
                {/* <SearchTextTest
                    choosen={selectedBrand} 
                    onClear={clearSearch}
                    placeholderText="Search Brand"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                /> */}
                {/* {filteredBrands.length > 0 && (
                    <ul className="list-none bg-secondary border rounded border-primaryColor text-base max-h-40 overflow-y-auto">
                    {filteredBrands.map((brand) => (
                        <DropDownText 
                        onClick={() => handleSelectBrand(brand)} 
                        key={brand.brandId} 
                        indexKey={brand.brandId} 
                        listName={brand.brandName}
                        />
                    ))}
                    </ul>
                )} */}
                </div>
        </div>
    </div>
    )
}
