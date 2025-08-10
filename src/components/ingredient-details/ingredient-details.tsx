import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getIngredientState } from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams<{ id: string }>();
  const { ingredients, loading } = useSelector(getIngredientState);

  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  if (loading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
