import { useMemo } from "react";
import BaseDrawer from "../../components/ui/BaseDrawer";

export interface ProductFormValues {
  id?: string;
  name_uz: string;
  name_ru: string;
  description_uz: string;
  description_ru: string;
  price: number;
  category_id: string;
  watt: string;
  brand: string;
  model: string;
  images: File[];
  is_active?: string;
}

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: ProductFormValues | null;
  onSuccess: () => void;
}

const CategoryDrawer: React.FC<ProductDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSuccess,
}) => {
  const isEdit = useMemo(() => !!initialValues?.id, [initialValues]);
  return (
    <BaseDrawer
      open={open}
      onClose={() => {
        onClose();
        initialValues && onSuccess();
      }}
      title={isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
      width={700}
    >
      salom
    </BaseDrawer>
  );
};

export default CategoryDrawer;
