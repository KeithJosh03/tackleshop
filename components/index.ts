
// layout
import Header from './layout/Header/Header';
import Footer from './layout/Footer/Footer';

import Hero from './home-page/Hero/Hero';
import Brands from './home-page/BrandsLogo/Brands';
import Collections from './home-page/ProductCollections/Collection';

import StoreServices from './home-page/StoreServices/StoreServices';


// import Setups from './setups';
// import Discounts from './sales';

import { DashboardBrandClient } from './DashboardBrandClient';
import DashBoardButtonLayoutOption from './DashBoardButtonLayoutOption';
import IconButton from '@/components/ui/IconButton';
import FacebookReviewClient from './home-page/FacebookReviews/FacebookReviewClient';

import DashboardCategoryClient from './DashboardCategoryClient';
import DashboardHeader from './DashboardHeader';
import DashboardSelectBrand from './DashboardSelectBrand';
import DashboardSelectCategory from './DashboardSelectCategory';
import DashboardSelectSubCategory from './DashboardSelectSubCategory';
import DashboardVariantsComponent from './DashboardVariantsComponent';
import ProductMedia from './ProductMedia';
import ProductContentInputs, { FieldError, FieldHint, SectionCard } from './ProductContentInputs';

import SearchText from './SearchText';
import TextBox from './TextBox';
import CustomButton from './ui/CustomButton';
import ImageIconUpload from '@/components/ui/ImageIconUpload';
import DropDownText from '@/components/ui/DropDownText';

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
    DashBoardButtonLayoutOption,
    DashboardCategoryClient,
    DashboardHeader,
    DashboardSelectBrand,
    DashboardSelectCategory,
    DashboardSelectSubCategory,
    DashboardVariantsComponent,
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


    // Setups,
    // Discounts,
}

