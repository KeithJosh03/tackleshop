'use client';
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Brand() {
  const [productsBrand, setproductsBrand] = useState([]);
  const { brand } : any = useParams();

  useEffect(() => {
    axios.get(`/api/brands/specificbrand/${brand.replaceAll('_', ' ')}`)
        .then(res => setproductsBrand(res.data))
        .catch(err => console.log(err));
  },[]) 
  console.log(productsBrand);

  return (
    <div className='text-white'>{`Brands ${brand}`}</div>
  )
}
