import type { Customer, Product } from './types.js'
import { calculateMatch } from './scoring.js'

export function productsForCustomer(customer: Customer, products: Product[]): Product[] {
  return products.filter((product) => product.category === customer.category)
}

export function rankProducts(customer: Customer, products: Product[]): Array<{ product: Product; score: number }> {
  return productsForCustomer(customer, products)
    .map((product) => ({ product, score: calculateMatch(customer, product).finalScore }))
    .sort((a, b) => b.score - a.score)
}

export function bestProductForCustomer(customer: Customer, products: Product[]): Product {
  const top = rankProducts(customer, products)[0]
  if (!top) throw new Error(`No product found for category: ${customer.category}`)
  return top.product
}
