import { ProductReader } from './reader'
import { ProductWriter } from './writer'
import { ProductReaderAll } from './list_all'

// Port composite pour un dépôt de produits capable de lire, écrire et lister
export interface ProductsRepository extends ProductReader, ProductWriter, ProductReaderAll {}

