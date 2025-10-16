'use client';

import axios from "axios";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { SetupDetails, SetupImageDetails } from "@/types/dataprops";
import Link from "next/link";
import slugify from "slugify";

interface SetupDetailResponse {
    status: boolean;
    setupDetail:SetupDetails;
}

export default function Promo() {
    const [setupDetails, setSetupDetails ] = useState<SetupDetails>();
    const [displayImage, setDisplayImage] = useState<SetupImageDetails>();
    const [imageOption, setImageOption] = useState<SetupImageDetails[]>();

    const [discountedPrice, setDiscountedPrice] = useState<string>('');

    const params = useParams<{ setName: string; setId: string;}>();
    let setName = params.setName;
    let setId = params.setId;

    useEffect(() =>  {
        axios
        .get<SetupDetailResponse>(`/api/setups/specificSetup/${setId}/`)
        .then((res) => {
        const detail = res.data.setupDetail;

        setSetupDetails(detail);
        })
        .catch((err) => console.log(err));
    }, [setId,setName]);

    useEffect(() => {
        if (setupDetails) {
            const { totalSetupPrice, valueDiscount, typeDiscount } = setupDetails;

            const discount = valueDiscount ? parseFloat(valueDiscount) : 0;
            const price = totalSetupPrice ? parseFloat(totalSetupPrice.toString()) : 0;

            if (typeDiscount === 'Unit') {
                const unitDiscount = (price - discount).toFixed(2);
                setDiscountedPrice(unitDiscount);
            } else if (typeDiscount === 'Percent') {
                const percentageDiscount = (price * (1 - discount / 100)).toFixed(2);
                setDiscountedPrice(percentageDiscount);
            }
        }
    }, [setupDetails]);

    useEffect(() => {
        const foundMainIMage = setupDetails?.images.find(
          (img) => img.isMain === 1
        );

        setDisplayImage(foundMainIMage);

        setImageOption(setupDetails?.images);

    },[displayImage,setupDetails?.images])


    let numericConverter = (number:number | string | undefined) => {
        let numericPrice = Number(number)
        let formattedNumber = numericPrice.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return formattedNumber;
    }

    const UnitDiscount = (price: string | number | undefined, discountPrice: string) => {
        const priceValue = parseFloat(price?.toString() || '0');
        const discountValue = parseFloat(discountPrice || '0');
        const discountedPrice = (priceValue - discountValue).toFixed(2);
        return discountedPrice;
    };

    const PercentageDiscount = (price: string | number | undefined, discountPercentage: string) => {
        const priceValue = parseFloat(price?.toString() || '0');
        const discountPercentageValue = parseFloat(discountPercentage || '0');
        const discountedPrice = (priceValue * (1 - discountPercentageValue / 100)).toFixed(2);
        return discountedPrice;
    };

    return (
    <>
    <div className='flex flex-col px-10 gap-y-4'>
        <div className="container flex flex-col gap-y-1 gradientBackGround rounded-xl px-4 py-2 border border-greyColor">
            <h4 className="text-tertiaryColor font-bold">
            {setupDetails?.codeName}
            </h4>
            <h1 className="text-primaryColor text-4xl font-bold">
            {setupDetails?.setupName} Setup
            </h1>
            <h2 className="text-tertiaryColor text-sm font-bold line-through opacity-70">
            {numericConverter(setupDetails?.totalSetupPrice)}
            </h2>
            <h2 className="text-primaryColor text-xl font-extrabold">
            {numericConverter(discountedPrice)}
            </h2>
            <p className="text-xs text-green-400 font-medium">
            {`Discounted ${numericConverter(setupDetails?.valueDiscount)}`}
            </p>
            <div className="flex flex-col mt-4 text-base text-primaryColor font-bold">
                <h1 className="font-extrabold text-xl text-primaryColor">Package Items</h1>
                <div className="flex flex-col">
                    {setupDetails?.package?.map(({variantId,productId,productName,categoryType}, key) => (
                    <Link href={`/product/${productId}/${slugify(productName).toLowerCase()}/variant/${variantId}`} key={variantId}>
                    <p className="flex-1 w-1/2 hover:bg-primaryColor bg-blackgroundColor group hover:text-tertiaryColor px-1 py-2 rounded-xl transition-all duration-200">
                    <span className="text-tertiaryColor text-sm group-hover:text-secondary">{categoryType}</span>
                    {` : ${productName}`}
                    </p>
                    </Link>
                    ))}
                </div>
            </div>
        </div>

        <div className="container flex flex-col text-primaryColor text-base font-semibold gap-y-4 border border-greyColor bg-mainBackgroundColor rounded-xl px-4 py-2">
            <div>
                <p className="text-tertiaryColor text-lg">Description</p>
                <p className="whitespace-pre-line align-top">{setupDetails?.description}</p>
            </div>
        </div>

    </div>

    <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-[auto] h-[700px] relative">
            {displayImage && (
            <Image
                src={`/setups/${displayImage.url}`}
                alt={setupDetails?.codeName || "Product"}
                fill
                className="object-contain rounded-lg"
            />
            )}
            {imageOption?.length !== 1 ? (
            <div className="flex gap-3 justify-center flex-wrap">
                {imageOption?.map((img, idx) => (
                <button
                    key={idx}
                    className={`relative w-24 h-24 border rounded-md overflow-hidden transition 
                    ${
                        displayImage?.imageId === img.imageId
                        ? "border-primaryColor ring-2 ring-primaryColor"
                        : "border-gray-300"
                    }`}
                >
                    <Image
                    src={`/setup${img.url}`}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    />
                </button>
                ))}
            </div>
            )
            : <></>
            }
        </div>
    </div>
    </>
    )

    
}
