import { ProductSellerPriceModel } from '@/schema/productSellers.schema';

export async function getSellerLastPrice(sellerId: string, productId: string) {
  const price = await ProductSellerPriceModel.findOne({
    product: productId,
    seller: sellerId,
  })
    .sort({ createdAt: -1 })
    .limit(1);
  return price;
}
