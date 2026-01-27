// subCategoryServices.ts

// ------------------ TYPES ------------------

export interface SubCategoryProps {
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
}

export interface NewSubCategoryPayload {
  category_id: number;
  sub_category_name: string;
}

export interface NewSubCategoryResponse {
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
}

export interface EditSubCategoryPayload {
  sub_category_name: string;
}

// ------------------ FETCH SUBCATEGORIES BY CATEGORY ------------------

interface SubCategoryListResponse {
  status: boolean;
  categorySubs: SubCategoryProps[];
}

/**
 * Fetch all subcategories for a given category
 */
export async function fetchSubCategoriesByCategory(
  categoryId: number
): Promise<SubCategoryProps[] | null> {
  try {
    const res = await fetch(
      `/api/categories/categorysub/${categoryId}/`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      console.error(`Failed to fetch subcategories. Status: ${res.status}`);
      return null;
    }

    const data: SubCategoryListResponse = await res.json();
    return data.categorySubs;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return null;
  }
}

// ------------------ ADD SUBCATEGORY ------------------

/**
 * Adds a new subcategory to a category.
 * Returns the created subcategory on success, or null on failure.
 */
export async function addSubCategory(
  payload: NewSubCategoryPayload
): Promise<NewSubCategoryResponse | null> {
  try {
    const res = await fetch('/api/subcategory/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status !== 201) {
      console.error(`Failed to add subcategory. Status: ${res.status}`);
      return null;
    }

    const data: NewSubCategoryResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return null;
  }
}

// ------------------ EDIT SUBCATEGORY ------------------

/**
 * Updates the name of a subcategory
 */
export async function editSubCategory(
  subCategoryId: number,
  payload: EditSubCategoryPayload
): Promise<SubCategoryProps | null> {
  try {
    const res = await fetch(`/api/subcategory/${subCategoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(`Failed to update subcategory. Status: ${res.status}`);
      return null;
    }

    const data: SubCategoryProps = await res.json();
    return data;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return null;
  }
}

// ------------------ DELETE SUBCATEGORY ------------------

/**
 * Deletes a subcategory by ID
 */
export async function deleteSubCategory(
  subCategoryId: number
): Promise<boolean> {
  try {
    const res = await fetch(`/api/subcategory/${subCategoryId}`, {
      method: 'DELETE',
    });

    return res.status === 204;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
}
