
// layout
import Header from './layout/Header/Header';
import Footer from './layout/Footer/Footer';

import Hero from './home-page/Hero/Hero';
import Brands from './home-page/BrandsLogo/BrandsLogo';
import Collections from './home-page/ProductCollections/Collection';

import StoreServices from './home-page/StoreServices/StoreServices';


// import Setups from './setups';
// import Discounts from './sales';

import { DashboardBrandClient } from './adminUI/DashboardBrandClient';
import DashBoardButtonLayoutOption from './DashBoardButtonLayoutOption';
import IconButton from '@/components/ui/IconButton';
import FacebookReviewClient from './home-page/FacebookReviews/FacebookReviewClient';
import DashboardHeader from './adminUI/DashboardHeader';
import DashboardOverviewClient from './DashboardOverviewClient';
import DashboardVariantsComponent from './DashboardVariantsComponent';
import ProductVariantBuilder from './ProductVariantBuilder';
import ProductMedia from './ProductMedia';
export * from './ProductForm';



// Admin UI
import {
    SectionCard,
    FieldError,
    ProductContentInputs,
    FieldHint
} from './adminUI';

import SearchText from './SearchText';
import TextBox from './TextBox';
import CustomButton from './ui/CustomButton';
import ImageIconUpload from '@/components/ui/ImageIconUpload';
import DropDownText from '@/components/ui/DropDownText';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

import { DashboardCategoryClient } from './adminUI/DashboardCategoryClient';

export {
    // layout
    Header,
    Footer,

    // home page
    Hero,
    Brands,
    StoreServices,
    FacebookReviewClient,
    Collections,

    // dashboard
    DashboardBrandClient,
    DashboardCategoryClient,
    DashBoardButtonLayoutOption,
    DashboardHeader,
    DashboardOverviewClient,
    DashboardVariantsComponent,
    ProductVariantBuilder,
    ProductMedia,
    ProductContentInputs,
    FieldError,
    FieldHint,
    SectionCard,

    // ui
    DropDownText,
    ImageIconUpload,
    SearchText,
    TextBox,
    CustomButton,
    IconButton,
    CustomPrimaryButton,


    // Setups,
    // Discounts,
}

