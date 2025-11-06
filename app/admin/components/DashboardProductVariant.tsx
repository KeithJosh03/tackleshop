import { useState } from 'react';
// import ProductVariantLayoutComponent from './layout'
import InputText from '@/components/InputText';
import CustomButton from '@/components/CustomButton';
export default function ProductVariantComponent() {
const [productVariantName, setproductVariantName] = useState<string>('');
const [isAddingVariant, setisAddingVariant] = useState<boolean>(false);
const [productPrice, setProductPrice] = useState(0.00);

  return (
    <>
    <div className='basis-4/5 flex flex-col p-2 gap-x-2 font-extrabold rounded'>
        <div className='flex flex-row justify-between justify-items-center items-center p-2'>
            <h1 className='text-2xl text-primaryColor font-extrabold '>PRODUCT VARIANT</h1>
            <CustomButton 
            onClick={() => {setisAddingVariant(!isAddingVariant)}}
            text='ADD VARIANT'
            />
        </div>

        {isAddingVariant && (
        <div className='flex flex-col p-2 border border-greyColor'>
            <h1 className='text-primaryColor text-base'>Variant Name</h1>
            <InputText
                placeholder="Variant Model Name"
                value={productVariantName}
                onChange={(e) => setproductVariantName(e.target.value)}
            />
            <h1 className='text-primaryColor text-base mt-4'>Product Price</h1>
            <InputText
            type="number"
            placeholder="Enter product price"
            value={productPrice.toString()}
            onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
            />
        </div>
        )}




    </div>
 
    </>
  )
}
