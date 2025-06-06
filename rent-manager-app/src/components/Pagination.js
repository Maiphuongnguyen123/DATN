import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="row">
            <div className="col-sm-12 col-md-5">
                <div className="dataTables_info" role="status" aria-live="polite">
                    Hiển thị {currentPage * itemsPerPage + 1} đến {Math.min((currentPage + 1) * itemsPerPage, totalItems)} của {totalItems} phòng
                </div>
            </div>
            <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                        <li className={`paginate_button page-item previous ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                Trước
                            </button>
                        </li>
                        {pageNumbers.map(number => (
                            <li key={number} className={`paginate_button page-item ${currentPage === number - 1 ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => paginate(number - 1)}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li className={`paginate_button page-item next ${currentPage === Math.ceil(totalItems / itemsPerPage) - 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(totalItems / itemsPerPage) - 1}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Pagination; 