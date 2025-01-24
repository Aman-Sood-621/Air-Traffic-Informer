import { useEffect } from 'react';
import './FlightPanel.css';

/**
 * Pagination component that handles dividing items into pages.
 * Allows navigation through pages using "Previous" and "Next" buttons.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.items - Array of items to paginate.
 * @param {number} props.itemsPerPage - Number of items to display per page.
 * @param {Function} props.onPageChange - Function to call with items of the current page.
 * @param {number} props.currentPage - The current page number.
 * @param {Function} props.setCurrentPage - Function to update the current page number.
 *
 * @returns {JSX.Element} A JSX element rendering the pagination controls.
 */
function Pagination({ items, itemsPerPage, onPageChange, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  /**
   * Updates displayed items whenever the current page or items change.
   */
  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    onPageChange(items.slice(start, end));
  }, [currentPage, items, itemsPerPage, onPageChange]);

  /**
   * Advances to the next page, if not on the last page.
   */
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  /**
   * Moves to the previous page, if not on the first page.
   */
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="pagination">
      <button className="details-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button className="details-button" 
        onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;