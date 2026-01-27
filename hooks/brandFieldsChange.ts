export interface BrandEditedProps {
  brandName: string;
  imageUrl: File | null;
}

export interface BrandOriginProps {
  brandId: number;
  brandName: string;
  imageUrl?: string | null;
}


export const getChangedFieldsBrands = ({
  original,
  updated,
}: {
  original: BrandOriginProps;
  updated: BrandEditedProps;
}): Partial<BrandEditedProps> => {
  const changes: Partial<BrandEditedProps> = {};

  // compare name
  if (
    updated.brandName?.trim() &&
    updated.brandName.trim() !== original.brandName
  ) {
    changes.brandName = updated.brandName.trim();
  }

  if (updated.imageUrl instanceof File) {
    changes.imageUrl = updated.imageUrl;
  }

  return changes;
};
