import React from 'react';
import './Subcategory.css';

const url = 'http://127.0.0.1:8787/api/events';

const SubCategory = ({ subcategories, selectedCategory, fetchData }) => (
    <div className="subcategory-container">
        <h1 className="subcategories-title">{selectedCategory} Competitions</h1>
        <hr/>
        {
            (subcategories || []).map(sc => {
                return <div key={sc.id} onClick={() => fetchData(`${url}?category=${encodeURIComponent(selectedCategory)}&subCategory=${encodeURIComponent(sc.name)}`)} className="subcategory">{sc.name}</div>;
            })
        }
    </div>
);

export default SubCategory;
