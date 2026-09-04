import { products } from '../data/products'
import { customers } from '../data/customers'
import { productsForCustomer } from '../core/catalog'
import { useGameStore } from '../store/gameStore'

const yen = new Intl.NumberFormat('ja-JP')

export function ProductList() {
  const index = useGameStore((s) => s.customerIndex)
  const selected = useGameStore((s) => s.selectedProductId)
  const result = useGameStore((s) => s.result)
  const selectProduct = useGameStore((s) => s.selectProduct)
  const visible = productsForCustomer(customers[index], products)

  return (
    <div className="product-list">
      {visible.map((product) => (
        <button
          key={product.id}
          className={`product-card ${selected === product.id ? 'selected' : ''}`}
          onClick={() => selectProduct(product.id)}
          disabled={Boolean(result)}
        >
          <div className="product-line"><strong>{product.name}</strong><span>¥{yen.format(product.price)}</span></div>
          <p>{product.description}</p>
        </button>
      ))}
    </div>
  )
}
