import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchFilter, toggleTag, setCityFilter } from '../../store/slices/productSlice';

const ProductFilters = ({ onApplyFilters }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.products.filters);
  
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localCity, setLocalCity] = useState(filters.city);

  const sustainabilityTags = ['organic', 'handmade', 'recycled'];

  const tagIcons = {
    organic: '🌱',
    handmade: '✋',
    recycled: '♻️',
  };

  useEffect(() => {
    setLocalSearch(filters.search);
    setLocalCity(filters.city);
  }, [filters.search, filters.city]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchFilter(localSearch));
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const handleTagToggle = (tag) => {
    dispatch(toggleTag(tag));
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setLocalCity(city);
    dispatch(setCityFilter(city));
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Filter Products
      </h2>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Sustainability Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sustainability Tags
        </label>
        <div className="space-y-2">
          {sustainabilityTags.map((tag) => (
            <label
              key={tag}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition"
            >
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">
                {tagIcons[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          value={localCity}
          onChange={handleCityChange}
          placeholder="Filter by city..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Active Filters Summary */}
      {(filters.search || filters.tags.length > 0 || filters.city) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Active Filters:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Search: "{filters.search}"
              </span>
            )}
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tagIcons[tag]} {tag}
              </span>
            ))}
            {filters.city && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                City: {filters.city}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
