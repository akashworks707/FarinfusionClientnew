import React from 'react';
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import ProductFilterToolbar from "@/components/public-view/common/ProductFilterToolbar";

type ProductSideModalProps = {
    openModal?: boolean;
    onChange?: (value: boolean) => void;
};

const ProductSideModal = ({ openModal, onChange }: ProductSideModalProps) => {
    return (
        <Sheet open={openModal} onOpenChange={onChange}>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <ProductFilterToolbar />
            </SheetContent>
        </Sheet>
    );
};

export default ProductSideModal;