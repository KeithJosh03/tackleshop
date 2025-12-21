export interface initialUIComponent {
  descriptionUI:boolean;
  specificationsUI:boolean;
  featuresUI:boolean;
}

export type UIComponentAction = 
   { type: 'UPDATE_FIELD'; field: keyof initialUIComponent; value: boolean }

export const UIComponentReducer = (
  state: initialUIComponent,
  action: UIComponentAction
): initialUIComponent => {
  const { type, field, value } = action;

  switch (type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [field]: value,
      };
    default:
      return state;
  }
};
