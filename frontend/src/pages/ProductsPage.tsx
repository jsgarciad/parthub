import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { productsApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState<string>('newest');
  
  // Pagination
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;
  
  // Get query params
  const queryCategory = searchParams.get('category');
  const queryBrand = searchParams.get('brand');
  const querySearch = searchParams.get('q');
  const querySort = searchParams.get('sort');
  const queryMinPrice = searchParams.get('minPrice');
  const queryMaxPrice = searchParams.get('maxPrice');
  
  useEffect(() => {
    // Set filter states from URL params
    if (queryCategory) setSelectedCategory(queryCategory);
    if (queryBrand) setSelectedBrand(queryBrand);
    if (querySort) setSortOption(querySort);
    if (queryMinPrice && queryMaxPrice) {
      setPriceRange([parseInt(queryMinPrice, 10), parseInt(queryMaxPrice, 10)]);
    }
  }, [queryCategory, queryBrand, querySort, queryMinPrice, queryMaxPrice]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Prepare query params
        const params: any = {
          page: currentPage,
          limit,
          sort: sortOption || undefined,
        };
        
        if (selectedCategory) params.category = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        if (querySearch) params.search = querySearch;
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < 1000) params.maxPrice = priceRange[1];
        
        // Fetch products
        const data = await productsApi.getAll(params);
        setProducts(data.products);
        setTotalProducts(data.total);
        setTotalPages(data.pages);
        
        // Extract unique categories and brands for filters
        const uniqueCategories = Array.from(new Set(data.products.map(p => p.category)));
        const uniqueBrands = Array.from(new Set(data.products.map(p => p.brand)));
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, selectedCategory, selectedBrand, sortOption, priceRange, querySearch]);
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    updateSearchParams({ category, page: '1' });
  };
  
  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    updateSearchParams({ brand, page: '1' });
  };
  
  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    updateSearchParams({ sort, page: '1' });
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    updateSearchParams({
      minPrice: range[0].toString(),
      maxPrice: range[1].toString(),
      page: '1'
    });
  };
  
  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const updateSearchParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSortOption('newest');
    setPriceRange([0, 1000]);
    setSearchParams(querySearch ? { q: querySearch } : {});
  };
  
  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(i);
  }
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {querySearch 
              ? `Search results for "${querySearch}"` 
              : selectedCategory 
                ? `${selectedCategory} Products` 
                : 'All Products'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {totalProducts} products found
          </p>
        </div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Filters sidebar */}
          <div className="hidden lg:block">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
            
            {/* Category filter */}
            <div className="border-b border-gray-200 py-6">
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    name="category"
                    type="radio"
                    checked={selectedCategory === null}
                    onChange={() => handleCategoryChange(null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="category-all" className="ml-3 text-sm text-gray-600">
                    All Categories
                  </label>
                </div>
                
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="radio"
                      checked={selectedCategory === category}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Brand filter */}
            <div className="border-b border-gray-200 py-6">
              <h3 className="text-sm font-medium text-gray-900">Brand</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="brand-all"
                    name="brand"
                    type="radio"
                    checked={selectedBrand === null}
                    onChange={() => handleBrandChange(null)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="brand-all" className="ml-3 text-sm text-gray-600">
                    All Brands
                  </label>
                </div>
                
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      id={`brand-${brand}`}
                      name="brand"
                      type="radio"
                      checked={selectedBrand === brand}
                      onChange={() => handleBrandChange(brand)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price range filter */}
            <div className="py-6">
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">${priceRange[0]}</span>
                  <span className="text-sm text-gray-600">${priceRange[1]}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([parseInt(e.target.value, 10), priceRange[1]])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value, 10)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            {/* Sort options */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // In a real app, this would open a mobile filter drawer
                    alert('Mobile filters would open here');
                  }}
                >
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters or search criteria.
                </p>
                <div className="mt-6">
                  <Button onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {paginationItems.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 